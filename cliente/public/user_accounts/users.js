"use strict";

const { app, ipcRenderer, ipcMain } = require("electron");


function esquema(index, dataset, dataset_json, creador) {
  if (!dataset) {
    index.innerHTML += `  <div class="container user_accounts">
  
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button id="personal_json" data-toggle="tooltip" title="Add accounts to your user" class="btn btn-primary me-md-2"
        style="margin: 10px 10px 10px 0px" ; onclick="createAccount(id)" type="button">
        Add account
      </button>
    </div>
  
    <h4 class="display-8"> <i class="fas fa-user-circle"></i> My accounts</h4>
    <table class="table table-sm table-striped">
      <thead class="table-dark table-borderless">
        <tr>
          <th scope="col"><i class="fas fa-sort-numeric-down"></i></th>
          <th scope="col"><i id="iconTR" class="fas fa-globe-americas"></i>Url</th>
          <th scope="col"><i id="iconTR" class="fas fa-user"></i>User</th>
          <th scope="col"><i id="iconTR" class="fas fa-key"></i>Password</th>
          <th style="text-align: center" scope="col"><i id="iconTR" class="fas fa-user-edit"></i>Actions</th>
        </tr>
  
      </thead>
  
      <tbody id="user_table">
      </tbody>
  
    </table>
    <p id="info" class="lead"></p>
  </div>
  
  <div class="container user_notes">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button id="personal_json" data-toggle="tooltip" title="Add notes to your user" class="btn btn-primary me-md-2"
        style="margin: 10px 20px 10px 0px" ; onclick="createNote(id)" type="button">
        Add note
      </button>
    </div>
    <h4 class="display-8"> <i class="fas fa-sticky-note"></i> My notes </h4>
    <p id="info2" class="lead"></p>
    <div id="note_card"></div>
  </div>
  
  <div class="container user_bank">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button id="personal_json" data-toggle="tooltip" title="Add bank accounts to your user" class="btn btn-primary me-md-2"
        style="margin: 10px 20px 10px 0px" ; onclick="createBank(id)" type="button">
        Add bank account
      </button>
    </div>
    <h4 class="display-8"> <i class="fas fa-university"></i> My bank accounts</h4>
    <p id="info3" class="lead"></p>
    <div id="bank_card"></div>
  </div>
  
  <div class="container user_adress">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button id="personal_json" data-toggle="tooltip" title="Add adresses to your user" class="btn btn-primary me-md-2"
        style="margin: 10px 20px 10px 0px" ; onclick="createAdress(id)" type="button">
        Add adress
      </button>
    </div>
    <h4 class="display-8"> <i class="fas fa-map-marker-alt"></i> My adressses</h4>
    <p id="info4" class="lead"></p>
    <div id="adress_card"></div>
  </div>
    `
  } else {
    console.log("-------------------");
    console.log(dataset_json);
    console.log("-------------------");
    index.innerHTML += `  <div id="containerNoAdmin" class="container user_accounts">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button id="dataset_${dataset_json.name}" data-toggle="tooltip" title="Add accounts to your user" class="btn btn-primary me-md-2"
        style="margin: 10px 10px 10px 0px" ; onclick="createAccount(id)" type="button">
        Add account
      </button>
    </div>
  
    <h4 class="display-8"> <i class="fas fa-user-circle"></i> My accounts</h4>
    <table class="table table-sm table-striped">
      <thead class="table-dark table-borderless">
        <tr>
          <th scope="col"><i class="fas fa-sort-numeric-down"></i></th>
          <th scope="col"><i id="iconTR" class="fas fa-globe-americas"></i>Url</th>
          <th scope="col"><i id="iconTR" class="fas fa-user"></i>User</th>
          <th scope="col"><i id="iconTR" class="fas fa-key"></i>Password</th>
          <th style="text-align: center" scope="col"><i id="iconTR" class="fas fa-user-edit"></i>Actions</th>
        </tr>
  
      </thead>
  
      <tbody id="user_table_dataset${dataset_json.name}">
      </tbody>
  
    </table>
    <p id="info_dataset_${dataset_json.name}" class="lead"></p>
  </div>
  
  <div id="containerNoAdmin" class="container user_notes">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button id="dataset_${dataset_json.name}" data-toggle="tooltip" title="Add notes to your user" class="btn btn-primary me-md-2"
        style="margin: 10px 20px 10px 0px" ; onclick="createNote(id)" type="button">
        Add note
      </button>
    </div>
    <h4 class="display-8"> <i class="fas fa-sticky-note"></i> My notes </h4>
    <p id="info2_dataset_${dataset_json.name}" class="lead"></p>
    <div id="note_card_dataset_${dataset_json.name}"></div>
  </div>
  
  <div id="containerNoAdmin" class="container user_bank">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button id="dataset_${dataset_json.name}" data-toggle="tooltip" title="Add bank accounts to your user" class="btn btn-primary me-md-2"
        style="margin: 10px 20px 10px 0px" ; onclick="createBank(id)" type="button">
        Add bank account
      </button>
    </div>
    <h4 class="display-8"> <i class="fas fa-university"></i> My bank accounts</h4>
    <p id="info3_dataset_${dataset_json.name}" class="lead"></p>
    <div id="bank_card_dataset_${dataset_json.name}"></div>
  </div>
  
  <div id="containerNoAdmin" class="container user_adress">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button id="dataset_${dataset_json.name}" data-toggle="tooltip" title="Add adresses to your user" class="btn btn-primary me-md-2"
        style="margin: 10px 20px 10px 0px" ; onclick="createAdress(id)" type="button">
        Add adress
      </button>
    </div>
    <h4 class="display-8"> <i class="fas fa-map-marker-alt"></i> My adressses</h4>
    <p id="info4_dataset_${dataset_json.name}" class="lead"></p>
    <div id="adress_card_dataset_${dataset_json.name}"></div>
  </div>
    `;

    /*
    if (!document.getElementById("titulo").textContent.includes(dataset_json.creador)) {

      console.log('no es el creador');
      // ocultar los botones cuando no es el creador
    }*/

    // En caso de que el dataset no sea propiedad del usuario que está logeado
    if(!creador) {
      var buttons = document.querySelectorAll(`#dataset_${dataset_json.name}`);
      // Se ocultan los botones de añadir cuentas, notas, cuentas bancarias y direcciones. 
      for(var i = 0; i<buttons.length; i++) {
        if (buttons[i].style.display === "none") {
          buttons[i].style.display = "block";
        } else {
          buttons[i].style.display = "none";
        }
      }

      // Se añade margen para el hueco que ha dejado la vista sin los botones anteriores. 
      var containers = document.querySelectorAll("#containerNoAdmin");
      for(var i=0; i<containers.length; i++) {
        containers[i].setAttribute("style", "margin-top: 60px");
      }

    } 
  }

}

function userJson(user_json) {
  // Personalizamos la ventana y el título de la página con el nombre del usuario. 
  document.querySelector("title").innerHTML += user_json.name;
  document.getElementById("titulo").innerHTML += user_json.name;

  // JSON PERSONAL
  // Se comprueba que haya al menos un usuario en su fichero JSON y se rellena la tabla con la correspondiente información.
  let tabla = document.getElementById("user_table");
  if (user_json.accounts.length == 0) {
    document.getElementById(
      "info"
    ).innerHTML += ` You don't have any associated account. Click on the "Add account" button to create one. `;
  } else {
    for (let i = 0; i < user_json.accounts.length; i++) {
      tabla.innerHTML += `
      <tr>
          <th id="contentTable"scope="row">${i + 1}</th>
          <td id="contentTable">${user_json.accounts[i].url_account}</td>
          <td id="contentTable">${user_json.accounts[i].user_account}</td>
          <td id="contentTable">
            <div style="padding-top: 15px" class="input-group input-group-sm mb-3">
              <input id="passwordInput" disabled="true" name="viewPass" type="password" class="form-control pwd" value="${user_json.accounts[i].pass_account}">
              <div class="input-group-append inputGroup-sizing-sm">
               <button id="passwordEditCheck" disabled="true" class="btn btn-sm btn-secondary" type="button"><i class="fas fa-check"></i></button>
              </div>
            </div>
          </td> 
          <td id="contentTable" class="actions">
              <button name="dynamic" id="buttonShow" type="button"  class="btn btn-sm btn-primary" data-toggle="tooltip" title="Show or hide password"><i class="fa fa-eye-slash"></i></button>
              <button name="edit" id="buttonEdit" type="button"  class="btn btn-sm btn-success" data-toggle="tooltip" title="Edit password"><i class="fas fa-edit"></i></button>
              <button name="remove" id="buttonRemove" type="button"  class="btn btn-sm btn-danger" data-toggle="tooltip" title="Delete account"><i class="fas fa-trash"></i></button>
          </td>
      </tr>`;
    }
  }

  // Se comprueba que hay notas y se muestran
  if (user_json.notes.length == 0) {
    document.getElementById(
      "info2"
    ).innerHTML += ` You don't have any associated note. Click on the "Add note" button to create one. `;
  } else {
    let nota = document.getElementById("note_card");
    for (let i = 0; i < user_json.notes.length; i++) {
      nota.innerHTML += `
      <div id="nota" class="card">
        <div id="note_body" class="card-body">

          <div class="row justify-content-between">
            <div class="col-2">
              <h5 id="note_title" class="card-title">Nota ${i + 1}</h5> 
            </div>
            <div class="justify-content-end" id="actionsNote" class="col-2">
              <button name="editNote" id="buttonEdit" type="button" class="btn btn-sm btn-success" data-toggle="tooltip" title="Edit password"><i class="fas fa-edit"></i></button>
              <button name="removeNote" id="buttonRemove" type="button" class="btn btn-sm btn-danger" data-toggle="tooltip" title="Delete account"><i class="fas fa-trash"></i></button>
            </div>
          </div>
            <textarea class="form-control" id="noteInput" rows="2">${user_json.notes[i].text}</textarea>
          </div>
      </div>
      `;
    }
  }

  // Se comprueba que hayan cuentas bancarias y se muestran
  if (user_json.bankAccs.length == 0) {
    document.getElementById(
      "info3"
    ).innerHTML += ` You don't have any associated bank account. Click on the "Add bank account" button to create one. `;
  } else {
    let bank = document.getElementById("bank_card");
    for (let i = 0; i < user_json.bankAccs.length; i++) {
      bank.innerHTML += `
      <div id="bank" class="card">
        <div id="bank_body" class="card-body">
          <h5 id="bank_title" class="card-title">Bank account ${i + 1}</h5>
          Number: ${user_json.bankAccs[i].num_acc.text} </br>
          Key: ${user_json.bankAccs[i].access_pass.text}
        </div>
      </div>
      `;
    }
  }

  // Se comprueba que hayan direcciones y se muestran
  if (user_json.adress.length == 0) {
    document.getElementById(
      "info4"
    ).innerHTML += ` You don't have any associated adresses. Click on the "Add adress" button to create one. `;
  } else {
    let adress = document.getElementById("adress_card");
    for (let i = 0; i < user_json.adress.length; i++) {
      adress.innerHTML += `
      <div id="adress" class="card">
        <div id="adress_body" class="card-body">
          <h5 id="adress_title" class="card-title">Adress ${i + 1}</h5>
           ${user_json.adress[i].text}
           </div>
           </div>
           `;
    }
  }

}

function userDatasets(dataset, creador) {

  // Se comprueba que haya al menos un usuario y se rellena la tabla con la correspondiente información del JSON.
  let tabla = document.getElementById(`user_table_dataset${dataset.name}`);
  if (dataset.accounts.length == 0) {
    document.getElementById(
      `info_dataset_${dataset.name}`
    ).innerHTML += ` You don't have any associated account. Click on the "Add account" button to create one. `;
  } else {
    console.log(dataset.accounts);
    for (let i = 0; i < dataset.accounts.length; i++) {
      tabla.innerHTML += `
      <tr>
          <th id="contentTable"scope="row">${i + 1}</th>
          <td id="contentTable">${dataset.accounts[i].url_account}</td>
          <td id="contentTable">${dataset.accounts[i].user_account}</td>
          <td id="contentTable">
            <div style="padding-top: 15px" class="input-group input-group-sm mb-3">
              <input id="passwordInput" disabled="true" name="viewPass" type="password" class="form-control pwd" value="${dataset.accounts[i].pass_account
        }">
              <div class="input-group-append inputGroup-sizing-sm">
               <button id="passwordEditCheck" disabled="true" class="btn btn-sm btn-secondary" type="button"><i class="fas fa-check"></i></button>
              </div>
            </div>
          </td> 
          <td id="contentTable" class="actions">
              <button name="dynamic" id="buttonShow" type="button" onClick="showPass()" class="btn btn-sm btn-primary" data-toggle="tooltip" title="Show or hide password"><i class="fa fa-eye-slash"></i></button>
              <button name="edit" id="buttonEdit" type="button" onClick="editPass()" class="btn btn-sm btn-success" data-toggle="tooltip" title="Edit password"><i class="fas fa-edit"></i></button>
              <button name="remove" id="buttonRemove" type="button" onClick="removeAccount()" class="btn btn-sm btn-danger" data-toggle="tooltip" title="Delete account"><i class="fas fa-trash"></i></button>
          </td>
      </tr>`;
    }
  }

  // Se comprueba que haya notas y se muestran
  if (dataset.notes.length == 0) {
    document.getElementById(
      `info2_dataset_${dataset.name}`
    ).innerHTML += ` You don't have any associated note. Click on the "Add note" button to create one. `;
  } else {
    let nota = document.getElementById(`note_card_dataset_${dataset.name}`);
    for (let i = 0; i < dataset.notes.length; i++) {
      nota.innerHTML += `
      <div id="nota" class="card">
        <div id="note_body" class="card-body">
        <div class="row justify-content-between">
        <div class="col-2">
          <h5 id="note_title" class="card-title">Nota ${i + 1}</h5> 
        </div>
        <div id="actionsNote" class="col-12">
          <button name="editNote" id="buttonEditNote" type="button" onClick="editPass()" class="btn btn-sm btn-success" data-toggle="tooltip" title="Edit password"><i class="fas fa-edit"></i></button>
          <button name="removeNote" id="buttonRemoveNote" type="button"  class="btn btn-sm btn-danger" data-toggle="tooltip" title="Delete account"><i class="fas fa-trash"></i></button>
        </div>
      </div>
        <textarea class="form-control" id="noteInput" rows="2">${dataset.notes[i].text}</textarea>
        </div>
      </div>
      `;
    }
  }

  // Se comprueba que hayan cuentas bancarias y se muestran
  if (dataset.bankAccs.length == 0) {
    document.getElementById(
      `info3_dataset_${dataset.name}`
    ).innerHTML += ` You don't have any associated bank account. Click on the "Add bank account" button to create one. `;
  } else {
    let bank = document.getElementById(`bank_card_dataset_${dataset.name}`);
    for (let i = 0; i < dataset.bankAccs.length; i++) {
      bank.innerHTML += `
      <div id="bank" class="card">
        <div id="bank_body" class="card-body">
          <h5 id="bank_title" class="card-title">Bank account ${i + 1}</h5>
          Number: ${dataset.bankAccs[i].num_acc.text} </br>
          Key: ${dataset.bankAccs[i].access_pass.text}
        </div>
      </div>
      `;
    }
  }

  // Se comprueba que hayan direcciones y se muestran
  if (dataset.adress.length == 0) {
    document.getElementById(
      `info4_dataset_${dataset.name}`
    ).innerHTML += ` You don't have any associated adresses. Click on the "Add adress" button to create one. `;
  } else {
    let adress = document.getElementById(`adress_card_dataset_${dataset.name}`);
    for (let i = 0; i < dataset.adress.length; i++) {
      adress.innerHTML += `
      <div id="adress" class="card">
        <div id="adress_body" class="card-body">
          <h5 id="adress_title" class="card-title">Adress ${i + 1}</h5>
           ${dataset.adress[i].text}
        </div>
      </div>
      `;
    }
  }

  hideButtons("edit");
  hideButtons("remove");
  hideButtons("editNote");
  hideButtons("removeNote");
  //document.getElementsByName("edit")
  
  //document.getElementById("buttonEdit").style.display = "none";
  //document.getElementById("buttonRemove").style.display = "none";
  
}

function hideButtons(nameButton) {
  let buttons = document.getElementsByName(nameButton);
  for(var i=0; i<buttons.length; i++) {
    buttons[i].style.display="none";
  }

}

async function init() {
  var datasets = await ipcRenderer.invoke("give-user-datasets");

  console.log("estoy")
  console.log(datasets)

  let tab = document.getElementById("myTab");
  let contentTabs = document.getElementById('myTabContent');
  // creamos los tabs de los datasets
  datasets.forEach(dataset => {
    tab.innerHTML +=
      `<li class="nav-item" role="presentation">
          <button class="nav-link" id="${dataset.name}-tab" data-bs-toggle="tab" data-bs-target="#${dataset.name}-content" type="button"
            role="tab" aria-controls="${dataset.name}-content" aria-selected="false">${dataset.name}</button>
      </li>`;

      contentTabs.innerHTML += `
      <div class="tab-pane fade" id="${dataset.name}-content" role="tabpanel" aria-labelledby="${dataset.name}-tab"></div>
      `

      if (document.getElementById(`${dataset.name}-tab`).getAttribute("aria-selected")) {
        var user_json = ipcRenderer.sendSync("give-user-json");
        if(dataset.creador == user_json.name) {
          esquema(document.getElementById(`${dataset.name}-content`), true, dataset, true);
          userDatasets(dataset, true);
          print(dataset);
        } else {
          esquema(document.getElementById(`${dataset.name}-content`), true, dataset, false);
          userDatasets(dataset, false);
        }
        
      }
  });

  if (document.getElementById("home-tab").getAttribute("aria-selected")) {
    var user_json = ipcRenderer.sendSync("give-user-json");
    esquema(document.getElementById("home"), false, null);
    userJson(user_json);
    print(user_json);
  }

}

function print(json) {
  console.log(json.name);
  // ------------------------------- ACCIONES ------------------------------------
  // ----- MOSTRAR CONTRASEÑA -----
  // Seleccionar el botón que muestra u oculta la contraseña
  var myButton = document.getElementsByName("dynamic");
  var myInput = document.getElementsByName("viewPass");

  // Cada vez que se haga click en el botón, se ocultará o se mostrará la contraseña
  myButton.forEach(function (element, index) {
    element.onclick = function () {
      if (myInput[index].type == "password") {
        myInput[index].type = "text";
        myButton[index].firstChild.className = "fa fa-eye";
      } else {
        myInput[index].type = "password";
        myButton[index].firstChild.className = "fa fa-eye-slash";
      }
    };
  });
  // ----------------------------

  // ---- EDITAR CONTRASEÑA -----
  // Seleccionar el botón que permite editar la contraseña
  var myButtonEdit = document.getElementsByName("edit");
  var myInputEdit = document.getElementsByName("viewPass");
  var myButtonEditConfirm = document.querySelectorAll("#passwordEditCheck");

  // Cada vez que se haga click en el botón, se permitirá al usuario cambiar la contraseña
  myButtonEdit.forEach(function (element, index) {
    element.onclick = function () {
      if (myInput[index].getAttribute("disabled") == "true") {
        myInputEdit[index].removeAttribute("disabled");
        myInputEdit[index].nextElementSibling.firstElementChild.removeAttribute(
          "disabled"
        );
        //myInput[index].setAttribute("disabled", "false");
      } else {
        myInputEdit[index].setAttribute("disabled", "true");
        myInputEdit[index].nextElementSibling.firstElementChild.setAttribute(
          "disabled",
          "true"
        );
      }
    };
  });
  // cuando se le da al check del input de la pass, se edita la pass
  myButtonEditConfirm.forEach((element, index) => {
    element.onclick = () => {
      for (var i = 0; i < json.accounts.length; i++) {
        if (i == index) {
          let inputsPass = document.querySelectorAll("#passwordInput");
          inputsPass = inputsPass[i].value;
          json.accounts[i].pass_account = inputsPass;
          ipcRenderer.invoke("edit-account", json);
          ipcRenderer.invoke("refresh", "");
        }
      }
    };
  });
  //----------------------------


  // ---- ELIMINAR CUENTA ----
  // Seleccionar el botón que elimina una cuenta
  var myButtonRemove = document.getElementsByName("remove");

  // Cada vez que se haga click en el botón, se eliminará esa cuenta
  myButtonRemove.forEach(function (element, index) {
    element.onclick = function () {
      console.log(json);
      for (var i = 0; i < json.accounts.length; i++) {
        if (i == index) {
          delete json.accounts.splice(i, 1);
          ipcRenderer.invoke("delete-account", json);
          ipcRenderer.invoke("refresh", "");
        }
      }
    };
  });
  // ------------------------- FIN ACCIONES CUENTA------------------------------------

  // ------------------------- ACCIONES NOTAS ----------------------------------------
  // ---- EDITAR NOTA ----
  var myButtonEditConfirm = document.getElementsByName("editNote");

  myButtonEditConfirm.forEach((element, index) => {
    element.onclick = () => {
      for (var i = 0; i < json.notes.length; i++) {
        if (i == index) {
          let inputNote = document.querySelectorAll("#noteInput");
          inputNote = inputNote[i].value;
          json.notes[i].text = inputNote;
          ipcRenderer.invoke("edit-note", json);
          ipcRenderer.invoke("refresh", "");
        }
      }
    };
  });
  // ---- ELIMINAR NOTA ----
  // Seleccionar el botón que elimina una cuenta
  var myButtonRemove = document.getElementsByName("removeNote");

  // Cada vez que se haga click en el botón, se eliminará esa cuenta
  myButtonRemove.forEach(function (element, index) {
    element.onclick = function () {
      for (var i = 0; i < json.notes.length; i++) {
        if (i == index) {
          delete json.notes.splice(i, 1);
          ipcRenderer.invoke("delete-note", json);
          ipcRenderer.invoke("refresh", "");
        }
      }
    };
  });
  // ------------------------ FIN ACCIONES NOTAS ---------------------------------------

}

function createAccount(idButton) {
  ipcRenderer.send("go-add-account", idButton);
}

function createNote(idButton) {
  ipcRenderer.send("go-add-note", idButton);
}

function createBank(idButton) {
  ipcRenderer.send("go-add-bank", idButton);
}

function createAdress(idButton) {
  ipcRenderer.send("go-add-adress", idButton);
}

function createDifferentDataset() {
  ipcRenderer.send("go-add-different-dataset");
}

/*document.getElementById("buttonShow").addEventListener("click", function(e){*/

document.addEventListener("DOMContentLoaded", init, false);
