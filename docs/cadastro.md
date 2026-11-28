# Pré-matrícula do aluno — TASKS 01, 02 e 03

Implementação na branch `tasks1,2,3`, em HTML, CSS e JavaScript puro. As 44 páginas e os cinco perfis foram preservados.

## Acessar o resultado

Execute `node tools/server.mjs` e abra `http://localhost:4321/entrar/`. Escolha **Aluno**.

A demonstração solicitada permanece pronta: CPF fictício `529.982.247-25` e senha `demo1234`. Um clique em **Entrar** abre a área do aluno pelo serviço de autenticação simulado existente.

Para testar as novas etapas, selecione **Informar outro CPF**, informe um CPF fictício válido ainda não cadastrado, como `390.533.447-05`, e aceite iniciar a pré-matrícula. Também é possível começar diretamente em `http://localhost:4321/cadastrar/`.

Exemplo de oferta simulada: ano atual ou seguinte, **6º ano do Ensino Fundamental**, **Aracaju**, **E. E. Jardim das Mangabeiras**, **Vespertino**. Preencha os demais campos com dados fictícios, revise e confirme. O comprovante aparece somente depois da gravação da solicitação.

Se o CPF de exemplo já tiver sido utilizado neste navegador, o sistema oferecerá o acesso à conta. Use outro documento fictício válido para uma nova solicitação; não apague as demais chaves do armazenamento.

## TASK 01 preservada

- Escolha de perfil em `/entrar/`; entrada exclusiva do aluno em `/entrar/aluno/`.
- Máscara e validação matemática do CPF, com rejeição de documentos repetidos e inválidos.
- CPF cadastrado pede senha; CPF não cadastrado oferece pré-matrícula.
- O acesso de demonstração começa preenchido, conforme solicitado. **Informar outro CPF** limpa CPF/senha e restaura a identificação progressiva.
- O CPF passa entre páginas pela chave temporária `educahub:pre-matricula:cpf` em sessionStorage. A pré-matrícula consome e remove essa chave e verifica novamente o registro.
- Não há CPF na URL, login automático ou exposição de dados pessoais antes da autenticação.
- O serviço de autenticação e o script de login compartilhado não foram alterados.

## TASK 02 — Série e escola

A seleção escolar é a primeira etapa depois da identificação. Depois vêm os dados do aluno, os dados do responsável somente para menores, o endereço e a revisão.

Os campos obrigatórios seguem a ordem: ano letivo, série, município, escola e turno. Os campos seguintes permanecem desabilitados até haver dados suficientes. Alterar ano, série ou município limpa a escola e o turno; alterar escola limpa o turno. Retornar às etapas anteriores preserva valores que não foram alterados.

As opções de escola exigem correspondência de ano disponível, série ofertada e município. Os turnos vêm da oferta da escola para a série selecionada. A validação é repetida antes da conclusão usando os dados locais atuais, impedindo aceitar uma opção que deixou de ser compatível durante o preenchimento.

São apresentados os textos de campos obrigatórios, ausência de escolas, ausência de turnos e CPF não identificado. A escolha de escola não cria matrícula ou garantia de vaga.

### Fontes dos dados

A análise encontrou:

- Nomes e municípios de oito unidades na tabela existente de `secretaria/escolas/index.html`.
- Cadastros locais em `educahub:secretaria:escolas`, com `nome`, `municipio`, `etapas` e `turnos`.
- Anos letivos em `educahub:ano-letivo:v1`, na estrutura `{ anos, ativo }`.
- Séries de 6º a 9º ano nas turmas existentes; ausência de associação entre escola, série e turno para a pré-matrícula.

O catálogo exclusivo do aluno reaproveita os nomes e municípios das oito unidades existentes e complementa apenas suas ofertas simuladas. Inclui 6º a 9º ano do Ensino Fundamental e 1ª a 3ª série do Ensino Médio. Essa oferta é demonstrativa, sem correspondência com vagas reais. Os cadastros locais com etapas compatíveis também podem ser consultados; não há criação nem alteração desses cadastros por este fluxo.

Se existem anos configurados, são respeitados. Na ausência da configuração, são oferecidos o ano atual e o seguinte, calculados em execução. Identificadores das escolas cadastradas derivam de nome e município, evitando trocar silenciosamente uma escolha quando a ordem da lista muda.

Nenhuma chave da Secretaria, escola, turmas ou planejamento é escrita pela seleção escolar. Não foi criado um cadastro paralelo de escolas. Quando há cadastro local da mesma unidade, sua oferta prevalece sobre o complemento simulado, preservando os turnos efetivamente registrados.

Os campos cadastrais existentes continuam disponíveis. Para atender à restrição de não usar APIs externas, CEP e endereço são preenchidos manualmente. A lista de cidades natais de Sergipe oferece sugestões locais e permite digitação livre. Não há consultas ao IBGE, BrasilAPI ou outros serviços nesse fluxo.

## TASK 03 — Comprovante

O comprovante usa a solicitação efetivamente salva, com:

- Logotipo e nome EducaHub, identificação da rede estadual de Sergipe e título conforme o status.
- Protocolo, data, horário de Brasília e ano letivo.
- Nome parcialmente anonimizado e CPF mascarado.
- Escola, município, série, turno e ano letivo escolhidos.
- Situação, próximos passos, ausência de garantia de vaga e aviso de documento demonstrativo sem validade oficial.

Uma solicitação nova recebe o status `analise`, já utilizado nas matrículas escolares simuladas. Seu título é **Comprovante de Pré-Matrícula**, e a situação é **Aguardando confirmação**. O status `pendente` também permanece como pré-matrícula.

A apresentação suporta o status existente `confirmada`, exibindo **Comprovante de Matrícula** e **Matrícula confirmada**. Não foi criado um mecanismo de aprovação nem integração automática com linhas de matrícula da escola, que não têm identificador de CPF persistido. Uma pré-matrícula nunca se torna confirmada apenas por finalizar o formulário.

### Persistência e protocolo

A coleção existente da TASK 01, `educahub:alunos:v1`, continua sendo utilizada. Os registros anteriores `{ cpf }`, incluindo a demonstração, são preservados. A conclusão acrescenta um único registro neste formato:

```js
{
  cpf: 'somente dígitos',
  solicitacao: {
    protocolo: 'ano da solicitação + sufixo aleatório',
    criadoEm: 'data ISO',
    status: 'analise',
    nome: 'nome originalmente informado',
    escolar: { anoLetivo, serie, municipio, escola, turno }
  }
}
```

Não são persistidos no comprovante os dados de endereço, telefone, CPF do responsável, nascimento ou anexos. O nome e o CPF originais permanecem no registro; o mascaramento acontece somente na apresentação.

O protocolo reutiliza o mecanismo anterior: ano atual e os oito primeiros caracteres do UUID, como `2026-A1B2C3D4`. É gerado somente na conclusão e conferido contra os protocolos locais para evitar colisões. A gravação do aluno e da solicitação ocorre em uma única escrita no localStorage. Falha de gravação não deixa um aluno registrado sem sua solicitação correspondente.

Após a conclusão, somente o protocolo aparece no fragmento da URL, como `/cadastrar/#comprovante=2026-A1B2C3D4`. Recarregar a página consulta o mesmo registro, sem gerar outro número ou data. O CPF e o nome não aparecem na URL.

O comprovante não é exibido para protocolo ausente, inexistente, registro incompleto ou inválido. Imprimir e salvar em PDF consultam novamente a solicitação antes de abrir a impressão. Cliques repetidos na confirmação não geram solicitações duplicadas.

### Mascaramento e impressão

`anonimizarNome` mantém o primeiro nome e partículas como “da” e abrevia os sobrenomes: **João da Silva Santos → João da S. S.**

`mascararCpf` oculta os três primeiros e os dois últimos dígitos: `529.982.247-25` vira `***.982.247-**`. O componente recebe apenas os valores de apresentação e insere texto com `textContent`.

Os botões **Imprimir comprovante** e **Salvar comprovante em PDF** usam `window.print()`. Para PDF, o usuário escolhe “Salvar como PDF” na janela nativa. Não foi adicionada biblioteca de PDF nem geração externa.

O CSS exclusivo do comprovante define A4, margens de 16 mm, cores legíveis em preto e branco e prevenção de quebras internas nas seções. Oculta menus, cabeçalho geral, rodapé, formulários e botões na impressão. Somente o artigo do comprovante, já mascarado, permanece na área imprimível.

## Arquivos e funções desta etapa

Criados:

- `assets/js/services/ofertas-escolares.js`: catálogo, `carregarOfertas`, `escolasCompativeis`, `turnosDisponiveis`, `validarOferta` e `descreverOferta`.
- `assets/js/pages/aluno/oferta-matricula.js`: `configurarOferta`, opções dependentes e validação da etapa.
- `assets/js/services/solicitacoes.js`: `concluirSolicitacao`, `anonimizarNome`, `mascararCpf` e `dadosComprovante`.
- `assets/js/components/ComprovanteAluno.js`: `prepararComprovante`, exibição, limpeza e impressão após consulta do registro.
- `assets/css/pages/comprovante-aluno.css`: apresentação responsiva e impressão somente desta página.
- `tests/ofertas-solicitacoes.test.js`: filtros, reutilização de dados, persistência, anonimização, status, protocolos, registros inválidos e falhas de gravação.

Modificados nesta etapa:

- `cadastrar/index.html`: etapa escolar, revisão e estrutura institucional do comprovante.
- `assets/js/cadastro.js`: integração das etapas, reconsulta, confirmação, recuperação do comprovante e preenchimento sem APIs externas.
- `assets/js/services/alunos.js`: parâmetro opcional para salvar a solicitação com o aluno e `obterSolicitacao`; chamadas anteriores somente com CPF continuam funcionando.
- `docs/cadastro.md`: este relatório.

Reaproveitados sem alteração: `cpfValidator`, `formatarCpf`, `definirErro`, `idadeNaData`, leitor do armazenamento, tema, logotipo, classes dos formulários e as etapas cadastrais anteriores. As alterações anteriores da TASK 01 e o acesso de demonstração foram mantidos.

## Testes e cenários de aceite

- `npm run format`, `npm run lint`, `npm test` e `npm run build`: comandos obrigatórios executados para validação final.
- Suíte Node: **29 testes aprovados**, incluindo os 20 testes anteriores de CPF, entrada do aluno, demonstração e transferência temporária.
- Verificação estática: **44 páginas**, sintaxe JavaScript e referências locais.
- Teste temporário de DOM sobre o HTML e os controladores reais, usando LinkeDOM com rede bloqueada: fluxo completo aprovado; a ferramenta de teste não integra as dependências do projeto.

| Cenários                                             | Verificação realizada                                                                                           |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| CPF válido reaproveitado e ausência de identificação | Transferência entre páginas e bloqueio sem CPF verificado.                                                      |
| Campos escolares obrigatórios vazios                 | Tentativa de avançar permaneceu na etapa com mensagem e foco.                                                   |
| Diferentes séries e municípios                       | Escolas filtradas e seleções incompatíveis limpas.                                                              |
| Diferentes escolas e turnos                          | Turnos limitados à oferta; troca da escola limpou o turno.                                                      |
| Nenhuma escola ou nenhum turno                       | Mensagens específicas e avanço bloqueado.                                                                       |
| Retorno à etapa anterior                             | Escolha escolar e endereço preservados.                                                                         |
| Dados cadastrais de aluno menor                      | Etapa do responsável exigida e validada antes do endereço.                                                      |
| Revisão antes da gravação                            | Nenhum aluno criado até a confirmação final.                                                                    |
| Conclusão e cliques repetidos                        | Uma solicitação salva, um protocolo e nenhuma duplicação.                                                       |
| Comprovante e dados efetivos                         | Escola, turno e ano correspondentes à seleção.                                                                  |
| Nome, CPF e informações sensíveis                    | Artigo sem nome completo, CPF completo, endereço ou telefone.                                                   |
| Data, horário, status e protocolo                    | Brasília, status correto e verificação de colisão de UUID.                                                      |
| Atualização da página                                | Mesmo protocolo, data e conteúdo recuperados da solicitação.                                                    |
| Comprovante sem solicitação                          | Protocolo inexistente ou registro removido impede exibição e impressão.                                         |
| Imprimir e salvar em PDF                             | Ambos chamaram a impressão nativa sem modificar protocolo ou registro; dados no artigo permaneceram mascarados. |
| TASK 01 e outros perfis                              | Suíte anterior aprovada; diff dos arquivos dos outros perfis e do login compartilhado sem alterações.           |

Para reproduzir ausência de escola: selecione Ensino Médio e município Aracaju no catálogo padrão. Para ausência de turno, o teste isolado usa uma escola fictícia com uma etapa ofertada e `turnos: []`, no mesmo formato dos registros existentes. Esses dados de teste não foram deixados no armazenamento do usuário.

## Limitações e preservação do escopo

O acesso automatizado ao navegador está indisponível. Os estados, filtros, persistência, foco e chamadas de impressão foram testados no DOM; a revisão visual em 360/390 px, temas claro/escuro, leitor de tela, paginação física A4 e diálogo real de PDF permanece pendente. O CSS reutiliza as variáveis de tema e mantém as regras novas restritas à matrícula/comprovante do aluno.

Os dados são locais ao navegador e à origem. Não há backend, envio de matrícula, vaga real, assinatura ou validade oficial. A comparação de CPF e protocolo evita duplicidades locais em uso sequencial, mas localStorage não oferece transação entre duas abas concluindo exatamente ao mesmo tempo.

Não foram alterados os fluxos, dashboards, menus, permissões, notas, frequência, chamada ou gestão dos perfis responsável, professor, escola e Secretaria. Os catálogos desses perfis são somente lidos quando necessário. A verificação dos arquivos e os testes sustentam a preservação do código e dos mecanismos anteriores; não se afirma regressão interativa completa desses perfis sem acesso ao navegador.
