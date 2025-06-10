import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ModifierCommande() {
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/commandes/derniere');
        if (!res.ok) {
          throw new Error('Aucune commande en cours à modifier.');
        }
        const data = await res.json();
        setCommande(data);
        setEditedDescription(data.description);
      } catch (err) {
        alert(err.message);
        navigate('/commande');
      }
    };
    fetchCommande();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!commande) return;
    try {
      const res = await fetch(`http://localhost:5000/api/commandes/${commande.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: editedDescription }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Description modifiée avec succès !');
      } else {
        alert('Erreur lors de la modification : ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur de connexion au serveur.');
    }
  };

  const handleCancel = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/commandes/annuler', {
        method: 'PUT',
      });
      const data = await res.json();
      if (res.ok) {
        alert('Commande annulée !');
        navigate('/commande');
      } else {
        alert('Erreur lors de l\'annulation : ' + data.message);
      }
    } catch (err) {
      alert('Erreur de connexion.');
      console.error(err);
    }
  };

  if (!commande) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-400 p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/commande")}
          className="bg-white text-blue-700 px-4 py-2 rounded shadow"
        >
          ← Retour
        </button>
        <h1 className="text-xl font-bold text-white ml-6">Modifier la commande</h1>
      </div>
      <div className="bg-white rounded shadow p-4 mb-6 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Informations Générales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Numéro de la commande</label>
            <input
              type="text"
              value={commande.numero}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Description de la commande…"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="text"
              value={new Date(commande.date).toLocaleDateString("fr-FR")}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Total</label>
            <input
              type="text"
              value={commande.total}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Statut</label>
            <input
              type="text"
              value={commande.statut}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto text-center mt-8">
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            Annuler la commande
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-700 text-white px-6 py-2 rounded"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}