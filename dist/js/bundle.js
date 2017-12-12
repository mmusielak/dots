/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dots__ = __webpack_require__(1);
//



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
*/
//readCamera();
readImage("assets/basic.png");

function animationFrame() {
  requestAnimationFrame(animationFrame);

  videoContext.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
  (!image) ?
  videoContext.drawImage(video, 0, 0): videoContext.putImageData(image, 0, 0);

  var videoData = videoContext.getImageData(0, 0, videoCanvas.width, videoCanvas.height);

  var rotateY = -(mouseX - window.innerWidth / 2) / window.innerWidth * 100;
  var rotateX = (mouseY - window.innerHeight / 2) / window.innerHeight * 100;

  //

  var effectData = __WEBPACK_IMPORTED_MODULE_0__dots__["a" /* calc */](videoData, effectCanvas.width, effectCanvas.height, rotateX, rotateY);

  effectContext.clearRect(0, 0, effectContext.width, effectContext.height);
  effectContext.putImageData(effectData, 0, 0);

  //effectContext.putImageData(image, 0, 0);

}

function start() {
  __WEBPACK_IMPORTED_MODULE_0__dots__["b" /* init */](effectContext);
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
  navigator.getUserMedia({
    video: {
      width: 1280,
      height: 720
      //width: 640,
      //height: 320
    }
  }, (stream) => {
    video.src = window.URL.createObjectURL(stream);
  }, function (e) {
    console.warn(e);
  });

  video.addEventListener('loadedmetadata', function () {
    effectCanvas.width = video.videoWidth;
    effectCanvas.height = video.videoHeight;
    videoCanvas.width = video.videoWidth;
    videoCanvas.height = video.videoHeight;

    //scaleCanvas(effectContext);
    //scaleCanvas(videoContext);

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
    __WEBPACK_IMPORTED_MODULE_0__dots__["c" /* sset */](rmode, rscale);
  }
  if (event.keyCode == 39) {
    rmode = (4 + rmode + 1) % 4;
    __WEBPACK_IMPORTED_MODULE_0__dots__["c" /* sset */](rmode, rscale);
  }
  if (event.keyCode == 38) {
    rscale += 0.05;
    __WEBPACK_IMPORTED_MODULE_0__dots__["c" /* sset */](rmode, rscale);
  }
  if (event.keyCode == 40) {
    rscale -= 0.05;
    __WEBPACK_IMPORTED_MODULE_0__dots__["c" /* sset */](rmode, rscale);
  }
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return sset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return calc; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__matrix__ = __webpack_require__(2);


var matrix = new __WEBPACK_IMPORTED_MODULE_0__matrix__["a" /* Matrix3D */]();

var imageData;

var buf;
var buf8;
var pixels;

function init(context) {
  imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

  buf = new ArrayBuffer(imageData.data.length);
  buf8 = new Uint8ClampedArray(buf);
  pixels = new Uint32Array(buf);
}

var SCALE = 1;
var DEPTH = .5;
var RENDER_MODE = 3;

function sset(render, depth) {
  DEPTH = depth;
  RENDER_MODE = render;
}

function calc(image, width, height, rotateX, rotateY) {
  var buff = new Uint32Array(image.data.buffer);
  var vectors = new Int32Array(width * height * 3);

  // create

  var color;
  var R, G, B, Y;

  for (var i = 0, j = 0; i < buff.length; i++) {
    color = buff[i];

    R = (color >> 16) & 0xFF;
    G = (color >> 8) & 0xFF;
    B = (color) & 0xFF;

    // ITU BT.709 defines color luminance as
    //   Y = 0.2126 R + 0.7152 G + 0.0722 B
    // Here we use a fast approximation which translates to:
    //   Y = 0.3750 R + 0.5000 G + 0.1250 B
    // [source: https://stackoverflow.com/questions/596216]
    Y = (R + R + R + G + G + G + G + B >> 3) * DEPTH;

    vectors[j++] = i % width * SCALE | 0;
    vectors[j++] = i / width * SCALE | 0;
    vectors[j++] = -Y * SCALE | 0;
  }

  // calculate

  var axisX = {
    x: 1,
    y: 0,
    z: 0
  };
  var axisY = {
    x: 0,
    y: 1,
    z: 0.15
  };
  var pivot = {
    x: (width / 2) * SCALE,
    y: (height / 2) * SCALE
  };

  matrix.identity();
  matrix.rotate(rotateX, axisX, pivot);
  matrix.rotate(rotateY, axisY, pivot);
  matrix.transform(vectors);

  // invalidate

  var SHADE = 0x333333;
  var MAXCOLOR = 0xFFFFFF - SHADE;

  for (var i = 0; i < pixels.length; i++) {
    pixels[i] = 0xFF << 24;
  }

  var c;
  var cz;
  var cc;

  for (var i = 0; i < vectors.length; i += 3) {
    var x = vectors[i * 3] | 0;
    var y = vectors[i * 3 + 1] | 0;
    var xyi = (x + y * width);

    if (x >= width || x < 0 || y >= height || y < 0) {
      continue;
    }

    if (RENDER_MODE == 5) {
      pixels[xyi] = buff[i];
    }
    if (RENDER_MODE == 1) {
      cz = vectors[i * 3 + 2];
      cc = pixels[xyi] & 0xFFFFFF;
      pixels[xyi] = cc < MAXCOLOR ? cc + SHADE : MAXCOLOR;
    }
    if (RENDER_MODE == 2) {
      cz = vectors[i * 3 + 2];
      c = 16 - cz / 100 * 8;
      cc = pixels[xyi];
      R = Math.max(0, Math.min(0x9F, c + ((cc >> 16) & 0xFF)));
      G = Math.max(0, Math.min(0x9F, c + ((cc >> 8) & 0xFF)));
      B = Math.max(0, Math.min(0x9F, c + ((cc) & 0xFF)));
      pixels[xyi] = (0xFF << 24 | R << 16 | G << 8 | B);
    }
    if (RENDER_MODE == 3) {
      c = buff[i];
      cc = pixels[xyi];
      R = Math.max(0, Math.min(0xFF, ((c >> 16) & 0xFF) + ((cc >> 16) & 0xFF)));
      G = Math.max(0, Math.min(0xFF, ((c >> 8) & 0xFF) + ((cc >> 8) & 0xFF)));
      B = Math.max(0, Math.min(0xFF, ((c) & 0xFF) + ((cc) & 0xFF)));
      pixels[xyi] = (0xFF << 24 | R << 16 | G << 8 | B);
    }
  }

  imageData.data.set(buf8);

  return imageData;
}



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Matrix3D; });
function Matrix3D() {
  // set default values
  this.identity();
}

Matrix3D.prototype.identity = function () {
  this.m11 = 1;
  this.m12 = 0;
  this.m13 = 0;
  this.m14 = 0;
  this.m21 = 0;
  this.m22 = 1;
  this.m23 = 0;
  this.m24 = 0;
  this.m31 = 0;
  this.m32 = 0;
  this.m33 = 1;
  this.m34 = 0;
  this.m41 = 0;
  this.m42 = 0;
  this.m43 = 0;
  this.m44 = 1;
};

Matrix3D.prototype.rotate = function (degrees, axis, pivot) {
  var tx = pivot.x || 0;
  var ty = pivot.y || 0;
  var tz = pivot.z || 0;

  var cos = Math.cos(degrees * Math.PI / 180);
  var sin = Math.sin(degrees * Math.PI / 180);

  var x = axis.x || 0;
  var y = axis.y || 0;
  var z = axis.z || 0;

  var x2 = x * x;
  var y2 = y * y;
  var z2 = z * z;

  var l2 = x2 + y2 + z2;

  // normalize

  var l = Math.sqrt(l2);
  x /= l;
  y /= l;
  z /= l;
  x2 /= l2;
  y2 /= l2;
  z2 /= l2;

  // cache matrix

  var a11 = this.m11;
  var a12 = this.m12;
  var a13 = this.m13;
  var a14 = this.m14;
  var a21 = this.m21;
  var a22 = this.m22;
  var a23 = this.m23;
  var a24 = this.m24;
  var a31 = this.m31;
  var a32 = this.m32;
  var a33 = this.m33;
  var a34 = this.m34;

  // rotation matrix

  var b11 = x2 + (y2 + z2) * cos;
  var b12 = x * y * (1 - cos) - z * sin;
  var b13 = x * z * (1 - cos) + y * sin;
  var b14 = (tx * (y2 + z2) - x * (ty * y + tz * z)) * (1 - cos) + (ty * z - tz * y) * sin;
  var b21 = x * y * (1 - cos) + z * sin;
  var b22 = y2 + (x2 + z2) * cos;
  var b23 = y * z * (1 - cos) - x * sin;
  var b24 = (ty * (x2 + z2) - y * (tx * x + tz * z)) * (1 - cos) + (tz * x - tx * z) * sin;
  var b31 = x * z * (1 - cos) - y * sin;
  var b32 = y * z * (1 - cos) + x * sin;
  var b33 = z2 + (x2 + y2) * cos;
  var b34 = (tz * (x2 + y2) - z * (tx * x + ty * y)) * (1 - cos) + (tx * y - ty * x) * sin;

  // mult

  this.m11 = b11;
  this.m21 = a22 * b21 + a23 * b31;
  this.m31 = a32 * b21 + a33 * b31;
  this.m41 = 0;
  this.m12 = b12;
  this.m22 = a22 * b22 + a23 * b32;
  this.m32 = a32 * b22 + a33 * b32;
  this.m42 = 0;
  this.m13 = b13;
  this.m23 = a22 * b23 + a23 * b33;
  this.m33 = a32 * b23 + a33 * b33;
  this.m43 = 0;
  this.m14 = b14;
  this.m24 = a22 * b24 + a23 * b34 + a24;
  this.m34 = a32 * b24 + a33 * b34 + a34;
  this.m44 = 1;
};

Matrix3D.prototype.transform = function (vectors) {
  for (var i = 0, l = vectors.length; i < l; i += 3) {
    var x = vectors[i + 0];
    var y = vectors[i + 1];
    var z = vectors[i + 2];
    vectors[i + 0] = this.m11 * x + this.m12 * y + this.m13 * z + this.m14;
    vectors[i + 1] = this.m21 * x + this.m22 * y + this.m23 * z + this.m24;
    vectors[i + 2] = this.m31 * x + this.m32 * y + this.m33 * z + this.m34;
  }
}

Matrix3D.prototype.transformVectors2 = function (vin, vout) {
  var m11 = this.m11;
  var m12 = this.m12;
  var m13 = this.m13;
  var m14 = this.m14;
  var m21 = this.m21;
  var m22 = this.m22;
  var m23 = this.m23;
  var m24 = this.m24;
  var m31 = this.m31;
  var m32 = this.m32;
  var m33 = this.m33;
  var m34 = this.m34;

  for (var i = 0, l = vin.length; i < l; i += 3) {
    var x = vin[i + 0];
    var y = vin[i + 1];
    var z = vin[i + 2];
    vout[i + 0] = m11 * x + m12 * y + m13 * z + m14;
    vout[i + 1] = m21 * x + m22 * y + m23 * z + m24;
    vout[i + 2] = m31 * x + m32 * y + m33 * z + m34;
  }
};



/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map