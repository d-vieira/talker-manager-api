const fs = require('fs').promises;
const crypto = require('crypto');

const generateToken = () => crypto.randomBytes(8).toString('hex');

const readFile = async (path) => {
  const rawFile = await fs.readFile(path);
  const parsedFile = await JSON.parse(rawFile);
  return parsedFile;
};

const writeFile = async (path, content) => {
  const toString = JSON.stringify(content);
  await fs.writeFile(path, toString);
};

module.exports = {
  generateToken,
  readFile,
  writeFile,
};
