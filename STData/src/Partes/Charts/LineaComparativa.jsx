import { useState, useEffect } from "react";
import Papa from "papaparse";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function LineaComparativa({ yearStart, yearEnd }) {
  const [data, setData] = useState([]);
  const [yearTicks, setYearTicks] = useState([]);

  useEffect(() => {
    const fetchIPC = fetch("/BasesLimpias/serie_ipc_divisiones.csv")
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, delimiter: ";" }).data;
        const ipcData = parsed
          .filter(d => d.Descripcion === "NIVEL GENERAL" && d.Region === "Nacional")
          .map(d => {
            const year = parseInt(d.Periodo.slice(0, 4));
            const ipc = parseFloat(d.Indice_IPC.replace(",", "."));
            return { year, ipc };
          })
          .filter(d => !isNaN(d.ipc) && d.ipc > 0 && d.year >= yearStart && d.year <= yearEnd);

        const minYear = Math.min(...ipcData.map(d => d.year));
        const baseIPC = ipcData.find(d => d.year === minYear)?.ipc || 100;
        const ipcNormalized = ipcData.map(d => ({ year: d.year, ipc: (d.ipc / baseIPC) * 100 }));

        return ipcNormalized;
      });

    const fetchEPH = fetch("/BasesLimpias/eph_full.csv")
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, delimiter: "," }).data;
        const ephData = parsed.filter(d => {
          return ["Ocupado", "Desocupado"].includes(d.ESTADO) &&
                 d.year >= yearStart && d.year <= yearEnd;
        });

        const grouped = {};
        ephData.forEach(d => {
          const y = d.year;
          if (!grouped[y]) grouped[y] = { ocup: 0, desocup: 0 };
          if (d.ESTADO === "Ocupado") grouped[y].ocup += 1;
          if (d.ESTADO === "Desocupado") grouped[y].desocup += 1;
        });

        const ephPercent = Object.keys(grouped).map(y => {
          const total = grouped[y].ocup + grouped[y].desocup;
          return {
            year: parseInt(y),
            ocup: (grouped[y].ocup / total) * 100,
            desocup: (grouped[y].desocup / total) * 100
          };
        });

        return ephPercent;
      });

    Promise.all([fetchIPC, fetchEPH]).then(([ipc, eph]) => {
      const merged = eph.map(d => {
        const ipcEntry = ipc.find(i => i.year === d.year);
        return { year: d.year, ocup: d.ocup, desocup: d.desocup, ipc: ipcEntry ? ipcEntry.ipc : null };
      }).filter(d => d.ipc !== null);

      setData(merged);
      setYearTicks(merged.map(d => d.year));
    });

  }, [yearStart, yearEnd]);

  return (
    <div style={{ width: "100%", height: 450, marginTop: "40px"}}>
      <h3>Evolución comparativa: IPC vs Ocupados/Desocupados</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
          <XAxis dataKey="year" ticks={yearTicks} />
          <YAxis yAxisId="left" tickFormatter={val => val + "%"} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={val => val.toFixed(0)} />
          <Tooltip 
            formatter={(val, name) => name === "ipc" ? val.toFixed(1) + "%" : val.toFixed(1) + "%"} 
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="ocup" stroke="#6ce5e8" name="Ocupados (%)" />
          <Line yAxisId="left" type="monotone" dataKey="desocup" stroke="#ff8d66" name="Desocupados (%)" />
          <Line yAxisId="right" type="monotone" dataKey="ipc" stroke="#2273f3" name="IPC (base 100%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
