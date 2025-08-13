import { useMemo, useState } from "react";
import ChutesLaddersBoard from "./ChutesLaddersBoard";
import InteractiveCards from "./InteractiveCards";

// let currentMovers = {
//     "chutes": [],
//     "ladders": []
// }

// const ladders = [
//     { from: 47, to: 50 },
//     { from: 43, to: 54 },
//     { from: 11, to: 25 },
//     { from: 12, to: 20 },
//     { from: 13, to: 5 },
// ];
// const slides = [
//     { from: 45, to: 61 },
//     { from: 34, to: 18 },
//     { from: 36, to: 28 },
//     { from: 30, to: 22 },
// ];
// const currentMovers = {
//     "chutes": slides,
//     "ladders": ladders
// }


export default function ChutesLadders() {

    const minWidth = 10;
    const maxWidth = 14;

    const generateMovers = (edgeLength) => {
        console.log("generating");
        /* Constants **/
        const maxPos = edgeLength ** 2;
        const maxMovers = Math.floor(maxPos / 4);
        const minMovers = Math.floor(maxPos / 10);

        /* Utilities **/
        const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        // https://stackoverflow.com/questions/12987719/javascript-how-to-randomly-sample-items-without-replacement
        var positionBucket = [];
        for (let i = 1; i < maxPos - 1; i++) {  // nothing on start or end
            positionBucket.push(i + 1);
        }
        const getRandomFromBucket = () => {
            var randomIndex = Math.floor(Math.random() * positionBucket.length);
            return positionBucket.splice(randomIndex, 1)[0];
        }

        /* Movers **/
        const movers = { chutes: [], ladders: [] };
        const totalMovers = randInt(minMovers, maxMovers);  // Later: Ensure at least one chute and one ladder
        for (let i = 0; i < totalMovers; i++) {
            let isChute = Math.random() < 0.5;
            let from = getRandomFromBucket(1, maxPos);
            let to = isChute
                ? randInt(1, from - 1)
                : randInt(from + 1, maxPos);
            let width = minWidth + Math.random() * (maxWidth - minWidth);

            let mover = { from, to, width };
            if (mover) {
                movers[isChute ? "chutes" : "ladders"].push(mover);
            }
        }

        console.log(movers);
        return movers;
    }

    let currentEdgeLength = 8;
    let currentMovers = generateMovers(currentEdgeLength);

    return (
        // Outer area
        <div className="flex flex-col md:flex-row items-center justify-center bg-gray-100 p-10 gap-8 space-y-0">
            {/* Base board */}
            <ChutesLaddersBoard edgeLength={currentEdgeLength}
                chutes={currentMovers.chutes}
                ladders={currentMovers.ladders}
            />

            {/* Cards */}
            <InteractiveCards></InteractiveCards>
        </div>
    )
}