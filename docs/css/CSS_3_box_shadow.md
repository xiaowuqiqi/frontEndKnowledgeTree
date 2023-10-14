---
title: 文字与背景阴影
group:
  title: CSS3
  order: 2
order: 3
---
# 文字与背景阴影

## css3文字阴影与背景阴影

### **文字阴影**

`text-shadow`参数依次为：`h-shadow`(水平位置)，`v-shadow`(垂直位置)，`blur`(模糊距离)，`color`(阴影颜色) 四个。

> 兼容性：IE9及其以下版本不支持，主流浏览器都支持此属性。

```css
p{
  color: #fff;
  text-shadow: 0px 0px 1px #000
}
```

浏览器截图：

![image-20230922213029277](./CSS_3_box_shadow.assets/image-20230922213029277.png)

### **背景阴影**

`box-shadow`参数为：`h-shadow`(水平位置)，`v-shadow`(垂直位置)，`blur`(模糊距离)，`spread`(阴影尺寸)，`color`(颜色)，`inset`(是否设为内阴影) 六个。

```css
div{
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  width:100px;
  height:100px;
  margin:auto;
}
```

浏览器截图：

![在这里插入图片描述](./CSS_3_box_shadow.assets/image-20230922213012171.png)

inset设置盒子阴影为内阴影模式。

```css
box-shadow: 0px 9px 15px 30px rgba(0,0,0,0.1) inset; 
```

![image-20230922212953732](./CSS_3_box_shadow.assets/image-20230922212953732.png)

