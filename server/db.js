const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'registro_prod'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// ✅ Ruta: Obtener productos
app.get('/api/productos', (req, res) => {
  const query = 'SELECT codigo, nombre, cantidad, precio FROM productos';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.json(results);
  });
});

// ✅ Ruta: Login
app.post('/api/login', (req, res) => {
  const { user, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE user = ? AND password = ?';
  db.query(query, [user, password], (err, results) => {
    if (err) {
      console.error('Error en la consulta de login:', err);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }

    if (results.length > 0) {
      return res.json({ success: true, message: 'Login exitoso' });
    } else {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
  });
});

// ✅ Ruta: Actualizar producto
app.put('/api/productos/:codigo', (req, res) => {
  const { codigo } = req.params;
  const { nombre, cantidad, precio } = req.body;

  // Verificamos que los datos sean correctos
  if (!nombre || !cantidad || !precio) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
  }

  const query = 'UPDATE productos SET nombre = ?, cantidad = ?, precio = ? WHERE codigo = ?';
  db.query(query, [nombre, cantidad, precio, codigo], (err, results) => {
    if (err) {
      console.error('Error al actualizar el producto:', err);
      return res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json({ success: true, message: 'Producto actualizado con éxito' });
  });
});
// ✅ Ruta: Agregar producto
app.post('/api/productos', (req, res) => {
  const { codigo, nombre, cantidad, precio } = req.body;

  // Verificamos que los datos sean correctos
  if (!codigo || !nombre || !cantidad || !precio) {
    return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
  }

  const query = 'INSERT INTO productos (codigo, nombre, cantidad, precio) VALUES (?, ?, ?, ?)';
  db.query(query, [codigo, nombre, cantidad, precio], (err, results) => {
    if (err) {
      console.error('Error al agregar el producto:', err);
      return res.status(500).json({ success: false, message: 'Error al agregar el producto' });
    }

    res.status(201).json({ success: true, message: 'Producto agregado con éxito' });
  });
});

// ✅ Ruta: Eliminar producto
app.delete('/api/productos/:codigo', (req, res) => {
  const { codigo } = req.params;

  const query = 'DELETE FROM productos WHERE codigo = ?';
  db.query(query, [codigo], (err, results) => {
    if (err) {
      console.error('Error al eliminar el producto:', err);
      return res.status(500).json({ success: false, message: 'Error al eliminar el producto' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json({ success: true, message: 'Producto eliminado con éxito' });
  });
});

// ✅ Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
