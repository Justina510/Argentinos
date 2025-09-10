import { useState } from 'react';
import MapChart from '../Charts/MapChart';
import './MapaEmpleo.css';

function MapaEmpleo() {
  const [año, setAño] = useState(2019);
  const [provincia, setProvincia] = useState('Santa Fe');
  const [estado, setEstado] = useState([]);
  const [tipo, setTipo] = useState([]);
  const [genero, setGenero] = useState([]);

  function toggleSeleccion(valor, grupo, setGrupo) {
    if (grupo.includes(valor)) {
      setGrupo(grupo.filter(v => v !== valor));
    } else {
      setGrupo([...grupo, valor]);
    }
  }

  return (
    <div className="mapa-empleo">
      <div className="contenedor-titulo">
        <h1>
          Mapa <em>de</em> Empleo Argentino
        </h1>
      </div>

      <div className="layout-3columnas">
        {/* Columna 1: Año + gráfico + texto */}
        <div className="columna-izquierda">
          <div className="bloque-select-simple">
            <label htmlFor="año">Año</label>
            <select
              id="año"
              value={año}
              onChange={e => setAño(Number(e.target.value))}
            >
              {[2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023].map(y => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="grafico-circular">
            <p>Porcentaje de los grupos</p>
            <p>(Gráfico circular va acá)</p>
          </div>

          <div className="texto-explicativo">
            <p>
              El mercado laboral mostraba cierta estabilidad en los niveles de
              empleo, aunque con una fuerte presencia del trabajo informal. Los
              ocupados eran mayoría, pero gran parte no contaba con aportes ni
              obra social, lo que reflejaba la fragilidad estructural del
              sistema. Los hombres dominaban los puestos registrados, mientras
              que muchas mujeres se encontraban en empleos de servicios o
              domésticos, en su mayoría sin aportes. El desempleo se mantenía en
              niveles moderados, aunque más alto entre jóvenes y mujeres.
            </p>
          </div>
        </div>

        {/* Columna 2: Provincia + filtros */}
        <div className="columna-centro">
          <div className="bloque-select-simple">
            <label htmlFor="provincia">Provincia</label>
            <select
              id="provincia"
              value={provincia}
              onChange={e => setProvincia(e.target.value)}
            >
              <option>Santa Fe</option>
              <option>Buenos Aires</option>
              <option>Córdoba</option>
              <option>Mendoza</option>
            </select>
          </div>

          <div className="grupo-filtro">
            <p className="titulo-filtro">Estado laboral</p>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={estado.includes('Ocupado')}
                  onChange={() => toggleSeleccion('Ocupado', estado, setEstado)}
                />
                Ocupados
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={estado.includes('Desocupado')}
                  onChange={() =>
                    toggleSeleccion('Desocupado', estado, setEstado)
                  }
                />
                Desocupados
              </label>
            </div>
          </div>

          <div className="grupo-filtro">
            <p className="titulo-filtro">Tipo de empleo</p>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={tipo.includes('Formal')}
                  onChange={() => toggleSeleccion('Formal', tipo, setTipo)}
                />
                Formal
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={tipo.includes('Informal')}
                  onChange={() => toggleSeleccion('Informal', tipo, setTipo)}
                />
                Informal
              </label>
            </div>
          </div>

          <div className="grupo-filtro">
            <p className="titulo-filtro">Género</p>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={genero.includes('Masculino')}
                  onChange={() =>
                    toggleSeleccion('Masculino', genero, setGenero)
                  }
                />
                Masculinos
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={genero.includes('Femenino')}
                  onChange={() =>
                    toggleSeleccion('Femenino', genero, setGenero)
                  }
                />
                Femeninos
              </label>
            </div>
          </div>
        </div>

        {/* Columna 3: Mapa */}
        <div className="columna-derecha">
          <MapChart />
        </div>
      </div>
    </div>
  );
}

export default MapaEmpleo;
