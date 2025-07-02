// script.js

document.addEventListener('DOMContentLoaded', () => {
  const tabela = document.getElementById('tabela-jogadores');
  const addBtn = document.getElementById('addPlayerBtn');
  const formContainer = document.getElementById('formulario-jogador');
  const form = document.getElementById('form-jogador');
  const cancelarBtn = document.getElementById('cancelar');
  const filtroNome = document.getElementById('filtro-nome');
  const filtroPosicao = document.getElementById('filtro-posicao');
  const btnExportar = document.getElementById('exportar-dados');
  const btnImportar = document.getElementById('btn-importar');
  const inputImportar = document.getElementById('importar-dados');
  const btnLimpar = document.getElementById('limpar-dados');

  let jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];

  function salvar() {
    localStorage.setItem('jogadores', JSON.stringify(jogadores));
  }

  // Função para obter o papel do usuário logado (assumimos que auth.js já exportou essa função)
  // Certifique-se que no auth.js você tem: window.getUsuarioLogadoRole = getUsuarioLogadoRole;
  function isUserAdmin() {
    return window.getUsuarioLogadoRole && window.getUsuarioLogadoRole() === 'admin';
  }

  function atualizarTabela() {
    if (!tabela) return;

    tabela.innerHTML = '';
    let filtro = jogadores.filter(j =>
      j.nome.toLowerCase().includes(filtroNome.value.toLowerCase()) &&
      (filtroPosicao.value === '' || j.posicao.includes(filtroPosicao.value))
    );

    const isAdmin = isUserAdmin(); // Verifica o papel uma vez para otimizar

    filtro.forEach((jogador, index) => {
      let tr = document.createElement('tr');

      // Adiciona a classe 'tabela-btn-admin' e 'disabled' se não for admin
      const disabledClass = isAdmin ? '' : 'disabled';

      tr.innerHTML = `
        <td>${jogador.nome}</td>
        <td>
          <span>${jogador.equipe || 'Sem time'}</span>
          <button onclick="alterarTime(${index})" class="${disabledClass}">Alterar Time</button>
        </td>
        <td>${jogador.posicao}</td>
        <td>
          ${jogador.trofeus}
          <button onclick="alterarValor(${index}, 'trofeus', -1)" class="${disabledClass}">-</button>
          <button onclick="alterarValor(${index}, 'trofeus', 1)" class="${disabledClass}">+</button>
        </td>
        <td>
          ${jogador.medalhas}
          <button onclick="alterarValor(${index}, 'medalhas', -1)" class="${disabledClass}">-</button>
          <button onclick="alterarValor(${index}, 'medalhas', 1)" class="${disabledClass}">+</button>
        </td>
        <td>
          <button onclick="toggleCapitao(${index})" class="${disabledClass}">${jogador.capitao ? '✔️' : '❌'}</button>
        </td>
        <td>
          ${jogador.capitaoVezes || 0}
          <button onclick="alterarValor(${index}, 'capitaoVezes', -1)" class="${disabledClass}">-</button>
          <button onclick="alterarValor(${index}, 'capitaoVezes', 1)" class="${disabledClass}">+</button>
        </td>
        <td>
          <button onclick="editarPosicao(${index})" class="${disabledClass}">Editar Posições</button>
          <button onclick="removerJogador(${index})" class="${disabledClass}">Remover</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  }

  function atualizarDestaque() {
    const destaqueNome = document.getElementById('destaque-nome');
    const destaquePosicao = document.getElementById('destaque-posicao');
    const destaqueTrofeus = document.getElementById('destaque-trofeus');

    if (!destaqueNome || !destaquePosicao || !destaqueTrofeus) return;

    if (jogadores.length === 0) {
      destaqueNome.textContent = '-';
      destaquePosicao.textContent = '-';
      destaqueTrofeus.textContent = '0';
      return;
    }

    const destaque = jogadores.reduce((mais, atual) =>
      atual.trofeus > mais.trofeus ? atual : mais
    );

    destaqueNome.textContent = destaque.nome;
    destaquePosicao.textContent = destaque.posicao;
    destaqueTrofeus.textContent = destaque.trofeus;
  }

  // As funções globais (window.alterarValor, etc.) precisam verificar o papel do usuário
  // antes de executar qualquer ação de modificação.
  window.alterarValor = function(index, campo, valor) {
    if (!isUserAdmin()) return; // Bloqueia a ação se não for admin
    jogadores[index][campo] += valor;
    if (jogadores[index][campo] < 0) jogadores[index][campo] = 0;
    salvar();
    atualizarTabela();
    atualizarDestaque();
  }

  window.toggleCapitao = function(index) {
    if (!isUserAdmin()) return; // Bloqueia a ação se não for admin
    jogadores[index].capitao = !jogadores[index].capitao;
    salvar();
    atualizarTabela();
    atualizarDestaque();
  }

  window.removerJogador = function(index) {
    if (!isUserAdmin()) return; // Bloqueia a ação se não for admin
    jogadores.splice(index, 1);
    salvar();
    atualizarTabela();
    atualizarDestaque();
  }

  window.alterarTime = function(index) {
    if (!isUserAdmin()) return; // Bloqueia a ação se não for admin
    const novoTime = prompt('Novo nome do time:', jogadores[index].equipe || '');
    if (novoTime !== null) {
      jogadores[index].equipe = novoTime;
      salvar();
      atualizarTabela();
      atualizarDestaque();
    }
  }

  window.editarPosicao = function(index) {
    if (!isUserAdmin()) return; // Bloqueia a ação se não for admin
    const nova = prompt('Nova posição:', jogadores[index].posicao);
    if (nova) {
      jogadores[index].posicao = nova;
      salvar();
      atualizarTabela();
      atualizarDestaque();
    }
  }

  // Event Listeners dos botões principais (addPlayerBtn, limpar-dados, exportar-dados, btn-importar)
  // serão desabilitados via CSS pela classe 'admin-only disabled' adicionada em auth.js

  // O formulário de adicionar jogador também será desabilitado via CSS (todo o div 'formulario-jogador')

  if (filtroNome) {
    filtroNome.addEventListener('input', () => {
      atualizarTabela();
      atualizarDestaque();
    });
  }

  if (filtroPosicao) {
    filtroPosicao.addEventListener('change', () => {
      atualizarTabela();
      atualizarDestaque();
    });
  }

  // As linhas abaixo foram mantidas para garantir que os listeners não deem erro
  // se o elemento for 'disabled' via CSS, embora os cliques serão impedidos pelo 'pointer-events: none'.
  // É uma boa prática adicionar a verificação isUserAdmin() nos manipuladores de evento também.

  if (addBtn && formContainer) {
    addBtn.addEventListener('click', () => {
      if (!isUserAdmin()) return;
      formContainer.style.display = 'block';
    });
  }

  if (cancelarBtn && form) {
    cancelarBtn.addEventListener('click', () => {
      form.reset();
      formContainer.style.display = 'none';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!isUserAdmin()) return; // Bloqueia a submissão se não for admin

      const nome = document.getElementById('nome').value.trim();
      const trofeus = parseInt(document.getElementById('trofeus').value);
      const medalhas = parseInt(document.getElementById('medalhas').value);
      const capitao = document.getElementById('capitao').checked;

      const posicoes = Array.from(document.querySelectorAll('input[name="posicao"]:checked'))
                            .map(input => input.value)
                            .join(', ');

      if (!nome || !posicoes) {
        alert('Preencha o nome e selecione pelo menos uma posição.');
        return;
      }

      const novoJogador = {
        nome,
        posicao: posicoes,
        trofeus,
        medalhas,
        capitao,
        capitaoVezes: 0,
        equipe: ''
      };

      jogadores.push(novoJogador);
      salvar();
      form.reset();
      formContainer.style.display = 'none';
      atualizarTabela();
      atualizarDestaque();
    });
  }

  if (btnExportar) {
    btnExportar.addEventListener('click', () => {
      if (!isUserAdmin()) return; // Bloqueia a ação se não for admin
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jogadores));
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute('href', dataStr);
      dlAnchor.setAttribute('download', 'jogadores.json');
      dlAnchor.click();
    });
  }

  if (btnImportar && inputImportar) {
    btnImportar.addEventListener('click', () => {
      if (!isUserAdmin()) return; // Bloqueia a ação se não for admin
      inputImportar.click();
    });

    inputImportar.addEventListener('change', (event) => {
      if (!isUserAdmin()) return; // Bloqueia a ação se não for admin
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const imported = JSON.parse(e.target.result);
          if (Array.isArray(imported)) {
            jogadores = imported;
            salvar();
            atualizarTabela();
            atualizarDestaque();
          } else {
            alert('Arquivo inválido.');
          }
        } catch (error) {
          alert('Erro ao importar os dados.');
        }
      };
      reader.readAsText(file);
    });
  }

  if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
      if (!isUserAdmin()) return; // Bloqueia a ação se não for admin
      if (confirm('Tem certeza que deseja limpar todos os dados?')) {
        jogadores = [];
        salvar();
        atualizarTabela();
        atualizarDestaque();
      }
    });
  }

  const btnAlterarMesAno = document.getElementById('alterar-mes-ano');
  const spanMesAno = document.getElementById('mesAno');

  if (btnAlterarMesAno && spanMesAno) {
    btnAlterarMesAno.addEventListener('click', () => {
      if (!isUserAdmin()) return; // Bloqueia a ação se não for admin
      const novo = prompt('Novo Mês e Ano:', spanMesAno.textContent);
      if (novo) spanMesAno.textContent = novo;
    });
  }

  const btnsAlterarData = document.querySelectorAll('.btn-alterar-data');
  if (btnsAlterarData.length > 0) {
    btnsAlterarData.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!isUserAdmin()) return; // Bloqueia a ação se não for admin
        const span = btn.parentElement.querySelector('.data');
        if (!span) return;
        const novaData = prompt('Nova data:', span.textContent);
        if (novaData) span.textContent = novaData;
      });
    });
  }

  // --- Funções de Destaque do Mês ---
  // Certifique-se que os IDs 'selecionarDestaque' e 'btnSalvarDestaque' existem no Painel.html
  // ou que você os trate adequadamente, pois eles parecem estar em um script separado.
  // Se eles estão em um script separado, a verificação 'isUserAdmin()' deve estar lá.
  const selectDestaque = document.getElementById('selecionarDestaque');
  const btnSalvarDestaque = document.getElementById('btnSalvarDestaque');

  // Adiciona a classe 'admin-only' e 'disabled' ao select e botão de destaque se não for admin
  if (selectDestaque) {
    selectDestaque.classList.toggle('admin-only', !isAdmin);
    selectDestaque.classList.toggle('disabled', !isAdmin);
  }
  if (btnSalvarDestaque) {
    btnSalvarDestaque.classList.toggle('admin-only', !isAdmin);
    btnSalvarDestaque.classList.toggle('disabled', !isAdmin);
    btnSalvarDestaque.addEventListener('click', () => {
      if (!isUserAdmin()) return;
      let idx = selectDestaque.value;
      if (idx === "") {
        alert("Selecione um jogador para destaque.");
        return;
      }
      let jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
      let destaque = jogadores[idx];
      if (!destaque) {
        alert("Jogador não encontrado.");
        return;
      }
      const destaqueSalvar = {
        nome: destaque.nome,
        posicao: destaque.posicoes ? destaque.posicoes[0] : (destaque.posicao || "-"),
        trofeus: destaque.trofeus || 0,
        medalhas: destaque.medalhas || 0
      };
      localStorage.setItem('destaqueMes', JSON.stringify(destaqueSalvar));
      alert('Destaque do mês salvo!');
      document.getElementById('destaque-nome').textContent = destaqueSalvar.nome;
      document.getElementById('destaque-posicao').textContent = destaqueSalvar.posicao;
      document.getElementById('destaque-trofeus').textContent = destaqueSalvar.trofeus;
    });
  }


  // Inicialização
  atualizarTabela();
  atualizarDestaque();
});