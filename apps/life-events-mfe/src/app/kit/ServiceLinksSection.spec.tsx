import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ServiceLinksSection } from './ServiceLinksSection';

describe('ServiceLinksSection', () => {
  it('renders its heading and links as cards', () => {
    const { container } = render(
      <ServiceLinksSection
        heading={{ en: 'Links heading', fr: 'Titre des liens' }}
        links={[
          {
            id: 'link-1',
            title: { en: 'Link title', fr: 'Titre du lien' },
            description: { en: 'Link description', fr: 'Description du lien' },
            href: '/somewhere',
          },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Links heading' })).toBeInTheDocument();
    const card = container.querySelector('scds-card');
    expect(card?.getAttribute('card-title')).toBe('Link title');
    expect(card?.getAttribute('description')).toBe('Link description');
    expect(card?.getAttribute('href')).toBe('/somewhere');
  });
});
