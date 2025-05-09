// server/auth.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

// Conexión a la base de datos (asegúrate de configurarlo correctamente)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Reemplaza con tu usuario
  password: '',  // Reemplaza con tu contraseña
  database: 'registro_prod'  // Nombre de la base de datos
});

// Función para verificar las credenciales
const login = (req, res) => {
  const { username, password } = req.body;

  // Verificar si los campos están completos
  if (!username || !password) {
    return res.status(400).json({ message: 'Por favor, ingrese usuario y contraseña.' });
  }

  // Consulta a la base de datos para encontrar el usuario
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al consultar la base de datos.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    // Comparar la contraseña proporcionada con la almacenada (encriptada)
    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error al comparar contraseñas.' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta.' });
      }

      // Crear un token JWT
      const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });

      // Devolver el token al cliente
      res.status(200).json({ message: 'Autenticación exitosa', token });
    });
  });
};

module.exports = { login };
