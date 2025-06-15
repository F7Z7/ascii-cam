let handPoseModel = null

export async function initHandPoseModel() {
    const inputVideo = document.getElementById("video");
    try {
        console.log("Fetching APi");
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
            runtime: 'mediapipe', // or 'tfjs',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
            modelType: 'full',
            maxHands: 1,/// single handetection

        };

        async function detectHands() {
            handPoseModel = await handPoseDetection.createDetector(model, detectorConfig);
            const estimationConfig = {flipHorizontal: true};
            const hands = await handPoseModel.estimateHands(inputVideo, estimationConfig);
            let handDetected=false
            if (hands.length > 0) {
                console.log("🤚 Hands detected:", hands);
                handDetected = true;

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