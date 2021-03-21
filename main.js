
var igraci = []; 

var trenutniIgrac = 0; 
var bodovi = []; 
var boje = []; 
var celije = []; 
var oznake = []; 
var linije = []; 


function validirajPostavke() {
  var forma = document.getElementById("forma");
  var postavke = document.getElementById("postavke");
  var novaigrica = document.getElementById("nova-igrica");
  var elementi = forma.elements;

  for (var i = 0, element; (element = elementi[i++]); ) {
    if (element.type === "text" && element.value) {
      igraci.push({
        ime: element.value,
        boja: generisiBojuIgraca(),
      });
    }
  }

 
  if (igraci.length > 1) {
    postavke.style.display = "none";
    novaigrica.style.display = "block";

    novaIgrica(); 
  }

  return false;
}

function novaIgrica() {
  for (var i = 0; i < igraci.length; i++) bodovi[i] = 0; 

  mapirajIzgledIgrice();
  osvjeziStanjeIgrice();
}



function mapirajIzgledIgrice() {
  var igrica = document.getElementById("igrica");
  var redovi = igrica.getElementsByClassName("red");

  for (var i = 0; i < redovi.length; i++) {
    var _celije = redovi[i].getElementsByClassName("celija");

    celije[i] = [];
    oznake[i] = [];
    linije[i] = [];

    for (var j = 0; j < _celije.length; j++) {
      var celija = _celije[j];

      var oznaka = celija.getElementsByClassName("oznaka")[0];
      var _linije = celija.getElementsByClassName("linija");

      linije[i][j] = [];

      for (var k = 0; k < _linije.length; k++) {
        var linija = _linije[k];

        if (!linija.classList.contains("ugasena")) {
          linija.onclick = klikNaLiniju;
          linija.onmouseover = dolazakNaLiniju;
          linija.onmouseleave = odlazakSaLinije;
        }

        linija.dataset.red = i;
        linija.dataset.kolona = j;
        linija.dataset.pozicija = k;

        linije[i][j][k] = linija;
      }

      oznake[i][j] = oznaka;
      celije[i][j] = celija;
    }
  }
}



function klikNaLiniju(e) {
  if (igraZavrsena()) return;

  var el = e.target;

  if (!linijaAktivna(el)) el.classList.add("aktivna");
  else return;

  el.style.backgroundColor = igraci[trenutniIgrac].boja;

  var osvojeno = false;
  var red = parseInt(el.dataset.red);
  var kolona = parseInt(el.dataset.kolona);
  var pozicija = parseInt(el.dataset.pozicija);

  if (el.classList.contains("horizontalna")) {
    if (horizontalnaZavrsena(red, kolona, pozicija)) {
      osvojeno = true;
      osvojiBod(red - 1, kolona);
    }

   
    if (horizontalnaZavrsena(red + 1, kolona, pozicija)) {
      osvojeno = true;
      osvojiBod(red, kolona);
    }
  } else {
    if (vertikalnaZavrsena(red, kolona, pozicija)) {
      osvojeno = true;
      osvojiBod(red, kolona - 1);
    }

 
    if (vertikalnaZavrsena(red, kolona + 1, pozicija)) {
      osvojeno = true;
      osvojiBod(red, kolona);
    }
  }

  sljedeciPotez(!osvojeno);
}

function dolazakNaLiniju(e) {
  if (igraZavrsena()) return;

  var el = e.target;

  if (linijaAktivna(el)) return;

  el.style.backgroundColor = igraci[trenutniIgrac].boja;
  el.style.zIndex = 3; 

  return true;
}

function odlazakSaLinije(e) {
  if (igraZavrsena()) return;

  var el = e.target;

  if (linijaAktivna(el)) return;

 
  if (el.style.backgroundColor) {
    el.style.backgroundColor = "";
    el.style.zIndex = 1;
  }

  return true;
}



function sljedeciPotez(krajPoteza) {
  if (krajPoteza) {
    trenutniIgrac++;
    if (trenutniIgrac >= igraci.length) trenutniIgrac = 0;
  }

  osvjeziStanjeIgrice();

  if (igraZavrsena()) {
    var max = 0;
    var pobjednik = null;

    for (var i = 0; i < igraci.length; i++) {
      if (bodovi[i] > max) {
        max = bodovi[i];
        pobjednik = igraci[i];
      }
    }

    var poruka = document.getElementById("poruka");
    poruka.innerHTML = "Igra je završena. Pobjednik je  " + pobjednik.ime + "!";
    $("#obavjest").modal({
      backdrop: "static",
      keyboard: false,
      show: true,
    });
  }
}

function osvojiBod(red, kolona) {
  oznake[red][kolona].style.backgroundColor = igraci[trenutniIgrac].boja;
  oznake[red][kolona].innerHTML = igraci[trenutniIgrac].ime.charAt(0); 
  bodovi[trenutniIgrac]++; 
}



function horizontalnaZavrsena(red, kolona, pozicija) {
  return (
    linijaAktivna(linije[red][kolona][pozicija]) &&
    linijaAktivna(linije[red - 1][kolona][pozicija]) &&
    linijaAktivna(linije[red - 1][kolona][pozicija + 1]) &&
    linijaAktivna(linije[red - 1][kolona + 1][pozicija + 1])
  );
}

function vertikalnaZavrsena(red, kolona, pozicija) {
  return (
    linijaAktivna(linije[red][kolona][pozicija]) &&
    linijaAktivna(linije[red][kolona - 1][pozicija]) &&
    linijaAktivna(linije[red][kolona - 1][pozicija - 1]) &&
    linijaAktivna(linije[red + 1][kolona - 1][pozicija - 1])
  );
}

function igraZavrsena() {
  for (var red of linije)
    for (var kolona of red)
      for (var linija of kolona) if (!linijaAktivna(linija)) return false;

  return true;
}

function linijaAktivna(el) {
  return el.classList.contains("aktivna") || el.classList.contains("ugasena");
}


function osvjeziStanjeIgrice() {
  var potez = document.getElementsByClassName("potez")[0];
  var rezultat = document.getElementById("bodovi");

  potez.innerHTML = igraci[trenutniIgrac].ime;
  potez.style.color = igraci[trenutniIgrac].boja;
  rezultat.innerHTML = "";

  for (var i = 0; i < igraci.length; i++) {
    var igrac = document.createElement("div");
    igrac.className = "igrac";
    igrac.innerHTML = igraci[i].ime;

    var bod = document.createElement("div");
    bod.className = "bod";
    bod.style.color = igraci[i].boja;
    bod.innerHTML = bodovi[i];

    igrac.appendChild(bod);
    rezultat.appendChild(igrac);
  }
}



function generisiBojuIgraca() {
  while (true) {
    var boja = generisiBoju();

    if (typeof boje[boja] === "undefined") {
      boje[boja] = true;
      return boja;
    }
  }
}

// https://stackoverflow.com/questions/1484506/random-color-generator
function generisiBoju() {
  var boja = "#";
  var slova = "0123456789ABCDEF";

  for (var i = 0; i < 6; i++) {
    boja += slova[Math.floor(Math.random() * 16)];
  }

  return boja;
}
