---
title: String
group:
  order: 2
  title: js基础与案例
order: 3
---
# String

## API基础

### 符串数组转化

```js
// 字符串转数组
let s = '1,2,3,4,5'
s.split(',')
// 数组转字符串
let arr = [1,2,3,4]
arr.join(',')
```

### 拼接字符串

利用数组拼接字符串，这样可以减少资源消耗，尤其是多层循环拼接字符串时。

```js
var str = '123'
var str2 = '456'
arr = []
arr.push(str)
arr.push(str2)
arr.join('').log(); // 123456
```

或者使用 concat 可以达到相同目的

```js
//拼接新的字符串出来
//concat()
var newstr = '123'.concat('456','789')//这是数组的方法
newstr.log()
```

### 遍历

```js
//字符串遍历
var str = '123'
for (var i=0;i<str.length;i++) {
  str[i].log()
  // 或者str.charAt(i).log()
}
```

### 不可变性

字符串具有不可变性（只读），所以字符串重新赋值会产生空间垃圾

```js
str[2] = '5'//无法赋值
```

### 存储方式

字符串存储方式有两类（堆/栈）

```js
//字符串存储
var str = '123'//栈
var str2 = new String('123')//堆
console.log(typeof str2)//object
```

### unicode编码

使用 fromCharCode 和 charCodeAt 函数可以对一个字编码。

```js
//返回unicode对应字符（1个）
//fromCharCode()
//charCodeAt()
String.fromCharCode(101).log() // "e"
'好we'.charCodeAt(0).log()// 第一个字符“好” 对应 22909
```

### slice,substr和substring

```js
var test = 'hello world';
```

**slice**

参数为两个正数

```js
alert(test.slice(4,7)); //o w // [4,7) 参数是起始位置和结束位置(不包括结束位置)
```

参数为一个负数

```js
alert(test.slice(-3)); //rld // 倒数长度的字符，参数是几就截取几个字符
```

参数为一正一负数

```js
// 'hello world'
alert(test.slice(3,-4)); // lo w 
alert(test.slice(0,-2)); // hello wor
// 参数是起始位置和倒数的结束位置（数的结束位置从零开始数）
```

**substring**

参数为两个正数

```js
alert(test.substring(4,7)); //o w 
// 参数是起始位置和结束位置(不包括结束位置)（同slice一样）
```

> 注：substring是以两个参数中较小一个作为起始位置，较大的参数作为结束位置。

```js
alert(test.substring(7,4)); //o w
```

参数为一个负数

```js
alert(test.substring(-3)); //hello world
// 显示全部字符串
```

参数为一正一负数

```js
alert*(**test**.substring(3,-4)); // hel
// 第二个参数没有用
```

**substr**

参数为两个正数

```js
alert(test.substr(4,7)); //o world
// substr 接收的则是起始位置和所要返回的字符串长度
```

参数为一个负数

```js
alert(test.substr(-3));// rld 
// 倒数长度的字符，参数是几就截取几个字符（同slice一样）
```

参数为一正一负数

```js
alert(test.substr(3,-4)); // 空字符串(没用)
```

总结：

一般指定位置使用 slice 即可，指定长度使用 substr 即可，当有需要截取倒数几个字符时使用 substr。

### 进制转化

#### 10进制转16进制

```js
var a = num.toString(16)
```

####  16进制转10进制

```js
 var a = Number.parseInt(str,16)//a是十进制数
```

注意：ParseInt(string, radix)第二个参数，表示要解析的数字的基数。该值介于 2 ~ 36 之间。超出范围为NaN。

表示转义的数为多少进制的数转为10进制。
parseInt("10");			//返回 10
parseInt("19",10);		//返回 19 (10+9)
parseInt("11",2);		//返回 3 (2+1)
parseInt("17",8);		//返回 15 (8+7)
parseInt("1f",16);		//返回 31 (16+15)



### 大小写转换

str.toUpperCase() // 变大写

str.toLowerCase() // 变小写

### 检测末尾子串

str.endsWith('end') // 精确大小写，如果末尾为 end 结尾返回true
str.startsWith("Hello"); // 精确大小写，如果开头为 Hello 开头返回true

### 去除两端空格

str.trim() //两端多余空格

### 判断开头字符串

```js
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

//是否以它开头
function strBefore(str,bef){
  var reg = new RegExp("^"+bef)
  return reg.test(str)
}
console.log(strBefore('你好','你'))

//// ------------- END -------------
}); 
```

### seplace

替换字符，可以传入正则表达式

```js
sName.replace(reg,function (s,p1,p2,p3,index,str) {
    return b+c.toUpperCase()
})
```

replace函数的第二个参数newvalue比较特殊，它有一下几个特殊字符串：

- $$ 直接量符号(就是当做'$$'字符用)
- $& 与正则相匹配的字符串
- $` 匹配字符串左边的字符 
- $’ 匹配字符串右边的字符
- $1,$2,$,3,…,$n 匹配结果中对应的分组匹配结果

```js
'获得金钱：1000。'.replace(/[\d]+/g,'$$'+'$&') // 获得金钱：$1000。
```

想要消除$的影响可以写成函数的返回值，函数具有一下几个参数：

- 第一个参数：匹配到的字符串
- 中间的参数：如果正则使用了分组匹配就为多个否则无此参数
- 倒数第二个参数：匹配字符串的对应索引位置
- 最后一个参数：原始字符串

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

'1122332'.replace(/([1])([2])/,function (s,p1,p2) {
    const index = arguments[arguments.length-2]
    const str = arguments[arguments.length-1]
    console.log([s,p1,p2,index,str])
})
// ["12","1","2",1,"1122332"]

//// ------------- END -------------
}); 
```

### 正则相关

上边介绍了replace方法，下边在介绍一点正则相关的知识。

#### 常用知识

\b 匹配一个单词边界，即字与空格间的位置。（开头和结尾以及空格都匹配）

\B 非单词边界匹配。

\s 是匹配所有空白符，包括换行。

\S 非空白符。

\d等价于`[0-9]`。

\D等价于`[^0-9]`。

\w等价于`[A-Za-z_0-9]`。

\W等价于`[^A-Za-z_0-9]`。

[] 包含，默认是一个字符长度。

[^] 不包含，默认是一个字符长度。

{n,m} 匹配长度。

. 任何单个字符(字符点)。

| 或

\ 转义

$ 结尾

[A-Z] 26个大写字母

[a-z] 26个小写字母

[0-9] 0至9数字

[A-Za-z0-9] 26个大写字母、26个小写字母和0至9数字

#### **获取匹配：**

`(pattern) ` 匹配 pattern 并获取这一匹配。所获取的匹配，可以从产生的 Matches 集合得到，使用$0…$9属性匹配圆括号字符。

#### **非获取匹配：**

`(?:pattern) ` 非获取匹配，匹配 pattern 但不获取匹配结果。也就是此括号内容不往Matches集合存。

`(?=pattern) ` 非获取匹配，正向肯定预查，在任何匹配 pattern 的字符串开始处匹配查找字符串，该匹配不需要获取供以后使用。

例如，“Windows(?=95|98|NT|2000)” 能匹配 “Windows2000” 中的 “Windows”，但不能匹配 “Windows3.1” 中的 “Windows” 。

`(?!pattern)` 非获取匹配，正向否定预查，在任何不匹配 pattern 的字符串开始处匹配查找字符串，该匹配不需要获取供以后使用。例如 “Windows(?!95|98|NT|2000)” 能匹配 “Windows3.1” 中的 “Windows”，但不能匹配 “Windows2000” 中的 “Windows”。

`(?<=pattern)` 非获取匹配，反向肯定预查，与正向肯定预查类似，只是方向相反。例如，“(?<=95|98|NT|2000)Windows” 能匹配 “2000Windows” 中的 “Windows” ，但不能匹配 “3.1Windows” 中的 “Windows” 。

`(?<!pattern)` 非获取匹配，反向否定预查，与正向否定预查类似，只是方向相反。例如 “(?<!95|98|NT|2000)Windows” 能匹配 “3.1Windows” 中的 “Windows” ，但不能匹配 “2000Windows” 中的 “Windows” 。



#### \1 \2 \3……解读

相比于 `$1`, `\1`是写入**正则表达式内**的。

`\1` 就是用户用 `()` 定义的第一组，同理 `\2` 就是第二组。

如 `(\d)(\w) \1\2`，其中`\1`就是`\d`匹配的值。

> 注：上面一例与 `(\d)(\w)(\d)(\w)` 不同，`(\d)(\w)(\d)(\w)` 可以匹配 `d1d2`，而 `(\d)(\w) \1\2` 只能匹配 `d1d1` 因为 `(\d)` 一旦匹配就 `\1` 的值就固定了。



#### exec

检索字符串中与正则表达式匹配的值，返回一个数组，存放匹配的结果。

如果未找到，返回null。

**匹配到一个值**

```js
const str = "hello world1";
const r1 = /(hello) (he1)/g

const result = r1.exec(str);
const [, a, b, c] = result;
console.log('结果1：',a, b, c)
console.log('结果2：',result)
//结果1：hello world1 undefined
//结果2：
//[                          
//  'hello world1',             
//  'hello',                 
//  'he1',                   
//  index: 0,                
//  input: 'hello world1',
//  groups: undefined        
//]   
```

上述，exec 返回的数组，数组**第一项**固定为**整个正则匹配的值**。**第二项**以及**后边所有项**为**小括号（获取匹配或者说 Matches 集合）**匹配的值。

而 **result.index** 表示匹配到的**子串**第一个字符，在**父串**中的**位置**。**result.input** 表示**父串**。



**如果匹配到多个值时**

```js
const str = "hello world1 hello world2";
const r1 = /(hello) (he[\d]+)/g // 注意一定要有 g 否则永远返回第一个值

const result = r1.exec(str);
const result2 = r1.exec(str);
const result3 = r1.exec(str);

console.log(result)
console.log(result2)
console.log(result3)
// [
//   'hello world1',
//     'hello',
//     'he1',
//     index: 0,
//   input: 'hello world1 hello world2',
//   groups: undefined
// ]
// [
//   'hello world2',
//   'hello',
//   'he1',
//   index: 0,
//   input: 'hello world1 hello world2',
//   groups: undefined
// ] 
// null
```

当正则表达式设置 g 时，可以多次调用 exec 方法，获取多次匹配，直到为 null。



## [案例] 十以内加0

```jsx

/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

var str = '1'
str = ('0'+str).slice(-2)
console.log(str) // ‘01’

//// ------------- END -------------
}); 
```

## [案例] rgb 颜色转换为十六进制

### reb(0,238,255)->#00eeff

将 rgb 颜色字符串转换为十六进制的形式，如 rgb(255, 255, 255) 转为 #ffffff

1. rgb 中每个 , 后面的空格数量不固定
2. 十六进制表达式使用六位小写字母
3. 如果输入不符合 rgb 格式，返回原始输入

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

function toRgb(str){
  var arr = str.match(/(?<=[(,])(\d{1,3})/g)
  arr = arr.map(function(item,index,arr){
    return ('0'+Number(item).toString(16)).slice(-2)
  })
  return '#'+arr.join("")
}
console.log(toRgb('rgb(255,255,200)'))

//// ------------- END -------------
}); 
```

### #00eeff-> reb(0,238,255)

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

function toRgb(str){
  str = str.substr(1)
  var arr = []
  arr.push(parseInt(str.substr(0,2),16))
  arr.push(parseInt(str.substr(2,2),16))
  arr.push(parseInt(str.substr(4,2),16))
  return 'rgb('+arr.join(',')+')'
}
console.log(toRgb('#00eeff'))//reb(0,238,255)

//// ------------- END -------------
}); 
```

## [案例] 判断是否为金钱格式

1、以 $ 开始
2、整数部分，从个位起，满 3 个数字用 , 分隔
3、如果为小数，则小数部分长度为 2
4、正确的格式如：$1,023,032.03 或者 $2.03，错误的格式如：$3,432,12.12 或者 $34,344.3

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

function isUSD(str) {
    return /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/.test(str);
}
console.log(isUSD('$20,933,209.93'))//true

//// ------------- END -------------
}); 
```



## [案例] 格式化金额

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

//格式化金钱（金额，保留几位小数）
//replace()//不改变原来数组
//toFixed()//四舍五入保留小数几位
var getMoney = function(money,num){
  num = num||2
  if(isNaN(money)) return money//判断非数字
  money = (Number(money).toFixed(num)).toString()
  var count = (money.length-1-num)%3
  var top = money.substr(0,count)===''?'':
  money.substr(0,count)+','
  var body = money.substr(count)
  body = body.replace(/(?<!\.\d*)(\d{3})(?=\d)/g,'$&,')
  return top+body
}
console.log(getMoney(3831531.531,2)) // 3,831,531.53

//// ------------- END -------------
}); 
```

## [案例] 计算字符串长度

当bUnicode255For1参数为false时Unicode大于255的算2长度。

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

function strLength(s, bUnicode255For1) {
    var num = 0
    if (bUnicode255For1) {
        num = s.length
    } else {
        for (var i = 0; i < s.length; i++) {
            num+=s.charCodeAt(i)>255?2:1
        }
    }
    return num
}

console.log(
    strLength("ssd你好va")
)

//// ------------- END -------------
}); 
```

## [案例] 转化css属性为js属性

css 中经常有类似 background-image 这种通过 - 连接的字符，通过 javascript 设置样式的时候需要将这种样式转换成 backgroundImage 驼峰格式，请完成此转换功能

1. 以 - 为分隔符，将第二个起的非空单词首字母转为大写
2. -webkit-border-image 转换后的结果为 webkitBorderImage

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

function cssStyle2DomStyle(sName) {
    return sName.replace(/(?:[-]?)([\w]+)-[\s]*([\w])/g,function (a,b,c) {
        return b+c.toUpperCase()
    })
}
console.log(cssStyle2DomStyle("-webkit-border-image"))

//// ------------- END -------------
}); 
```

## [案例] 统计字符数量

统计字符串中每个字符的出现频率，返回一个 Object，key 为统计字符，value 为出现频率

1. 不限制 key 的顺序
2. 输入的字符串参数不会为空
3. 忽略空白字符
   示例1
   输入
   'hello world'
   输出
   {h: 1, e: 1, l: 3, o: 2, w: 1, r: 1, d: 1}

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

function count(str) {
	var obj = {};
	str.replace(/\S/g,function(s){
   		!obj[s]?obj[s]=1:obj[s]++;
	})
	return obj;
}
console.log(count('hello world'))

//// ------------- END -------------
}); 
```

## [案例] 请计算出字典序最大的s的子序列

对于字符串x和y, 如果擦除x中的某些字母(有可能全擦掉或者都不擦)能够得到y,我们就称y是x的子序列。例如."ncd"是"nowcoder"的子序列,而"xt"不是。
现在对于给定的一个字符串s,

**请计算出字典序最大的s的子序列**

输入描述:
输入包括一行,一个字符串s,字符串s长度length(1 ≤ length ≤ 50).
s中每个字符都是小写字母

输出描述:

输出一个字符串,即字典序最大的s的子序列。

示例1

输入

test

输出

tt

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------


    //贪心算法
    //思路：把字符串倒过来，然后挨个拿出来比较，如果比刚刚拿出来的大，则放入数组
    function getMaxString(str) {
        var res = [];
        res.push(str[0]);
        for (var i = 1; i < str.length; i++) {
            while (str[i] > res[res.length - 1] && res.length >= 1) {
                res.pop();
            }
            res.push(str[i]);
        }
        return res.join("");
    }
    console.log(getMaxString('test'));

//// ------------- END -------------
}); 
```

## [案例] 空格过滤器

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------


function spaceFiltering(str) {
    return str.replace(/(\s)/g,"")
}
console.log(spaceFiltering("hello world"))

//// ------------- END -------------
}); 
```

## [案例] 过滤头尾空白符

> 注：js 本身有 trim 方法，这里实现一种正则写法。

请给JavaScript的String 原生对象添加一个名为trim 的原型方法，用于截取空白字符。要求
     alert(" taobao".trim());     // 输出 "taobao"
     alert(" taobao ".trim());    // 输出 "taobao"

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

 String.prototype.trim = function(){
     var str = this.toString()
     str = str.replace(/^\s+|\s+$/g,'')
     return str
 }
 console.log(' sd fe '.trim())

//// ------------- END -------------
});
```

## [案例] URL参数获取工具

1. 指定参数名称，返回该参数的值 或者 空字符串

2. 不指定参数名称，返回全部的参数对象 或者 {}

3. 如果存在多个同名参数，则返回数组

```jsx

/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

function getUrlParam(sUrl, sKey) {
   let _arr = sUrl.match(/(?<=(&|\?))([\w-]*=[^&]*)(?=&|$)/g)
       let obj = {}
       for (let i in _arr) {
           let ky = _arr[i].split("=")
           if (obj.hasOwnProperty(ky[0])) {
               if(!Array.isArray(obj[ky[0]])){
                   let _val = obj[ky[0]]
                   obj[ky[0]] = []
                   obj[ky[0]].push(_val)
               }
               obj[ky[0]].push(ky[1])
           }else obj[ky[0]] = ky[1]
       }
   if (sKey == "" || typeof sKey == "undefined") {
       return obj
   }else{
       if(!obj[sKey])return ""
       return obj[sKey]
   }
}
console.log(getUrlParam('http://localhost:8000/js/3_-string?a=1&b=c'))
console.log(getUrlParam("http://www.nowcoder.com?key=1&key=2&key=3&test=4#hehe"))

//// ------------- END -------------
});
```

简单实现：

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

//url参数
  function getParam(url) {
   var obj = {}
   var temp = null
   url.replace(/(?<=[?&])([\w-]+=[^&\s]+)(?=[&]|$)/g, function (match) {
       temp = match.split('=')
       obj[temp[0]] = temp[1]
   })
   return obj
  }
  console.log(getParam('http://www.nowcoder.com?key=1.,#5$&key2=2&key3=3&test=4#hehe'))
// {key: "1.,#5$", key2: "2", key3: "3", test: "4#hehe"}

//// ------------- END -------------
});
```



## [案例] 字符串合并优化

使用数组合并字符串，不要使用 “+=” 。String 具有只读特性，不可修改其内容，所以每次修改都是重新组合后赋值，所以有损性能。 

```js
var NEWS = [
        {LINK: "asdasd", TITLE: "sdfsdfsd"},
        {LINK: "asdasd", TITLE: "sdfsdfsd"},
        {LINK: "asdasd", TITLE: "sdfsdfsd"},
        {LINK: "asdasd", TITLE: "sdfsdfsd"},
        {LINK: "asdasd", TITLE: "sdfsdfsd"}]

    //优化前
    function f() {
        var htmlString =
            "<div class=”container”>" + "<ul id=”news-list”>";
        for (var i = 0; i < NEWS.length; i++) {
            htmlString += "<li><a href=”"
                + NEWS[i].LINK + ">"
                + NEWS[i].TITLE + "</a></li>";
        }
        htmlString += "</ul></div>";
        return htmlString
    }

    //优化后
    function f2() {
        var htmlString = []
        htmlString.push("<div class=”container”>" + "<ul id=”news-list”>")
        for (var i = 0; i < NEWS.length; i++) {
            htmlString.push("<li><a href=”"
                + NEWS[i].LINK + ">"
                + NEWS[i].TITLE + "</a></li>")
        }
        htmlString.push("</ul></div>")
        htmlString = htmlString.join("") //数组转字符串
        return htmlString
    }

    console.time("a")
    console.log(f())
    console.timeEnd("a") //a: 0.198974609375ms
    console.time("b")
    console.log(f2())
    console.timeEnd("b") //b: 0.129150390625ms

```

## [案例] 空字符串替换（剑指offer）

```jsx

/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

/*
题目描述
请实现一个函数，将一个字符串中的每个空格替换成“%20”。例如，当字符串为We Are Happy.则经过替换之后的字符串为We%20Are%20Happy。
*/
function replaceSpace(str){
  return str.replace(/\s/g,'%20')
}
console.log(replaceSpace('w as f s'))
//// ------------- END -------------
});
```

## [案例] 字符串排序（剑指offer）

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

   /*
      dp[i]表示i个元素他的可能排列数
    * dp[i]  = dp[i-1]*i
    * */
    function permutation(str){
        if(str === "")return []
        var arr = str.split('')
        var pd = [[[arr[0]]]]
        for(var i=1;i<arr.length;i++){
            pd[i] = []
            for(var j=0;j<pd[i-1].length;j++){
                // pd[i][j] = []
                //每一层有6个数组
                for(var t=pd[i-1][j].length;t>=0;t--){
                    //每个数组有3个元素
                    var tempArr = pd[i-1][j].concat([])
                    tempArr.splice(t,0,arr[i])
                    if(tempArr[t] !== tempArr[t-1])
                    pd[i].push(tempArr)
                }
            }
        }
        return pd[i-1].map(function(item){
            return item.join('')
        })
    }
    console.log(permutation('ab'))
    
//// ------------- END -------------
});
```

