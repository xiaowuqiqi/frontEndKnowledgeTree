import {requestAnimationFrame, cancelAnimationFrame, getUUId} from "../utils/index.js";

export class EventListener {
  opNodeCon

  constructor(element, opNodeCon) {
    this.ele = element
    this.opNodeCon = opNodeCon;
  }

  ele = null;

  static getDocumentFromElement(el) {
    return el.ownerDocument || null
  };


  // 事件监听机制
  static emit(data, eventName) {
    if (data._canEvent&&data._canEvent[eventName + '_emitFnMap']) {
      const map = data._canEvent[eventName + '_emitFnMap'];
        [...map.values()].forEach(fn => fn(data));
    }
  }
  // onNode.on(eventName,fn)
  static on(data, eventName, fn) {
    if (!data._canEvent) {
      data._canEvent = {}
    }
    if (!data._canEvent[eventName + '_emitFnMap'])
      data._canEvent[eventName + '_emitFnMap'] = new Map();

    data._canEvent[eventName + '_emitFnMap'].set(fn, fn);
  }

  static unOn(data, eventName, fn) {
    data._canEvent[eventName + '_emitFnMap'].delete(fn);
  }

  static addListener(ele, ...args) {
    ele.addEventListener(...args)
  };

  static removeListener(ele, ...args) {
    ele.removeEventListener(...args)
  };

  static eventOptions = {passive: false}

  getBoundingClientRect() {
    return this.ele.getBoundingClientRect()
  }

  // 获取距离canvas的坐标
  getMouseCoords(e, isEleRange = true) {
    const bcr = this.getBoundingClientRect()
    let diff_x = e.clientX - bcr.x
    let diff_y = e.clientY - bcr.y
    if (isEleRange) {
      if (diff_x < 0) diff_x = 0
      if (diff_y < 0) diff_y = 0
      if (diff_x > this.ele.width) diff_x = this.ele.width
      if (diff_y > this.ele.height) diff_y = this.ele.height
    }
    return {
      x: diff_x, y: diff_y
    }
  }


}

export class DragAction {
  constructor(element) {
    this.ele = element;
  }

  oldMouseCoords = null
  // diffCoords = null
  currentOpNode = null

  clear() {
    this.oldMouseCoords = null
    // this.diffCoords = null
    this.currentOpNode = null
  }

  down(e, et, opNodeCon) {
    this.clear();
    const mouseCoords = et.getMouseCoords(e);
    this.oldMouseCoords = mouseCoords;
    const opNode = opNodeCon.getOpNodeByFitCoords(mouseCoords.x, mouseCoords.y);
    if (!opNode) return false;
    // 距离节点左上角的坐标
    // this.diffCoords = opNode.getDiffCoords(mouseCoords.x, mouseCoords.y);
    this.currentOpNode = opNode;
    EventListener.emit(this.currentOpNode.event,`${DragEvent.eventPrefix}down`);
    return true
  }

  move(e, et, opNodeCon) {
    if (!this.currentOpNode) return false;
    EventListener.emit(this.currentOpNode.event,`${DragEvent.eventPrefix}move`);
    const mouseCoords = et.getMouseCoords(e);
    this.currentOpNode.setTranslateCoords(
      mouseCoords.x - this.oldMouseCoords.x,
      mouseCoords.y - this.oldMouseCoords.y
    );
    opNodeCon.viewRedraw();
    return true
  }

  up(e, et, opNodeCon) {
    if (!this.currentOpNode) return false;
    EventListener.emit(this.currentOpNode.event,`${DragEvent.eventPrefix}up`);
    this.currentOpNode.handleFixedTranslateCoords();
    return true
  }
}

export class DragEvent extends EventListener {
  constructor(element, opNodeCon) {
    super(element, opNodeCon);
    this.ele = element;
    this.dragAction = new DragAction(element);
    this.opNodeCon = opNodeCon;
  }

  static eventPrefix = 'mouse' // 'pointer'

  handle = (e) => {
    this.onMouseDown(e);
  }

  onMouseMove = (e) => {
    e.preventDefault();
    this.dragAction.move(e, this, this.opNodeCon)
  };

  onMouseUp = (e) => {
    this.dragAction.up(e, this, this.opNodeCon)
    const canvasElement = this.ele
    const doc = EventListener.getDocumentFromElement(canvasElement);
    EventListener.removeListener(
      doc,
      `${DragEvent.eventPrefix}up`,
      this.onMouseUp,
      EventListener.eventOptions
    );
    EventListener.removeListener(
      doc,
      `${DragEvent.eventPrefix}move`,
      this.onMouseMove,
      EventListener.eventOptions
    );

  };

  onMouseDown = (e) => {
    this.dragAction.down(e, this, this.opNodeCon)
    const canvasElement = this.ele
    const doc = EventListener.getDocumentFromElement(canvasElement);
    EventListener.addListener(
      doc,
      `${DragEvent.eventPrefix}up`,
      this.onMouseUp,
      EventListener.eventOptions
    );
    EventListener.addListener(
      doc,
      `${DragEvent.eventPrefix}move`,
      this.onMouseMove,
      EventListener.eventOptions
    );
  }
}

export class AnimationEvent {
  startDate = 0
  endDate = 0
  t = null
  isPlay = false
  millisecond = 0

  constructor(handleFn) {
    this.handleFn = handleFn
  }

  handleFn(animationEvent) {
  }

  _timer() {
    if (
      this.millisecond > 0 &&
      this.passedDateTime > this.millisecond
    ) {
      this.clear();
    }
  }

  _animationFn = () => {
    this._timer()
    if (this.isPlay) {
      this.handleFn(this)
      this.t = requestAnimationFrame(this._animationFn)
    } else {
      cancelAnimationFrame(this.t);
    }
  }


  // 设置定时器
  setTimer(millisecond = 0) {
    this.millisecond = millisecond;
  }

  // 开始动画
  // timer 定时器，传入毫秒，到达时间动画自动停止
  play() {
    this.isPlay = true;
    this.startDate = new Date().getTime();
    this.endDate = 0;
    this._animationFn()
  }

  clear() {
    this.isPlay = false;
    this.endDate = new Date().getTime();
  }

  // 动画的执行时间（毫秒）
  get passedDateTime() {
    if (this.isPlay) return new Date().getTime() - this.startDate;
    return this.startDate - this.endDate;
  }

  // 动画的执行时间（秒）
  get passedSecond() {
    return this.passedDateTime / 1000
  }
}
