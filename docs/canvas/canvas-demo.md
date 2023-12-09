---
title: canvas小球碰撞案例
order: 3 
nav:
  order: 8 
  title: Canvas
---

# canvas小球碰撞案例

> 鼠标拖动黑色小球，鼠标松开后小球自由落体并弹跳。

```jsx
/**
 * defaultShowCode: false
 */
import React,{useEffect} from 'react'
import {main} from './demo/canvas/main.js'
import "./demo/opinionated.css"
import "./demo/index.css"

export default () => {
  useEffect(() => {
    main();
  }, []);
  return (
    <canvas class="canvas"></canvas>
  )
}
```

github: https://github.com/xiaowuqiqi/cubic-bezier-view-chinese

demo: https://xiaowuqiqi.github.io/canvas-pellet-collision

## 代码详细实现

