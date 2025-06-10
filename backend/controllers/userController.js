const pool = require('../db');

// Obtenir les infos de l'agent GSC
const getAgentGSC = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, password, payeur, beneficiaire FROM users WHERE role = 'agentGSC' LIMIT 1"
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour les infos de l'agent GSC
const updateAgentGSC = async (req, res) => {
  const { username, email, password, payeur, beneficiaire } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users
       SET username = $1, email = $2, password = $3, payeur = $4, beneficiaire = $5
       WHERE role = 'agentGSC' RETURNING *`,
      [username, email, password, payeur, beneficiaire]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Obtenir les infos du transitaire
const getTransitaire = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, password, prix_kg, compte FROM users WHERE role = 'transitaire' LIMIT 1"
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour les infos du transitaire
const updateTransitaire = async (req, res) => {
  const { username, email, password, prix_kg, compte } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users
       SET username = $1, email = $2, password = $3, prix_kg = $4, compte = $5
       WHERE role = 'transitaire' RETURNING *`,
      [username, email, password, prix_kg, compte]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = {
  getAgentGSC,
  updateAgentGSC,
  getTransitaire,
  updateTransitaire
};
