"use client";
import { useEffect, useState } from "react";

type Player = {
  name: string;
  scores: number[];
};

export default function CuccheKeeper() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [names, setNames] = useState(["", "", "", ""]);
  const [roundPoints, setRoundPoints] = useState<number[]>([0, 0, 0, 0]);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Load from localStorage
// Load from localStorage
useEffect(() => {
  const data = localStorage.getItem("cucche-game");
  if (data) {
    try {
      const parsed = JSON.parse(data);

      if (Array.isArray(parsed)) {
        // Old format: saved players array directly
        setPlayers(parsed);
        setGameStarted(parsed.length > 0);
      } else if (parsed && parsed.players) {
        // New format: { players, winner }
        setPlayers(parsed.players);
        setWinner(parsed.winner || null);
        setGameStarted(parsed.players.length > 0);
      }
    } catch (err) {
      console.error("Failed to parse saved game", err);
    }
  }
}, []);

  // Save to localStorage
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem(
        "cucche-game",
        JSON.stringify({ players, winner })
      );
    }
  }, [players, winner]);

  const startGame = () => {
    const initialized = names.map((n) => ({ name: n || "Player", scores: [] }));
    setPlayers(initialized);
    setGameStarted(true);
  };

  const clearGame = () => {
    setPlayers([]);
    setNames(["", "", "", ""]);
    setRoundPoints([0, 0, 0, 0]);
    setGameStarted(false);
    setWinner(null);
    localStorage.removeItem("cucche-game");
  };

  const checkWinner = (updatedPlayers: Player[]) => {
    const totals = updatedPlayers.map((p) =>
      p.scores.reduce((a, b) => a + b, 0)
    );
    const index = totals.findIndex((t) => t >= 20);
    if (index !== -1) {
      setWinner(updatedPlayers[index].name);
    }
  };

  const handleNormalSave = () => {
    if (winner) return; // stop if game over

    const total = roundPoints.reduce((a, b) => a + b, 0);
    if (total > 4) {
      alert("Normal round total cannot exceed 4 points!");
      return;
    }
    const updated = players.map((p, i) => ({
      ...p,
      scores: [...p.scores, roundPoints[i]],
    }));
    setPlayers(updated);
    setRoundPoints([0, 0, 0, 0]);
    checkWinner(updated);
  };

  const handleSpecialCase = (playerIndex: number, points: number) => {
    if (winner) return; // stop if game over

    const updated = players.map((p, i) => ({
      ...p,
      scores: [...p.scores, i === playerIndex ? points : 0],
    }));
    setPlayers(updated);
    setRoundPoints([0, 0, 0, 0]);
    checkWinner(updated);
  };
const deleteLastRound = () => {
  if (players.length === 0 || players[0].scores.length === 0) return;

  const updated = players.map((p) => ({
    ...p,
    scores: p.scores.slice(0, -1), // remove last entry
  }));

  setPlayers(updated);

  // Recalculate totals
  const totals = updated.map((p) => p.scores.reduce((a, b) => a + b, 0));
  const index = totals.findIndex((t) => t >= 20);

  if (index !== -1) {
    setWinner(updated[index].name);
  } else {
    setWinner(null); // clear winner if no one has >=20 anymore
  }
};

  const totals = players.map((p) => p.scores.reduce((a, b) => a + b, 0));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {!gameStarted ? (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-center">Start Cucche Game</h1>
          {names.map((n, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Player ${i + 1} name`}
              value={n}
              onChange={(e) =>
                setNames((prev) => {
                  const copy = [...prev];
                  copy[i] = e.target.value;
                  return copy;
                })
              }
              className="border p-2 rounded w-full"
            />
          ))}
          <button
            onClick={startGame}
            className="w-full bg-green-600 text-white px-4 py-3 rounded text-lg"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center">Cucche Scorekeeper</h1>

          {/* Winner Display */}
          {winner && (
            <div className="p-4 bg-yellow-300 text-center text-xl font-bold rounded">
              🏆 Winner: {winner} 🎉
            </div>
          )}

          {/* Score Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Round</th>
                  {players.map((p, i) => (
                    <th key={i} className="border p-2">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players[0].scores.map((_, roundIndex) => (
                  <tr key={roundIndex}>
                    <td className="border p-2 text-center">
                      {roundIndex + 1}
                    </td>
                    {players.map((p, i) => (
                      <td key={i} className="border p-2 text-center">
                        {p.scores[roundIndex]}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="font-bold bg-gray-50">
                  <td className="border p-2 text-center">Total</td>
                  {totals.map((t, i) => (
                    <td key={i} className="border p-2 text-center">
                      {t}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Normal Round Entry */}
          {!winner && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Normal Round</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {players.map((p, i) => (
                  <input
                    key={i}
                    type="number"
                    min={0}
                    max={4}
                    value={roundPoints[i]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setRoundPoints((prev) => {
                        const copy = [...prev];
                        copy[i] = value;
                        return copy;
                      });
                    }}
                    className="border p-2 rounded text-center"
                  />
                ))}
              </div>
              <button
                onClick={handleNormalSave}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded text-lg"
              >
                Save Normal Round
              </button>
              {/* Delete Last Round */}
<button
  onClick={deleteLastRound}
  className="w-full bg-yellow-600 text-white px-4 py-3 rounded text-lg"
>
   Delete Last Round
</button>

            </div>
          )}

          {/* Special Cases */}
          {!winner && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Special Cases</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {players.map((p, i) => (
                  <div key={i} className="space-y-1">
                    <div className="font-medium text-center">{p.name}</div>
                    <button
                      onClick={() => handleSpecialCase(i, 4)}
                      className="bg-purple-600 text-white px-2 py-2 rounded w-full"
                    >
                      Cucche (4 pts)
                    </button>
                    <button
                      onClick={() => handleSpecialCase(i, 6)}
                      className="bg-pink-600 text-white px-2 py-2 rounded w-full"
                    >
                      6 Pairs (6 pts)
                    </button>
                    <button
                      onClick={() => handleSpecialCase(i, 10)}
                      className="bg-orange-600 text-white px-2 py-2 rounded w-full"
                    >
                      3 Trials (10 pts)
                    </button>
                    <button
                      onClick={() => handleSpecialCase(i, 5)}
                      className="bg-red-600 text-white px-2 py-2 rounded w-full"
                    >
                      Winner 5 Hands (5 pts)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clear Game */}
          <button
            onClick={clearGame}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded text-lg"
          >
            Clear Game
          </button>
        </div>
      )}
    </div>
  );
}
