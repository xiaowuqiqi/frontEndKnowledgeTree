---
title: CSS盒子模型
group:
  title: CSS基础
  order: 1
order: 5
---
# CSS盒子模型

## border

`border`边框属性，以空格为分割可传入属性分别是：边框宽度，边框样式，边框颜色。

```css
border:5px solid red;
```

`border-style`边框样式，属性：`none`无样式，`solid`实线，`dashed`虚线，`dotted`点线。

```css
border-style:solid;
```

> 注：在`table`表格里，有一个特殊样式：`border-collapse：collapse`可以设置相邻的单元格合并，共享一条边。
> ![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181010213513396.jpg)

`border-radius`设置边框角的弧度。可写入值，如`50%`呈圆形。

```css
border-radius: 50%;
```

> 注：利用`border-radius`样式画一个椭圆。

```css
.div2 {
	width: 200px;
	height: 100px;
	background: red;
	border-radius: 50% / 50%;
}
```

```jsx | pure
<div class="div2"></div>
```

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181010224153913.jpg)

## padding

`padding`（英译：填充）简写属性在一个声明中设置所有内边距属性。

```css
padding:10px 5px 15px 20px;/*分别为上，右，下，左的内边距*/
padding:10px 15px 20px;/*分别为上，左右，下的内边距*/
```

>在调节`width`与`height`时不会改变`padding`的值。而是直接控制`content`（蓝色区域）的范围。
>![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181011092931784.jpg)

## margin

`margin`（英译：余量），简写属性在一个声明中设置所有外边距属性。

```css
margin:2cm 4cm 3cm 4cm;
```

> 注：当margin的值为百分比时，其参考对象是其父级元素。
>
> 可以利用`auto`属性值，实现盒子靠右或者居中的布局。

```css
.div4{
	width: 100px;
	height: 100px;
	margin-left: auto;
	background-color: #ccc;
	display: block;
}
```

执行结果：

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181011094548208.jpg)

```css
.div4-5{
	width: 100px;
	height: 100px;
	background-color: #ccc;
	display: block;
	margin:auto;
}
```

执行结果：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181011095429795.jpg)

## css盒子模型

所有HTML元素可以看作盒子，在CSS中，"box model"这一术语是用来设计和布局时使用。CSS盒模型本质上是一个盒子，封装周围的HTML元素，它包括：边距，边框，填充，和实际内容。盒模型允许我们在其它元素和周围元素边框之间的空间放置元素。
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181011095928601.jpg)

### 盒子模型分类

分为标准盒子模型（默认）、IE盒子模型

设为IE盒子模型后，元素样式width=content宽度

```css
box-sizing:content-box;
```

设为标准盒子模型后，元素样式width=content宽度+border厚度+padding距离

```css
box-sizing:border-box;
```

### 内外边距合并问题

一，两个并列的盒子模型，外边距合并，如图：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181011101200439.jpg)

> 两个盒子间的距离是不是`margin`之和，而是两个盒子中最大的`margin`值。

解决方案：
1，使用`float`对两个元素进行浮动。

```css
.div5-1{
	float: left;
	width: 100px;
	height: 100px;
	background-color: red;
	margin:100px;
}
.div5-2{
	float: left;
	width: 100px;
	height: 100px;
	background-color: red;
	margin:100px;
}
```

执行结果：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/2018101110402290.jpg)

2，对后一个元素使用绝对定位`position:absolute`。

```css
.div5-1{
	width: 50px;
	height: 50px;
	background-color: red;
	margin:50px;
}
.div5-2{
    position: absolute;
	width: 50px;
	height: 50px;
	background-color: red;
	margin:50px;
}
```

> 这时`.div5-2`元素已经脱离文档流，离开了父级元素。

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181011103658388.jpg)

3，改变两个元素显示模式，添加`display: inline-block`样式。

```css
.div5-1{
	width: 50px;
	height: 50px;
	background-color: red;
	display: inline-block;
	margin:50px;
}
.div5-2{
	width: 50px;
	height: 50px;
	background-color: red;
	display: inline-block;
	margin:50px;
}  
```

执行结果：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181011104245581.jpg)

二，父级与子级盒子外边距合并问题，如图：

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/201810111044214.jpg)

> 注：这种合并情况，只在垂直方向上产生。

解决方案：

1，利用`border`属性，为父级元素添加`border`样式。

```css
.div6{
	background-color: #ccc;
	border: 1px solid #ccc;
}
.div6-1{
	width: 50px;
	height: 50px;
	background-color: red;
	margin:50px;
}
```

2，为父级元素添加`padding`样式。

```css
.div6{
	background-color: #ccc;
	padding:1px;
}
.div6-1{
	width: 50px;
	height: 50px;
	background-color: red;
	margin:50px;
}
```

3，为父级添加`overflow:hidden`样式。

```css
.div6{
	background-color: #ccc;
	overflow:hidden;
}
.div6-1{
	width: 50px;
	height: 50px;
	background-color: red;
	margin:50px;
}
```

执行结果：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181011111812663.jpg)

