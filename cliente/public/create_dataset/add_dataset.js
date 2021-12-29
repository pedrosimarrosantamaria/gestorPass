const { ipcRenderer } = require('electron');

let usuarios;

/**
 * Función para crear la lista de los usuarios
 * @param {*} usuarios 
 */
function createUsersList(usuarios) {

    let lista = document.querySelector('#lista-usuarios');

    usuarios.forEach(usuario => {
        lista.innerHTML += `
        <li class="list-group-item">
                    <input class="form-check-input me-1" type="checkbox" value="${usuario.name}" aria-label="...">
                    ${usuario.name}
        </li>`
    });
}

/**
 * Función que selecciona los usuarios checkeados
 */
async function save() {
    let nombreDataset = document.querySelector('#inputDataset').value;
    let usuariosLista = document.querySelectorAll('.form-check-input');

    let usuariosChecked = [];
    usuariosLista.forEach(usuarioLista => {
        if (usuarioLista.checked) {
            usuariosChecked = usuariosChecked.concat(usuarios.filter(usuario => usuario['name'] == usuarioLista.value));
        }
    });

    let data = {
        usuarios: usuariosChecked,
        nombre: nombreDataset,
    }

    await ipcRenderer.invoke('create-dataset', data);
    window.close();
    await ipcRenderer.invoke('refresh');
}

async function init() {
    usuarios = await ipcRenderer.invoke('get-users', '');
    createUsersList(usuarios);
}

document.addEventListener('DOMContentLoaded', init, false);