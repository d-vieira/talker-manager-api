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
  (_req, res) => res.status(HTTP_OK_STATUS).json({ token: middleware.generateToken() }));

app.post('/talker',
    middleware.tokenValidation,
    middleware.nameValidation,
    middleware.talkValidation,
    middleware.ageValidation,
    middleware.dateValidation,
    middleware.rateValidation,
    async (req, res) => {
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

app.listen(PORT, () => {
  console.log('Oi');
});
