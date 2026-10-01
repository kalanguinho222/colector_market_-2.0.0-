const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
    const filtros = [];
    const valores = [];

    if (req.query.categoria) {
        filtros.push('categoria = ?');
        valores.push(req.query.categoria);
    }

    if (req.query.precoMax) {
        filtros.push('preco <= ?');
        valores.push(Number(req.query.precoMax));
    }

    const onde = filtros.length ? 'WHERE ' + filtros.join(' AND ') : '';

    const produtos = db
        .prepare(`SELECT * FROM produto ${onde} ORDER BY id_produto`)
        .all(valores);

    res.json(produtos);
});

module.exports = router;