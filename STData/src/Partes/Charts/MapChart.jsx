import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import provinciasCoords from '../../Data/provinciasCoords.js';
import 'leaflet/dist/leaflet.css';

function MapChart({ puntos }) {
  return (
    <MapContainer center={[-38, -63]} zoom={4} className="mapa-leaflet">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {puntos.map((p, i) => {
        const base = provinciasCoords[p.PROVINCIA.trim()];
        if (!base) return null;

        return (
          <CircleMarker
            key={i}
            center={base}
            radius={3 + Math.sqrt(p.count) * 0.5} // círculos más chicos
            pathOptions={{ color: p.color, fillColor: p.color, fillOpacity: 0.6 }}
          >
            <Tooltip direction="top" offset={[0, -2]}>
              {p.count} personas
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

export default MapChart;
