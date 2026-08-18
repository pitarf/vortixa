# DESIGN SYSTEM & BRANDING - VORIXA

Este documento define os tokens de design, paleta de cores e tipografia para garantir consistência visual e facilitar mudanças futuras na identidade da marca.

## 1. Paleta de Cores (Tokens CSS Variables)

A identidade visual é derivada da logo oficial, priorizando **Violeta**, **Azul Elétrico**, **Ciano**, **Preto** e **Branco**, com gradientes de alta tecnologia coerentes com a logo.

As variáveis são injetadas no arquivo `/app/globals.css` sob o padrão do shadcn/ui:

```css
@theme {
  --color-background: hsl(240 10% 2%);
  --color-foreground: hsl(0 0% 100%);

  --color-card: hsl(240 10% 4%);
  --color-card-foreground: hsl(0 0% 98%);

  --color-popover: hsl(240 10% 2%);
  --color-popover-foreground: hsl(0 0% 98%);

  --color-primary: hsl(224 100% 54%);       /* Azul Elétrico VORIXA */
  --color-primary-foreground: hsl(0 0% 100%);

  --color-secondary: hsl(262 83% 58%);     /* Violeta VORIXA */
  --color-secondary-foreground: hsl(0 0% 100%);

  --color-accent: hsl(180 100% 50%);        /* Ciano Neon Destaque */
  --color-accent-foreground: hsl(240 10% 2%);

  --color-muted: hsl(240 4% 12%);
  --color-muted-foreground: hsl(240 5% 65%);

  --color-destructive: hsl(0 84% 60%);
  --color-destructive-foreground: hsl(0 0% 98%);

  --color-border: hsl(240 6% 12%);
  --color-input: hsl(240 6% 12%);
  --color-ring: hsl(224 100% 54%);
  
  /* Gradientes */
  --gradient-brand: linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(224 100% 54%) 50%, hsl(180 100% 50%) 100%);
}
```

---

## 2. Tipografia

A plataforma utiliza fontes modernas do Google Fonts para transmitir sofisticação:
* **Títulos e Cabeçalhos (`h1`, `h2`, `h3`)**: **Outfit** (Sans-serif geométrica, moderna, com ar futurista e premium).
* **Corpo do Texto (`p`, `span`, `input`)**: **Inter** (Altamente legível em telas pequenas e layouts de tabelas/cards).

No Next.js, as fontes devem ser importadas via `next/font/google` no `layout.tsx` principal:

```typescript
import { Outfit, Inter } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
```

---

## 3. Micro-Animações e Interações

Para criar um visual dinâmico e premium:
* **Botões e Cards**: Transição suave de escala e elevação de cor no hover (`transition-all duration-300 hover:scale-[1.02] hover:border-primary/50`).
* **Loading Spinners**: Utilizar spins estilizados com degradê em cônica do azul elétrico/violeta para o transparente.
* **Toasts (Notificações)**: Transição lateral suave por meio da biblioteca Sonner estilizada nas cores escuras do tema.

