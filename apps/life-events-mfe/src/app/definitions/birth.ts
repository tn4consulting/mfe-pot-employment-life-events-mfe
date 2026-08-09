import type { LifeEventDefinition } from '../kit/life-event-schema';

/**
 * The "easy case" this whole kit is meant to make cheap: a pure
 * checklist + links life event, no widgets, no escape hatch. Compare the
 * size of this file to `job-loss.ts` -- this is the actual proof that
 * adding a life event doesn't require touching the shell or the kit.
 */
export const BIRTH: LifeEventDefinition = {
  id: 'birth',
  introContentKey: 'life-events.birth.intro',
  sections: [
    {
      kind: 'checklist',
      id: 'first-steps',
      heading: {
        en: 'Steps to take after your baby is born',
        fr: 'Étapes à suivre après la naissance de votre enfant',
      },
      items: [
        {
          id: 'register-birth',
          title: { en: 'Register the birth', fr: 'Déclarez la naissance' },
          body: {
            en: 'Register your baby’s birth with your province or territory — most also let you apply for a birth certificate and the Canada Child Benefit at the same time.',
            fr: 'Déclarez la naissance de votre enfant auprès de votre province ou territoire — la plupart vous permettent aussi de présenter une demande de certificat de naissance et d’allocation canadienne pour enfants en même temps.',
          },
        },
        {
          id: 'sin-application',
          title: { en: 'Apply for your baby’s Social Insurance Number', fr: 'Demandez le numéro d’assurance sociale de votre enfant' },
          body: {
            en: 'Many provinces let you apply for a SIN as part of birth registration; otherwise apply separately once you have the birth certificate.',
            fr: 'Plusieurs provinces permettent de faire la demande de NAS dans le cadre de la déclaration de naissance; sinon, faites-en la demande séparément une fois le certificat de naissance obtenu.',
          },
        },
        {
          id: 'ei-maternity-parental',
          title: { en: 'Apply for EI maternity and parental benefits', fr: 'Présentez une demande de prestations de maternité et parentales d’assurance-emploi' },
          body: {
            en: 'Apply as soon as you stop working — you can apply for maternity benefits before the birth and parental benefits after.',
            fr: 'Présentez votre demande dès que vous cessez de travailler — vous pouvez demander les prestations de maternité avant la naissance et les prestations parentales après.',
          },
          linkHref: '/employment-insurance',
          linkLabel: { en: 'Apply for EI', fr: 'Présenter une demande d’assurance-emploi' },
        },
      ],
    },
    {
      kind: 'links',
      id: 'other-services',
      heading: {
        en: 'Other services that may help',
        fr: 'Autres services qui pourraient vous aider',
      },
      links: [
        {
          id: 'canada-child-benefit',
          title: { en: 'Canada Child Benefit (CCB)', fr: 'Allocation canadienne pour enfants (ACE)' },
          description: {
            en: 'A tax-free monthly payment to help with the cost of raising children under 18.',
            fr: 'Un paiement mensuel non imposable pour aider à assumer les coûts liés à l’éducation d’enfants de moins de 18 ans.',
          },
          href: '/dashboard',
        },
        {
          id: 'provincial-family-supports',
          title: { en: 'Provincial or territorial family supports', fr: 'Soutiens familiaux provinciaux ou territoriaux' },
          description: {
            en: 'Check whether your province or territory offers additional parental leave top-ups or family benefits.',
            fr: 'Vérifiez si votre province ou territoire offre des suppléments de congé parental ou des prestations familiales additionnelles.',
          },
          href: '/dashboard',
        },
      ],
    },
  ],
};
