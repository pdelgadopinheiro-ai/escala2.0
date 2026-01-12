const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'escala_coroinhas'
});

app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);

  db.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, hash],
    (err) => {
      if (err) return res.status(400).send(err);
      res.send('Usuário cadastrado com sucesso');
    }
  );
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email],
    async (err, result) => {
      if (result.length === 0) return res.status(401).send('Usuário não encontrado');

      const valido = await bcrypt.compare(senha, result[0].senha);
      if (!valido) return res.status(401).send('Senha incorreta');

      res.send('Login realizado com sucesso');
    }
  );
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
