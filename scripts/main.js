// Typing text - main section
const typedText = document.querySelector('.type__text');
const typedCursor = document.querySelector('.type__cursor');

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
let today = new Date();
let date = today.getDate()+'.'+(today.getMonth()+1)+'.'+today.getFullYear()
let time = today.getHours() + ":" + today.getMinutes();
let dateTime = time+' - '+date;

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
    let inputData = qrInputField.value;
    let imgUrl = `http://api.qrserver.com/v1/create-qr-code/?size=175x175&data=${inputData}`;

    if(inputData.toLowerCase().indexOf(".") >= 0){
        // console.log('input contains dot');

        fetch(`https://api.shrtco.de/v2/shorten?url=${inputData}`)
        .then(res => res.json())
        .then(data => linkInfo(data))
    }
    else{
        const apiQrInfo = `
            <div class="qr__item ${inputData}">
                <div class="item__imgBx">
                    <img src="${imgUrl}" alt="${qrCodeAlt} ${inputData}" class="qr__img">
                </div>
                <div class="item__info">
                    <p class="link__original">${inputData}</p>
                    <p class="item__date">${dateTime}</p>
                    <div class="link__buttonBx">
                        <a href="${imgUrl}" class="item__download btn__black" download>Stáhnout</a>
                        <a onclick="localStorage.removeItem('${inputData}'); const current${inputData} = document.querySelector('.qr__item.${inputData}'); current${inputData}.remove(); " class="item__download btn__red">Smazat</a>
                    </div>
                </div>
            </div>
        `

        qrCodeEntered(apiQrInfo);
    }

    // Enter information into code and put it to website
    function linkInfo(data){
        // console.log(data);

        if(data.ok === true){
            let shortLink = data.result.short_link;
            let shortCode = data.result.code;
            let originalLink = data.result.original_link;

            // console.log(shortLink);
            // console.log(shortCode);

            const apiQrInfo = `
                <div class="qr__item ${shortCode}">
                    <div class="item__imgBx">
                            <img src="${imgUrl}" alt="${qrCodeAlt} ${inputData}" class="qr__img">
                    </div>
                    <div class="item__info">
                        <a href="${originalLink}" class="link__original">${inputData}</a>
                        <p class="item__date">${dateTime}</p>
                        <p class="item__shortBx">${qrCodeLinkText}: <a href="https://${shortLink}" class="item__short">${shortLink}</a></p>
                        <div class="link__buttonBx">
					        <a href="${imgUrl}" class="item__download btn__black" download>Stáhnout</a>
					        <a onclick="localStorage.removeItem('${inputData}'); const current${shortCode} = document.querySelector('.qr__item.${shortCode}'); current${shortCode}.remove(); " class="item__download btn__red">Smazat</a>
				        </div>
                    </div>
                </div>
            `;

            qrCodeEntered(apiQrInfo);
        }
    }
    function qrCodeEntered(apiQrInfo){
        qrOutput.insertAdjacentHTML('afterbegin', apiQrInfo);

        // LocalStorage set items
        localStorage.setItem(`${inputData}`, apiQrInfo);
    }

    qrInputField.value = ""
}

// LocalStorage get items
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const localStrValue = localStorage.getItem(key);

    // console.log(localStrValue);

    qrOutput.insertAdjacentHTML('afterbegin', localStrValue);
}