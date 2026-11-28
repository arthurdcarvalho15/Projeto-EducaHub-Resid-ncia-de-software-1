import test from 'node:test';
import assert from 'node:assert/strict';

test('Entrada do aluno identifica CPF antes de solicitar senha', async (t) => {
  let numero = 0;
  async function preparar(t, alunos = [], demonstracao = false) {
    const elementos = new Map();
    let foco;
    const destinos = [];
    function elemento(id) {
      const atributos = new Map();
      const eventos = new Map();
      const el = {
        id,
        value: '',
        textContent: '',
        hidden: false,
        disabled: false,
        readOnly: false,
        type: 'password',
        setAttribute: (chave, valor) => atributos.set(chave, valor),
        getAttribute: (chave) => atributos.get(chave) ?? null,
        setCustomValidity: (valor) => {
          el.validationMessage = valor;
        },
        insertAdjacentElement: (_, filho) => elementos.set(filho.id, filho),
        focus: () => {
          foco = el;
        },
        addEventListener: (tipo, callback) => eventos.set(tipo, callback),
        emitir: async (tipo) => eventos.get(tipo)?.({ preventDefault() {} }),
      };
      elementos.set(id, el);
      return el;
    }
    const cpf = elemento('login-cpf');
    const senha = elemento('login-senha');
    senha.disabled = true;
    const olho = elemento('olho');
    const form = elemento('form');
    form.elements = { cpf, senha };
    form.dataset = { destino: '/aluno/' };
    if (demonstracao) {
      form.dataset.cpfDemo = '52998224725';
      form.dataset.senhaDemo = 'demo1234';
    }
    form.querySelector = () => olho;
    for (const id of [
      'aluno-login-status',
      'aluno-etapa-senha',
      'aluno-recuperar',
      'aluno-continuar',
      'aluno-sem-cadastro',
      'aluno-outro-cpf',
      'aluno-pergunta-matricula',
      'aluno-pre-matricula',
    ])
      elemento(id);
    elementos.get('aluno-etapa-senha').hidden = true;
    elementos.get('aluno-sem-cadastro').hidden = true;
    const local = new Map([['educahub:alunos:v1', JSON.stringify(alunos)]]);
    const sessao = new Map();
    const armazenamento = (dados) => ({
      getItem: (chave) => dados.get(chave) ?? null,
      setItem: (chave, valor) => dados.set(chave, valor),
      removeItem: (chave) => dados.delete(chave),
    });
    const globais = {
      document: {
        querySelector: () => form,
        getElementById: (id) => elementos.get(id),
        createElement: () => elemento(`criado-${elementos.size}`),
      },
      window: { location: { assign: (url) => destinos.push(url) } },
      localStorage: armazenamento(local),
      sessionStorage: armazenamento(sessao),
    };
    for (const [chave, valor] of Object.entries(globais)) {
      const anterior = Object.getOwnPropertyDescriptor(globalThis, chave);
      Object.defineProperty(globalThis, chave, { configurable: true, value: valor });
      t.after(() => {
        if (anterior) Object.defineProperty(globalThis, chave, anterior);
        else delete globalThis[chave];
      });
    }
    await import(`../assets/js/pages/login-aluno.js?teste=${++numero}`);
    return { cpf, senha, form, local, sessao, destinos, elementos, foco: () => foco };
  }

  await t.test(
    'demonstração preenche o acesso e entra com um clique sem sobrescrever alunos',
    async (t) => {
      const anterior = { cpf: '11144477735', nome: 'Aluno fictício' };
      const ui = await preparar(t, [anterior], true);
      assert.equal(ui.cpf.value, '529.982.247-25');
      assert.equal(ui.senha.value, 'demo1234');
      assert.equal(ui.elementos.get('aluno-continuar').textContent, 'Entrar');
      assert.equal(ui.elementos.get('aluno-etapa-senha').hidden, false);
      assert.equal(ui.sessao.size, 0);
      assert.deepEqual(JSON.parse(ui.local.get('educahub:alunos:v1')), [
        anterior,
        { cpf: '52998224725' },
      ]);
      await ui.form.emitir('submit');
      assert.deepEqual(ui.destinos, ['/aluno/']);
      assert.equal(JSON.parse(ui.sessao.get('educahub:sessao')).cpf, '52998224725');
    },
  );

  await t.test('vazio, incompleto, letras, repetidos e inválido não revelam senha', async (t) => {
    const ui = await preparar(t);
    for (const cpf of ['', '123', 'abc', '11111111111', '52998224724']) {
      ui.cpf.value = cpf;
      await ui.form.emitir('submit');
      assert.match(ui.cpf.validationMessage, /CPF inválido/);
      assert.equal(ui.elementos.get('aluno-etapa-senha').hidden, true);
      assert.equal(ui.senha.disabled, true);
      assert.equal(ui.foco(), ui.cpf);
    }
    assert.equal(ui.sessao.size, 0);
  });

  await t.test(
    'CPF novo oferece matrícula e preserva o CPF somente após confirmação',
    async (t) => {
      const ui = await preparar(t);
      ui.cpf.value = '11144477735';
      await ui.cpf.emitir('input');
      assert.equal(ui.cpf.value, '111.444.777-35');
      await ui.form.emitir('submit');
      assert.equal(ui.elementos.get('aluno-sem-cadastro').hidden, false);
      assert.equal(ui.elementos.get('aluno-etapa-senha').hidden, true);
      assert.equal(ui.sessao.size, 0);
      assert.equal(ui.destinos.length, 0);
      await ui.elementos.get('aluno-pre-matricula').emitir('click');
      assert.equal(ui.sessao.get('educahub:pre-matricula:cpf'), '11144477735');
      assert.deepEqual(ui.destinos, ['/cadastrar/']);
      assert.equal(JSON.parse(ui.local.get('educahub:alunos:v1')).length, 0);
    },
  );

  await t.test('CPF cadastrado pede senha e só autentica após preenchimento válido', async (t) => {
    const ui = await preparar(t, [{ cpf: '529.982.247-25' }]);
    ui.cpf.value = '52998224725';
    await ui.form.emitir('submit');
    assert.equal(ui.elementos.get('aluno-etapa-senha').hidden, false);
    assert.equal(ui.senha.disabled, false);
    assert.equal(ui.cpf.readOnly, true);
    assert.equal(ui.foco(), ui.senha);
    assert.equal(ui.sessao.size, 0);
    ui.senha.value = '123';
    await ui.form.emitir('submit');
    assert.match(ui.senha.validationMessage, /4 caracteres/);
    assert.equal(ui.destinos.length, 0);
    ui.senha.value = '1234';
    await ui.form.emitir('submit');
    assert.deepEqual(ui.destinos, ['/aluno/']);
    assert.equal(JSON.parse(ui.sessao.get('educahub:sessao')).cpf, '52998224725');
  });

  await t.test('outro CPF limpa a senha e retorna à identificação', async (t) => {
    const ui = await preparar(t, [{ cpf: '52998224725' }]);
    ui.cpf.value = '529.982.247-25';
    await ui.form.emitir('submit');
    ui.senha.value = '1234';
    await ui.elementos.get('aluno-outro-cpf').emitir('click');
    assert.equal(ui.cpf.value, '');
    assert.equal(ui.senha.value, '');
    assert.equal(ui.senha.disabled, true);
    assert.equal(ui.cpf.readOnly, false);
    assert.equal(ui.elementos.get('aluno-etapa-senha').hidden, true);
    assert.equal(ui.foco(), ui.cpf);
  });

  await t.test('remoção do registro antes da senha impede autenticação', async (t) => {
    const ui = await preparar(t, [{ cpf: '52998224725' }]);
    ui.cpf.value = '52998224725';
    await ui.form.emitir('submit');
    ui.local.set('educahub:alunos:v1', '[]');
    ui.senha.value = '1234';
    await ui.form.emitir('submit');
    assert.equal(ui.sessao.size, 0);
    assert.equal(ui.elementos.get('aluno-sem-cadastro').hidden, false);
    assert.equal(ui.senha.value, '');
  });

  await t.test('registro criado antes de confirmar matrícula passa a pedir senha', async (t) => {
    const ui = await preparar(t);
    ui.cpf.value = '52998224725';
    await ui.form.emitir('submit');
    ui.local.set('educahub:alunos:v1', JSON.stringify([{ cpf: '52998224725' }]));
    await ui.elementos.get('aluno-pre-matricula').emitir('click');
    assert.equal(ui.elementos.get('aluno-etapa-senha').hidden, false);
    assert.equal(ui.destinos.length, 0);
    assert.equal(ui.sessao.size, 0);
  });
});
