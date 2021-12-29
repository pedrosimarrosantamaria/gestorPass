const { ipcRenderer, BrowserWindowProxy } = require('electron');

async function createNote() {
	let nota = {
		text: document.querySelector('#Textarea1').value,
	}

	await ipcRenderer.invoke('add-note', nota);
	window.close();
	await ipcRenderer.invoke('refresh');
}

async function init() {
	document.querySelector('#addButton').addEventListener('click', createNote, false);
}

document.addEventListener('DOMContentLoaded', init, false);
