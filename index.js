const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const talkersFile = './talker.json';

// const talkers = fs.readFile(talkersFile, 'utf-8', (err, data) => {
//   if (err) {
//     console.error(`Não foi possível ler o arquivo ${talkersFile}\n Erro: ${err}`);
//     process.exit(1);
//   }
//   return data;
// });

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
    return res.status(200).json([]);
  }
  return res.status(200).json(talkersParsed);
});

app.listen(PORT, () => {
  console.log('Onlinee');
});
