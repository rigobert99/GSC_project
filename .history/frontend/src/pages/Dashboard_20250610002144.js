import { useState } from 'react';
import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const commandes = [
    { id: "Commande N°00227845", date: "25/05/2025", prix: "500 AED", statut: "En cours" },
    { id: "Commande N°00227846", date: "26/05/2025", prix: "720 AED", statut: "Reçu" },
    { id: "Commande N°00227847", date: "27/05/2025", prix: "250 AED", statut: "Annulé" },
  ];

  const filtered = commandes.filter((cmd) =>
    cmd.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatutColor = (statut) => {
    switch (statut) {
      case "Reçu":
        return "text-green-600";
      case "Annulé":
        return "text-red-600";
      default:
        return "text-black";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow-md flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">GSC</h1>
          <p className="text-xs text-gray-600">GLOBAL SERVICES & CONSULTING</p>
        </div>
        <nav className="flex-1 mx-10">
          <ul className="flex justify-center gap-10 font-semibold text-gray-700">
            <li>
              <Link to="/dashboard" className="text-blue-700 border-b-2 border-blue-700">Dashboard</Link>
            </li>
            <li>
              <Link to="/commande" className="hover:text-blue-700">Commande</Link>
            </li>
            <li>
              <Link to="/suivi" className="hover:text-blue-700">Suivi des Commandes</Link>
            </li>
            <li>
              <Link to="/parametre" className="hover:text-blue-700">Paramètre</Link>
            </li>
          </ul>
        </nav>
        <div className="flex gap-4">
          <Bell className="w-5 h-5" />
          <User className="w-5 h-5" />
        </div>
      </header>

      {/* SECTION BLEUE */}
      <section className="bg-blue-600 text-white py-10 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full border-8 border-blue-800 flex items-center justify-center text-2xl font-bold">
          80%
        </div>
        <p className="mt-4 text-lg">Dernière commande</p>
      </section>

      {/* HISTORIQUE */}
      <section className="bg-white mx-6 my-10 p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Historique</h2>
          <input
            type="text"
            placeholder="Rechercher..."
            className="border px-3 py-1 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-auto max-h-80">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-600 border-b">
                <th className="py-2">Nom de la commande</th>
                <th>Date</th>
                <th>Prix</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cmd, index) => (
                <tr key={index} className="border-b text-sm">
                  <td className="py-2 flex items-center gap-2">📦 {cmd.id}</td>
                  <td>{cmd.date}</td>
                  <td>{cmd.prix}</td>
                  <td className={getStatutColor(cmd.statut)}>{cmd.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
