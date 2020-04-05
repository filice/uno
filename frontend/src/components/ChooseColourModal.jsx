import React from 'react';

import '../styles/chooseColourModal.scss';
import Card from './Card';
import { COLOURS } from '../../../shared';

const ChooseColourModal = ({ show, hideChooseColourModal }) => {
  const type = show;

  return (
    <div className={`modal ${show ? 'show' : 'hide'}`}>
      <h4 style="color: #000">Choose colour...</h4>
      <hr />
      <div id="cards">
        {COLOURS.map((col, i) => (
          <Card key={i}
                type={type}
                colour={col}
                enabled={true}
                inHand={true}
                hideChooseColourModal={hideChooseColourModal}
          />
        ))}
      </div>
    </div>
  );
};

export default ChooseColourModal;
