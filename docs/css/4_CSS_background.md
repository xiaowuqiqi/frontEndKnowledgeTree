---
title: CSS继承性、background样式
group:
  title: CSS基础
  order: 1
order: 4
---
# CSS继承性、background样式

## CSS 的继承性

样式的继承性总结：
[CSS中可以和不可以继承的属性](https://www.cnblogs.com/thislbq/p/5882105.html)

### 有继承性

与文本有关的如颜色（`color`），字号，以`text-`、`font-`、`line-`开头的都可以继承。

除上面外还有一些特殊的样式具有继承性：
元素可见性（`visibility`）列表布局属性（`list-style-type`等）光标属性（`cursor`）页面样式属性（`page`、`windows`、`orphans`）

### 无继承性：

盒子模型的属性（`width`、`height`、`margin` 、`border`、`padding`等），背景属性（`background`等），定位属性（`float`、`position`、`left`、`overflow`、`z-index`等），生成内容属性（`content`等），轮廓样式属性（`outline-style`等）。

在文本属性也有一些特殊的没有继承性的：
`vertical-align`：垂直文本对齐、`text-decoration`：规定添加到文本的装饰、`text-shadow`：文本阴影效果、`white-space`：空白符的处理、`unicode-bidi`：设置文本的方向。

## background样式

`background-repeat`指定如何重复背景图像，属性：`repeat`平铺，`no-repeat`不平铺，`repeat-x`|`repeat-y`水平/垂直方向设置平铺。

```css
background-repeat: no-repeat;
```

`background-position`指定背景图像的位置，属性：`center`水平居中等。

> 注：可以传入两个参数，分别对应水平和垂直方向

```css
background-position: left bottom;
```

`background-attachment`设置背景图像是否固定，属性：`fixed`固定不动，`scroll`默认，随对象滚动。

```css
background-attachment:fixed;
```

`background`设置背景属性。属性连写，以空格为间隔，分别对应背景颜色（可省略），图片url，是否平铺，是否固定（可省略），位置。

```css
background: #ccc url("img/button.jpg") no-repeat fixed left top;
```

> 注：可以使用`rgba()`方式设置背景半透明（属于css3），如：`background-color: rgba(255,0,0,0.3)`

### 实现鼠标进入按钮图片切换

具体实现思路：通过快速改变背景图片的相对位置，实现鼠标进入按钮，按钮发生变化。如图：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/2018101020591447.jpg)

```css
 a{
	width:100px;
	height: 50px;
	display: block;
	background: url("img/button.jpg") no-repeat left top;
}
a:hover{
 	background-position: left bottom;
}
```

```html
<a href="javascript:;"></a>
```

### 实现input标签内加入小图标

实现思路：为`input`标签添加`padding-left`值，使之写入的内容右移，而左边空出的区域设置背景。

```css
input{
    background-image: url(img/timg.jpg);
    background-repeat: no-repeat;
    background-position: 2px center;
    padding-left: 20px;
    border:1px solid #000;
}
```

```html
<input type="text" name="">
```

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181010210811923.jpg)

### 精灵图实现（Sprites）

产生原因：
网页上面的每张图片都要经历一次请求才能展示给用户，小的图标频繁的请求服务器，降低页面的加载速度，为了有效地减少服务器接收和发送请求的次数，提高页面的加载速度，因此，产生了css精灵技术。

CSS Sprites 的优点（[更多优点](https://blog.csdn.net/qq_39430589/article/details/78387857?utm_source=copy)）
1、减少图片的字节。
2、减少了网页的http请求，从而大大的提高了页面的性能。
3、解决了网页设计师在图片命名上的困扰，只需对一张集合的图片上命名就可以了，不需要对每一个小元素进行命名，从而提高了网页的制作效率。
4、更换风格方便，只需要在一张或少张图片上修改图片的颜色或样式，整个网页的风格就可以改变。维护起来更加方便。

**例：利用精灵图实现硬币转动。**

思路：首先利用position: absolute属性使li标签进行堆叠，然后为所有li标签设置相同的背景，通过背景位置（依次向左移动70像素）的调整实现不同背景的li标签，最后利用定时器逐个隐藏li标签，最终实现动画效果。

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181013114624250.gif)

```css
ul li{
    list-style:none;
    position: absolute;
    width: 70px;
    height: 100px;
    background: url(img/coin.jpg) no-repeat;
}
ul li:nth-child(1){
    background-position-x:0px;
    z-index: 7;
}
ul li:nth-child(2){
    background-position-x:-70px;
    z-index: 6;
}
ul li:nth-child(3){
    background-position-x:-140px;
    z-index: 5;
}
ul li:nth-child(4){
    background-position-x:-210px;
    z-index: 4;
}
ul li:nth-child(5){
    background-position-x:-280px;
    z-index: 3;
}
ul li:nth-child(6){
    background-position-x:-350px;
    z-index: 2;
}
ul li:nth-child(7){
    background-position-x:-420px;
    z-index: 1;
}
```

```html
<ul>
	<li></li>
	<li></li>
	<li></li>
	<li></li>
	<li></li>
	<li></li>
	<li></li>
</ul>
```

```javascript
var liNodeList = document.getElementsByTagName("li");
var i=0 ;
var t = setInterval(function () {
    liNodeList[i].style.display = 'none';
    i++;
    if(i==7){
        i=0;
        for (var j = 0; j < liNodeList.length; j++) {
            liNodeList[j].style.display = 'inline-block';
        }
    }
},150);
```

使用图片：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181013110407405.jpg)

### 滑动门实现

所谓滑动门实现就是利用背景图片的分割，实现不同内容长度下，按钮的可伸缩性。

具体思路：根据文本自适应大小，我们可用两个独立的背景图像来创造它。一个在左边，一个在右边。把这两幅图像想象成两扇可滑动的门，它们滑到一起并交迭，占据一个较窄的空间；或者相互滑开，占据一个较宽的空间。

所用图片：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181013182405912.png)

```css
a{
    height: 92px;
    line-height: 92px;
    padding-right: 52px;
    display: inline-block;
    background:  url(Sliding.png) no-repeat right top;
}
span{
    display: inline-block;
    height: 92px;
    line-height: 92px;
    background: #fff url(Sliding.png);
}
span{
    padding:0px 10px 0px 30px;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
}
```

```html
<a href="javascript:;"><span>点击进入首页</span></a>
<a href="javascript:;"><span>更多详情</span></a>
<a href="javascript:;"><span>联系</span></a>
```

执行结果：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/2018101318233288.jpg)
