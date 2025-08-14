import TurnGenerator from "./TurnGenerator";

export default class CardTurnGenerator extends TurnGenerator {
  constructor(props) {
    super({ ...props });
    this.state = { deck: [...this.validTurnValues] };
  }
  
  generateTurn() {
    let { deck } = this.state;
    if (deck.length === 0 && this.reuseDeck) {
      deck = [...this.validTurnValues];
    }
    const idx = Math.floor(Math.random() * deck.length);
    const card = deck[idx];
    deck.splice(idx, 1);
    this.setState({ deck });
    return card.num;
  }
}