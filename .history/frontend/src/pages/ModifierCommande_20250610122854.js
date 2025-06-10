Bon je veux qu'on revienne sur la page modifier je veux maintenant créer une page qui permet de visualiser une commande mais sans pouvoir la modifier et je pourrais pq pas telecharger son pdf. pour t'aider je vais te donner le fichier ModifierCommande.js et le fichier de routes App.js 
ModifierCommande.js
App.js


Based on your request, I'll create a new page called DetailsCommande.js that allows users to view a commande's details in a read-only format and includes an option to download a PDF. The page will be similar to ModifierCommande.js but without editable fields, and it will include a button to generate and download a PDF using LaTeX. I'll also update the App.js routing to include this new page, ensuring it’s accessible to both agentGSC and transitaire roles, as implied by your context and the existing DetailsCommandeTransitaire route.

The PDF will be generated using LaTeX, following the provided guidelines, with a comprehensive preamble and support for the AED currency symbol. The page will fetch commande details using the same API endpoint as ModifierCommande.js but will use the commande ID from the URL parameters to allow viewing any specific commande, not just the latest one.

Below are the updated and new files wrapped in <xaiArtifact> tags. The App.js will be updated to include a new route for DetailsCommande, and the new DetailsCommande.js will handle the read-only view and PDF download.

App.js
javascript
Afficher en ligne
DetailsCommande.js
javascript
Afficher en ligne
The changes and additions are as follows:

Updated App.js:
Added a new RequireAuthenticated component to restrict access to authenticated users (both agentGSC and transitaire roles).
Added a new route /commande/details/:id that uses DetailsCommande and is protected by RequireAuthenticated.
Kept all existing routes unchanged to maintain the application's functionality.
New DetailsCommande.js:
Created a read-only version of the ModifierCommande page, reusing its structure and styling for consistency.
Fetches commande details using the commande ID from the URL (/commande/details/:id) via the API endpoint http://localhost:5000/api/commandes/${id}/avec-details.
Displays commande details (numero, description, date, statut, fournisseurs, and produits) in disabled input fields with a grayed-out background (bg-gray-100).
Calculates the total amount using the same logic as ModifierCommande.js.
Includes a "Télécharger PDF" button that generates a LaTeX file for download, containing the commande details formatted with a professional layout.
The LaTeX document uses the eurosym package to handle the AED currency (as a placeholder, since AED is not natively supported in standard LaTeX; you may need to adjust the currency symbol rendering based on your backend or client requirements).
The LaTeX preamble includes essential packages (geometry, booktabs, longtable, xcolor) to ensure proper formatting and compatibility with PDFLaTeX, following the provided guidelines.
The PDF download creates a .tex file that users can compile locally using a LaTeX editor or service (e.g., Overleaf) to generate the PDF. Direct PDF generation in the browser would require additional server-side processing, which is not implemented here but can be added if needed.
To use the new page, navigate to /commande/details/:id (e.g., /commande/details/123), where :id is the commande ID. The page will display the commande details and allow downloading a LaTeX file for PDF generation. Ensure the API endpoint http://localhost:5000/api/commandes/:id/avec-details is implemented to return the commande data in the expected format.

If you need further modifications, such as direct PDF generation or additional styling, let me know!








3,7s
bon je veux que tu remple ce le nom DetailsCommande par DetailsCommandeTransitaire.js et que tu me redonne entiérement les deux codes des fichiers entiérement. 




Based on your request, I will rename the DetailsCommande.js file to DetailsCommandeTransitaire.js and provide the complete code for both the updated App.js and the renamed DetailsCommandeTransitaire.js. The functionality remains the same as in the previous response, but the file name and references in App.js will be updated to reflect DetailsCommandeTransitaire. The App.js file will also maintain the new route /commande/details/:id and include the updated import for DetailsCommandeTransitaire.

Below are the complete codes for both files, wrapped in <xaiArtifact> tags as per the guidelines. The artifact_id for App.js remains the same since it’s an update to the previously provided artifact, while the DetailsCommandeTransitaire.js retains the same artifact_id as the original DetailsCommande.js since it’s a rename with no functional changes.

App.js
javascript
Afficher en ligne
DetailsCommandeTransitaire.js
javascript
Afficher en ligne
Explanation of Changes
App.js:
Updated the import statement to replace DetailsCommande with DetailsCommandeTransitaire.
Updated the route /commande/details/:id to use DetailsCommandeTransitaire instead of DetailsCommande.
Kept the artifact_id as a3d07013-71c2-45f0-becf-c2781c82f16a since this is an update to the previously provided App.js.
Retained all other routes and logic unchanged to maintain the application's functionality.
Note that the existing route /transitaire/commande/:id already uses DetailsCommandeTransitaire, which might indicate a naming conflict or redundancy. I assumed you want DetailsCommandeTransitaire.js to serve both the /transitaire/commande/:id and /commande/details/:id routes. If the existing DetailsCommandeTransitaire is a different page, please clarify to avoid overwriting or confusion.
DetailsCommandeTransitaire.js:
Renamed the file and component from DetailsCommande to DetailsCommandeTransitaire.
Kept the artifact_id as 712579e5-ccf9-4bea-8983-24f0baac4d2b since this is a rename of the previously provided DetailsCommande.js with no functional changes.
Retained all functionality, including fetching commande details by ID, displaying read-only fields, calculating the total, and generating a LaTeX file for PDF download.
Ensured the LaTeX code follows the provided guidelines, using a comprehensive preamble with packages like geometry, booktabs, longtable, and eurosym for AED currency display.
Notes
Potential Conflict: Your original App.js already includes a DetailsCommandeTransitaire imported for the /transitaire/commande/:id route. If this is a separate page with different functionality, renaming the new page to DetailsCommandeTransitaire.js might overwrite the existing one. If you meant to create a distinct page or replace the existing DetailsCommandeTransitaire, please confirm. For now, I assumed the new DetailsCommandeTransitaire.js is intended to serve the /commande/details/:id route, and the existing /transitaire/commande/:id route uses the same component.
PDF Generation: The generatePDF function creates a .tex file for download, which users can compile using a LaTeX editor (e.g., Overleaf) to produce a PDF. If you want direct PDF generation in the browser or server-side, additional setup (e.g., a LaTeX rendering service) would be needed.
Currency Symbol: The LaTeX code uses eurosym for AED as a placeholder. If you need a specific AED symbol, you may need to adjust the LaTeX code or use a custom command, as AED is not natively supported in standard LaTeX packages.
To use the new page, navigate to /commande/details/:id (e.g., /commande/details/123), where :id is the commande ID. Ensure the API endpoint http://localhost:5000/api/commandes/:id/avec-details is implemented to return the commande data.

If you need further clarification, adjustments, or additional features (e.g., merging with the existing DetailsCommandeTransitaire or direct PDF generation), please let me know!








4s
je veux que tu lie plutot la page Details la a la page Commandes Transitaire que je vais te donner . et je veux que tu modifie aussi les autres fichiers
CommandesTransitaire.js




Based on your request, I understand you want to link the DetailsCommandeTransitaire.js page (previously created as a renamed version of DetailsCommande.js) to the CommandesTransitaire.js page, and you also want me to modify the relevant files to ensure this integration. The CommandesTransitaire.js page uses a Swiper component to display a list of commandes, and each commande card navigates to /transitaire/commande/:id when clicked. Since you mentioned linking the Details page to CommandesTransitaire.js, I’ll assume you want the DetailsCommandeTransitaire.js page to be accessible via the existing /transitaire/commande/:id route, replacing any existing implementation for that route, and remove the /commande/details/:id route from App.js to avoid redundancy. Additionally, I’ll ensure all files are consistent and fully updated.

Here’s the plan:

Update App.js: Modify the routing to ensure the /transitaire/commande/:id route uses the DetailsCommandeTransitaire.js component. Remove the /commande/details/:id route since it’s no longer needed, and ensure the RequireTransitaire guard is applied to restrict access to the transitaire role.
Keep DetailsCommandeTransitaire.js: Retain the existing DetailsCommandeTransitaire.js code, as it already provides a read-only view of a commande with PDF download functionality, and it’s compatible with the /transitaire/commande/:id route.
Update CommandesTransitaire.js: Ensure the navigation in CommandesTransitaire.js continues to point to /transitaire/commande/:id, which will now render DetailsCommandeTransitaire.js. No changes are needed here since the navigation is already correct, but I’ll provide the full file for completeness and clarity.
Below are the complete codes for all three files, wrapped in <xaiArtifact> tags. The artifact_id for App.js and DetailsCommandeTransitaire.js will remain the same as in the previous response since these are updates to those artifacts. The CommandesTransitaire.js file will have a new artifact_id since it’s a new artifact being provided.

App.js
javascript
Afficher en ligne
DetailsCommandeTransitaire.js
javascript
Afficher en ligne
CommandesTransitaire.js
javascript
Afficher en ligne
Explanation of Changes
App.js:
Removed Route: Removed the /commande/details/:id route to avoid redundancy, as you want the DetailsCommandeTransitaire.js page to be linked via the existing /transitaire/commande/:id route used by CommandesTransitaire.js.
Updated Route: Ensured the /transitaire/commande/:id route uses DetailsCommandeTransitaire with the RequireTransitaire guard, restricting access to users with the transitaire role.
Kept artifact_id: Retained the artifact_id (a3d07013-71c2-45f0-becf-c2781c82f16a) since this is an update to the previously provided App.js.
Other Routes: Left all other routes unchanged to maintain the application’s functionality.
Removed RequireAuthenticated: Removed the RequireAuthenticated component since it’s no longer needed without the /commande/details/:id route.
DetailsCommandeTransitaire.js:
No Functional Changes: Kept the code identical to the previous version, as it already supports fetching commande details by ID, displaying them in a read-only format, and generating a LaTeX file for PDF download.
Kept artifact_id: Retained the artifact_id (712579e5-ccf9-4bea-8983-24f0baac4d2b) since this is an unchanged artifact from the previous response, just linked differently.
API Consistency: The page uses the http://localhost:5000/api/commandes/${id}/avec-details endpoint, which aligns with the expected data structure from ModifierCommande.js and should work with the commandes fetched in CommandesTransitaire.js.
CommandesTransitaire.js:
No Changes Needed: The navigation in CommandesTransitaire.js already points to /transitaire/commande/${commande.id}, which now correctly links to DetailsCommandeTransitaire.js due to the updated App.js routing.
Provided for Completeness: Included the full code with a new artifact_id (f8c9a1e2-9b3e-4f7d-8f1c-7a2d5e8b9c1a) since it’s a new artifact in this conversation.
Verification: The commande.id used in the navigation matches the :id parameter expected by DetailsCommandeTransitaire.js, ensuring seamless integration.
Integration Details
Navigation Flow: In CommandesTransitaire.js, clicking a commande card navigates to /transitaire/commande/:id, which renders DetailsCommandeTransitaire.js. This page fetches the commande details using the ID and displays them in a read-only format with a PDF download option.
Access Control: The /transitaire/commande/:id route is protected by RequireTransitaire, ensuring only users with the transitaire role can access it, aligning with the context of CommandesTransitaire.js.
PDF Generation: The DetailsCommandeTransitaire.js page generates a .tex file for download, which can be compiled into a PDF using a LaTeX editor (e.g., Overleaf). The LaTeX code uses a comprehensive preamble with packages like geometry, booktabs, longtable, and eurosym (for AED currency display, as a placeholder).
Notes
Existing DetailsCommandeTransitaire: Your original App.js already had a DetailsCommandeTransitaire component for the /transitaire/commande/:id route. By using the provided DetailsCommandeTransitaire.js for this route, I’m assuming you want to replace the existing implementation with the new one (read-only view with PDF download). If the original DetailsCommandeTransitaire has different functionality that needs to be preserved, please provide its code or clarify how to merge the functionalities.
API Consistency: Ensure the http://localhost:5000/api/commandes/${id}/avec-details endpoint returns data in the expected format (matching ModifierCommande.js’s structure: numero, description, date, statut, fournisseurs with nom, contact, and produits containing nom, quantite, prix_unitaire). The http://localhost:5000/api/commandes endpoint in CommandesTransitaire.js should also return a list of commandes with at least id, numero, and statut fields.
Currency Symbol: The LaTeX code uses eurosym for AED as a placeholder. If you need a specific AED symbol, you may need to define a custom LaTeX command or adjust the currency rendering.
Direct PDF Generation: The current implementation downloads a .tex file. If you need direct PDF generation in the browser or server-side, additional setup (e.g., a LaTeX rendering service or library like pdfkit) would be required.
To use the updated application:

Navigate to /commandes-transitaire (accessible to transitaire users).
Click a commande card to go to /transitaire/commande/:id, which displays the read-only details in DetailsCommandeTransitaire.js.
Use the “Télécharger PDF” button to download a .tex file for PDF compilation.
If you need further modifications (e.g., merging with an existing DetailsCommandeTransitaire, adding direct PDF generation, or adjusting styling), please let me know!








7,2s
je veux aussi que tu modifie les fichiers du backend que je vais te fournir et situ vois que tu as mal fait les autres fichiers du front tu peux aussi les reprendre
commandeController.js
commande.js




Thank you for providing the backend files (commandeController.js and commande.js). Your request is to modify the backend files to support the functionality of the DetailsCommandeTransitaire.js page, which is linked to the /transitaire/commande/:id route from CommandesTransitaire.js. Additionally, you’ve asked me to review and correct any mistakes in the previously provided frontend files (App.js, DetailsCommandeTransitaire.js, CommandesTransitaire.js) if necessary.

Analysis
Backend Requirements:
The DetailsCommandeTransitaire.js page fetches commande details using the endpoint http://localhost:5000/api/commandes/${id}/avec-details. However, the provided commandeController.js only has an endpoint for /derniere/avec-details (fetching the latest commande with details) and not for a specific commande by ID (/:id/avec-details).
The CommandesTransitaire.js page uses http://localhost:5000/api/commandes to fetch all commandes, which is already supported by getAllCommandes in commandeController.js.
The commande.js router needs to include a new route for GET /:id/avec-details to fetch a specific commande’s details, including its fournisseurs and produits, to support DetailsCommandeTransitaire.js.
Frontend Review:
App.js: The previous version correctly routes /transitaire/commande/:id to DetailsCommandeTransitaire with the RequireTransitaire guard, and the removal of /commande/details/:id aligns with your intent to use the existing route. No changes are needed unless you specify otherwise.
DetailsCommandeTransitaire.js: The page assumes the API returns a commande object with numero, description, date, statut, and a fournisseurs array containing nom, contact, and produits (with nom, quantite, prix_unitaire). The backend must support this structure. The LaTeX generation for PDF download is correct, but I’ll ensure the data structure aligns with the backend. The navigate("/commande") on error might need adjustment to navigate to /commandes-transitaire for consistency with the transitaire flow.
CommandesTransitaire.js: The navigation to /transitaire/commande/:id is correct, and the API call to /api/commandes aligns with getAllCommandes. No changes are needed unless additional functionality is required.
Backend Modifications:
Add a new controller function in commandeController.js for getCommandeAvecDetails to handle GET /:id/avec-details.
Update commande.js to register this new route.
Ensure the response format of the new endpoint matches the expected structure in DetailsCommandeTransitaire.js.
Frontend Adjustments:
Update DetailsCommandeTransitaire.js to navigate to /commandes-transitaire on error instead of /commande for better user flow in the transitaire context.
Verify that all frontend files align with the backend’s data structure and routing.
Updated Files
Below are the complete codes for the backend (commandeController.js, commande.js) and frontend (App.js, DetailsCommandeTransitaire.js, CommandesTransitaire.js) files, wrapped in <xaiArtifact> tags. The artifact_id for previously provided files (App.js, DetailsCommandeTransitaire.js, CommandesTransitaire.js) is retained since these are updates, while new artifact_ids are assigned to commandeController.js and commande.js as they are new artifacts in this conversation.

Backend Files
commandeController.js
javascript
Afficher en ligne
commande.js
javascript
Afficher en ligne
Frontend Files
App.js
javascript
Afficher en ligne
DetailsCommandeTransitaire.js
javascript
Afficher en ligne
CommandesTransitaire.js
javascript
Afficher en ligne
Explanation of Changes
Backend Changes
commandeController.js:
Added getCommandeAvecDetails: New function to handle GET /:id/avec-details, fetching a specific commande by ID with its fournisseurs and produits. The query is based on getDerniereCommandeAvecDetails but filters by c.id = $1 instead of statut = 'En cours'.
Response Format: The endpoint returns a JSON object with commande_id, numero, date, description, total, statut, and a fournisseurs array containing objects with id, nom, contact, and a produits array (with id, nom, quantite, prix_unitaire, total). This matches the structure expected by DetailsCommandeTransitaire.js.
Error Handling: Returns a 404 status if no commande is found and a 500 status for server errors, consistent with other endpoints.
Kept Existing Functions: No changes to other functions (creerCommande, getAllCommandes, getDerniereCommande, getDerniereCommandeAvecDetails, updateCommande, annulerDerniereCommande) to maintain existing functionality.
commande.js:
Added Route: Added GET /:id/avec-details to map to getCommandeAvecDetails.
Route Order: Placed the new route before /derniere to avoid route conflicts, as Express matches routes in order and /:id could be misinterpreted if placed after more specific routes.
Kept Existing Routes: No changes to other routes to preserve functionality.
Frontend Changes
App.js:
No Changes Needed: The routing for /transitaire/commande/:id to DetailsCommandeTransitaire with RequireTransitaire is correct. The removal of /commande/details/:id from the previous version aligns with your intent to use the transitaire-specific route.
Kept artifact_id: Retained a3d07013-71c2-45f0-becf-c2781c82f16a as this is an update with no functional changes.
DetailsCommandeTransitaire.js:
Navigation Update: Changed the error navigation from navigate("/commande") to navigate("/commandes-transitaire") in the fetchCommande function and the “Retour” button’s onClick handler. This ensures users return to the CommandesTransitaire page, improving the transitaire user flow.
Data Structure: The expected API response (commande_id, numero, date, description, statut, fournisseurs with nom, contact, produits containing nom, quantite, prix_unitaire) aligns with the new getCommandeAvecDetails endpoint.
PDF Generation: The LaTeX code remains unchanged, using eurosym for AED (as a placeholder) and a comprehensive preamble (geometry, booktabs, longtable, xcolor) per LaTeX guidelines.
Kept artifact_id: Retained 712579e5-ccf9-4bea-8983-24f0baac4d2b as this is an update to the previous version.
CommandesTransitaire.js:
No Changes Needed: The navigation to /transitaire/commande/:id is correct, and the API call to http://localhost:5000/api/commandes aligns with getAllCommandes. The commande object’s id, numero, and statut fields are sufficient for the Swiper cards.
Kept artifact_id: Retained aa8ce6b3-69ce-42a8-8135-2817d67b0c93 as this is an unchanged artifact included for completeness.
Integration Details
Navigation Flow: In CommandesTransitaire.js, clicking a commande card navigates to /transitaire/commande/:id, which renders DetailsCommandeTransitaire.js. The page fetches details using http://localhost:5000/api/commandes/${id}/avec-details, displays them in a read-only format, and allows downloading a .tex file for PDF compilation.
Backend Support: The new getCommandeAvecDetails endpoint in commandeController.js supports the DetailsCommandeTransitaire.js page by providing the full commande details. The getAllCommandes endpoint supports CommandesTransitaire.js.
Access Control: The /transitaire/commande/:id route is restricted to transitaire users via RequireTransitaire, aligning with the transitaire context.
PDF Generation: The .tex file generated by DetailsCommandeTransitaire.js can be compiled into a PDF using a LaTeX editor (e.g., Overleaf). Direct PDF generation would require additional server-side processing.
Notes
API Consistency: The getCommandeAvecDetails endpoint returns data in the same format as getDerniereCommandeAvecDetails, ensuring compatibility with DetailsCommandeTransitaire.js. Verify that the database schema (commandes, fournisseurs, produits tables) matches the queries.
Currency Symbol: The LaTeX code uses eurosym for AED as a placeholder. For a proper AED symbol, you may need to define a custom LaTeX command (e.g., \newcommand{\AED}{AED}) or use a font supporting Arabic currencies if required.
Potential Conflict: The original App.js referenced a DetailsCommandeTransitaire for /transitaire/commande/:id. The provided DetailsCommandeTransitaire.js is assumed to replace it. If the original page has unique functionality, please share its code to merge or clarify requirements.
Direct PDF Generation: If you need direct PDF download instead of a .tex file, a server-side LaTeX rendering service (e.g., using latexmk) or a client-side library (e.g., pdfkit) could be integrated. Let me know if you want to explore this.
Styling Consistency: The background color in DetailsCommandeTransitaire.js (bg-blue-400) differs from CommandesTransitaire.js (bg-[#3AB3E7]). For consistency, you might want to standardize to #3AB3E7. I kept bg-blue-400 as it matches ModifierCommande.js, but I can update it if desired.
To use the application:

Ensure the backend server is running with the updated commandeController.js and commande.js.
Navigate to /commandes-transitaire (for transitaire users) to see the commande list.
Click a commande card to view details at /transitaire/commande/:id.
Use the “Télécharger PDF” button to download a .tex file for PDF compilation.
If you need further adjustments (e.g., styling changes, direct PDF generation, or merging with an existing DetailsCommandeTransitaire), please provide details!








6,6s
je veux que tu modifie ce fichier pour que il prenne aussi les case qu'il n'a pas récupérer de la bas de donnée(prix et numéro)
Aucune réponse.

Grok n'a pas pu terminer sa réponse.
Veuillez réessayer ultérieurement ou utiliser un autre modèle.
Réessayer

Comment Grok peut-il aider ?


DeepSearch


Think

Grok 3

ModifierCommande.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ModifierCommande() {
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedFournisseurs, setEditedFournisseurs] = useState([]);

  useEffect(() => {
    const fetchCommande = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/commandes/derniere/avec-details");
        if (!res.ok) {
          throw new Error("Aucune commande en cours à modifier.");
        }
        const data = await res.json();
        setCommande(data);
        setEditedDescription(data.description || "");
        setEditedFournisseurs(
          data.fournisseurs.map((f) => ({
            nom: f.nom,
            contact: f.contact,
            produits: f.produits.map((p) => ({
              nom: p.nom,
              quantite: p.quantite,
              prix_unitaire: p.prix_unitaire,
            })),
          }))
        );
      } catch (err) {
        alert(err.message);
        navigate("/commande");
      }
    };
    fetchCommande();
  }, [navigate]);

  const handleChangeFournisseur = (index, field, value) => {
    const newFournisseurs = [...editedFournisseurs];
    newFournisseurs[index][field] = value;
    setEditedFournisseurs(newFournisseurs);
  };

  const handleChangeProduit = (fIndex, pIndex, field, value) => {
    const newFournisseurs = [...editedFournisseurs];
    newFournisseurs[fIndex].produits[pIndex][field] = field === "quantite" || field === "prix_unitaire" ? Number(value) : value;
    setEditedFournisseurs(newFournisseurs);
  };

  const handleAddFournisseur = () => {
    setEditedFournisseurs([
      ...editedFournisseurs,
      { nom: "", contact: "", produits: [{ nom: "", quantite: 1, prix_unitaire: 0 }] },
    ]);
  };

  const handleAddProduit = (fIndex) => {
    const newFournisseurs = [...editedFournisseurs];
    newFournisseurs[fIndex].produits.push({ nom: "", quantite: 1, prix_unitaire: 0 });
    setEditedFournisseurs(newFournisseurs);
  };

  const handleRemoveFournisseur = (fIndex) => {
    setEditedFournisseurs(editedFournisseurs.filter((_, i) => i !== fIndex));
  };

  const handleRemoveProduit = (fIndex, pIndex) => {
    const newFournisseurs = [...editedFournisseurs];
    newFournisseurs[fIndex].produits = newFournisseurs[fIndex].produits.filter((_, i) => i !== pIndex);
    setEditedFournisseurs(newFournisseurs);
  };

  const calculTotal = () => {
    return editedFournisseurs.reduce((acc, f) => {
      return acc + f.produits.reduce((pAcc, p) => pAcc + (p.quantite * p.prix_unitaire || 0), 0);
    }, 0).toFixed(2);
  };

  const handleSubmit = async () => {
    if (!commande) return;
    try {
      const total = calculTotal();
      const mappedFournisseurs = editedFournisseurs.map((f) => ({
        nom: f.nom,
        contact: f.contact,
        produits: f.produits.map((p) => ({
          nom: p.nom,
          quantite: p.quantite,
          prix_unitaire: p.prix_unitaire,
          total: p.quantite * p.prix_unitaire,
        })),
      }));

      const res = await fetch(`http://localhost:5000/api/commandes/${commande.commande_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: editedDescription,
          total,
          fournisseurs: mappedFournisseurs,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Commande modifiée avec succès !");
        navigate("/commande");
      } else {
        alert("Erreur lors de la modification : " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur.");
    }
  };

  const handleCancel = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/commandes/annuler", {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        alert("Commande annulée !");
        navigate("/commande");
      } else {
        alert("Erreur lors de l'annulation : " + data.message);
      }
    } catch (err) {
      alert("Erreur de connexion.");
      console.error(err);
    }
  };

  if (!commande) {
    return <div className="min-h-screen bg-blue-400 p-6 text-white text-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-400 p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/commande")}
          className="bg-white text-blue-700 px-4 py-2 rounded shadow"
        >
          ← Retour
        </button>
        <h1 className="text-xl font-bold text-white ml-6">Modifier la commande</h1>
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
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Description de la commande…"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="text"
              value={new Date(commande.date).toLocaleDateString("fr-FR")}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Statut</label>
            <input
              type="text"
              value={commande.statut}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Fournisseurs & Produits */}
      <div className="bg-white rounded shadow p-4 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold mb-4">Fournisseurs et Produits</h2>

        {editedFournisseurs.map((f, fIndex) => (
          <div key={fIndex} className="border rounded p-4 mb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold mb-2">Fournisseur {fIndex + 1}</h3>
              <button
                onClick={() => handleRemoveFournisseur(fIndex)}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded"
              >
                Supprimer Fournisseur
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                className="p-2 border rounded"
                placeholder="Nom du fournisseur"
                value={f.nom}
                onChange={(e) => handleChangeFournisseur(fIndex, "nom", e.target.value)}
              />
              <input
                className="p-2 border rounded"
                placeholder="Contact"
                value={f.contact}
                onChange={(e) => handleChangeFournisseur(fIndex, "contact", e.target.value)}
              />
            </div>

            {f.produits.map((p, pIndex) => (
              <div key={pIndex} className="mb-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold mb-1">Produit {pIndex + 1}</p>
                  <button
                    onClick={() => handleRemoveProduit(fIndex, pIndex)}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Supprimer Produit
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-4 items-center">
                  <input
                    className="p-2 border rounded"
                    placeholder="Nom du produit"
                    value={p.nom}
                    onChange={(e) =>
                      handleChangeProduit(fIndex, pIndex, "nom", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    className="p-2 border rounded"
                    placeholder="Quantité"
                    value={p.quantite}
                    onChange={(e) =>
                      handleChangeProduit(fIndex, pIndex, "quantite", e.target.value)
                    }
                  />
                  <div className="flex items-center border rounded px-2">
                    <input
                      type="number"
                      className="w-full p-2 outline-none"
                      placeholder="Prix unitaire"
                      value={p.prix_unitaire}
                      onChange={(e) =>
                        handleChangeProduit(fIndex, pIndex, "prix_unitaire", e.target.value)
                      }
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

            <button
              onClick={() => handleAddProduit(fIndex)}
              className="text-sm bg-blue-700 text-white px-3 py-1 rounded mt-2"
            >
              + Ajouter Produit
            </button>
          </div>
        ))}

        <button
          onClick={handleAddFournisseur}
          className="text-sm bg-blue-700 text-white px-3 py-2 rounded"
        >
          + Ajouter Fournisseur
        </button>
      </div>

      {/* Total + Actions */}
      <div className="max-w-4xl mx-auto text-center mt-8">
        <div className="bg-blue-500 text-white font-bold text-xl py-4 rounded">
          Montant de la commande : {calculTotal()} AED
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            Annuler la commande
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-700 text-white px-6 py-2 rounded"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}