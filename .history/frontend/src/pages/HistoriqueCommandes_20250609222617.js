import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, X, Filter, Search } from "lucide-react";

export default function HistoriqueCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [statutFiltre, setStatutFiltre] = useState("Tous");
  const [dateFiltre, setDateFiltre] = useState("");
  const [typeDateFiltre, setTypeDateFiltre] = useState("apres");
  const [chargement, setChargement] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        setChargement(true);
        const res = await fetch("http://localhost:5000/api/commandes");
        const data = await res.json();
        setCommandes(data);
      } catch (err) {
        console.error("Erreur chargement commandes", err);
      } finally {
        setChargement(false);
      }
    };

    fetchCommandes();
  }, []);

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("fr-FR");
  };

  const getColorStatut = (statut) => {
    if (statut === "Reçu") return "text-green-600 bg-green-100 px-2 py-1 rounded-full";
    if (statut === "Annulé") return "text-red-600 bg-red-100 px-2 py-1 rounded-full";
    return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full";
  };

  const filtrerCommandes = (commande) => {
    // Filtre par recherche
    const matchRecherche = 
      recherche === "" || 
      commande.numero.toLowerCase().includes(recherche.toLowerCase()) ||
      commande.client?.toLowerCase().includes(recherche.toLowerCase());
    
    // Filtre par statut
    const statutCommande = commande.statut || "En cours";
    const matchStatut = 
      statutFiltre === "Tous" || 
      statutCommande === statutFiltre;
    
    // Filtre par date
    let matchDate = true;
    if (dateFiltre) {
      const dateCommande = new Date(commande.date);
      const dateFiltreObj = new Date(dateFiltre);
      
      dateFiltreObj.setHours(0, 0, 0, 0);
      
      switch (typeDateFiltre) {
        case "apres":
          matchDate = dateCommande >= dateFiltreObj;
          break;
        case "avant":
          matchDate = dateCommande <= dateFiltreObj;
          break;
        case "exacte":
          // Comparaison des dates seulement (ignorer l'heure)
          const dateCommandeStr = dateCommande.toISOString().split('T')[0];
          const dateFiltreStr = dateFiltreObj.toISOString().split('T')[0];
          matchDate = dateCommandeStr === dateFiltreStr;
          break;
        default:
          matchDate = true;
      }
    }
    
    return matchRecherche && matchStatut && matchDate;
  };

  const reinitialiserFiltres = () => {
    setRecherche("");
    setStatutFiltre("Tous");
    setDateFiltre("");
    setTypeDateFiltre("apres");
  };

  const commandesFiltrees = commandes.filter(filtrerCommandes);
  
  // Statistiques pour l'affichage
  const totalCommandes = commandes.length;
  const commandesFiltreesCount = commandesFiltrees.length;
  const statuts = ["En cours", "Reçu", "Annulé"];
  
  // Calcul des compteurs par statut
  const compteurStatuts = statuts.reduce((acc, statut) => {
    acc[statut] = commandes.filter(c => (c.statut || "En cours") === statut).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/commande")}
          className="bg-white text-blue-700 px-4 py-2 rounded-lg shadow-md hover:bg-blue-50 transition flex items-center"
        >
          ← Retour
        </button>
        <h1 className="text-2xl font-bold text-white ml-6">Historique des commandes</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par numéro ou client..."
              className="border border-gray-300 pl-10 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
          
          <button
            onClick={reinitialiserFiltres}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
          >
            <X size={18} />
            <span>Réinitialiser</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Filtre par statut */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="text-blue-500" size={20} />
              <h3 className="font-semibold text-gray-700">Statut</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {["Tous", ...statuts].map((statut) => (
                <button
                  key={statut}
                  onClick={() => setStatutFiltre(statut)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    statutFiltre === statut
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {statut} {statut !== "Tous" && `(${compteurStatuts[statut] || 0})`}
                </button>
              ))}
            </div>
          </div>
          
          {/* Filtre par date */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="text-blue-500" size={20} />
              <h3 className="font-semibold text-gray-700">Date</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  value={dateFiltre}
                  onChange={(e) => setDateFiltre(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "apres", label: "Après" },
                  { value: "avant", label: "Avant" },
                  { value: "exacte", label: "Exacte" }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTypeDateFiltre(option.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      typeDateFiltre === option.value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Résumé des commandes */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex flex-col justify-center">
            <div className="text-center">
              <p className="text-gray-700 mb-1">Commandes affichées</p>
              <p className="text-3xl font-bold text-blue-600">
                {commandesFiltreesCount}/{totalCommandes}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {statutFiltre !== "Tous" ? `Filtré par: ${statutFiltre}` : "Tous les statuts"}
              </p>
            </div>
          </div>
        </div>

        {chargement ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : commandesFiltrees.length === 0 ? (
          <div className="text-center py-10">
            <Package className="mx-auto text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-600 mt-4">Aucune commande trouvée</h3>
            <p className="text-gray-500 mt-2">
              Aucune commande ne correspond à vos critères de recherche
            </p>
            <button
              onClick={reinitialiserFiltres}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-300">
                  <th className="py-3 px-4">Commande</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Prix</th>
                  <th className="py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {commandesFiltrees.map((c, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-200 hover:bg-blue-50 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Package className="text-blue-600" size={20} />
                        <span className="font-medium">N°{c.numero}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {c.client || "Non spécifié"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-600">{formatDate(c.date)}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(c.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{c.total} AED</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-center text-sm ${getColorStatut(c.statut || "En cours")}`}>
                        {c.statut || "En cours"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}