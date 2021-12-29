const { app, BrowserWindow, ipcMain, Notification, ipcRenderer } = require('electron');
const ProgressBar = require('electron-progressbar');
const fs = require("fs");
const fetch = require("node-fetch");
const path = require('path');
var CryptoJS = require("crypto-js");
var keypair = require("keypair");
const { generateKeyPairSync } = require('crypto');
const crypto = require('crypto');


// create a custom timestamp format for log statements
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath: 'mylogfile.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
    },
    log = SimpleNodeLogger.createSimpleLogger(opts);



const url_base = 'https://localhost:5000/2password'
const cabeceras = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}


let win;
let mainUser;
let mainJSON;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })

    win.loadFile('public/login/login.html');
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (mainUser != undefined) {
            log.info(`Log out '${mainUser.name}'`)
        }
        app.quit()
    }
})

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

/**
 * Obtiene el user y el pass del login y busca su json.
 * Carga la vista de la tabla
 */
ipcMain.on('go-user-accounts', (event, arg) => {
    mainUser = {
        name: arg.name,
        pass: arg.pass,
    }
    win.loadFile('public/user_accounts/vista-tabla.html');
})


/**
 * Devuelve los datasets del usuario
 */
ipcMain.handle('give-user-datasets', (event, arg) => {
    let nameDataset;
    let datasets = [];
    fs.readdirSync(`${__dirname}/logged_users/${mainUser.name}/`).forEach(file => {
        if (file.includes("dataset_")) {
            let json = file.split('_')[1];
            nameDataset = json.substr(0, json.indexOf('.'));
            console.log(mainUser)
            let randomPassCifrada = mainUser[`randomPassCifradaConKPublic_dataset_${nameDataset}`];

            console.log('sioiiiiii',randomPassCifrada)
            let randomPassDescifrada = descifrarRandomPassConKPriv(mainUser, randomPassCifrada, mainUser.kPriv);
            let datasetDesencriptado = desencriptarDataset(nameDataset, randomPassDescifrada, mainUser);
            datasets.push(datasetDesencriptado);
        }
    });
    return datasets;
})

/**
 * Devuelve el json del usuario
 */
ipcMain.on('give-user-json', (event, arg) => {
    event.returnValue = desencriptarJsonPersonal(mainUser);
});

/**
 * Va a la vista para añadir una nueva cuenta
 */
ipcMain.on('go-add-account', (event, arg) => {

    // con esta variable vamos a saber en qué dataset estamos en la vista
    mainJSON = arg;
    console.log("Nombre del JSON: " + mainJSON);
    let win = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })
    win.loadFile('public/create_account/vista-add-account.html');
})

/**
 * Va a la vista para añadir una nueva nota
 */
ipcMain.on('go-add-note', (event, arg) => {

    // con esta variable vamos a saber en qué dataset estamos en la vista
    mainJSON = arg;
    console.log(mainJSON);
    let win = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })
    win.loadFile('public/create_note/vista-add-note.html');
})

/**
 * Va a la vista para añadir una nueva cuenta bancaria
 */
ipcMain.on('go-add-bank', (event, arg) => {

    // con esta variable vamos a saber en qué dataset estamos en la vista
    mainJSON = arg;
    console.log(mainJSON);
    let win = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })
    win.loadFile('public/create_bankAcc/vista-add-bankAcc.html');
})

/**
 * Va a la vista para añadir una nueva direccion
 */
ipcMain.on('go-add-adress', (event, arg) => {

    // con esta variable vamos a saber en qué dataset estamos en la vista
    mainJSON = arg;
    console.log(mainJSON);
    let win = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })
    win.loadFile('public/create_adress/vista-add-adress.html');
})


/**
 * Va a la vista de añadir un conjunto distinto de datos
 */
ipcMain.on('go-add-different-dataset', (event, arg) => {

    let win = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })
    win.loadFile('public/create_dataset/vista-add-dataset.html');
})


/**
 * refresca la página
 */
ipcMain.handle('refresh', (event, arg) => {
    win.loadFile('public/user_accounts/vista-tabla.html');
    return;
})

//////////////////////////////////////////////////////////////////////
//
// Funciones para registrar y logear al usuario
//
//////////////////////////////////////////////////////////////////////


function generateKPublicAndKPriv(kFile, nombreUsuario) {
    const { publicKey, privateKey } = generateKeyPairSync('rsa',
        {
            modulusLength: 2048,  // the length of your key in bits   
            publicKeyEncoding: {
                type: 'spki',       // recommended to be 'spki' by the Node.js docs
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',      // recommended to be 'pkcs8' by the Node.js docs
                format: 'pem',
                cipher: 'aes-256-cbc',   // *optional*
                passphrase: kFile // *optional*   
            }
        });

    return { kPublic: publicKey, kPriv: privateKey };
}


function prueba(kFile) {
    // encriptamos
    let texto = "Hola";
    let kpublic = fs.readFileSync(`${__dirname}/logged_users/puta/kPublic_puta.txt`, 'utf8');
    var buffer = new Buffer(texto);
    let encriptado = crypto.publicEncrypt(kpublic, buffer);
    console.log('ENCRIPTADO: ', encriptado.toString('base64'));

    // desencriptamos
    var privateKey = fs.readFileSync(`${__dirname}/logged_users/puta/kPriv_puta.txt.enc`, "utf8");
    var buffer = new Buffer(encriptado, "base64");
    var decrypted = crypto.privateDecrypt({
        key: privateKey,
        passphrase: kFile,
    }, buffer);
    console.log('DESENCRIPTADO: ', decrypted.toString("utf8"));
}


/**
 * Registra al usuario
 */
ipcMain.on('register-user', async (event, arg) => {
    try {
        const progressBar = showProgressBar();

        // generamos el kFile y el kLogin
        let key_hash = hash_keydivision(arg.pass);

        // generamos las claves públicas y privadas con RSA
        let keys = generateKPublicAndKPriv(key_hash.kfile, arg.name);

        // AHORA SE GENERA EL USUARIO CON LOS DATOS GENERADOS EN LAS LINEAS ANTERIORES
        let usuario = {
            name: arg.name,
            klogin: key_hash.klogin,
            kfile: key_hash.kfile,
            kpublic: keys.kPublic
        }

        const url = `${url_base}/signup`;
        const payload = {
            user: encodeToBase64(JSON.stringify(usuario)) // enviamos los datos en base64
        };
        const request = {
            method: 'POST',
            headers: cabeceras,
            body: JSON.stringify(payload),
        };

        log.info(`Sign up '${usuario.name}'... `);

        let response = await fetch(url, request);
        let responseAsObject = await response.json();

        if (responseAsObject.result == null) {
            log.warn(responseAsObject.error);
            showNotification('Fail sign up', responseAsObject.error);
            progressBar.setCompleted();
        } else {
            log.info(responseAsObject.result);

            createJSON(usuario.name, usuario.kfile); // creamos json cifrado en local
            createKPublicAndKPrivFiles(usuario.name, keys.kPublic, keys.kPriv);

            await sendJSONtoServer(usuario); // lo subimos al server

            progressBar.setCompleted();
            showNotification(`Hi '${usuario.name}'`, `You are registered now in 2Password. You can log in whenever you want!`);
        }
    } catch (error) {
        log.error(error);
    }
})

/**
 * Logea al usuario
 */
ipcMain.on('login-user', async (event, arg) => {
    // generamos el kFile y el kLogin
    let key_hash = hash_keydivision(arg.pass);

    mainUser = {
        name: arg.name,
        klogin: key_hash.klogin,
        kfile: key_hash.kfile
    }

    try {
        const url = `${url_base}/login`;
        const payload = {
            user: encodeToBase64(JSON.stringify(mainUser)) // enviamos los datos en base64
        };
        const request = {
            method: 'POST',
            headers: cabeceras,
            body: JSON.stringify(payload)
        };

        log.info(`Login '${mainUser.name}'...`);

        let response = await fetch(url, request);
        let responseAsObject = await response.json();

        if (responseAsObject.result != null) {
            log.info(responseAsObject.result);
            await downloadJSONfromServer(mainUser); // descargamos el JSON personal del usuario y las claves
            await downloadDatasetsFromServer(mainUser); // descaragmos los datasets del usuario
            win.loadFile('public/user_accounts/vista-tabla.html');
        } else {
            log.warn(responseAsObject.error);
            showNotification('Fail login', responseAsObject.error);
        }
    } catch (error) {
        log.error(error);
    }
})

//////////////////////////////////////////////////////////////////////
//
// Funciones para crear JSON, crear ficheros de kpublic y kpriv 
// y de dividir la contraseña en kfile y klogin
//
//////////////////////////////////////////////////////////////////////

/**
 * Funcion que genera el kfile y el klogin a partir de la contraseña
 * @param {*} key 
 * @returns 
 */
function hash_keydivision(key) {

    let contra = CryptoJS.SHA512(key).toString();

    let kfile = contra.substring(0, (contra.length / 2) - 1);
    let klogin = contra.substring(contra.length / 2, contra.length);

    let key_div = {
        klogin: klogin,
        kfile: kfile,
    }

    return key_div;
}

/**
 * Función que crea el json del usuario
 * @param {*} username 
 * @param {*} password 
 */
function createJSON(username, password) {
    let account = {
        name: username,
        accounts: [],
        notes: [],
        bankAccs: [],
        adress: []
    }
    try {
        // creamos la carpeta del usuario
        fs.mkdirSync(path.join(`${__dirname}/logged_users/`, username), (err) => {
            if (err) {
                return console.error(err);
            }
        });
        // encriptamos el fichero del usuario
        encriptar(username, password, account);
    } catch (error) {
        log.error(error);
    }
}

/**
 * Función para generar los ficheros de la clave pública y privada
 * @param {*} username 
 * @param {*} kfile 
 */
function createKPublicAndKPrivFiles(username, publicKey, privateKey) {
    try {
        // creamos el fichero de la clave pública
        fs.writeFileSync(`${__dirname}/logged_users/${username}/kPublic_${username}.txt`, publicKey);
        log.info(`kPublic_${username}.txt file created`);

        // creamos el fichero de la clave privada
        fs.writeFileSync(`${__dirname}/logged_users/${username}/kPriv_${username}.txt.enc`, privateKey);
        log.info(`kPriv_${username}.txt.enc file created`);

    } catch (error) {
        log.error(error);
        console.log(error);
    }
}

//////////////////////////////////////////////////////////////////////
//
// Funciones para obtener todos los usuarios
//
//////////////////////////////////////////////////////////////////////

/**
 * Devuelve todos los usuarios con sus claves públicas
 */
ipcMain.handle('get-users', async (event, arg) => {
    try {
        const url = `${url_base}/getUsers`;
        const request = {
            method: 'GET',
            headers: cabeceras,
        };

        log.info(`Getting users from servers... `);

        let response = await fetch(url, request);
        let responseAsObject = await response.json();

        if (responseAsObject.result == null) {
            log.warn(responseAsObject.error);
            showNotification('Fail getting users', responseAsObject.error);
        } else {
            log.info('Getting users OK');
            return responseAsObject.result;
        }
    } catch (error) {
        log.error(error);
    }
})

//////////////////////////////////////////////////////////////////////
//
// Funciones para añadir,editar y borrrar cuentas, notas, etc
//
//////////////////////////////////////////////////////////////////////

ipcMain.handle('add-account', async (event, arg) => {

    let json;
    if (mainJSON == 'personal_json') {
        json = desencriptarJsonPersonal(mainUser);
        json["accounts"].push(arg);
        encriptar(mainUser.name, mainUser.kfile, json);
        log.info(`'${mainUser.name}' added an account successfully`);
        showNotification('Added account', 'Your account was added successfully');
        sendJSONtoServer(mainUser);
    } else {
        let nameDataset = mainJSON.split('_')[1];
        let randomPassCifrada = mainUser[`randomPassCifradaConKPublic_dataset_${nameDataset}`];
        let passDescifrada = descifrarRandomPassConKPriv(mainUser, randomPassCifrada, mainUser.kPriv);
        json = desencriptarDataset(nameDataset, passDescifrada, mainUser);
        json["accounts"].push(arg);
        encriptar(nameDataset, passDescifrada, json, true);
        log.info(`'${mainUser.name}' added an account successfully to ${nameDataset}`);
        showNotification('Added account', 'Your account was added successfully');
        sendDatasetsToServer(mainUser, nameDataset);
    }

    return true;
})

ipcMain.handle('edit-account', async (event, arg) => {
    encriptar(mainUser.name, mainUser.kfile, arg);
    log.info(`'${mainUser.name}' edited an account successfully`);
    showNotification('Edited account', 'Your account was edited successfully');
    sendJSONtoServer(mainUser);
})

ipcMain.handle('delete-account', async (event, arg) => {
    if (arg.name == mainUser.name) {
        encriptar(mainUser.name, mainUser.kfile, arg);
        log.info(`'${mainUser.name}' deleted an account successfully`);
        showNotification('Deleted account', 'Your account was deleted successfully');
        sendJSONtoServer(mainUser);
    } else {
        let randomPassCifrada = mainUser[`randomPassCifradaConKPublic_dataset_${arg.name}`];
        let passDescifrada = descifrarRandomPassConKPriv(mainUser, randomPassCifrada, mainUser.kPriv);
        encriptar(arg, passDescifrada, arg, true);
        log.info(`'${mainUser.name}' deleted an account successfully to ${arg.name}`);
        showNotification('Deleted accountttt', 'Your account was deleted successfully');
        sendDatasetsToServer(mainUser, arg.name);
    }
})

ipcMain.handle('add-note', async (event, arg) => {
    let json;
    if (mainJSON == 'personal_json') {
        json = desencriptarJsonPersonal(mainUser);
        json["notes"].push(arg);

        encriptar(mainUser.name, mainUser.kfile, json);
        log.info(`'${mainUser.name}' added a note successfully`);
        showNotification('Added note', 'Your note was added successfully');
        sendJSONtoServer(mainUser);
    } else {
        let nameDataset = mainJSON.split('_')[1];
        let randomPassCifrada = mainUser[`randomPassCifradaConKPublic_dataset_${nameDataset}`];
        let passDescifrada = descifrarRandomPassConKPriv(mainUser, randomPassCifrada, mainUser.kPriv);
        json = desencriptarDataset(nameDataset, passDescifrada, mainUser);
        json["notes"].push(arg);
        encriptar(nameDataset, passDescifrada, json, true);
        log.info(`'${mainUser.name}' added a note successfully to ${nameDataset}`);
        showNotification('Added note', 'Your note was added successfully');
        sendDatasetsToServer(mainUser, nameDataset);
    }

    return true;
})

ipcMain.handle('delete-note', async (event, arg) => {
    encriptar(mainUser.name, mainUser.kfile, arg);
    log.info(`'${mainUser.name}' deleted a note successfully`);
    showNotification('Deleted note', 'Your note was deleted successfully');
    sendJSONtoServer(mainUser);
})

ipcMain.handle('edit-note', async (event, arg) => {
    encriptar(mainUser.name, mainUser.kfile, arg);
    log.info(`'${mainUser.name}' edited a note successfully`);
    showNotification('Edited note', 'Your note was edited successfully');
    sendJSONtoServer(mainUser);
})


ipcMain.handle('add-bank', async (event, arg) => {

    let json;
    if (mainJSON == 'personal_json') {
        json = desencriptarJsonPersonal(mainUser);
        json["bankAccs"].push(arg);

        encriptar(mainUser.name, mainUser.kfile, json);
        log.info(`'${mainUser.name}' added a bank account successfully`);
        showNotification('Added bank account', 'Your bank account was added successfully');
        sendJSONtoServer(mainUser);
    } else {
        let nameDataset = mainJSON.split('_')[1];
        let randomPassCifrada = mainUser[`randomPassCifradaConKPublic_dataset_${nameDataset}`];
        let passDescifrada = descifrarRandomPassConKPriv(mainUser, randomPassCifrada, mainUser.kPriv);
        json = desencriptarDataset(nameDataset, passDescifrada, mainUser);
        json["bankAccs"].push(arg);
        encriptar(nameDataset, passDescifrada, json, true);
        log.info(`'${mainUser.name}' added a bank account successfully to ${nameDataset}`);
        showNotification('Added bank account', 'Your bank account was added successfully');
        sendDatasetsToServer(mainUser, nameDataset);
    }

    return true;

})

ipcMain.handle('add-adress', async (event, arg) => {
    /*
    encriptar(mainUser.name, mainUser.kfile, arg);
    log.info(`'${mainUser.name}' added a adress successfully`);
    showNotification('Added adress', 'Your adress was added successfully');
    sendJSONtoServer(mainUser.name);*/
    let json;
    if (mainJSON == 'personal_json') {
        json = desencriptarJsonPersonal(mainUser);
        console.log("es una direccion: " + arg);
        json["adress"].push(arg);

        encriptar(mainUser.name, mainUser.kfile, json);
        log.info(`'${mainUser.name}' added an adress successfully`);
        showNotification('Added adress', 'Your adress was added successfully');
        sendJSONtoServer(mainUser);
    } else {
        let nameDataset = mainJSON.split('_')[1];
        let randomPassCifrada = mainUser[`randomPassCifradaConKPublic_dataset_${nameDataset}`];
        let passDescifrada = descifrarRandomPassConKPriv(mainUser, randomPassCifrada, mainUser.kPriv);
        json = desencriptarDataset(nameDataset, passDescifrada, mainUser);
        json["adress"].push(arg);
        encriptar(nameDataset, passDescifrada, json, true);
        log.info(`'${mainUser.name}' added an adress successfully to ${nameDataset}`);
        showNotification('Added adress', 'Your adress was added successfully');
        sendDatasetsToServer(mainUser, nameDataset);
    }

    return true;
})


//////////////////////////////////////////////////////////////////////
//
// Funciones para encriptar y desencriptar el fichero
//
//////////////////////////////////////////////////////////////////////

function encriptar(username, password, data, dataset = false) {
    try {
        data = JSON.stringify(data, null, 2);

        let iv = CryptoJS.SHA256(username).toString();
        let encrypted = CryptoJS.AES.encrypt(data, password, { iv: iv });

        let dataset_name = (dataset) ? 'dataset_' : '';
        let nombre = (dataset) ? mainUser.name : username;

        // creamos el fichero encriptado
        fs.writeFileSync(`${__dirname}/logged_users/${nombre}/${dataset_name}${username}.json.enc`, encrypted);

        log.info(`${dataset_name}${username}.json.enc file created`);
    } catch (error) {
        log.error(error);
        console.log(error);
    }
}

function desencriptarJsonPersonal(user) {
    try {
        let iv = CryptoJS.SHA256(user.name).toString();
        let encrypted = fs.readFileSync(`${__dirname}/logged_users/${user.name}/${user.name}.json.enc`).toString();
        var decrypted = CryptoJS.AES.decrypt(encrypted, user.kfile, { iv: iv });
        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.log(error);
    }
}

//////////////////////////////////////////////////////////////////////
//
// Funciones para codificar y descodificar base64
//
//////////////////////////////////////////////////////////////////////

function encodeToBase64(text) {
    const encodedWord = CryptoJS.enc.Utf8.parse(text); // convertimos el texto a wordArray
    const encoded = CryptoJS.enc.Base64.stringify(encodedWord); // codificamos a base64
    return encoded;
}

function decodeBase64(encoded) {
    const encodedWord = CryptoJS.enc.Base64.parse(encoded); // encodedWord via Base64.parse()
    const decoded = CryptoJS.enc.Utf8.stringify(encodedWord); // decode encodedWord via Utf8.stringify()
    return decoded;
}

//////////////////////////////////////////////////////////////////////
//
// Funciones para subir y descargar el fichero
//
//////////////////////////////////////////////////////////////////////


/**
 * Función que envía el json cifrado del usuario al servidor
 */
async function sendJSONtoServer(user) {
    try {

        const url = `${url_base}/upload`;
        const payload = {
            user: encodeToBase64(JSON.stringify(user)),
            data_json: encodeToBase64(fs.readFileSync(`${__dirname}/logged_users/${user.name}/${user.name}.json.enc`).toString()), // enviamos los datos en base64
            kPrivFile: encodeToBase64(fs.readFileSync(`${__dirname}/logged_users/${user.name}/kPriv_${user.name}.txt.enc`, 'utf8')),
            kPubFile: encodeToBase64(fs.readFileSync(`${__dirname}/logged_users/${user.name}/kPublic_${user.name}.txt`, 'utf8'))
        };
        const request = {
            method: 'POST',
            headers: cabeceras,
            body: JSON.stringify(payload),
        };

        log.info(`Uploading '${user.name}' file to server...`);

        let response = await fetch(url, request);
        let responseAsObject = await response.json();
        if (responseAsObject.error != null) {
            log.error(responseAsObject.error);
        } else {
            log.info(responseAsObject.result);
        }

    } catch (error) {
        log.error(error);
    }
}

/**
 * Función que descarga el json del servidor
 * @param {*} user 
 */
async function downloadJSONfromServer(user) {
    try {
        const url = `${url_base}/download/${user.name}`;
        const payload = {
            user: encodeToBase64(JSON.stringify(user)),
        }
        const request = {
            method: 'POST',
            headers: cabeceras,
            body: JSON.stringify(payload),
        };

        log.info(`'${user.name}' file downloading from server...`);

        let response = await fetch(url, request);

        let responseAsObject = await response.json();


        if (responseAsObject.result != null) {
            log.info(`'${user}' KPriv file, KPublic file and JSON file downloaded`);

            // decodificamos los datos del usuario del servidor que vienen en base64 y lo creamos
            let data = decodeBase64(responseAsObject.result.data);
            fs.writeFileSync(`${__dirname}/logged_users/${user.name}/${user.name}.json.enc`, data);

            // decodificamos la clave privada del usuario recibida por el servidor
            let kPriv = decodeBase64(responseAsObject.result.kPriv);
            fs.writeFileSync(`${__dirname}/logged_users/${user.name}/kPriv_${user.name}.txt.enc`, kPriv);
            mainUser['kPriv'] = kPriv;

            // descodificamos la clave pública del usuario recibida por el servidor
            let kPublic = decodeBase64(responseAsObject.result.kPublic);
            fs.writeFileSync(`${__dirname}/logged_users/${user.name}/kPublic_${user.name}.txt`, kPublic);
            mainUser['kPublic'] = kPublic;

            showNotification('Files downloaded from server', 'Check if your file has been downloaded, if not try again');
        } else {
            log.warn(responseAsObject.error);
        }

    } catch (error) {
        log.error(error);
    }
}

//////////////////////////////////////////////////////////////////////
//
// Funciones para el JSON compartido con varios usuarios
//
//////////////////////////////////////////////////////////////////////

/**
 * Función que cifra la pass random con la kPublic
 * @param {*} user 
 * @returns 
 */
function cifrarRandomPassConKPublic(user, passRandom, kPublic) {
    var buffer = new Buffer(passRandom);
    let encriptado = crypto.publicEncrypt(kPublic, buffer);
    return encriptado.toString('base64');
}

/**
 * Función que descifra la pass random con la kPublic
 * @param {*} user 
 * @returns 
 */
function descifrarRandomPassConKPriv(user, passRandomCifrada, kPriv) {
    // desencriptamos

    
    var buffer = new Buffer(passRandomCifrada, "base64");
    var decrypted = crypto.privateDecrypt({
        key: kPriv,
        passphrase: mainUser.kfile,
    }, buffer);

    return decrypted.toString('utf8');
}

/**
 * Función que desencripta el dataset
 * @param {*} nombreDataset 
 * @param {*} contraseñarandom 
 * @param {*} user 
 * @returns 
 */
function desencriptarDataset(nombreDataset, contraseñarandom, user) {
    try {
        let iv = CryptoJS.SHA256(user.name).toString();
        let encrypted = fs.readFileSync(`${__dirname}/logged_users/${user.name}/dataset_${nombreDataset}.json.enc`).toString();
        var decrypted = CryptoJS.AES.decrypt(encrypted, contraseñarandom, { iv: iv });

        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.log(error);
    }
}

/**
 * Función que crea el JSON compartido
 * @param {*} datasetname 
 * @param {*} randomPassword 
 */
function createSharedJSON(datasetname, randomPassword) {
    let account = {
        creador: mainUser.name,
        name: datasetname,
        accounts: [],
        notes: [],
        bankAccs: [],
        adress: []
    }
    try {
        // encriptamos el fichero
        encriptar(datasetname, randomPassword, account, true);
    } catch (error) {
        log.error(error);
    }
}

/**
 * Función que crea el el objeto con el nombre del dataset y los usuarios con sus pass 
 * que lo comparten 
 * @param {*} nombre 
 * @param {*} usuarios 
 * @param {*} password 
 */
function createSharedUsersAndPasswords(nombre, usuarios, password) {
    // recorremos los usuarios para cifrar la pass random con la kPublic
    const usuariosConRandomPassCifradaConKPublic = usuarios.map(usuario => (
        {
            name: usuario.name,
            passRandomCifradaConKpublic: cifrarRandomPassConKPublic(usuario.name, password, usuario.kpublic)
        }
    ));

    let data = {
        nombreDataset: nombre,
        usuarios: usuariosConRandomPassCifradaConKPublic
    }

    // le añadimos al usuario que está logeado la contraseña random cifrada con KPublic para que al refrescar la vista no pete
    let usuario_logeado = usuariosConRandomPassCifradaConKPublic.filter(usuario => usuario['name'] == mainUser.name)[0];
    mainUser[`randomPassCifradaConKPublic_dataset_${nombre}`] = usuario_logeado.passRandomCifradaConKpublic;

    return data;
}

ipcMain.handle('create-dataset', async (event, arg) => {
    try {
        // generamos password random
        var randomPassword = Math.random().toString(36).slice(-8);

        // creamos el fichero compartido
        createSharedJSON(arg.nombre, randomPassword);

        // obtenemos el objeto con la contraseña random encriptada por las kPublic de cada usuario
        let usersAndPasswords = createSharedUsersAndPasswords(arg.nombre, arg.usuarios, randomPassword);

        // hacemos la petición para subir el dataset
        const url = `${url_base}/uploadDataset`;
        const payload = {
            user: encodeToBase64(JSON.stringify(mainUser)),
            nameDataset: arg.nombre,
            dataset: encodeToBase64(fs.readFileSync(`${__dirname}/logged_users/${mainUser.name}/dataset_${arg.nombre}.json.enc`).toString()),
            usersAndPasswords: encodeToBase64(JSON.stringify(usersAndPasswords))
        };
        const request = {
            method: 'POST',
            headers: cabeceras,
            body: JSON.stringify(payload),
        };

        log.info(`Uploading dataset ${arg.nombre} from '${mainUser.name}' to server...`);

        let response = await fetch(url, request);
        let responseAsObject = await response.json();

        if (responseAsObject.result != null) {
            log.info(responseAsObject.result);
        } else {
            log.error(responseAsObject.error);
        }
        return true;


    } catch (error) {
        log.error(error);
    }
})


/**
 * Función que descarga los datasets del servidor
 * @param {*} user 
 */
async function downloadDatasetsFromServer(user) {
    try {
        const url = `${url_base}/downloadDatasets/${user}`;
        const payload = {
            user: encodeToBase64(JSON.stringify(user)),
        }
        const request = {
            method: 'POST',
            headers: cabeceras,
            body: JSON.stringify(payload),
        };

        log.info(`'${user.name}' datasets downloading from server...`);

        let response = await fetch(url, request);
        let responseAsObject = await response.json();

        if (responseAsObject.result != null && responseAsObject.result.length > 0) {

            // creamos los datasets en local y al objetivo del usuario principal le añadimos las contraseñas random cifradas con KPublic
            responseAsObject.result.forEach(element => {
                fs.writeFileSync(`${__dirname}/logged_users/${user.name}/dataset_${element['nombreDataset']}.json.enc`, element['contenidoDataset']);
                mainUser[`randomPassCifradaConKPublic_dataset_${element['nombreDataset']}`] = element['randomPassCifradaConKPublic'];
            });

            log.info(`'${user.name}' datasets downloaded`);

        } else if (responseAsObject.error != null) {
            log.warn(responseAsObject.error);
        } else {
            log.info(`'${user.name}' has not datasets`);
        }

    } catch (error) {
        log.error(error);
    }
}

async function sendDatasetsToServer(user, datasetname) {
    try {
        const url = `${url_base}/uptoserverDataset`;
        const payload = {
            user: encodeToBase64(JSON.stringify(user)),
            name: datasetname,
            datasets: encodeToBase64(fs.readFileSync(`${__dirname}/logged_users/${user.name}/dataset_${datasetname}.json.enc`).toString())
        }

        const request = {
            method: 'POST',
            headers: cabeceras,
            body: JSON.stringify(payload),
        };

        log.info(`Uploading '${user}' datasets to server...`);

        let response = await fetch(url, request);
        let responseAsObject = await response.json();
        if (responseAsObject.error != null) {
            log.error(responseAsObject.error);
        } else {
            log.info(responseAsObject.result);
        }

    } catch (error) {
        log.error(error);
    }
}


//////////////////////////////////////////////////////////////////////
//
// Otras funciones
//
//////////////////////////////////////////////////////////////////////

function showProgressBar() {
    const progressBar = new ProgressBar({
        text: 'Sign up...',
        detail: 'Wait...',
        title: 'Sign up...'
    });

    progressBar
        .on('completed', function () {
            console.info(`completed...`);
            progressBar.detail = 'Sign up completed. Exiting...';
        })
        .on('aborted', function () {
            console.info(`aborted...`);
        });

    return progressBar;
}

/**
 * Función para mostrar una notificación
 * @param {*} title 
 * @param {*} body 
 */
function showNotification(title, body) {
    const notification = {
        title: title,
        body: body
    }
    new Notification(notification).show()
}