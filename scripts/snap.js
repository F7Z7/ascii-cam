import {stopAscii} from "./main.js";

let handPoseModel = null;
let handSnap = false;
let minHandistance = 30;
let maxHandistance = 90;

function calculateDistance(x1, x2, y1, y2) {
    const dx2 = Math.pow(x2 - x1, 2);
    const dy2 = Math.pow(y2 - y1, 2);
    return Math.sqrt(dx2 + dy2);
}

function detectSnap(keypoints) {
    const thumbTip = keypoints[4];
    const middleTip = keypoints[12];

    const distance = calculateDistance(thumbTip.x, middleTip.x, thumbTip.y, middleTip.y);

    if (distance > minHandistance && distance < maxHandistance && !handSnap) {
        setTimeout(convertToAscii,30)
         //conversion
        handSnap = true;
    }

}
function exitAscii(hands){
    if(hands.length == 2){
        //two hands left and right
        const hand1=hands[0]
        const hand2=hands[1]

        let index1=hand1.keypoints[8]
        let index2=hand2.keypoints[8]

        let distance=calculateDistance(index1.x,index2.x,index1.y,index2.y);

        if(distance < 30){
            setTimeout(stopAscii,30)

        }
    }
}
//checking for detection of hands in the video
async function detectHands(inputVideo) {
    const estimationConfig = { flipHorizontal: true };//for selfies

    async function loop() {
        const hands = await handPoseModel.estimateHands(inputVideo, estimationConfig);

        if (hands.length > 0) {
            const keypoints = hands[0].keypoints;
            detectSnap(keypoints);//detection of snap
        }
        if(hands.length ===2){
            exitAscii(hands);
        }
        setTimeout(() => requestAnimationFrame(loop), 300);
    }

    loop();
}
//setting up the model
export async function initHandPoseModel() {
    const inputVideo = document.getElementById("video");
    try {
        console.log("Fetching API");

        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
            runtime: 'mediapipe',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
            modelType: 'lite',
            maxHands: 2
        };

        handPoseModel = await handPoseDetection.createDetector(model, detectorConfig);

        // Start detection loop
        detectHands(inputVideo);
    } catch (e) {
        console.error(`${e} error occurred`);
    }
}
