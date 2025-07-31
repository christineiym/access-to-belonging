const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./connections.db');

app.use(cors());
app.use(bodyParser.json());

// Init table

db.run(`CREATE TABLE IF NOT EXISTS connections (fromDot INTEGER, toDot INTEGER)`);

app.get('/connections', (req, res) => {
  db.all('SELECT * FROM connections', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/connections', (req, res) => {
  const { from, to } = req.body;
  if (typeof from !== 'number' || typeof to !== 'number') {
    return res.status(400).json({ error: 'Invalid connection data' });
  }
  db.run('INSERT INTO connections (fromDot, toDot) VALUES (?, ?)', [from, to], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ success: true });
  });
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));