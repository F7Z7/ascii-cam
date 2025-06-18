import {initHandPoseModel} from "./snap.js";

export function stopAscii() {
    const video = document.getElementById('video');
    const stream = video.srcObject;
    if (!stream) return;
    setCenterVideo(video);
}

function setCenterVideo(video) {
    video.style.position = "fixed";
    video.style.top = "50%";
    video.style.left = "50%";
    video.style.transform = "translate(-50%, -50%)";
    video.style.width = "800px";
    video.style.height = "100%";
    video.style.zIndex = "3";

   //reset
    video.style.margin = "0";
    video.style.border = "none";
    video.style.borderRadius = "0";
    video.style.boxShadow = "none";
    video.style.backgroundColor = "transparent";
}



async function startVideo() {
    if (navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            video.srcObject = stream;
            setCenterVideo(video);
            initHandPoseModel(video);
        } catch (err) {
            console.error("Error accessing camera", err);
        }
    } else {
        console.log("getUserMedia not supported");
    }
}

startVideo() // strat it already
