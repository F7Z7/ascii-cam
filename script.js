function stopVideo(){
    const video=document.getElementById('video');
    const stream=video.srcObject;
    const tracks=stream.getTracks();
    let track
    for (track in tracks){
        track.stop()
    }
    video.srcObject = null;
}