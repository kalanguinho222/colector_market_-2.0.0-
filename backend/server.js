const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/api/ping', (req, res) => {
    res.json({ ok: true, hora: new Date().toISOString() });
});

const PORTA = 3000;
app.listen(PORTA, () => console.log(`Servidor em http://localhost:${PORTA}`));

app.use('/api/produtos', require('./routes/produtos'));
app.use('/api', require('./routes/misslewares/auth'))

const session = require('express-session');

app.use(session({
    secret: 'trocar-isso-depois',
    resave: false,
    saveUninitialized: false
}));