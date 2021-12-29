const { app, BrowserWindow, ipcRenderer } = require('electron');
const { encriptar, desencriptar } = require('../../encrypt/encrypt.js');
var fs = require('fs');

async function addBankAccount() {
	/*
	var user_credentials = ipcRenderer.sendSync('give-user-json', '');
	//var user_json = desencriptar(user_credentials);

	var user_json = ipcRenderer.sendSync('give-user-json', '');
	let num_cuenta = {
		text: document.querySelector('#numCuenta').value,
	}
	let clave = {
		text: document.querySelector('#clave').value,
	}

	//La cuenta bancaria creada con el num de cuenta y su clave de acceso
	let bankAcc={
		num_acc:num_cuenta,
		access_pass:clave
	}
	//Se introduce al json la cuenta bancaria y su pass con la variable bankAcc
	user_json["bankAccs"].push(bankAcc);
	
	let data_wr = JSON.stringify(user_json, null, 2);
	
	try {
		encriptar(user_credentials.name, user_credentials.pass, data_wr);
		alert("Se ha añadido su cuenta bancaria con éxito");
	} catch (error) {
		alert('Fallo añadiendo la cuenta bancaria');
	}
	
	
	ipcRenderer.send('add-bank', user_json);
	window.close();
	ipcRenderer.sendSync('refresh', '');*/

	let num_cuenta = {
		text: document.querySelector('#numCuenta').value,
	}
	let clave = {
		text: document.querySelector('#clave').value,
	}

	//La cuenta bancaria creada con el num de cuenta y su clave de acceso
	let bankAcc={
		num_acc:num_cuenta,
		access_pass:clave
	}

	await ipcRenderer.invoke('add-bank', bankAcc);
	window.close();
	await ipcRenderer.invoke('refresh');

}

document.addEventListener('DOMContentLoaded', init, false);

async function init() {
	document.querySelector('#addButton').addEventListener('click', addBankAccount, false);
}