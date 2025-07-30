const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Crear tablas , y cargar datos iniciales
const initDB = async () => {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS loans;
      DROP TABLE IF EXISTS accounts;
      DROP TABLE IF EXISTS sucursales;

      CREATE TABLE sucursales (
        ID SERIAL PRIMARY KEY,
        Name VARCHAR(100) NOT NULL,
        IVA INT NOT NULL
      );

      CREATE TABLE loans (
        Id SERIAL PRIMARY KEY,
        Client UUID NOT NULL,
        Date_Loan DATE NOT NULL,
        Amount FLOAT NOT NULL,
        Status VARCHAR(50) NOT NULL,
        IdSucursal INT REFERENCES sucursales(ID)
      );

      CREATE TABLE accounts (
        Client UUID PRIMARY KEY,
        Amount FLOAT NOT NULL,
        Status VARCHAR(50) NOT NULL
      );

      INSERT INTO sucursales (ID, Name, IVA) VALUES
        (1, 'Tijuana', 8),
        (2, 'Nuevo Leon', 16),
        (3, 'Tamaulipas', 10);

      INSERT INTO loans (Client, Id, Date_Loan, Amount, Status, IdSucursal) VALUES
        ('911ac37c-5990-4bf8-8cf0-b51f21c8ecbe', 1, '2021-01-15', 37500, 'Pendiente', 3),
        ('911ac37c-5990-4bf8-8cf0-b51f21c8ecbe', 2, '2021-01-24', 725.18, 'Pendiente', 3),
        ('911ac37c-5990-4bf8-8cf0-b51f21c8ecbe', 3, '2021-02-05', 1578.22, 'Pendiente', 3),
        ('911ac37c-5990-4bf8-8cf0-b51f21c8ecbe', 4, '2021-02-09', 380, 'Pendiente', 3),

        ('8482bcae-0b2b-45bb-9012-59ec93978265', 5, '2021-01-12', 2175.25, 'Pagado', 2),
        ('8482bcae-0b2b-45bb-9012-59ec93978265', 6, '2021-01-18', 499.99, 'Pagado', 2),
        ('8482bcae-0b2b-45bb-9012-59ec93978265', 7, '2021-01-29', 5725.18, 'Pendiente', 2),
        ('8482bcae-0b2b-45bb-9012-59ec93978265', 8, '2021-02-12', 876.13, 'Pendiente', 2),

        ('78be3a77-698d-43ef-b113-a598eb1fb791', 9, '2021-02-09', 545.55, 'Pendiente', 1),
        ('cee008ca-c715-456b-96c6-74ff9bd22dd3', 10, '2020-12-31', 15220, 'Pagado', 1);

      INSERT INTO accounts (Client, Amount, Status) VALUES
        ('911ac37c-5990-4bf8-8cf0-b51f21c8ecbe', 15375.28, 'Activa'),
        ('8482bcae-0b2b-45bb-9012-59ec93978265', 3728.51, 'Bloqueada'),
        ('78be3a77-698d-43ef-b113-a598eb1fb791', 0, 'Cancelada'),
        ('cee008ca-c715-456b-96c6-74ff9bd22dd3', 235.28, 'Activa');
    `);

    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
  }
};

app.get('/api/pagos-pendientes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.Client,
        l.Id,
        l.Amount,
        s.Name AS sucursal,
        s.IVA
      FROM loans l
      JOIN sucursales s ON l.IdSucursal = s.ID
      WHERE l.Status = 'Pendiente'
    `);

    const response = result.rows.map(row => {
      const amount = parseFloat(row.amount);
      const ivaDecimal = row.iva / 100;
      const pago = +(amount * (1 + ivaDecimal)).toFixed(2);

      return {
        client: row.client,
        sucursal: row.sucursal,
        id: row.id,
        amount: pago
      };
    });

    res.json(response);
  } catch (error) {
    console.error('Error al obtener pagos pendientes:', error);
    res.status(500).send('Error al obtener pagos pendientes');
  }
});

app.put('/api/ejecutar-pagos', async (req, res) => {
   try {
    const pagables = req.body.pagables;

    for (const item of pagables) {
      const { id, pago, client } = item;

      // Actualizar status de la carga
      await pool.query('UPDATE loans SET status = $1 WHERE id = $2', ['Pagado', id]);

      // Restar el monto en accounts
      await pool.query('UPDATE accounts SET amount = amount - $1 WHERE client = $2', [pago, client]);
    }

    res.status(200).json({ message: 'Pagos realizados correctamente' });
  } catch (error) {
    console.error('Error al ejecutar pagos:', error);
    res.status(500).json({ error: 'Error al procesar pagos' });
  }
});


app.get('/api/simular', async (req, res) => {
  try {
    // 1. Obtener cuentas activas
    const cuentasResult = await pool.query(`
      SELECT client, amount AS amountAccount
      FROM accounts
      WHERE status = 'Activa'
    `);

    const cuentasMap = new Map();
    cuentasResult.rows.forEach(cuenta => {
      cuentasMap.set(cuenta.client, parseFloat(cuenta.amountaccount));
    });

    // 2. Obtener préstamos pendientes con IVA y sucursal
    const loansResult = await pool.query(`
      SELECT 
        l.client,
        l.id,
        l.amount,
        s.iva,
        s.name AS sucursal
      FROM loans l
      JOIN sucursales s ON l.idSucursal = s.id
      WHERE l.status = 'Pendiente'
        AND l.client IN (
          SELECT client FROM accounts WHERE status = 'Activa'
        )
      ORDER BY l.client, l.amount ASC
    `);

    // 3. Agrupar préstamos por cliente
    const prestamosPorCliente = new Map();
    for (const row of loansResult.rows) {
      const client = row.client;
      if (!prestamosPorCliente.has(client)) {
        prestamosPorCliente.set(client, []);
      }
      prestamosPorCliente.get(client).push(row);
    }

    const pagables = [];
    const pendientes = [];

    // 4. Procesar cada cliente
    for (const [client, prestamos] of prestamosPorCliente.entries()) {
      let saldo = cuentasMap.get(client) ?? 0;

      for (const row of prestamos) {
        const monto = parseFloat(row.amount);
        const iva = row.iva / 100;
        const pago = +(monto * (1 + iva)).toFixed(2);

        const prestamoInfo = {
          client,
          id: row.id,
          pago,
          sucursal: row.sucursal
        };

        if (pago <= saldo) {
          pagables.push(prestamoInfo);
          saldo = +(saldo - pago).toFixed(2);
        } else {
          pendientes.push(prestamoInfo);
        }
      }
    }

    res.json({ pagables, pendientes });
  } catch (error) {
    console.error('Error al proyectar pagos:', error);
    res.status(500).send('Error al proyectar pagos');
  }
});

app.use(cors({
  origin: 'http://localhost:5173', // o el puerto de tu frontend
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));


app.listen(PORT, async () => {
  await initDB();
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
