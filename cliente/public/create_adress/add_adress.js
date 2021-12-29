const { app, BrowserWindow, ipcRenderer } = require('electron');


async function createAdress() {
	/*
	var user_credentials = ipcRenderer.sendSync('give-user-json', '');
	//var user_json = desencriptar(user_credentials);
	var user_json = ipcRenderer.sendSync('give-user-json', '');
	let direccion = {
		text: document.querySelector('#Textarea1').value,
	}
	
	user_json["adress"].push(direccion);

	let data_wr = JSON.stringify(user_json, null, 2);

	try {
		encriptar(user_credentials.name, user_credentials.pass, data_wr);
		alert("Se ha añadido su direccion con éxito");
	} catch (error) {
		alert('Fallo añadiendo la direccion');
	}

	ipcRenderer.send('add-adress', user_json);
	window.close();
	ipcRenderer.sendSync('refresh', '');*/

	let dir = {
		text: document.querySelector('#Textarea1').value,
	}
	console.log("direccion " + dir);

	await ipcRenderer.invoke('add-adress', dir);
	window.close();
	await ipcRenderer.invoke('refresh');
}


document.addEventListener('DOMContentLoaded', init, false);

async function init() {
	document.querySelector('#addButton').addEventListener('click', createAdress, false);
}