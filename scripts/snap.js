let handPoseModel = null

function calculateDistance(x1, x2, y1, y2) {
    const dx2 = Math.pow(x2 - x1, 2)
    const dy2 = Math.pow(y2 - y1, 2)
    const distance = Math.sqrt(dx2 + dy2);
    return distance;
}

export async function initHandPoseModel() {
    const inputVideo = document.getElementById("video");
    try {
        console.log("Fetching APi");
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
            runtime: 'mediapipe', // or 'tfjs',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
            modelType: 'lite',
            maxHands: 1,/// single handetection

        };

        async function detectHands() {
            handPoseModel = await handPoseDetection.createDetector(model, detectorConfig);
            const estimationConfig = {flipHorizontal: true};
            const hands = await handPoseModel.estimateHands(inputVideo, estimationConfig);
            let handDetected = false
            if (hands.length > 0) {
                // console.log("🤚 Hands detected:", hands);
                handDetected = true;

                const keyPoints = hands[0].keypoints
                console.log(keyPoints);
                const thumbTip = keyPoints[4]
                const middleTip = keyPoints[12]
                console.log(`thumbTip=${JSON.stringify(thumbTip)} and middleTip=${JSON.stringify(middleTip)}`);
                //only console if hand data is there
            }
            if (handDetected) {
                alert("kitti mone")
            }
            requestAnimationFrame(detectHands);

        }

        detectHands();
    } catch (e) {
        console.error(`${e} error occured`);
    }

}