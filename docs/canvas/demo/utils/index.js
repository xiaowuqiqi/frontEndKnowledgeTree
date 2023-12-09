// 角度转弧度
export function angleToRadians(angle) {
  const radians = Math.PI/180 * angle
  return radians
}

// 弧度转角度
export function radiansToAngle(radians) {
  const angle = 180 / Math.PI * radians;
  return Math.round(angle * 100) / 100; // 四舍五入保留后两位
}


export function getUUId(){
  return Math.random().toString().slice(2);
}

export function cubicBezierPointAtX(x, P0, P1, P2, P3) {
  if(Number.isNaN(x))return;
  if(x<P0.x||x>P3.x)return;
  // P0 到 p3 分别是起始点、两个控制点和终点的坐标。
// 迭代法求解 t 值
  let t = 0.5;  // 初始猜测值
  const epsilon = 1e-6;  // 精度要求
  let xGuess
  while (true) {
    xGuess = (1 - t) ** 3 * P0.x + 3 * (1 - t) ** 2 * t * P1.x +
      3 * (1 - t) * t ** 2 * P2.x + t ** 3 * P3.x;
    if (Math.abs(xGuess - x) < epsilon) {
      break;  // 达到精度要求，退出循环
    }
    const derivative = -3 * (1 - t) ** 2 * P0.x + (3 * (1 - t) ** 2 - 6 * (1 - t) * t) * P1.x +
      (6 * (1 - t) * t - 3 * t ** 2) * P2.x + 3 * t ** 2 * P3.x;
    t = t - (xGuess - x) / derivative;  // 更新 t 值
  }
  // 计算对应的 y 坐标
  const y = (1 - t) ** 3 * P0.y + 3 * (1 - t) ** 2 * t * P1.y +
    3 * (1 - t) * t ** 2 * P2.y + t ** 3 * P3.y;
  return y;
}

export function requestAnimationFrame(fn) {
  let requestAnimationFrame = window.requestAnimationFrame
  //动画循环
  if (!window.requestAnimationFrame) {
    requestAnimationFrame = (window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 17);
      });
  }
  return requestAnimationFrame(fn);
}

export function cancelAnimationFrame(t) {
  let cancelAnimationFrame = window.cancelAnimationFrame
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
      window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
      window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
      window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
      window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
      window.clearTimeout);
  }
  cancelAnimationFrame(t)
}


// 返回鼠标距离页面左上角的距离
export function getPoint(canvasEle, event) {
  event = event || window.event; /*为了兼容IE*/
  /*将当前的鼠标坐标值减去元素的偏移位置，返回鼠标相对于element的坐标值*/
  let x = (event.pageX || event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft);
  x -= canvasEle.offsetLeft;
  let y = (event.pageY || event.clientY + document.body.scrollTop + document.documentElement.scrollTop);
  y -= canvasEle.offsetTop;
  return {x, y};
}

// export function getScrollLeftTop(element: HTMLElement | null) {
//   const doc = element && getDocumentFromElement(element);
//   let left = 0,
//     top = 0;
//   if (!element || !doc) {
//     return { left, top };
//   }
//
//   const docElement = doc.documentElement,
//     body = doc.body || {
//       scrollLeft: 0,
//       scrollTop: 0,
//     };
//   // While loop checks (and then sets element to) .parentNode OR .host
//   //  to account for ShadowDOM. We still want to traverse up out of ShadowDOM,
//   //  but the .parentNode of a root ShadowDOM node will always be null, instead
//   //  it should be accessed through .host. See http://stackoverflow.com/a/24765528/4383938
//   // @ts-expect-error Set element to element parent, or 'host' in case of ShadowDOM
//   while (element && (element.parentNode || element.host)) {
//     // @ts-expect-error Set element to element parent, or 'host' in case of ShadowDOM
//     element = element.parentNode || element.host;
//     // @ts-expect-error because element is typed as HTMLElement but it can go up to document
//     if (element === doc) {
//       left = body.scrollLeft || docElement.scrollLeft || 0;
//       top = body.scrollTop || docElement.scrollTop || 0;
//     } else {
//       left += element!.scrollLeft || 0;
//       top += element!.scrollTop || 0;
//     }
//
//     if (element!.nodeType === 1 && element!.style.position === 'fixed') {
//       break;
//     }
//   }
//
//   return { left, top };
// }
// /**
//  * Returns offset for a given element
//  * @param {HTMLElement} element Element to get offset for
//  * @return {Object} Object with "left" and "top" properties
//  */
// export function getElementOffset(element: HTMLElement) {
//   let box = { left: 0, top: 0 };
//   const doc = element && getDocumentFromElement(element),
//     offset = { left: 0, top: 0 },
//     offsetAttributes = {
//       borderLeftWidth: LEFT,
//       borderTopWidth: TOP,
//       paddingLeft: LEFT,
//       paddingTop: TOP,
//     } as const;
//
//   if (!doc) {
//     return offset;
//   }
//   const elemStyle =
//     getWindowFromElement(element)?.getComputedStyle(element, null) || {};
//   for (const attr in offsetAttributes) {
//     // @ts-expect-error TS learn to iterate!
//     offset[offsetAttributes[attr]] += parseInt(elemStyle[attr], 10) || 0;
//   }
//
//   const docElem = doc.documentElement;
//   if (typeof element.getBoundingClientRect !== 'undefined') {
//     box = element.getBoundingClientRect();
//   }
//
//   const scrollLeftTop = getScrollLeftTop(element);
//
//   return {
//     left:
//       box.left + scrollLeftTop.left - (docElem.clientLeft || 0) + offset.left,
//     top: box.top + scrollLeftTop.top - (docElem.clientTop || 0) + offset.top,
//   };
// }
