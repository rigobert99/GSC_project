import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Bell, User } from "lucide-react";

export default function ParametreTransitaire() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    prix_kg: "",
    compte: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "transitaire") {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/transitaire");
        if (!res.ok) throw new Error("Erreur lors du chargement des données");
        
        const data = await res.json();
        setForm({
          username: data.username || "",
          email: data.email || "",
          password: data.password || "",
          prix_kg: data.prix_kg || "",
          compte: data.compte || "",
        });
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setMessage("❌ Erreur lors du chargement des données");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/users/transitaire", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Échec de la mise à jour");
      }

      setMessage("✅ Informations mises à jour avec succès !");
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-blue-400 p-6">
      {/* NAVBAR */}
      <header className="bg-white shadow-md flex justify-between items-center px-6 py-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">GSC</h1>
          <p className="text-xs text-gray-600">GLOBAL SERVICES & CONSULTING</p>
        </div>
        <nav className="flex-1 mx-10">
          <ul className="flex justify-center gap-10 font-semibold text-gray-700">
            <li>
              <Link to="/dashboard" className={isActive("/dashboard") ? "text-blue-700 border-b-2 border-blue-700" : "hover:text-blue-700"}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/commande" className={isActive("/commande") ? "text-blue-700 border-b-2 border-blue-700" : "hover:text-blue-700"}>
                Commande
              </Link>
            </li>
            <li>
              <Link to="/suivi" className={isActive("/suivi") ? "text-blue-700 border-b-2 border-blue-700" : "hover:text-blue-700"}>
                Suivi des Commandes
              </Link>
            </li>
            <li>
              <Link to="/parametre" className={isActive("/parametre") ? "text-blue-700 border-b-2 border-blue-700" : "hover:text-blue-700"}>
                Paramètre
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex gap-4">
          <Bell className="w-5 h-5" />
          <User className="w-5 h-5" />
        </div>
      </header>

      {/* FORMULAIRE */}
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">Paramètre du compte</h1>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          <div className="flex justify-center md:justify-start">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-500">
              👤
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nom d'utilisateur</label>
              <input 
                type="text" 
                name="username" 
                value={form.username} 
                onChange={handleChange} 
                className="w-full border rounded px-4 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                className="w-full border rounded px-4 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  className="w-full border rounded px-4 py-2 pr-10" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  👁
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Prix par kg (FCFA)</label>
              <input 
                type="number" 
                name="prix_kg" 
                value={form.prix_kg} 
                onChange={handleChange} 
                className="w-full border rounded px-4 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Numéro de compte</label>
              <input 
                type="text" 
                name="compte" 
                value={form.compte} 
                onChange={handleChange} 
                className="w-full border rounded px-4 py-2" 
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <button 
                type="submit" 
                className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-sm font-semibold text-blue-600">{message}</p>}
      </div>
    </div>
  );
}