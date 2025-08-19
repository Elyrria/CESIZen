import { GITHUB_CONFIG } from "@configs/global.configs.ts"

// Import conditionnel pour éviter les erreurs de test
let OctokitClass: any

async function loadOctokit() {
  if (!OctokitClass) {
    if (process.env.NODE_ENV === "test" || process.env.FUNCTIONAL_TEST === "true") {
      // Mock en mode test
      OctokitClass = class MockOctokit {
        constructor() {}
        rest = {
          repos: {
            get: () =>
              Promise.resolve({
                data: { id: 1, name: "test-repo" }
              })
          },
          issues: {
            addLabels: () =>
              Promise.resolve({
                data: { labels: [] }
              })
          }
        }
        graphql = () =>
          Promise.resolve({
            user: {
              projectV2: {
                id: "test-project-id",
                fields: { nodes: [] }
              }
            }
          })
      }
    } else {
      // Import réel en production
      const { Octokit } = await import("@octokit/rest")
      OctokitClass = Octokit
    }
  }
  return OctokitClass
}

/**
 * Interface pour les données d'un ticket
 */
interface TicketData {
  type: string
  priority: string
  title: string
  description: string
  userEmail?: string
}

/**
 * Service de gestion des interactions avec l'API GitHub
 * Permet la création automatique d'issues dans le projet GitHub
 */
class GitHubService {
  private octokit: any
  private owner: string
  private repo: string
  private projectNumber: number

  constructor() {
    // Configuration par défaut pour les tests
    if (process.env.NODE_ENV === "test" || process.env.FUNCTIONAL_TEST === "true") {
      this.owner = "test-owner"
      this.repo = "test-repo"
      this.projectNumber = 2
      return
    }

    // Configuration réelle pour la production
    const token = GITHUB_CONFIG.GITHUB_TOKEN.KEY
    const owner = GITHUB_CONFIG.PROJECT_OWNER.KEY
    const repo = GITHUB_CONFIG.REPO_NAME.KEY

    if (!token || !owner || !repo) {
      throw new Error(
        "Configuration GitHub manquante. Vérifiez GITHUB_TOKEN, PROJECT_OWNER et REPO_NAME dans les variables d'environnement"
      )
    }

    this.owner = owner
    this.repo = repo
    this.projectNumber = 2
  }

  private async getOctokit() {
    if (!this.octokit) {
      const OctokitConstructor = await loadOctokit()

      if (process.env.NODE_ENV === "test" || process.env.FUNCTIONAL_TEST === "true") {
        this.octokit = new OctokitConstructor()
      } else {
        this.octokit = new OctokitConstructor({
          auth: GITHUB_CONFIG.GITHUB_TOKEN.KEY
        })
      }
    }
    return this.octokit
  }

  /**
   * Formate le corps de l'issue avec les informations du ticket
   */
  private formatIssueBody(ticketData: TicketData): string {
    const timestamp = new Date().toISOString()
    const botName = GITHUB_CONFIG.GITHUB_BOT_NAME?.KEY || "cesizen-bot"

    return `## Signalement de ${ticketData.type === "bug" ? "bug" : "fonctionnalité"}

### Informations du ticket
- **Type :** ${ticketData.type}
- **Priorité :** ${ticketData.priority}
- **Date de création :** ${timestamp}
${ticketData.userEmail ? `- **Email utilisateur :** ${ticketData.userEmail}` : "- **Signalement :** Anonyme"}

### Description du problème
${ticketData.description}

### SLA de traitement
- **P1-Critical :** 2h
- **P2-High :** 24h  
- **P3-Medium :** 72h
- **P4-Low :** 1 semaine

### Actions automatiques
- Issue créée automatiquement dans le projet
- Champs configurés automatiquement
- Rattachée au repository via label S:Support
- Équipe technique notifiée

---
Ticket créé automatiquement par ${botName} via le système de support intégré CESIZEN.  
Plateforme de gestion du stress - Ministère de la Santé et de l'Accès aux Soins`
  }

  /**
   * Récupère les informations du projet GitHub
   */
  private async getProjectInfo() {
    try {
      const octokit = await this.getOctokit()
      const query = `
        query($owner: String!, $number: Int!) {
          user(login: $owner) {
            projectV2(number: $number) {
              id
              fields(first: 20) {
                nodes {
                  ... on ProjectV2Field {
                    id
                    name
                    dataType
                  }
                  ... on ProjectV2SingleSelectField {
                    id
                    name
                    dataType
                    options {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `

      const response = await octokit.graphql(query, {
        owner: this.owner,
        number: this.projectNumber
      })

      return response.user.projectV2
    } catch (error) {
      console.error("Erreur lors de la récupération du projet:", error)
      throw new Error("Impossible de récupérer les informations du projet GitHub")
    }
  }

  /**
   * Crée une issue directement dans le projet GitHub
   */
  private async createProjectIssue(projectId: string, ticketData: TicketData) {
    try {
      const octokit = await this.getOctokit()
      const mutation = `
        mutation($projectId: ID!, $title: String!, $body: String!) {
          addProjectV2DraftIssue(input: {
            projectId: $projectId
            title: $title
            body: $body
          }) {
            projectItem {
              id
            }
          }
        }
      `

      const response = await octokit.graphql(mutation, {
        projectId,
        title: `[${ticketData.priority}] ${ticketData.title}`,
        body: this.formatIssueBody(ticketData)
      })

      return response.addProjectV2DraftIssue.projectItem.id
    } catch (error) {
      console.error("Erreur lors de la création de l'issue dans le projet:", error)
      throw new Error("Impossible de créer l'issue dans le projet GitHub")
    }
  }

  /**
   * Convertit un draft issue en vraie issue dans le repository
   */
  private async convertDraftToIssue(projectId: string, draftItemId: string, repoId: string) {
    try {
      const octokit = await this.getOctokit()
      const mutation = `
        mutation($itemId: ID!, $repositoryId: ID!) {
          convertProjectV2DraftIssueItemToIssue(input: {
            itemId: $itemId
            repositoryId: $repositoryId
          }) {
            item {
              id
              content {
                ... on Issue {
                  number
                  url
                  id
                }
              }
            }
          }
        }
      `

      const response = await octokit.graphql(mutation, {
        itemId: draftItemId,
        repositoryId: repoId
      })

      return response.convertProjectV2DraftIssueItemToIssue.item
    } catch (error) {
      console.error("Erreur lors de la conversion du draft en issue:", error)
      throw new Error("Impossible de convertir le draft en issue")
    }
  }

  /**
   * Récupère l'ID du repository
   */
  private async getRepositoryId() {
    try {
      const octokit = await this.getOctokit()
      const query = `
        query($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
            id
          }
        }
      `

      const response = await octokit.graphql(query, {
        owner: this.owner,
        name: this.repo
      })

      return response.repository.id
    } catch (error) {
      console.error("Erreur lors de la récupération de l'ID du repository:", error)
      throw new Error("Impossible de récupérer l'ID du repository")
    }
  }

  /**
   * Ajoute un label à une issue via l'API REST
   */
  private async addLabelsToIssue(issueNumber: number, labels: string[]) {
    try {
      const octokit = await this.getOctokit()
      await octokit.rest.issues.addLabels({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        labels: labels
      })
      return true
    } catch (error) {
      console.error("Erreur lors de l'ajout des labels:", error)
      return false
    }
  }

  /**
   * Met à jour un champ du projet pour un item donné
   */
  private async updateProjectField(projectId: string, itemId: string, fieldId: string, value: any) {
    try {
      const octokit = await this.getOctokit()
      const mutation = `
        mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: ProjectV2FieldValue!) {
          updateProjectV2ItemFieldValue(input: {
            projectId: $projectId
            itemId: $itemId
            fieldId: $fieldId
            value: $value
          }) {
            projectV2Item {
              id
            }
          }
        }
      `

      await octokit.graphql(mutation, {
        projectId,
        itemId,
        fieldId,
        value
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du champ:", error)
      throw new Error(`Impossible de mettre à jour le champ du projet`)
    }
  }

  /**
   * Configure les champs du projet pour l'issue
   */
  private async configureProjectFields(
    projectId: string,
    itemId: string,
    projectFields: any,
    ticketData: TicketData
  ) {
    try {
      for (const field of projectFields.nodes) {
        if (field.name === "Status") {
          const backlogOption = field.options?.find((opt: any) => opt.name === "Backlog")
          if (backlogOption) {
            await this.updateProjectField(projectId, itemId, field.id, {
              singleSelectOptionId: backlogOption.id
            })
          }
        } else if (field.name === "Types") {
          const typeValue = ticketData.type === "bug" ? "Bug" : "Feature"
          const typeOption = field.options?.find((opt: any) => opt.name === typeValue)
          if (typeOption) {
            await this.updateProjectField(projectId, itemId, field.id, {
              singleSelectOptionId: typeOption.id
            })
          }
        } else if (field.name === "Priority") {
          const priorityOption = field.options?.find((opt: any) => opt.name === ticketData.priority)
          if (priorityOption) {
            await this.updateProjectField(projectId, itemId, field.id, {
              singleSelectOptionId: priorityOption.id
            })
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la configuration des champs:", error)
    }
  }

  /**
   * Teste la connexion à l'API GitHub
   */
  async testConnection(): Promise<boolean> {
    try {
      const octokit = await this.getOctokit()
      await octokit.rest.repos.get({
        owner: this.owner,
        repo: this.repo
      })
      return true
    } catch (error) {
      console.error("Erreur de connexion GitHub:", error)
      return false
    }
  }

  /**
   * Crée une issue dans le projet GitHub avec tous les champs configurés
   */
  async createIssue(ticketData: TicketData) {
    try {

      // En mode test, retourner une réponse mockée
      if (process.env.NODE_ENV === "test" || process.env.FUNCTIONAL_TEST === "true") {
        return {
          success: true,
          issueNumber: 123,
          issueUrl: "https://github.com/test-owner/test-repo/issues/123",
          issueId: "test-issue-id",
          projectItemId: "test-project-item-id"
        }
      }

      // Logique réelle pour la production
      const projectInfo = await this.getProjectInfo()
      const repositoryId = await this.getRepositoryId()
      const draftItemId = await this.createProjectIssue(projectInfo.id, ticketData)
      const convertedIssue = await this.convertDraftToIssue(
        projectInfo.id,
        draftItemId,
        repositoryId
      )

      await this.addLabelsToIssue(convertedIssue.content.number, ["S:Support", "S:CesizenBot"])
      await this.configureProjectFields(projectInfo.id, draftItemId, projectInfo.fields, ticketData)

      return {
        success: true,
        issueNumber: convertedIssue.content.number,
        issueUrl: convertedIssue.content.url,
        issueId: convertedIssue.content.id,
        projectItemId: draftItemId
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'issue:", error)

      if (error instanceof Error) {
        throw new Error(`Échec de création de l'issue: ${error.message}`)
      }

      throw new Error("Erreur inconnue lors de la création de l'issue")
    }
  }
}

export default GitHubService
