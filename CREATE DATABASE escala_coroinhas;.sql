CREATE DATABASE escala_coroinhas;
USE escala_coroinhas;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE coroinhas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

CREATE TABLE escalas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dia VARCHAR(20),
  horario VARCHAR(20),
  quantidade INT
);

CREATE TABLE escala_coroinhas_relacao (
  escala_id INT,
  coroinha_id INT,
  FOREIGN KEY (escala_id) REFERENCES escalas(id),
  FOREIGN KEY (coroinha_id) REFERENCES coroinhas(id)
);

CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL
);

CREATE TABLE coroinhas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  ativo INTEGER DEFAULT 1
);

CREATE TABLE escalas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT,
  dia TEXT,
  horario TEXT,
  quantidade INTEGER
);

CREATE TABLE escala_coroinhas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  escala_id INTEGER,
  coroinha_id INTEGER,
  FOREIGN KEY (escala_id) REFERENCES escalas(id),
  FOREIGN KEY (coroinha_id) REFERENCES coroinhas(id)
);
CREATE TABLE configuracoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_app TEXT,
  tema TEXT
); 