---
title: CSS3其他补充
group:
  title: CSS3
  order: 2
order: 100
---
# CSS3其他补充
## @import方式引入CSS文件

在css文件内引入css文件可以使用@import方式，具体做法：

```css
@import url('./style.css');
```

引入CSS的方法有两种，一种是@import，一种是link
1，`@import url('地址');`
2，`<link href="地址" rel="stylesheet" type="text/css" />`
现在绝大部分的网站都采用后一种link方式，原因在于@import先加载HTML，后加载CSS。link先加载CSS，后加载HTML。所以前者加载网页会出现令浏览者以外的格式，后者则是带格式的加载网页。[原文链接](https://zhidao.baidu.com/question/312417403.html)

## CSS3opacity半透明

`opacity`设置半透明，兼容到IE9。

兼容更低IE版本写法：

```css
opacity{
　　　opacity:0.5;
　　　filter:alpha(opacity=50);  //filter 过滤器，兼容IE678
}
```

