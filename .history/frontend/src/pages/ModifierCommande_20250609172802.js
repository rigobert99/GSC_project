import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ModifierCommande() {
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [description, setDescription] = useState("");
  const [fournisseurs, setFournisseurs] = useState([]);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/commandes/derniere");
        const data = res.data;
        setCommande(data);
        setDescription(data.description || "");
        setFournisseurs(data.fournisseurs || []);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };
    fetchCommande();
  }, []);

  const handleChangeProduit = (fIndex, pIndex, field, value) => {
    const updated = [...fournisseurs];
    updated[fIndex].produits[pIndex][field] = value;

    // Mise à jour automatique du total si quantité ou prix unitaire change
    if (field === "quantite" || field === "prix_unitaire") {
      const q = parseFloat(updated[fIndex].produits[pIndex].quantite) || 0;
      const p = parseFloat(updated[fIndex].produits[pIndex].prix_unitaire) || 0;
      updated[fIndex].produits[pIndex].total = q * p;
    }

    setFournisseurs(updated);
  };

  const handleChangeFournisseur = (fIndex, field, value) => {
    const updated = [...fournisseurs];
    updated[fIndex][field] = value;
    setFournisseurs(updated);
  };

  const ajouterFournisseur = () => {
    setFournisseurs([
      ...fournisseurs,
      {
        nom_fournisseur: "",
        contact: "",
        produits: [
          {
            nom_produit: "",
            quantite: 0,
            prix_unitaire: 0,
            total: 0,
          },
        ],
      },
    ]);
  };

  const ajouterProduit = (fIndex) => {
    const updated = [...fournisseurs];
    updated[fIndex].produits.push({
      nom_produit: "",
      quantite: 0,
      prix_unitaire: 0,
      total: 0,
    });
    setFournisseurs(updated);
  };

  const calculerMontantTotal = () => {
    return fournisseurs.reduce((totalF, f) => {
      return (
        totalF +
        f.produits.reduce((totalP, p) => totalP + (parseFloat(p.total) || 0), 0)
      );
    }, 0);
  };

  const handleSubmit = async () => {
    try {
      await axios.put("http://localhost:5000/api/commandes/modifier", {
        description,
        fournisseurs,
      });
      alert("Commande mise à jour !");
      navigate("/commande");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
    }
  };

  const handleAnnuler = () => {
    navigate("/commande");
  };

  if (!commande) {
    return <div className="text-center mt-10 text-gray-600">Chargement...</div>;
  }

  return (
    <div className="bg-blue-200 min-h-screen p-6">
      <button
        className="bg-blue-700 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate("/commande")}
      >
        Retour
      </button>

      <h1 className="text-2xl font-bold mb-6">Modifier une commande</h1>

      {/* Section Statique */}
      <div className="bg-white shadow-md p-4 rounded-md mb-6 flex justify-around">
        <div>
          <p className="text-sm">Numéro</p>
          <p className="font-semibold">N°{commande.numero}</p>
        </div>
        <div>
          <p className="text-sm">Date de création</p>
          <p className="font-semibold">{commande.date_creation}</p>
        </div>
        <div>
          <p className="text-sm">Dernière modification</p>
          <p className="font-semibold">{commande.date_modification}</p>
        </div>
        <div>
          <p className="text-sm">Statut</p>
          <p className="font-semibold">{commande.statut}</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-4 rounded-md mb-6 shadow">
        <label className="block text-sm font-medium mb-2">Description :</label>
        <textarea
          className="w-full border p-2 rounded"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      {/* Fournisseurs et Produits */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Fournisseurs et Produits</h2>

        {fournisseurs.map((f, fIndex) => (
          <div key={fIndex} className="mb-6 border p-4 rounded-md shadow-sm">
            <h3 className="font-bold mb-2">Fournisseur {fIndex + 1}</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nom du fournisseur"
                value={f.nom_fournisseur}
                onChange={(e) =>
                  handleChangeFournisseur(fIndex, "nom_fournisseur", e.target.value)
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Contact"
                value={f.contact}
                onChange={(e) =>
                  handleChangeFournisseur(fIndex, "contact", e.target.value)
                }
                className="border p-2 rounded"
              />
            </div>

            {f.produits.map((p, pIndex) => (
              <div
                key={pIndex}
                className="grid grid-cols-5 gap-4 items-center mb-2"
              >
                <input
                  type="text"
                  placeholder="Nom du produit"
                  value={p.nom_produit}
                  onChange={(e) =>
                    handleChangeProduit(fIndex, pIndex, "nom_produit", e.target.value)
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Quantité"
                  value={p.quantite}
                  onChange={(e) =>
                    handleChangeProduit(fIndex, pIndex, "quantite", e.target.value)
                  }
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Prix unitaire"
                  value={p.prix_unitaire}
                  onChange={(e) =>
                    handleChangeProduit(fIndex, pIndex, "prix_unitaire", e.target.value)
                  }
                  className="border p-2 rounded"
                />
                <span className="text-center">{p.total.toFixed(2)} AED</span>
              </div>
            ))}

            <button
              className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
              onClick={() => ajouterProduit(fIndex)}
            >
              + Ajouter Produit
            </button>
          </div>
        ))}

        <button
          className="bg-blue-700 text-white px-4 py-2 rounded"
          onClick={ajouterFournisseur}
        >
          + Ajouter Fournisseur
        </button>
      </div>

      {/* Montant + Boutons */}
      <div className="bg-white p-4 rounded-md shadow flex justify-between items-center">
        <span className="text-lg font-bold">
          Montant total : {calculerMontantTotal().toFixed(2)} AED
        </span>
        <div className="space-x-2">
          <button
            onClick={handleAnnuler}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Enregistrer la commande
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModifierCommande;
