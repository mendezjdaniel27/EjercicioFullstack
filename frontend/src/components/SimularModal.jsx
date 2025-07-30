import React from 'react';

const SimularModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Resultado de Pagos</h2>

        <div>
          <h3>Pagables</h3>
          <ul>
            {data.pagables.map((item, index) => (
              <li key={index}>
                Cliente: {item.client}, ID: {item.id}, Monto: ${item.pago}, Sucursal: {item.sucursal}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Pendientes</h3>
          <ul>
            {data.pendientes.map((item, index) => (
              <li key={index}>
                Cliente: {item.client}, ID: {item.id}, Monto: ${item.pago}, Sucursal: {item.sucursal}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={onClose} style={styles.closeBtn}>Cerrar</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    background: 'white', padding: '20px', borderRadius: '8px',
    width: '80%', maxHeight: '90%', overflowY: 'auto',
  },
  closeBtn: {
    marginTop: '20px', padding: '10px 20px', backgroundColor: '#333',
    color: 'white', border: 'none', cursor: 'pointer'
  }
};

export default SimularModal;