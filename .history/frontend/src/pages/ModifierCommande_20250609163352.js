import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ModifierCommande() {
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [modifiable, setModifiable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [fournisseurs, setFournisseurs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/commandes/derniere")
      .then((res) => res.json())
      .then((data) => {
        setCommande(data);
        setDescription(data.description || "");
        
        // Transformation des données pour correspondre à la structure attendue
        const transformedFournisseurs = data.fournisseurs.map(f => ({
          id: f.id,
          nom: f.nom,
          contact: f.contact,
          produits: f.produits.map(p => ({
            id: p.id,
            nom: p.nom,
            quantite: p.quantite,
            prix_unitaire: p.prix_unitaire
          }))
        }));
        
        setFournisseurs(transformedFournisseurs);
        setModifiable(data.statut === "En cours");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Fonctions pour gérer les modifications
  const handleAddFournisseur = () => {
    setFournisseurs([
      ...fournisseurs,
      { nom: "", contact: "", produits: [{ nom: "", quantite: 1, prix_unitaire: 0 }] },
    ]);
  };

  const handleAddProduit = (fIndex) => {
    const updated = [...fournisseurs];
    updated[fIndex].produits.push({ nom: "", quantite: 1, prix_unitaire: 0 });
    setFournisseurs(updated);
  };

  const handleChangeFournisseur = (index, field, value) => {
    const updated = [...fournisseurs];
    updated[index][field] = value;
    setFournisseurs(updated);
  };

  const handleChangeProduit = (fIndex, pIndex, field, value) => {
    const updated = [...fournisseurs];
    updated[fIndex].produits[pIndex][field] = value;
    setFournisseurs(updated);
  };

  const calculTotal = () => {
    return fournisseurs.reduce((total, f) => {
      return (
        total +
        f.produits.reduce((sum, p) => sum + p.quantite * p.prix_unitaire, 0)
      );
    }, 0);
  };

  const handleSave = () => {
    const total = calculTotal();
    const mappedFournisseurs = fournisseurs.map(f => ({
      id: f.id,
      nom: f.nom,
      contact: f.contact,
      produits: f.produits.map(p => ({
        id: p.id,
        nom: p.nom,
        quantite: p.quantite,
        prixUnitaire: p.prix_unitaire,
        total: p.quantite * p.prix_unitaire
      }))
    }));

    fetch(`http://localhost:5000/api/commandes/${commande.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        fournisseurs: mappedFournisseurs,
        total,
        statut: commande.statut
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Modification enregistrée !");
        navigate("/commande");
      })
      .catch((err) => {
        alert("❌ Erreur lors de la modification");
        console.error(err);
      });
  };

  if (loading) return <div className="p-10 text-center">Chargement...</div>;
  if (!commande) return <div className="p-10 text-center">Aucune commande trouvée</div>;
  if (!modifiable)
    return (
      <div className="min-h-screen bg-blue-300 p-6">
        <div className="bg-white p-4 rounded shadow max-w-xl mx-auto">
          <p className="text-red-600 font-semibold text-center text-lg">
            ❌ Cette commande ne peut pas être modifiée (statut : {commande.statut})
          </p>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/commande")}
              className="bg-blue-700 text-white px-4 py-2 rounded"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-300 p-6">
      {/* En-tête */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/commande")}
          className="bg-blue-900 text-white px-4 py-2 rounded-full flex items-center gap-1"
        >
          <ArrowLeft size={18} /> Retour
        </button>
        <h1 className="text-xl font-bold">Modifier une commande</h1>
      </div>

      {/* Informations de base */}
      <div className="bg-white p-6 rounded shadow-md max-w-5xl mx-auto mb-6">
        <div className="grid grid-cols-4 gap-4 text-center font-medium">
          <div>
            <div className="text-gray-600">Numéro</div>
            <div className="font-semibold">N°{commande.numero}</div>
          </div>
          <div>
            <div className="text-gray-600">Date de création</div>
            <div className="font-semibold">{commande.date}</div>
          </div>
          <div>
            <div className="text-gray-600">Dernière modification</div>
            <div className="font-semibold">{commande.date_modification}</div>
          </div>
          <div>
            <div className="text-gray-600">Statut</div>
            <div className="font-semibold">{commande.statut}</div>
          </div>
        </div>
      </div>

      {/* Formulaire de description */}
      <div className="bg-white p-6 rounded shadow-md max-w-5xl mx-auto mb-6">
        <div className="mb-4">
          <label className="block font-medium mb-2">Description :</label>
          <textarea
            className="w-full border p-3 rounded"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* Section Fournisseurs & Produits */}
      <div className="bg-white rounded shadow p-4 max-w-5xl mx-auto mb-6">
        <h2 className="text-lg font-bold mb-4">Fournisseurs et Produits</h2>

        {fournisseurs.map((f, fIndex) => (
          <div key={fIndex} className="border rounded p-4 mb-4">
            <h3 className="font-semibold mb-2">Fournisseur {fIndex + 1}</h3>
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
                <p className="font-semibold mb-1">Produit {pIndex + 1}</p>
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
                      handleChangeProduit(fIndex, pIndex, "quantite", Number(e.target.value))
                    }
                  />
                  <div className="flex items-center border rounded px-2">
                    <input
                      type="number"
                      className="w-full p-2 outline-none"
                      placeholder="Prix unitaire"
                      value={p.prix_unitaire}
                      onChange={(e) =>
                        handleChangeProduit(fIndex, pIndex, "prix_unitaire", Number(e.target.value))
                      }
                    />
                    <span className="ml-1 text-sm text-gray-500">AED</span>
                  </div>
                  <div className="text-right font-semibold col-span-1">
                    {(p.quantite * p.prix_unitaire).toFixed(2)}{" "}
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
      <div className="bg-white p-6 rounded shadow-md max-w-5xl mx-auto">
        <div className="mb-4">
          <label className="block font-medium mb-2">Montant total :</label>
          <input
            className="w-full border p-3 rounded font-bold text-lg"
            value={calculTotal().toFixed(2) + " AED"}
            disabled
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate("/commande")}
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-700 text-white px-6 py-2 rounded"
          >
            Enregistrer la commande
          </button>
        </div>
      </div>
    </div>
  );
}
