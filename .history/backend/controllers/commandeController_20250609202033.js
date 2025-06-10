const pool = require("../config/db");

// Créer une commande avec fournisseurs + produits
exports.creerCommande = async (req, res) => {
  try {
    const { numero, date, description, fournisseurs, total, statut } = req.body;

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

// Liste de toutes les commandes
exports.getAllCommandes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM commandes ORDER BY date DESC, id DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur récupération commandes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer la dernière commande en cours (sans détails)
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

// Récupérer la dernière commande en cours avec détails (fournisseurs et produits)
exports.getDerniereCommandeAvecDetails = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
          c.id as commande_id,
          c.numero,
          c.date,
          c.description,
          c.total,
          c.statut,
          COALESCE(json_agg(json_build_object(
              'id', f.id,
              'nom', f.nom,
              'contact', f.contact,
              'produits', COALESCE(json_agg(json_build_object(
                  'id', p.id,
                  'nom', p.nom,
                  'quantite', p.quantite,
                  'prix_unitaire', p.prix_unitaire,
                  'total', p.total
              ) ORDER BY p.id), '[]'::json)
          ) ORDER BY f.id), '[]'::json) as fournisseurs
      FROM 
          commandes c
      LEFT JOIN 
          fournisseurs f ON c.id = f.commande_id
      LEFT JOIN 
          produits p ON f.id = p.fournisseur_id
      WHERE 
          c.statut = 'En cours'
      GROUP BY 
          c.id
      ORDER BY 
          c.date DESC, c.id DESC
      LIMIT 1;
    `);
    const commande = result.rows[0];
    if (!commande) return res.status(404).json({ message: "Aucune commande modifiable" });
    res.json(commande);
  } catch (err) {
    console.error("Erreur récupération dernière commande avec détails:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Modifier une commande (description, total, fournisseurs et produits)
exports.updateCommande = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { description, total, fournisseurs } = req.body;
    
    const updateCommandeResult = await client.query(
      "UPDATE commandes SET description = $1, total = $2 WHERE id = $3 AND statut = 'En cours' RETURNING *",
      [description, total, id]
    );
    
    if (updateCommandeResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "Commande non trouvée ou non modifiable" });
    }
    
    await client.query("DELETE FROM produits WHERE fournisseur_id IN (SELECT id FROM fournisseurs WHERE commande_id = $1)", [id]);
    await client.query("DELETE FROM fournisseurs WHERE commande_id = $1", [id]);
    
    for (const fournisseur of fournisseurs) {
      const { nom, contact, produits } = fournisseur;
      const insertFournisseurResult = await client.query(
        "INSERT INTO fournisseurs (nom, contact, commande_id) VALUES ($1, $2, $3) RETURNING id",
        [nom, contact, id]
      );
      const fournisseurId = insertFournisseurResult.rows[0].id;
      
      for (const produit of produits) {
        const { nom: produitNom, quantite, prix_unitaire, total: produitTotal } = produit;
        await client.query(
          "INSERT INTO produits (nom, quantite, prix_unitaire, total, fournisseur_id) VALUES ($1, $2, $3, $4, $5)",
          [produitNom, quantite, prix_unitaire, produitTotal, fournisseurId]
        );
      }
    }
    
    await client.query('COMMIT');
    res.json({ message: "指標

    "Commande mise à jour", commande: updateCommandeResult.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Erreur update commande:", error);
    res.status(500).json({ message: "Erreur serveur" });
  } finally {
    client.release();
  }
};

// Annuler la dernière commande en cours
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