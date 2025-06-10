import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DetailsCommandeTransitaire() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        // Remplacez par votre URL d'API valide
        const res = await fetch(`https://votre-api.com/commandes/${id}`);
        
        if (!res.ok) {
          throw new Error("Commande non trouvée");
        }
        
        const data = await res.json();
        
        const transformedData = {
          ...data,
          id: data.commande_id,
          date_creation: data.date,
          date_modification: data.date_modification || data.date,
          fournisseurs: data.fournisseurs?.map(fournisseur => ({
            ...fournisseur,
            produits: fournisseur.produits || []
          })) || []
        };
        
        setCommande(transformedData);
        setError(null);
      } catch (err) {
        console.error("Erreur récupération commande :", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifiée";
    
    try {
      const date = new Date(dateString);
      return isNaN(date) 
        ? "Date invalide" 
        : date.toLocaleDateString("fr-FR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
    } catch {
      return "Format invalide";
    }
  };

  if (loading) return <div className="p-10 text-center">Chargement...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Erreur : {error}</div>;

  return (
    <div className="min-h-screen bg-[#3AB3E7] px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-white font-semibold bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
      >
        ← Retour
      </button>

      <h1 className="text-2xl font-bold text-center mb-6 text-white">
        Détails de la commande
      </h1>

      {commande ? (
        <div className="bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center font-medium">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500">Numéro</p>
              <p className="text-black font-semibold">N°{commande.numero}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500">Date de création</p>
              <p>{formatDate(commande.date_creation)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500">Dernière modification</p>
              <p>{formatDate(commande.date_modification)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500">Statut</p>
              <p className={`font-bold ${
                commande.statut === "Terminé" ? "text-green-600" : 
                commande.statut === "En cours" ? "text-blue-600" : 
                "text-yellow-600"
              }`}>
                {commande.statut}
              </p>
            </div>
          </div>

          {/* Description */}
          {commande.description && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="border p-3 rounded-md bg-white">{commande.description}</p>
            </div>
          )}

          {/* Fournisseurs & Produits */}
          {commande.fournisseurs?.length > 0 ? (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold border-b pb-2">Fournisseurs et Produits</h3>

              {commande.fournisseurs.map((fournisseur, fIndex) => (
                <div key={fIndex} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="mb-2 md:mb-0">
                      <p className="font-semibold">Fournisseur :</p>
                      <p>{fournisseur.nom}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Contact :</p>
                      <p>{fournisseur.contact || "Non spécifié"}</p>
                    </div>
                  </div>

                  {fournisseur.produits?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Produits :</h4>
                      {fournisseur.produits.map((produit, pIndex) => {
                        const quantite = Number(produit.quantite) || 0;
                        const prix = Number(produit.prix_unitaire) || 0;
                        const total = quantite * prix;

                        return (
                          <div
                            key={pIndex}
                            className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-3 border rounded-md mb-3 items-center"
                          >
                            <div>
                              <p className="text-sm text-gray-500">Produit</p>
                              <p>{produit.nom}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Quantité</p>
                              <p>{quantite}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Prix unitaire</p>
                              <p>{prix.toFixed(2)} AED</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Total</p>
                              <p>{total.toFixed(2)} AED</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Total global */}
              <div className="text-right font-bold text-lg pt-4 border-t">
                <p className="text-gray-600 inline-block mr-4">Montant total :</p>
                <span className="text-blue-700">
                  {commande.fournisseurs.reduce(
                    (total, f) => total + (f.produits || []).reduce(
                      (sum, p) => {
                        const qte = Number(p.quantite) || 0;
                        const prix = Number(p.prix_unitaire) || 0;
                        return sum + qte * prix;
                      }, 0
                    ), 0
                  ).toFixed(2)} AED
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Aucun fournisseur associé à cette commande
            </div>
          )}
        </div>
      ) : (
        <div className="p-10 text-center text-red-500">
          Aucune donnée de commande disponible
        </div>
      )}
    </div>
  );
}