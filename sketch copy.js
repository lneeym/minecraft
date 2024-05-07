import { subscribeToResults, w, h } from "./detection.js";

let faces;
subscribeToResults((results) => {
  faces = results;
});

const cam_w = 640;
const cam_h = 480;
let capture;

p.preload() = function() {
  
}

// Treat everything inside of 'sketch' as a regular p5.js sketch. put p. in front of anything that is a built-in p5.js function
let sketch = function (p) {
  p.setup = function () {
    p.createCanvas(w, h);
    // p.colorMode(p.HSB);
    capture = p.createCapture(p.VIDEO)
    capture.size(cam_w, cam_h)
    capture.hide();
  };

  p.draw = function () {
    p.clear();

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

        
        //p.rect(p.width - boundingBox.originX - boundingBox.width, boundingBox.originY, boundingBox.width, boundingBox.height)
        //mirror(start.x, start.y, end.x, end.y)
        //image(img, start.x, start.y, start.x + boundingBox.width, start.y + boundingBox.height)
        p.strokeWeight(40)
        p.stroke(255, 0, 0);
        p.point(start.x, start.y)
        p.point(end.x, end.y)
        
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
