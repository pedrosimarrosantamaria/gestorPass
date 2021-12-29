const { ipcRenderer } = require('electron');

async function createAccount() {
	
	let url = document.querySelector('#inputURL4').value;
	let user = document.querySelector('#inputUser4').value;
	let pass = document.querySelector('#inputPassword4').value;
	

	let account = {
		url_account: url,
		user_account: user,
		pass_account: pass
	}

	await ipcRenderer.invoke('add-account', account);
	window.close();
	await ipcRenderer.invoke('refresh');
}

async function generatePass() {
	
	let cuadropass=document.getElementById("inputPassword4");
	var chars = "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOP" + "1234567890" + "@#-!$%^&*()_+|~=`{}[]:";"<>?,./";
	var pass  = "";
	var PL = 10;

	for (var x = 0; x < PL; x++) {
	var i = Math.floor(Math.random() * chars.length);
	pass += chars.charAt(i);
	}

	cuadropass.value=pass;
	
	}

async function init() {
	document.querySelector('#addPass').addEventListener('click', generatePass, false);
	document.querySelector('#addButton').addEventListener('click', createAccount, false);
}

document.addEventListener('DOMContentLoaded', init, false);
 