import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { ArrowRight } from "lucide-react";

export default function CommandesTransitaire() {
  const [commandes, setCommandes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const chargerCommandes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/commandes");
        const data = await res.json();
        setCommandes(data);
      } catch (err) {
        console.error("Erreur chargement commandes :", err);
      }import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Parametre from "./pages/Parametre";
import ParametreTransitaire from "./pages/ParametreTransitaire";
import CommandeGSC from "./pages/CommandeGSC";
import CreerCommande from "./pages/CreerCommande";
import HistoriqueCommandes from "./pages/HistoriqueCommandes";
import ModifierCommande from "./pages/ModifierCommande";
import CommandesTransitaire from "./pages/CommandesTransitaire"; // ✅ AJOUTÉ

// Placeholder temporaire pour les pages vides
function Placeholder({ title }) {
  return <div className="p-10 text-xl font-bold">{title}</div>;
}

// Redirection automatique vers la bonne page paramètre
function ParametreRedirect() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/" />;
  if (user.role === "agentGSC") return <Parametre />;
  if (user.role === "transitaire") return <ParametreTransitaire />;
  return <Navigate to="/dashboard" />;
}

// ✅ Protection pour agent GSC
function RequireAgentGSC({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "agentGSC") {
    return <Navigate to="/dashboard" />;
  }
  return children;
}

// ✅ Protection pour transitaire
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
        {/* Connexion */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Commandes GSC */}
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

        {/* ✅ Commandes Transitaire */}
        <Route
          path="/commandes-transitaire"
          element={
            <RequireTransitaire>
              <CommandesTransitaire />
            </RequireTransitaire>
          }
        />

        {/* Suivi (placeholder) */}
        <Route path="/suivi" element={<Placeholder title="Suivi des Commandes" />} />

        {/* Redirection Paramètre selon le rôle */}
        <Route path="/parametre" element={<ParametreRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

    };

    chargerCommandes();
  }, []);

  const getStyleStatut = (statut) => {
    switch (statut) {
      case "Terminé":
      case "Reçu":
        return "text-black font-bold";
      case "En cours":
      default:
        return "text-gray-500 font-bold";
    }
  };

  return (
    <div className="min-h-screen bg-[#3AB3E7] px-4 py-6">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Commandes</h1>

        {commandes.length === 0 ? (
          <p className="text-center text-gray-600">Aucune commande à afficher</p>
        ) : (
          <Swiper
            slidesPerView={2.5}
            spaceBetween={20}
            navigation
            modules={[Navigation]}
            className="mySwiper"
          >
            {commandes.map((commande) => (
              <SwiperSlide key={commande.id}>
                <div
                  onClick={() => navigate(`/commande/${commande.id}`)}
                  className="cursor-pointer bg-blue-100 hover:bg-blue-200 transition rounded-xl p-4 min-h-[200px] flex flex-col justify-between shadow"
                >
                  <div>
                    <p className="text-sm font-semibold">Commande</p>
                    <p className="text-lg font-bold">N°{commande.numero}</p>
                  </div>
                  <div className={`mt-6 text-center text-base ${getStyleStatut(commande.statut)}`}>
                    {commande.statut || "En cours"}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}
