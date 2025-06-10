const express = require("express");
const router = express.Router();
const commandeController = require("../controllers/commandeController");

// POST - Créer une commande
router.post("/", commandeController.creerCommande);

// GET - Toutes les commandes
router.get("/", commandeController.getAllCommandes);

// GET - Dernière commande créée
router.get("/derniere", commandeController.getDerniereCommande);

// PUT - Modifier une commande
router.put("/:id", commandeController.updateCommande);

// PUT - Annuler la dernière commande en cours
router.put("/annuler", commandeController.annulerDerniereCommande);

module.exports = router;