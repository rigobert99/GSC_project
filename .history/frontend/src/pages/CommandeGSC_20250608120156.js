import React from "react";
import { useNavigate } from "react-router-dom";

export default function CommandeGSC() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Créer une commande",
      icon: "➕",
      action: () => navigate("/commande/creer"),
    },
    {
      title: "Modifier une commande",
      icon: "📝",
      action: () => navigate("/commande/modifier"),
    },
    {
      title: "Historique des commandes",
      icon: "📄",
      action: () => navigate("/commande/historique"),
    },
  ];

  return (
    <div className="min-h-screen bg-blue-400 p-8">
      <div className="max-w-5xl mx-auto flex justify-center gap-8 flex-wrap">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.action}
            className="cursor-pointer bg-white w-60 h-60 rounded-xl shadow-md flex flex-col items-center justify-center hover:scale-105 transition"
          >
            <div className="text-5xl mb-4">{card.icon}</div>
            <p className="text-center text-lg font-semibold text-gray-700">
              {card.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
