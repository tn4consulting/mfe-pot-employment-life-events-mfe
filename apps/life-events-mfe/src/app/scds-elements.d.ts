import type { DetailedHTMLProps, HTMLAttributes } from 'react';

/**
 * Minimal JSX typing for the SCDS custom elements this app renders
 * directly -- see mfe-pot-dashboard-mfe's own scds-elements.d.ts for the
 * pattern this follows (every prop below has a real kebab-case
 * `attribute` mapping confirmed against `@tn4consulting/shared-ui-scds-core`'s
 * compiled Stencil metadata, so a plain HTML attribute in JSX is enough).
 */
type ScdsElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'scds-checklist': ScdsElementProps & {
        'checklist-heading'?: string;
        'heading-tag'?: 'h2' | 'h3' | 'h4';
        'list-label'?: string;
      };
      'scds-checklist-item': ScdsElementProps & {
        'item-title'?: string;
        description?: string;
        complete?: boolean | string;
        'complete-label'?: string;
      };
      'scds-link': ScdsElementProps & { href?: string; 'icon-name'?: string; 'icon-position'?: 'start' | 'end' };
      /** Added for the life-events kit's ServiceLinksSection (links-to-other-services card grid). */
      'scds-card': ScdsElementProps & {
        'card-title'?: string;
        'card-title-tag'?: 'h3' | 'h4' | 'h5' | 'h6';
        description?: string;
        href?: string;
        rel?: string;
        target?: string;
        'img-src'?: string;
        'img-alt'?: string;
        tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
        'tone-label'?: string;
      };
      /** Added for disability's `kind: 'custom'` stepper (DisabilityApplicationStepper.tsx) -- the escape-hatch proof case. */
      'scds-progress-bar': ScdsElementProps & { current?: number; total?: number; 'step-label'?: string };
    }
  }
}

export {};
