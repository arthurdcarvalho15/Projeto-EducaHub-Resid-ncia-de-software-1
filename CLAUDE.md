## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Projeto EducaHub (convenções)

- Páginas estáticas + adapter da Netlify (Actions em `src/actions/` e `/api` rodam no servidor).
- Dados de demonstração em `src/data/dados.ts`; login simulado em `src/services/auth.js`.
- React só nas ilhas complexas (formulários: `LoginForm`, `FormCadastroAluno`), com CSS Modules.
  Interações simples usam `<script>` do Astro em TypeScript (`src/scripts/`).
- Telas internas usam `src/layouts/AppLayout.astro`; páginas públicas usam `src/layouts/Landing.astro`.
- Menus dos perfis: `src/data/perfis.ts`. Use `link(perfil, caminho)` / `url(caminho)` para montar URLs.
- Identidade visual e tokens em `src/variables.css` (tema escuro via `html[data-tema="escuro"]`).
- Siga `docs/acessibilidade.md` e `docs/tratamento_de_erros.md`: fonte ≥ 16px, alvos ≥ 48px,
  foco visível e **cor nunca sozinha** (use `Status.astro` / `MateriaTag.astro`).
- Antes de commitar: `npm run format`, `npm run lint` e `npm run build`.
