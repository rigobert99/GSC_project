import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ModifierCommande() {
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedFournisseurs, setEditedFournisseurs] = useState([]);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const res = await fetch('[invalid url, do not cite]');
        if (!res.ok) {
          throw new Error('Aucune commande en cours à modifier.');
        }
        const data = await res.json();
        setCommande(data);
        setEditedDescription(data.description);
        setEditedFournisseurs(
          data.fournisseurs.map(f => ({
            nom: f.nom,
            contact: f.contact,
            produits: f.produits.map(p => ({
              nom: p.nom,
              quantite: p.quantite,
              prix_unitaire: p.prix_unitaire,
              total: p.total
            }))
          }))
        );
      } catch (err) {
        alert(err.message);
        navigate('/commande');
      }
    };
    fetchCommande();
  }, [navigate]);

  const handleChangeFournisseur = (index, field, value) => {
    const newFournisseurs = editedFournisseurs.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    setEditedFournisseurs(newFournisseurs);
  };

  const handleChangeProduit = (fIndex, pIndex, field, value) => {
    const newFournisseurs = editedFournisseurs.map((f, fi) =>
      fi === fIndex
        ? {
            ...f,
            produits: f.produits.map((p, pi) =>
              pi === pIndex ? { ...p, [field]: value } : p
            )
          }
        : f
    );
    setEditedFournisseurs(newFournisseurs);
  };

  const handleAddFournisseur = () => {
    setEditedFournisseurs([...editedFournisseurs, { nom: '', contact: '', produits: [{ nom: '', quantite: '', prix_unitaire: '', total: 0 }] }]);
  };

  const handleAddProduit = (fIndex) => {
    const newFournisseurs = editedFournisseurs.map((f, i) =>
      i === fIndex
        ? { ...f, produits: [...f.produits, { nom: '', quantite: '', prix_unitaire: '', total: 0 }] }
        : f
    );
    setEditedFournisseurs(newFournisseurs);
  };

  const calculTotal = () => {
    return editedFournisseurs.reduce((acc, f) => {
      return acc + f.produits.reduce((pAcc, p) => pAcc + (p.quantite * p.prix_unitaire), 0);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!commande) return;
    try {
      const total = calculTotal();
      const res = await fetch(`[invalid url, do not cite]'${commande.commande_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: editedDescription,
          total: total,
          fournisseurs: editedFournisseurs
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Commande modifiée avec succès !');
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
      const res = await fetch('[invalid url, do not cite]', {
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
              value={calculTotal()}
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
      <div className="bg-white rounded shadow p-4 mb-6 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Fournisseurs</h2>
        {editedFournisseurs.map((fournisseur, fIndex) => (
          <div key={fIndex} className="mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Nom du fournisseur</label>
                <input
                  type="text"
                  value={fournisseur.nom}
                  onChange={(e) => handleChangeFournisseur(fIndex, 'nom', e.target.value)}
                  className="w-full p-2 border rounded"