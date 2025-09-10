// src/Partes/Pages/intro.jsx
import React from 'react';
import './Intro.css';

function Intro() {
  return (
    <section className="intro">
      <p className="autor">Justina Quiroga Baquela</p>

      <div className="intro-titulos">
        <h1>MERCADO LABORAL E INFLACIÓN</h1>
        <h2>Reflejado en los Argentinos</h2>
      </div>

      <div className="intro-contenido">
        <img 
          src="/Imagenes/Argentinos.png" 
          alt="Imagen de argentinos" 
          className="imagen-principal"
        />
        <div className="intro-texto">
          <p>
            En este trabajo se analiza el período comprendido entre 2016 y 2025, marcado
            por irregularidades profundas en el mercado laboral argentino y una inflación
            persistente que atraviesa la vida cotidiana. A través de datos provenientes
            del EPH y del IPC (INDEC), exploraremos el empleo y el desempleo, la formalidad
            o su ausencia, y cómo estos fenómenos se proyectan sobre la población. También
            nos detendremos en un aspecto muchas veces invisibilizado: el impacto de la
            economía en la salud mental de las personas.
          </p>
          <img src="/Imagenes/Flecha.webp" alt="Flecha decorativa" className="flecha" />
        </div>
      </div>

      <img src="/Imagenes/Grafico1.webp" alt="Gráfico circular" className="grafico" />
    </section>
  );
}

export default Intro;
