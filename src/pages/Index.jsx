import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Index = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const head = snake[0];
      const newDirection = { x: 0, y: 0 };

      if (Math.abs(mouseX - head.x * 20) > Math.abs(mouseY - head.y * 20)) {
        newDirection.x = mouseX > head.x * 20 ? 1 : -1;
      } else {
        newDirection.y = mouseY > head.y * 20 ? 1 : -1;
      }

      setDirection(newDirection);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [snake]);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (head.x === food.x && head.y === food.y) {
          newSnake.push({});
          setFood({
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
          });
        }

        for (let i = newSnake.length - 1; i > 0; i--) {
          newSnake[i] = { ...newSnake[i - 1] };
        }

        newSnake[0] = head;

        if (
          head.x < 0 ||
          head.x >= 20 ||
          head.y < 0 ||
          head.y >= 20 ||
          newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setIsGameOver(true);
          toast.error("Game Over!");
          return prevSnake;
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, food, isGameOver]);

  const handleRestart = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setIsGameOver(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "green";
    snake.forEach((segment) => {
      ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Snake Game</CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            width="400"
            height="400"
            className="border border-gray-300"
          ></canvas>
          {isGameOver && (
            <div className="text-center mt-4">
              <Button onClick={handleRestart}>Restart Game</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;