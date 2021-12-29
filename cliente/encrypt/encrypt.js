const fs = require("fs");
var CryptoJS = require("crypto-js");
const fetch = require("node-fetch");


const url_base = 'http://localhost:5000/2password'
const cabeceras = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

function encriptar(user, password, data) {
    try {

        data = JSON.stringify(data, null, 2);
        let encrypted = CryptoJS.AES.encrypt(data, password);
        fs.writeFileSync(`${__dirname}/../logged_users/${user}.json.enc`, encrypted);

        sendJSONtoServer(user);
    } catch (error) {
        console.log(error);
    }
}

function desencriptar(user) {
    try {
        let encrypted = fs.readFileSync(`${__dirname}/../logged_users/${user.name}.json.enc`).toString();
        var decrypted = CryptoJS.AES.decrypt(encrypted, user.pass);

        console.log(decrypted);
        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.log(error);
    }
}


/**
 * función que se encarga de encriptar el json con el username y la pass
 * @param {*} user 
 * @param {*} password 
 * @param {*} data 
 */
/*function encriptar(user, password, data) {

    let key = CryptoJS.SHA512(password).toString()
    let kfile = key.substring(0, (key.length / 2) - 1);

    let klogin = key.substring(key.length / 2, key.length);
    //let key2 = CryptoJS.SHA256(password).toString();
    console.log(klogin);

    var resizedIV = Buffer.allocUnsafe(16);
    var iv = Crypto.createHash("sha256")
        .update(user)
        .digest();

    iv.copy(resizedIV);


    try {
        var cipher = Crypto.createCipheriv('aes-256-cbc', kfile, resizedIV);
        var encrypted = Buffer.concat([cipher.update(new Buffer(data, "utf8")), cipher.final()]);
        fs.writeFileSync(`${__dirname}/../logged_users/${user}.json.enc`, encrypted);

        //fs.writeFileSync(`${__dirname}/../logged_users/${user}.json.enc`, "hola");

        sendJSONtoServer(user);
    } catch (exception) {
        throw new Error(exception.message);
    }
}*/


/**
 * funcion que descifra el json
 * @param {*} user 
 */
/*function desencriptar(user) {
    let key = CryptoJS.SHA512(user.pass).toString();

    let kfile = key.substring(0, (key.length / 2) - 1);
    let klogin = key.substring(key.length / 2, key.length);

    var resizedIV = Buffer.allocUnsafe(16);
    var iv = Crypto.createHash("sha256")
        .update(user.name)
        .digest();

    iv.copy(resizedIV);

    try {
        var data = fs.readFileSync(`${__dirname}/../logged_users/${user.name}.json.enc`);
        var decipher = Crypto.createDecipheriv("aes-256-cbc", kfile, resizedIV);
        var decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
        return JSON.parse(decrypted);
    } catch (exception) {
        throw new Error(exception.message);
    }
}*/
/*
function encriptar(user, password, data) {


    let key = Crypto.createHash("sha256")
        .update(password)
        .digest();

    //let key2 = CryptoJS.SHA256(password).toString();

    var resizedIV = Buffer.allocUnsafe(16);
    var iv = Crypto.createHash("sha256")
        .update(user)
        .digest();

    iv.copy(resizedIV);

    try {
        var cipher = Crypto.createCipheriv('aes-256-cbc', key, resizedIV);
        var encrypted = Buffer.concat([cipher.update(new Buffer(data, "utf8")), cipher.final()]);
        fs.writeFileSync(`${__dirname}/../logged_users/${user}.json.enc, encrypted`);

        sendJSONtoServer(user);
    } catch (exception) {
        throw new Error(exception.message);
    }
}

function desencriptar(user) {
    let key = Crypto.createHash("sha256")
        .update(user.pass)
        .digest();

    var resizedIV = Buffer.allocUnsafe(16);
    var iv = Crypto.createHash("sha256")
        .update(user.name)
        .digest();

    iv.copy(resizedIV);

    try {
        var data = fs.readFileSync(`${__dirname}/../logged_users/${user.name}.json.enc`);
        var decipher = Crypto.createDecipheriv("aes-256-cbc", key, resizedIV);
        var decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
        return JSON.parse(decrypted);
    } catch (exception) {
        throw new Error(exception.message);
    }
}
*/
/**
 * Función que envía el json cifrado del usuario al servidor
 */
async function sendJSONtoServer(user) {
  // var words = CryptoJS.enc.Base64.parse("SGVsbG8sIFdvcmxkIQ==");
    //var base64 = CryptoJS.enc.Base64.stringify(words);
    console.log('dentro de sendJSON');
    try {
        const url = `${url_base}/upload`;
        const payload = {
            user: user,
            data_json: fs.readFileSync(`${__dirname}/../logged_users/${user}.json.enc`).toString(),
        };
        const request = {
            method: 'POST',
            headers: cabeceras,
            body: JSON.stringify(payload),
        };

        let response = await fetch(url, request);
        let responseAsObject = await response.json();

        if (responseAsObject.error != null) {
            console.log(responseAsObject.error);
        } else {
            console.log(responseAsObject.result);
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Función que descarga el json del servidor
 * @param {*} user 
 */
async function downloadJSONfromServer(user) {
    try {
        const url = `${url_base}/download/${user}`;
        const request = {
            method: 'GET',
            headers: cabeceras,
        };

        let response = await fetch(url, request);
        let responseAsObject = await response.json();

        if (responseAsObject.result != null) {
            let data =  responseAsObject.result;
            fs.writeFileSync(`${__dirname}/../logged_users/${user}.json.enc`, data);
            alert('Fichero descargado');
        } else {
            alert(responseAsObject.error);
        }

    } catch (error) {
        alert(error);
    }
}

module.exports = { encriptar, desencriptar, sendJSONtoServer, downloadJSONfromServer };