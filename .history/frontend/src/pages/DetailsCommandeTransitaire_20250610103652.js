import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DetailsCommandeTransitaire() {
  // 1. Modification ici : remplacer 'id' par 'commande_id'
  const { commande_id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        // 2. Modification ici : utiliser commande_id dans l'URL
        const res = await fetch(`http://localhost:5000/api/commandes/${commande_id}`);
        if (!res.ok) throw new Error("Commande non trouvée");
        
        const data = await res.json();
        setCommande(data);
      } catch (err) {
        console.error("Erreur récupération commande :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [commande_id]); // 3. Mettre à jour la dépendance

  // ... le reste du code reste inchangé ...
  // (formatDate, JSX return, etc.)
}