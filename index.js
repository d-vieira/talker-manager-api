const express = require('express');
const bodyParser = require('body-parser');
const middleware = require('./middleware');
const helpers = require('./helpers');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const TALKERS_FILE = './talker.json';

app.get('/talker/search',
  middleware.tokenValidation,
  middleware.queryValidation,
  async (req, res) => {
    const { q } = req.query;
    
    const talkers = await helpers.readFile(TALKERS_FILE);
    const found = talkers.filter((talker) => talker.name.includes(q));

    return res.status(HTTP_OK_STATUS).json(found);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', middleware.talkersDataValidation, async (_req, res) => {
  const talkers = await helpers.readFile(TALKERS_FILE);

  return res.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', middleware.talkerByIdValidation, async (req, res) => {
  const { id } = req.params;
  
  const talkers = await helpers.readFile(TALKERS_FILE);
  const found = talkers.find((talker) => talker.id === Number(id));
  
  return res.status(HTTP_OK_STATUS).json(found);
});

app.post('/login',
middleware.passwordValidation,
middleware.emailValidation,
(_req, res) => {
  const myToken = helpers.generateToken();
  return res.status(HTTP_OK_STATUS).json({ token: `${myToken}` });
});

app.use(middleware.tokenValidation);

app.delete('/talker/:id', middleware.talkersDataValidation, async (req, res) => {
  const { id } = req.params;
  
  const talkers = await helpers.readFile(TALKERS_FILE);
  const found = talkers.findIndex((talker) => talker.id === Number(id));

  // ALTERNATIVA const workOn = talkersParsed.filter((talker, index) => talker[index] !== talker[found]);
  const workOn = talkers.splice(found, 1);

  const deleteTalker = { workOn };
  await helpers.writeFile(TALKERS_FILE, deleteTalker);
  
  return res.status(204).end();
});

app.use(middleware.nameValidation);
app.use(middleware.ageValidation);
app.use(middleware.talkValidation);
app.use(middleware.rateValidation);
app.use(middleware.dateValidation);

app.post('/talker', async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talkers = await helpers.readFile(TALKERS_FILE);
  const id = talkers.length + 1;
  const newTalker = {
    id,
    name,
    age,
    talk: {
      watchedAt,
      rate,
    },
  };
  const addNewTalker = [...talkers, newTalker];
  await helpers.writeFile(TALKERS_FILE, addNewTalker);
  
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talkers = await helpers.readFile(TALKERS_FILE);
  const newTalker = {
    id: Number(id),
    name,
    age,
    talk,
  };
  const found = talkers.findIndex((talker) => talker.id === Number(id));

  const updateTalker = [{ ...talkers[found], name, age, talk }];
  await helpers.writeFile(TALKERS_FILE, updateTalker);

  return res.status(HTTP_OK_STATUS).json(newTalker);
});

app.listen(PORT, () => {
  console.log('Oi');
});
