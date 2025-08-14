import { BentoGrid, BentoItem, BentoItemWide, BentoItemFull } from "@/layouts/BentoLayout"
import LatestItems from "@/components/LatestItems"
import useStore from "@/stores/useStore"
import { Link } from "react-router-dom"
import React from "react"

const HomePage: React.FC = () => {
  const { auth } = useStore()
  const { user } = auth

  return (
    <div className="min-h-screen bg-fr-grey-light/20 py-8">
      {/* Hero Section */}
      <BentoItemFull
        title="Bienvenue sur CESIZen"
        description="Votre compagnon pour la gestion du stress et la santé mentale"
        className="mb-8 bg-gradient-to-r from-fr-blue to-fr-blue-dark text-white"
      >
        <div className="py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {user ? `Bonjour, ${user.firstName} !` : "Prenez soin de vous"}
          </h1>
          <p className="text-lg opacity-90">
            Découvrez nos outils et ressources pour votre bien-être
          </p>
        </div>
      </BentoItemFull>

      <BentoGrid>
        {/* Module Informations */}
        <BentoItemWide title="Informations" description="Restez informé sur la santé mentale">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Section Informations */}
            <LatestItems
              type="information"
              limit={3}
              title="Derniers Articles"
              viewAllText="Voir tous les articles →"
            />
            {/* Section Activités */}
            <LatestItems
              type="activity"
              limit={3}
              title="Activités Recommandées"
              viewAllText="Découvrir les activités →"
            />
          </div>
        </BentoItemWide>

        {/* Module Exercices de Respiration */}
        <BentoItem title="Exercices de Respiration" description="Pratiquez la cohérence cardiaque">
          <div className="text-center p-4">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-fr-blue/10 flex items-center justify-center">
              <span className="text-3xl">🫁</span>
            </div>
            <Link
              to="/activities"
              className="inline-block bg-fr-blue text-white px-6 py-2 rounded-md hover:bg-fr-blue-dark transition-colors"
            >
              Découvrir
            </Link>
          </div>
        </BentoItem>

        {/* Statistiques Utilisateur */}
        {user && (
          <BentoItem title="Vos Statistiques" description="Suivez votre progression">
            <div className="space-y-4">
              {/* Stats à implémenter */}
              <p className="text-center text-fr-grey-dark">Statistiques à venir</p>
            </div>
          </BentoItem>
        )}

        {/* Accès Rapide */}
        {!user && (
          <BentoItemWide
            title="Rejoignez-nous"
            description="Créez votre compte pour accéder à toutes les fonctionnalités"
          >
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/login"
                className="p-4 bg-fr-blue text-white rounded-lg hover:bg-fr-blue-dark transition-colors text-center"
              >
                <h4 className="font-semibold mb-1">Connexion</h4>
                <p className="text-sm opacity-90">Accédez à votre compte</p>
              </Link>
              <Link
                to="/register"
                className="p-4 bg-fr-grey-light/10 rounded-lg hover:bg-fr-grey-light/20 transition-colors text-center"
              >
                <h4 className="font-semibold mb-1">Inscription</h4>
                <p className="text-sm text-fr-grey-dark">Créez votre compte</p>
              </Link>
            </div>
          </BentoItemWide>
        )}
        {user && (
          <BentoItemWide title="Accès Rapide" description="Vos fonctionnalités essentielles">
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/profile"
                className="p-4 bg-fr-grey-light/10 rounded-lg hover:bg-fr-grey-light/20 transition-colors text-left"
              >
                <h4 className="font-semibold mb-1">Profil</h4>
                <p className="text-sm text-fr-grey-dark">Gérez vos informations</p>
              </Link>
              <Link
                to="/profile"
                className="p-4 bg-fr-grey-light/10 rounded-lg hover:bg-fr-grey-light/20 transition-colors text-left"
              >
                <h4 className="font-semibold mb-1">Paramètres</h4>
                <p className="text-sm text-fr-grey-dark">Personnalisez l'application</p>
              </Link>
            </div>
          </BentoItemWide>
        )}
      </BentoGrid>
    </div>
  )
}

export default HomePage
