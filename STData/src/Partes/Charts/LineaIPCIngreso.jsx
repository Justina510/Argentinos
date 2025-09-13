import { useState, useEffect } from "react";
import Papa from "papaparse";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./LineaIPCIngreso.css";

export default function LineaIPC({ yearStart, yearEnd }) {
  const [data, setData] = useState([]);
  const [yearTicks, setYearTicks] = useState([]);

  useEffect(() => {
    fetch("/BasesLimpias/serie_ipc_divisiones.csv")
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, delimiter: ";" }).data;

        const ipcData = parsed
          .filter(d => d.Descripcion === "NIVEL GENERAL" && d.Region === "Nacional")
          .map(d => {
            const year = parseInt(d.Periodo.slice(0, 4));
            const ipc = parseFloat(d.Indice_IPC.replace(",", "."));
            return { period: d.Periodo, year, ipc };
          })
          .filter(d => !isNaN(d.ipc) && d.ipc > 0 && d.year >= yearStart && d.year <= yearEnd);

        setData(ipcData);

        const ticks = [...new Set(ipcData.map(d => d.period.slice(0,4)))];
        setYearTicks(ticks);
      });
  }, [yearStart, yearEnd]);

  return (
    <div className="line-chart-container">
      <h3 className="chart-title">Evolución del IPC (Nivel General, Nacional)</h3>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
          <XAxis 
            dataKey="period"
            ticks={yearTicks.map(y => y + "01")}
            tickFormatter={(tick) => tick.slice(0,4)} 
          />
          <YAxis tickFormatter={val => val + "%"} />
          <Tooltip 
            formatter={val => val + "%"} 
            labelFormatter={label => "Periodo: " + label.slice(0,4) + "/" + label.slice(4,6)} 
          />
          <Legend />
          <Line type="monotone" dataKey="ipc" stroke="#79c0dc" name="IPC (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
