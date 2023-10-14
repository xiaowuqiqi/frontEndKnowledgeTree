---
title: Nubmer、Math&Date
group: 3_js基础与案例
order: 3
---
# Date 对象

## 常用方法

```js
getFullYear(); //获取年份
1+dt.getMonth(); //获取月份
getDate() //获取每月几号
getDay() //从 Date 对象返回一周中的某一天 (0 ~ 6)。
getHours() //获取小时
getMinutes() //获取分钟
getSeconds() //获取秒
getTime() //获取毫秒
```

## Date初始化

date 可以传入参数，为一个毫秒数。

```js
new Date((1 * 24 * 60 * 60 + 5 * 60 * 60 + 2 * 60 + 5)*1000)
```

当传入 0 时，默认为：

Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)

证明时间在 1970 年 1月 1日 早上 八点计时的。

### 时间对象与字符串转化

字符串到 date 类型时间戳： new Date(XXX).getTime()

date 类型到字符串：new Date(XXX).toString()

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

console.log(new Date()) //Sat Apr 27 2019 16:58:10 GMT+0800 (中国标准时间)
console.log(new Date().getTime()) 
//到现在的毫秒数 //时间戳 
//也可以用Date.now()
new Date('2019-04-29T04:27:43.467Z').getTime()//获取mongoose Date 数据转时间戳
    
//// ------------- END -------------
});
```

> 注：new Date（xxx）//xxx可以方时间戳，可以方其他date字符串数据格式，统统格式化为“Sat Apr 27 2019 16:58:10 GMT+0800 (中国标准时间)”标准形式。



## [案例] 获取当前时间

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console,clear})=>{
//// --------- 执行代码如下 ----------

 	//获取当前时间
	function getDate(dt) {
        var ifAddZero = function(time) {
            return time<10?"0"+time:time;
        }
        // body...
        
        var year = dt.getFullYear();
        var month = ifAddZero(1+dt.getMonth());
        var day = ifAddZero(dt.getDate());

        var hou = ifAddZero(dt.getHours());
        var min = ifAddZero(dt.getMinutes());
        var second = ifAddZero(dt.getSeconds());

        return year+"年"+month+"月"+day+"日 "+hou+":"+min+":"+second;
    }
    //使用
    var date = setInterval(function(){
       var dt = new Date();
       clear();
       console.log(getDate(dt));
    },500)
    
//// ------------- END -------------
});
```

## [案例] 根据格式显示当前时间

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

 	//时间显示工具
function formatDate(date,fmt){
  var o={
    "M+": date.getMonth()+1,
    "d+":date.getDate(),
    "h+":date.getHours(),
    "m+":date.getMinutes(),
    "s+":date.getSeconds(),
    "q+":Math.floor((date.getMonth+3)/3),
    "S":date.getMilliseconds()

  }
  if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1,(date.getFullYear()+"").substr(4-RegExp.$1.length))
  if(/(w+)/.test(fmt)) fmt = fmt.replace(RegExp.$1,(['日', '一', '二', '三', '四', '五', '六'][date.getDay()]))
    for(var k in o){
      if(new RegExp("("+k+")").test(fmt))
        fmt = fmt.replace(RegExp.$1,(RegExp.$1.length == 1)?(o[k]):(('0'+o[k]).slice(-2)))
    }
    return fmt
}
console.log(formatDate(new Date(),'yyyy-M-d h:m:s 星期w'))
    
//// ------------- END -------------
});
```

## [案例] 格式化

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

//根据 秒 格式化其进制关系为 时，分，秒
function second(second) {
        var day = Math.floor(second / 86400)
        var hour = Math.floor(second / 3600) % 24
        var min = Math.floor(second / 60) % 60
        var sec = second % 60
        return {
            day: day,
            hour: hour,
            min: min,
            second: sec
        }
    }
    console.log(second(60*60+12))
    
//// ------------- END -------------
});
```



## [案例] 计时器

```js
//根据 秒 格式化其进制关系为 时，分，秒
function second(second) {
        var day = Math.floor(second / 86400)
        var hour = Math.floor(second / 3600) % 24
        var min = Math.floor(second / 60) % 60
        var sec = second % 60
        return {
            day: day,
            hour: hour,
            min: min,
            second: sec
        }
    }
//计时器
    function render(data) {
        var divEle = document.getElementById('jsCountdown')
        _tempGetTime()
        var time = setInterval(function () {
            data--
            if (data == 0) clearInterval(time)
            _tempGetTime()
        }, 1000)

        function _tempGetTime() {
            var obj = second(data)
            if (!obj.day) {
                divEle.children[0].className = 'hide'
            } else {
                if (obj.day < 10) obj.day = '0' + obj.day
                divEle.children[0].className = ''
                divEle.children[0].innerText = obj.day + '天'
            }
            divEle.children[1].innerText = ('0' + obj.hour).slice(-2) + ':'
            divEle.children[2].innerText = ('0' + obj.min).slice(-2) + ':'
            divEle.children[3].innerText = ('0' + obj.second).slice(-2)
        }
    }

    console.log(render(1 * 24 * 60 * 60 + 5 * 60 * 60 + 0 * 60 + 5))

```

## [案例] 添加时间戳，骗过304，防止浏览器缓存

有时候发现修改了样式或者js，刷新的时候不变，这就是客户端缓存了css或者js文件，需要清一下缓存。为了不必每次都清一下缓存，应该怎么弄呢？
//方法一

```html
<script type="text/javascript">
(function(){ 
     var randomh=Math.random();
     var e = document.getElementsByTagName("script")[0];
     var d = document.createElement("script");
     d.src = "//site.com/js.js?x="+randomh+"";
     d.type = "text/javascript"; 
     d.async = true;
     d.defer = true;
     e.parentNode.insertBefore(d,e);
 })();
</script>
```


//方法二

```html
<script>document.write("<script type='text/javascript' src='//site.com/js.js?v=" + Date.now() + "'><\/script>");</script>
```





# Math对象

## 常量

| 属性名                                                       | 描述                                              |
| ------------------------------------------------------------ | ------------------------------------------------- |
| [E](https://www.w3school.com.cn/jsref/jsref_e.asp)           | 返回算术常量 e，即自然对数的底数（约等于2.718）。 |
| [LN2](https://www.w3school.com.cn/jsref/jsref_ln2.asp)       | 返回 2 的自然对数（约等于0.693）。                |
| [LN10](https://www.w3school.com.cn/jsref/jsref_ln10.asp)     | 返回 10 的自然对数（约等于2.302）。               |
| [LOG2E](https://www.w3school.com.cn/jsref/jsref_log2e.asp)   | 返回以 2 为底的 e 的对数（约等于 1.414）。        |
| [LOG10E](https://www.w3school.com.cn/jsref/jsref_log10e.asp) | 返回以 10 为底的 e 的对数（约等于0.434）。        |
| [PI](https://www.w3school.com.cn/jsref/jsref_pi.asp)         | 返回圆周率（约等于3.14159）。                     |
| [SQRT1_2](https://www.w3school.com.cn/jsref/jsref_sqrt1_2.asp) | 返回返回 2 的平方根的倒数（约等于 0.707）。       |
| [SQRT2](https://www.w3school.com.cn/jsref/jsref_sqrt2.asp)   | 返回 2 的平方根（约等于 1.414）。                 |

## Math 对象方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [abs(x)](https://www.w3school.com.cn/jsref/jsref_abs.asp)    | 返回数的绝对值。                                             |
| [acos(x)](https://www.w3school.com.cn/jsref/jsref_acos.asp)  | 返回数的反余弦值。                                           |
| [asin(x)](https://www.w3school.com.cn/jsref/jsref_asin.asp)  | 返回数的反正弦值。                                           |
| [atan(x)](https://www.w3school.com.cn/jsref/jsref_atan.asp)  | 以介于 -PI/2 与 PI/2 弧度之间的数值来返回 x 的反正切值。     |
| [atan2(y,x)](https://www.w3school.com.cn/jsref/jsref_atan2.asp) | 返回从 x 轴到点 (x,y) 的角度（介于 -PI/2 与 PI/2 弧度之间）。 |
| [ceil(x)](https://www.w3school.com.cn/jsref/jsref_ceil.asp)  | 对数进行上舍入。                                             |
| [cos(x)](https://www.w3school.com.cn/jsref/jsref_cos.asp)    | 返回数的余弦。                                               |
| [exp(x)](https://www.w3school.com.cn/jsref/jsref_exp.asp)    | 返回 e 的指数。                                              |
| [floor(x)](https://www.w3school.com.cn/jsref/jsref_floor.asp) | 对数进行下舍入。                                             |
| [log(x)](https://www.w3school.com.cn/jsref/jsref_log.asp)    | 返回数的自然对数（底为e）。                                  |
| [max(x,y)](https://www.w3school.com.cn/jsref/jsref_max.asp)  | 返回 x 和 y 中的最高值。                                     |
| [min(x,y)](https://www.w3school.com.cn/jsref/jsref_min.asp)  | 返回 x 和 y 中的最低值。                                     |
| [pow(x,y)](https://www.w3school.com.cn/jsref/jsref_pow.asp)  | 返回 x 的 y 次幂。                                           |
| [random()](https://www.w3school.com.cn/jsref/jsref_random.asp) | 返回 0 ~ 1 之间的随机数。                                    |
| [round(x)](https://www.w3school.com.cn/jsref/jsref_round.asp) | 把数四舍五入为最接近的整数。                                 |
| [sin(x)](https://www.w3school.com.cn/jsref/jsref_sin.asp)    | 返回数的正弦。                                               |
| [sqrt(x)](https://www.w3school.com.cn/jsref/jsref_sqrt.asp)  | 返回数的平方根。                                             |
| [tan(x)](https://www.w3school.com.cn/jsref/jsref_tan.asp)    | 返回角的正切。                                               |
| [toSource()](https://www.w3school.com.cn/jsref/jsref_tosource_math.asp) | 返回该对象的源代码。                                         |
| [valueOf()](https://www.w3school.com.cn/jsref/jsref_valueof_math.asp) | 返回 Math 对象的原始值。                                     |

## 常用总结

```js
Math.PI //Π
Math.E

Math.floor(-21.2)//-22 下舍入
Math.floor(21.2)//21
// 接近零的整数
Math.ceil(-21.2)//-21 上舍入
Math.ceil(21.2)//22
// 远离零的整数

Math.round(21.5)//22 四舍五入

Math.fround(22.222) //22.222000122070312 ，转换成距离它最近的浮点类型

Math.sign() //返回正/负/0

Math.sqrt(3) //平方
Math.pow(2,3)//2的三次方

Math.abs(-5)//绝对值

```

## [案例] 判断数组最大的

```js
Math.max.apply(null,[1,2,3]).log()
Math.min(2,1,3)
```

## [案例] 产生随机数

 产生[min,max]范围内的整数随机数

```js
Math.floor(Math.random()*(maxNum-minNum+1)+minNum)
```

注：Math.random()生成的是[0，1 )的一个随机数，所以要加1才可以成为闭区间。

例如：要产生【5，10】的随机数，就得产生【0，5】的随机数 => `Math.floor(Math.random()*6)`

# Number

## 常用

```js
//常量
Number.MAX_VALUE // 大数
Number.MIN_VALUE // 小数

//Infinity 无穷大
Infinity

// 转化为number格式
parseInt("ss12") //NaN 
parseFloat(12) // 12

// es6
Number.parseInt()
Number.parseFloat()
```

## [案例] 判断两个float值是否相等

float 类型数字直接比较是返回false的，我们计算两个数的差值如果小于一个特别小的值（ EPSILON ）则表示相等

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

function floatEqual(a, b) {
    if(!Number.EPSILON){
        Number.EPSILON = Math.pow(2, -52)
    }
    if (a - b <= Number.EPSILON)
        return true //相等
    else
        if (a - b > 0)
            return a
    	else
        	return b
}
console.log(floatEqual(0.1+0.2,0.3))
    
//// ------------- END -------------
});
```

## [案例] 判断两个值是否完全相等

```js
function identity(val1, val2) {
    if(val1===val2){
        // +0不等于-0；但是用===的话会返回true；所以要做额外的判断
        return val1 !== 0 || val2 !== 0 || 1/val1 === 1/val2;
    }else {
        //NaN 等于 NaN 但是 NaN === NaN 等于 false;所以做额外的判断
        return val1 !== val1 && val2!== val2;
    }
}
```



## [案例] 不用加减乘除做加法（剑指offer）

写一个函数，求两个整数之和，要求在函数体内不得使用+、-、*、/四则运算符号

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

//不用加减乘除做加法
    /*
    *写一个函数，求两个整数之和，要求在函数体内不得使用+、-、*、/四则运算符号。
    * */
    function Add(num1,num2){
        // num1 = num1.toString(2)
        // num2 = num2.toString(2)
        console.log(num2&num1)
        console.log((num2|num1)^num2^num1)
        return num1^num2
    }
    console.log(Add(3,6))
    
//// ------------- END -------------
});
```

## [案例] 斐波那契数列（剑指offer）

大家都知道斐波那契数列，现在要求输入一个整数n，请你输出斐波那契数列的第n项（从0开始，第0项为0）。n<=39

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

/*大家都知道斐波那契数列，现在要求输入一个整数n，请你输出斐波那契数列的第n项（从0开始，第0项为0）。n<=39*/
function Fibonacci(n)
{
    if(n==0)return 0
    var temp0 = 0
    var temp1 = 1
    for(var i = 2;i<=n;i++){
        var temp = temp1
        temp1 += temp0
        temp0 = temp
    }
    return temp1
}
console.log(Fibonacci(6))
    
//// ------------- END -------------
});
```

## [案例] 浮点数的整数次方（剑指offer）

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

    function Power(base, exponent)
    {
        if(exponent == 0)return 1
        var res = 1
        var curr = base
        var agin = exponent>0?1:-1
        exponent = Math.abs(exponent)
        while(exponent!=0){
            if((exponent&1)==1)
                res*=curr
            curr*=curr
            exponent>>=1
        }
        return agin>0?res:(1/res)
    }
    console.log(Power(2,3))
    
//// ------------- END -------------
});
```

## [案例] 求n个数的和（剑指offer）

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

/*
    * 求1+2+3+...+n，要求不能使用乘除法、for、while、if、else、switch、case等关键字及条件判断语句（A?B:C）。
    * */
    function Sum_Solution(n){
        var num = 0
        function Sum_n(n){
            num+=n
            if(n==1)return num
            return Sum_n(n-1)
        }
        return Sum_n(n)
    }
    console.log(Sum_Solution(10))
    
//// ------------- END -------------
});
```

## [案例] 输出二进制中1的个数（剑指offer）

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

    function NumberOf1(n)
    {
        // write code here
        var count = 0,flag=1;
        while(flag){
            
            if(n&flag){count++;}
            flag=flag<<1;

        }
        return count;
    }
    console.log(NumberOf1(10))
    
//// ------------- END -------------
});
```

## [案例] 最小的k个数（剑指offer）

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

/*
    输入n个整数，找出其中最小的K个数。例如输入4,5,1,6,2,7,3,8这8个数字，
    则最小的4个数字是1,2,3,4,。
     */
    function GetLeastNumbers_Solution(input, k) {
		const res = input.slice(0,k).sort()
        const arr = input.slice(k)
        for(let i = 0;i<arr.length;i++){
            for(let j=0;j<res.length;j++){
                if(arr[i]<res[j]){
                    res.splice(j,0,arr[i])
                    res.pop()
                    break;
                }
            }
        }
        return res
    }

    console.log(GetLeastNumbers_Solution([4, 5, 1, 6, 2, 7, 3, 8], 4))
    
//// ------------- END -------------
}); 
```

## [案例] 判断是否为整数

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

var isNum = 13
if(typeof isNum === "number"&&isNum%1 === 0){
  console.log(isNum)
}
    
//// ------------- END -------------
}); 
```

## 正数转化实现

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

    console.log(parseInt('+22'))
    console.log(parseInt('-122'))
    console.log(parseInt('-12err2'))
    console.log(parseInt('-12.2'))
    console.log(parseInt('12-'))

    function StrToInt(str) {
        var reg = new RegExp("^(?:[+])*([-]?[\\d]+)(?:[.\\d-+]+)*$")
        if(num == '-0')return 0
        var num = 0
        str.replace(reg, function (item,p1) {
            num = p1
        })
        return num
    }
    console.log(StrToInt('+22'))
    console.log(StrToInt('-122'))
    console.log(StrToInt('-12err2'))
    console.log(StrToInt('-12.2'))
    console.log(StrToInt('12-'))
    console.log(StrToInt('12a'))
    console.log(StrToInt('a12'))
    console.log(StrToInt('1aa2'))
    
//// ------------- END -------------
});
```

