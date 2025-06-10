import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, X, Filter, Search, Calendar, RotateCcw } from "lucide-react";

export default function HistoriqueCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [statutFiltre, setStatutFiltre] = useState("Tous");
  const [dateFiltre, setDateFiltre] = useState("");
  const [typeDateFiltre, setTypeDateFiltre] = useState("apres");
  const [chargement, setChargement] = useState(true);
  const [filtresActifs, setFiltresActifs] = useState(false);
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

  useEffect(() => {
    // Vérifier si des filtres sont actifs
    const filtresActifs = recherche !== "" || statutFiltre !== "Tous" || dateFiltre !== "";
    setFiltresActifs(filtresActifs);
  }, [recherche, statutFiltre, dateFiltre]);

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("fr-FR");
  };

  const getColorStatut = (statut) => {
    if (statut === "Reçu") return "bg-green-100 text-green-800";
    if (statut === "Annulé") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const filtrerCommandes = (commande) => {
    // Filtre par recherche
    const matchRecherche = 
      recherche === "" || 
      commande.numero.toLowerCase().includes(recherche.toLowerCase());
    
    // Filtre par statut
    const matchStatut = 
      statutFiltre === "Tous" || 
      commande.statut === statutFiltre;
    
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
    acc[statut] = commandes.filter(c => c.statut === statut).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/commande")}
          className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg shadow-md hover:bg-blue-50 transition w-full sm:w-auto justify-center"
        >
          <X size={18} />
          <span>Retour</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center sm:text-left">Historique des Commandes</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Barre de recherche et réinitialisation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-1/2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Rechercher par numéro de commande..."
              className="block w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
          
          <button
            onClick={reinitialiserFiltres}
            disabled={!filtresActifs}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition w-full sm:w-auto justify-center ${
              filtresActifs 
                ? "bg-blue-500 text-white hover:bg-blue-600" 
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <RotateCcw size={18} />
            <span>Réinitialiser les filtres</span>
          </button>
        </div>

        {/* Panneau de filtres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Filtre par statut */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="text-blue-500" size={20} />
              <h3 className="font-semibold text-gray-700">Statut de la commande</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {["Tous", ...statuts].map((statut) => (
                <button
                  key={statut}
                  onClick={() => setStatutFiltre(statut)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1 ${
                    statutFiltre === statut
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {statut} 
                  {statut !== "Tous" && (
                    <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs ${
                      statutFiltre === statut ? "bg-white text-blue-500" : "bg-gray-200"
                    }`}>
                      {compteurStatuts[statut] || 0}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Filtre par date */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="text-blue-500" size={20} />
              <h3 className="font-semibold text-gray-700">Filtrer par date</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={dateFiltre}
                  onChange={(e) => setDateFiltre(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "apres", label: "Après cette date" },
                  { value: "avant", label: "Avant cette date" },
                  { value: "exacte", label: "Exactement cette date" }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTypeDateFiltre(option.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      typeDateFiltre === option.value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Résumé des commandes */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white flex flex-col justify-center">
            <div className="text-center">
              <p className="mb-1 font-medium">Commandes affichées</p>
              <p className="text-3xl font-bold">
                {commandesFiltreesCount}/{totalCommandes}
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-xs mt-1">Reçu ({compteurStatuts["Reçu"] || 0})</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-xs mt-1">En cours ({compteurStatuts["En cours"] || 0})</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-xs mt-1">Annulé ({compteurStatuts["Annulé"] || 0})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {chargement ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600 text-lg">Chargement des commandes...</span>
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
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="py-3 px-4 font-semibold text-gray-700">Commande</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Prix</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Statut</th>
                </tr>
              </thead>
              <tbody>
                {commandesFiltrees.map((c, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-200 hover:bg-blue-50 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Package className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <span className="font-medium block">Commande N°{c.numero}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-800">{formatDate(c.date)}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(c.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{c.total} AED</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-center px-3 py-1 rounded-full text-sm font-medium ${getColorStatut(c.statut || "En cours")}`}>
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