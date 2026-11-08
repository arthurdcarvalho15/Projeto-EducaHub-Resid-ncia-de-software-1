import { lerPreferencias, salvarPreferencias } from '/assets/js/scripts/preferencias.js';
import { mostrarAviso } from '/assets/js/scripts/aviso.js';
function preencher(p) {
  document.querySelectorAll("input[name='tema']").forEach((i) => (i.checked = i.value === p.tema));
  document
    .querySelectorAll("input[name='escala']")
    .forEach((i) => (i.checked = Number(i.value) === p.escala));
  const esp = document.querySelector("input[name='espacamento']");
  if (esp) esp.checked = p.espacamento === 'amplo';
}
document
  .querySelectorAll("input[name='tema']")
  .forEach((i) => i.addEventListener('change', () => salvarPreferencias({ tema: i.value })));
document
  .querySelectorAll("input[name='escala']")
  .forEach((i) =>
    i.addEventListener('change', () => salvarPreferencias({ escala: Number(i.value) })),
  );
document.querySelector("input[name='espacamento']")?.addEventListener('change', (e) => {
  salvarPreferencias({ espacamento: e.target.checked ? 'amplo' : 'normal' });
});
document.getElementById('restaurar')?.addEventListener('click', () => {
  preencher(salvarPreferencias({ tema: 'claro', escala: 1, espacamento: 'normal' }));
  mostrarAviso('Configurações restauradas.');
});
// Se o tema for trocado pelo botão do topo, atualiza os rádios aqui também
document.addEventListener('preferencias-alteradas', (e) => preencher(e.detail));
preencher(lerPreferencias());
