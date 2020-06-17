//

import * as dots from './dots';

var effectCanvas = document.querySelector('canvas');
var effectContext = effectCanvas.getContext('2d');

//var __image;
var image;

var video = document.createElement('video');

var videoCanvas = document.createElement('canvas');
var videoContext = videoCanvas.getContext('2d');

effectContext.imageSmoothingEnabled = false;
/*
addEventListener('resize', onResize, false);

function onResize() {
  effectCanvas.width = effectCanvas.offsetWidth;
  effectCanvas.height = effectCanvas.offsetHeight;
};

onResize();
//*/
readCamera();
//readImage("assets/basic.png");

function animationFrame() {
  requestAnimationFrame(animationFrame);

  videoContext.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  (!image) ?
    videoContext.drawImage(video, 0, 0) : videoContext.putImageData(image, 0, 0);

  var videoData = videoContext.getImageData(0, 0, videoCanvas.width, videoCanvas.height);

  var rotateY = -(mouseX - window.innerWidth / 2) / window.innerWidth * 100;
  var rotateX = (mouseY - window.innerHeight / 2) / window.innerHeight * 100;

  //

  var effectData = dots.calc(videoData, effectCanvas.width, effectCanvas.height, rotateX, rotateY);

  effectContext.clearRect(0, 0, effectContext.width, effectContext.height);
  effectContext.putImageData(effectData, 0, 0);

  //effectContext.putImageData(image, 0, 0);

}

function start() {
  dots.init(effectContext);
  animationFrame();
}

// aux


function readImage1(src) {
  var inputImage = new Image();
  inputImage.src = src;
  inputImage.onload = () => {


    var imageWidth = inputImage.width;
    var imageHeight = inputImage.height;

    var canvas = document.createElement('canvas');
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    var context = canvas.getContext('2d');
    context.drawImage(inputImage, 0, 0, inputImage.width, inputImage.height,
      0, 0, effectCanvas.offsetWidth, effectCanvas.offsetHeight);

    image = context.getImageData(0, 0, effectCanvas.offsetWidth, effectCanvas.offsetHeight);

    effectCanvas.width = imageWidth;
    effectCanvas.height = imageHeight;
    videoCanvas.width = imageWidth;
    videoCanvas.height = imageHeight;

    start();
  };
}

function readImage(src) {
  var inputImage = new Image();
  inputImage.src = src;
  inputImage.onload = () => {
    var imageWidth = inputImage.width;
    var imageHeight = inputImage.height;

    var canvas = document.createElement('canvas');
    canvas.width = imageWidth
    canvas.height = imageHeight;

    var context = canvas.getContext('2d');
    context.drawImage(inputImage, 0, 0);
    image = context.getImageData(0, 0, imageWidth, imageHeight);

    effectCanvas.width = imageWidth;
    effectCanvas.height = imageHeight;
    videoCanvas.width = imageWidth;
    videoCanvas.height = imageHeight;

    start();
  };
}

function readCamera() {
  navigator.mediaDevices.getUserMedia({
    video: {
      //     width: 1280,
      //    height: 720
      width: 640,
      height: 320
    }
  })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((e) =>
      console.warn(e)
    );

  video.addEventListener('loadedmetadata', function () {
    effectCanvas.width = video.videoWidth;
    effectCanvas.height = video.videoHeight;
    videoCanvas.width = video.videoWidth;
    videoCanvas.height = video.videoHeight;

    scaleCanvas(effectContext);
    scaleCanvas(videoContext);

    start();
  });
}

var zone = document.querySelector('.container');
zone.addEventListener('drop', onImageDrop, false);
zone.addEventListener('dragenter', (e) => e.preventDefault());
zone.addEventListener('dragover', (e) => e.preventDefault());

function onImageDrop(event) {
  event.stopPropagation();
  event.preventDefault();

  var dt = event.dataTransfer;
  var files = dt.files;

  var file = files[0];

  if (file.type.match(/^image/)) {
    console.log(file);
    var reader = new FileReader();
    reader.onload = function (e) {
      readImage(e.target.result)
    }
    reader.readAsDataURL(file);
  } else {
    console.warn('Incorrect file type:', file.name, file.type);
  }
}

function scaleCanvas(context) {
  let devicePixelRatio = window.devicePixelRatio || 1;
  let backingStoreRatio = context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;

  let ratio = devicePixelRatio / backingStoreRatio;

  if (devicePixelRatio !== backingStoreRatio) {
    var canvas = context.canvas;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';

    canvas.width = canvas.width * ratio;
    canvas.height = canvas.height * ratio;

    context.scale(ratio, ratio);
  }
}

// ctrl

window.addEventListener('mousemove', onMouseMove, false);

var mouseX = 0;
var mouseY = 0;

function onMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

window.addEventListener('keydown', onKeyDown, false);

var rmode = 0;
var rscale = 0.5;

function onKeyDown(event) {
  if (event.keyCode == 37) {
    rmode = (4 + rmode - 1) % 4;
    dots.sset(rmode, rscale);
  }
  if (event.keyCode == 39) {
    rmode = (4 + rmode + 1) % 4;
    dots.sset(rmode, rscale);
  }
  if (event.keyCode == 38) {
    rscale += 0.05;
    dots.sset(rmode, rscale);
  }
  if (event.keyCode == 40) {
    rscale -= 0.05;
    dots.sset(rmode, rscale);
  }
}