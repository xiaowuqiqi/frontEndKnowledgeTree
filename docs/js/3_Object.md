---
title: Object
group:
  order: 2
  title: js基础与案例
order: 3
---
# Object

## Object.keys

返回一个对象的键名集合

```javascript
Object.keys(obj)
```

`Object.keys()` 方法会返回一个由给定对象的自身**可枚举属性**组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致。而与 getOwnPropertyNames 相比，getOwnPropertyNames  方法返回一个由指定对象的所有自身属性的属性名（**包括不可枚举属性**）组成的数组。

但是他们共同点是**都是返回自身的属性，不会返回原型链上的。**

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

const obj = {
  name: "孙悟空"
};

Object.defineProperties(obj, {
  age: {
    value: 500,
    enumerable: false,
  },
  height: {
    enumerable: true,
    get() {
      return "俺老孙想多高就多高";
    }
  }
});
console.log(Object.keys(obj)); // ['name', 'height']
console.log(Object.getOwnPropertyNames(obj)); // ['name', 'age', 'height']}
    
//// ------------- END -------------
}); 
```

## Object.values

返回一个对象的值集合

## for in

遍历所有可枚举属性（包含原型链的属性）

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

  var F = function(){
    this.a = '1'
  }
  F.prototype.b = '2'
  var f = new F()
  f.c = '3'
  for(var i in f){
    console.log(f[i])//1,3,2，
    //涉及到原型链的问题，顺序是：132，因为最先查找自身属性（a，c），再去查找原型链属性（b）
  }
    
//// ------------- END -------------
}); 
```

注意的是 es6 中 class 实现原型链继承我们写的变量通常都是在 this 上，而**函数声明会挂在 prototype 上**。

```javascript
class A{
 name = 1 // 在 this 上
 constructor(){
     this.age = 2 // 在 this 上
 }
 getLog(){} // 在 prototype 上
 getLog = ()=>{} // 在 this 上
}
```

## hasOwnProperty

检测一个对象是否含有特定的自身属性(原型链上的不算)

```javascript
/////////// 案例1
  var F = function(){
    this.a = '1'
  }
  F.prototype.b = '2'
  var f = new F()
  f.c = '3'

  for(var i in f){
    if(f.hasOwnProperty(i)){
      console.log(f[i])//1,3
    }
  }

/////////// 案例2
class A{
    constructor(){
        this.age = 2
    }
    name = 1
    getLog(){return 12} // 函数声明会挂在 prototype 上
    getLog2 = ()=>{return 23}
}
let b = new A()
b.c = 3

for(var i in b){
    if(b.hasOwnProperty(i)){
        console.log(b[i])
        //1
        //()=>{return 23}
        //2 // constructor 中的赋值晚于 class 声明时 name、getLog2 的赋值
        //3
    }
}
```

## Object.getOwnPropertyNames

返回所有自身的属性名（不包括Symbol类型属性，不包括原型链的属性）组成的数组。

> 判断逻辑同上 hasOwnProperty 都是不包含原型链

```javascript
var a_names = Object.getOwnPropertyNames({a:1});
```

## defineProperty

在一个对象上创建（编辑）一个属性，同时**设置**这个**属性的描述对象**。

`Object.defineProperty(对象,“属性名”,描述对象);`

描述对象中的属性及其各自的作用：

| 属性名       | 作用                                           |
| ------------ | ---------------------------------------------- |
| configurable | 是否可以删除该属性或者修改该属性的定义描述对象 |
| enumerable   | 该属性是否可枚举                               |
| writable     | 该属性是否可修改                               |
| get          | 获取该属性值时调用该函数                       |
| set          | 设置该属性值时调用该函数                       |
| value        | 该属性的值或者方法                             |

注意的是 **configurable，enumerable，writable** 都是默认为true。

同时注意 **value** 和 **wriable** 属性与 **get** 和 **set** 属性是冲突的，不要同时出现。

例如：

```js
Object.defineProperty(o, "b", {
  configurable: true, //是否可以删除该属性或者修改该属性的定义描述对象
  enumerable: true, //该属性是否可枚举
  writable: false, //该属性是否可修改，可以定义对象中的常量属性
  value: 4, //value就是这个属性的值，如果value是一个函数，b就是一个方法
});
```
## getOwnPropertyDescriptor

同 defineProperty 对应的是 getOwnPropertyDescriptor 方法，它用于**获取属性的描述对象**。

`Object.getOwnPropertyDescriptor(object, propertyname)`

例如：

```js
var descriptor=Object.getOwnPropertyDescriptor(person,"name");
```

## getOwnPropertyDescriptors

ES5 的`Object.getOwnPropertyDescriptor()`方法会返回某个对象属性的描述对象（descriptor）。ES2017 引入了`Object.getOwnPropertyDescriptors()`（名字多了个 s）方法，返回指定对象**所有**自身**属性**（**非继承属性**）的**描述对象**。

**案例1**

```javascript
const source = {
  set foo(value) {
    console.log(value);
  }
};

const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
Object.getOwnPropertyDescriptor(target2, 'foo')
// { get: undefined,
//   set: [Function: set foo],
//   enumerable: true,
//   configurable: true }
```

**案例2**

用于合并一个对象，浅拷贝，同时拷贝对应的描述对象。

```js
// 合并一个对象到另一个对象，注意是浅拷贝。
// 但是，会复制对象描述，同解构（{...obj}）还是有区别的。
// 重要的是，这种方法，会覆盖 get 方法到对象上。
const mergeExports = (obj, exports) => {
	const descriptors = Object.getOwnPropertyDescriptors(exports);
	Object.defineProperties(obj, descriptors);
	return /** @type {A & B} */ (Object.freeze(obj));
};
// 使用
{
    create: mergeExports(obj1, {
    	get sync() {
        	return createSync;
    	}
	}),
}
```

## freeze

Object.freeze()方法。它的作用是**冻结**一个对象，被冻结的对象有以下几个特性：

不能添加新属性

不能删除已有属性

不能修改已有属性的值

不能修改原型

不能修改已有属性的可枚举性、可配置性、可写性

```js
Object.defineProperties(obj, descriptors);
```

**备注**

更多api参考：https://es6.ruanyifeng.com/?tdsourcetag=s_pctim_aiomsg#docs/object-methods#Object-hasOwn

## [ 案例 ] 补判断两个对象是否相等（引用相等或值相等）

### 比较一层

```javascript
      function isObjectValueEqual(a, b) {
        console.dir(Object)
        var aProps = Object.getOwnPropertyNames(a);
        //返回所有自身的属性名（包括可枚举属性，不包括Symbol类型属性，原型链的属性）组成的数组
        var bProps = Object.getOwnPropertyNames(b);
        if (aProps.length != bProps.length) {
            return false;
        }
        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
      }
```

### 递归深层比较

```javascript
/**

 * 深度判断一个对象的key和模板是否相等，且value类型是否相等，有数组时比较数组内的每条数据和模板是否相等
 * */
function isObjKeyEqual(component, data) {
    return _isObjKeyEqual(component, data)

    function _isObjKeyEqual(a, b) {
        if (getType(a) !== getType(b)) return false
        if (getType(a) !== '[object Object]') return true
        //obj
        var aProps = Object.getOwnPropertyNames(a); //返回所有的键名
        var bProps = Object.getOwnPropertyNames(b);
        if (aProps.length != bProps.length) return false;
        for (var i = 0; i < aProps.length; i++) {
            if (aProps[i] !== bProps[i]) return false; //键名不一样
            if (!isObjKeyEqual(a[aProps[i]], b[aProps[i]])) return false //把值放进去，如果值是数组或是其他会继续往下执行
            if (getType(a[aProps[i]]) === '[object Array]') { //假如是数组
                if (a[aProps[i]][0] && !b[aProps[i]][0]) return false //假如模板数组有值，b至少有一条对应值
                if (a[aProps[i]][0])//模板数组有值，需要继续比较
                    for (var j = 0; j < b[aProps[i]].length; j++) {
                        //只要b有数据就比较，没有就算了，但至少有一条
                        if (b[aProps[i]][j] && !isObjKeyEqual(a[aProps[i]][0], b[aProps[i]][j])) return false
                    }
            }
        }
        return true
    }

    function getType(obj) {
        return Object.prototype.toString.call(obj)
    }
}
```

## [ 案例 ] 深度遍历覆盖对象

使用

```js
let copyObj = {
    a: 1,
    b: 2,
    c: {
        d: 3,
        e: [
        ],
        gg: null
    }
}
let obj = {c: {
        d: 2,
        e: [
            {
                o: 2,
                jj: {ww: 3}
            },
            {
                o: 2,
                jj: {ww: 3}
            }
        ],
        gg: null
    }}
copyNullObj(obj, copyObj)
console.log(obj)
```

方法

```js

function copyNullObj(obj, copyObj) {
    //深度遍历用一个对象覆盖一个对象
    _copyNullObj(obj, copyObj)
    return obj
    function _copyNullObj(obj, copyObj) {
        for (let key in copyObj) {
            if (isNull(copyObj[key]))
                continue;
            if (Object.prototype.toString.call(copyObj[key]) === '[object Object]') {
                if (isNull(obj[key])) obj[key] = {}
                _copyNullObj(obj[key], copyObj[key])
            } else if (Array.isArray(copyObj[key])) {
                if (isNull(obj[key])) obj[key] = []
                _copyNullArr(obj[key], copyObj[key])
            } else
            //已经是非对象
                obj[key] = copyObj[key]
        }
    }
    function _copyNullArr(arr, copyArr) {
        for (let i = 0; i < copyArr.length; i++) {
            if (isNull(copyArr[i]))
                continue;
            if (Object.prototype.toString.call(copyObj[i]) === '[object Object]') {
                if (isNull(arr[i])) arr[i] = {}
                _copyNullObj(arr[i], copyArr[i])
            }else
            if (Array.isArray(copyArr[i])) {
                if (isNull(arr[i])) arr[i] = []
                _copyNullArr(arr[i], copyArr[i])
            }else
            arr[i] = copyArr[i]
        }
    }

    function isNull(arg1) {
        return !arg1 && arg1 !== 0 && typeof arg1 !== "boolean" ? true : false;
    }
}

```



## [ 案例 ] 根据包名，在指定空间中创建对象

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

  // 输入描述
  // namespace({a: {test: 1, b: 2}}, 'a.b.c.d')
  // 输出描述
  // {a: {test: 1, b: {c: {d: {}}}}}
  function isObjFn (o) {
   return Object.prototype.toString.call(o) == '[object Object]';
  }
  function namespace(oNamespace, sPackage) {
   var _sPackArr = sPackage.split(".")
   var _obj = oNamespace
   for (var i = 0; i < _sPackArr.length; ++i) {
       if (!isObjFn(_obj[_sPackArr[i]]) || !_obj.hasOwnProperty(_sPackArr[i])) {
           _obj[_sPackArr[i]] = {}
       }
       _obj = _obj[_sPackArr[i]]
   }
   return oNamespace
  }
    console.log(namespace({a: {test: 1, b: 2}}, 'a.b.c.d'))
    
//// ------------- END -------------
}); 
```



## [ 案例 ] 闭包累加器

用闭包构建常用工具小工具

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

function create_counter(initial) {
    var x = initial || 0
    return {
        inc: function () {
            x+=1
            return x;
        }
    }
}
var c1 = create_counter()
console.log(c1.inc());//1
console.log(c1.inc());//2
console.log(c1.inc());//3
    
//// ------------- END -------------
}); 
```

## [ 案例 ] 扁平化对象

使用 Generate 特性。

```js
    let obj = {
        a: 1,
        b: {
            c: [{d: 20, e: 30}, {t: 10}],
            o: {u: 'sss', l: undefined},
            l: [1, 2, 3, 4, 5],
            s: ['ss', function () {
                return 999
            }]
        }
    }
    let flatObj = function* (obj) {
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++)
                yield* flatObj(obj[i])
        }
        else if (Object.prototype.toString.call(obj) === '[object Object]') {
            for (let item in obj)
                yield* flatObj(obj[item])
        }
        else yield obj
    }
    let arr = [...flatObj(obj)]
    console.log(arr)//1,20,30,10,sss,,1,2,3,4,5,ss,function () {return 999}
```

## [ 案例 ] for of遍历对象，实现 entries

object 是不能用 for of 遍历的，我们需要[继承一下 iteration 接口](https://es6.ruanyifeng.com/?tdsourcetag=s_pctim_aiomsg#docs/iterator#%E5%AF%B9%E8%B1%A1)才可以。

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

const entries = function* (obj){
    for(let k in obj){
        yield [k,obj[k]]
    }
}

for(let [key,value] of entries({a:1,b:2})){
    console.log(key)// 
    console.log(value)
}

//// ------------- END -------------
}); 
```



## [ 案例 ]Web相关案例

### 遍历页面所有元素节点

```js
var blanks=[];

function getChildren(parent){
    console.log(blanks.join("")+"|_"+(parent.nodeType==1?parent.nodeName:parent.nodeValue));
    if(parent.children.length>0){
        blanks.push("\t");
        for(var i=0,len=parent.children.length;i<len;i++){
            getChildren(parent.children[i]);
        }
        blanks.pop("\t");
    }
}
```

### 遍历页面所有节点

```js
var blanks=[];

function getChildren(parent){
    console.log(blanks.join("")+"|_"+(parent.nodeType==1?parent.nodeName:parent.nodeValue));
    if(parent.childNodes.length>0){
        blanks.push("\t");
        for(var i=0,len=parent.childNodes.length;i<len;i++){
            getChildren(parent.childNodes[i]);
        }
        blanks.pop("\t");
    }
}
getChildren(document);
```

### 在dom中查找共同的父级节点

查找两个节点的最近的一个共同父节点，可以包括节点自身。

> [contains](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/contains)判断节点是否是一个节点的后代节点

```js
function commonParentNode(oNode1, oNode2) {
    for(;oNode1;oNode1=oNode1.parentNode){
        if(oNode1.contains(oNode2)){ 
            // oNode2是否是oNode1的后代节点
            return oNode1;
        }
    }
}
// 执行
let a = document.getElementsByClassName('p2.1')[0]
let b = document.getElementsByClassName('d3.1')[0]
console.log(commonParentNode(a,b))
```

