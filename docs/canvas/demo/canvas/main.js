import {OpNode, OpNodeCon} from '../OpNode/OpNodeStorage.js'
import {DragAction, DragEvent} from '../Event/Event.js'
import {Controller} from "./Controller.js";
import {BezierCanvas, GlobuleCanvas} from "./BezierCanvas.js";

export function main() {
  // canvasEle
  const canvasEle = document.querySelector('.canvas');
  const ctx = canvasEle.getContext('2d');
  // new OpNodeCon DragEvent
  const opNodeCon = new OpNodeCon(canvasEle, ctx);
  const dragEvent = new DragEvent(canvasEle, opNodeCon);
  const paramStore = {canvasEle, opNodeCon, dragEvent, ctx};
  new Controller(paramStore);
  const bezierCanvas = new BezierCanvas(paramStore);
  new GlobuleCanvas(paramStore, bezierCanvas)
}
// ;(() => {
//   main();
// })();
