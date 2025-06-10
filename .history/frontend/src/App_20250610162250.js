import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreerCommande from "./pages/CreerCommande";
import ModifierCommande from "./pages/ModifierCommande";
import HistoriqueCommandes from "./pages/HistoriqueCommandes";
import CommandeGSC from "./pages/CommandeGSC";
import Parametre from "./pages/Parametre";
import ParametreTransitaire from "./pages/ParametreTransitaire";
import CommandesTransitaire from "./pages/CommandesTransitaire";
import DetailsCommandeTransitaire from "./pages/DetailsCommandeTransitaire";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* GSC */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/creer-commande" element={<CreerCommande />} />
        <Route path="/modifier-commande" element={<ModifierCommande />} />
        <Route path="/historique-commandes" element={<HistoriqueCommandes />} />
        <Route path="/commandes" element={<CommandeGSC />} />
        <Route path="/parametre" element={<Parametre />} />

        {/* Transitaire */}
        <Route path="/transitaire/commandes" element={<CommandesTransitaire />} />
        <Route path="/transitaire/commande/:id" element={<DetailsCommandeTransitaire />} />
        <Route path="/transitaire/parametre" element={<ParametreTransitaire />} />
      </Routes>
    </Router>
  );
}

export default App;
