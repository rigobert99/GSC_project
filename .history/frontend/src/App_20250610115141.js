import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Parametre from "./pages/Parametre";
import ParametreTransitaire from "./pages/ParametreTransitaire";
import CommandeGSC from "./pages/CommandeGSC";
import CommandesTransitaire from "./pages/CommandesTransitaire"; // 1. Nouvel import
import CreerCommande from "./pages/CreerCommande";
import HistoriqueCommandes from "./pages/HistoriqueCommandes";
import ModifierCommande from "./pages/ModifierCommande";

function Placeholder({ title }) {
  return <div className="p-10 text-xl font-bold">{title}</div>;
}

// Redirection pour /parametre (existant)
function ParametreRedirect() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/" />;
  if (user.role === "agentGSC") return <Parametre />;
  if (user.role === "transitaire") return <ParametreTransitaire />;
  return <Navigate to="/dashboard" />;
}

// 2. NOUVELLE REDIRECTION POUR /commande
function CommandeRedirect() {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!user) return <Navigate to="/" />;
  
  if (user.role === "agentGSC") {
    return <CommandeGSC />;
  }
  
  if (user.role === "transitaire") {
    return <CommandesTransitaire />;
  }
  
  // Fallback pour rôles non gérés
  return <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 3. REMPLACEMENT DE L'ANCIENNE ROUTE */}
        <Route path="/commande" element={<CommandeRedirect />} />
        
        <Route path="/commande/creer" element={<CreerCommande />} />
        <Route path="/commande/modifier" element={<ModifierCommande />} />
        <Route path="/commande/historique" element={<HistoriqueCommandes />} />
        
        <Route path="/suivi" element={<Placeholder title="Suivi des Commandes" />} />
        <Route path="/parametre" element={<ParametreRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}