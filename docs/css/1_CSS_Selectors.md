---
title: 选择器、伪类与伪元素
nav: CSS
group:
  title: CSS基础
  order: 1
order: 1
---
# 选择器、伪类与伪元素

## CSS的使用

CSS又称为层叠样式表，是一种用来表现HTML（标准通用标记语言的一个应用）或XML（标准通用标记语言的一个子集）等文件样式的计算机语言。

### 在标签内使用

在标签内利用`style`（英译：样式；风格）属性直接可以设置css样式，如：

```jsx | pure
<div style="color:#ccc">你好</div>
```

### 引用外部样式表

利用link标签引用外部样式，属性：`href`设置css样式文件的URL，`type="text/css"`引用文件的类型（可省略），`rel="stylesheet"`表示被连接的文档是样式表文件。

```jsx | pure
<link rel="stylesheet" href="" type="text/css" />
```

### 在 style 标签内使用

```jsx | pure
<style type="text/css">
    h1 {
        color: red
    }
    p {
        color: blue
    }
</style>
```

## CSS的三大特征

继承，层叠，优先级

### CSS优先级

由高到低：
1，`!important`
2，ID 选择器， 如 #id{}
3，类选择器， 如 .class{}
4，属性选择器， 如 a[href="abc.com"]{}
5，伪类选择器， 如 :hover{}
6，伪元素选择器， 如 ::before{}
7，标签选择器， 如 span{}
8，通配选择器， 如 *{}
9，浏览器自定义属性

> 注：同一级别时，按CSS样式前后顺序选择，继承得来的属性优先级最低。
> 注：CSS选择器解析时从右向左解析，所以为提高性能尽量使用少的层级关系。如（`div #a1{}`可以直接写为`#a1{}`，id具有唯一性）。

如何编写简洁高效的css选择器：
1，在id选择器前不加其他选择器。
2，在class选择器前不加标签选择器。

### 选择器

参考链接
[CSS选择器参考手册（菜鸟教程）](http://www.runoob.com/cssref/css-selectors.html)
[CSS选择器参考手册（W3school）](http://www.w3school.com.cn/cssref/css_selectors.asp)

除了简单的选择器之外，还有常用的属性选择器：

```jsx | pure
<div start="head-body-foot">你好</div>
```

```css
[start="head-body-foot"]{
	color: #ccc;
}
```

选择以`head`字符串开头的元素

```css
[start^="head"]{
	color: #ccc;
}
```

选择以`foot`字符串结尾的元素

```css
[start$="foot"]{
	color: #ccc;
}
```

选择包含`body`字符串的元素

```css
[start*="body"]{
	color: #ccc;
}
```

除属性选择器外还有一些不常用的兄弟选择器：
选择紧跟在`.div`后的一个`div`元素

```css
.div+div{
    color: #ccc;
}
```

设置 div 下，除第一个元素的所有元素都设置属性

```css
.div *+* {
    color: #ccc;
}
```

选择`.div`后的每一个`div`元素

```css
.div~div{
    color: #ccc;
}
```

### 伪类与伪元素

伪类：用于向某些选择器添加特殊的效果。

>伪类其实与普通的css类相类似，可以为已有的元素添加样式，但是他只有处于dom无法描述的状态下才能为文档树中的元素添加样式，所以将其称为伪类。

伪元素：用于将特殊的效果添加到某些选择器。

>它其实是对元素中的特定内容进行操作，而不是描述状态。伪元素就是选取某些元素前面或后面这种普通选择器无法完成的工作。

伪类与伪元素区别：
伪类和伪元素的最大区别就在于有没有创建一个文档树以外的元素。伪元素创建了一个文档树以外的元素（虚拟容器）并为他添加样式，这个容器不包含任何DOM元素但是可以包含内容。换句话说伪类和伪元素的区别就是伪类的操作对象是文档树中已有的元素，而伪元素则创建了一个文档树以外的元素。

> 注：在CSS3中规定，单冒号（:）用于伪类，双冒号（::）用于伪元素。

#### 伪类选择器

参考链接
[伪类详解（菜鸟教程）](http://www.runoob.com/css/css-pseudo-classes.html)

`:link`选择未被访问过的链接。
`:visited`选择被访问过的链接。
`:hover`选择鼠标悬停到的元素。
`:active`选择被激活的元素。

> 注意：在定义的顺序上一般按上述顺序定义。

`:focus`选择选择拥有键盘输入焦点的元素。

***

`:first-child`选择某个元素的第一个子元素。

> 注：“选择某个元素的第一个子元素”实际是指`":"`前边的元素的父级元素下的第一个元素。如：

```jsx | pure
<div>
<a href="javascript:;">连接</a>
<p>p1</p>
<p>p2</p>
<p>p3</p>
<p>p4</p>
</div>
```

```css
p:first-child{
	color: red;
}
```

> 在这里实际没有`<p>`标签被选中，因为`:first-child`会选择`p`元素父级(`div`元素)下的第一个元素，也就是`a`元素。但是，在`":"`前又表明需要选择`p`元素，所以产生了冲突。

`:last-child`选择某个元素的最后一个子元素。

`:first-of-type`选择一个上级元素下的第一个同类子元素。
`:last-of-type`选择一个上级元素的最后一个同类子元素。

>因为以上案例中存在的问题，所以加入of系列选择器。这时用：
>
>`p:first-of-type{
>color: #ccc;
>}`
>
>选择器就可以选取到第一个p元素了。

执行结果：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181009185717108.jpg)

`:nth-child(n)`选择某个元素的一个或多个特定的子元素。
`:nth-last-child(n)`选择某个元素的一个或多个特定的子元素。从这个元素的最后一个子元素开始计数。

>注：`:nth-child(n)`这里的n从1开始计数，1则代表第一个元素，等同于`:first-child`选择器。

`:nth-of-type()`选择指定的元素。
`:nth-last-of-type()`选择指定的元素，从元素的最后一个开始计算。

**小节（重点)**：
`p:nth-child(2)`方式，`p`的父级元素下的所有元素，然后再拿第2个元素出来，看看是不是`p`元素，如果是则选中。
`p:nth-of-type(2)`方式，`p`的父级元素下的所有`p`元素，然后再拿第2个元素选中。

***

`:only-child`选择的元素是它的父元素的唯一一个子元素。
`:only-of-type`选择一个元素是它的上级元素的唯一一个相同类型的子元素。
`:empty`选择的元素里面没有任何内容。

#### 伪元素选择器

`::first-letter`选择元素文本的第一个字（母）。
`::first-line`选择元素文本的第一行。
`::selection`改变选中的文本。
`::before`在元素内容的最前面添加新内容。
`::after`在元素内容的最后面添加新内容。

> 注：使用`::before`和`::after`时需要加入`content:" "`属性之后才能生效。

案例：
1，清除浮动：

```css
.clearfix::after{
    /*清除浮动*/
    content:"";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
.clearfix{
    *zoom:1;/*IE*/
}
```

> 在父级元素添加`.clearfix`类，可清除浮动

2，增大可点击范围

```css
      [type=checkbox]{
        position: relative;
      }
      [type=checkbox]:after{
        content:'';
        top:-5px;
        left:-5px;
        position:absolute;
        border:1px solid #000;
        width: 20px;
        height:20px;
      }
```

```jsx | pure
<input type="checkbox" />
```

执行结果：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181009185918502.jpg)

3，画分割线

```css
.division::before,
.division::after{
    content: '';
    display: inline-block;
    border-top: 1px solid black;
    width: 300px;
    margin: 5px;
}
```

```jsx | pure
<p class="division">分割线</p>
```

执行结果：
![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181009185938480.jpg)

