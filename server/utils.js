const genId = () => String(Math.floor(Math.random() * 90000) + 10000);

const genUniqueId = games => {
  let id = genId();
  while (games.count({ id }) > 0) {
    id = genId();
  }
  return genId();
};

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
const shuffleArray = origArr => {
  let a = origArr.slice();
  for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
  return a;
};

module.exports = {
  genUniqueId,
  shuffleArray,
};
