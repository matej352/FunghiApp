

var els = document.getElementsByTagName('a');
[].forEach.call(els, function (el) {
    var bb = new Blob(["<sometag><someothertag></someothertag></sometag>"], { type: 'text/plain' });
    el.setAttribute('href', window.URL.createObjectURL(bb));
});




// Event listeners for property serch
document.getElementsByName("ZnanstveniNaziv").forEach(el => {
    el.addEventListener('keyup', doThing);
})
document.getElementsByName("Porodica").forEach(el => {
    el.addEventListener('keyup', doThing);
})
document.getElementsByName("Rod").forEach(el => {
    el.addEventListener('keyup', doThing);
})
document.getElementsByName("Vrsta").forEach(el => {
    el.addEventListener('keyup', doThing);
})

let activePage = 0;
setActivePage();


//actions for 'Previous' and 'Next' buttons
var els = document.getElementsByClassName('Next');
[].forEach.call(els, function (el) {
    el.addEventListener('click', add);
});

var els = document.getElementsByClassName('Previous');
[].forEach.call(els, function (el) {
    el.addEventListener('click', sub);
});


var els = document.getElementsByClassName('label');
[].forEach.call(els, function (el) {
    el.addEventListener('click', directPageClick);
});


function add() {
    activePage += 1;
    setActivePage();
}

function sub() {
    if (activePage > 0) {
        activePage -= 1;
        setActivePage();
    }

}

function directPageClick() {
    activePage = +this.id;
    setActivePage();
}

function setActivePage() {
    console.log(activePage);
    var els = document.getElementsByTagName('label');
    [].forEach.call(els, function (el) {

        if (+el.id === activePage) {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    });


}

function focusInput(id) {
    var inputField = document.getElementById(id);
    if (inputField != null && inputField.value.length != 0) {
        if (inputField.createTextRange) {
            var FieldRange = inputField.createTextRange();
            FieldRange.moveStart('character', inputField.value.length);
            FieldRange.collapse();
            FieldRange.select();
        } else if (inputField.selectionStart || inputField.selectionStart == '0') {
            var elemLen = inputField.value.length;
            inputField.selectionStart = elemLen;
            inputField.selectionEnd = elemLen;
            inputField.focus();
        }
    } else if (inputField != null) {
        inputField.focus();
    }
}


focusInput("lastSelectedInputId")


/* function */
function doThing() {
    setTimeout(() => { window.location.reload() }, 1000);
    fetch("/post", {
        method: "POST",
        body: JSON.stringify({
            property: this.name,
            searchText: this.value
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
}
