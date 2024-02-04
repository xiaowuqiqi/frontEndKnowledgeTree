---
title: 字体、display、行高
group:
  title: CSS基础
  order: 1
order: 2
---
# 字体，display，行高

## 调试工具

谷歌浏览器自带调试工具，点击F12可以唤出。如图：

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181009190825212.jpg)
详细使用教程：

[前端chrome浏览器调试总结](https://www.jianshu.com/p/b25c5b88baf5)

[chrome调试工具高级不完整使用指南（基础篇）](https://www.cnblogs.com/st-leslie/p/8196493.html?utm_source=debugrun&utm_medium=referral)

## 字体相关样式
`font-size:`设置字体大小，尽量设置为偶数，如：`16px`（浏览器默认文字大小）。
`font-family:`设置字体。

```css
font-family: Microsoft YaHei, Heiti SC, tahoma, arial, Hiragino Sans GB, \\5B8B\4F53, sans-serif
/*来自于京东*/
```
>注：一个`,`间隔一个字体，用户系统中没有第一个字体的情况下，会顺序向下寻找可用字体。
>注：`font-family: "\5FAE\8F6F\96C5\9ED1"`unicode编码格式微软雅黑字体，兼容性好一些。

`font-weight:`字体加粗，属性值：`normal`正常字体（等同于`400`），`bold`粗体（等同于`700`）。

```css
p{
	font-weight: 700;
	font-weight: bold;
}
```
`font-style:italic`设置字体为斜体，属性值：`normal`设置字体为正常。
```css
i{
    font-style: normal;
    /*清除i标签倾斜属性*/
}
```
font属性连写
```css
p{
	font:italic bold 12px/20px arial,sans-serif;
}
```
>以空格为间隔区分每个属性，分别为：`font-style font-weight font-size/line-height font-family`
```css
p{
	font:12px/1.5;
}
```
> 设置字体大小为12px，行高为字体的1.5倍。

`color`设置字体颜色。

`line-height`设置行高，行与行之间的距离，一般比字体大7，8像素即可。

`text-align`文本对齐方式，属性：`center`居中，`left`向左对齐`right`向右对齐。

`text-indent`首行缩进，如：`2em`，缩进两个字。

`text-decoration`设置文本的修饰，属性：`none`没有装饰，`underline`添加下划线。`overline`文本上边添加一条线。`line-through`添加删除线。
>利用`text-decoration: none`删除a标签文本的下划线。
```css
a{
    text-decoration: none;
}
```
`outline`设置一个元素的轮廓，以空格为分割可传入三个值，分别是：颜色，样式，粗细值。
```css
outline: red solid thick;/*thick代表粗，此位置也可以像素值*/
```
> `input`标签在选中是，浏览器默认会加上一个轮廓，如图：
> ![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181011155015572.jpg)
> 利用`outline: none`可以去掉轮廓。

## 字体图标

通常下载字体图标网站：
[IcoMoon](https://icomoon.io/)、[iconfont](http://www.iconfont.cn/)、[fontello](http://fontello.com/)

> SVG （可缩放矢量图形）
>
> 可缩放矢量图形是基于可扩展标记语言（标准通用标记语言的子集），用于描述二维矢量图形的一种图形格式。它由万维网联盟制定，是一个开放标准。

### 操作步骤

1，打开下载字体网站，以IcoMoon为例，点击右上角IcoMoon App按钮。
2，上传以前使用的字体的selection.json文件（第一次使用字体图标忽略此步骤）。
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181014091329249.jpg)
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181014091509745.jpg)
3，点击下面需要使用的字体图标。
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181014091628551.jpg)
然后点击Generate Font按钮，再点击Download下载。

4，打开压缩包把fonts文件夹与style.css文件复制到项目目录，即可使用。

**使用方案一：**

引入style.css文件后，为span标签添加相应图标的class即可：

> 注：span标签内就不要再加其他内容了

```jsx | pure
<span class="icon-image"></span>
```

**使用方案二**

写入css样式：

```css
@font-face {
font-family: 'icomoon';
src:url('fonts/icomoon.eot?e2ufrf');
src:url('fonts/icomoon.eot?e2ufrf#iefix') format('embedded-opentype'),
url('fonts/icomoon.ttf?e2ufrf') format('truetype'),
url('fonts/icomoon.woff?e2ufrf') format('woff'),
url('fonts/icomoon.svg?e2ufrf#icomoon') format('svg');
font-weight: normal;
font-style: normal;
}
```

```css
i{
    font-family: 'icomoon';
    font-style: normal;/*可忽略不写*/
    vertical-align: -10%;/*可忽略不写*/
}
```

```jsx | pure
<p><i></i> 上传图片</p>
```

注：i标签内的内容，是在压缩文件内有个demo.html，其内容中复制到的（复制“”内容）

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181014092745366.jpg)

执行结果：

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181014092859290.jpg)



## display显示模式
### 块级元素
块级元素包括：h1，p，div，ul，ol，li等，一般占一整行或者多行。
利用css样式`display: block`可以转换元素为块级元素。
> 块级元素不设置宽度时，宽度充满整行。
> 行内快元素不设置宽度时，宽度由内容决定。
### 行内元素
块级元素包括：a，strong，h，em，i，del，s，ins，span等，这些元素在一行上，宽高属性对他们无效，对`margin`和`padding`属性仅设置左右方向有效，上下无效，且不会自动进行换行。
利用css样式`display: inline`可以转换元素为行内元素。
### 行内快元素
块级元素包括：img，input，td等，这些元素在一行上，可以设置宽高、`margin`和`padding`属性，但不会自动进行换行。
利用css样式`display: inline-block`可以转换元素为行内块元素。
> 注：行内块两元素间存在间隙问题，一般间隙为4px（chrome间隙为8px）。
> 可以用以下方式解决

```jsx | pure
<div></div
><span></span
><a href="#"></a>
```
```css
body *{
    display: inline-block;
}
div{
    width:100px;
    height:100px;
    background-color:red;
}
span{
    width:150px;
    height: 150px;
    background-color: #0f0;
}
a{
    width: 80px;
    height: 20px;
    background-color: #00f;
}
```
执行结果：

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181009212629776.jpg)

### [案例] 利用行内快属性使元素上下居中

```css
.wrapper {
	/*display:inline-block;*/
    height: 300px;
    background-color:#ccc;
}
.wrapper:before{
    content:"";
    display:inline-block;
    height:100%;
    vertical-align:middle;
}
.content {
    display:inline-block;
    background-color:red;
    vertical-align:middle;
}
```
```jsx | pure
<div class="wrapper"
	><div class="content">some content</div>
</div>
```
执行结果：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181009213539735.jpg)

### display属性及介绍

[原文](http://www.w3school.com.cn/cssref/pr_class_display.asp)

| 值                 | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| none               | 此元素不会被显示。                                           |
| block              | 此元素将显示为块级元素，此元素前后会带有换行符。             |
| inline             | 默认。此元素会被显示为内联元素，元素前后没有换行符。         |
| inline-block       | 行内块元素。（CSS2.1 新增的值）                              |
| list-item          | 此元素会作为列表显示。                                       |
| run-in             | 此元素会根据上下文作为块级元素或内联元素显示。               |
| table              | 此元素会作为块级表格来显示（类似` <table>`），表格前后带有换行符。 |
| inline-table       | 此元素会作为内联表格来显示（类似` <table>`），表格前后没有换行符。 |
| table-row-group    | 此元素会作为一个或多个行的分组来显示（类似` <tbody>`）。     |
| table-header-group | 此元素会作为一个或多个行的分组来显示（类似` <thead>`）。     |
| table-footer-group | 此元素会作为一个或多个行的分组来显示（类似 `<tfoot>`）。     |
| table-row          | 此元素会作为一个表格行显示（类似` <tr>`）。                  |
| table-column-group | 此元素会作为一个或多个列的分组来显示（类似` <colgroup>`）。  |
| table-column       | 此元素会作为一个单元格列显示（类似` <col>`）                 |
| table-cell         | 此元素会作为一个表格单元格显示（类似` <td> `和` <th>`）      |
| table-caption      | 此元素会作为一个表格标题显示（类似` <caption>`）             |
| inherit            | 规定应该从父元素继承 display 属性的值。                      |

## 行高

定义：是基线与基线之间的距离
> 注：行高=文字高度+上下边距
>
> ![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181010160443518.jpg)
> 如图：四条线，从上到下分别为绿色（顶线），蓝色（中线），红色（基线），品红色（底线）。
>
> 一行文字行高和父元素高度一致的时候，垂直居中显示。

```css
div{
	height:64px;
	line-height: 64px;
	background-color: #ccc;
}
```
```jsx | pure
<div>这是一行文字</div>
```
执行结果：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181010155638465.jpg)

### 行高属性解析
```css
line-height: normal;
```
1，`normal`默认值，与浏览器相关，在同一浏览器中也和元素字体相关（`font-family`），所以考虑到兼容性，实际开发时，会对行高进行设置，保证各浏览器兼容性一致。

2，`line-height:1.5`，实际等于1.5`font-size`（自己元素）。
3，`line-height:1.5em`，实际等于1.5`font-size`（父级元素），相当于继承了父元素的`line-height`。

### [案例] 图片与文字对齐问题
图片放入一个容器时，会出现基线对齐现象，也就是图片下方会出现一条很细的空白区域。
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181010163406642.jpg)
解决方法：为`img`标签添加`vertical-align:middle`属性即可，把此元素放置在父元素的中部。

上面方法里，用到了`vertical-align`样式，所以当图片与文字同时摆放时我们也可以利用此样式来设置图片对齐方式，达到文字居中效果。
```css
.div2 img{
	vertical-align:middle;
}
.div2{
	background-color: #ccc;
}
```
```jsx | pure
<div class="div2">
	<img src="timg.jpg" alt="">中文English
</div>
```
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181010164225122.jpg)
### vetical-align样式
参考教程:
[CSS深入理解vertical-align和line-height的基友关系](https://www.zhangxinxu.com/wordpress/2015/08/css-deep-understand-vertical-align-and-line-height/)

`vetical-align`的功能是设置行内元素垂直方向上的对齐方式。
```css
vertical-align:baseline;
```
属性有:
`baseline`默认。元素放置在父元素的基线上。
`sub`垂直对齐文本的下标。
`super`垂直对齐文本的上标
`top`把元素的顶端与行中最高元素的顶端对齐
`text-top`把元素的顶端与父元素字体的顶端对齐
`middle`把此元素放置在父元素的中部。
`bottom`把元素的底端与行中最低的元素的底端对齐。
`text-bottom`把元素的底端与父元素字体的底端对齐。
`%`使用 `line-height`属性的百分比值来排列此元素。允许使用负值。
`inherit`规定应该从父元素继承`vertical-align`属性的值。
