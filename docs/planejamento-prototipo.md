# Planejamento escolar no protótipo

As telas usam `localStorage` do navegador. O cadastro, a chamada e as observações são demonstrações locais, sem autenticação, sincronização entre dispositivos ou envio à SEED. Use apenas dados fictícios.

## Fluxo

1. A secretaria cadastra a escola com uma diretoria de educação e múltiplas ofertas e turnos. Também cadastra professores.
2. A escola cria o ano letivo e as turmas, registra informações das matérias, distribui professores e monta a grade manualmente. A grade verifica conflitos de turma, professor e sala.
3. O professor registra conteúdo, presença e observações individuais na chamada. A aula aparece no diário; registros feitos no diário usam o mesmo armazenamento.
4. A escola vê os registros da aula e o responsável vê as observações demonstrativas dos filhos exibidos no seu perfil.
5. A opção **Finalizar ano letivo** informa que cálculo de resultados, promoção e preparação de turmas ainda não estão disponíveis. Ela não modifica os dados.

## Fontes para os cadastros

- [Composição das diretorias de educação da SEED](https://seduc.se.gov.br/institucional-composicao-seed/): DEA e DREs 01 a 09, com respectivas sedes.
- [Perguntas frequentes da SEED](https://seduc.se.gov.br/perguntas-frequentes/): distingue modalidade de ensino e turno no fluxo de matrícula e descreve processos de recursos humanos.
- [Serviços para servidores](https://seduc.se.gov.br/servicos-para-servidores/): referência a lotação e componente ministrado.
- [Edital de atuação em tempo integral](https://siae.seduc.se.gov.br/siae.servicefile/api/File/Downloads/a9d056e0-cd87-4023-beb7-24389c7a5b9e): formação, lotação e carga horária. As fontes não apresentam uma especificação completa do cadastro interno de professores; os campos do EducaHub são uma seleção adequada ao protótipo.
