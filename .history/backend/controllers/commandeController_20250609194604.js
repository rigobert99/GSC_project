const pool = require("../config/db"); // Connexion à la base de données

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

    // Ajouter les fournisseurs et leurs produits
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
    console.error("Erreur création commande:", error);
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
    if (!commande) return res.status(404).json({ message: "Aucune commande modifiable." });
    res.json(commande);
  } catch (err) {
    console.error("Erreur récupération dernière commande:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 Récupérer une commande par ID
exports.getCommandeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer la commande principale
    const commandeResult = await pool.query("SELECT * FROM commandes WHERE id = $1", [id]);

    if (commandeResult.rows.length === 0) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    const commande = commandeResult.rows[0];

    // Récupérer les fournisseurs associés à cette commande
    const fournisseursResult = await pool.query(
      "SELECT * FROM fournisseurs WHERE commande_id = $1",
      [id]
    );

    const fournisseurs = await Promise.all(
      fournisseursResult.rows.map(async (fournisseur) => {
        const produitsResult = await pool.query(
          "SELECT * FROM produits WHERE fournisseur_id = $1",
          [fournisseur.id]
        );

        return {
          ...fournisseur,
          produits: produitsResult.rows,
        };
      })
    );

    res.json({
      ...commande,
      fournisseurs,
    });
  } catch (error) {
    console.error("Erreur récupération commande par ID:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 Modifier une commande
exports.updateCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, fournisseurs, total } = req.body;

    // Mettre à jour la commande principale
    const commandeResult = await pool.query(
      "UPDATE commandes SET description = $1, total = $2 WHERE id = $3 RETURNING *",
      [description, total, id]
    );

    if (commandeResult.rows.length === 0) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    // Supprimer les anciens fournisseurs et leurs produits
    await pool.query("DELETE FROM fournisseurs WHERE commande_id = $1", [id]);

    // Ajouter les nouveaux fournisseurs et leurs produits
    for (const fournisseur of fournisseurs) {
      const { nom, contact, produits } = fournisseur;

      const fournisseurResult = await pool.query(
        "INSERT INTO fournisseurs (nom, contact, commande_id) VALUES ($1, $2, $3) RETURNING *",
        [nom, contact, id]
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

    res.json({ message: "Commande modifiée avec succès", commande: commandeResult.rows[0] });
  } catch (error) {
    console.error("Erreur modification commande:", error);
    res.status(500).json({ message: "Erreur serveur" });
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