import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import provinciasCoords from '../../Data/provinciasCoords.js';
import 'leaflet/dist/leaflet.css';

function MapChart({ puntos }) {
  // Si no hay puntos, mostramos el mapa sin círculos
  const hasData = puntos && puntos.length > 0;

  // Evitamos errores si no hay datos
  const maxCount = hasData ? Math.max(...puntos.map(p => p.count)) : 1;
  const minRadius = 5;   // radio mínimo en píxeles
  const maxRadius = 40;  // radio máximo en píxeles

  return (
    <MapContainer center={[-38, -63]} zoom={4} className="mapa-leaflet">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      
      {hasData &&
        puntos.map((p, i) => {
          const base = provinciasCoords[p.PROVINCIA.trim()];
          if (!base) return null;

          const radius = minRadius + (p.count / maxCount) * (maxRadius - minRadius);

          return (
            <CircleMarker
              key={i}
              center={base}
              radius={radius}
              pathOptions={{ color: p.color, fillColor: p.color, fillOpacity: 0.6 }}
            >
              <Tooltip direction="top" offset={[0, -2]}>
                {p.count.toLocaleString()} personas
              </Tooltip>
            </CircleMarker>
          );
        })}
    </MapContainer>
  );
}

export default MapChart;
