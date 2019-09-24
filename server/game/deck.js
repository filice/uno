const utils = require('../utils.js');
const shared = require('../../shared');

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

  for (const colour of shared.COLOURS) {
    // Add zeros
    deck.push({
      type: 'zero',
      colour,
    });

    // Add other cards
    for (const card of shared.CARD_TYPES) {
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
