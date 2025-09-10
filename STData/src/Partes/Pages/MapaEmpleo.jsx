import { useState, useEffect } from 'react';
import MapChart from '../Charts/MapChart';
import provinciasCoords from '../../Data/provinciasCoords.js';
import Papa from 'papaparse';
import './MapaEmpleo.css';

// Mapeo aglomerados -> provincias
const aglomeradoAProvincia = {
  "Gran La Plata": "Buenos Aires",
  "Bahía Blanca-Cerri": "Buenos Aires",
  "Gran Rosario": "Santa Fe",
  "Gran Santa Fe": "Santa Fe",
  "Gran Paraná": "Entre Ríos",
  "Posadas": "Misiones",
  "Gran Resistencia": "Chaco",
  "Comodoro Rivadavia-Rada Tilly": "Chubut",
  "Gran Mendoza": "Mendoza",
  "Corrientes": "Corrientes",
  "Gran Córdoba": "Córdoba",
  "Concordia": "Entre Ríos",
  "Formosa": "Formosa",
  "Neuquén-Plottier": "Neuquén",
  "Santiago del Estero-La Banda": "Santiago del Estero",
  "Jujuy-Palpalá": "Jujuy",
  "Río Gallegos": "Santa Cruz",
  "Gran Catamarca": "Catamarca",
  "Gran Salta": "Salta",
  "La Rioja": "La Rioja",
  "Gran San Luis": "San Luis",
  "Gran San Juan": "San Juan",
  "Gran Tucumán-Tafí Viejo": "Tucumán",
  "Santa Rosa-Toay": "La Pampa",
  "Ushuaia-Río Grande": "Tierra del Fuego",
  "Ciudad Autónoma de Buenos Aires": "Buenos Aires",
  "Partidos del GBA": "Buenos Aires",
  "Mar del Plata": "Buenos Aires",
  "Río Cuarto": "Córdoba",
  "San Nicolás-Villa Constitución": "Buenos Aires",
  "Rawson-Trelew": "Chubut",
  "Viedma-Carmen de Patagones": "Río Negro",
  "Resto Buenos Aires": "Buenos Aires",
  "Resto Catamarca": "Catamarca",
  "Resto Córdoba": "Córdoba",
  "Resto Corrientes": "Corrientes",
  "Resto Chaco": "Chaco",
  "Resto Chubut": "Chubut",
  "Resto Entre Ríos": "Entre Ríos",
  "Resto Formosa": "Formosa",
  "Resto Jujuy": "Jujuy",
  "Resto La Pampa": "La Pampa",
  "Resto La Rioja": "La Rioja",
  "Resto Mendoza": "Mendoza",
  "Resto Misiones": "Misiones",
  "Resto Neuquén": "Neuquén",
  "Resto Río Negro": "Río Negro",
  "Resto Salta": "Salta",
  "Resto San Juan": "San Juan",
  "Resto San Luis": "San Luis",
  "Resto Santa Cruz": "Santa Cruz",
  "Resto Santa Fe": "Santa Fe",
  "Resto Santiago del Estero": "Santiago del Estero",
  "Resto Tucumán": "Tucumán"
};

export default function MapaEmpleo() {
  const [año, setAño] = useState(2016);
  const [estado, setEstado] = useState([]);
  const [tipo, setTipo] = useState([]);
  const [genero, setGenero] = useState([]);
  const [grupoActivo, setGrupoActivo] = useState(null); // 'estado' | 'tipo' | 'genero' | null
  const [puntos, setPuntos] = useState([]);

  function toggleSeleccion(valor, grupo, setGrupo, nombreGrupo) {
    if (!grupoActivo) {
      // No había grupo activo → activo este
      setGrupoActivo(nombreGrupo);
      setGrupo([valor]);
      return;
    }

    if (grupoActivo === nombreGrupo) {
      // Ya estoy en el mismo grupo → toggle normal
      if (grupo.includes(valor)) {
        setGrupo(grupo.filter(v => v !== valor));
        if (grupo.length === 1) setGrupoActivo(null);
      } else {
        setGrupo([...grupo, valor]);
      }
    } else {
      // Cambio de grupo → limpio los demás y activo este
      setEstado([]);
      setTipo([]);
      setGenero([]);

      setGrupo([valor]);
      setGrupoActivo(nombreGrupo);
    }
  }

  useEffect(() => {
    Papa.parse('/BasesLimpias/eph_full.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const datosFiltrados = result.data
          .map(d => {
            const añoCSV = parseInt(String(d.year).trim(), 10);
            if (isNaN(añoCSV) || añoCSV !== año) return null;

            let prov = d.PROVINCIA?.trim();
            if (!prov || prov === "") {
              const aglo = d['﻿AGLOMERADO']?.trim();
              prov = aglomeradoAProvincia[aglo] || null;
            }
            if (!prov) return null;

            const estadoVal = d.ESTADO?.trim() || null;

            const rawVal = Number(String(d.PP07G4).trim());
            let tipoVal = null;
            if (!isNaN(rawVal)) {
              if (Math.round(rawVal) === 1) tipoVal = 'Formal';
              else if (Math.round(rawVal) === 2) tipoVal = 'Informal';
            }

            const generoVal = d.CH04?.trim() === 'Mujer' ? 'Femenino' : 'Masculino';

            return { prov, estadoVal, tipoVal, generoVal };
          })
          .filter(d => d !== null);

        const puntosMap = [];

        const grupos = [
          { data: estado, key: 'estadoVal', colors: { 'Ocupado': '#00BFFF', 'Desocupado': '#FFD700' } },
          { data: tipo, key: 'tipoVal', colors: { 'Formal': '#00BFFF', 'Informal': '#FFD700' } },
          { data: genero, key: 'generoVal', colors: { 'Masculino': '#00BFFF', 'Femenino': '#FFD700' } }
        ];

        grupos.forEach(g => {
          if (g.data.length === 0) return;
          g.data.forEach(valorGrupo => {
            const filtered = datosFiltrados.filter(d => d[g.key] === valorGrupo);
            const countsByProv = {};
            filtered.forEach(d => {
              countsByProv[d.prov] = (countsByProv[d.prov] || 0) + 1;
            });
            Object.entries(countsByProv).forEach(([prov, count]) => {
              puntosMap.push({
                PROVINCIA: prov,
                count,
                color: g.colors[valorGrupo] || '#00BFFF'
              });
            });
          });
        });

        setPuntos(puntosMap);
      }
    });
  }, [año, estado, tipo, genero]);

  return (
    <div className="mapa-empleo">
      <div className="contenedor-titulo">
        <h1>Mapa <em>de</em> Empleo Argentino</h1>
      </div>

      <div className="layout-3columnas">
        {/* Columna izquierda */}
        <div className="columna-izquierda">
          <div className="bloque-select-simple">
            <label htmlFor="año">Año</label>
            <select id="año" value={año} onChange={e => setAño(Number(e.target.value))}>
              {[2016,2017,2018,2019,2020,2021,2022,2023,2024,2025].map(y => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Columna centro */}
        <div className="columna-centro">
          <div className="grupo-filtro">
            <p className="titulo-filtro">Estado laboral</p>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" checked={estado.includes('Ocupado')} onChange={() => toggleSeleccion('Ocupado', estado, setEstado, 'estado')}/>
                Ocupados
              </label>
              <label>
                <input type="checkbox" checked={estado.includes('Desocupado')} onChange={() => toggleSeleccion('Desocupado', estado, setEstado, 'estado')}/>
                Desocupados
              </label>
            </div>
          </div>

          <div className="grupo-filtro">
            <p className="titulo-filtro">Tipo de empleo</p>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" checked={tipo.includes('Formal')} onChange={() => toggleSeleccion('Formal', tipo, setTipo, 'tipo')}/>
                Formal
              </label>
              <label>
                <input type="checkbox" checked={tipo.includes('Informal')} onChange={() => toggleSeleccion('Informal', tipo, setTipo, 'tipo')}/>
                Informal
              </label>
            </div>
          </div>

          <div className="grupo-filtro">
            <p className="titulo-filtro">Género</p>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" checked={genero.includes('Masculino')} onChange={() => toggleSeleccion('Masculino', genero, setGenero, 'genero')}/>
                Masculino
              </label>
              <label>
                <input type="checkbox" checked={genero.includes('Femenino')} onChange={() => toggleSeleccion('Femenino', genero, setGenero, 'genero')}/>
                Femenino
              </label>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="columna-derecha">
          <MapChart puntos={puntos} />
        </div>
      </div>
    </div>
  );
}
