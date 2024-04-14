//注册节点
export class OpNode {
  /**
   * x,y 表示节点区域的左上角的坐标，该坐标相对于 canvas
   * viewFn 绘制的图形
   *
   * translateCoords 用于移动中
   * oldTranslateCoords 用于结束移动时，固定translateCoords这个值
   */
  translateCoords = {x: 0, y: 0}
  oldTranslateCoords = {x: 0, y: 0}

  readOnly = false // 是否关闭拖拽功能
  zIndex = 0 // 层级
  id
  event = {}

  constructor(ctx, x, y, w, h, viewFn, other = {}) {
    this.oldX = x;
    this.oldY = y;
    this.w = w;
    this.h = h;
    this.ctx = ctx;
    this.viewFn = viewFn;
    this.setOther(other);
    if (!this.id) {
      this.id = Math.random().toString().slice(2);
    }
  }

  setOther(other = {}) {
    for (let k in other) {
      this[k] = other[k];
    }
  }

  get x() {
    return this.oldX + this.translateCoords.x + this.oldTranslateCoords.x
  }

  get y() {
    return this.oldY + this.translateCoords.y + this.oldTranslateCoords.y
  }

  upCoords({x, y}) {
    this.oldTranslateCoords.x = x - this.oldX - (this.w / 2);
    this.oldTranslateCoords.y = y - this.oldY - (this.h / 2);
  }

  get currentX() {
    return this.x + (this.w / 2)
  }

  get currentY() {
    return this.y + (this.h / 2)
  }

  setTranslateCoords(x, y) {
    this.translateCoords.x = x || 0
    this.translateCoords.y = y || 0
  }

  // 拖拽时，是通过 translate 实现的,如果想要清除 translate 值执行这个方法
  clearTranslateCoords() {
    this.translateCoords = {x: 0, y: 0};
    this.oldTranslateCoords = {x: 0, y: 0};
    this.ctx.translate(0, 0);
  }

  handleFixedTranslateCoords() {
    this.oldTranslateCoords.x += this.translateCoords.x;
    this.oldTranslateCoords.y += this.translateCoords.y;
    this.translateCoords.x = 0;
    this.translateCoords.y = 0;
  }

  setZindex(zIndex = 0) {
    this.zIndex = zIndex
  }

  viewFn(newX, newY, opNode) {
  }

  handleViewFn() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(
      this.translateCoords.x + this.oldTranslateCoords.x,
      this.translateCoords.y + this.oldTranslateCoords.y,
    )
    this.viewFn(this.x, this.y, this);
    this.ctx.closePath();
    this.ctx.restore();
  }

  /**
   * 输入坐标是否在节点区域内
   * */
  isIn(a_x, a_y) {
    if (
      a_x - this.x >= 0 && a_y - this.y >= 0 &&
      a_x <= this.x + this.w && a_y <= this.y + this.h
    ) return true;
    return false
  }

}

// 节点控制器
export class OpNodeCon {
  list = []
  ctx = null
  ele = null

  constructor(ele, ctx) {
    this.ctx = ctx
    this.ele = ele
  }


  createOpNode(x, y, w, h, viewFn, other = {}) {
    const opNodeByMaxZIndex = this.getOpNodeByMaxZIndex() || {zIndex: 100}
    if (!Number.isInteger(other.zIndex) && opNodeByMaxZIndex) {
      other.zIndex = opNodeByMaxZIndex.zIndex + 1
    }
    const opNode = new OpNode(this.ctx, x, y, w, h, viewFn, {
      ...other,
    })
    this.list.push(opNode);
    this.upDateListByZIndex(); // 更新 list 顺序，按照 zIndex 排序
    this.viewRedraw();
    return opNode;
  }

  delOpNode(id) {
    const delOpNodeIndex = this.list.findIndex(_opNode => id === _opNode.id)
    if (delOpNodeIndex < 0) return;
    this.list.splice(delOpNodeIndex, 1);
  }

  // 重绘所有 opNode
  viewRedraw() {
    this.ctx.clearRect(0, 0, this.ele.width, this.ele.height);
    this.list.forEach((_opNode) => {
      _opNode.handleViewFn();
    })
  }

  // 升序
  upDateListByZIndex() {
    const list = this.list;
    if (!list.length) return;
    this.list = list.sort((a, b) => a.zIndex - b.zIndex);
  }

  // 找最大的 ZIndex 节点出来
  getOpNodeByMaxZIndex() {
    const list = this.list;
    if (!list.length) return null;
    return list.reduce((totalOpNode, _opNode) =>
        _opNode.zIndex > totalOpNode.zIndex ? _opNode : totalOpNode
      , list[0])
  }

  // 选择符合坐标的opNode节点出来
  getOpNodeByFitCoords(x, y) {
    const list = this.list;
    if (!list.length) return null;
    return [...list].reverse().find((_opNode) => {
      return _opNode.isIn(x, y) && !_opNode.readOnly;
    }, list[0])
  }
}

export class AssistNode {
  opNode
  _canvasViewList = []
  _other = {}
  _createOpNodeParam = [0, 0, 0, 0];

  constructor(opNodeCon) {
    this.ctx = opNodeCon.ctx
    this.opNodeCon = opNodeCon
  }

  clear() {
    if (this.opNode)
      this.opNodeCon.delOpNode(this.opNode.id)
  }

  pushStep(step = () => {
  }) {
    this._canvasViewList.push(step)
  }

  other(other) {
    this._other = other;
  }

  readOnly() {
    this._other.readOnly = true
  }
  capture() {
    this._other.readOnly = false
  }
  go() {
    if (this.opNode) {
      this.opNode.setOther(this._other)
      this.opNodeCon.viewRedraw();
    } else {
      this.opNode = this.opNodeCon.createOpNode(...this._createOpNodeParam, () => {
        for (let i = 0; i < this._canvasViewList.length; i++) {
          this._canvasViewList[i]()
        }
      }, this._other);
    }
  }

  arc(arcX, arcY, arcR) {
    this.pushStep(() => this.ctx.arc(arcX, arcY, arcR, 0, 2 * Math.PI))
    this._createOpNodeParam = [arcX - arcR, arcY - arcR, 2 * arcR, 2 * arcR]
  }

  setCreateOpNodeParam(x, y, w, h) {
    this._createOpNodeParam = [x, y, w, h]
  }

  ctxFn(fn = () => {
  }) {
    this.pushStep(() => fn(this.ctx))
  }

  fill() {
    this.pushStep(() => this.ctx.fill());
  }

  stroke() {
    this.pushStep(() => this.ctx.stroke());
  }
}
