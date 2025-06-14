let handPoseModel=null
async function initHandPoseModel(){
    const inputVideo=document.getElementById("video");
    try{
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
            runtime: 'mediapipe', // or 'tfjs',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
            modelType: 'full',
            maxHands:1,/// single handetection

        };
        handPoseModel=await handPoseDetection.createDetector(model, detectorConfig);
        const hands = await handPoseModel.estimateHands(inputVideo);
        console.log(hands)

    }
    catch(e){
        console.error(`${e} error occured`);
    }
}