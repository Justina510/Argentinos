// LineaSMVM.jsx
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./LineaSMVM.css";

export default function LineaSMVM({ yearStart, yearEnd }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/BasesLimpias/smvm.csv")
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsed = results.data
              .map((row) => {
                const year = Number(row.año?.trim());
                const smvm = Number(row.smvm?.replace(",", "").trim());
                if (!year || isNaN(smvm)) return null;
                return { year, smvm };
              })
              .filter(Boolean)
              .filter((row) => row.year >= yearStart && row.year <= yearEnd);

            // Agrupar por año (promedio si hay varios meses)
            const grouped = Object.values(
              parsed.reduce((acc, cur) => {
                if (!acc[cur.year]) acc[cur.year] = { year: cur.year, smvm: cur.smvm, count: 1 };
                else {
                  acc[cur.year].smvm += cur.smvm;
                  acc[cur.year].count += 1;
                }
                return acc;
              }, {})
            ).map((item) => ({
              year: item.year,
              smvm: Math.round(item.smvm / item.count),
            }));

            setData(grouped);
          },
        });
      });
  }, [yearStart, yearEnd]);

  return (
    <div style={{ width: "60%", height: 450, marginLeft:"-200px"}}>
      <h3 style={{ textAlign: "center", marginBottom: "10px", marginTop:"60px"}}>
        Evolución del Salario Mínimo Vital y Móvil ($)
      </h3>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 30, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" interval={0} />
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Line
            type="monotone"
            dataKey="smvm"
            stroke="#ff8d66"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
