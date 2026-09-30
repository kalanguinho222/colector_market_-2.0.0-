CREATE TABLE IF NOT EXISTS usuario (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    senha    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS produto (
    id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
    nome       TEXT    NOT NULL,
    preco      REAL    NOT NULL,
    categoria  TEXT    NOT NULL,
    img        TEXT    NOT NULL,
    dono       INTEGER NOT NULL REFERENCES usuario(id)
);