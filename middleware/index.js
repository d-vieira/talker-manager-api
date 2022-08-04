const fs = require('fs').promises;

const talkersFile = './talker.json';

const talkersDataValidation = async (_req, res, next) => {
  const talkers = await fs.readFile(talkersFile);
  const talkersParsed = await JSON.parse(talkers);
  // const data = [];
  // talkersParsed.forEach((talker) => data.push(talker));
  // return res.status(200).json(data);
  
  if (talkersParsed.length === 0) {
    return res.status(200).json([]);
  }

  next();
};

const talkerByIdValidation = async (req, res, next) => {
  const { id } = req.params;
  const talkers = await fs.readFile(talkersFile);
  const talkersParsed = await JSON.parse(talkers);
  const found = talkersParsed.find((talker) => talker.id === Number(id));

  if (!found) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  next();
};

const passwordValidation = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  next();
};

const emailValidation = (req, res, next) => {
  const { email } = req.body;
  const validEmailFormat = /^\w+(\[\+\.-\]?\w)*@\w+(\[\.-\]?\w+)*\.[a-z]+$/i;

  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }

  if (!validEmailFormat.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }

  next();
};

const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  next();
};

const nameValidation = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }

  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const ageValidation = (req, res, next) => {
  const { age } = req.body;

  if (!Number(age)) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }

  if (Number(age) < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
};

const talkValidation = (req, res, next) => {
  const { talk } = req.body;
  
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }

  next();
};

const dateValidation = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const dateFormat = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  
  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }

  if (!dateFormat.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};

const rateValidation = (req, res, next) => {
  const { talk: { rate } } = req.body;

  if (Number(rate) < 1 /* || Number(rate) > 5 */) { 
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  
  if (Number(rate) > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  
  if (!Number(rate)) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }

  next();
};

const queryValidation = async (req, res, next) => {
  const { q } = req.query;

  const talkers = await fs.readFile(talkersFile);
  const talkersParsed = await JSON.parse(talkers);

  const found = talkersParsed.filter((talker) => talker.name.includes(q));
  
  if (!q) {
    return res.status(200).json(talkersParsed);
  }

  if (!found) {
    return res.status(200).json([]);
  }

  next();
};

module.exports = {
  talkersDataValidation,
  talkerByIdValidation,
  passwordValidation,
  emailValidation,
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  dateValidation,
  rateValidation,
  queryValidation,
};
