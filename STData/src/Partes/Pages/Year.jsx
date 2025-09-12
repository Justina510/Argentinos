import { useState, useEffect } from "react";
import TreemapRecharts from "../Charts/TreemapRecharts";
import "./Year.css";

export default function Year() {
  const [año, setAño] = useState(2016);
  const [treemapData, setTreemapData] = useState([]);

  useEffect(() => {
    fetch("/BasesLimpias/eph_full.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const lines = csvText.split("\n");
        const headers = lines[0].split(",");
        const rows = lines.slice(1);

        // Inicializamos contadores por grupo
        const groups = {
          "18-29": { Formal: 0, Informal: 0, Desocupado: 0 },
          "30-39": { Formal: 0, Informal: 0, Desocupado: 0 },
          "40-49": { Formal: 0, Informal: 0, Desocupado: 0 },
          "50-70": { Formal: 0, Informal: 0, Desocupado: 0 },
        };

        rows.forEach((row) => {
          if (!row) return;
          const cells = row.split(",");
          const data = {};
          headers.forEach((h, i) => {
            data[h] = cells[i];
          });

          if (Number(data.year) !== año) return; // filtramos por año

          const edad = Number(data.CH06);
          let grupo = "";
          if (edad >= 18 && edad <= 29) grupo = "18-29";
          else if (edad >= 30 && edad <= 39) grupo = "30-39";
          else if (edad >= 40 && edad <= 49) grupo = "40-49";
          else if (edad >= 50 && edad <= 70) grupo = "50-70";
          else return; // fuera de rango

          const pondera = Number(data.PONDERA) || 1;

          if (data.ESTADO === "Desocupado") {
            groups[grupo].Desocupado += pondera;
          } else if (data.ESTADO === "Ocupado") {
            const tipo = Number(data.PP07G4);
            if (tipo === 1) groups[grupo].Formal += pondera;
            else if (tipo === 2) groups[grupo].Informal += pondera;
          }
        });

        // Convertimos a formato treemap
        const treemap = Object.keys(groups).map((g) => ({
          name: g,
          children: [
            { name: "Formal", size: groups[g].Formal },
            { name: "Informal", size: groups[g].Informal },
            { name: "Desocupado", size: groups[g].Desocupado },
          ],
        }));

        setTreemapData(treemap);
      });
  }, [año]);

  return (
    <div className="year-page">
      <div className="year-layout">
        <div className="year-left">
          <div className="slider-container">
            <label>
              Año: <span className="anio">{año}</span>
            </label>
            <div className="slider-bg">
              <input
                type="range"
                min="2016"
                max="2025"
                value={año}
                onChange={(e) => setAño(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="texto-left">
            <p>
              La participación laboral en Argentina varía según edad y género. Los jóvenes suelen estar inactivos por estudios, los adultos concentran la mayor parte del empleo, y los mayores tienden a retirarse o quedar inactivos por edad o salud. Las mujeres presentan mayores niveles de inactividad, muchas veces por tareas de cuidado o trabajo doméstico no remunerado.
            </p>
            <p>
              Una persona se considera inactiva por razones como estudio, jubilación, discapacidad, tareas del hogar o condiciones de salud. Aunque este grupo es clave para entender la estructura social, no fue incluido en los cálculos de los índices laborales que se muestran en esta sección. Los porcentajes se construyeron únicamente sobre la base de personas ocupadas y desocupadas.
            </p>
          </div>

          <TreemapRecharts data={treemapData} title="Distribución laboral por grupo etario" />
        </div>

        <div className="year-right">
          <div className="texto-right">
            <p>
              Según datos relevados por la ENFR en 2018, el 69% de los argentinos manifiestan sentirse estresados o emocionalmente afectados por su situación laboral. El pictograma que acompaña esta sección desglosa ese malestar en tres categorías:
            </p>
            <ul>
              <li>40% de los encuestados reportan síntomas de estrés laboral</li>
              <li>25% mencionan ansiedad relacionada con la incertidumbre económica</li>
              <li>35% expresan agotamiento físico o mental vinculado a la sobrecarga de tareas</li>
            </ul>
            <p>
              Estos datos revelan que el trabajo —o su ausencia— no solo impacta en lo económico, sino también en la salud emocional de las personas. Visibilizar estas dimensiones es clave para entender el mercado laboral en su totalidad y pensar políticas que contemplen el bienestar integral de quienes lo habitan.
            </p>
            <p>
              Se puede observar cómo se distribuye el empleo según los rangos de edad, hasta qué momento permanecen activos varones y mujeres, y cuántas personas están ocupadas, desocupadas o inactivas en cada grupo. Las diferencias por género se acentúan con la edad, revelando desigualdades en relación al trabajo, responsabilidades familiares, oportunidades formales y estabilidad económica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
