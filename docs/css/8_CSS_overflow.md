---
title: 隐藏与溢出
group:
  title: CSS基础
  order: 1
order: 8
---
# 隐藏与溢出

## 隐藏实现方式

参考资料：[CSS隐藏元素 display visibility opacity的区别](https://blog.csdn.net/zxf13598202302/article/details/50354644)

1，利用display隐藏与显示，属性：
none隐藏，且不占位置，无法点击。
block显示。

2，利用visibility（直译：能见度）（可见性）实现隐藏与显示，属性：
visible默认值。显示。
hidden隐藏，占据空间，无法点击。
inherit	规定应该从父元素继承 visibility 属性的值。

3，利用opacity（直译：不透明性）实现隐藏与显示，属性：
opacity: 0隐藏，占据空间，可以点击。
opacity: 1显示。

4，利用position: absolute实现隐藏与显示：

```css
position: absolute; 
top: -999em;
```

隐藏，不占据空间，无法点击。

> 注：常用于网站logo文本隐藏。

5，利用position: relative实现隐藏与显示：

```css
position: relative; 
top: -999em;
```

隐藏，占据空间，无法点击。

6，利用absolute与hidden实现隐藏与显示：

```css
position: absolute;
visibility: hidden;
```

隐藏，不占据空间，无法点击。

7，利用overflow实现隐藏与显示：

```css
height: 0;
overflow: hidden; 
```

隐藏，不占据空间，无法点击。

## overflow溢出隐藏

`overflow`规定当内容溢出元素框时发生的事情。
属性：
`visible`默认值。内容不会被修剪，会呈现在元素框之外。
`hidden`内容会被修剪，并且其余内容是不可见的。
`scroll`内容会被修剪，但是浏览器会显示滚动条以便查看其余的内容。
`auto`如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容。
`inherit`规定应该从父元素继承`overflow`属性的值。

## 鼠标样式

cursor属性规定要显示的光标的类型（形状）。
详解：
[W3school CSS cursor 属性](http://www.w3school.com.cn/cssref/pr_class_cursor.asp)
常用属性：pointer小手，text光标指示文本，move四个箭头，对象可被移动，defanlt默认光标（通常是一个箭头）。

## text-overflow溢出隐藏

text-overflow 属性规定当文本溢出包含元素时发生的事情。
属性：
clip修剪文本，不显示省略号。
ellipsis**显示省略符号来代表被修剪的文本**。
string使用给定的字符串来代表被修剪的文本。

>注：一般同white-space:nowrap（规定段落中的文本不进行换行）和overflow：hidden（溢出隐藏）同时使用。

例：



```jsx
/**
 * defaultShowCode: true
 */
export default ()=>{
//// --------- 执行代码如下 ----------
const p = {
    width: '200px',
	backgroundColor: '#ccc',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis'
}
return (<p style={p}>1，利用display隐藏与显示，属性：none隐藏，且不占位置，无法点击。block显示。2，利用visibility（音译：能见度）（可见性）实现隐藏与显示，属性：visible默认值。显示。hidden隐藏，占据空间，无法点击。inherit 规定应该从父元素继承 visibility 属性的值。3，利用opacity（音译：不透明性）实现隐藏</p>)
    
//// ------------- END -------------
};
```

![在这里插入图片描述](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/html/htmlImg/20181013172946932.jpg)
