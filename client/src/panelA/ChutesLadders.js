import { useEffect, useState } from "react";
import ChutesLaddersStart from "./ChutesLaddersStart";
import ChutesLaddersPlay from "./ChutesLaddersPlay";


// todo: put state variables into session/localStorage
export default function ChutesLadders() {
    const [mode, setMode] = useState("start");
    const [startButtonPressed, setStartButtonPressed] = useState(false);
    const [settings, setSettings] = useState(null);
    // const [gameResetKey, setGameResetKey] = useState(100);

    const handleStart = ({ gameMode, numPlayers, edgeLength }) => {
        // Build the new settings object in one go
        const newSettings = {
            numPlayers: gameMode === "single" ? 2 : numPlayers,
            bot: gameMode === "single",
            edgeLength: edgeLength,
        };
        setSettings(newSettings);
        setStartButtonPressed(true);
    };

    const allPropertiesDefined = (obj) => {
        // Get an array of all the values of the object's own enumerable properties.
        const values = Object.values(obj)

        // Check if every value in the array is not strictly equal to undefined.
        return values.every(value => value !== undefined);
    }

    useEffect(() => {
        if (startButtonPressed && settings !== null && allPropertiesDefined(settings)) {  // ensure play mode is not activated on mount
            setMode("play");
        } else {
            setMode("start");
        }
    }, [startButtonPressed, settings]);

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-10 gap-4 space-y-0">
            {mode === "start" && <ChutesLaddersStart onStart={handleStart} />}

            {mode === "play" && (
                <ChutesLaddersPlay
                    numPlayers={settings.numPlayers}
                    bot={settings.bot}
                    edgeLength={settings.edgeLength}
                />
            )}
        </div>
    );
}