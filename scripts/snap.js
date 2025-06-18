import {stopAscii} from "./main.js";

let handPoseModel = null;
let handSnap = false;
let minHandistance = 30;
let maxHandistance = 90;
let SNAP_TIME_LAG=300
let exitCooldown = false;

function calculateDistance(x1, x2, y1, y2) {
    const dx2 = Math.pow(x2 - x1, 2);
    const dy2 = Math.pow(y2 - y1, 2);
    return Math.sqrt(dx2 + dy2);
}

function detectSnap(keypoints) {
    const thumbTip = keypoints[4];
    const middleTip = keypoints[12];
if(!thumbTip || !middleTip || thumbTip.score<.5 || middleTip.score<.5) return null;

    const distance = calculateDistance(thumbTip.x, middleTip.x, thumbTip.y, middleTip.y);
    if (distance > minHandistance && distance < maxHandistance && !handSnap) {
        console.log("snap detected")
        setTimeout(() => {
            conseCutiveCoolDown();
            convertToAscii();
        }, SNAP_TIME_LAG);
        //conversion
        handSnap = true;
        exitCooldown = false;
    }

}
function exitAscii(hands){
    if(hands.length == 2 && handSnap &&exitCooldown){
        //two hands left and right
        const hand1=hands[0]
        const hand2=hands[1]
        if (!hand1.keypoints[8] || !hand2.keypoints[8] ||
            hand1.keypoints[8].score < 0.5 || hand2.keypoints[8].score < 0.5) {
            return;
        }
        let index1=hand1.keypoints[8]
        let index2=hand2.keypoints[8]

        let distance=calculateDistance(index1.x,index2.x,index1.y,index2.y);
        console.log("Distance between hands:", distance);

        if(distance < 40 && distance > 10){
           setTimeout(()=>{
               stopAscii();
               resetSnapState();
               conseCutiveCoolDown();

           },300)

        }
    }
}
function resetSnapState() {
    // Don't reset handSnap immediately
    exitCooldown = false;

    // Reset both states *after* the cooldown ends
    setTimeout(() => {
        handSnap = false;
        exitCooldown = true;
    }, 1000); // match your cooldown period
}
//so that after exit the next snap doesnt occur simulatnaeltously
function conseCutiveCoolDown() {
    exitCooldown = false;
    setTimeout(() => {
        exitCooldown = true;
    }, 1000); // 1 second cooldown instead of 30ms
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
        requestAnimationFrame(loop);
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
        conseCutiveCoolDown()

        detectHands(inputVideo);
    } catch (e) {
        console.error(`${e} error occurred`);
    }
}