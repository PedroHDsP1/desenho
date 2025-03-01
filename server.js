const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require("bcryptjs");
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','index.html' ));
});

app.get('/formulario.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','formulario.html' ));
});

app.post('/registra-personagem', (req, res) => {
  const {nome_P, desenho_P, idade} = req.body;
  // Aqui começa a validação dos campos do formulário
  let erro = "";
  if(nome_P.length < 1 || desenho_P.length < 1 || idade.length < 1){
      erro += 'Por favor, preencha todos os campos corretamente!<br>';
  }
  if(erro){
      res.status(200).json({
          status: 'failed',
          message: erro,
      });
  }
  else{
      // aqui começa o código para inserir o registro no banco de dados
      let db = new sqlite3.Database('./db/banco.db', (err) => {
          if (err) {
              return console.error(err.message);
          }
              console.log('Conectou no banco de dados!');
      });

      db.get('SELECT desenho_P FROM personagem WHERE desenho_P = ?', [desenho_P], async (error, result) => {
          if(error){
              console.log(error)
          }
          else if(result) {
              db.close((err) => {
                  if (err) {
                  return console.error(err.message);
                  }
                  console.log('Fechou a conexão com o banco de dados.');
              });
              return res.status(200).json({
                  status: 'failed',
                  message: 'Este e-mail já está em uso!',
              });
          } else{
              db.run('INSERT INTO personagem(nome_P, desenho_P, idade) VALUES (?, ?, ?)', [nome_P, desenho_P, idade], (error2) => {
                  if(error2) {
                      console.log(error2)
                  } else {
                      db.close((err) => {
                          if (err) {
                          return console.error(err.message);
                          }
                          console.log('Fechou a conexão com o banco de dados.');
                      });
                      return res.status(200).json({
                          status: 'success',
                          message: 'Registro feito com sucesso!',
                          campos: req.body
                      });
                  }
              });
          }
      });
  }
});
    
app.post('/edita-usuario', (req, res) => {
  const {nome_P, desenho_P, id_personagem} = req.body;
  // Aqui começa a validação dos campos do formulário
  let erro = "";
  if(nome_P.length < 1 || desenho_P.length < 1){
      erro += 'Por favor, preencha todos os campos corretamente!<br>';
  }
  if(erro){
      res.status(200).json({
          status: 'failed',
          message: erro,
      });
  }
  else{
      // aqui começa o código para inserir o registro no banco de dados
      let db = new sqlite3.Database('./db/banco.db', (err) => {
          if (err) {
              return console.error(err.message);
          }
              console.log('Conectou no banco de dados!');
      });

      db.get('SELECT * FROM personagem WHERE desenho_P = ?', [desenho_P], async (error, result) => {
          if(error){
              console.log(error)
          }
          else if(result && result.id_personagem != id) {
              db.close((err) => {
                  if (err) {
                  return console.error(err.message);
                  }
                  console.log('Fechou a conexão com o banco de dados.');
              });
              return res.status(200).json({
                  status: 'failed',
                  message: 'Este desenho já está em uso!',
              });
          } else{
              db.run('UPDATE personagem SET nome_P = ?, desenho_P = ? WHERE id_personagem = ?', [nome_P, desenho_P, id_personagem], (error2) => {
                  if(error2) {
                      console.log(error2)
                  } else {
                      db.close((err) => {
                          if (err) {
                          return console.error(err.message);
                          }
                          console.log('Fechou a conexão com o banco de dados.');
                      });
                      return res.status(200).json({
                          status: 'success',
                          message: 'Atualização feito com sucesso!',
                          campos: req.body
                      });
                  }
              });
          }
      });
  }
});

app.get('/ver_personagem', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','consulta_personagem.html' ));
});

app.post('/buscar-usuarios', (req, res) => {
  let db = new sqlite3.Database('./db/banco.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectou com o banco de dados!');
  });

  db.all(`SELECT * FROM personagem`, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Dados buscados com sucesso!',
      personagens: rows
    });
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Fechou a conexão com o banco de dados!');
  });
});

app.post('/procurar', (req, res) => {
  const {nome_P} = req.body;
  let db = new sqlite3.Database('./db/banco.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectou com o banco de dados!');
  });

  db.all(`SELECT * FROM personagem WHERE nome_P = ?`, [nome_P], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Dados buscados com sucesso!',
      personagens: rows
    });
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Fechou a conexão com o banco de dados!');
  });
});

app.post('/procurarId', (req, res) => {
  const {id_personagem} = req.body;
  let db = new sqlite3.Database('./db/banco.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectou com o banco de dados!');
  });

  db.get(`SELECT * FROM personagem WHERE id_personagem = ?`, [id_personagem], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Dados buscados com sucesso!',
      nome_P: row.nome_P,
      desenho_P: row.desenho_P
    });
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Fechou a conexão com o banco de dados!');
  });
});

app.post('/excluir_usuario', (req, res) => {
  const {id_personagem} = req.body;
  let db = new sqlite3.Database('./db/banco.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conectou com o banco de dados!');
  });

  db.run(`DELETE FROM personagem WHERE id_personagem = ?`, [id_personagem], function(err) {
    if (err) {
      return console.error(err.message);
    }
    return res.status(200).json({
      status: 'success',
      message: 'Personagem excluído com sucesso!'
    });
  });
  

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Fechou a conexão com o banco de dados!');
  });
});

app.listen(8080, () => {
  console.log('Servidor iniciado na porta 8080');
});