import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../../../src/ui/primitives/Button';

describe('Button primitive', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('bg-aios-secondary');
  });

  it('renders outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole('button', { name: /outline/i });
    expect(btn.className).toContain('border-aios-border');
  });

  it('renders ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole('button', { name: /ghost/i });
    expect(btn.className).toContain('hover:bg-aios-card-bg');
  });

  it('renders glowing variant with violet shadow', () => {
    render(<Button variant="glowing">Glow</Button>);
    const btn = screen.getByRole('button', { name: /glow/i });
    expect(btn.className).toContain('shadow-[0_0_15px_rgba(167,139,250,0.35)]');
  });

  it('applies size classes', () => {
    render(<Button size="lg">Large</Button>);
    const btn = screen.getByRole('button', { name: /large/i });
    expect(btn.className).toContain('h-12');
  });
});
