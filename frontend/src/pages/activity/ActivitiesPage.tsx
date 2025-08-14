import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useStore from "@/stores/useStore"
import Select from "@/components/ui/Select"
import SearchBar from "@/components/ui/SearchBar"
import ActivityCard from "@/components/ui/ActivityCard"
import Button from "@/components/ui/Button"
import { BentoGrid, BentoItem } from "@/layouts/BentoLayout"
import type { CategoryId, ActivityType } from "@/factories/Factory"

const typeOptions = [
  { value: "TEXT", label: "Exercices" },
  { value: "VIDEO", label: "Vidéos" }
]

const ActivitiesPage: React.FC = () => {
  const navigate = useNavigate()
  const { activity, category } = useStore()
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedType, setSelectedType] = useState<"" | ActivityType>("")
  const [searchInput, setSearchInput] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)

  // Load categories on mount only once
  useEffect(() => {
    category.fetchPublicCategories()
  }, []) // No dependencies to avoid loop

  // Load activities on mount only once
  useEffect(() => {
    activity.fetchPublicActivities()
  }, []) // No dependencies to avoid loop

  // Function to reload activities with filters
  const fetchActivitiesWithFilters = async () => {
    try {
      await activity.fetchPublicActivities({
        type: selectedType !== "" ? selectedType : undefined,
        categoryId: selectedCategory || undefined,
        search: searchQuery || undefined,
        page: currentPage,
        limit: 12,
        sortBy: "createdAt",
        order: "desc"
      })
    } catch (error) {
      console.error("Erreur lors du chargement des activités:", error)
    }
  }

  // Load activities when filters change
  useEffect(() => {
    if (selectedCategory || selectedType || searchQuery || currentPage > 1) {
      fetchActivitiesWithFilters()
    }
  }, [selectedCategory, selectedType, searchQuery, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = () => {
    setSearchQuery(searchInput)
    setCurrentPage(1)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value as "" | ActivityType)
    setCurrentPage(1)
  }

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

  const handleResetFilters = () => {
    setSearchInput("")
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedType("")
    setCurrentPage(1)
    // Reload all activities
    activity.fetchPublicActivities()
  }

  const handleActivityClick = (activityId: string) => {
    navigate(`/activities/${activityId}`)
  }

  const tablePagination = activity.pagination
    ? {
        currentPage: activity.pagination.currentPage || 1,
        totalPages: activity.pagination.totalPages || 1,
        totalItems: activity.pagination.totalItems || 0,
        itemsPerPage: activity.pagination.itemsPerPage || 12
      }
    : undefined

  // Detection of special activities for highlighting
  const heartCoherenceActivities = activity.activities.filter(
    (act) =>
      act.name.toLowerCase().includes("cohérence") ||
      act.name.toLowerCase().includes("respiration") ||
      act.name.toLowerCase().includes("cardiaque")
  )

  const otherActivities = activity.activities.filter(
    (act) =>
      !act.name.toLowerCase().includes("cohérence") &&
      !act.name.toLowerCase().includes("respiration") &&
      !act.name.toLowerCase().includes("cardiaque")
  )

  return (
    <div className="min-h-screen bg-fr-grey-light/20 py-8">
      <div className="container mx-auto px-4">
        {/* Header de la page avec hero section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-fr-blue mb-6">Activités de Bien-être</h1>
          <p className="text-fr-grey-dark text-xl leading-relaxed max-w-3xl mx-auto mb-8">
            Découvrez nos exercices et activités pour améliorer votre santé mentale, gérer votre
            stress et retrouver l'équilibre au quotidien. Notre exercice phare de cohérence
            cardiaque vous accompagnera vers un mieux-être durable.
          </p>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-fr-blue">
                {activity.activities?.length || 0}
              </div>
              <div className="text-sm text-fr-grey-dark">
                Activité
                {(activity.activities?.length || 0) > 1 ? "s" : ""} disponible
                {(activity.activities?.length || 0) > 1 ? "s" : ""}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {heartCoherenceActivities.length}
              </div>
              <div className="text-sm text-fr-grey-dark">
                Exercice{heartCoherenceActivities.length > 1 ? "s" : ""} de respiration
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {category.publicCategories?.length || 0}
              </div>
              <div className="text-sm text-fr-grey-dark">
                Catégorie
                {(category.publicCategories?.length || 0) > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Filtres avec design amélioré */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-fr-blue mb-4">Filtrer les activités</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Catégories"
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={[
                  { value: "", label: "Toutes les catégories" },
                  ...(category.publicCategories || []).map((categoryItem) => ({
                    value: categoryItem.id,
                    label: categoryItem.name
                  }))
                ]}
                placeholder="Filtrer par catégorie"
              />
              <Select
                label="Types"
                value={selectedType}
                onChange={handleTypeChange}
                options={[{ value: "", label: "Tous les types" }, ...typeOptions]}
                placeholder="Types d'activités"
              />
              <div className="md:col-span-2 flex items-end gap-2">
                <div className="flex-1">
                  <SearchBar
                    label="Rechercher"
                    value={searchInput}
                    onChange={setSearchInput}
                    placeholder="Rechercher une activité..."
                    onReset={() => {
                      setSearchInput("")
                      setSearchQuery("")
                    }}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>
                <Button
                  className="h-10 px-6 bg-fr-blue text-white hover:bg-fr-blue/90"
                  onClick={handleSearch}
                  aria-label="Lancer la recherche"
                >
                  Rechercher
                </Button>
                {(searchQuery || selectedCategory || selectedType) && (
                  <Button
                    className="h-10 px-4 bg-fr-grey text-white hover:bg-fr-grey/90"
                    onClick={handleResetFilters}
                    aria-label="Réinitialiser les filtres"
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {activity.isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-fr-blue mx-auto mb-6"></div>
            <p className="text-fr-grey-dark text-lg">Chargement des activités...</p>
          </div>
        ) : activity.error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
              <p className="text-red-600 mb-6">{activity.error}</p>
              <Button
                onClick={() => activity.fetchPublicActivities()}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Réessayer
              </Button>
            </div>
          </div>
        ) : !activity.activities || activity.activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-fr-blue/5 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-fr-blue text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-fr-grey-dark mb-4">
                Aucune activité trouvée
              </h3>
              <p className="text-fr-grey-dark mb-6">
                {searchQuery || selectedCategory || selectedType
                  ? "Essayez de modifier vos critères de recherche ou supprimez les filtres"
                  : "Aucune activité n'est actuellement disponible"}
              </p>
              {(searchQuery || selectedCategory || selectedType) && (
                <Button
                  onClick={handleResetFilters}
                  className="bg-fr-blue text-white hover:bg-fr-blue/90"
                >
                  Supprimer les filtres
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Activités mises en avant (cohérence cardiaque) */}
            {heartCoherenceActivities.length > 0 &&
              !searchQuery &&
              !selectedCategory &&
              !selectedType && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-fr-blue">Exercices Recommandés</h2>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ❤️ Cohérence Cardiaque
                    </span>
                  </div>
                  <BentoGrid className="mb-8">
                    {heartCoherenceActivities.map((activityItem) => (
                      <BentoItem
                        key={activityItem.id}
                        className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      >
                        <ActivityCard
                          activity={activityItem}
                          categoryLabel={getCategoryName(activityItem.categoryId)}
                          onClick={() => handleActivityClick(activityItem.id)}
                        />
                      </BentoItem>
                    ))}
                  </BentoGrid>
                </div>
              )}

            {/* Autres activités */}
            {(otherActivities.length > 0 || searchQuery || selectedCategory || selectedType) && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-fr-blue mb-6">
                  {searchQuery || selectedCategory || selectedType
                    ? "Résultats de recherche"
                    : "Toutes les activités"}
                </h2>
                <BentoGrid className="mb-8">
                  {(searchQuery || selectedCategory || selectedType
                    ? activity.activities
                    : otherActivities
                  ).map((activityItem) => (
                    <BentoItem
                      key={activityItem.id}
                      className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      <ActivityCard
                        activity={activityItem}
                        categoryLabel={getCategoryName(activityItem.categoryId)}
                        onClick={() => handleActivityClick(activityItem.id)}
                      />
                    </BentoItem>
                  ))}
                </BentoGrid>
              </div>
            )}

            {/* Informations sur les résultats */}
            {tablePagination && tablePagination.totalItems > 0 && (
              <div className="text-center text-sm text-fr-grey-dark mb-6">
                <p className="bg-white rounded-lg py-3 px-6 inline-block shadow-sm">
                  Affichage de{" "}
                  <strong>
                    {Math.min(
                      tablePagination.itemsPerPage * (tablePagination.currentPage - 1) + 1,
                      tablePagination.totalItems
                    )}
                  </strong>{" "}
                  à{" "}
                  <strong>
                    {Math.min(
                      tablePagination.itemsPerPage * tablePagination.currentPage,
                      tablePagination.totalItems
                    )}
                  </strong>{" "}
                  sur <strong>{tablePagination.totalItems}</strong> activité
                  {tablePagination.totalItems > 1 ? "s" : ""}
                </p>
              </div>
            )}
          </>
        )}

        {/* Pagination améliorée */}
        {tablePagination && tablePagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex gap-2 items-center">
                <Button
                  onClick={() => handlePageChange(tablePagination.currentPage - 1)}
                  disabled={tablePagination.currentPage === 1}
                  className="px-4 py-2 bg-fr-blue text-white disabled:bg-fr-grey disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  ← Précédent
                </Button>

                <span className="px-3 py-2 text-fr-grey-dark bg-fr-grey-light rounded">
                  Page {tablePagination.currentPage} / {tablePagination.totalPages}
                </span>

                <Button
                  onClick={() => handlePageChange(tablePagination.currentPage + 1)}
                  disabled={tablePagination.currentPage === tablePagination.totalPages}
                  className="px-4 py-2 bg-fr-blue text-white disabled:bg-fr-grey disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  Suivant →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Call to action */}
        {!activity.isLoading && activity.activities && activity.activities.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-fr-blue/10 to-green-500/10 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-fr-blue mb-4">
                Prêt à commencer votre parcours bien-être ?
              </h3>
              <p className="text-fr-grey-dark mb-6">
                Découvrez nos exercices de respiration et techniques de relaxation pour améliorer
                votre quotidien.
              </p>
              {heartCoherenceActivities.length > 0 && (
                <Button
                  onClick={() => handleActivityClick(heartCoherenceActivities[0].id)}
                  className="bg-green-500 text-white hover:bg-green-600 px-8 py-3 text-lg"
                >
                  ❤️ Essayer la cohérence cardiaque
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivitiesPage
