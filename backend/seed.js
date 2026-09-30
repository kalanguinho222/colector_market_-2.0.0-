const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const databasePath = process.env.DB_PATH || path.join(__dirname, 'market.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

const products = [
    ['charizard 1st edition', 5000, 'pokemon', 'imagens/imgs-ex/charizard.jpg'],
    ['pikachu original jungle', 3000, 'pokemon', 'imagens/imgs-ex/pikachu.jpg'],
    ['Pikachu reversed holo', 800, 'pokemon', 'imagens/imgs-ex/pikachu2.jpg'],
    ['snorlax 1st edition', 1500, 'pokemon', 'imagens/imgs-ex/snorlax.jpg'],
    ['Raichu 1st edition', 2000, 'pokemon', 'imagens/imgs-ex/raichu.png'],
    ['latias e latios gx', 4000, 'pokemon', 'imagens/imgs-ex/latias-e-latios.jpg'],
    ['Blue Eyes White Dragon', 500, 'yugioh', 'imagens/imgs-ex/blue-eyes-white-dragon.webp'],
    ['Red-Eye Black Dragon', 1500, 'yugioh', 'imagens/imgs-ex/red-eye-b-dragon.jpg'],
    ['black luster soldier', 750, 'yugioh', 'imagens/imgs-ex/black-luster.jpg'],
    ['dark magician', 1200, 'magic', 'imagens/imgs-ex/dark-magician.jpg'],
    ['Phoenix Heart', 900, 'magic', 'imagens/imgs-ex/phoenix-heart.webp'],
    ['splendid genisis assin', 2200, 'magic', 'imagens/imgs-ex/splendid-genisis.jpg'],
    ['Time Twister', 400, 'magic', 'imagens/imgs-ex/time-twister.jpg'],
    ['Controle Xbox Halo', 800, 'colecionaveis', 'imagens/imgs-ex/controle-xbox-halo.jpg'],
    ['Controle nintendo 64', 200, 'colecionaveis', 'imagens/imgs-ex/controle-nintendo-64.jpg'],
    ['golden nintendo 64', 4000, 'colecionaveis', 'imagens/imgs-ex/gold-nintendo-64.webp'],
    ['pratos duralex limitados', 4000, 'colecionaveis', 'imagens/imgs-ex/pratos-duralex.webp'],
    ['espada meowmere', 4000, 'colecionaveis', 'imagens/imgs-ex/meowmere.webp']
];

const passwordHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
const database = new DatabaseSync(databasePath);

try {
    database.exec(schema);

    const seed = database.prepare(`
        INSERT INTO usuario (username, senha)
        VALUES (?, ?)
    `);
    const product = database.prepare(`
        INSERT INTO produto (nome, preco, categoria, img, dono)
        VALUES (?, ?, ?, ?, ?)
    `);

    database.exec('BEGIN');
    try {
        database.exec('DELETE FROM produto; DELETE FROM usuario;');

        const miguel = seed.run('miguel', passwordHash).lastInsertRowid;
        const teste = seed.run('teste', passwordHash).lastInsertRowid;

        products.forEach(([name, price, category, image], index) => {
            product.run(name, price, category, image, index % 2 === 0 ? miguel : teste);
        });

        database.exec('COMMIT');
    } catch (error) {
        database.exec('ROLLBACK');
        throw error;
    }

    const total = database.prepare('SELECT COUNT(*) AS total FROM produto').get().total;
    console.log(`Banco populado: ${total} produtos e 2 usuários.`);
} finally {
    database.close();
}
