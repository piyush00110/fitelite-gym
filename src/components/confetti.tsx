"use client";

import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
}

const colors = [
  "bg-amber-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-orange-500",
];

export function ConfettiEffect({ trigger }: { trigger: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const newPieces: ConfettiPiece[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 40,
      y: 50 + (Math.random() - 0.5) * 20,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 300,
    }));

    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 2000);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      {pieces.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.color} rounded-sm animate-confetti`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: "8px",
            height: "8px",
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
