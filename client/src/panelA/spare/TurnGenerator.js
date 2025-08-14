// interfaces don't exist in JS
export default class TurnGenerator extends Object {
  constructor(props) {
    super(props);
    const { validTurnValues, minMove, maxMove, drawWithoutReplacement, reuseDeck } = props || {};
    this.validTurnValues = validTurnValues;
    this.minMove = minMove;
    this.maxMove = maxMove;
    this.drawWithoutReplacement = drawWithoutReplacement;
    this.reuseDeck = reuseDeck;
  }
  
  generateTurn() {
    throw new Error("generateTurn() must be implemented by subclass");
  }
}