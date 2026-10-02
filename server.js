const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./base.db');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
db.run(`
  CREATE TABLE IF NOT EXISTS alumnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    curso TEXT,
    email TEXT
  )
`);
app.get('/alumnos', (req, res) => {
  db.all('SELECT * FROM alumnos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.post('/alumnos', (req, res) => {
  const { nombre, curso, email } = req.body;
  db.run(
    'INSERT INTO alumnos (nombre, curso, email) VALUES (?, ?, ?)',
    [nombre, curso, email],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Guardado', id: this.lastID });
    }
  );
});
app.listen(3000, () => console.log('Servidor listo en http://localhost:3000'));