document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const validUsername = 'PCP CD';
    const validPassword = '12345';

    if (username === validUsername && password === validPassword) {
        window.location.href = 'gerador.html';
    } else {
        alert('Usuário ou senha incorretos. Tente novamente.'); 
    }
});
