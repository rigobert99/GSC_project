const pool = require('../db');

const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Vérifie si l'identifiant est un email ou un nom d'utilisateur
    const result = await pool.query(
      'SELECT * FROM users WHERE (username = $1 OR email = $1) AND password = $2',
      [identifier, password]
    );

    if (result.rows.length > 0) {
      res.json({ message: 'Connexion réussie', user: result.rows[0] });
    } else {
      res.status(401).json({ error: 'Identifiants invalides' });
    }
  } catch (err) {
    console.error('Erreur lors de la connexion :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { loginUser };
