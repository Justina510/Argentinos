import './App.css';
import Intro from './Partes/Pages/intro';
import MapaEmpleo from './Partes/Pages/MapaEmpleo.jsx';
import Year from './Partes/Pages/Year.jsx'
import Periodo from './Partes/Pages/Periodo.jsx'

function App() {
  return (
    <div className="App">
      <Intro />
      <MapaEmpleo />
      <Year/>
      <Periodo/>
      
    </div>
  );
}

export default App;
