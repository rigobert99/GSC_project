import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ModifierCommande() {
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedFournisseurs, setEditedFournisseurs] = useState([]);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/commandes/derniere/avec-details");
        if (!res.ok) {
          throw new Error("Aucune commande en cours à modifier.");
        }
        const data = await res.json();
        setCommande(data);
        setEditedDescription(data.description || "");
        setEditedFournisseurs(
          data.fournisseurs.map((f) => ({
            nom: f.nom,
            contact: f.contact,
            produits: f.produits.map((p) => ({
              nom: p.nom,
              quantite: p.quantite,
              prix_unitaire: p.prix_unitaire,
            })),
          }))
        );
      } catch (err) {
        alert(err.message);
        navigate("/commande");
      }
    };
    fetchCommande();
  }, [navigate]);

  const handleChangeFournisseur = (index, field, value) => {
    const newFournisseurs = [...editedFournisseurs];
    newFournisseurs[index][field] = value;
    setEditedFournisseurs(newFournisseurs);
  };

  const handleChangeProduit = (fIndex, pIndex, field, value) => {
    const newFournisseurs = [...editedFournisseurs];
    newFournisseurs[fIndex].produits[pIndex][field] = field === "quantite" || field === "prix_unitaire" ? Number(value) : value;
    setEditedFournisseurs(newFournisseurs);
  };

  const handleAddFournisseur = () => {
    setEditedFournisseurs([
      ...editedFournisseurs,
      { nom: "", contact: "", produits: [{ nom: "", quantite: 1, prix_unitaire: 0 }] },
    ]);
  };

  const handleAddProduit = (fIndex) => {
    const newFournisseurs = [...editedFournisseurs];
    newFournisseurs[fIndex].produits.push({ nom: "", quantite: 1, prix_unitaire: 0 });
    setEditedFournisseurs(newFournisseurs);
  };

  const handleRemoveFournisseur = (fIndex) => {
    setEditedFournisseurs(editedFournisseurs.filter((_, i) => i !== fIndex));
  };

  const handleRemoveProduit = (fIndex, pIndex) => {
    const newFournisseurs = [...editedFournisseurs];
    newFournisseurs[fIndex].produits = newFournisseurs[fIndex].produits.filter((_, i) => i !== pIndex);
    setEditedFournisseurs(newFournisseurs);
  };

  const calculTotal = () => {
    return editedFournisseurs.reduce((acc, f) => {
      return acc + f.produits.reduce((pAcc, p) => pAcc + (p.quantite * p.prix_unitaire || 0), 0);
    }, 0).toFixed(2);
  };

  const handleSubmit = async () => {
    if (!commande) return;
    try {
      const total = calculTotal();
      const mappedFournisseurs = editedFournisseurs.map((f) => ({
        nom: f.nom,
        contact: f.contact,
        produits: f.produits.map((p) => ({
          nom: p.nom,
          quantite: p.quantite,
          prix_unitaire: p.prix_unitaire,
          total: p.quantite * p.prix_unitaire,
        })),
      }));

      const res = await fetch(`http://localhost:5000/api/commandes/${commande.commande_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editedDescription,
          total,
          fournisseurs: mappedFournisseurs,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Commande modifiée avec succès !");
        navigate("/commande");
      } else {
        alert("Erreur lors de la modification : " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur.");
    }
  };

  const handleCancel = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/commandes/annuler", {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        alert("Commande annulée !");
        navigate("/commande");
      } else {
        alert("Erreur lors de l'annulation : " + data.message);
      }
    } catch (err) {
      alert("Erreur de connexion.");
      console.error(err);
    }
  };

  if (!commande) {
    return <div className="min-h-screen bg-blue-400 p-6 text-white text-center">Chargement...</div>;
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

      {/* Informations Générales */}
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

      {/* Fournisseurs & Produits */}
      <div className="bg-white rounded shadow p-4 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold mb-4">Fournisseurs et Produits</h2>

        {editedFournisseurs.map((f, fIndex) => (
          <div key={fIndex} className="border rounded p-4 mb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold mb-2">Fournisseur {fIndex + 1}</h3>
              <button
                onClick={() => handleRemoveFournisseur(fIndex)}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded"
              >
                Supprimer Fournisseur
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                className="p-2 border rounded"
                placeholder="Nom du fournisseur"
                value={f.nom}
                onChange={(e) => handleChangeFournisseur(fIndex, "nom", e.target.value)}
              />
              <input
                className="p-2 border rounded"
                placeholder="Contact"
                value={f.contact}
                onChange={(e) => handleChangeFournisseur(fIndex, "contact", e.target.value)}
              />
            </div>

            {f.produits.map((p, pIndex) => (
              <div key={pIndex} className="mb-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold mb-1">Produit {pIndex + 1}</p>
                  <button
                    onClick={() => handleRemoveProduit(fIndex, pIndex)}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Supprimer Produit
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-4 items-center">
                  <input
                    className="p-2 border rounded"
                    placeholder="Nom du produit"
                    value={p.nom}
                    onChange={(e) =>
                      handleChangeProduit(fIndex, pIndex, "nom", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    className="p-2 border rounded"
                    placeholder="Quantité"
                    value={p.quantite}
                    onChange={(e) =>
                      handleChangeProduit(fIndex, pIndex, "quantite", e.target.value)
                    }
                  />
                  <div className="flex items-center border rounded px-2">
                    <input
                      type="number"
                      className="w-full p-2 outline-none"
                      placeholder="Prix unitaire"
                      value={p.prix_unitaire}
                      onChange={(e) =>
                        handleChangeProduit(fIndex, pIndex, "prix_unitaire", e.target.value)
                      }
                    />
                    <span className="ml-1 text-sm text-gray-500">AED</span>
                  </div>
                  <div className="text-right font-semibold col-span-1">
                    {(p.quantite * p.prix_unitaire || 0).toFixed(2)}{" "}
                    <span className="ml-1 text-sm">AED</span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => handleAddProduit(fIndex)}
              className="text-sm bg-blue-700 text-white px-3 py-1 rounded mt-2"
            >
              + Ajouter Produit
            </button>
          </div>
        ))}

        <button
          onClick={handleAddFournisseur}
          className="text-sm bg-blue-700 text-white px-3 py-2 rounded"
        >
          + Ajouter Fournisseur
        </button>
      </div>

      {/* Total + Actions */}
      <div className="max-w-4xl mx-auto text-center mt-8">
        <div className="bg-blue-500 text-white font-bold text-xl py-4 rounded">
          Montant de la commande : {calculTotal()} AED
        </div>

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
