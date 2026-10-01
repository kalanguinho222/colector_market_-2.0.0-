const form = document.querySelector('.container-login form');
const erro = document.querySelector('.mensagem-erro');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    erro.textContent = '';

    const resposta = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: form.usuario.value.trim(),
            senha: form.senha.value
        })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        erro.textContent = dados.erro;
        return;
    }

    location.href = 'login.html';
});