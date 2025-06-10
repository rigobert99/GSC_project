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
        setCommande(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommande();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "Date non disponible";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!commande) return <div className="p-8 text-red-500 text-center">Commande non trouvée.</div>;

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            ← Retour
          </button>
          <button
            onClick={toPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Exporter en PDF
          </button>
        </div>

        <div ref={targetRef}>
          <h1 className="text-2xl font-bold mb-4 text-center text-[#3AB3E7]">
            Détails de la commande N°{commande.numero}
          </h1>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-500">Date de création</p>
              <p>{formatDate(commande.date)}</p>
            </div>
            <div>
              <p className="text-gray-500">Statut</p>
              <p>{commande.statut}</p>
            </div>
            <div>
              <p className="text-gray-500">Dernière modification</p>
              <p>{formatDate(commande.date_modification)}</p>
            </div>
            <div>
              <p className="text-gray-500">Total global</p>
              <p>{commande.total_global ?? commande.total} AED</p>
            </div>
          </div>

          {commande.description && (
            <div className="mb-6">
              <p className="text-gray-500">Description</p>
              <p className="border p-3 rounded bg-gray-50">{commande.description}</p>
            </div>
          )}

          {/* Produits */}
          <h2 className="text-xl font-semibold mb-2 text-[#3AB3E7]">Produits</h2>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Produit</th>
                  <th className="text-left px-4 py-2">Quantité</th>
                  <th className="text-left px-4 py-2">Prix unitaire (AED)</th>
                  <th className="text-left px-4 py-2">Total (AED)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(commande.produits || []).map((prod, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">{prod.nom}</td>
                    <td className="px-4 py-2">{prod.quantite}</td>
                    <td className="px-4 py-2">{prod.prix_unitaire}</td>
                    <td className="px-4 py-2">{prod.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="text-right text-lg font-bold">
            Total : {commande.total_global ?? commande.total} AED
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsCommandeTransitaire;
