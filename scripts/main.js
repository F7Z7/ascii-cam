import {initHandPoseModel} from "./snap.js";

function stopVideo(){
    const video=document.getElementById('video');
    const stream=video.srcObject;
    if(!stream) return;

    const tracks=stream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
    asciiOutput.style.display = "none";
    video.style.display = "none";
}
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
