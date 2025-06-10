import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Changé de useNavigate à Link
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function CommandesTransitaire() {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const chargerCommandes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/commandes");
        const data = await res.json();
        setCommandes(data);
      } catch (err) {
        console.error("Erreur chargement commandes :", err);
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
                {/* Utilisation de Link au lieu de navigate */}
                <Link to={`/transitaire/commande/${commande.id}`}>
                  <div className="cursor-pointer bg-blue-100 hover:bg-blue-200 transition rounded-xl p-4 min-h-[200px] flex flex-col justify-between shadow">
                    <div>
                      <p className="text-sm font-semibold">Commande</p>
                      <p className="text-lg font-bold">N°{commande.numero}</p>
                    </div>
                    <div className={`mt-6 text-center text-base ${getStyleStatut(commande.statut)}`}>
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