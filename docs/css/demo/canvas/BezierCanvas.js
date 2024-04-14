import {AssistNode} from "../OpNode/OpNodeStorage.js";
import {AnimationEvent} from "../Event/Event.js";
import {GravityKinematic, Kinematic, ParabolaKinematic, VelocityResolution} from "../Kinematic/Kinematic.js";
import {cubicBezierPointAtX, radiansToAngle} from "../utils/index.js";
import {EventListener, DragEvent} from '../Event/Event.js'
import {GlobuleModel} from '../Kinematic/GlobuleModel.js'

export class BezierCanvas {
  constructor({canvasEle, opNodeCon, dragEvent, ctx}) {
    this.opNodeCon = opNodeCon;
    this.canvasEle = canvasEle
    ///////
    this.startDotOpNode = this.startDot().opNode;
    this.endDotOpNode = this.endDot().opNode;
    this.cruxDotAOpNode = this.cruxDotA().opNode;
    this.cruxDotBOpNode = this.cruxDotB().opNode;
    this.lineAOpNode = this.lineA().opNode;
    this.lineBOpNode = this.lineB().opNode;
    this.bezierLine();
    ///////

  }
  _getWunit(){
    return this.canvasEle.width/20
  }
  _getHunit(){
    return this.canvasEle.height/10
  }
  startDot() {
    const ass = new AssistNode(this.opNodeCon);
    ass.arc(this._getWunit(), this._getHunit()*9, 5);
    ass.readOnly();
    ass.ctxFn((_ctx) => {
      _ctx.fillStyle = 'red';
    })
    ass.fill();
    ass.go();
    return ass;
  }

  endDot() {
    const ass = new AssistNode(this.opNodeCon);
    ass.arc(this._getWunit()*19, this._getHunit()*6, 5);
    ass.readOnly();
    ass.ctxFn((_ctx) => {
      _ctx.fillStyle = 'red';
    })
    ass.fill();
    ass.go();
    return ass;
  }

  cruxDotA() {
    const ass = new AssistNode(this.opNodeCon);
    ass.arc(this._getWunit()*5, this._getHunit()*9, 5);
    ass.fill();
    ass.go();
    return ass;
  }

  cruxDotB() {
    const ass = new AssistNode(this.opNodeCon);
    ass.arc(this._getWunit()*15, this._getHunit()*3, 5);
    ass.fill();
    ass.go();
    return ass;
  }

  lineA() {
    const ass = new AssistNode(this.opNodeCon);
    ass.ctxFn((ctx) => {
      ctx.moveTo(this.startDotOpNode.currentX, this.startDotOpNode.currentY);
      ctx.lineTo(this.cruxDotAOpNode.currentX, this.cruxDotAOpNode.currentY);
    })
    ass.other({zIndex: 50})
    ass.readOnly();
    ass.stroke();
    ass.go();
    return ass;
  }

  lineB() {
    const ass = new AssistNode(this.opNodeCon);
    ass.ctxFn((ctx) => {
      ctx.moveTo(this.endDotOpNode.currentX, this.endDotOpNode.currentY);
      ctx.lineTo(this.cruxDotBOpNode.currentX, this.cruxDotBOpNode.currentY);
    })
    ass.other({zIndex: 50})
    ass.readOnly();
    ass.stroke();
    ass.go();
    return ass;
  }

  bezierLine() {
    const ass = new AssistNode(this.opNodeCon);
    ass.ctxFn((ctx) => {
      ctx.moveTo(this.startDotOpNode.currentX, this.startDotOpNode.currentY);
      ctx.bezierCurveTo(
        this.cruxDotAOpNode.currentX, this.cruxDotAOpNode.currentY,
        this.cruxDotBOpNode.currentX, this.cruxDotBOpNode.currentY,
        this.endDotOpNode.currentX, this.endDotOpNode.currentY
      )
    });
    ass.other({zIndex: 50})
    ass.readOnly();
    ass.stroke();
    ass.go();

    return ass;
  }
}

export class GlobuleCanvas {
  constructor({canvasEle, opNodeCon, dragEvent, ctx}, bezierCanvas) {
    this.opNodeCon = opNodeCon;
    this.canvasEle = canvasEle
    this.bezierCanvas = bezierCanvas
    // 创建坠落的小球
    this.globuleAss = this.globule();
  }

  // 绘制小球
  static globuleRadius = 8
  // 像素与运动距离比例
  static s_scale = 100;

  globule() {
    const ass = new AssistNode(this.opNodeCon);
    ass.arc(200, 100, GlobuleCanvas.globuleRadius);
    ass.fill();
    ass.go();
    // 监听小球松开一刻
    EventListener.on(ass.opNode.event, `${DragEvent.eventPrefix}up`, () => {
      ass.readOnly();
      ass.go();
      const oldY = ass.opNode.currentY;
      const oldX = ass.opNode.currentX;
      // 动画开始
      this.strikeAnimationFn({x: oldX, y: oldY}, 3, Math.PI)
    })
    this.globuleOpNode = ass.opNode;
    return ass;
  }

  // 小球运动
  // strikeBefore
  // strikeAfter
  // centerCoords 圆心坐标
  // strikeCoords 开始运动时的坐标
  // v 初速度
  // radians 与重力方向的角度
  strikeAnimationFn = (centerCoords, v, radians) => {
    let animation
    // 速度分析
    const parabolaResolution = new VelocityResolution(v, radians)
    const _fn = (ae) => {
      const t = ae.passedSecond;
      const newCenterCoords = {
        x: centerCoords.x + (parabolaResolution.getX(t) * GlobuleCanvas.s_scale),
        y: centerCoords.y - (parabolaResolution.getY(t) * GlobuleCanvas.s_scale)
      }
      this.globuleOpNode.upCoords(newCenterCoords)
      this.opNodeCon.viewRedraw();
      // 走出屏幕就关闭；
      if (newCenterCoords.x > this.canvasEle.width + 100 || newCenterCoords.y > this.canvasEle.height + 100) {
        console.log('走出屏幕，关闭')
        animation.clear();
        this.globuleAss.clear();
        this.globule();
        return;
      }
      // 计算八边形模型
      const globuleOctagonCoords =
        (new GlobuleModel(newCenterCoords, GlobuleCanvas.globuleRadius))
          .getOctagonCoords();
      // 新的撞击,撞击点
      const newStrikeCoords = globuleOctagonCoords.find((_coords) => {
        const _y = this.currentCubicBezierPointAtX(_coords.x);
        return _y && (_coords.y >= _y) && Math.abs(newCenterCoords.y - centerCoords.y) > 0.5
      });
      /////
      if (newStrikeCoords) {
        // 获取撞击板子的2个点
        console.log('撞击')
        const boardCoords = this.operationBoardCoords(newStrikeCoords.x);
        if (!boardCoords) return;
        const parabolaKinematic = new ParabolaKinematic(
          boardCoords[0],
          boardCoords[1],
          {x: 0, y: 0},
          {x: parabolaResolution.getXv(), y: -1 * parabolaResolution.getYv(t)},
          parabolaResolution.getV(t));
        animation.clear();
        // 撞击后新速度比较小停止运动
        if (parabolaKinematic.newV < 0.9) {
          console.log('速度比较小')
          this.rollAnimationFn(parabolaKinematic.newV, newCenterCoords, parabolaKinematic.newVRadians);
          return;
        }
        return this.strikeAnimationFn(
          {x:newCenterCoords.x,y:newCenterCoords.y-0.8},
          parabolaKinematic.newV,
          parabolaKinematic.newVRadians
        )
      }
    }
    animation = new AnimationEvent(_fn);
    animation.play();
  }
  rollAnimationFn = (v, centerCoords) => {
    let animation;
    let maxY = 0
    const _y1 = this.currentCubicBezierPointAtX(centerCoords.x-2);
    const _y2 = this.currentCubicBezierPointAtX(centerCoords.x+2);
    // 左右方向
    let direction
    if(_y1<=_y2){
      direction = 1
    }else{
      direction = -1
    }
    const _fn = (ae) => {
      const t = ae.passedSecond;
      const kinematic = new Kinematic(0.4, v/2);
      const dX = direction*kinematic.getS(t);
      const _y = this.currentCubicBezierPointAtX(centerCoords.x + (dX* GlobuleCanvas.s_scale));
      const centerY = _y - GlobuleCanvas.globuleRadius;
      if (centerY < maxY) {
        console.log('打开抓取')
        this.globuleAss.capture();
        this.globuleAss.go();
        animation.clear();
        return
      }
      maxY = centerY
      this.globuleOpNode.upCoords({
        x: centerCoords.x + (dX* GlobuleCanvas.s_scale),
        y: centerY
      })
      this.opNodeCon.viewRedraw();
    }
    animation = new AnimationEvent(_fn);
    animation.play();
  }

  // 获取板子上的两个点
  operationBoardCoords(strikeCoordsX) {
    const strikeAY = this.currentCubicBezierPointAtX(strikeCoordsX - 4);
    const strikeBY = this.currentCubicBezierPointAtX(strikeCoordsX + 4);
    const res = [
      {x: strikeCoordsX - 4, y: strikeAY},
      {x: strikeCoordsX + 4, y: strikeBY},
    ]
    if (
      typeof res[0].x !== "number" || typeof res[0].y !== "number"
      || typeof res[1].x !== "number" || typeof res[1].y !== "number"
    ) return null
    return res
  }

  getCurrentCoordsByNode(opNode) {
    return {
      x: opNode.currentX,
      y: opNode.currentY
    }
  }

  currentCubicBezierPointAtX(x) {
    return cubicBezierPointAtX(x,
      this.getCurrentCoordsByNode(this.bezierCanvas.startDotOpNode),
      this.getCurrentCoordsByNode(this.bezierCanvas.cruxDotAOpNode),
      this.getCurrentCoordsByNode(this.bezierCanvas.cruxDotBOpNode),
      this.getCurrentCoordsByNode(this.bezierCanvas.endDotOpNode),
    )
  }

}
