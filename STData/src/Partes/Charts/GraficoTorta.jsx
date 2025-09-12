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
        <PieChart width={450} height={370}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={130}
            label={(entry) => `${entry.percentage || 100}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
  formatter={(value, name, props) => [`${Number(value).toLocaleString('es-AR')}`, 'Personas']} 
/>

          <Legend />
        </PieChart>
      )}
    </div>
  );
}
