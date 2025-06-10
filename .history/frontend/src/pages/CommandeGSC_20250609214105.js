import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Bell, User } from "lucide-react";

export default function CommandeGSC() {
  const navigate = useNavigate();
  const location = useLocation();

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

  // Fonction pour détecter la page active dans la navbar
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR EN-TÊTE */}
      <header className="bg-white shadow-md flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">GSC</h1>
          <p className="text-xs text-gray-600">GLOBAL SERVICES & CONSULTING</p>
        </div>
        <nav className="flex-1 mx-10">
          <ul className="flex justify-center gap-10 font-semibold text-gray-700">
            <li>
              <Link
                to="/dashboard"
                className={
                  isActive("/dashboard")
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "hover:text-blue-700"
                }
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/commande"
                className={
                  isActive("/commande")
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "hover:text-blue-700"
                }
              >
                Commande
              </Link>
            </li>
            <li>
              <Link
                to="/suivi"
                className={
                  isActive("/suivi")
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "hover:text-blue-700"
                }
              >
                Suivi des Commandes
              </Link>
            </li>
            <li>
              <Link
                to="/parametre"
                className={
                  isActive("/parametre")
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "hover:text-blue-700"
                }
              >
                Paramètre
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex gap-4">
          <Bell className="w-5 h-5" />
          <User className="w-5 h-5" />
        </div>
      </header>

      {/* CONTENU DES CARTES */}
      <div className="bg-blue-400 py-12">
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
    </div>
  );
}
