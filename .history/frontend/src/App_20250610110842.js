import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Parametre from "./pages/Parametre";
import ParametreTransitaire from "./pages/ParametreTransitaire";
import CommandeGSC from "./pages/CommandeGSC";
import CommandesTransitaire from "./pages/CommandesTransitaire";
import CreerCommande from "./pages/CreerCommande";
import HistoriqueCommandes from "./pages/HistoriqueCommandes";
import ModifierCommande from "./pages/ModifierCommande";
import DetailsCommandeTransitaire from "./pages/DetailsCommandeTransitaire"; // ✅ page à afficher

function Placeholder({ title }) {
  return <div className="p-10 text-xl font-bold">{title}</div>;
}

function ParametreRedirect() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/" />;
  if (user.role === "agentGSC") return <Parametre />;
  if (user.role === "transitaire") return <ParametreTransitaire />;
  return <Navigate to="/dashboard" />;
}

function CommandeRedirect() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/" />;
  if (user.role === "agentGSC") return <CommandeGSC />;
  if (user.role === "transitaire") return <CommandesTransitaire />;
  return <Navigate to="/dashboard" />;
}

function RequireTransitaire({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "transitaire") return <Navigate to="/dashboard" />;
  return children;
}

function RequireAgentGSC({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "agentGSC") return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Connexion */}
        <Route path="/" element={<Login />} />

        {/* Page principale */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Redirection Commande selon rôle */}
        <Route path="/commande" element={<CommandeRedirect />} />

        {/* Routes de l'agent GSC */}
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

        {/* Route DÉTAIL transitaire */}
        <Route
          path="/transitaire/commande/:id"
          element={
            <RequireTransitaire>
              <DetailsCommandeTransitaire />
            </RequireTransitaire>
          }
        />

        {/* Page commande transitaire principale */}
        <Route
          path="/commandes-transitaire"
          element={
            <RequireTransitaire>
              <CommandesTransitaire />
            </RequireTransitaire>
          }
        />

        {/* Paramètres selon rôle */}
        <Route path="/parametre" element={<ParametreRedirect />} />

        {/* Suivi (à venir) */}
        <Route path="/suivi" element={<Placeholder title="Suivi des Commandes" />} />
      </Routes>
    </BrowserRouter>
  );
}
