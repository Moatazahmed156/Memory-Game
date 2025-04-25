import React from "react";

export default function Card({ card, onClick }) {
  return (
    <div
      className={`w-[5.4rem] h-[5.4rem] cursor-pointer text-3xl flex items-center justify-center rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.7)] ${
        card.flipped || card.matched ? "bg-white" : "bg-gray-400"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-full">
        {card.flipped || card.matched ? card.symbol : "❓"}
      </div>
    </div>
  );
}
