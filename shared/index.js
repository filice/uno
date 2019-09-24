const COLOURS = ['red', 'yellow', 'green', 'blue'];
const CARD_TYPES = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'skip',
  'reverse',
  '+2',
];

const canPlay = (card, discardTop) => {
  if (!discardTop) return;

  return !card.colour ||
         !discardTop.colour ||
         card.colour === discardTop.colour;
};

const sortHand = hand => {
  return hand.slice().sort((a, b) => (
    CARD_TYPES.indexOf(a.type) - CARD_TYPES.indexOf(b.type)
  )).sort((a, b) => {
    if (!a.colour) return -1;
    if (!b.colour) return 1;
    return COLOURS.indexOf(a.colour) - COLOURS.indexOf(b.colour);
  });
};

module.exports = {
  COLOURS,
  CARD_TYPES,
  canPlay,
  sortHand,
};
