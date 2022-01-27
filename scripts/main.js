// Typing text - main section
const typedText = document.querySelector('.type__text');
const typedCursor = document.querySelector('.type__cursor');

const textArray = ["Generátor", "Historii", "Zajímavosti", "Informace"];

const typingDelay = 170;	// Time of writing text
const erasingDelay = 70;	// Time of deleting text
const newTextDelay = 2000;	// Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if(!typedCursor.classList.contains("typing")) typedCursor.classList.add("typing");
    typedText.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } 
  else {
    typedCursor.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if(!typedCursor.classList.contains("typing")) typedCursor.classList.add("typing");
    typedText.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } 
  else {
    typedCursor.classList.remove("typing");
    textArrayIndex++;
    if(textArrayIndex>=textArray.length) textArrayIndex=0;
    setTimeout(type, typingDelay + 1100);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  if(textArray.length) setTimeout(type, + 900);
});


// Creating QR Codes and Short Link
const qrButton = document.querySelector('.qr__button');
const qrInputField = document.querySelector('.qr__input');
const qrInputBox= document.querySelector('.qr__inputBx');
const qrOutput = document.querySelector('.qr__output');

// Get Date and Time
var today = new Date();
var date = today.getDate()+'.'+(today.getMonth()+1)+'.'+today.getFullYear()
var time = today.getHours() + ":" + today.getMinutes();
var dateTime = time+' - '+date;

qrButton.addEventListener('click', () => {
    if(qrInputField.value.length > 0){
        // console.log('clicked');

        qrInputBox.classList.remove('error-active');
        entered();
    }
    else{
        qrInputBox.classList.add('error-active');
    }
});

qrInputField.addEventListener('keyup', keypress);

function keypress(e){
    if(e&&e.keyCode === 13){
        if(qrInputField.value.length > 0){
            // console.log('entered');

            qrInputBox.classList.remove('error-active');
            entered();
        }
        else{
            qrInputBox.classList.add('error-active');
        }
    }
}

function entered(){
    // console.log('clicked');
    var inputData = qrInputField.value;
    let imgUrl = `http://api.qrserver.com/v1/create-qr-code/?size=125x125&data=${inputData}`;

    if(inputData.toLowerCase().indexOf(".") >= 0){
        // console.log('input contains dot');

        fetch(`https://api.shrtco.de/v2/shorten?url=${inputData}`)
        .then(res => res.json())
        .then(data => linkInfo(data))
    }
    else{
        qrCodeEntered();
    }



    // Enter information into code and put it to website
    function linkInfo(data){
        // console.log(data);

        if(data.ok == true){
            var shortLink = data.result.short_link;
            var originalLink = data.result.original_link;
            // console.log(shortLink)

            const apiLinkInfo = `
                <div class="qr__item">
                    <div class="item__imgBx">
                        <img src="${imgUrl}" alt="QR Code of ${inputData}" class="qr__img">
                    </div>
                    <div class="item__info">
                        <a href="${originalLink}" class="link__original">${inputData}</a>
                        <p class="item__date">${dateTime}</p>
                        <p class="item__shortBx">Krátký odkaz: <a href="https://${shortLink}" class="item__short">${shortLink}</a></p>
                        <button class="item__download">Stáhnout</button>
                    </div>
                </div>
            `;

            qrOutput.insertAdjacentHTML('afterbegin', apiLinkInfo);
        }
    }
    function qrCodeEntered(){
        const apiQrInfo = `
            <div class="qr__item">
                <div class="item__imgBx">
                    <img src="${imgUrl}" alt="QR Code of ${inputData}" class="qr__img">
                </div>
                <div class="item__info">
                    <p class="link__original">${inputData}</p>
                    <p class="item__date">${dateTime}</p>
                    <button class="item__download">Stáhnout</button>
                </div>
            </div>
        `

        qrOutput.insertAdjacentHTML('afterbegin', apiQrInfo);
    }

    qrInputField.value = ""
}