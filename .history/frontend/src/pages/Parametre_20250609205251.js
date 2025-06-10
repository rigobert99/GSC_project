import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Parametre() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    payeur: "",
    beneficiaire: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 🔐 Vérifier que seul l'agent GSC accède à cette page
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "agentGSC") {
      navigate("/dashboard"); // redirection interdite
    }
  }, [navigate]);

  // Charger les infos actuelles depuis la base
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/agent");
        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
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
      const res = await fetch("http://localhost:5000/api/users/agent", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Échec de la mise à jour");

      setMessage("✅ Informations mises à jour avec succès !");
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="min-h-screen bg-blue-400 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">Paramètre du compte</h1>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex justify-center md:justify-start">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-500">
              👤
            </div>
          </div>

          {/* Formulaire */}
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
              <label className="block text-sm font-medium text-gray-600 mb-1">Numéro du payeur</label>
              <input
                type="text"
                name="payeur"
                value={form.payeur}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Numéro du bénéficiaire</label>
              <input
                type="text"
                name="beneficiaire"
                value={form.beneficiaire}
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

        {message && (
          <p className="mt-4 text-center text-sm font-semibold text-blue-600">{message}</p>
        )}
      </div>
    </div>
  );
}
