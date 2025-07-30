import React, { useState } from 'react';
import './Actions.css';
import SimularModal from './SimularModal';

const Actions = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const [result, setResult] = useState({ pagables: [], pendientes: [] });

    const fetchPagos = async () => {
        try {
        const res = await fetch('http://localhost:5000/api/simular');
        const data = await res.json();
        setResult(data);
        setModalOpen(true);
        } catch (err) {
        console.error('Error al obtener pagos:', err);
        }
    };

    const handleEjecutar = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/simular');
            const data = await res.json();
            setResult(data);

            console.table(data.pagables);

            const execRes = await fetch('http://localhost:5000/api/ejecutar-pagos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pagables: data.pagables }),
            });

            const execData = await execRes.json();
            console.log(execData.message);

        } catch (error) {
            console.error('Error al ejecutar pagos:', error);
        }

        alert('Pagos ejecutados');

    };

    return (
        <div className="actions">

        <button onClick={fetchPagos}>Simular Pagos</button>
            <SimularModal isOpen={modalOpen} onClose={() => setModalOpen(false)} data={result} />
            

        <button className="btn execute" onClick={handleEjecutar}>
            Ejecutar pagos
        </button>
        </div>
    );
};

export default Actions;