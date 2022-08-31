const express = require('express');
const mysql = require('mysql');

const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'node_database',
};

let connection;

const app = express();

async function createDatabaseConnection() {
  connection = mysql.createConnection(config);
}

async function createUserTable() {
  const sql = 'create table if not exists `users` (id int auto_increment, `name` VARCHAR(255), PRIMARY KEY (`id`))';
  await connection.query(sql);
}

function generateRandomName() {
  const randomName = Math.random().toString(36).substring(7);
  return randomName;
}

app.get('/', async (req, res) => {
  await createDatabaseConnection();
  await createUserTable();
  const randomName = generateRandomName();
  const sql = `INSERT INTO users (name) VALUES ('${randomName}');`;
  await connection.query(sql);

  await connection.query('SELECT * FROM users', (err, users) => {
    if (err) {
      throw err;
    }

    const usersNames = users.map((user) => user.name);

    res.send(`
    <h1>Full Cycle Rocks!</h1>
    <h2>Bem-vindo ao curso Full Cycle da Code Education!!! Abaixo a lista dos últimos alunos matriculados:</h2>
    ${usersNames.map((name) => `<li>${name}</li>`).join('')}
  `);
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
