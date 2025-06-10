import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ModifierCommande() {
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [description, setDescription] = useState("");
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/commandes/derniere")
      .then((res) => res.json())
      .then((data) => {
        setCommande(data);
        setDescription(data.description || "");
        const transform = data.fournisseurs.map((f) => ({
          id: f.id,
          nom: f.nom,
          contact: f.contact,
          produits: f.produits.map((p) => ({
            id: p.id,
            nom: p.nom,
            quantite: p.quantite,
            prix_unitaire: p.prix_unitaire,
          })),
        }));
        setFournisseurs(transform);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération commande :", err);
        setLoading(false);
      });
  }, []);

  const handleChangeFournisseur = (fIndex, field, value) => {
    const updated = [...fournisseurs];
    updated[fIndex][field] = value;
    setFournisseurs(updated);
  };

  const handleChangeProduit = (fIndex, pIndex, field, value) => {
    const updated = [...fournisseurs];
    updated[fIndex].produits[pIndex][field] = value;
    setFournisseurs(updated);
  };

  const handleAddFournisseur = () => {
    setFournisseurs([
      ...fournisseurs,
      {
        nom: "",
        contact: "",
        produits: [{ nom: "", quantite: 1, prix_unitaire: 0 }],
      },
    ]);
  };

  const handleAddProduit = (fIndex) => {
    const updated = [...fournisseurs];
    updated[fIndex].produits.push({
      nom: "",
      quantite: 1,
      prix_unitaire: 0,
    });
    setFournisseurs(updated);
  };

  const calculTotal = () => {
    return fournisseurs.reduce((total, f) => {
      return (
        total +
        f.produits.reduce(
          (somme, p) => somme + p.quantite * p.prix_unitaire,
          0
        )
      );
    }, 0);
  };

  const handleSave = async () => {
    const total = calculTotal();
    const body = {
      description,
      total,
      fournisseurs: fournisseurs.map((f) => ({
        id: f.id,
        nom: f.nom,
        contact: f.contact,
        produits: f.produits.map((p) => ({
          id: p.id,
          nom: p.nom,
          quantite: p.quantite,
          prixUnitaire: p.prix_unitaire,
          total: p.quantite * p.prix_unitaire,
        })),
      })),
    };

    const res = await fetch(
      `http://localhost:5000/api/commandes/${commande.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    if (res.ok) {
      alert("✅ Modification enregistrée !");
      navigate("/commande");
    } else {
      alert(data.message || "❌ Erreur lors de l’enregistrement.");
    }
  };

  if (loading) return <div className="p-6">Chargement…</div>;
  if (!commande) return <div className="p-6">Commande introuvable</div>;

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Modifier la Commande N°{commande.numero}
      </h1>

      {/* Bloc infos générales */}
      <div className="bg-white p-4 rounded shadow max-w-4xl mx-auto mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600">Date</label>
            <input
              type="text"
              disabled
              className="w-full border p-2 rounded"
              value={commande.date}
            />
          </div>
          <div>
            <label className="block text-gray-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Fournisseurs + Produits */}
      <div className="bg-white p-4 rounded shadow max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Fournisseurs & Produits</h2>

        {fournisseurs.map((f, fIndex) => (
          <div key={fIndex} className="border p-4 mb-4 rounded">
            <h3 className="font-semibold">Fournisseur {fIndex + 1}</h3>
            <div className="grid grid-cols-2 gap-4 my-2">
              <input
                className="border p-2 rounded"
                placeholder="Nom"
                value={f.nom}
                onChange={(e) =>
                  handleChangeFournisseur(fIndex, "nom", e.target.value)
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Contact"
                value={f.contact}
                onChange={(e) =>
                  handleChangeFournisseur(fIndex, "contact", e.target.value)
                }
              />
            </div>

            {f.produits.map((p, pIndex) => (
              <div key={pIndex} className="grid grid-cols-4 gap-3 mb-2">
                <input
                  className="border p-2 rounded"
                  placeholder="Produit"
                  value={p.nom}
                  onChange={(e) =>
                    handleChangeProduit(fIndex, pIndex, "nom", e.target.value)
                  }
                />
                <input
                  type="number"
                  className="border p-2 rounded"
                  placeholder="Quantité"
                  value={p.quantite}
                  onChange={(e) =>
                    handleChangeProduit(
                      fIndex,
                      pIndex,
                      "quantite",
                      Number(e.target.value)
                    )
                  }
                />
                <input
                  type="number"
                  className="border p-2 rounded"
                  placeholder="Prix unitaire"
                  value={p.prix_unitaire}
                  onChange={(e) =>
                    handleChangeProduit(
                      fIndex,
                      pIndex,
                      "prix_unitaire",
                      Number(e.target.value)
                    )
                  }
                />
                <input
                  disabled
                  className="bg-gray-100 border p-2 rounded"
                  value={(p.quantite * p.prix_unitaire).toFixed(2) + " AED"}
                />
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
          className="bg-blue-800 text-white px-3 py-2 rounded"
        >
          + Ajouter Fournisseur
        </button>
      </div>

      {/* Total & Boutons */}
      <div className="text-center max-w-4xl mx-auto mt-6">
        <div className="text-xl font-bold mb-4">
          Total : {calculTotal().toFixed(2)} AED
        </div>
        <button
          onClick={handleSave}
          className="bg-green-700 text-white px-6 py-2 rounded"
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
