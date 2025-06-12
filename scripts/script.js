function stopVideo(){
    const video=document.getElementById('video');
    const stream=video.srcObject;
    if(!stream) return;

    const tracks=stream.getTracks();
    let track
    tracks.forEach(track => track.stop());
    video.srcObject = null;
}
function startVideo(){
    const video=document.getElementById('video');
    if(navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({video:true}) //user allows
        .then(stream=>{
            video.srcObject = stream;
        })
            .catch(error=>{
                console.error(error);
            })
    }
    else{
        console.log("getUserMedia not supported on your browser!");
    }
}
