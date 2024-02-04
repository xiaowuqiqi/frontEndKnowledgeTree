---
title: CSS定位
group:
  title: CSS基础
  order: 1
order: 7
---
# 定位

## 定位模式

position定位模式，属性：

1，`absolute`生成绝对定位的元素，相对于有定位属性（`static`除外）的第一个父元素进行定位。

2，`fixed`生成绝对定位的元素，相对于浏览器窗口进行定位。

3，`relative`生成相对定位的元素，相对于其正常位置进行定位。

4，`static`默认值。没有定位，元素出现在正常的流中（忽略`top`,`bottom`,`left`,`right`或者`z-index`声明）。

5，`inherit`规定应该从父元素继承`position`属性的值。

> 注：元素的位置通过`left`,`top`, `right`以及`bottom`属性进行规定（`static`除外）。
## 偏移量与堆叠顺序属性
1，偏移量属性，按照优先级执行顺序排列分别为：`top`，`bottom`，`left`，`right`。

>传入值可以传入，像素值，em，百分比（参考父级元素的大小）等。
>
>利用以上属性可以设置拥有定位模式元素的偏移量，如：

```css
.div{
	width: 100px;
	height: 100px;
	background-color: #ccc;
	margin-left: 50px;
	position: relative;
	left: 50px;
}
```
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181012194926392.jpg)
> 有执行结果可以看出：`left`设置的偏移量不与`margin`设值重叠。

2，`z-index`属性指定一个元素的堆叠顺序。
拥有更高堆叠顺序的元素总是会处于堆叠顺序较低的元素的前面。

```css
z-index:99;
```

> 注：`z-index`进行定位元素（`absolute`，`relative`，`fixed`）。
### relative
相对定位，相对于当前位置进行定位。

特性：

1，进行相对定位的元素，保留原来的位置，不脱离文档流。所以在结构上不会影响后面元素。

2，进行偏移后的元素在视觉上会遮挡后面元素。

> 为只保留与遮挡。设置两个一样的正方形盒子，第一个添加定位模式`relative`，且向右偏移50像素。可以看到，虽然原来位置保留，但是在视觉上依然遮挡了第二个盒子。

```css
.div1{
	width: 100px;
	height: 100px;
	display: inline-block;
	background-color: #ccc;
	margin-left: 50px;
	position: relative;
	left: 50px;
}
.div2{
	display: inline-block;
	width: 100px;
	height: 100px;
	background-color: #f00;
}
```

```jsx | pure
<div class="div1">a</div><div class="div2">b</div>
```
执行结果：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181012200426454.jpg)

### absolute
生成绝对定位的元素。

特性：

1，脱离文档流，原来位置不予保留（类似浮动）。

2，隐形的改变被设置元素的显示模式为`inline-block`。

>参考资料：
>[display与position之间的关系](https://www.cnblogs.com/baimiaolei/p/5627755.html)

> 利用`span`元素证明这一点。`span`元素开始是不能设置高与宽的，设置`position: absolute`之后，隐形的改变显示模式为`inline-block`，则可以设置高于宽。

```css
span{
    width: 200px;
    height: 200px;
    background-color: #ccc;
    position: absolute;
}
```
执行结果：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181013091008725.jpg)

> 注：在定位中，改变显示模式为`inline-block`的属性有：`absolute`和`fixed`，**其他则不能**。

3，偏移量相对于父级，父级以上，第一个设置有定位模式（`static`除外）的元素为基准偏移。

> 利用子绝父相布局，设置`position:absolute`的子元素不会脱离父级元素。
```css
.parents{
    width: 50px;
    height: 50px;
    position:relative;
    background-color:red;
    margin:0 auto;
} 
.child{
    bottom: 0px;
    width: 10px;
    height: 10px;
    position:absolute; 
}
```

```jsx | pure
<div class="parents">
	<div class="child"></div>
</div>
```

执行结果：

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/2018101309060753.jpg)

### absolute居中对齐

利用`absolute`居中元素：
> 两个方案：
>
> 1，利用`margin`元素负方向缩减长宽的一般，这个方案需要预先知道固定的长与宽（js操作除外）。
> 2，利用`transform: translate(-50%,-50%)`变形移动，负方向所见长宽一般，这个方案可以设置`-50%`（`translate`的百分比是相对于元素本身，不是父级），但是它属于css3属性存在兼容问题。
```css
.parents{
    width: 100px;
    height: 100px;
    position:relative;
    background-color:#ccc;
    margin:0 auto;
} 
.child{
    width: 50px;
    height: 50px;
    left: 50%;
    top: 50%;
/*	margin-left: -25px;
    margin-top: -25px;*/
    transform: translate(-50%,-50%);
    position:absolute; 
    background-color:red;
}
```
执行结果：

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181013092732760.jpg)

让设置有`absolute`的元素居中：

```css
.div4{
    width: 50px;
    height: 50px;
    left: 0;
    right: 0;
    margin:auto;
    position:absolute; 
    background-color:red;
}
```

```jsx | pure
<div class="div4"></div>
```
执行结果：

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181013093309783.jpg)

### fixed

`fixed`固定定位是将某个元素固定在浏览器的某个确定的位置，不随滚动条的移动而变化；

>注：固定定位的位置是相对当前浏览器窗口的。
