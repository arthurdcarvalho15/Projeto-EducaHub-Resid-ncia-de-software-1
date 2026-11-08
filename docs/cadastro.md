# Matrícula online

O HTML está em cadastrar/index.html; a lógica em assets/js/cadastro.js e os estilos em assets/css/formularios.css.

Etapas: dados do aluno, responsável (somente para menores de 18 anos) e endereço. CPF tem validação de dígitos verificadores; datas futuras ou inválidas são rejeitadas. Nome social aparece para os gêneros previstos no formulário. Brasileiros informam UF e cidade natal.

Países vêm de Intl.DisplayNames no próprio navegador. Municípios são consultados no IBGE. O CEP consulta a BrasilAPI. Os campos permitem preenchimento manual se a rede falhar. Erros exibem ícone e texto, com foco no primeiro campo inválido.

A conclusão gera um protocolo de exemplo e informa que nenhum dado foi enviado a uma escola. Não há banco de dados ou transmissão da matrícula.
