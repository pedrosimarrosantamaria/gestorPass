const { app, ipcRenderer } = require('electron');

/**
 * funcion que comprueba si el usuario existe
 */
function checkUser() {

    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;

    let user = {
        name: username,
        pass: password,
    }

    ipcRenderer.send('login-user', user);
}


/**
 * función que registra un usuario
 */
function registerUser() {
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;

    let user = {
        name: username,
        pass: password,
    }

    ipcRenderer.send('register-user', user);
}