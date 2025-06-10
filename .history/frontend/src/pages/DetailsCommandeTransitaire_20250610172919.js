import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

export default function DetailsCommandeTransitaire() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/commandes/${id}`);
        if (!res.ok) throw new Error("Commande non trouvée");
        const data = await res.json();
        setCommande(data);
      } catch (err) {
        console.error("Erreur récupération commande :", err);
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

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Commande-${commande?.numero}`,
  });

  if (loading) return <div className="p-10 text-center">Chargement...</div>;
  if (!commande) return <div className="p-10 text-red-500">Commande non trouvée.</div>;

  return (
    <div className="min-h-screen bg-[#3AB3E7] px-4 py-6">
      <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-white font-semibold bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
        >
          ← Retour
        </button>

        <button
          onClick={handlePrint}
          className="text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Télécharger en PDF
        </button>
      </div>

      <div
        ref={printRef}
        className="bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-[#3AB3E7]">
          Commande N°{commande.numero}
        </h1>

        {/* Infos principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-medium">
          <div>
            <p className="text-gray-500">Date de création</p>
            <p>{formatDate(commande.date)}</p> {/* ✅ ici on utilise `date` */}
          </div>
          <div>
            <p className="text-gray-500">Dernière modification</p>
            <p>{formatDate(commande.date_modification)}</p>
          </div>
          <div>
            <p className="text-gray-500">Statut</p>
            <p className="font-bold text-blue-600">{commande.statut}</p>
          </div>
          <div>
            <p className="text-gray-500">Montant total</p>
            <p>{commande.total} AED</p>
          </div>
        </div>

        {commande.description && (
          <div>
            <h3 className="text-lg font-semibold mb-1">Description</h3>
            <p className="bg-gray-50 border p-3 rounded-md">{commande.description}</p>
          </div>
        )}

        {/* Fournisseurs et Produits */}
        {commande.fournisseurs && commande.fournisseurs.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[#3AB3E7]">
              Fournisseurs et Produits
            </h3>

            {commande.fournisseurs.map((f, i) => (
              <div key={i} className="border rounded-md p-4 bg-gray-50">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <p><strong>Fournisseur :</strong> {f.nom}</p>
                  <p><strong>Contact :</strong> {f.contact}</p>
                </div>

                {f.produits.map((p, j) => (
                  <div
                    key={j}
                    className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-white p-2 border rounded-md mb-2"
                  >
                    <p><strong>Produit :</strong> {p.nom}</p>
                    <p><strong>Qté :</strong> {p.quantite}</p>
                    <p><strong>Prix unitaire :</strong> {p.prix_unitaire} AED</p>
                    <p><strong>Total :</strong> {p.total} AED</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
