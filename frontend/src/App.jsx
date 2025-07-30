import { useEffect, useState } from 'react'

function App() {
  const [time, setTime] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/api')
      .then(res => res.json())
      .then(data => setTime(data.time))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>React + Backend + PostgreSQL </h1>
      <p>Hora del servidor: {time || 'Cargando...'}</p>
    </div>
  )
}

export default App
