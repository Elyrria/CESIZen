# docker-setup.sh - Script de setup complet Docker

set -e  # Arrêter le script en cas d'erreur

echo "Démarrage du script Docker Setup..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Charger les variables d'environnement depuis .env si le fichier existe
if [ -f .env ]; then
    log_info "Chargement du fichier .env..."
    source .env
else
    log_warning "Fichier .env non trouvé. Vérifiez que GITHUB_TOKEN et GITHUB_USERNAME sont définis."
fi

# Vérifier que les variables sont définies
if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_USERNAME" ]; then
    log_error "GITHUB_TOKEN et GITHUB_USERNAME doivent être définis dans .env ou comme variables d'environnement"
    log_info "Exemple de fichier .env:"
    log_info "GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx"
    log_info "GITHUB_USERNAME=votre-username"
    exit 1
fi

# 1. Démarrer Docker Desktop (Windows/Mac)
log_info "Vérification de Docker..."
if command -v docker &> /dev/null; then
    if ! docker info &> /dev/null; then
        log_warning "Docker n'est pas en cours d'exécution. Tentative de démarrage..."
        
        # Détection de l'OS et démarrage
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            open -a Docker
            log_info "Docker Desktop en cours de démarrage sur macOS..."
        elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OS" == "Windows_NT" ]]; then
            # Windows (Git Bash/Cygwin/PowerShell)
            log_info "Tentative de démarrage de Docker Desktop sur Windows..."
            
            # Chemins possibles de Docker Desktop sur Windows
            DOCKER_PATHS=(
                "/c/Program Files/Docker/Docker/Docker Desktop.exe"
                "/c/Program Files (x86)/Docker/Docker/Docker Desktop.exe"
                "$HOME/AppData/Local/Docker/Docker Desktop.exe"
                "/mnt/c/Program Files/Docker/Docker/Docker Desktop.exe"
                "/mnt/c/Program Files (x86)/Docker/Docker/Docker Desktop.exe"
            )
            
            DOCKER_FOUND=false
            for path in "${DOCKER_PATHS[@]}"; do
                if [ -f "$path" ]; then
                    log_info "Docker Desktop trouvé dans: $path"
                    "$path" &
                    DOCKER_FOUND=true
                    break
                fi
            done
            
            if [ "$DOCKER_FOUND" = false ]; then
                # Essayer avec PowerShell et les chemins Windows natifs
                if command -v powershell.exe &> /dev/null; then
                    powershell.exe -Command "
                        \$paths = @(
                            'C:\Program Files\Docker\Docker\Docker Desktop.exe',
                            'C:\Program Files (x86)\Docker\Docker\Docker Desktop.exe',
                            '\$env:LOCALAPPDATA\Docker\Docker Desktop.exe'
                        )
                        foreach (\$path in \$paths) {
                            if (Test-Path \$path) {
                                Write-Host 'Démarrage de Docker Desktop...'
                                Start-Process \$path
                                exit 0
                            }
                        }
                        Write-Host 'Docker Desktop non trouvé dans les emplacements standards'
                        exit 1
                    " 2>/dev/null
                    
                    if [ $? -eq 0 ]; then
                        DOCKER_FOUND=true
                    fi
                fi
            fi
            
            if [ "$DOCKER_FOUND" = false ]; then
                log_warning "Docker Desktop non trouvé automatiquement"
                log_info "Veuillez démarrer Docker Desktop manuellement depuis le menu Démarrer"
                log_info "Puis appuyez sur Entrée pour continuer..."
                read -r
            else
                log_success "Docker Desktop en cours de démarrage..."
            fi
        else
            # Linux
            if sudo systemctl start docker 2>/dev/null; then
                log_info "Service Docker démarré sur Linux"
            else
                log_warning "Impossible de démarrer Docker automatiquement sur Linux"
                log_info "Essayez: sudo systemctl start docker"
                exit 1
            fi
        fi
        
        # Attendre que Docker soit prêt avec timeout plus long
        log_info "Attente que Docker soit prêt (cela peut prendre jusqu'à 2 minutes)..."
        timeout=120  # 2 minutes
        counter=0
        while ! docker info &> /dev/null && [ $timeout -gt 0 ]; do
            sleep 5
            timeout=$((timeout-5))
            counter=$((counter+1))
            if [ $((counter % 6)) -eq 0 ]; then
                echo
                log_info "Toujours en attente de Docker... ($((120-timeout))s écoulées)"
            else
                echo -n "."
            fi
        done
        echo
        
        if ! docker info &> /dev/null; then
            log_error "Docker n'a pas pu démarrer dans les temps (2 minutes)."
            log_info "Solutions possibles:"
            log_info "1. Démarrez Docker Desktop manuellement"
            log_info "2. Attendez que Docker soit complètement chargé"
            log_info "3. Redémarrez votre machine si Docker ne répond pas"
            log_info "4. Relancez le script une fois Docker prêt"
            exit 1
        fi
    fi
    log_success "Docker est en cours d'exécution ✓"
else
    log_error "Docker n'est pas installé"
    log_info "Installez Docker Desktop depuis: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# 2. Arrêter tous les conteneurs
log_info "Arrêt de tous les conteneurs en cours..."
if [ "$(docker ps -q)" ]; then
    docker stop $(docker ps -q)
    log_success "Tous les conteneurs ont été arrêtés"
else
    log_info "Aucun conteneur en cours d'exécution"
fi

# 3. Nettoyer tous les conteneurs et images
log_warning "Nettoyage complet de Docker (conteneurs, images, volumes, réseaux)..."
read -p "Êtes-vous sûr de vouloir supprimer TOUS les conteneurs et images ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Supprimer tous les conteneurs
    if [ "$(docker ps -aq)" ]; then
        docker rm $(docker ps -aq)
        log_success "Tous les conteneurs supprimés"
    fi
    
    # Supprimer toutes les images
    if [ "$(docker images -q)" ]; then
        docker rmi $(docker images -q) -f
        log_success "Toutes les images supprimées"
    fi
    
    # Nettoyage complet
    docker system prune -af --volumes
    log_success "Nettoyage complet terminé"
else
    log_info "Nettoyage annulé par l'utilisateur"
    # Nettoyage léger seulement
    docker container prune -f
    docker image prune -af
    log_success "Nettoyage léger terminé"
fi

# 4. Connexion au GitHub Container Registry
log_info "Connexion au GitHub Container Registry..."
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

if [ $? -eq 0 ]; then
    log_success "Connexion réussie au registre GitHub"
else
    log_error "Échec de la connexion au registre GitHub"
    exit 1
fi

# 5. Lancer Docker Compose
log_info "Lancement de Docker Compose..."
if [ -f docker-compose.yml ] || [ -f docker-compose.yaml ]; then
    docker compose up
    log_success "Docker Compose lancé avec succès"
else
    log_error "Aucun fichier docker-compose.yml trouvé dans le répertoire courant"
    exit 1
fi

log_success "Script terminé avec succès !"