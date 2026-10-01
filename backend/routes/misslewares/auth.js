const bcrypt = require('bcrypt');

router.post('/cadastro', async (req, res) => {
    const { username, senha } = req.body;

    if (!username || !senha) {
        return res.status(400).json({ erro: 'Preencha usuário e senha' });
    }
    if (senha.length < 6) {
        return res.status(400).json({ erro: 'A senha precisa de pelo menos 6 caracteres' });
    }

    const hash = await bcrypt.hash(senha, 10);

    try {
        const r = db
            .prepare('INSERT INTO usuario (username, senha) VALUES (?, ?)')
            .run(username.trim(), hash);

        res.status(201).json({ id: r.lastInsertRowid, username: username.trim() });
    } catch (e) {
        if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ erro: 'Esse nome de usuário já existe' });
        }
        throw e;
    }
});

router.post('/login', async (req, res) => {
    const { username, senha } = req.body;

    const usuario = db
        .prepare('SELECT * FROM usuario WHERE username = ?')
        .get(username);

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    req.session.usuarioId = usuario.id;
    req.session.username = usuario.username;

    res.json({ id: usuario.id, username: usuario.username });
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ ok: true });
    });
});

router.get('/eu', (req, res) => {
    if (!req.session.usuarioId) {
        return res.json({ logado: false });
    }
    res.json({
        logado: true,
        id: req.session.usuarioId,
        username: req.session.username
    });
});

function exigeLogin(req, res, next) {
    if (!req.session.usuarioId) {
        return res.status(401).json({
            erro: 'Precisa estar logado'
        });
    }

    next();
}

module.exports = { exigeLogin };