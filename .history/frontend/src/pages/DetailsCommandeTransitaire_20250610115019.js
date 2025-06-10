import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailsCommandeTransitaire() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [commande, setCommande] = useState(null);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/commandes/${id}/avec-details`);
        if (!res.ok) {
          throw new Error("Commande non trouvée.");
        }
        const data = await res.json();
        setCommande(data);
      } catch (err) {
        alert(err.message);
        navigate("/commandes-transitaire");
      }
    };
    fetchCommande();
  }, [id, navigate]);

  const calculTotal = () => {
    if (!commande) return "0.00";
    return commande.fournisseurs
      .reduce((acc, f) => {
        return acc + f.produits.reduce((pAcc, p) => pAcc + (p.quantite * p.prix_unitaire || 0), 0);
      }, 0)
      .toFixed(2);
  };

  const generatePDF = () => {
    const latexContent = `
\\documentclass[a4paper,12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{geometry}
\\geometry{margin=1in}
\\usepackage{booktabs}
\\usepackage{eurosym}
\\usepackage{longtable}
\\usepackage{xcolor}
\\definecolor{headerblue}{RGB}{0, 51, 102}

\\begin{document}

\\textbf{\\large Détails de la Commande} \\\\[0.5cm]

\\begin{tabular}{ll}
\\toprule
\\textbf{Numéro de la commande} & ${commande?.numero || ''} \\\\
\\textbf{Description} & ${commande?.description || ''} \\\\
\\textbf{Date} & ${commande ? new Date(commande.date).toLocaleDateString("fr-FR") : ''} \\\\
\\textbf{Statut} & ${commande?.statut || ''} \\\\
\\bottomrule
\\end{tabular}

\\vspace{0.5cm}

\\textbf{\\large Fournisseurs et Produits} \\\\[0.5cm]

${commande?.fournisseurs.map((f, fIndex) => `
\\noindent \\textbf{Fournisseur ${fIndex + 1}: ${f.nom}} \\\\
\\textit{Contact: ${f.contact}} \\\\[0.2cm]
\\begin{longtable}{p{5cm}p{3cm}p{3cm}p{3cm}}
\\toprule
\\textbf{Produit} & \\textbf{Quantité} & \\textbf{Prix Unitaire (AED)} & \\textbf{Total (AED)} \\\\
\\midrule
${f.produits.map(p => `
${p.nom} & ${p.quantite} & ${p.prix_unitaire.toFixed(2)} & ${(p.quantite * p.prix_unitaire).toFixed(2)} \\\\
`).join('')}
\\bottomrule
\\end{longtable}
\\vspace{0.3cm}
`).join('')}

\\vspace{0.5cm}
\\noindent \\textbf{\\large Montant Total de la Commande: ${calculTotal()} AED}

\\end{document}
    `;

    const blob = new Blob([latexContent], { type: 'text/latex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Commande_${commande?.numero || 'details'}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!commande) {
    return <div className="min-h-screen bg-blue-400 p-6 text-white text-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-400 p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/commandes-transitaire")}
          className="bg-white text-blue-700 px-4 py-2 rounded shadow"
        >
          ← Retour
        </button>
        <h1 className="text-xl font-bold text-white ml-6">Détails de la Commande</h1>
      </div>

      {/* Informations Générales */}
      <div className="bg-white rounded shadow p-4 mb-6 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Informations Générales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Numéro de la commande</label>
            <input
              type="text"
              value={commande.numero}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              value={commande.description || ""}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="text"
              value={new Date(commande.date).toLocaleDateString("fr-FR")}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Statut</label>
            <input
              type="text"
              value={commande.statut}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Fournisseurs & Produits */}
      <div className="bg-white rounded shadow p-4 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold mb-4">Fournisseurs et Produits</h2>

        {commande.fournisseurs.map((f, fIndex) => (
          <div key={fIndex} className="border rounded p-4 mb-4">
            <h3 className="font-semibold mb-2">Fournisseur {fIndex + 1}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                className="p-2 border rounded bg-gray-100"
                value={f.nom}
                disabled
              />
              <input
                className="p-2 border rounded bg-gray-100"
                value={f.contact}
                disabled
              />
            </div>

            {f.produits.map((p, pIndex) => (
              <div key={pIndex} className="mb-4">
                <p className="font-semibold mb-1">Produit {pIndex + 1}</p>
                <div className="grid grid-cols-5 gap-4 items-center">
                  <input
                    className="p-2 border rounded bg-gray-100"
                    value={p.nom}
                    disabled
                  />
                  <input
                    type="number"
                    className="p-2 border rounded bg-gray-100"
                    value={p.quantite}
                    disabled
                  />
                  <div className="flex items-center border rounded px-2 bg-gray-100">
                    <input
                      type="number"
                      className="w-full p-2 outline-none bg-gray-100"
                      value={p.prix_unitaire}
                      disabled
                    />
                    <span className="ml-1 text-sm text-gray-500">AED</span>
                  </div>
                  <div className="text-right font-semibold col-span-1">
                    {(p.quantite * p.prix_unitaire || 0).toFixed(2)}{" "}
                    <span className="ml-1 text-sm">AED</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Total + Actions */}
      <div className="max-w-4xl mx-auto text-center mt-8">
        <div className="bg-blue-500 text-white font-bold text-xl py-4 rounded">
          Montant de la commande : {calculTotal()} AED
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={generatePDF}
            className="bg-blue-700 text-white px-6 py-2 rounded"
          >
            Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  );
}