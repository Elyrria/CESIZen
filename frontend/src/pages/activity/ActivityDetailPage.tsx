import React, { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import useStore from "@/stores/useStore"
import ActivityCard from "@/components/ui/ActivityCard"
import HeartCoherenceExercise from "@/components/activities/HeartCoherenceExercise"
import Button from "@/components/ui/Button"
import type { IActivity, CategoryId } from "@/factories/Factory"

// Components for different activity types
const TextActivityContent: React.FC<{ activity: IActivity }> = ({ activity }) => (
  <div className="prose prose-fr max-w-none">
    <div className="bg-fr-blue/5 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-fr-blue mb-3">📋 Instructions</h3>
      <div className="text-fr-grey-dark leading-relaxed whitespace-pre-wrap">
        {activity.content || "Contenu de l'exercice non disponible."}
      </div>
    </div>

    {activity.parameters && (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">⚙️ Paramètres de l'exercice</h4>
        <pre className="text-sm text-green-700 bg-white p-3 rounded overflow-auto">
          {JSON.stringify(activity.parameters, null, 2)}
        </pre>
      </div>
    )}
  </div>
)

const VideoActivityContent: React.FC<{ activity: IActivity }> = ({ activity }) => (
  <div>
    {activity.mediaUrl ? (
      <div className="mb-6">
        <video
          controls
          className="w-full max-w-4xl mx-auto rounded-lg shadow-md"
          poster={activity.thumbnailUrl}
        >
          <source src={activity.mediaUrl} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      </div>
    ) : (
      <div className="bg-fr-grey-light/20 rounded-lg p-8 text-center mb-6">
        <div className="text-4xl mb-4">🎥</div>
        <p className="text-fr-grey-dark">Vidéo non disponible</p>
      </div>
    )}

    {activity.content && (
      <div className="bg-fr-blue/5 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-fr-blue mb-3">📝 Description</h3>
        <div className="text-fr-grey-dark leading-relaxed whitespace-pre-wrap">
          {activity.content}
        </div>
      </div>
    )}
  </div>
)

const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { activity, category } = useStore()
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (!id || hasLoaded) return

    const loadActivity = async () => {
      setIsLoading(true)
      setHasLoaded(true)

      try {
        const activityData = await activity.fetchPublicActivity(id)
        if (activityData) {
          setSelectedActivity(activityData)
        } else {
          navigate("/activities")
        }
      } catch (error) {
        console.error("❌ Erreur:", error)
        navigate("/activities")
      } finally {
        setIsLoading(false)
      }
    }

    loadActivity()
  }, [id]) // Simple dependency + hasLoaded guard

  useEffect(() => {
    // Load categories only once
    if (category.publicCategories.length === 0) {
      category.fetchPublicCategories()
    }
  }, [])

  const getCategoryName = (categoryId: CategoryId): string => {
    if (typeof categoryId === "string") {
      const categoryItem = category.publicCategories.find((c) => c.id === categoryId)
      return categoryItem ? categoryItem.name : "Non catégorisé"
    }
    if (Array.isArray(categoryId)) {
      if (categoryId.length === 0) return "Non catégorisé"
      const firstCategory = categoryId[0]
      if (typeof firstCategory === "string") {
        const categoryItem = category.publicCategories.find((c) => c.id === firstCategory)
        return categoryItem ? categoryItem.name : "Non catégorisé"
      }
      return firstCategory.name || "Non catégorisé"
    }
    return "Non catégorisé"
  }

  // Improve heart coherence exercise detection
  const isHeartCoherenceActivity =
    selectedActivity &&
    (selectedActivity.name.toLowerCase().includes("cohérence") ||
      selectedActivity.name.toLowerCase().includes("cardiaque") ||
      (selectedActivity.parameters &&
        "breathingPatterns" in selectedActivity.parameters &&
        Array.isArray((selectedActivity.parameters as Record<string, unknown>).breathingPatterns)))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-fr-grey-light/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-fr-blue mx-auto mb-6"></div>
          <p className="text-fr-grey-dark text-lg">Chargement de l'activité...</p>
        </div>
      </div>
    )
  }

  if (!selectedActivity) {
    return (
      <div className="min-h-screen bg-fr-grey-light/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-md">
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-xl font-semibold text-fr-grey-dark mb-4">Activité non trouvée</h1>
            <p className="text-fr-grey-dark mb-6">
              L'activité que vous cherchez n'existe pas ou n'est plus disponible.
            </p>
            <Button
              onClick={() => navigate("/activities")}
              className="bg-fr-blue text-white hover:bg-fr-blue/90"
            >
              ← Retour aux activités
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-fr-grey-light/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Fil d'ariane">
          <ol className="flex items-center space-x-2 text-sm text-fr-grey-dark">
            <li>
              <Link to="/" className="hover:text-fr-blue transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <span className="mx-2 text-fr-grey">/</span>
            </li>
            <li>
              <Link to="/activities" className="hover:text-fr-blue transition-colors">
                Activités
              </Link>
            </li>
            <li>
              <span className="mx-2 text-fr-grey">/</span>
            </li>
            <li className="text-fr-blue font-medium truncate">{selectedActivity.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-fr-md overflow-hidden">
          {/* Activity header */}
          <div className="p-6 border-b border-fr-grey-light bg-gradient-to-r from-fr-blue/5 to-transparent">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold text-fr-blue">{selectedActivity.name}</h1>
                  {isHeartCoherenceActivity && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ❤️ Recommandé
                    </span>
                  )}
                </div>
                <p className="text-fr-grey-dark text-lg leading-relaxed mb-4">
                  {selectedActivity.descriptionActivity}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-fr-blue">Type:</span>
                    <span className="bg-fr-blue/10 text-fr-blue px-2 py-1 rounded">
                      {selectedActivity.type === "TEXT" ? "Exercice" : "Vidéo"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-fr-blue">Catégorie:</span>
                    <span className="bg-fr-blue/10 text-fr-blue px-2 py-1 rounded">
                      {getCategoryName(selectedActivity.categoryId)}
                    </span>
                  </div>
                  {selectedActivity.isActive && (
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        ✓ Actif
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Type-specific content */}
          <div className="p-6">
            {isHeartCoherenceActivity ? (
              <HeartCoherenceExercise activity={selectedActivity} />
            ) : selectedActivity.type === "TEXT" ? (
              <TextActivityContent activity={selectedActivity} />
            ) : selectedActivity.type === "VIDEO" ? (
              <VideoActivityContent activity={selectedActivity} />
            ) : (
              <div className="text-center py-8 text-fr-grey-dark">
                <div className="text-4xl mb-4">❓</div>
                Type d'activité non reconnu
              </div>
            )}
          </div>
        </div>

        {/* Navigation to other activities */}
        {activity.activities.length > 1 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-fr-blue mb-6">
              Autres activités de bien-être
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activity.activities
                .filter((act) => act.id !== selectedActivity.id && act.isActive)
                .slice(0, 3)
                .map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    categoryLabel={getCategoryName(act.categoryId)}
                    onClick={() => navigate(`/activities/${act.id}`)}
                  />
                ))}
            </div>

            {activity.activities.filter((act) => act.id !== selectedActivity.id && act.isActive)
              .length > 3 && (
              <div className="text-center mt-6">
                <Button
                  onClick={() => navigate("/activities")}
                  className="bg-fr-blue text-white hover:bg-fr-blue/90"
                >
                  Voir toutes les activités
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityDetailPage
