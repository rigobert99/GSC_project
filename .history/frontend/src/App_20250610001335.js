import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Parametre from "./pages/Parametre";
import ParametreTransitaire from "./pages/ParametreTransitaire";
import CommandeGSC from "./pages/CommandeGSC";
import CreerCommande from "./pages/CreerCommande";
import HistoriqueCommandes from "./pages/HistoriqueCommandes";
import ModifierCommande from "./pages/ModifierCommande"; // ✅ Import réel

function Placeholder({ title }) {
  return <div className="p-10 text-xl font-bold">{title}</div>;
}

// Redirection automatique selon le rôle connecté
function ParametreRedirect() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/" />;
  if (user.role === "agentGSC") return <Parametre />;
  if (user.role === "transitaire") return <ParametreTransitaire />;
  return <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Connexion */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Commandes */}
        <Route path="/commande" element={<CommandeGSC />} />
        <Route path="/commande/creer" element={<CreerCommande />} />
        <Route path="/commande/modifier" element={<ModifierCommande />} />
        <Route path="/commande/historique" element={<HistoriqueCommandes />} />

        {/* Suivi */}
        <Route path="/suivi" element={<Placeholder title="Suivi des Commandes" />} />

        {/* Paramètres */}
        <Route path="/parametre" element={<ParametreRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
