import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Zod validation schema
const ticketSchema = z.object({
  title: z.string().min(1, "Titre requis").max(100, "Titre trop long"),
  description: z
    .string()
    .min(10, "Description trop courte (minimum 10 caractères)")
    .max(1000, "Description trop longue"),
  priority: z.enum(["P1-Critical", "P2-High", "P3-Medium", "P4-Low"], {
    errorMap: () => ({ message: "Priorité invalide" })
  }),
  userEmail: z.string().email("Email invalide").optional().or(z.literal(""))
})

type TicketFormData = z.infer<typeof ticketSchema>

interface TicketFormProps {
  onSubmit: (ticketData: TicketFormData) => Promise<{ success: boolean; issueNumber?: string }>
  isLoading?: boolean
  onCancel?: () => void
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, isLoading = false, onCancel }) => {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
    issueNumber?: string
  }>({ type: null, message: "" })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "P3-Medium",
      userEmail: ""
    }
  })

  const watchedPriority = watch("priority")

  const onFormSubmit = async (data: TicketFormData) => {
    try {
      setSubmitStatus({ type: null, message: "" })

      // Nettoyer l'email si vide
      const cleanData = {
        ...data,
        userEmail: data.userEmail?.trim() || undefined
      }

      const result = await onSubmit(cleanData)

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: `Bug signalé avec succès !`,
          issueNumber: result.issueNumber
        })
        reset()
      } else {
        setSubmitStatus({
          type: "error",
          message: "Erreur lors du signalement. Veuillez réessayer."
        })
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      setSubmitStatus({
        type: "error",
        message: "Une erreur inattendue s'est produite."
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P1-Critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "P2-High":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "P3-Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "P4-Low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getPriorityDescription = (priority: string) => {
    switch (priority) {
      case "P1-Critical":
        return "Application inutilisable, erreur bloquante"
      case "P2-High":
        return "Fonctionnalité importante non disponible"
      case "P3-Medium":
        return "Problème gênant mais contournable"
      case "P4-Low":
        return "Amélioration ou problème mineur"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Message de statut */}
      {submitStatus.type && (
        <div
          className={`rounded-lg p-4 border ${
            submitStatus.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="text-lg">{submitStatus.type === "success" ? "✅" : "❌"}</div>
            <div>
              <p className="font-medium">{submitStatus.message}</p>
              {submitStatus.issueNumber && (
                <p className="text-sm mt-1">
                  Numéro de ticket : <span className="font-mono">{submitStatus.issueNumber}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Information sur le signalement */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-lg">🐛</div>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Signaler un bug</h4>
            <p className="text-sm text-blue-700">
              Aidez-nous à améliorer CESIZEN en signalant les problèmes que vous rencontrez. Votre
              signalement sera automatiquement traité par notre équipe technique.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="title">
            Titre du problème *
          </label>
          <input
            {...register("title")}
            id="title"
            type="text"
            placeholder="Résumé court du problème rencontré"
            className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
              errors.title ? "ring-2 ring-fr-red border-fr-red" : ""
            }`}
            disabled={isLoading || isSubmitting}
          />
          {errors.title && <p className="text-fr-red text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Priorité */}
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="priority">
            Priorité *
          </label>
          <select
            {...register("priority")}
            id="priority"
            className={`w-full px-4 py-3 rounded-md bg-gray-50 text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
              errors.priority ? "ring-2 ring-fr-red border-fr-red" : ""
            }`}
            disabled={isLoading || isSubmitting}
          >
            <option value="P1-Critical">P1 - Critique</option>
            <option value="P2-High">P2 - Élevée</option>
            <option value="P3-Medium">P3 - Moyenne</option>
            <option value="P4-Low">P4 - Faible</option>
          </select>
          {errors.priority && <p className="text-fr-red text-sm mt-1">{errors.priority.message}</p>}

          {/* Description de la priorité sélectionnée */}
          <div
            className={`mt-2 px-3 py-2 rounded-md border text-sm ${getPriorityColor(
              watchedPriority
            )}`}
          >
            <strong>{watchedPriority} :</strong> {getPriorityDescription(watchedPriority)}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description détaillée *
          </label>
          <textarea
            {...register("description")}
            id="description"
            rows={6}
            placeholder="Décrivez le problème rencontré, les étapes pour le reproduire, et le comportement attendu..."
            className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue resize-vertical ${
              errors.description ? "ring-2 ring-fr-red border-fr-red" : ""
            }`}
            disabled={isLoading || isSubmitting}
          />
          {errors.description && (
            <p className="text-fr-red text-sm mt-1">{errors.description.message}</p>
          )}

          {/* Conseils de rédaction */}
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-medium mb-1">Conseils pour un bon signalement :</p>
            <ul className="text-xs space-y-1 ml-4">
              <li>• Décrivez les étapes pour reproduire le problème</li>
              <li>• Indiquez le navigateur et l'appareil utilisés</li>
              <li>• Précisez le comportement attendu vs observé</li>
              <li>• Ajoutez des détails sur le contexte d'utilisation</li>
            </ul>
          </div>
        </div>

        {/* Email (optionnel) */}
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="userEmail">
            Email pour suivi (optionnel)
          </label>
          <input
            {...register("userEmail")}
            id="userEmail"
            type="email"
            placeholder="votre.email@exemple.com"
            className={`w-full px-4 py-3 rounded-md bg-white text-fr-blue border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue ${
              errors.userEmail ? "ring-2 ring-fr-red border-fr-red" : ""
            }`}
            disabled={isLoading || isSubmitting}
          />
          {errors.userEmail && (
            <p className="text-fr-red text-sm mt-1">{errors.userEmail.message}</p>
          )}
          <p className="text-sm text-gray-600 mt-1">
            Laissez votre email si vous souhaitez être informé du traitement de votre signalement
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || isSubmitting}
            >
              Annuler
            </button>
          )}
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fr-blue focus:border-fr-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isSubmitting}
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-fr-blue text-white rounded-md font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fr-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signalement en cours...
              </>
            ) : (
              <>
                <span className="mr-2">🐛</span>
                Signaler le bug
              </>
            )}
          </button>
        </div>
      </form>

      {/* Informations complémentaires */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-fr-blue mb-3">Informations importantes</h4>
        <div className="text-sm text-gray-700 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-fr-blue">•</span>
            <span>Tous les signalements sont traités par notre équipe technique</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-fr-blue">•</span>
            <span>Un numéro de ticket vous sera fourni pour le suivi</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-fr-blue">•</span>
            <span>Les bugs critiques sont traités en priorité</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-fr-blue">•</span>
            <span>Vos données sont traitées conformément au RGPD</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketForm
