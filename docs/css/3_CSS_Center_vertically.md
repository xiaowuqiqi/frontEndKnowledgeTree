---
title: 垂直居中
group:
  title: CSS基础
  order: 1
order: 3
---
# 垂直居中

## 垂直居中

### 1，使用`display: table-cell`
此方式，只有一层元素时（`.child`元素）也可以居中，但无法设置对于屏幕的百分比，如果要设为相对于屏幕的百分比需要加入一个`display: table`的父级元素。
```css
    .parent{
        display: table;
        width: 100%;
        height:200px;
    }
    .child{
        text-align:center;
        vertical-align:middle;
        display: table-cell;
    }
```
```html
<div class="parent">
    <div class="child">
        <p>你好</p>
    </div>
```

### 2，使用`transform:translate()`
此方法是支持css3的浏览器可用方法，存在兼容问题。但是代码简单。
```css
div{
    position: absolute;
    width: 200px;
    height: 200px;
    background-color: pink;
    top:50%;
    left: 50%;
    /*以前做法*/
    /*margin: -100px 0px 0px -100px;*/
    /*利用变形的位移*/
    transform:translate(-50%,-50%);
    /*变形的位移是以当前元素长宽为参考设置百分比 */
}
```
```html
<div class="parent"></div>
```

### 3，使用伪元素与`inline-block`
此方法很巧妙，利用`:after`占位来实现，但是子元素需要设置为`inline-block`
```css
.parent{
  text-align:center;
  width: 200px;
  height: 200px;
}
.parent:after{
  content:'';
  width:0;
  height:100%;
  display:inline-block;
  vertical-align:middle;
}
.child{
    display: inline-block;
    vertical-align:middle;
}
```
```html
<div class="parent">
    <div class="child">
        你好
    </div>
</div>
```

### 4，使用`display: flex`
此方法是支持`flex`属性的浏览器可用方法。
```css
.parent{
    display: flex;
    text-align: center;
    width: 200px;
    height: 200px;
    background-color: #444;
}
.child{
    margin: auto;
}
```
```html
<div class="parent">
    <div class="child">
        你好
    </div>
</div>
```
### 5，使用绝对定位
此方法使用absolute和margin:auto实现居中，注意：需要子元素设置宽高才可以实现。
```css
.parent{
    position: relative;
    width: 300px;
    height: 300px;
    background-color: #444;
}
.child{
    width: 10%;
    height: 10%;
    position:absolute;
    top: 0;
    left: 0;
    right:0;
    bottom:0;
    margin:auto;
}
```
```html
<div class="parent">
    <div class="child">
        你好
    </div>
</div>
```
## 浮动元素水平居中
### 宽度不固定元素居中
此时需要居中的元素需要设置定位为relative，right属性设为50%，并包裹一个父级元素，也设置为浮动。设置定位为relative，left设为50%。
所采用原理就是，定位后的位移属性的百分比以父级元素的宽为参考这一特性实现的。
```css
.parent{  
float:left;   
position:relative;   
left:50%;   
background-color: #eee;
}   
.child{    
float:left;   
position:relative;   
right:50%;   
}  
```
```html
<div class="parent">
    <div class="child">
        你好
    </div>
</div>
```

### 宽度固定元素居中
第一种方案，使用relative定位，设置left属性为50%，margin-left为负的宽度一半的值。
```css
.child{  
    float:left;
    background-color:pink;    
    width:100px;
    margin-left:-50px;
    position:relative; 
    left:50%; 
} 
```
```html
<div class="parent">
    <div class="child">
        你好
    </div>
</div>
```
第二种方案，使用absolute定位，设置left，reight属性为0，margin属性为auto。（此元素一定要有宽度）
```css
.child{  
    float:left;
    background-color:pink;  
    width:100px;
    position:absolute; 
    margin: auto;
    left:0;
    right: 0; 
} 
```
```html
<div class="parent">
    <div class="child">
        你好
    </div>
</div>
```

