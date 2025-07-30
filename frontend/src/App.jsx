import { useEffect, useState } from 'react'
import './App.css';
import Actions from './components/Actions';
import DataTable from './components/DataTable';
import logo from './assets/logo1.png';

function App() {
  const [time, setTime] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/pagos-pendientes')
      .then(res => res.json())
      .then(data => setTime(data.time))
      .catch(err => console.error(err))
  }, [])


  return (
    <div>

    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="title">Cuentas pendientes</div>
    </nav>


      <div className="content">
        <Actions />
        <DataTable />
      </div>    
      
    </div>
  )
}

export default App
