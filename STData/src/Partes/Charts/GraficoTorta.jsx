import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './GraficoTorta.css';

export default function GraficoTorta({ data }) {
  return (
    <div className="grafico-torta">
      <h3>Porcentaje de los grupos</h3>
      {data.length === 0 ? (
        <p>No hay datos disponibles</p>
      ) : (
        <PieChart width={350} height={280}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label={(entry) => `${entry.percentage || 100}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => [`${value}%`, '']} 
          />
          <Legend />
        </PieChart>
      )}
    </div>
  );
}
