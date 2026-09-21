-- schema.sql
-- Banco de dados: colector_market_b_v2 (convertido de MariaDB para SQLite)

PRAGMA foreign_keys = ON;

-- --------------------------------------------------------
-- Tabela: usuario
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  senha TEXT NOT NULL
);

-- --------------------------------------------------------
-- Tabela: produto
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS produto (
  id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  preco REAL NOT NULL,
  categoria TEXT NOT NULL,
  img TEXT NOT NULL,
  dono INTEGER NOT NULL REFERENCES usuario(id)
);

-- Índice para a coluna dono (equivalente ao KEY do MySQL)
CREATE INDEX IF NOT EXISTS idx_produto_dono ON produto(dono);