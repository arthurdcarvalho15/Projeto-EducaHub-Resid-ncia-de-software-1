Seguindo a [Base Nacional Comum Curricular (BNCC)](https://basenacionalcomum.mec.gov.br/), listamos as matérias de **Ensino Fundamental** e **Ensino Médio**, e os:

- [Currículo de Ensino Fundamental de Sergipe](https://seduc.se.gov.br/download/curriculo-ensino-fundamental/)
- [Currículo de Ensino Médio de Sergipe](https://seduc.se.gov.br/download/curriculo-de-sergipe-ensino-medio/)

## Lista de Matérias

Temos duas listas das matérias da matriz currícular do estado de Sergipe:

### Ensino Fundamental

- Área de Linguagens:
  - Arte
  - Educação Física
  - Língua Inglesa
  - Língua Portuguesa
- Área de Matemática:
  - Matemática
- Área de Ciências da Natureza:
  - Ciências
- Área de Ciências Humanas:
  - Geografia
  - História
- Área de Ensino Religioso:
  - Ensino Religioso

### Ensino Médio

- Área de Linguagens:
  - Arte
  - Educação Física
  - Língua Espanhola
  - Língua Inglesa
  - Língua Portuguesa
- Área de Matemática:
  - Matemática
- Área de Ciências da Natureza:
  - Biologia
  - Física
  - Química
- Área de Ciências Humanas:
  - Filosofia
  - Geografia
  - História
  - Sociologia

## Elementos Visuais de Cada Matéria

Cada matéria é identificada por **cor + ícone + padrão geométrico**, para que pessoas com daltonismo consigam diferenciar as matérias sem depender da cor. As cores são as **Cores de Identificação** da identidade visual (`assets/css/perfis.css`): fundo pastel no tema claro e tom escuro no tema escuro, sempre com o ícone na cor do texto (`var(--fg)`), o que garante contraste de pelo menos 3:1 para o ícone nos dois temas.

As tags de matéria e seus ícones estão escritos nos arquivos HTML das páginas. As cores e os padrões ficam em `assets/css/perfis.css` (classes `pad-*`).

### Arte

- Cor: `--id-14-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Paleta de pintura (`paleta`)
- Padrão: Linhas cruzadas (X) (`pad-cruzado`)

### Educação Física

- Cor: `--id-02-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Batimento / atividade (`atividade`)
- Padrão: Listras verticais (`pad-vertical`)

### Língua Espanhola

- Cor: `--id-03-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Idiomas (`idiomas`)
- Padrão: Pontos (`pad-pontos`)

### Língua Inglesa

- Cor: `--id-11-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Idiomas (`idiomas`)
- Padrão: Listras diagonais invertidas (\) (`pad-diagonal-inv`)

### Língua Portuguesa

- Cor: `--id-00-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Livro aberto (`livro`)
- Padrão: Listras diagonais (/) (`pad-diagonal`)

### Matemática

- Cor: `--id-10-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Calculadora (`calculadora`)
- Padrão: Grade (quadriculado fino) (`pad-grade`)

### Ciências

- Cor: `--id-06-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Folha (`folha`)
- Padrão: Pontos (`pad-pontos`)

### Biologia

- Cor: `--id-05-bg` (fundo) com ícone em `var(--fg)`
- Ícone: DNA (`dna`)
- Padrão: Pontos (`pad-pontos`)

### Física

- Cor: `--id-09-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Raio (`raio`)
- Padrão: Listras verticais (`pad-vertical`)

### Química

- Cor: `--id-12-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Frasco de laboratório (`frasco`)
- Padrão: Linhas cruzadas (X) (`pad-cruzado`)

### Filosofia

- Cor: `--id-16-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Lâmpada (`lampada`)
- Padrão: Listras horizontais (`pad-horizontal`)

### Geografia

- Cor: `--id-08-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Globo (`globo`)
- Padrão: Xadrez (`pad-xadrez`)

### História

- Cor: `--id-01-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Ampulheta (`ampulheta`)
- Padrão: Listras horizontais (`pad-horizontal`)

### Sociologia

- Cor: `--id-15-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Pessoas (`usuarios`)
- Padrão: Xadrez (`pad-xadrez`)

### Ensino Religioso

- Cor: `--id-13-bg` (fundo) com ícone em `var(--fg)`
- Ícone: Coração (`coracao`)
- Padrão: Listras horizontais (`pad-horizontal`)
