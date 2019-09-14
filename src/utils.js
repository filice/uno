const genId = () => String(Math.floor(Math.random() * 90000) + 10000);

const genUniqueId = games => {
  let id = genId();
  while (games.count({ id }) > 0) {
    id = genId();
  }
  return genId();
};

module.exports = {
  genUniqueId,
};
