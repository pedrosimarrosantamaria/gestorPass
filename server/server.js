'use strict';

const express = require('express');
const app = express();
const fs = require("fs");
var CryptoJS = require("crypto-js");
const https = require('https');

// para pasar la contraseña ejecutar el comando así:  npm start estoSeríaLaContrasenya
const pass_server = process.argv[2];

// descomentar esta llamada para crear por primera vez el json que almacena el nombre y la pass de los usuarios
/*cifrar(
  {
    "usuarios_registrados": []
  }
);*/

//////////////////////////////////////////
//
// Funciones para cifrar y descifrar
//
/////////////////////////////////////////

function cifrar(data) {
  try {
    data = JSON.stringify(data, null, 2);
    let encrypted = CryptoJS.AES.encrypt(data, pass_server);
    fs.writeFileSync(__dirname + '/usuarios_registrados.json.enc', encrypted);
  } catch (error) {
    console.log(error);
  }
}

function descifrar() {
  try {
    let encrypted = fs.readFileSync(__dirname + '/usuarios_registrados.json.enc').toString();
    var decrypted = CryptoJS.AES.decrypt(encrypted, pass_server);
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

// Este método es el mismo que el del login y lo usamos para 
// verificar en cada iteración con el servidor que el usuario está logeado
function comprobarUser(req) {

  let bien = false;


  try {
    let usuario_a_comprobar = decodeBase64(req.body.user); // descodificamos de base64
    usuario_a_comprobar = JSON.parse(usuario_a_comprobar);

    usuario_a_comprobar = {
      name: usuario_a_comprobar.name,
      pass: CryptoJS.SHA256(usuario_a_comprobar.klogin).toString() // hash de la pass
    };

    let data = descifrar();

    // filtramos los usuarios con el mismo nombre que el usuario a comprobar
    let usuario = data['usuarios_registrados'].filter(usuario => usuario['name'] == usuario_a_comprobar.name);

    if (usuario.length > 0) {
      // comprobamos si la contraseña es la misma

      if (usuario[0].pass == usuario_a_comprobar.pass) {
        console.log('Login OK');
        bien = true;
        //res.status(200).send({ result: `Login '${usuario_a_comprobar.name}' OK`, error: null });
      } else {
        console.log('Wrong password');
        //res.status(200).send({ result: null, error: `'${usuario_a_comprobar.name}' Wrong password` });
      }
    }
    else {
      console.log('This username not exists');
      //res.status(200).send({ result: null, error: `Username '${usuario_a_comprobar.name}' not exists` });
    }
  } catch (error) {
    console.log(error);
    //res.status(500).send({ result: null, error: error });
  }

  return bien;
}


//////////////////////////////////////////
//
// FIN funciones
//
/////////////////////////////////////////

const url_base = "/2password";

// convierte el cuerpo del mensaje de la petición en JSON al objeto de JavaScript req.body:
app.use(express.json());

// middleware para descodificar caracteres UTF-8 en la URL:
app.use((req, res, next) => {
  req.url = decodeURI(req.url);
  next();
});

// middleware para las cabeceras de CORS:
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST, OPTIONS');
  res.header("Access-Control-Allow-Headers", "content-type");
  next();
});


//////////////////////////////////////////
//
// PETICIONES
//
/////////////////////////////////////////

/**
 * Petición para comprobar si existe el usuario que quiere iniciar sesión
 */
app.post(url_base + '/login', async (req, res) => {

  try {
    let usuario_a_comprobar = decodeBase64(req.body.user); // descodificamos de base64
    usuario_a_comprobar = JSON.parse(usuario_a_comprobar);

    usuario_a_comprobar = {
      name: usuario_a_comprobar.name,
      pass: CryptoJS.SHA256(usuario_a_comprobar.klogin).toString() // hash de la pass
    };

    let data = descifrar();

    // filtramos los usuarios con el mismo nombre que el usuario a comprobar
    let usuario = data['usuarios_registrados'].filter(usuario => usuario['name'] == usuario_a_comprobar.name);

    if (usuario.length > 0) {
      // comprobamos si la contraseña es la misma

      if (usuario[0].pass == usuario_a_comprobar.pass) {
        console.log('Login OK');
        res.status(200).send({ result: `Login '${usuario_a_comprobar.name}' OK`, error: null });
      } else {
        console.log('Wrong password');
        res.status(200).send({ result: null, error: `'${usuario_a_comprobar.name}' Wrong password` });
      }
    }
    else {
      console.log('This username not exists');
      res.status(200).send({ result: null, error: `Username '${usuario_a_comprobar.name}' not exists` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: null, error: error });
  }
});

/**
 * Petición para registrar un usuario
 */
app.post(url_base + '/signup', async (req, res) => {

  try {
    let usuario_a_registrar = decodeBase64(req.body.user); // decodificamos los datos de base64
    usuario_a_registrar = JSON.parse(usuario_a_registrar);
    usuario_a_registrar = {
      name: usuario_a_registrar.name,
      pass: CryptoJS.SHA256(usuario_a_registrar.klogin).toString(), // hash de la pass
      kpublic: usuario_a_registrar.kpublic,
    };

    let data = descifrar();

    // filtramos los usuarios con el mismo nombre que el usuario a registrar
    let usuario = data['usuarios_registrados'].filter(usuario => usuario['name'] == usuario_a_registrar.name);

    if (usuario.length > 0) {
      console.log('Usuario existe');
      res.status(200).send({ result: null, error: `Username '${usuario_a_registrar.name}' already exists` });
    } else {
      // insertamos el usuario en el json
      data['usuarios_registrados'].push(usuario_a_registrar);
      cifrar(data);

      // le creamos la carpeta al usuario
      fs.mkdirSync(path.join(`${__dirname}/users/`, usuario_a_registrar.name), (err) => {
        if (err) {
          return console.error(err);
        }
      });

      console.log(`Username '${usuario_a_registrar.name}' created`);
      res.status(200).send({ result: `Username '${usuario_a_registrar.name}' registered successfully`, error: null });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: null, error: error });
  }
});

/**
 * Petición para subir el fichero al servidor
 */
app.post(url_base + '/upload', async (req, res) => {
  try {

    let existe = comprobarUser(req);
    if (existe) {
      //decodificadmos el usuario
      let user = decodeBase64(req.body.user);
      user = JSON.parse(user);
      // descodificamos el fichero del usuario y lo creamos
      let data = decodeBase64(req.body.data_json);
      fs.writeFileSync(`${__dirname}/users/${user.name}/${user.name}.json.enc`, data);

      // descodificamos el fichero de la clave pública del usuario y lo creamos
      let kPublic = decodeBase64(req.body.kPubFile);
      fs.writeFileSync(`${__dirname}/users/${user.name}/kPublic_${user.name}.txt`, kPublic);

      // descodificamos el fichero de la clave privada del usuario y lo creamos
      let kPriv = decodeBase64(req.body.kPrivFile);
      fs.writeFileSync(`${__dirname}/users/${user.name}/kPriv_${user.name}.txt.enc`, kPriv);

      console.log('ficheros subidos');
      res.status(200).send({ result: `'${user.name}' files uploaded`, error: null });
    } else {
      console.log(error);
      res.status(500).send({ result: null, error: error });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: null, error: error });
  }
});

/**
 * Petición para subir el dataset al servidor
 */
app.post(url_base + '/uptoserverDataset', async (req, res) => {
  try {
    let existe = false;
    existe = comprobarUser(req);
    if (existe) {
      console.log("Usuario verificado correctamente")
      //decodificadmos el usuario
      let user = decodeBase64(req.body.user);
      user = JSON.parse(user);
      // descodificamos los datasets y los subimos
      let datasets = decodeBase64(req.body.datasets);
      fs.writeFileSync(`${__dirname}/datasets/dataset_${req.body.name}.json.enc`, datasets);
      console.log('ficheros subidos');
      res.status(200).send({ result: `'${req.body.name}' dataset uploaded`, error: null });
    }
    else {
      res.status(500).send({ result: null, error: "Usuario incorrecto" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: null, error: error });
  }
});

/**
 * Petición para descargar el fichero del servidor
 */
app.post(url_base + '/download/:user', async (req, res) => {
  try {
    let existe = fs.existsSync(`${__dirname}/users/${req.params.user}/${req.params.user}.json.enc`);
    if (existe) {
      // codificamos en base64 el json del usuario para enviarlo
      let data = encodeToBase64(fs.readFileSync(`${__dirname}/users/${req.params.user}/${req.params.user}.json.enc`).toString());

      // cofificamos en base64 la clave privada del usuario para enviarla
      let kPriv = encodeToBase64(fs.readFileSync(`${__dirname}/users/${req.params.user}/kPriv_${req.params.user}.txt.enc`));

      let kPublic = encodeToBase64(fs.readFileSync(`${__dirname}/users/${req.params.user}/kPublic_${req.params.user}.txt`));

      console.log(`${req.params.user} JSON y KPriv descargados`);
      res.status(200).send({ result: { data: data, kPriv: kPriv, kPublic: kPublic }, error: null });
    } else {
      res.status(404).send({ result: null, error: 'File not exist' });
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({ result: null, error: error });
  }
});

/**
 * Petición para devolver todos los usuarios con su clave pública
 */
app.get(url_base + '/getUsers', async (req, res) => {
  try {
    // desciframos el fichero con todos los usuarios
    let data = descifrar();

    // recorremos el fichero para obtener el nombre de cada usuario y su kpublic
    let usuarios = data['usuarios_registrados'].map(usuario => ({ name: usuario['name'], kpublic: usuario['kpublic'] }));

    res.status(200).send({ result: usuarios, error: null });
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: null, error: error });
  }
})

/**
 * Petición para subir el dataset
 */
app.post(url_base + '/uploadDataset', async (req, res) => {
  try {
    let existe = false;
    existe = comprobarUser(req);
    if (existe) {
      console.log("Usuario verificado correctamente")
      //decodificadmos el usuario
      let user = decodeBase64(req.body.user);
      user = JSON.parse(user);

      // decodificamos los datos recibidos
      let data_dataset = decodeBase64(req.body.dataset);
      let usuarios_passwords = JSON.parse(decodeBase64(req.body.usersAndPasswords));

      // creamos dataset
      fs.writeFileSync(`${__dirname}/datasets/dataset_${req.body.nameDataset}.json.enc`, data_dataset);


      // añadimos los usuarios que comparten el dataset
      let data = JSON.parse(fs.readFileSync(`${__dirname}/datasets_usuarios.json`).toString());
      data['datasets'].push(usuarios_passwords);
      fs.writeFileSync(`${__dirname}/datasets_usuarios.json`, JSON.stringify(data, null, 2));

      res.status(200).send({ result: 'Dataset uploaded successfully', error: null });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: null, error: error });
  }
})

/**
 * Petición para descargar los datasets de un usuario
 */
app.post(url_base + '/downloadDatasets/:user', async (req, res) => {
  try {
    let existe = false;
    existe = comprobarUser(req);
    if (existe) {
      console.log("Usuario verificado correctamente")
      let user = decodeBase64(req.body.user);
      user = JSON.parse(user);

      //let username = req.params.user;

      let data = fs.readFileSync(`${__dirname}/datasets_usuarios.json`).toString();
      data = JSON.parse(data);

      // obtenemos los datasets a lo que pertenece el usuario con la clave random cifrada con su KPublic
      let datasets_user = data['datasets'].map((dataset) => {

        let usuario = dataset['usuarios'].filter(usuario => usuario['name'] == user.name);
        if (usuario.length > 0) {
          return {
            nombreDataset: dataset['nombreDataset'],
            randomPassCifradaConKPublic: usuario.map(elemento => elemento['passRandomCifradaConKpublic'])[0]
          }
        } else {
          return null;
        }
      });

      // filtramos para quitar los nulls porque se puede dar el caso de que un usuario no aparezca en ningún dataset
      datasets_user = datasets_user.filter(elemento => elemento != null);

      // si el usuario tiene datasets, se leen
      if (datasets_user.length > 0) {

        datasets_user = datasets_user.map((dataset) => {
          return {
            nombreDataset: dataset['nombreDataset'],
            randomPassCifradaConKPublic: dataset['randomPassCifradaConKPublic'],
            contenidoDataset: fs.readFileSync(`${__dirname}/datasets/dataset_${dataset['nombreDataset']}.json.enc`).toString()
          };
        })
      }

      res.status(200).send({ result: datasets_user, error: null })

    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: null, error: error });
  }
})


//////////////////////////////////////////
//
// FIN PETICIONES
//
/////////////////////////////////////////

const path = require('path');
const publico = path.join(__dirname, 'public');
// __dirname: directorio del fichero que se está ejecutando

app.use('/', express.static(publico));

const PORT = 5000;
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

/*app.listen(PORT, function () {
  console.log(`Aplicación lanzada en el puerto ${PORT}!`);
});*/

// servidor con HTTPS
https.createServer(options, app).listen(PORT, () => {
  console.log("My HTTPS server listening on port " + PORT + "...");
});