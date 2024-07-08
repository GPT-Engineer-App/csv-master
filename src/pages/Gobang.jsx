import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const BOARD_SIZE = 9;

const Gobang = () => {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState("black");
  const [winner, setWinner] = useState(null);

  const handleCellClick = (row, col) => {
    if (board[row][col] || winner) return;

    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? currentPlayer : cell))
    );

    setBoard(newBoard);
    checkWinner(newBoard, row, col, currentPlayer);
    setCurrentPlayer(currentPlayer === "black" ? "red" : "black");
  };

  const checkWinner = (board, row, col, player) => {
    const directions = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
    ];

    for (let { x, y } of directions) {
      let count = 1;

      for (let i = 1; i < 5; i++) {
        const newRow = row + i * y;
        const newCol = col + i * x;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      for (let i = 1; i < 5; i++) {
        const newRow = row - i * y;
        const newCol = col - i * x;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      if (count >= 5) {
        setWinner(player);
        toast.success(`${player.charAt(0).toUpperCase() + player.slice(1)} wins!`);
        return;
      }
    }
  };

  const handleRestart = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    setCurrentPlayer("black");
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Gobang Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-9 gap-0.5 bg-yellow-800 p-2">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`w-8 h-8 border border-gray-900 flex items-center justify-center cursor-pointer ${
                    cell === "black" ? "bg-black rounded-full" : cell === "red" ? "bg-red-500 rounded-full" : ""
                  }`}
                ></div>
              ))
            )}
          </div>
          {winner && (
            <div className="text-center mt-4">
              <Button onClick={handleRestart}>Restart Game</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Gobang;