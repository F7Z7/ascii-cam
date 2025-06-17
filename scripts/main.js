import {initHandPoseModel} from "./snap.js";

document.getElementById("stop").addEventListener("click", function(){
    const video=document.getElementById('video');
    const stream=video.srcObject;
    if(!stream) return;

    asciiOutput.style.display = "none";
    video.style.display = "block";
    video.style.position = "fixed";
    video.style.top = "50%";
    video.style.left = "50%";
    video.style.transform = "translate(-50%, -50%)";
    video.style.width = "800px";
    video.style.height = "100%";
    video.style.zIndex = "3";


})


async function startVideo() {
    if (navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            initHandPoseModel(video);
        } catch (err) {
            console.error("Error accessing camera", err);
        }
    } else {
        console.log("getUserMedia not supported");
    }
}
 startVideo() // strat it already
