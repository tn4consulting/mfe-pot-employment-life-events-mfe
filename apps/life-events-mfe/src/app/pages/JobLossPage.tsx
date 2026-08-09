import * as React from 'react';
import { ChecklistSection } from '../kit/ChecklistSection';
import { ServiceLinksSection } from '../kit/ServiceLinksSection';
import { WidgetSlot } from '../kit/WidgetSlot';
import { LifeEventLayout } from '../kit/LifeEventLayout';
import { JobSearchChecklistItem } from '../JobSearchChecklistItem';
import { EiChecklistItems } from '../EiChecklistItems';
import type { LifeEventPageModule, LifeEventPageProps } from './types';

/**
 * The original life event this whole family proves the pattern on. Two
 * pieces of content don't fit the kit's checklist/links/widget helpers
 * cleanly and are just rendered directly as JSX instead: JobSearchChecklistItem
 * (a real completion signal from job-bank, sitting inline with otherwise
 * self-reported items) and EiChecklistItems (two checklist items sharing
 * one widget instance) -- there's no schema seam between them and the
 * kit-driven sections around them.
 */
export function JobLossPage({ lifeEventId, contentClient }: LifeEventPageProps) {
  return (
    <LifeEventLayout lifeEventId={lifeEventId} contentClient={contentClient}>
      <ChecklistSection
        id="departure"
        heading={{
          en: 'Steps to take when you leave your job',
          fr: 'Étapes à suivre en quittant votre emploi',
        }}
        items={[
          {
            id: 'roe',
            title: { en: 'Get your Record of Employment (ROE)', fr: 'Obtenez votre relevé d’emploi (RE)' },
            body: {
              en: "Ask your employer for your ROE — you'll need it to apply for Employment Insurance. Employers must issue it within 5 days of your last day worked.",
              fr: 'Demandez votre RE à votre employeur — vous en aurez besoin pour présenter une demande d’assurance-emploi. Les employeurs doivent le délivrer dans les 5 jours suivant votre dernier jour travaillé.',
            },
          },
          {
            id: 'final-pay',
            title: { en: 'Confirm your final pay and vacation pay', fr: 'Confirmez votre dernière paie et votre indemnité de vacances' },
            body: {
              en: 'Check that your final pay includes all wages owed and any unused vacation pay, per your province or territory’s employment standards.',
              fr: 'Vérifiez que votre dernière paie comprend tous les salaires dus et toute indemnité de vacances non utilisée, selon les normes d’emploi de votre province ou territoire.',
            },
          },
          {
            id: 'benefits-continuation',
            title: { en: 'Ask about continuing your workplace benefits', fr: 'Renseignez-vous sur le maintien de vos avantages sociaux' },
            body: {
              en: 'Find out whether you can convert your health, dental, or life insurance to an individual policy, and for how long your current coverage lasts.',
              fr: 'Renseignez-vous pour savoir si vous pouvez convertir votre assurance maladie, dentaire ou vie en police individuelle, et combien de temps dure votre couverture actuelle.',
            },
          },
          {
            id: 'return-property',
            title: { en: 'Return company property', fr: 'Retournez les biens de l’entreprise' },
            body: {
              en: 'Return any laptop, ID badge, keys, or uniforms, and get written confirmation that they were received.',
              fr: 'Retournez tout ordinateur portable, carte d’identité, clé ou uniforme, et obtenez une confirmation écrite de leur réception.',
            },
          },
          {
            id: 'reference',
            title: { en: 'Ask for a letter of reference', fr: 'Demandez une lettre de référence' },
            body: {
              en: "Request a reference letter or confirmation of employment while your manager's memory is fresh — you'll likely need it for job applications.",
              fr: 'Demandez une lettre de référence ou une confirmation d’emploi pendant que votre superviseur se souvient bien de votre travail — vous en aurez probablement besoin pour vos demandes d’emploi.',
            },
          },
          {
            id: 'keep-records',
            title: { en: 'Keep records for your EI application', fr: 'Conservez vos documents pour votre demande d’assurance-emploi' },
            body: {
              en: "Keep your ROE, pay stubs, and dates of employment on hand — you'll need this information to apply for EI.",
              fr: 'Conservez votre RE, vos talons de paie et vos dates d’emploi à portée de main — vous en aurez besoin pour présenter une demande d’assurance-emploi.',
            },
          },
        ]}
      />
      <ChecklistSection
        id="employability"
        heading={{
          en: 'Make yourself more employable',
          fr: 'Améliorez votre employabilité',
        }}
        // Excludes "search Job Bank" deliberately -- that one has a real
        // completion signal (job-bank's own applications data) and is
        // rendered by the leadingItem below, not a static item.
        items={[
          {
            id: 'update-cv',
            title: { en: 'Update your résumé and LinkedIn profile', fr: 'Mettez à jour votre CV et votre profil LinkedIn' },
            body: {
              en: 'Add your most recent role, accomplishments, and skills.',
              fr: 'Ajoutez votre poste le plus récent, vos réalisations et vos compétences.',
            },
          },
          {
            id: 'training',
            title: { en: 'Look into training and upskilling', fr: 'Renseignez-vous sur la formation et le perfectionnement' },
            body: {
              en: 'Look for government-funded training programs or certifications that could improve your job prospects.',
              fr: 'Cherchez des programmes de formation ou des certifications financés par le gouvernement qui pourraient améliorer vos perspectives d’emploi.',
            },
          },
        ]}
        leadingItem={<JobSearchChecklistItem />}
      />
      <ChecklistSection
        id="benefits"
        heading={{
          en: 'Benefits you might now be eligible for',
          fr: 'Prestations auxquelles vous pourriez maintenant être admissible',
        }}
        items={[
          {
            id: 'tax-credits',
            title: { en: 'GST/HST credit and other income-tested benefits', fr: 'Crédit pour la TPS/TVH et autres prestations fondées sur le revenu' },
            body: {
              en: 'A lower income this year could change what you receive from the GST/HST credit or other income-tested benefits when you file your next tax return.',
              fr: 'Un revenu plus faible cette année pourrait modifier ce que vous recevez du crédit pour la TPS/TVH ou d’autres prestations fondées sur le revenu lors de votre prochaine déclaration de revenus.',
            },
          },
          {
            id: 'provincial',
            title: { en: 'Provincial or territorial supports', fr: 'Soutiens provinciaux ou territoriaux' },
            body: {
              en: 'Check whether your province or territory offers additional income or health-coverage support during unemployment.',
              fr: 'Vérifiez si votre province ou territoire offre un soutien supplémentaire au revenu ou à la couverture santé pendant une période de chômage.',
            },
          },
        ]}
      />
      <ServiceLinksSection
        heading={{
          en: 'Other services that may help',
          fr: 'Autres services qui pourraient vous aider',
        }}
        links={[
          {
            id: 'cdcp',
            title: { en: 'Canadian Dental Care Plan (CDCP)', fr: 'Régime canadien de soins dentaires (RCSD)' },
            description: {
              en: 'Losing job-related dental coverage may make you newly eligible for the CDCP — check your dashboard for a personalized look at your benefits.',
              fr: 'La perte de votre couverture dentaire liée à l’emploi pourrait vous rendre nouvellement admissible au RCSD — consultez votre tableau de bord pour un aperçu personnalisé de vos prestations.',
            },
            href: '/dashboard',
          },
        ]}
      />
      <EiChecklistItems />
      <WidgetSlot
        widgetId="payment-history"
        heading={{
          en: 'Your payments at a glance',
          fr: "Vos paiements en un coup d'œil",
        }}
      />
    </LifeEventLayout>
  );
}

export const jobLossPage: LifeEventPageModule = { id: 'job-loss', Component: JobLossPage };
