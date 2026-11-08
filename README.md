# EducaHub

Sistema demonstrativo de gestão escolar da rede de ensino de Sergipe, convertido integralmente para **HTML, CSS e JavaScript puro**. As 44 páginas preservam os cinco perfis, as imagens, as fontes locais, a navegação e a identidade visual.

## Executar

Requer Node.js 22 ou mais recente. Não precisa instalar dependências para executar ou gerar a versão de publicação.

Dê dois cliques em **iniciar.bat** no Windows, ou execute na pasta deste arquivo:

```sh
node tools/server.mjs
```

Abra **http://localhost:4321**. Encerre com Ctrl+C. No Linux/macOS: bash iniciar.sh. Também é possível usar npm run dev. No PowerShell com scripts bloqueados, use npm.cmd run dev. Use um servidor HTTP; os módulos JavaScript não funcionam abrindo o HTML pelo protocolo file://.

## Estrutura

- index.html: página pública.
- entrar/, cadastrar/, recuperar-senha/: acesso e pré-matrícula.
- aluno/, responsavel/, professor/, escola/, secretaria/: telas dos cinco perfis.
- assets/css/: estilos compartilhados e estilos por página.
- assets/js/: módulos ES nativos, formulários e interações.
- assets/images/ e assets/fonts/: imagens e fontes originais locais.
- tools/: servidor HTTP, verificação de arquivos e cópia para publicação.
- tests/: testes de CPF, maioridade e respostas do servidor HTTP.

Cada rota contém um index.html editável. Os atributos data-scope-* limitam o CSS dos componentes originais; mantenha a correspondência entre esses atributos e os seletores ao editar estilos. Os dados de demonstração exibidos nas tabelas estão nos próprios HTMLs.

## Funcionalidades

O fluxo local de planejamento escolar, incluindo diretorias, ofertas, professores, turmas, horários e registro integrado de aula e chamada, está descrito em [Planejamento do protótipo](docs/planejamento-prototipo.md).

Login demonstrativo com máscara e validação real de CPF, senha com pelo menos 4 caracteres e sessão no navegador. Matrícula em etapas, responsável obrigatório para menores de 18 anos, nomes sociais condicionais, validação por campo, lista local de países, consulta de cidades no IBGE e de CEP na BrasilAPI. Se a consulta falhar, os endereços podem ser preenchidos manualmente.

Preservados: tema, tamanho de fonte, espaçamento, ajuda com leitura de voz, notificações, filtros, abas por filho, chamada, lançamento de notas, diário e gestão de turmas. Como no original, várias operações são simulações locais.

**Não existe autenticação real, banco de dados ou envio de matrícula.** O protocolo gerado é demonstrativo. Não use dados pessoais reais para apresentar o protótipo. Consultas de CEP/cidade precisam de internet; a leitura por voz depende do navegador.

## Verificação e publicação

- npm run check ou npm run lint: sintaxe JS, rotas, imagens, estilos e imports locais.
- npm test: regras de validação.
- npm run build: copia somente o site público para dist/.
- npm run preview: serve dist/ depois do build.
- npm install e npm run format: instalação opcional do Prettier e formatação.

Publique apenas dist/ em hospedagem estática com suporte a index.html em diretórios. O workflow do GitHub valida o projeto e publica o site no GitHub Pages quando há um envio para a branch main. Nas configurações do repositório, selecione **Settings → Pages → Build and deployment → GitHub Actions**. O site ficará em `https://<usuario>.github.io/<repositorio>/`. A rota antiga /login/ redireciona para /entrar/.

As pastas node_modules/ e dist/ não são necessárias para iniciar o site e foram removidas da pasta de trabalho. Para formatar, instale o Prettier com npm ci. Para publicar ou usar npm run preview, gere dist/ com npm run build.
