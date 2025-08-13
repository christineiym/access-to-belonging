import { useEffect, useState } from "react";
import FlipCardStack from "./FlipCardStack";
import CardTurnGenerator from "./CardTurnGenerator";

export default function InteractiveCardDeck() {
  const [data, setData] = useState(null);
  const [turnGenerator, setTurnGenerator] = useState(null);

  useEffect(() => {
    fetch("./cards.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        // const currentCardTurnGenerator = new CardTurnGenerator({
        //   validTurnValues: json,
        //   minMove: -1,
        //   maxMove: -1,
        //   drawWithoutReplacement: true,
        //   reuseDeck: true,
        // });
        // setTurnGenerator(currentCardTurnGenerator);
      });
  }, []);

  if (!data) return <div className="p-10">Loading cards...</div>;  // vs. try again later?

  return (
    <div className="flex flex-col gap-10">
        <FlipCardStack type="Scenario" allCards={data.scenarioCards} />
        <FlipCardStack type="Persona" allCards={data.personaCards} />
    </div>
  );
}