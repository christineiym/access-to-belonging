const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./connections.db');

const defaultPersonas = ['Wheelchair User', 'Cyclist', 'Avid Walker', 'Parent with a stroller', 'Transit Rider', 'White-Cane User'];
const defaultBarriers = ['Lack of lighting', 'Large cracks', 'No curb ramps', 'Steep inclines', 'Confusing wayfinding', 'No tactile-paving', 'No audible pedestrian signal'];

app.use(cors());
app.use(bodyParser.json());

// Init tables and pre-load defaults
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS barrier (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL UNIQUE,
    display INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS persona (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL UNIQUE,
    display INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS connection (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    barrier_id INTEGER,
    persona_id INTEGER,
    time INTEGER,
    FOREIGN KEY(barrier_id) REFERENCES barrier(id),
    FOREIGN KEY(persona_id) REFERENCES persona(id)
  )`);

  // Pre-load default barriers
  defaultBarriers.forEach(barrier => {
    db.run(
      `INSERT OR IGNORE INTO barrier (text, display) VALUES (?, 1)`,
      [barrier]
    );
  });

  // Pre-load default personas
  defaultPersonas.forEach(persona => {
    db.run(
      `INSERT OR IGNORE INTO persona (text, display) VALUES (?, 1)`,
      [persona]
    );
  });
});

// Barrier endpoints
app.get('/barrier', (req, res) => {
  const displayOnly = req.query.displayOnly === '1';
  let sql = 'SELECT * FROM barrier';
  if (displayOnly) sql += ' WHERE display = 1';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/barrier', (req, res) => {
  const { text, display } = req.body;
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Invalid barrier text' });
  }
  db.run('INSERT INTO barrier (text, display) VALUES (?, ?)', [text, display === false ? 0 : 1], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, text, display: display === false ? 0 : 1 });
  });
});

// Update barrier display by text
app.post('/barrier/display', (req, res) => {
  const { text, display } = req.body;
  if (typeof text !== 'string' || typeof display !== 'boolean') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  db.run('UPDATE barrier SET display = ? WHERE text = ?', [display ? 1 : 0, text], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, changes: this.changes });
  });
});

// Persona endpoints
app.get('/persona', (req, res) => {
  const displayOnly = req.query.displayOnly === '1';
  let sql = 'SELECT * FROM persona';
  if (displayOnly) sql += ' WHERE display = 1';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/persona', (req, res) => {
  const { text, display } = req.body;
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Invalid persona text' });
  }
  db.run('INSERT INTO persona (text, display) VALUES (?, ?)', [text, display === false ? 0 : 1], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, text, display: display === false ? 0 : 1 });
  });
});

// Update persona display by text
app.post('/persona/display', (req, res) => {
  const { text, display } = req.body;
  if (typeof text !== 'string' || typeof display !== 'boolean') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  db.run('UPDATE persona SET display = ? WHERE text = ?', [display ? 1 : 0, text], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, changes: this.changes });
  });
});

// Connection endpoints
app.get('/connection', (req, res) => {
  const displayOnly = req.query.displayOnly === '1';
  let sql = `
    SELECT c.*, p.text as fromDot, b.text as toDot
    FROM connection c
    JOIN barrier b ON c.barrier_id = b.id
    JOIN persona p ON c.persona_id = p.id
  `;
  if (displayOnly) {
    sql += ' WHERE b.display = 1 AND p.display = 1';
  }
  sql += ' ORDER BY c.persona_id, c.barrier_id';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/connection', (req, res) => {
  let { barrier_id, persona_id, barrier_text, persona_text, time } = req.body;

  // Helper to insert barrier/persona if not exists, and get id
  function getOrCreate(table, text, cb) {
    db.get(`SELECT id FROM ${table} WHERE text = ?`, [text], (err, row) => {
      if (err) return cb(err);
      if (row) return cb(null, row.id);
      db.run(`INSERT INTO ${table} (text, display) VALUES (?, 0)`, [text], function (err2) {
        if (err2) return cb(err2);
        cb(null, this.lastID);
      });
    });
  }

  // If barrier_id and persona_id are provided, use them directly
  if (typeof barrier_id === 'number' && typeof persona_id === 'number') {
    db.run(
      'INSERT INTO connection (barrier_id, persona_id, time) VALUES (?, ?, ?)',
      [barrier_id, persona_id, time || Date.now()],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, barrier_id, persona_id, time: time || Date.now() });
      }
    );
    return;
  }

  // Otherwise, use text to find or create barrier/persona
  if (typeof barrier_text === 'string' && typeof persona_text === 'string') {
    getOrCreate('barrier', barrier_text, (err, foundBarrierId) => {
      if (err) return res.status(500).json({ error: err.message });
      getOrCreate('persona', persona_text, (err2, foundPersonaId) => {
        if (err2) return res.status(500).json({ error: err2.message });
        db.run(
          'INSERT INTO connection (barrier_id, persona_id, time) VALUES (?, ?, ?)',
          [foundBarrierId, foundPersonaId, time || Date.now()],
          function (err3) {
            if (err3) return res.status(500).json({ error: err3.message });
            res.status(201).json({
              id: this.lastID,
              barrier_id: foundBarrierId,
              persona_id: foundPersonaId,
              time: time || Date.now()
            });
          }
        );
      });
    });
    return;
  }

  // If neither id nor text is provided, error
  return res.status(400).json({ error: 'Invalid connection data: must provide barrier_id/persona_id or barrier_text/persona_text' });
});

// Aggregate connections endpoint
app.get('/connection-aggregate', (req, res) => {
  const displayOnly = req.query.displayOnly === 'true';
  let sql = `
    SELECT c.barrier_id, b.text as toDot, c.persona_id, p.text as fromDot, COUNT(*) as count
    FROM connection c
    JOIN barrier b ON c.barrier_id = b.id
    JOIN persona p ON c.persona_id = p.id
  `;
  if (displayOnly) {
    sql += ' WHERE b.display = 1 AND p.display = 1';
  }
  sql += ' GROUP BY c.persona_id, c.barrier_id ORDER BY c.persona_id, c.barrier_id';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));