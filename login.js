// public/login.js

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do HTML
    const btnLogin = document.getElementById('btn-login');
    const loginUser = document.getElementById('login-user');
    const loginPass = document.getElementById('login-pass');
    const loginErro = document.getElementById('login-erro');

    // Referências aos links de navegação (se existirem no seu login.html)
    const linkCadastro = document.getElementById('link-cadastro');
    const btnRedefinir = document.getElementById('btn-redefinir'); // Assumindo que você usa 'btn-redefinir' para o link de redefinição de senha

    // Adiciona o evento de clique ao botão de login
    if (btnLogin) {
        btnLogin.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o envio padrão do formulário, que recarregaria a página

            const username = loginUser.value.trim();
            const password = loginPass.value.trim();

            if (!username || !password) {
                loginErro.textContent = 'Por favor, preencha usuário e senha.';
                return;
            }

            // --- SIMULAÇÃO DE AUTENTICAÇÃO E ATRIBUIÇÃO DE PAPEL ---
            // Em uma aplicação real, você faria uma requisição para um servidor aqui
            let role = null; // Papel do usuário (admin, visitante)

            if (username === 'admin' && password === 'admin123') {
                role = 'admin';
            } else if (username === 'visitante' && password === 'visitante123') {
                role = 'visitante';
            } else {
                // Credenciais inválidas
                loginErro.textContent = 'Usuário ou senha inválidos.';
                return;
            }

            // Se a simulação de autenticação foi bem-sucedida, use a função de auth.js para "logar" o usuário
            if (window.auth.loginUser(username, role)) {
                loginErro.textContent = ''; // Limpa qualquer mensagem de erro anterior
                alert(`Login bem-sucedido! Bem-vindo, ${username} (${role}).`);

                // Redireciona para o Painel.html após o login bem-sucedido
                // O Painel.html, por sua vez, usará o script.js para ajustar a UI com base no papel.
                window.location.href = 'Painel.html'; // Caminho relativo para o Painel.html
            } else {
                // Caso haja um erro inesperado na função loginUser (embora improvável com o código atual)
                loginErro.textContent = 'Erro inesperado ao processar o login.';
            }
        });
    }

    // Adiciona eventos para os links de navegação, se existirem no seu login.html
    if (linkCadastro) {
        linkCadastro.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cadastro.html'; // Redireciona para sua página de cadastro
        });
    }

    if (btnRedefinir) {
        btnRedefinir.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'resetSenha.html'; // Redireciona para sua página de redefinição de senha
        });
    }
