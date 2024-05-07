import { subscribeToResults, w, h } from "./detection.js";

let faces;

subscribeToResults((results) => {
  faces = results;
});


// Treat everything inside of 'sketch' as a regular p5.js sketch. put p. in front of anything that is a built-in p5.js function
let sketch = function (p) {

  let capture;
  let pigImg;
  let ghostImg;
  let font;

  p.preload = function() {
    pigImg = p.loadImage("face.jpeg")
    ghostImg = p.loadImage("face2.jpeg")
    font = p.loadFont('Nabla-Regular.ttf');
  }

  p.setup = function () {
    p.createCanvas(w, h, p.WEBGL);
    // p.colorMode(p.HSB);
    capture = p.createCapture(p.VIDEO)
    capture.size(w, h)
    capture.hide();
    p.textFont(font);
    p.textAlign(p.CENTER)
  };

  p.draw = function () {
    p.clear();

    p.push()
    p.translate(-p.width/2, -p.height/2)
    // if any faces have been detected...
    if (faces) {

      // loop through all detected faces
      for (let i = 0; i < faces.detections.length; i++) {
        const face = faces.detections[i]

        // draw bounding box
        const boundingBox = face.boundingBox;
        p.fill(200, 0, 0)
        // p.noStroke()
        const start = p.createVector(p.width - boundingBox.originX - boundingBox.width, boundingBox.originY)
        const end = p.createVector(start.x + boundingBox.width, start.y + boundingBox.height)
        const midPoint = p.createVector(start.x+(end.x-start.x)/2, start.y+(end.y-start.y)/2)


        //p.rect(p.width - boundingBox.originX - boundingBox.width, boundingBox.originY, boundingBox.width, boundingBox.height)
        //mirror(start.x, start.y, end.x, end.y)
        //image(pigImg, start.x, start.y, start.x + boundingBox.width, start.y + boundingBox.height)
        // p.strokeWeight(40)
        // p.stroke(255, 0, 0);
        // p.point(start.x, start.y)
        // p.point(end.x, end.y)

        p.push();
        p.imageMode(p.CENTER)
        p.translate(midPoint.x, midPoint.y)
        p.scale(2)

        // draw image over face depending on how many faces have been detected
        if(i == 0) {
          p.image(pigImg, 0, 0, boundingBox.width, boundingBox.height)
        }

        else if(i == 1) {
          p.image(ghostImg, 0, 0, boundingBox.width, boundingBox.height)
        }

        else {
          p.image(ghostImg, 0, 0, boundingBox.width, boundingBox.height)
        }
        p.pop();
      
        // if there are 2 faces...
        if(faces.detections.length == 2) {
          
          p.stroke(0);
          p.strokeWeight(1);
          p.push()
          p.translate(p.width/2, p.height/2, 200)
          p.rotateY(p.frameCount/30)
          p.fill(230, 200, 0)
          p.textSize(100)
          p.text("amazing", 0, 0)
          p.pop();
          
        }
        // if there are 3 faces...
        else if(faces.detections.length == 3) {
          p.fill('blue' );
          p.stroke(0);
          p.strokeWeight(4);
          p.textSize(100);
          p.text("oh no", 200, 200)
        }
        

        // // draw keypoints
        // for (let j = 0; j < face.keypoints.length; j++) {
        //   const keypoint = p.createVector(
        //     p.width - face.keypoints[j].x * p.width,
        //     face.keypoints[j].y * p.height)
        //   p.stroke(180, 100, 100);
        //   p.strokeWeight(8)
        //   // p.point(keypoint.x, keypoint.y);
        //   p.square(keypoint.x, keypoint.y, 20);
        //   p.noStroke()
        //   p.textAlign(p.CENTER)
        //   p.textSize(20)
        //   p.fill(0, 0, 100)
        //   p.text(j, keypoint.x, keypoint.y)
        // }
      }
    }
    p.pop();
  };
  function mirror(startX, startY, endX, endY) {
    // draw rozin mirror
    capture.loadPixels();

    // ensure we're getting a capture feed before doing any operations on the feed
    if (capture.pixels.length > 0) {
      // tip: choose a number that divides evenly into your capture width (640)
      const stepSize = 10;

      // loop through the pixels of the camera feed, based on stepsize
      for (let y = startY; y < endY; y += stepSize) {
        for (let x = startX; x < endX; x += stepSize) {
          const index = (x + y * endX) * 4;

          const r = capture.pixels[index];
          const g = capture.pixels[index + 1];
          const b = capture.pixels[index + 2];

          // get the brightness of the current pixel by averaging the color values
          const brightness = (r + g + b) / 3
          const squareSize = p.map(brightness, 0, 255, 10, stepSize);

          p.noStroke();
          p.fill(r, g, b);
          // draw a rectangle using the color of the current pixel. The rectangle size is based on the brightness of pixel

          p.push();
          p.translate(x, y)
          // rotate(brightness);
          p.rect(0, 0, stepSize, stepSize);
          p.pop();
        }
      }
    }
  }
};

let myp5 = new p5(sketch);
