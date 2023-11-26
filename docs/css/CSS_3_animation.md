---
title: animation
group:
  title: CSS3
  order: 2
order: 8
---

# animation

## @keyframes

通过关键帧，定义一个动画。

```css
@keyframes zoomIn{
from{ transform:scale(.1); }
to{ transform:scale(1); }
}
/*相当于0%开始，100%结束。效果同上*/
@keyframes zoomIn{
0%{ transform:scale(.1); }
100%{ transform:scale(1); }
}
```



> 既然是css3的新属性，多少会有**兼容性**的问题。
>
> Internet Explorer **10**、Firefox 以及 Opera 支持 @keyframes 规则和 animation 属性。
>
> Chrome 和 Safari 需要前缀 -webkit-，也就是**@-webkit-keyframes**
>
> 而Internet Explorer **9**，以及**更早**的版本，**不支持** @keyframe 规则或 animation 属性。

## animation API

动画已经创建好了，那么如何去使用动画。

这时，animation就出场了。

它共有8个属性：

- `animation-name` 规定 @keyframes 动画的名称。
- `animation-duration` 规定动画完成一个周期所花费的秒或毫秒。默认是 0。
- `animation-timing-function` 规定动画的速度曲线。默认是 "ease"。
- `animation-delay` 规定动画何时开始。默认是 0。
- `animation-iteration-count` 规定动画被播放的次数。默认是 1。
- `animation-direction` 规定动画是否在下一周期逆向地播放。默认是 "normal"。
- `animation-fill-mode ` 规定动画在播放之前或之后，其动画效果是否可见。
- `animation-play-state` 规定动画是否正在运行或暂停。默认是 "running"。

连写如下：

```js
animation: name duration timing-function delay iteration-count direction fill-mode play-state
```

例如

```css
.ani{
    animation: a1 0.2s ease 0.2s infinite alternate none running
}
```

### **name**

用来定义一个动画的名称。

如果要设置**几个animation给一个元素**，我们只需要以列表的形式，用**逗号“，”隔开**。

### **duration**

用来指定元素播放动画所持续的时间长，单位为**秒（s）**或**毫秒（ms）**，默认值为0。

### **timing-function**

- `linear` 规定以相同速度开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）。
- `ease `规定慢速开始，然后变快，然后慢速结束的过渡效果（cubic-bezier(0.25,0.1,0.25,1)）。
- `ease-in` 规定以慢速开始的过渡效果（等于 cubic-bezier(0.42,0,1,1)）。
- `ease-out` 规定以慢速结束的过渡效果（等于 cubic-bezier(0,0,0.58,1)）。
- `ease-in-out` 规定以慢速开始和结束的过渡效果（等于 cubic-bezier(0.42,0,0.58,1)）。

- `cubic-bezier(n,n,n,n)` 在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值。
