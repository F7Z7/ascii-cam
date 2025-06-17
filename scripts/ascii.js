const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); //for images
const asciiOutput = document.getElementById('asciiOutput');

const asciiChars = "@#W$9876543210?!abc;:+=-,._ ";
let lastAsciiTime = 0;
let asciiInterval = false
let brightnessMultiplier = 1
let sendVal = document.getElementById("sendVal");
let brightnessVal = document.getElementById("brightnessVal");
sendVal.addEventListener("click", function () {
    const value = parseFloat(brightnessVal.value);
    if (isNaN(value)) {
        alert("Please enter a valid number");
    } else if (value > 10 || value <= 0) {
        alert("please chooes a number btw 0 and 10")
    } else {
        brightnessMultiplier = value;
        console.log("brightnessMultiplier: " + brightnessMultiplier);
    }
})

function resetBrightness() {

    brightnessMultiplier = 1
    brightnessVal.value = "" //clearing te input
}

function convertToAscii() {
    asciiOutput.style.display = "block";
    // video.style.visibility = "hidden";
    canvas.width = 160;
    canvas.height = 60;

    asciiInterval = true

    setTimeout(() => requestAnimationFrame(asciiFrame), 100);
    video.style.position = "fixed";
    video.style.top = "10px";
    video.style.right = "10px";
    video.style.width = "200px";
    video.style.height = "auto";
    video.style.zIndex = "3";
    video.style.border = "2px solid lime";
    video.style.borderRadius = "10px";
    video.style.boxShadow = "0 0 10px lime";
}

function asciiFrame(timestamp) {
    if (!asciiInterval) return; //not work if the not true
    if (timestamp - lastAsciiTime > 100) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);//occupying fully
        const {data, width, height} = ctx.getImageData(0, 0, canvas.width, canvas.height); //data=pixels=rgba


        let ascii = ""
        for (let y = 0; y < height; y++) {
            let row = ""
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4 //data array has 4 values r,g,b and a=255 ,to acces 4 values we user i
                const r = data[i] //first value is r
                const g = data[i + 1];//g
                const b = data[i + 2];

                const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                // console.log(brightness)
                const adjusted = Math.min(255, Math.max(0, brightness * brightnessMultiplier));
                // console.log(adjusted)  // increase intensity by 1.5x
                const charIdx = Math.floor((adjusted / 255) * (asciiChars.length - 1));
                row += asciiChars.charAt(charIdx);
            }
            ascii += row + "\n";
        }
        asciiOutput.textContent = ascii;
        lastAsciiTime = timestamp;
    }
    setTimeout(() => requestAnimationFrame(asciiFrame), 100);

}