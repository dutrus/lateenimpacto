import "server-only"

// Tipos para nuestros diccionarios
export interface Dictionary {
  navigation: {
    contact: string
    faq: string
    home: string
    mission: string
    language: string
  }
  home: {
    title: string
    subtitle: string
    mission: string
    pillars: {
      title: string
      opportunities: {
        title: string
        description: string
        button: string
      }
      community: {
        title: string
        description: string
        button: string
      }
      curation: {
        title: string
        description: string
        button: string
      }
    }
  }
  opportunities: {
    scholarships: {
      title: string
      description: string
      filters: {
        title: string
        allLevels: string
        allAreas: string
        results: string
        noResults: string
      }
      details: {
        deadline: string
        country: string
        area: string
        funding: string
        requirements: string
        moreInfo: string
      }
    }
    competitions: {
      title: string
      description: string
      filters: {
        title: string
        allLevels: string
        allAreas: string
        results: string
        noResults: string
      }
      details: {
        nextDate: string
        location: string
        area: string
        modality: string
        process: string
        requirements: string
        moreInfo: string
      }
    }
    programs: {
      title: string
      description: string
      filters: {
        title: string
        allLevels: string
        allAreas: string
        results: string
        noResults: string
      }
      details: {
        deadline: string
        country: string
        area: string
        duration: string
        funding: string
        process: string
        requirements: string
        moreInfo: string
      }
    }
  }
  community: {
    help: {
      title: string
      subtitle: string
      options: {
        findOpportunities: {
          title: string
          description: string
          button: string
        }
        getStarted: {
          title: string
          description: string
          button: string
        }
        talkToTeam: {
          title: string
          description: string
          button: string
        }
        questions: {
          title: string
          description: string
          faqButton: string
          contactButton: string
        }
      }
    }
    volunteer: {
      title: string
      subtitle: string
      intro: string
      whoCanVolunteer: {
        title: string
        description: string
        requirements: string[]
      }
      terms: {
        title: string
        conditions: string[]
      }
      joinUs: {
        title: string
        description: string
        button: string
      }
    }
    guidance: {
      title: string
      subtitle: string
      form: {
        name: {
          label: string
          placeholder: string
          error: string
        }
        email: {
          label: string
          placeholder: string
          error: string
        }
        phone: {
          label: string
          placeholder: string
        }
        educationLevel: {
          label: string
          placeholder: string
          error: string
          options: {
            secondary: string
            university: string
            postgraduate: string
            professional: string
            other: string
          }
        }
        interestArea: {
          label: string
          placeholder: string
          error: string
          options: {
            scholarships: string
            competitions: string
            programs: string
            exchanges: string
            volunteering: string
            other: string
          }
        }
        message: {
          label: string
          placeholder: string
          error: string
        }
        submit: string
        sending: string
        success: {
          title: string
          message: string
        }
      }
    }
  }
  common: {
    backToHome: string
    footer: {
      rights: string
    }
  }
}

// Diccionarios para cada idioma
const dictionaries = {
  es: () => import("./es.json").then((module) => module.default) as Promise<Dictionary>,
  en: () => import("./en.json").then((module) => module.default) as Promise<Dictionary>,
}

// Función para obtener el diccionario según el idioma
export const getDictionary = async (locale: string): Promise<Dictionary> => {
  return (dictionaries[locale as keyof typeof dictionaries] || dictionaries.es)()
}
