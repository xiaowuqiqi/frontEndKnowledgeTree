export class Kinematic {
  a = 0
  v_0 = 0

  constructor(a = 0, v_0 = 0) {
    this.a = a
    this.v_0 = v_0
  }

  getS(t) {
    if (t < 0) return 0;
    return (this.v_0 * t) + (1 / 2 * this.a * t * t)
  }

  getV(t) {
    if (t < 0) return 0;
    return this.v_0 + (t * this.a);
  }
}

export class GravityKinematic extends Kinematic {
  static g = 9.8 // N/kg
  constructor(v_0 = 0) {
    super(GravityKinematic.g, v_0);
  }

  // 受重力影响运动距离
  getYSByGravity(t) {
    return this.getS(t)
  }
}

// 撞击后速度角度计算
export class ParabolaKinematic {
  // boardRadians 碰撞面与重力的角度，如果angle为0方向向下，为 Math.PI 方向向上。
  boardRadians = 0
  // vRadians 碰撞前速度与重力的角度，如果angle为0方向向下，为 Math.PI 方向向上。
  vRadians = 0
  // 新的速度的角
  newVRadians = 0
  // 碰撞恢复系数(篮球约为0.6)
  cor = 0.9

  startV = 0


  // 坐标只用于计算与重力的逆时针夹角
  // 传入挡板的随机两个坐标
  // 传入速度的随机两个坐标，坐标传入顺序，一定是速度向量上的顺序递增的坐标
  constructor(boardCoordsA, boardCoordsB, vCoordsA, vCoordsB, startV) {
    this._initBoardRadians(boardCoordsA, boardCoordsB)
    this._initVRadians(vCoordsA, vCoordsB)
    this._initNewVRadians(boardCoordsA, boardCoordsB, vCoordsA, vCoordsB)
    this.startV = startV
  }

  _initBoardRadians(boardCoordsA, boardCoordsB) {
    if (boardCoordsA.x > boardCoordsB.x) {
      [boardCoordsA, boardCoordsB] = [boardCoordsB, boardCoordsA];
    }
    const a = boardCoordsB.x - boardCoordsA.x;
    const b = boardCoordsA.y - boardCoordsB.y;
    // Math.atan2 从x轴正轴计算逆时针角度递增
    this.boardRadians = Math.atan2(b, a) + (Math.PI / 2);
    if (this.boardRadians < 0) {
      this.boardRadians = Math.PI + this.boardRadians;
    }
  }

  // // 速度角度计算
  _initVRadians(vCoordsA, vCoordsB) {
    // 建立坐标系，vCoordsB为原点，速度所在直线的坐标为(a,b)
    const a = vCoordsA.x - vCoordsB.x;
    const b = vCoordsB.y - vCoordsA.y;
    // Math.atan2 从x轴正轴计算逆时针角度递增
    this.vRadians = Math.atan2(b, a) + (Math.PI / 2);
  }

  // 碰撞后速度角度
  _initNewVRadians(boardCoordsA, boardCoordsB, vCoordsA, vCoordsB) {
    if (boardCoordsA.x > boardCoordsB.x) {
      [boardCoordsA, boardCoordsB] = [boardCoordsB, boardCoordsA];
    }
    // 板子的斜线函数为 y = k*x
    const k = (boardCoordsA.y - boardCoordsB.y) / (boardCoordsB.x - boardCoordsA.x);
    // 板子法线的斜线函数 y = -1/k*x
    const m = -1 / k;
    // 知道入射速度向量，作法线的对称向量，当入射速度上一个点为(a,b)时，对称点的坐标为 (a1,b1)
    const a = vCoordsA.x - vCoordsB.x;
    const b = vCoordsB.y - vCoordsA.y; // vCoordsB平移到坐标系原点，vCoordsA也要作相应平移
    // 法线上点坐标为((a1+a)/2,(b1+b)/2)
    // (a1+a)*m = (b1+b)
    // 经过三点的公式有
    // a1*(-1/m)+c = b1
    // a*(-1/m)+c = b
    // a1*(-1/m)+b-a*(-1/m)= b1

    // (a1+a)*m =a1*(-1/m)+b-a*(-1/m)+b
    // a1*m+a*m = a1*(-1/m)+b-a*(-1/m)+b
    // a1*m-a1*(-1/m)=b-a*(-1/m)+b-a*m
    // a1(m+(1/m))=b-a*(-1/m)+b-a*m
    const a1 = (b - (a * (-1 / m)) + b - (a * m)) / (m + (1 / m))
    const b1 = (a1 + a) * m - b
    this.newVRadians = Math.atan2(b1, a1) + (Math.PI / 2);
  }

  get newV() {
    return this.startV * this.cor
  }


// 测试数据
// const b = [{x: 100, y: 100}, {x: 200, y: 0}]
// const v = [{x:1, y:1}, {x: 1, y: 2}]
// const v = [{x:1, y:1-Math.sqrt(3)}, {x: 0, y: 1}]
}

// 速度分解
export class VelocityResolution {
  // 速度大小，与重力夹角
  constructor(v0, v0Radians) {
    this.v = Math.abs(v0);
    this.vRadians = v0Radians;
  }

  getV(t) {
    return Math.sqrt(this.getXv() ** 2 + this.getYv(t) ** 2);
  }

  getRadians(t) {
    return Math.atan(this.getYv(t) / this.getXv())
  }

  getXv() {
    // 正值向右，负值向左
    return this.v * Math.sin(this.vRadians)
  }

  getYv(t) {
    // 负值向下，正值向上
    const v0 = this.v * Math.cos(this.vRadians);
    const gra = new GravityKinematic(v0)
    return -1 * gra.getV(t)
  }

  getX(t) {
    const kin = new Kinematic(0, this.getXv())
    return kin.getS(t)
  }

  getY(t) {
    const gra = new GravityKinematic(this.getYv(t))
    return gra.getS(t)
  }
}


