export class Point2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  sub(pt2d) {
    return new Point2D(this.x - pt2d.x, this.y - pt2d.y);
  }

  add(pt2d) {
    return new Point2D(this.x + pt2d.x, this.y + pt2d.y);
  }

  addScalar(scalar) {
    return new Point2D(this.x + scalar, this.y + scalar);
  }

  subScalar(scalar) {
    return this.addScalar(-scalar);
  }

  mul(scalar) {
    return new Point2D(this.x * scalar, this.y * scalar);
  }

  div(scalar) {
    if (scalar === 0) {
      return Infinity;
    } else {
      return this.mul(1 / scalar);
    }
  }

  dot(pt2d) {
    return this.x * pt2d.x + this.y * pt2d.y;
  }

  norm() {
    return Math.sqrt(this.dot(this));
  }

  normalize() {
    return this.div(this.norm());
  }

  orth() {
    return new Point2D(-this.y, this.x);
  }
}
