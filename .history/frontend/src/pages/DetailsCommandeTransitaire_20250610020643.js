import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DetailsCommandeTransitaire() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("ID de commande invalide");
      setLoading(false);
      return;
    }

    const fetchCommande = async () => {
      try {
        console.log("Fetching commande with id:", id);
        const res = await fetch(`https://example.com/api/commandes/${id}`); // Remplace par une URL valide
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Commande non trouvée pour cet ID");
          }
          throw new Error(`Erreur serveur: ${res.status}`);
        }
        const data = await res.json();
        console.log("Données API:", data);

        const transformedData = {
          id: data.commande_id || data.id,
          date_creation: data.date || "",
          date_modification: data.date_modification || data.date || "",
          statut: data.statut || "Inconnu",
          description: data.description || "",
          numero: data.numero || "",
          total: data.total || 0,
          fournisseurs: Array.isArray(data.fournisseurs)
            ? data.fournisseurs.map(fournisseur => ({
                nom: fournisseur.nom || "Inconnu",
                contact: fournisseur.contact || "Non spécifié",
                produits: Array.isArray(fournisseur.produits)
                  ? fournisseur.produits.map(produit => ({
                      nom: produit.nom || "Produit non nommé",
                      quantite: Number(produit.quantite) || 0,
                      prix_unitaire: Number(produit.prix_unitaire) || 0,
                      total: (produit.quantite || 0) * (produit.prix_unitaire || 0),
                    }))
                  : [],
              }))
            : [],
        };

        console.log("Données transformées:", transformedData);
        setCommande(transformedData);
      } catch (err) {
        console.error("Erreur récupération commande:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "Non défini";
    return new Date(date).toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getColorStatut = (statut) => {
    if (statut === "Terminé") return "bg-green-100 text-green-800";
    if (statut === "En cours") return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const calculTotal = () => {
    if (!commande || !commande.fournisseurs) return 0;
    return commande.fournisseurs
      .reduce((acc, f) => acc + f.produits.reduce((pAcc, p) => pAcc + p.total, 0), 0)
      .toFixed(2);
  };

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-blue-400">Chargement...</div>;
  }

  if (!commande) {
    return <div className="p-10 text-center text-red-500">Commande non trouvée</div>;
  }

  return (
    <div className="min-h-screen bg-blue-400 p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/commande")}
          className="bg-white text-blue-700 px-4 py-2 rounded shadow hover:bg-blue-50 transition"
        >
          ← Retour
        </button>
        <h1 className="text-xl font-bold text-white ml-6">Détails de la commande</h1>
      </div>
      <div className="bg-white rounded shadow p-4 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Informations Générales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Numéro de la commande</label>
            <input
              type="text"
              value={commande.numero}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Date de création</label>
            <input
              type="text"
              value={formatDate(commande.date_creation)}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Date de modification</label>
            <input
              type="text"
              value={formatDate(commande.date_modification)}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Statut</label>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getColorStatut(commande.statut)}`}>
              {commande.statut}
            </div>
          </div>
        </div>
        {commande.description && (
          <div className="mt-6 p-4 border rounded">
            <h3 className="text-md font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{commande.description}</p>
          </div>
        )}
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-4">Fournisseurs et Produits</h3>
          {commande.fournisseurs.length === 0 ? (
            <p className="text-gray-500">Aucun fournisseur associé.</p>
          ) : (
            commande.fournisseurs.map((fournisseur, fIndex) => (
              <div key={fIndex} className="mb-6 border-b pb-4">
                <h4 className="text-sm font-semibold mb-2">Fournisseur : {fournisseur.nom}</h4>
                <p className="text-sm text-gray-600">Contact : {fournisseur.contact || "Non spécifié"}</p>
                <div className="mt-2">
                  {fournisseur.produits.length === 0 ? (
                    <p className="text-gray-500">Aucun produit associé.</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 font-semibold text-gray-700 mb-2">
                      <span>Produit</span>
                      <span>Quantité</span>
                      <span>Prix unitaire</span>
                      <span>Total</span>
                    </div>
                  )}
                  {fournisseur.produits.map((produit, pIndex) => (
                    <div key={pIndex} className="grid grid-cols-4 gap-2 py-2 border-t">
                      <span>{produit.nom}</span>
                      <span>{produit.quantite}</span>
                      <span>{produit.prix_unitaire.toFixed(2)} AED</span>
                      <span>{produit.total.toFixed(2)} AED</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 text-right">
          <p className="text-lg font-semibold">Total : {calculTotal()} AED</p>
        </div>
      </div>
    </div>
  );
}