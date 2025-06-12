const video=document.getElementById('video');
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d'); //for images
const asciiOutput=document.getElementById('asciiOutput');

const asciiChars = "@#W$9876543210?!abc;:+=-,._ ";

let asciiInterval

function convertToAscii(){
    asciiOutput.style.display="block";
    video.style.visibility="hidden";
    canvas.width=100
    canvas.height=100

}