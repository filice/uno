const canPlay = (card, discardTop) => {
  if (!discardTop) return;

  return !card.colour ||
         !discardTop.colour ||
         card.colour === discardTop.colour;
};

module.exports = {
  canPlay,
};
