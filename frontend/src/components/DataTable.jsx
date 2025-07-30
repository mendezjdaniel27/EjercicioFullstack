import React, { useEffect, useState } from 'react';
import './DataTable.css';

const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/pagos-pendientes')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener datos');
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => console.error('Error:', err));
  }, []);

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Sucursal</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="4">Cargando datos...</td>
          </tr>
        ) : (
          data.map((pago) => (
            <tr key={pago.id}>
              <td>{pago.id}</td>
              <td>{pago.client}</td>
              <td>{pago.sucursal}</td>
              <td>${pago.amount.toFixed(2)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default DataTable;