const pool = require("../config/db"); // ✅ chemin corrigé vers backend/config/db.js

// 🔹 Créer une commande avec fournisseurs + produits (interdiction si une commande "En cours" existe)
exports.creerCommande = async (req, res) => {
  try {
    const { numero, date, description, fournisseurs, total, statut } = req.body;

    // ⚠️ Vérifier s'il existe déjà une commande "En cours"
    const exist = await pool.query("SELECT * FROM commandes WHERE statut = 'En cours'");
    if (exist.rows.length > 0) {
      return res.status(400).json({ message: "Une commande en cours existe déjà." });
    }

    const commandeResult = await pool.query(
      "INSERT INTO commandes (numero, date, description, total, statut) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [numero, date, description, total, statut]
    );

    const commandeId = commandeResult.rows[0].id;

    for (const fournisseur of fournisseurs) {
      const { nom, contact, produits } = fournisseur;
      const fournisseurResult = await pool.query(
        "INSERT INTO fournisseurs (nom, contact, commande_id) VALUES ($1, $2, $3) RETURNING *",
        [nom, contact, commandeId]
      );

      const fournisseurId = fournisseurResult.rows[0].id;

      for (const produit of produits) {
        const { nom, quantite, prixUnitaire, total } = produit;
        await pool.query(
          "INSERT INTO produits (nom, quantite, prix_unitaire, total, fournisseur_id) VALUES ($1, $2, $3, $4, $5)",
          [nom, quantite, prixUnitaire, total, fournisseurId]
        );
      }
    }

    res.status(201).json({ message: "Commande créée" });
  } catch (error) {
    console.error("Erreur creation commande:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 Liste de toutes les commandes pour l’historique
exports.getAllCommandes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM commandes ORDER BY date DESC, id DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur récupération commandes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 Récupérer la dernière commande en cours pour modification
exports.getDerniereCommande = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM commandes WHERE statut = 'En cours' ORDER BY date DESC, id DESC LIMIT 1`
    );
    const commande = result.rows[0];
    if (!commande) return res.status(404).json({ message: "Aucune commande modifiable" });
    res.json(commande);
  } catch (err) {
    console.error("Erreur récupération dernière commande:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 Modifier uniquement la description de la dernière commande en cours
exports.updateCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const result = await pool.query(
      "UPDATE commandes SET description = $1 WHERE id = $2 AND statut = 'En cours' RETURNING *",
      [description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Commande non trouvée ou non modifiable" });
    }

    res.json({ message: "Commande mise à jour", commande: result.rows[0] });
  } catch (error) {
    console.error("Erreur update commande:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//******************
exports.updateCommande = async (req, res) => {
  const commandeId = req.params.id;
  const { description, total, fournisseurs } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 🔁 Mise à jour de la commande elle-même
    await client.query(
      "UPDATE commandes SET description = $1, total = $2, date_modification = NOW() WHERE id = $3",
      [description, total, commandeId]
    );

    // 🔁 Mise à jour des fournisseurs et de leurs produits
    for (const fournisseur of fournisseurs) {
      if (fournisseur.id) {
        // Si l'ID du fournisseur existe → on le met à jour
        await client.query(
          "UPDATE fournisseurs SET nom = $1, contact = $2 WHERE id = $3 AND commande_id = $4",
          [fournisseur.nom, fournisseur.contact, fournisseur.id, commandeId]
        );
      } else {
        // Sinon on l'insère
        const newFournisseur = await client.query(
          "INSERT INTO fournisseurs (nom, contact, commande_id) VALUES ($1, $2, $3) RETURNING id",
          [fournisseur.nom, fournisseur.contact, commandeId]
        );
        fournisseur.id = newFournisseur.rows[0].id;
      }

      for (const produit of fournisseur.produits) {
        if (produit.id) {
          // Mise à jour du produit existant
          await client.query(
            "UPDATE produits SET nom = $1, quantite = $2, prix_unitaire = $3 WHERE id = $4 AND fournisseur_id = $5",
            [
              produit.nom,
              produit.quantite,
              produit.prixUnitaire,
              produit.id,
              fournisseur.id,
            ]
          );
        } else {
          // Insertion nouveau produit
          await client.query(
            "INSERT INTO produits (nom, quantite, prix_unitaire, fournisseur_id) VALUES ($1, $2, $3, $4)",
            [
              produit.nom,
              produit.quantite,
              produit.prixUnitaire,
              fournisseur.id,
            ]
          );
        }
      }
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Commande mise à jour avec succès" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erreur updateCommande :", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  } finally {
    client.release();
  }
};


// 🔹 Annuler la dernière commande en cours
exports.annulerDerniereCommande = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE commandes SET statut = 'Annulé' WHERE statut = 'En cours' ORDER BY date DESC, id DESC LIMIT 1 RETURNING *"
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Aucune commande en cours à annuler" });
    }
    res.json({ message: "Commande annulée", commande: result.rows[0] });
  } catch (err) {
    console.error("Erreur annulation commande:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};