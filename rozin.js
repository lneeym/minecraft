// Rozin Mirror Starter

const cam_w = 640;
const cam_h = 480;
let capture;

function setup() {
  // everything here runs once when the page loads/the sketch starts
  createCanvas(cam_w, cam_h)
  capture = createCapture(VIDEO)
  capture.size(cam_w, cam_h)
  capture.hide();
  angleMode(DEGREES);
  rectMode(CENTER)
  
}

function draw() {
  //background(255, 0, 0);
  
  clear();

  capture.loadPixels();

  // ensure we're getting a capture feed before doing any operations on the feed
  if (capture.pixels.length > 0) {
    mirror();
  }
}

// Edit the mirror function below
function mirror() {
  // tip: choose a number that divides evenly into your capture width (640)
  const stepSize = 24;

  // loop through the pixels of the camera feed, based on stepsize
  for (let y = 0; y < capture.height; y += stepSize) {
    for (let x = 0; x < capture.width; x += stepSize) {
      const index = (x + y * capture.width) * 4;

      const r = capture.pixels[index];
      const g = capture.pixels[index + 1];
      const b = capture.pixels[index + 2];

      // get the brightness of the current pixel by averaging the color values
      const brightness = (r + g + b) / 3
      const squareSize = map(brightness, 0, 255, 10, stepSize);

      noStroke();
      fill(r, g, b);
      // draw a rectangle using the color of the current pixel. The rectangle size is based on the brightness of pixel
      
      push();
      translate(x, y)
      // rotate(brightness);
      rect(0, 0, stepSize, stepSize);
      pop();
    }
  }
}
