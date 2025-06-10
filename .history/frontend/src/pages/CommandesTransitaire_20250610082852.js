import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function CommandesTransitaire() {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const chargerCommandes = async () => {
      try {
        // Remplacez "[invalid url, do not cite]" par une URL valide
        const res = await fetch("https://exemple.com/api/commandes");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setCommandes(data);
      } catch (err) {
        console.error("Erreur lors du chargement des commandes :", err);
      }
    };

    chargerCommandes();
  }, []);

  // Fonction pour appliquer un style basé sur le statut de la commande
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

        {/* Affichage conditionnel : Si aucune commande, afficher un message */}
        {commandes.length === 0 ? (
          <p className="text-center text-gray-600">Aucune commande à afficher</p>
        ) : (
          <Swiper
            slidesPerView={2.5}
            spaceBetween={20}
            navigation
            modules={[Navigation]}
            className="mySwiper"
            aria-label="Liste des commandes"
          >
            {/* Parcours des commandes pour les afficher */}
            {commandes.map((commande) => (
              <SwiperSlide key={commande.commande_id}>
                <Link to={`/transitaire/commande/${commande.commande_id}`}>
                  <div className="cursor-pointer bg-blue-100 hover:bg-blue-200 transition rounded-xl p-4 min-h-[200px] flex flex-col justify-between shadow">
                    <div>
                      <p className="text-sm font-semibold">Commande</p>
                      <p className="text-lg font-bold">N°{commande.numero}</p>
                    </div>
                    <div
                      className={`mt-6 text-center text-base ${getStyleStatut(
                        commande.statut
                      )}`}
                    >
                      {commande.statut || "En cours"}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}