import {angleToRadians} from "../utils/index.js";

export class GlobuleModel {
  constructor(centerCoords, radius) {
    this.centerCoords = centerCoords;
    this.radius = radius
  }

  // 八边形坐标
  getOctagonCoords() {
    const _x = this.centerCoords.x
    const _y = this.centerCoords.y
    const la = {
      x: _x - this.radius,
      y: _y
    }
    const lb = {
      x: _x - Math.cos(angleToRadians(25)) * this.radius,
      y: _y - Math.sin(angleToRadians(25)) * this.radius
    }
    const t = {
      x: _x,
      y: _y - this.radius
    }
    const ra = {
      x: _x + Math.cos(angleToRadians(25)) * this.radius,
      y: _y - Math.sin(angleToRadians(25)) * this.radius
    }
    const rb = {
      x: _x + this.radius,
      y: _y
    }
    const rc = {
      x: _x + Math.cos(angleToRadians(25)) * this.radius,
      y: _y + Math.sin(angleToRadians(25)) * this.radius
    }
    const b = {
      x: _x,
      y: _y + this.radius
    }
    const lc = {
      x: _x - Math.cos(angleToRadians(25)) * this.radius,
      y: _y + Math.sin(angleToRadians(25)) * this.radius
    }
    return [la, lb, t, ra, rb, rc, b, lc];
  }
}
