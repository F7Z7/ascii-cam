import {stopAscii} from "./main.js";

let handPoseModel = null;
let handSnap = false;
let minHandDistance = 20;
let maxHandDistance = 50;
let SNAP_TIME_LAG = 300;
let isInCooldown = false;
let wasInSnapRange = false;

function calculateDistance(x1, x2, y1, y2) {
    const dx2 = Math.pow(x2 - x1, 2);
    const dy2 = Math.pow(y2 - y1, 2);
    return Math.sqrt(dx2 + dy2);
}

function detectSnap(keypoints) {
    // Don't process if already snapped or in cooldown
    if (handSnap || isInCooldown) return;

    const thumbTip = keypoints[4];
    const middleTip = keypoints[12];

    if(!thumbTip || !middleTip || thumbTip.score < 0.5 || middleTip.score < 0.5) return;

    const distance = calculateDistance(thumbTip.x, middleTip.x, thumbTip.y, middleTip.y);
    // console.log("Thumb-Middle distance:", distance);

    let inSnapRange = distance >= minHandDistance && distance <= maxHandDistance;


    if (inSnapRange && !wasInSnapRange && !handSnap) {
        console.log("SNAP DETECTED! Distance:", distance);

        // Set states immediately
        handSnap = true;
        isInCooldown = true;

        setTimeout(() => {
            // Add your conversion logic here
            // console.log("Converting to ASCII...");
            convertToAscii();


            startCooldown();
        }, SNAP_TIME_LAG);
    }

    wasInSnapRange = inSnapRange;
}

function exitAscii(hands) {
    // Only allow exit if currently in ASCII mode and not in cooldown
    if (hands.length === 2 && handSnap && !isInCooldown) {
        const hand1 = hands[0];
        const hand2 = hands[1];

        if (!hand1.keypoints[8] || !hand2.keypoints[8] ||
            hand1.keypoints[8].score < 0.5 || hand2.keypoints[8].score < 0.5) {
            return;
        }

        let index1 = hand1.keypoints[8];
        let index2 = hand2.keypoints[8];

        let distance = calculateDistance(index1.x, index2.x, index1.y, index2.y);
        console.log("Distance between hands:", distance);

        if (distance < 30 && distance > 5) {
            console.log("EXIT DETECTED!");

            // Set cooldown immediately
            isInCooldown = true;

            setTimeout(() => {
                stopAscii();
                console.log("resetting");
                handSnap = false;
                wasInSnapRange = false;
                isInCooldown = false;
            }, 300);
        }
    }
}


function startCooldown() {
    isInCooldown = true;
    setTimeout(() => {
        isInCooldown = false;
        // console.log("Cooldown ended - ready for exit detection");
    }, 300);
}

async function detectHands(inputVideo) {
    const estimationConfig = { flipHorizontal: true };

    async function loop() {
        const hands = await handPoseModel.estimateHands(inputVideo, estimationConfig);
        // Debug log
        if (hands.length > 0) {
            null
            // console.log(`Detected ${hands.length} hand(s), handSnap: ${handSnap}, isInCooldown: ${isInCooldown}`);
        }

        if (hands.length === 1) {
            console.log("hands detected:")

            const keypoints = hands[0].keypoints;
            detectSnap(keypoints);
        }

        if (hands.length === 2) {
            console.log("2 hands detected:")
            exitAscii(hands);
        }

        requestAnimationFrame(loop);
    }

    loop();
}

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

        // Initialize state
        isInCooldown = false;
        handSnap = false;
        wasInSnapRange = false;

        console.log("Hand pose model initialized");
        detectHands(inputVideo);
    } catch (e) {
        console.error(`${e} error occurred`);
    }
}