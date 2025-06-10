import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Parametre from "./pages/Parametre";
import ParametreTransitaire from "./pages/ParametreTransitaire";
import CommandeGSC from "./pages/CommandeGSC";
import CreerCommande from "./pages/CreerCommande";
import HistoriqueCommandes from "./pages/HistoriqueCommandes";
import ModifierCommande from "./pages/ModifierCommande";
import CommandesTransitaire from "./pages/CommandesTransitaire"; // ✅ page transitaire

// 🧱 Placeholder temporaire pour les pages à venir
function Placeholder({ title }) {
  return <div className="p-10 text-xl font-bold">{title}</div>;
}

// 🔄 Redirection intelligente vers la bonne page Paramètre selon rôle
function ParametreRedirect() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/" />;
  if (user.role === "agentGSC") return <Parametre />;
  if (user.role === "transitaire") return <ParametreTransitaire />;
  return <Navigate to="/dashboard" />;
}

// 🔒 Route protégée pour agent GSC
function RequireAgentGSC({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "agentGSC") {
    return <Navigate to="/dashboard" />;
  }
  return children;
}

// 🔒 Route protégée pour transitaire
function RequireTransitaire({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "transitaire") {
    return <Navigate to="/dashboard" />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 Connexion */}
        <Route path="/" element={<Login />} />

        {/* 🏠 Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 📦 Commandes GSC */}
        <Route
          path="/commande"
          element={
            <RequireAgentGSC>
              <CommandeGSC />
            </RequireAgentGSC>
          }
        />
        <Route
          path="/commande/creer"
          element={
            <RequireAgentGSC>
              <CreerCommande />
            </RequireAgentGSC>
          }
        />
        <Route
          path="/commande/modifier"
          element={
            <RequireAgentGSC>
              <ModifierCommande />
            </RequireAgentGSC>
          }
        />
        <Route
          path="/commande/historique"
          element={
            <RequireAgentGSC>
              <HistoriqueCommandes />
            </RequireAgentGSC>
          }
        />

        {/* 🚚 Commandes Transitaire */}
        <Route
          path="/commandes-transitaire"
          element={
            <RequireTransitaire>
              <CommandesTransitaire />
            </RequireTransitaire>
          }
        />

        {/* 🔄 Redirection Paramètres selon rôle */}
        <Route path="/parametre" element={<ParametreRedirect />} />

        {/* 🧱 Suivi des commandes */}
        <Route path="/suivi" element={<Placeholder title="Suivi des Commandes" />} />
      </Routes>
    </BrowserRouter>
  );
}
