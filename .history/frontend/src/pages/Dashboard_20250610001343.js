import React from "react";
import { Link } from "react-router-dom";
import { Bell, UserCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="bg-blue-400 min-h-screen">
      {/* Navbar */}
      <header className="bg-white py-4 px-8 shadow flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-blue-600">GSC</div>
          <div className="text-xs text-gray-500">GLOBAL SERVICES & CONSULTING</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mx-10">
          <ul className="flex justify-center gap-10 font-semibold text-gray-700">
            <li>
              <Link to="/dashboard" className="text-blue-700 border-b-2 border-blue-700">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/commandes-transitaire" className="hover:text-blue-700">
                Commande
              </Link>
            </li>
            <li>
              <Link to="/suivi" className="hover:text-blue-700">
                Suivi des Commandes
              </Link>
            </li>
            <li>
              <Link to="/parametre" className="hover:text-blue-700">
                Paramètre
              </Link>
            </li>
          </ul>
        </nav>

        {/* Icônes utilisateur */}
        <div className="flex items-center gap-4 text-gray-600">
          <Bell className="w-6 h-6 cursor-pointer" />
          <UserCircle className="w-8 h-8 cursor-pointer" />
        </div>
      </header>

      {/* Corps du dashboard */}
      <main className="p-8 max-w-5xl mx-auto">
        {/* Indicateur circulaire */}
        <div className="bg-blue-500 text-white rounded-lg p-6 mb-8 flex flex-col items-center justify-center">
          <div className="w-32 h-32 rounded-full border-8 border-blue-700 flex items-center justify-center text-2xl font-bold">
            80%
          </div>
          <div className="mt-4 text-lg font-semibold">Dernière commande</div>
        </div>

        {/* Historique */}
        <section className="bg-white rounded-lg p-6 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Historique</h2>
            <input
              type="text"
              placeholder="Rechercher une commande..."
              className="border rounded px-3 py-1 text-sm"
            />
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-2">Commande</th>
                <th className="p-2">Date</th>
                <th className="p-2">Prix (AED)</th>
                <th className="p-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {/* Exemple de ligne */}
              <tr className="border-t text-center">
                <td className="p-2 flex items-center justify-center gap-2">📦 Commande N°00227845</td>
                <td className="p-2">25/05/2025</td>
                <td className="p-2">500</td>
                <td className="p-2 text-green-600 font-bold">Reçu</td>
              </tr>
              {/* Tu peux insérer ici une map() plus tard */}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
