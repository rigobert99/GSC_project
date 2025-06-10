import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePDF } from 'react-to-pdf';

const DetailsCommandeTransitaire = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toPDF, targetRef } = usePDF({ filename: `commande_${id}.pdf` });

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/commandes/${id}`);
        const data = await response.json();
        console.log("Données de la commande :", data); // Pour débogage
        setCommande(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setLoading(false);
      }
    };
    fetchCommande();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "Date non disponible";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  if (loading) return <div>Chargement...</div>;
  if (!commande) return <div>Commande non trouvée</div>;

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Retour
      </button>
      <button
        onClick={toPDF}
        className="mb-4 ml-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Exporter en PDF
      </button>
      <div ref={targetRef}>
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Détails de la commande</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Numéro de commande</p>
              <p>{commande.numero}</p>
            </div>
            <div>
              <p className="text-gray-500">Date de création</p>
              {commande.date_creation ? (
                <p>{formatDate(commande.date_creation)}</p>
              ) : (
                <p className="text-red-500">Date de création non disponible</p>
              )}
            </div>
            <div>
              <p className="text-gray-500">Statut</p>
              <p>{commande.statut}</p>
            </div>
            {commande.description && (
              <div>
                <p className="text-gray-500">Description</p>
                <p>{commande.description}</p>
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold mt-6">Produits</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom du produit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody>
                {commande.produits.map((produit, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">{produit.nom}</td>
                    <td className="px-6 py-4">{produit.quantite}</td>
                    <td className="px-6 py-4">{produit.prix_unitaire} AED</td>
                    <td className="px-6 py-4">{produit.total} AED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <p className="text-xl font-bold">Total global : {commande.total_global} AED</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsCommandeTransitaire;