// auth.js
document.addEventListener('DOMContentLoaded', () => {
  const usuariosKey = 'usuarios_md3';
  const loginKey = 'usuario_logado';

  const telaLogin = document.getElementById('tela-login');
  const telaCadastro = document.getElementById('tela-cadastro');
  const painelGeral = document.getElementById('painel-geral');

  function mostrarLogin() {
    telaLogin.style.display = 'block';
    telaCadastro.style.display = 'none';
    painelGeral.style.display = 'none';
  }
  function mostrarCadastro() {
    telaLogin.style.display = 'none';
    telaCadastro.style.display = 'block';
    painelGeral.style.display = 'none';
  }
  function mostrarPainel() {
    telaLogin.style.display = 'none';
    telaCadastro.style.display = 'none';
    painelGeral.style.display = 'block';
    // Chama a função para ajustar a UI com base no papel do usuário
    ajustarUIPorRole();
  }

  function getUsuarios() {
    return JSON.parse(localStorage.getItem(usuariosKey)) || [];
  }

  function salvarUsuario(usuario) {
    const usuarios = getUsuarios();
    usuarios.push(usuario);
    localStorage.setItem(usuariosKey, JSON.stringify(usuarios));
  }

  function usuarioExiste(nome) {
    return getUsuarios().some(u => u.nome === nome);
  }

  // Nova função para obter o papel do usuário logado
  function getUsuarioLogadoRole() {
    const usuarioLogado = JSON.parse(localStorage.getItem(loginKey));
    return usuarioLogado ? usuarioLogado.role : null;
  }

  // NOVA FUNÇÃO: Ajusta a UI com base no papel do usuário
  function ajustarUIPorRole() {
    const userRole = getUsuarioLogadoRole();
    const adminElements = document.querySelectorAll('.admin-only');

    if (userRole !== 'admin') {
      adminElements.forEach(el => {
        el.classList.add('disabled');
      });
    } else {
      adminElements.forEach(el => {
        el.classList.remove('disabled');
      });
    }
  }


  document.getElementById('btn-login').addEventListener('click', () => {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    const erro = document.getElementById('login-erro');

    const usuarios = getUsuarios();
    // Adiciona um papel (role) aos usuários hardcoded ou registrados
    // Para simplificar, vou assumir que 'admin' e 'visitante' são especiais,
    // e novos cadastros são 'padrao' ou 'visitante'.
    let conta = usuarios.find(u => u.nome === user && u.senha === pass);

    // Adicionando usuários fixos com roles
    if (user === 'admin' && pass === 'admintrihard') { // Mude 'admin123' para uma senha forte!
        conta = { nome: 'admin', senha: 'admin123', role: 'admin' };
    } else if (user === 'visitante' && pass === 'visitante123') { // Mude 'visitante123' para uma senha forte!
        conta = { nome: 'visitante', senha: 'visitante123', role: 'visitante' };
    } else if (conta) {
        // Se a conta existe mas não tem role definida (para usuários novos), atribui 'visitante'
        if (!conta.role) {
            conta.role = 'visitante';
        }
    }


    if (conta) {
      localStorage.setItem(loginKey, JSON.stringify(conta));
      mostrarPainel();
      erro.textContent = '';
    } else {
      erro.textContent = 'Usuário ou senha inválidos.';
    }
  });

  document.getElementById('btn-cadastrar').addEventListener('click', () => {
    const nome = document.getElementById('cad-user').value.trim();
    const senha = document.getElementById('cad-pass').value.trim();
    const senha2 = document.getElementById('cad-pass2').value.trim();
    const erro = document.getElementById('cad-erro');

    if (!nome || !senha || !senha2) {
      erro.textContent = 'Preencha todos os campos.';
      return;
    }
    if (senha !== senha2) {
      erro.textContent = 'As senhas não coincidem.';
      return;
    }
    if (usuarioExiste(nome)) {
      erro.textContent = 'Usuário já existe.';
      return;
    }

    // Ao cadastrar, define o role como 'visitante' por padrão
    salvarUsuario({ nome, senha, role: 'visitante' });
    alert('Cadastro realizado com sucesso! Faça login.');
    mostrarLogin();
    erro.textContent = '';
  });

  document.getElementById('link-cadastro').addEventListener('click', mostrarCadastro);
  document.getElementById('link-login').addEventListener('click', mostrarLogin);

  document.getElementById('btn-redefinir').addEventListener('click', () => {
    alert('Redefinição de senha ainda não implementada. Contate o admin.');
  });

  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem(loginKey);
    mostrarLogin();
  });

  // Se já estiver logado, mostra painel, senão mostra login
  if (localStorage.getItem(loginKey)) {
    mostrarPainel();
  } else {
    mostrarLogin();
  }

  // Exporta a função para ser usada em outros scripts, se necessário
  window.getUsuarioLogadoRole = getUsuarioLogadoRole;
});