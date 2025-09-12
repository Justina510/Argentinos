import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

// Leyenda personalizada
const CustomLegend = ({ payload }) => {
  // Orden deseado
  const order = [
    "Ocupados Mujer",
    "Ocupados Varón",
    "Desocupados Mujer",
    "Desocupados Varón",
    "Inactivos Mujer",
    "Inactivos Varón",
  ];

  const items = order
    .map((key) => payload.find((p) => p.value === key))
    .filter(Boolean);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {items.map((entry, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft:"10px"}}>
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: entry.color,
            }}
          ></div>
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function BarChartSegmented({ data }) {
  // Grupos de edad
  const gruposEdad = [
    { min: 18, max: 29, name: "18-29" },
    { min: 30, max: 39, name: "30-39" },
    { min: 40, max: 49, name: "40-49" },
    { min: 50, max: 70, name: "50-70" },
  ];

  // Procesamos datos
  const chartData = gruposEdad.map((g) => {
    const filasGrupo = data.filter((d) => {
      const edad = Number(d.CH06);
      return edad >= g.min && edad <= g.max;
    });

    const varonOcupado = filasGrupo
      .filter((d) => d.CH04 === "Varón" && d.ESTADO === "Ocupado")
      .reduce((sum, d) => sum + Number(d.PONDERA || 0), 0);
    const varonDesocupado = filasGrupo
      .filter((d) => d.CH04 === "Varón" && d.ESTADO === "Desocupado")
      .reduce((sum, d) => sum + Number(d.PONDERA || 0), 0);
    const varonInactivo = filasGrupo
      .filter((d) => d.CH04 === "Varón" && d.ESTADO === "Inactivo")
      .reduce((sum, d) => sum + Number(d.PONDERA || 0), 0);

    const mujerOcupado = filasGrupo
      .filter((d) => d.CH04 === "Mujer" && d.ESTADO === "Ocupado")
      .reduce((sum, d) => sum + Number(d.PONDERA || 0), 0);
    const mujerDesocupado = filasGrupo
      .filter((d) => d.CH04 === "Mujer" && d.ESTADO === "Desocupado")
      .reduce((sum, d) => sum + Number(d.PONDERA || 0), 0);
    const mujerInactivo = filasGrupo
      .filter((d) => d.CH04 === "Mujer" && d.ESTADO === "Inactivo")
      .reduce((sum, d) => sum + Number(d.PONDERA || 0), 0);

    const total =
      varonOcupado +
      varonDesocupado +
      varonInactivo +
      mujerOcupado +
      mujerDesocupado +
      mujerInactivo;

    return {
      grupo: g.name,
      "Ocupados Varón": total ? (varonOcupado / total) * 100 : 0,
      "Desocupados Varón": total ? (varonDesocupado / total) * 100 : 0,
      "Inactivos Varón": total ? (varonInactivo / total) * 100 : 0,
      "Ocupados Mujer": total ? (mujerOcupado / total) * 100 : 0,
      "Desocupados Mujer": total ? (mujerDesocupado / total) * 100 : 0,
      "Inactivos Mujer": total ? (mujerInactivo / total) * 100 : 0,
    };
  });

  return (
    <div style={{ width: "100%", height: 450 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 20, bottom: 20, left: 50 }}
        >
          <XAxis type="number" domain={[0, 60]} unit="%" />
          <YAxis type="category" dataKey="grupo" width={50} dx={-10} />
          <Tooltip formatter={(value) => value.toFixed(1) + "%"} />
          <Legend content={<CustomLegend />} />
          {/* Varones */}
          <Bar dataKey="Ocupados Varón" stackId="varon" fill="#f7d25d" />
          <Bar dataKey="Desocupados Varón" stackId="varon" fill="#fffd59" />
          <Bar dataKey="Inactivos Varón" stackId="varon" fill="#ff8d66" />
          {/* Mujeres */}
          <Bar dataKey="Ocupados Mujer" stackId="mujer" fill="#79c0dc" />
          <Bar dataKey="Desocupados Mujer" stackId="mujer" fill="#65a6fa" />
          <Bar dataKey="Inactivos Mujer" stackId="mujer" fill="#2273f3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
