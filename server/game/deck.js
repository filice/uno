const utils = require('../utils.js');

const COLOURS = ['red', 'yellow', 'green', 'blue'];
const CARDS_PER_COLOUR = [
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

// Returns a full, unshuffled deck
const getFullDeck = () => {
  let deck = [
    ...Array(4).fill({
      type: 'wild',
      colour: null,
    }),
    ...Array(4).fill({
      type: '+4',
      colour: null,
    }),
  ];

  for (const colour of COLOURS) {
    // Add zeros
    deck.push({
      type: 'zero',
      colour,
    });

    // Add other cards
    for (const card of CARDS_PER_COLOUR) {
      deck.push(...Array(2).fill({
        type: card,
        colour,
      }));
    }
  }

  return deck;
};

// Returns a full shuffled deck
const getShuffledDeck = () => {
  return utils.shuffleArray(getFullDeck());
};

module.exports = { getShuffledDeck };
