import {
  Matrix3D
} from './matrix';

var matrix = new Matrix3D();

var imageData;

var buf;
var buf8;
var zbuf;
var zbuf8;
var pixels;

function init(context) {
  imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

  buf = new ArrayBuffer(imageData.data.length);
  buf8 = new Uint8ClampedArray(buf);
  zbuf = new ArrayBuffer(imageData.data.length);
  zbuf8 = new Uint8ClampedArray(zbuf);

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

export {
  init,
  sset,
  calc
}