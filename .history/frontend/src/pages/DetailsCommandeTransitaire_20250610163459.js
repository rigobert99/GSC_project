import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DetailsCommandeTransitaire() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/commandes/${commande.id}`);
        const data = await res.json();
        setCommande(data);
      } catch (err) {
        console.error("Erreur de récupération de commande :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  if (loading) return <div className="p-10 text-center">Chargement...</div>;
  if (!commande) return <div className="p-10 text-red-500">Commande introuvable.</div>;

  return (
    <div className="min-h-screen bg-[#3AB3E7] px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-white px-4 py-2 rounded shadow hover:bg-gray-100"
      >
        ← Retour
      </button>

      <div className="bg-white rounded-xl shadow p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center text-[#3AB3E7]">Commande N°{commande.numero}</h1>

        {/* Informations générales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-medium">
          <div>
            <p className="text-gray-500">Date de création</p>
            <p>{formatDate(commande.date_creation)}</p>
          </div>
          <div>
            <p className="text-gray-500">Dernière modification</p>
            <p>{formatDate(commande.date_modification)}</p>
          </div>
          <div>
            <p className="text-gray-500">Statut</p>
            <p className="text-blue-700 font-bold">{commande.statut}</p>
          </div>
          <div>
            <p className="text-gray-500">Total</p>
            <p className="font-semibold">{commande.total} AED</p>
          </div>
        </div>

        {/* Description */}
        {commande.description && (
          <div>
            <h3 className="text-lg font-semibold mb-1">Description</h3>
            <p className="bg-gray-50 border p-3 rounded-md">{commande.description}</p>
          </div>
        )}

        {/* Fournisseurs + Produits */}
        {commande.fournisseurs?.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[#3AB3E7]">Fournisseurs</h3>
            {commande.fournisseurs.map((fournisseur, index) => (
              <div key={index} className="border p-4 rounded bg-gray-50">
                <p className="font-bold mb-2">Fournisseur : {fournisseur.nom}</p>
                <p className="mb-4 text-sm text-gray-600">Contact : {fournisseur.contact}</p>

                {fournisseur.produits.map((produit, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2 mb-2 bg-white rounded shadow"
                  >
                    <p><strong>Nom :</strong> {produit.nom}</p>
                    <p><strong>Qté :</strong> {produit.quantite}</p>
                    <p><strong>Prix unitaire :</strong> {produit.prix_unitaire} AED</p>
                    <p><strong>Total :</strong> {produit.total} AED</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Télécharger en PDF (optionnel) */}
        {/* <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Télécharger en PDF
        </button> */}
      </div>
    </div>
  );
}
