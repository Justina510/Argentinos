import { useState } from "react";
import "./Periodo.css";

export default function Periodo() {
  const [yearStart, setYearStart] = useState(2016);
  const [yearEnd, setYearEnd] = useState(2025);

  const handleStartChange = (e) => {
    const value = Number(e.target.value);
    if (value < yearEnd) setYearStart(value); // no se superponen
  };

  const handleEndChange = (e) => {
    const value = Number(e.target.value);
    if (value > yearStart) setYearEnd(value); // no se superponen
  };

  return (
    <div className="periodo-page">
      <h2 className="periodo-title">PERIODO</h2>

      <div className="periodo-layout">
        {/* Izquierda: slider */}
        <div className="periodo-left">
          <div className="periodo-slider-container">
            {/* Línea visual única */}
            <div className="slider-line"></div>

            {/* Slider izquierdo */}
            <input
              type="range"
              min="2016"
              max="2025"
              value={yearStart}
              onChange={handleStartChange}
              className="slider-periodo start"
            />
            <div
              className="year-label start"
              style={{ left: `${((yearStart - 2016) / 9) * 100}%` }}
            >
              {yearStart}
            </div>

            {/* Slider derecho */}
            <input
              type="range"
              min="2016"
              max="2025"
              value={yearEnd}
              onChange={handleEndChange}
              className="slider-periodo end"
            />
            <div
              className="year-label end"
              style={{ left: `${((yearEnd - 2016) / 9) * 100}%` }}
            >
              {yearEnd}
            </div>
          </div>

          {/* Texto explicativo debajo del slider */}
          <div className="texto-iz">
            <p>
              La inflación en Argentina, medida por el Índice de Precios al Consumidor (IPC),
              representa el aumento sostenido de los precios de bienes y servicios esenciales
              como alimentos, transporte, salud y vivienda. Este indicador permite entender
              cómo varía el costo de vida mes a mes, y cómo esa variación impacta directamente
              en el poder adquisitivo de las personas. En contextos de alta inflación, los ingresos
              pierden valor rápidamente, generando tensiones económicas en todos los sectores sociales.
            </p>
          </div>
        </div>

        {/* Derecha: texto adicional */}
        <div className="periodo-right">
          <div className="texto-der">
            <p>
              Los trabajadores formales, que cuentan con aportes jubilatorios y obra social,
              entre otros beneficios, tienen cierto nivel de protección frente a la pérdida
              de poder adquisitivo. En cambio, los trabajadores informales, que no tienen
              acceso a esos derechos ni estabilidad, ven sus ingresos más expuestos y desprotegidos.
              La informalidad laboral afecta a una parte significativa de la población ocupada,
              convirtiéndose en un factor de vulnerabilidad frente a la inflación.
            </p>
            <p>
              Para las personas desocupadas, el impacto es aún más severo. Sin ingresos fijos ni
              redes de contención, cada aumento de precios representa una barrera más para acceder
              a bienes básicos y servicios esenciales. Incluso quienes logran insertarse en el mercado
              laboral muchas veces lo hacen en condiciones informales, perpetuando un ciclo de precariedad.
            </p>
            <p>A su vez, la inflación influye directamente en la estructura del empleo. Muchas empresas, especialmente las pequeñas y medianas, enfrentan dificultades para sostener sus costos operativos, lo que las lleva a reducir personal, informalizar vínculos laborales o frenar nuevas contrataciones. Esta situación debilita la calidad del empleo disponible y limita las oportunidades de inserción laboral formal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
