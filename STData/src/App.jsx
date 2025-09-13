import './App.css';
import Intro from './Partes/Pages/intro';
import MapaEmpleo from './Partes/Pages/MapaEmpleo.jsx';
import Year from './Partes/Pages/Year.jsx'
import Periodo from './Partes/Pages/Periodo.jsx'
import Fin from './Partes/Pages/Fin.jsx'

function App() {
  return (
    <div className="App">
      <Intro />
      <MapaEmpleo />
      <Year/>
      <Periodo/>
      <Fin/>
    </div>
  );
}

export default App;
