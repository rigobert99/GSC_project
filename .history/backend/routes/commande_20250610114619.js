const express = require("express");
const router = express.Router();
const commandeController = require("../controllers/commandeController");

// POST - Créer une commande
router.post("/", commandeController.creerCommande);

// GET - Toutes les commandes
router.get("/", commandeController.getAllCommandes);

// GET - Commande spécifique avec détails (fournisseurs et produits)
router.get("/:id/avec-details", commandeController.getCommandeAvecDetails);

// GET - Dernière commande créée (sans détails)
router.get("/derniere", commandeController.getDerniereCommande);

// GET - Dernière commande créée avec détails (fournisseurs et produits)
router.get("/derniere/avec-details", commandeController.getDerniereCommandeAvecDetails);

// PUT - Modifier une commande
router.put("/:id", commandeController.updateCommande);

// PUT - Annuler la dernière commande en cours
router.put("/annuler", commandeController.annulerDerniereCommande);

module.exports = router;