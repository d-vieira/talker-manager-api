const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const token = require('./generateToken');

const talkersFile = './talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const talkers = await fs.readFile(talkersFile);
  const talkersParsed = await JSON.parse(talkers);
  // const data = [];
  // talkersParsed.forEach((talker) => data.push(talker));
  // return res.status(200).json(data);

  if (talkersParsed.length === 0) {
    return res.status(HTTP_OK_STATUS).json([]);
  }
  return res.status(HTTP_OK_STATUS).json(talkersParsed);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await fs.readFile(talkersFile);
  const talkersParsed = await JSON.parse(talkers);
  const found = talkersParsed.find((talker) => talker.id === Number(id));

  if (!found) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(found);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const validEmailFormat = /^\w+(\[\+\.-\]?\w)*@\w+(\[\.-\]?\w+)*\.[a-z]+$/i;

  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!validEmailFormat.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  return res.status(HTTP_OK_STATUS).json({ token: token() });
});

app.listen(PORT, () => {
  console.log('Onlinee');
});
