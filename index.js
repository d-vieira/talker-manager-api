const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const middleware = require('./middleware');

const talkersFile = './talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', middleware.talkersDataValidation, async (_req, res) => {
  const talkers = await fs.readFile(talkersFile);
  const talkersParsed = await JSON.parse(talkers);

  return res.status(HTTP_OK_STATUS).json(talkersParsed);
});

app.get('/talker/:id', middleware.talkerByIdValidation, async (req, res) => {
  const { id } = req.params;
  const talkers = await fs.readFile(talkersFile);
  const talkersParsed = await JSON.parse(talkers);
  const found = talkersParsed.find((talker) => talker.id === Number(id));

  return res.status(HTTP_OK_STATUS).json(found);
});

app.post('/login',
  middleware.passwordValidation,
  middleware.emailValidation,
  (_req, res) => {
    const myToken = middleware.generateToken();
    return res.status(HTTP_OK_STATUS).json({ token: `${myToken}` });
});

app.use(middleware.tokenValidation);

app.delete('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await fs.readFile(talkersFile);
  const talkersParsed = await JSON.parse(talkers);
  const found = talkersParsed.findIndex((talker) => talker.id === Number(id));

  // const workOn = talkersParsed.filter((talker, index) => talker[index] !== talker[found]);

  const workOn = talkersParsed.splice(found, 1);

  const deleted = { workOn };
  
  const toString = JSON.stringify(deleted);
  await fs.writeFile(talkersFile, toString);

  return res.status(204).end();
});

app.use(middleware.nameValidation);
app.use(middleware.ageValidation);
app.use(middleware.talkValidation);
app.use(middleware.rateValidation);
app.use(middleware.dateValidation);

app.post('/talker', async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talkers = await fs.readFile(talkersFile);
  const talkersParsed = await JSON.parse(talkers);
  const id = talkersParsed.length + 1;
  const newTalker = {
    id,
    name,
    age,
    talk: {
      watchedAt,
      rate,
    },
  };
  const addNewTalker = [...talkersParsed, newTalker];
  const toString = JSON.stringify(addNewTalker);
  await fs.writeFile(talkersFile, toString);
  
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talkers = await fs.readFile(talkersFile);
  const talkersParsed = await JSON.parse(talkers);
  const newTalker = {
    id: Number(id),
    name,
    age,
    talk,
  };
  const found = talkersParsed.findIndex((talker) => talker.id === Number(id));

  const workOn = [{ ...talkersParsed[found], name, age, talk }];

  const toString = JSON.stringify(workOn);
  await fs.writeFile(talkersFile, toString);

  return res.status(HTTP_OK_STATUS).json(newTalker);
});

app.listen(PORT, () => {
  console.log('Oi');
});
