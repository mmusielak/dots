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

  //  var a11 = this.m11;
  //  var a12 = this.m12;
  //  var a13 = this.m13;
  //  var a14 = this.m14;
  //  var a21 = this.m21;
  var a22 = this.m22;
  var a23 = this.m23;
  var a24 = this.m24;
  //  var a31 = this.m31;
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

export {
  Matrix3D
};