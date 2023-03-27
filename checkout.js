//Check out code

const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const telephone = document.getElementById('telephone');
const street = document.getElementById('street');
const zipcode = document.getElementById('zipcode');
const city = document.getElementById('city');
const shoppingCart = [];

form.addEventListener('submit', e => {
    e.preventDefault();
    checkInputs();
});

function checkInputs() {

    // Get values from fields
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const telephoneValue = telephone.value.trim();
    const streetValue = street.value.trim();
    const zipcodeValue = zipcode.value.trim();
    const cityValue = city.value.trim();

    // For form to show error in all fields -> need to go through all checks everytime
    let arr = [];
    arr.push(checkUserName(usernameValue));
    arr.push(checkEmail(emailValue));
    arr.push(checkTelephone(telephoneValue));
    arr.push(checkStreet(streetValue));
    arr.push(checkZipCode(zipcodeValue));
    arr.push(checkCity(cityValue));

    if (!arr.includes(false)) {
        successPurchase();
    }
}

function successPurchase() {
    // Show modal
    let myModal = new bootstrap.Modal('#confirmation-modal');
    myModal.show();
  
    // Set modal text
    var modalText = document.getElementById("modal-bodyText");
    const loadedCart= JSON.parse(localStorage.getItem('storedCart'))
   
    modalText.appendChild(document.createTextNode(loadedCart[0].title));
    modalText.appendChild(document.createElement("br"));
    modalText.appendChild(document.createTextNode("Shipped to:"));
    modalText.appendChild(document.createElement("br"));
    modalText.appendChild(document.createTextNode(username.value.trim()));
    modalText.appendChild(document.createElement("br"));
    modalText.appendChild(document.createTextNode(street.value.trim()));
    modalText.appendChild(document.createElement("br"));
    modalText.appendChild(document.createTextNode(zipcode.value.trim()));
    modalText.appendChild(document.createElement("br"));
    modalText.appendChild(document.createTextNode(city.value.trim()));
}


// *** Input checks ***

function checkUserName(usernameValue) {
    if (usernameValue === '') {
        setErrorFor(username, 'Name cannot be blank');
        return false;
    } else if (usernameValue.length < 2) {
        setErrorFor(username, 'Name must be more than one character');
        return false;
    } else if (usernameValue.length > 50) {
        setErrorFor(username, 'Name cannot be more than 50 characters');
        return false;
    } else {
        setSuccessFor(username);
        return true;
    }
}
function checkEmail(emailValue) {
    if (emailValue === '') {
        setErrorFor(email, 'Email cannot be blank');
        return false;
    } else if (emailValue.length > 50) {
        setErrorFor(username, 'Email cannot be more than 50 characters');
        return false;
    } else if (!isEmail(emailValue)) {
        setErrorFor(email, 'Not a valid email');
        return false;
    } else {
        setSuccessFor(email);
        return true;
    }
}
function checkTelephone(telephoneValue) {
    if (telephoneValue === '') {
        setErrorFor(telephone, 'Telephone cannot be blank');
        return false;
    } else if (!checkTelephoneString(telephoneValue)) {
        setErrorFor(telephone, 'Number can only be 1-9, "-", or "()"');
        return false;
    } else {
        setSuccessFor(telephone);
        return true;
    }
}

function checkTelephoneString(telephoneValue){
    for (var i=0; i < telephoneValue.length; i++) {
        if (!((telephoneValue.charAt(i) === "-") || (/^\d$/.test(telephoneValue.charAt(i))) ||
        (telephoneValue.charAt(i) === "(") || (telephoneValue.charAt(i) === ")"))) {
            return false;
        }  
    } return true;
}

function checkStreet(streetValue) {
    if (streetValue === '') {
        setErrorFor(street, 'Street cannot be blank');
        return false;
    } else {
        setSuccessFor(street);
        return true;
    }
}

function checkZipCode(zipcodeValue){
    if (zipcodeValue === '') {
        setErrorFor(zipcode, 'Zip Code cannot be blank');
        return false;
    } else if ( !(/(^[0-9]{3}\s?[0-9]{2}$)/.test(zipcodeValue))) {
        setErrorFor(zipcode, 'Zip Code must be in format "000 00"');
        return false;
    } else {
        setSuccessFor(zipcode);
        return true;
    }
}

function checkCity(cityValue){
    if (cityValue === '') {
        setErrorFor(city, 'City cannot be blank');
        return false;
    } else if (cityValue.length > 50) {
        setErrorFor(city, 'City cannot be more than 50 characters');
        return false;
    } else {
        setSuccessFor(city);
        return true;
    }
}

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control error';
    small.innerText = message;
}

function setSuccessFor(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}


