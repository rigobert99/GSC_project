import React, { useEffect, useState } from "react";

export default function HistoriqueCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [filtreDate, setFiltreDate] = useState("");
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/commandes")
      .then((res) => res.json())
      .then((data) => setCommandes(data))
      .catch((err) => console.error("Erreur chargement commandes :", err));
  }, []);

  // Fonction pour filtrer les commandes
  const commandesFiltrees = commandes.filter((commande) => {
    // ✅ Filtrer par statut
    const matchStatut = filtreStatut === "Tous" || commande.statut === filtreStatut;

    // ✅ Filtrer par date
    const matchDate = !filtreDate || commande.date.startsWith(filtreDate);

    // ✅ Filtrer par recherche fournisseur/produit
    const rechercheLower = recherche.toLowerCase();
    const matchRecherche =
      !recherche ||
      commande.fournisseurs?.some((f) =>
        f.nom.toLowerCase().includes(rechercheLower) ||
        f.produits?.some((p) => p.nom.toLowerCase().includes(rechercheLower))
      );

    return matchStatut && matchDate && matchRecherche;
  });

  return (
    <div className="bg-blue-400 min-h-screen p-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Rechercher fournisseur ou produit..."
            className="border px-4 py-2 rounded w-full md:w-1/3"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/4"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="en cours">En cours</option>
            <option value="reçu">Reçu</option>
            <option value="annulé">Annulé</option>
          </select>
          <input
            type="date"
            value={filtreDate}
            onChange={(e) => setFiltreDate(e.target.value)}
            className="border px-4 py-2 rounded w-full md:w-1/4"
          />
        </div>

        <table className="w-full mt-6 border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-4 py-2">Commande</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Prix (AED)</th>
              <th className="border px-4 py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {commandesFiltrees.map((commande, index) => (
              <tr key={index} className="text-center bg-white">
                <td className="border px-4 py-2 flex items-center gap-2 justify-center">
                  📦 Commande N°{commande.numero}
                </td>
                <td className="border px-4 py-2">{commande.date}</td>
                <td className="border px-4 py-2">{commande.total || "—"}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      commande.statut === "reçu"
                        ? "bg-green-500"
                        : commande.statut === "annulé"
                        ? "bg-red-500"
                        : "bg-black"
                    }`}
                  >
                    {commande.statut}
                  </span>
                </td>
              </tr>
            ))}

            {commandesFiltrees.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  Aucune commande trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
