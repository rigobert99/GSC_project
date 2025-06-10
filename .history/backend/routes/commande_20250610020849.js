const express = require("express");
const router = express.Router();
const commandeController = require("../controllers/commandeController");

router.post("/", commandeController.creerCommande);
router.get("/", commandeController.getAllCommandes);
router.get("/derniere", commandeController.getDerniereCommande);
router.get("/derniere/avec-details", commandeController.getDerniereCommandeAvecDetails);
router.get("/:id", commandeController.getCommandeById);
router.put("/:id", commandeController.updateCommande);
router.put("/annuler", commandeController.annulerDerniereCommande);

module.exports = router;