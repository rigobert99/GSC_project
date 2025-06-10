import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";

export default function HistoriqueCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [recherche, setRecherche] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/commandes");
        const data = await res.json();
        setCommandes(data);
      } catch (err) {
        console.error("Erreur chargement commandes", err);
      }
    };

    fetchCommandes();
  }, []);

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("fr-FR");
  };

  const getColorStatut = (statut) => {
    if (statut === "Reçu") return "text-green-600";
    if (statut === "Annulé") return "text-red-600";
    return "text-gray-500";
  };

  const commandesFiltrees = commandes.filter((c) =>
    c.numero.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-400 p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/commande")}
          className="bg-white text-blue-700 px-4 py-2 rounded shadow"
        >
          ← Retour
        </button>
        <h1 className="text-xl font-bold text-white ml-6">Historique des commandes</h1>
      </div>

      <div className="bg-white rounded shadow p-4 max-w-5xl mx-auto overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="🔍 Recherche"
            className="border p-2 rounded w-1/3"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
          <div className="flex gap-2">
            <select className="border p-2 rounded">
              <option>Statut</option>
              <option>En cours</option>
              <option>Reçu</option>
              <option>Annulé</option>
            </select>
            <input
              type="date"
              className="border p-2 rounded"
              placeholder="jj/mm/aaaa"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-300">
              <th className="py-2">Nom de la commande</th>
              <th className="py-2">Date</th>
              <th className="py-2">Prix</th>
              <th className="py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {commandesFiltrees.map((c, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 flex items-center gap-2">
                  <Package className="text-gray-600" size={20} />
                  <span className="font-medium">Commande N°{c.numero}</span>
                </td>
                <td className="py-2">{formatDate(c.date)}</td>
                <td className="py-2">{c.total} AED</td>
                <td className={`py-2 font-semibold ${getColorStatut(c.statut)}`}>
                  {c.statut || "En cours"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
