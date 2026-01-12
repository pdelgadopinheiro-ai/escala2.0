const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./database.db');

/* ===== USUÁRIOS ===== */
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const hash = await bcrypt.hash(senha, 10);

  db.run(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, hash],
    err => {
      if (err) return res.status(400).send('Email já cadastrado');
      res.send('Usuário criado');
    }
  );
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.get(
    'SELECT * FROM usuarios WHERE email = ?',
    [email],
    async (err, user) => {
      if (!user) return res.status(401).send('Usuário não encontrado');

      const ok = await bcrypt.compare(senha, user.senha);
      if (!ok) return res.status(401).send('Senha inválida');

      res.send({ id: user.id, nome: user.nome });
    }
  );
});

/* ===== COROINHAS ===== */
app.post('/coroinhas', (req, res) => {
  db.run(
    'INSERT INTO coroinhas (nome) VALUES (?)',
    [req.body.nome],
    () => res.send('Coroinha cadastrado')
  );
});

app.get('/coroinhas', (req, res) => {
  db.all('SELECT * FROM coroinhas WHERE ativo = 1', [], (err, rows) => {
    res.json(rows);
  });
});

/* ===== ESCALA AUTOMÁTICA ===== */
app.post('/escala/automatica', (req, res) => {
  const regras = [
    { dia: 'Quinta', horario: 'Noite', qtd: 2 },
    { dia: 'Sexta', horario: 'Noite', qtd: 2 },
    { dia: 'Sábado', horario: 'Noite', qtd: 2 },
    { dia: 'Domingo', horario: '08h', qtd: 2 },
    { dia: 'Domingo', horario: '19h', qtd: 4 }
  ];

  db.all('SELECT id FROM coroinhas WHERE ativo = 1', [], (err, coroinhas) => {
    let index = 0;

    regras.forEach(regra => {
      db.run(
        'INSERT INTO escalas (dia, horario, quantidade) VALUES (?, ?, ?)',
        [regra.dia, regra.horario, regra.qtd],
        function () {
          for (let i = 0; i < regra.qtd; i++) {
            const coroinha = coroinhas[index % coroinhas.length];
            index++;

            db.run(
              'INSERT INTO escala_coroinhas (escala_id, coroinha_id) VALUES (?, ?)',
              [this.lastID, coroinha.id]
            );
          }
        }
      );
    });

    res.send('Escala automática gerada');
  });
});

/* ===== ESCALA MANUAL ===== */
app.post('/escala/manual', (req, res) => {
  const { dia, horario, coroinhas } = req.body;

  db.run(
    'INSERT INTO escalas (dia, horario, quantidade) VALUES (?, ?, ?)',
    [dia, horario, coroinhas.length],
    function () {
      coroinhas.forEach(id => {
        db.run(
          'INSERT INTO escala_coroinhas (escala_id, coroinha_id) VALUES (?, ?)',
          [this.lastID, id]
        );
      });
    }
  );

  res.send('Escala manual salva');
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
/*====== conectar =======*/
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
