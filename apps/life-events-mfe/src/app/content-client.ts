import {
  ContentClient,
  PageContent,
  StaticContentClient,
  StrapiContentClient,
} from '@tn4consulting/shared-content-client';

// Baked fallback for a no-CMS build -- kept in sync with the seed data in
// mfe-pot-platform's tools/cms/strapi/src/index.ts by hand for now; see
// mfe-pot-dashboard's own content-client.token.ts for the same pattern.
// One entry per life event's own `introContentKey` (see
// definitions/*.ts) -- adding a new life event means adding its intro
// copy here too, alongside its own definitions/<id>.ts file.
const STATIC_CONTENT: Record<string, Record<'en' | 'fr', PageContent>> = {
  'life-events.job-loss.intro': {
    en: {
      key: 'life-events.job-loss.intro',
      title: "You lost your job — here's what to do next",
      body: 'Guidance on CVs, job search, and Employment Insurance.',
    },
    fr: {
      key: 'life-events.job-loss.intro',
      title: 'Vous avez perdu votre emploi — voici les prochaines étapes',
      body: "Conseils sur le CV, la recherche d'emploi et l'assurance-emploi.",
    },
  },
  'life-events.birth.intro': {
    en: {
      key: 'life-events.birth.intro',
      title: "You had a baby — here's what to do next",
      body: 'Guidance on registering the birth, maternity/parental benefits, and family supports.',
    },
    fr: {
      key: 'life-events.birth.intro',
      title: 'Vous avez eu un enfant — voici les prochaines étapes',
      body: 'Conseils sur la déclaration de naissance, les prestations de maternité/parentales et les soutiens familiaux.',
    },
  },
  'life-events.disability.intro': {
    en: {
      key: 'life-events.disability.intro',
      title: "You have a disability — here's what to do next",
      body: 'Guidance on applying for disability benefits and finding accessibility supports.',
    },
    fr: {
      key: 'life-events.disability.intro',
      title: 'Vous vivez avec un handicap — voici les prochaines étapes',
      body: "Conseils sur la demande de prestations d'invalidité et les soutiens en accessibilité.",
    },
  },
};

export function createContentClient(strapiBaseUrl: string | undefined): ContentClient {
  return strapiBaseUrl ? new StrapiContentClient(strapiBaseUrl) : new StaticContentClient(STATIC_CONTENT);
}
