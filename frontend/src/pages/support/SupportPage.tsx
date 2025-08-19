import type { ICreateTicketRequest } from "@/services/apiHandler"
import TicketForm from "@/components/forms/TicketForm"
import api from "@/services/apiHandler"
import { toast } from "react-toastify"
import React from "react"

const SupportPage: React.FC = () => {
  const handleTicketSubmit = async (ticketData: ICreateTicketRequest) => {
    try {
      const response = await api.createSupportTicket(ticketData)

      if (response.success && response.data) {
        toast.success(`Bug signalé avec succès ! Numéro de ticket : ${response.data.issueNumber}`, {
          autoClose: 8000,
          hideProgressBar: false
        })

        return {
          success: true,
          issueNumber: response.data.issueNumber
        }
      } else {
        // Gestion des erreurs API
        const errorMessage =
          response.success === false ? response.error.message : "Erreur lors du signalement"

        toast.error(errorMessage, {
          autoClose: 6000
        })

        return { success: false }
      }
    } catch (error) {
      console.error("Erreur lors de la création du ticket:", error)
      toast.error("Une erreur inattendue s'est produite. Veuillez réessayer.", {
        autoClose: 6000
      })

      return { success: false }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* En-tête de la page */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-fr-blue mb-4">Support technique</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Vous rencontrez un problème avec CESIZEN ? Signalez-nous le bug et notre équipe technique
          le traitera dans les plus brefs délais.
        </p>
      </div>

      {/* Informations importantes */}
      <div className="bg-blue-50 border-l-4 border-fr-blue rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="text-fr-blue text-2xl mr-4">ℹ️</div>
          <div>
            <h3 className="text-lg font-semibold text-fr-blue mb-2">Avant de signaler un bug</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Vérifiez que le problème persiste après avoir actualisé la page</li>
              <li>• Essayez de reproduire le problème pour mieux le décrire</li>
              <li>• Notez le navigateur et l'appareil que vous utilisez</li>
              <li>
                • Consultez notre{" "}
                <a href="/faq" className="text-fr-blue hover:underline">
                  FAQ
                </a>{" "}
                pour les problèmes courants
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formulaire de signalement */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-fr-blue mb-2">Signaler un bug</h2>
          <p className="text-gray-600">
            Remplissez le formulaire ci-dessous pour nous signaler le problème rencontré.
          </p>
        </div>

        <TicketForm onSubmit={handleTicketSubmit} />
      </div>

      {/* Informations de contact alternative */}
      <div className="mt-8 text-center">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-fr-blue mb-3">
            Besoin d'une aide différente ?
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              Pour les questions générales, consultez notre{" "}
              <a href="/faq" className="text-fr-blue hover:underline font-medium">
                Foire aux Questions
              </a>
            </p>
            <p>
              Pour les questions de confidentialité, consultez notre{" "}
              <a href="/confidentialite" className="text-fr-blue hover:underline font-medium">
                Politique de Confidentialité
              </a>
            </p>
            <p>
              Pour les mentions légales, consultez nos{" "}
              <a href="/mentions-legales" className="text-fr-blue hover:underline font-medium">
                Mentions Légales
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Temps de réponse */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-green-600 text-xl mb-2"></div>
          <h4 className="font-semibold text-green-800 mb-1">Bugs critiques</h4>
          <p className="text-sm text-green-700">Traités sous 24h ouvrées</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-yellow-600 text-xl mb-2"></div>
          <h4 className="font-semibold text-yellow-800 mb-1">Autres problèmes</h4>
          <p className="text-sm text-yellow-700">Traités sous 72h ouvrées</p>
        </div>
      </div>
    </div>
  )
}

export default SupportPage
