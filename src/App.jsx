import React, { useState, useEffect } from "react";
import Card from "./components/Card";

const symbols = ["🍕", "🍔", "🍟", "🌭", "🍿", "🥤", "🍩", "🍪"];

function generateCards(list) {
  return [...list, ...list]
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({
      id: index,
      symbol,
      flipped: false,
      matched: false,
    }));
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setCards(generateCards(symbols));
  }, []);

  function resetGame() {
    setCards(generateCards(symbols));
    setFirstCard(null);
    setDisabled(false);
  }
  function resetTurn() {
    setFirstCard(null);
    setDisabled(false);
  }
  function handleCardClick(card) {
    if (disabled || card.flipped || card.matched) return;

    const updatedCards = cards.map((e) =>
      e.id == card.id ? { ...e, flipped: true } : e
    );
    setCards(updatedCards);
    if (!firstCard) {
      setFirstCard(card);
    } else {
      setDisabled(true);
      if (firstCard.symbol === card.symbol) {
        setCards((prev) =>
          prev.map((e) =>
            e.symbol === card.symbol ? { ...e, matched: true } : e
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((e) =>
              e.id === firstCard.id || e.id === card.id
                ? { ...e, flipped: false }
                : e
            )
          );
          resetTurn();
        }, 1000);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[#2112f3] to-[#01012b]">
      <h1 className="text-5xl font-bold mb-8 text-white">Memory Game</h1>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
      <button
        onClick={resetGame}
        className="mt-6 border-2 px-6 py-2 bg-[green] rounded-xl text-xl font-bold text-white"
      >
        Restart
      </button>
    </div>
  );
}
