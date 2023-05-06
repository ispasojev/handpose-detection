
let handpose, video, detections, eiffel_img;
var keypoint_old = 0; 
var executed = false;
var blurDrawing = false;
var freeDrawing = false;
var circlesDrawing = false;

function setup() {
    createCanvas(625*2, 437);
    eiffel_img = loadImage('tour-eiffel.jpg');
    eiffel_img_unblurred = loadImage('tour-eiffel.jpg');
    filterimage(eiffel_img)
    video = createCapture(VIDEO); 
    video.size(625, height);
    video.hide();
    handpose = ml5.handpose(video, modelReady); 
    handpose.on("hand", gotResults);
}

function modelReady(){
    console.log('model ready');
} 

function gotResults(results){
    detections = results; 
} 

function draw() {
    image(video, 0, 0, 625, height);
    image(eiffel_img, 625, 0, 625, height)
    keyTyped()
    if (detections) {if (detections.length > 0) drawKeypoints();} 
}

function drawKeypoints(){
    noStroke();
    fill(255, 0, 0);
    for(let i=0; i<detections.length; i++){
        const detection = detections[i];
        keyTyped();
        for (let j = 0; j < detection.landmarks.length; j++) {
            const keypoint = detection.landmarks[j];
            if(j==4 && circlesDrawing){
                thumb_0 = keypoint[0]
                thumb_1 = keypoint[1]
            }
            if(j==8) {
                if(!circlesDrawing){
                    ellipse(keypoint[0], keypoint[1], 10, 10); 
                    ellipse((keypoint[0]+625), keypoint[1], 10, 10); 
                    stroke(255, 0, 0);
                    strokeWeight(10); 
                }
                // ellipse(keypoint[0], keypoint[1], 10, 10); 
                // ellipse((keypoint[0]+625), keypoint[1], 10, 10); 
                // stroke(255, 0, 0);
                // strokeWeight(10); 
                if(executed && freeDrawing) {
                    line(keypoint_old[0]+625, keypoint_old[1], keypoint[0]+625, keypoint[1])
                }
                if(blurDrawing){
                    copy(eiffel_img_unblurred, keypoint[0]-5,keypoint[1]-5, 60, 60, keypoint[0]+625-5,keypoint[1]-5, 60,60)
                }
                if(circlesDrawing){
                    dist_index_thumb_x = Math.abs(thumb_0 - keypoint[0])
                    dist_index_thumb_y = Math.abs(thumb_1 - keypoint[1])
                    dist_index_thumb = Math.max(dist_index_thumb_x, dist_index_thumb_y)
                    color = get(keypoint[0], keypoint[1])
                    console.log("color")
                    console.log(color)
                    fill(color)
                    //stroke(color);
                    //strokeWeight(10); 
                    ellipse(keypoint[0]+625, keypoint[1], (dist_index_thumb/2), (dist_index_thumb/2)); 
                    updatePixels();
                }
                keypoint_old = keypoint
                executed=true
            }
        }
    } 
}
  
function filterimage(img){
    img.filter(BLUR,0)
}

function keyTyped() {
    if (key === 'v') {
        blurDrawing = true;
        eiffel_img.filter(BLUR,5);
    } else if (key === 'f') {
        freeDrawing = true;
        eiffel_img = loadImage('tour-eiffel.jpg');
        reload();
    }else if (key === 'c') {
        circlesDrawing = true;
        eiffel_img = loadImage('tour-eiffel.jpg');
        reload();
    }else if (key === 'e') {
        clear();
        blurDrawing = false;
        freeDrawing = false;
        circlesDrawing = false;
        executed = false;
        new_eiffel_img = loadImage('tour-eiffel.jpg');
        image(video, 0, 0, 625, height);
        image(new_eiffel_img, 625, 0, 625, height);
        //canvas2.image(video, 0, 0, 625, height);
        //canvas2.image(new_eiffel_img, 625, 0, 625, height);
    }
}

function reload(){
    image(video, 0, 0, 625, height);
    image(eiffel_img, 625, 0, 625, height);
}