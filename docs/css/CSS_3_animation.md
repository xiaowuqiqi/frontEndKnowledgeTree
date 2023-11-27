---
title: css3动画
group:
  title: CSS3
  order: 2
order: 8
---

# css3动画

## animation @keyframes

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

### animation-name *

用来定义一个动画的名称。

如果要设置**几个animation给一个元素**，我们只需要以列表的形式，用**逗号“，”隔开**。

### animation-duration *

用来指定元素播放动画所持续的时间长，单位为**秒（s）**或**毫秒（ms）**，默认值为0。

### animation-**timing-function** *

- `linear` 规定以相同速度开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）。

- `ease `规定慢速开始，然后变快，然后慢速结束的过渡效果（cubic-bezier(0.25,0.1,0.25,1)）。

- `ease-in` 规定以慢速开始的过渡效果（等于 cubic-bezier(0.42,0,1,1)）。

- `ease-out` 规定以慢速结束的过渡效果（等于 cubic-bezier(0,0,0.58,1)）。

- `ease-in-out` 规定以慢速开始和结束的过渡效果（等于 cubic-bezier(0.42,0,0.58,1)）。

- `cubic-bezier(n,n,n,n)` 在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值。

  调试一下：https://xiaowuqiqi.github.io/cubic-bezier-view/cubic-bezier

### animation-delay *

推迟**动画开始时间**

允许负值

```js
animation-delay : -2s; //负值，动画跳过 2 秒进入动画周期，也就是从2s的动画开始
webkit-animation-delay: -2s;
```

### animation-iteration-count *

用来指定元素播放动画的循环次数，其可以取值为**数字**，其默认值为“1”；**infinite**为无限次数循环。

### animation-direction *

用来指定元素动画播放的方向。

可能值：

- 默认值为`normal`，如果设置为normal时，动画的每次循环都是向前播放；

- `reverse` 动画反向播放。

- `alternate`，他的作用是，动画播放在第偶数次向前播放，第奇数次向反方向播放。

  > 比较重要，用于来回播放动画，先播放正向动画，然后播放反向动画，注意反向动画的 **timing-function 也是反向**的。

  **（2016年12月14日更新）**

- `alternate-reverse `动画在奇数次（1、3、5...）反向播放，在偶数次（2、4、6...）正向播放。

  **（2016年12月14日更新）**

### **animation-fill-mode**

检索或设置对象动画时间之外的状态

none：

默认值。不设置对象动画之外的状态

forwards：

设置对象状态为动画结束时的状态

backwards：

设置对象状态为动画开始时的状态

both：

设置对象状态为动画结束或开始的状态

### animation-play-state *

用来控制元素动画的播放状态。其主要有两个值，`running`和`paused`。其中**running为默认值**。

可以通过**`paused`**将**正在播放的动画停下了**，也可以通过**`running`**将**暂停**的**动画重新播放**，我们这里的重新播放不一定是从元素动画的开始播放，而是从你暂停的那个位置开始播放。另外如果暂时了动画的播放，元素的样式将回到最原始设置状态。

**案例**

```css
@keyframes scale2 {
  from {
    transform: scale(0.4);
  }
  to {
    transform: scale(0.5);
  }
}
.heart {
  transform-origin: 50% 50%;
  transform: scale(0.8);
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  animation: scale2 0.5s cubic-bezier(.33,.18,.99,.59) infinite;
  animation-direction: alternate;
}
```

# transform

详情参考：https://www.w3cschool.cn/lugfe/lugfe-s8ec25yu.html

## scale 缩放 *

```css
transform: scale(x,y);
-webkit-transform: scale(x,y);
```

根据倍数来缩放，取决于宽度（X轴）和高度（Y轴）的参数；也可以用一个参数，表示X轴和Y轴都按此倍数缩放

## rotate 旋转 *

```css
transform: rotate(deg);
-webkit-transform: rotate(deg);
```

**单位：deg（度）**

正值表示顺时针，负值表示逆时针 

## skew 倾斜

```css
transform: skew( x ,y);
-webkit-transform: skew(x,y);
```

**单位：deg**

例子：

```css
{
    transform:skew(15deg,0);
	-webkit-transform:skew(15deg,0);
}
```

![img](https://atts.w3cschool.cn/attachments/image/20170619/mayuan_skew.jpg)


## matrix 矩阵转换

matrix() 

```css
transform : matrix(n,n,n,n,n,n);
-webkit-transform : matrix(n,n,n,n,n,n);
```

## **3D转换**

CSS3变形中具有X /Y可用的函数：translateX()、translateY()、scaleX()、scaleY()、skewX()和skewY()

```css
transform: translateX(x);
transform: translateY(y);
transform: scaleX(x);
transform: scaleY(y);
transform: skew(x);
transform: skew(y);
```

CSS3 3D变形包括函数有：rotateX()、rotateY()、**rotate3d()**、translateZ()、**translate3d()**、scaleZ()、**scale3d()**和**matrix3d()**。

```css
transform: rotateX(deg);
transform: rotateY(deg);
transform: rotate3d(x,y,z,angle);
transform: translateZ(z);
transform: translate3d(x,y,z);
transform: scaleZ(z);
transform: scale3d(x,y,z);
transform: matrix3d(n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n);
```

因为很多人会搞错3d旋转，所以在这里，我们重点介绍一下 rotate3d(x,y,z,angle)：

rotate3d(x,y,z,angle)

共有四个参数 x、y、z 分别对应于X轴、Y轴、Z轴，默认值都为0；

而angle就是旋转的角度

如果你要沿着该轴转动那就将该轴的值设置为1，否则为0；

然后在后面的angle中设置旋转的角度，需要注意的是，angle只有一个角度值。

用法：

```css
transform: rotate3d(1,0,0,50deg);  //绕着X轴顺时针旋转50度
```

## **其他属性**

**transform-origin** 指定元素的中心点

**transform-style** 规定被嵌套元素如何在 3D 空间中显示。当设置值为preserve-3d值，建立一个3D渲染环境。

**perspective** 属性相对于观众产生一个3D场景，你看3D物体，眼睛到画布的距离。正确的用法是他需要应用到变形元素的祖先元素上。

 **perspective-origin** 为视点的位置。

 **backface-visibilty** 属性用来设置背面的可见性。



### **transform-origin ***

指定元素的中心点

**默认情况**，变形的原点在元素的中心点，或者是**元素X轴和Y轴的50%处**。

还有一个新增的，transform-origin-z，控制元素三维空间中心点。

语法

```css
transform-origin: x-axis y-axis z-axis;
```

值：

```js
x-axis（left，center，right，length，%）

y-axis（top，center，bottom，length，%）

z-axis（length）
```

2D的变形中的transform-origin属性可以是一个参数值，也可以是两个参数值。

如果是两个参数值时，**第一值**设置**水平方向X轴**的位置，**第二个值**是用来设置**垂直方向Ｙ轴**的位置。

而在3D的变形中的transform-origin属性还包括了Ｚ轴的第三个值

例子：

```css
transform-origin: 50% 50%;  //默认值
```

![img](https://atts.w3cschool.cn/attachments/image/20170619/mayuan_origin1.jpg)

```css
transform-origin: 50% 0;  //也可以设为 center top
```

![img](https://atts.w3cschool.cn/attachments/image/20170619/mayuan_origin2.jpg)


### **transform-style**

**规定被嵌套元素如何在 3D 空间中显示。**

有两个值：

**flat** 子元素将不保留其 3D 位置。

**preserve-3d** 子元素将保留其 3D 位置。

当设置值为preserve-3d值，建立一个3D渲染环境。

### **perspective 透视**

属性相对于**观众产生一个3D场景**，你看3D物体，**眼睛到画布的距离**。取值越小，3D效果就越明显，也就是你的眼睛越靠近真3D。

正确的用法是他需要应用到变形元素的祖先元素上。

**属性值：**

number 元素距离视图的距离，以像素计，不能用百分比。

none 默认值。与 0 相同。不设置透视。

定义时的perspective属性，它是一个元素的子元素，透视图，而不是元素本身。

> 注意：所有主流浏览器都不支持perspective属性。
>
> Safari和Chrome使用私有属性-webkit-perspective获得支持。

为了更好的理解，下面我们来看一个例子：

```html
<div class="page">
    <div class="cude">
        <div class="dice">
            <div class="side front">1</div>
            <div class="side left">2</div>
            <div class="side right">3</div>
            <div class="side bottom">4</div>
            <div class="side top">5</div>
            <div class="side back">6</div>
        </div>
    </div>
</div>
```

CSS样式：

```css
.page {
    position: relative;
    max-width: 640px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: #373737;
}
.cude{
    position:absolute;
    top:200px;
    left:100px;
    width: 100px;
    -webkit-perspective: 1000px; // perspective
    perspective: 1000px; // perspective
}
.dice {
    position: absolute;
    width: 100px;
    height: 100px;
    transform: rotateX(-15deg) rotateY(47deg);
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
}
.dice .side {
    position: absolute;
    display: block;
    width: 100px;
    height: 100px;
    background: rgba(14,126,84,.5);
    text-align: center;
    line-height:100px;
    color:#fff;
    font-size:40px;
    font-weight: bold;
    border:1px solid #333;
}
.front{
    transform:translateZ(50px);
}
.top{
    transform: rotateX(90deg) translateZ(50px);
}
.bottom{
    transform: rotateX(-90deg) translateZ(50px);
}
.left{
    transform: rotateY(-90deg) translateZ(50px);
}
.right{
    transform: rotateY(90deg) translateZ(50px);
}
.back{
    transform: rotateY(-180deg) translateZ(50px);
}
```

通过改变perspective的值，我们可以很明显的看到效果：



![img](https://atts.w3cschool.cn/attachments/image/20170619/mayuan_perspective.gif)



属性解析：

perspective取值为none或不设置，就没有真3D空间。

perspective取值越小，3D效果就越明显，也就是你的眼睛越靠近真3D。 

perspective的值无穷大，或值为0时与取值为none效果一样。

### **perspective-origin**

perspective-origin 属性定义 3D 元素所基于的 X 轴和 Y 轴。

该属性允许您改变 3D 元素的底部位置。

定义时的perspective -origin属性，它是一个元素的子元素，透视图，而不是元素本身。

### **backface-visibility**

属性值：

visible 背面是可见的。

hidden 背面是不可见的。

例子：

![img](https://atts.w3cschool.cn/attachments/image/20170619/mayuan_backface.gif)

右边的div加了backface-visibility:hidden;

```html
<div class="box"></div>
<div class="box backface"></div>
```

样式：

```css
.box{   
	width:100px;   
    height:100px;   
    background:green;
    float:left;
    transform-style: preserve-3d;   
    transition:all 1s;		
}		
.box:hover{   
    transform:rotateY(180deg);		
}
.backface{
    backface-visibility:hidden;
}
```



## **兼容性**

Internet Explorer使用私有属性-ms-Transform-origin支持（仅2D转换）。

Firefox使用私有属性-MOZ-Transform-origin支持（仅2D转换）。

Opera使用私有属性-O-Transform-origin支持（仅2D转换）。

Safari和Chrome使用私有属性-WebKit-Transform-origin支持（3D和2D变换）。

# transition

css 的 transition 允许 css 的属性值在一定的时间区间内平滑地过渡。

这种效果可以在鼠标单击、获得焦点、被点击或对元素任何改变中触发，并圆滑地以动画效果改变CSS的属性值。

> **浏览器支持**
>
> Internet Explorer 10, Firefox, Chrome和 Opera均支持这下面四个属性
>
> 但在Safari中，必须 通过私有属性 -webkit-t支持。
>
> 注意：Internet Explorer 9及更早IE版本不支持transition-timing-function 属性

**语法**

```css
transition : property duration timing-function delay;
```

transition主要包含四个属性值：

指定CSS属性的name：transition-property;

需要指定多少秒或毫秒才能完成：transition-duration;

在延续时间段，变换的速率变化transition-timing-function;

变换延迟时间transition-delay。

## **transition-property**

transition-property: none|all|property;

- none 没有属性会获得过渡效果。
- all 所有属性都将获得过渡效果。
- property 定义应用过渡效果的 CSS 属性名称列表，多个以逗号分隔。

可用的CSS属性名:

**background-color**，**background-position**，border-bottom-color，border-bottom-width，border-left-color，border-left-width，border-right-color，border-right-width，border-spacing，border-top-color，border-top-width，**bottom**，clip，**color**，**font-size**，**font-weight**，**height**，**left**，letter-spacing，line-height，margin-bottom，margin-left，margin-right，margin-top，max-height，max-width，min-height，min-width，**opacity**，outline，outline-color，outline-width，padding-bottom，padding-left，padding-right，padding-top，**right**，text-indent，**text-shadow**，**top**，vertical-align，**visibility**，**width**，word-spacing，z-index。

## **transition-duration**

单位为s（秒）或者ms(毫秒)

注意：transition-duration属性必须指定值，否则持续时间为0，transition不会有任何效果。

## **transition-timing-function**

此属性允许一个过渡效果，以改变其持续时间的速度。

- linear 规定以相同速度开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）。
- ease 规定慢速开始，然后变快，然后慢速结束的过渡效果（cubic-bezier(0.25,0.1,0.25,1)）。
- ease-in 规定以慢速开始的过渡效果（等于 cubic-bezier(0.42,0,1,1)）。
- ease-out 规定以慢速结束的过渡效果（等于 cubic-bezier(0,0,0.58,1)）。
- ease-in-out 规定以慢速开始和结束的过渡效果（等于 cubic-bezier(0.42,0,0.58,1)）。

- cubic-bezier(n,n,n,n) 在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值。

  调试一下：https://xiaowuqiqi.github.io/cubic-bezier-view/cubic-bezier

**transition-delay**

指定秒或毫秒数之前要**等待**切换效果开始，单位为秒(s)或毫秒(ms)

> 如果我们想改变两个或多个css属性，我们只需把几个transition的声明以列表的形式连在一起，用逗号（,）隔开，然后各自可以设置自己不同的延续时间等属性。

例子：

```css
-moz-transition:width .8s linear,color .3s ease-in;
-webkit-transition:width .8s linear,color .3s ease-in;
-o-transition:width .8s linear,color .3s ease-in;
transition:width .8s linear,color .3s ease-in;
```

## **监听过渡结束**

```js
/*在jQuery中*/
$(element)
    .on("webkitTransitionEnd mozTransitionEnd MSTransitionEnd oTransitionEnd animationend",fn());

/*原生js*/
element.addEventListener("webkitTransitionEnd",fn())  // Chrome, Safari 和 Opera
element.addEventListener("mozTransitionEnd",fn())  //标准写法
```
