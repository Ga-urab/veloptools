"use client";
import { useEffect, useState } from "react";

type Player = {
  name: string;
  scores: number[];
  bids: number[];
};

export default function CallBreak() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [names, setNames] = useState(["", "", "", ""]);
  const [roundTricks, setRoundTricks] = useState<number[]>([0, 0, 0, 0]);
  const [roundBids, setRoundBids] = useState<number[]>([0, 0, 0, 0]);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const TARGET_POINTS = 50; // you can make this configurable

  // Load from localStorage
  useEffect(() => {
    const data = localStorage.getItem("callbreak-game");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && parsed.players) {
          setPlayers(parsed.players);
          setWinner(parsed.winner || null);
          setGameStarted(parsed.players.length > 0);
        }
      } catch {
        console.warn("Failed to parse call break data");
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem(
        "callbreak-game",
        JSON.stringify({ players, winner })
      );
    }
  }, [players, winner]);

  const startGame = () => {
    const initialized = names.map((n) => ({
      name: n || "Player",
      scores: [],
      bids: [],
    }));
    setPlayers(initialized);
    setGameStarted(true);
  };

  const clearGame = () => {
    setPlayers([]);
    setNames(["", "", "", ""]);
    setRoundTricks([0, 0, 0, 0]);
    setRoundBids([0, 0, 0, 0]);
    setWinner(null);
    setGameStarted(false);
    localStorage.removeItem("callbreak-game");
  };

  const deleteLastRound = () => {
    if (players.length === 0 || players[0].scores.length === 0) return;
    const updated = players.map((p) => ({
      ...p,
      scores: p.scores.slice(0, -1),
      bids: p.bids.slice(0, -1),
    }));
    setPlayers(updated);
    const totals = updated.map((p) => p.scores.reduce((a, b) => a + b, 0));
    const idx = totals.findIndex((t) => t >= TARGET_POINTS);
    if (idx !== -1) setWinner(updated[idx].name);
    else setWinner(null);
  };

  const addRound = () => {
    if (winner) return; // stop if game over
    const totalTricks = roundTricks.reduce((a, b) => a + b, 0);
    if (totalTricks !== 13) {
      alert("Total tricks must be exactly 13!");
      return;
    }

    const updated = players.map((p, i) => ({
      ...p,
      scores: [...p.scores, roundTricks[i]], // optional: adjust score based on bid
      bids: [...p.bids, roundBids[i]],
    }));

    setPlayers(updated);
    setRoundTricks([0, 0, 0, 0]);
    setRoundBids([0, 0, 0, 0]);

    const totals = updated.map((p) => p.scores.reduce((a, b) => a + b, 0));
    const idx = totals.findIndex((t) => t >= TARGET_POINTS);
    if (idx !== -1) setWinner(updated[idx].name);
  };

  const totals = players.map((p) => p.scores.reduce((a, b) => a + b, 0));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {!gameStarted ? (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-center">Call Break Game</h1>
          {names.map((n, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Player ${i + 1} Name`}
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
          <h1 className="text-2xl font-bold text-center">Call Break Scorekeeper</h1>

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
                    <th key={i} className="border p-2">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players[0].scores.map((_, roundIndex) => (
                  <tr key={roundIndex}>
                    <td className="border p-2 text-center">{roundIndex + 1}</td>
                    {players.map((p, i) => (
                      <td key={i} className="border p-2 text-center">
                        {p.scores[roundIndex]} ({p.bids[roundIndex]})
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="font-bold bg-gray-50">
                  <td className="border p-2 text-center">Total</td>
                  {totals.map((t, i) => (
                    <td key={i} className="border p-2 text-center">{t}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Round Input */}
          {!winner && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Enter Round</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {players.map((p, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-center font-medium">{p.name}</div>
                    <input
                      type="number"
                      min={0}
                      max={13}
                      placeholder="Tricks"
                      value={roundTricks[i]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setRoundTricks((prev) => {
                          const copy = [...prev];
                          copy[i] = value;
                          return copy;
                        });
                      }}
                      className="border p-2 rounded w-full text-center"
                    />
                    <input
                      type="number"
                      min={0}
                      max={13}
                      placeholder="Bid"
                      value={roundBids[i]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setRoundBids((prev) => {
                          const copy = [...prev];
                          copy[i] = value;
                          return copy;
                        });
                      }}
                      className="border p-2 rounded w-full text-center"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={addRound}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded text-lg"
              >
                Save Round
              </button>
            </div>
          )}

          {/* Actions */}
          <button
            onClick={deleteLastRound}
            className="w-full bg-yellow-600 text-white px-4 py-3 rounded text-lg"
          >
            ⬅️ Delete Last Round
          </button>
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
