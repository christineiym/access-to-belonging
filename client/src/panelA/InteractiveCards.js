import { useEffect, useState } from "react";
import FlipCardStack from "./FlipCardStack";

export default function InteractiveCardDeck({ onCardDraw }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/access-to-belonging/cards.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      });
  }, []);

  if (!data) return <div className="p-10">Loading cards...</div>;  // vs. try again later?

  const bubbleUpResult = (type, result) => {
    if (onCardDraw) {
      onCardDraw(type, result); // Bubble up to Game
    }
  }  // should probably memo-ize


  return (
    <div className="flex flex-col gap-10">
        <FlipCardStack type="Scenario"
          allCards={data.scenarioCards}
          onDraw={bubbleUpResult}
        />
        <FlipCardStack type="Persona"
          allCards={data.personaCards}
          onDraw={bubbleUpResult}
        />
    </div>
  );
}
