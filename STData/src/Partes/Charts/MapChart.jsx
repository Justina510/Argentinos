import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import provinciasCoords from '../../Data/provinciasCoords.js';
import 'leaflet/dist/leaflet.css';

function MapChart({ puntos }) {
  if (!puntos || puntos.length === 0) return null;

  // Calculamos el count máximo para normalizar radios
  const maxCount = Math.max(...puntos.map(p => p.count));
  const minRadius = 5;   // radio mínimo en píxeles
  const maxRadius = 40;  // radio máximo en píxeles

  return (
    <MapContainer center={[-38, -63]} zoom={4} className="mapa-leaflet">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {puntos.map((p, i) => {
        const base = provinciasCoords[p.PROVINCIA.trim()];
        if (!base) return null;

        // Escalamos el radio según pondera
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
