import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ModifierCommande() {
  const { id } = useParams(); // Récupérer l'ID de la commande depuis l'URL
  const navigate = useNavigate();

  const [numeroCommande, setNumeroCommande] = useState("");
  const [dateCommande, setDateCommande] = useState("");
  const [description, setDescription] = useState("");
  const [fournisseurs, setFournisseurs] = useState([]);

  // Fonction pour récupérer les données de la commande existante
  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/commandes/${id}`);
        const data = await res.json();
        if (res.ok) {
          setNumeroCommande(data.numero);
          setDateCommande(new Date(data.date).toLocaleDateString("fr-FR"));
          setDescription(data.description);
          setFournisseurs(data.fournisseurs || []);
        } else {
          alert(data.message || "Erreur lors de la récupération de la commande.");
          navigate("/commande");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur de connexion au serveur.");
        navigate("/commande");
      }
    };

    fetchCommande();
  }, [id, navigate]);

  // Gérer les changements pour les fournisseurs
  const handleChangeFournisseur = (index, field, value) => {
    const updated = [...fournisseurs];
    updated[index][field] = value;
    setFournisseurs(updated);
  };

  // Gérer les changements pour les produits d'un fournisseur
  const handleChangeProduit = (fIndex, pIndex, field, value) => {
    const updated = [...fournisseurs];
    updated[fIndex].produits[pIndex][field] = value;
    setFournisseurs(updated);
  };

  // Calcul du total
  const calculTotal = () => {
    return fournisseurs.reduce((total, f) => {
      return (
        total +
        f.produits.reduce((sum, p) => sum + p.quantite * p.prix_unitaire, 0)
      );
    }, 0);
  };

  // Fonction pour soumettre les modifications
  const handleSubmit = async () => {
    try {
      const total = calculTotal();

      const mappedFournisseurs = fournisseurs.map(f => ({
        nom: f.nom,
        contact: f.contact,
        produits: f.produits.map(p => ({
          nom: p.nom,
          quantite: p.quantite,
          prixUnitaire: p.prix_unitaire,
          total: p.quantite * p.prix_unitaire
        }))
      }));

      const res = await fetch(`http://localhost:5000/api/commandes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          fournisseurs: mappedFournisseurs,
          total
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Commande modifiée avec succès !");
        navigate("/commande");
      } else {
        alert(data.message || "Erreur lors de la modification.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-400 p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/commande")}
          className="bg-white text-blue-700 px-4 py-2 rounded shadow"
        >
          ← Retour
        </button>
        <h1 className="text-xl font-bold text-white ml-6">Modifier une commande</h1>
      </div>

      {/* Informations Générales */}
      <div className="bg-white rounded shadow p-4 mb-6 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Informations Générales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Numéro de la commande</label>
            <input
              type="text"
              value={numeroCommande}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Description de la commande…"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="text"
              value={dateCommande}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Fournisseurs & Produits */}
      <div className="bg-white rounded shadow p-4 max-w-4xl mx-auto">
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
          </div>
        ))}
      </div>

      {/* Total + Actions */}
      <div className="max-w-4xl mx-auto text-center mt-8">
        <div className="bg-blue-500 text-white font-bold text-xl py-4 rounded">
          Montant de la commande : {calculTotal().toFixed(2)} AED
        </div>

        <div className="flex justify-center gap-4 mt-6">
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