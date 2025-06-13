const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); //for images
const asciiOutput = document.getElementById('asciiOutput');

const asciiChars = "@#W$9876543210?!abc;:+=-,._ ";

let asciiInterval = false

function convertToAscii() {
    asciiOutput.style.display = "block";
    // video.style.visibility = "hidden";
    canvas.width = 300;
    canvas.height =100;

    asciiInterval = true

    requestAnimationFrame(asciiFrame);
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

function asciiFrame() {
    if (!asciiInterval) return; //not work if the not true
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);//occupying fully
    const {data, width, height} = ctx.getImageData(0, 0, canvas.width, canvas.height); //data=pixels=rgba


    let ascii = ""
    for (let y = 0; y < height; y++) {
        let row = ""
        for (let x = 0; x < width; x++) {
            const i= (y*width +x)*4 //data array has 4 values r,g,b and a=255 ,to acces 4 values we user i
            const r=data[i] //first value is r
            const g=data[i+1];//g
            const b=data[i+2];

            const imagePix= 0.2126 * r + 0.7152 * g + 0.0722 * b; //perceptual luminance
            const charIdx = Math.floor((imagePix / 255) * (asciiChars.length - 1));
            row+=asciiChars.charAt(charIdx);
        }
        ascii += row + "\n";
    }
    asciiOutput.textContent = ascii;
    requestAnimationFrame(asciiFrame);

}