import { useEffect, useState } from "react";
import FlipCardStack from "./FlipCardStack";

export default function InteractiveCardDeck() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/cards.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);});
  }, []);

  if (!data) return <div className="p-10">Loading cards...</div>;  // vs. try again later?

  //spare style classes: sm:flex-wrap sm:justify-center 
  return (
<div className="flex flex-col gap-10">
        <FlipCardStack type="Scenario" allCards={data.scenarioCards} />
        <FlipCardStack type="Persona" allCards={data.personaCards} />
    </div>
  );
}