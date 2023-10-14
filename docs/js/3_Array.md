---
title: Array
group: 3_js基础与案例
order: 3
---
# Array对象

## 常用API

### isArray

```js
Array.isArray('ss') //false
```

### from

类数组转化为数组

> arguments 参数对象

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

//from()
function _from(){
  var arr=Array.from(arguments)
  return arr
}
console.log(_from(1,2,3,4))
    
//// ------------- END -------------
});
```

### map

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

//map()函数操作后返回新的数组
var arr = [1,2,3,4].map(function(item,index,arr){
    return item+1
})
console.log(arr) //[2,3,4,5]
    
//// ------------- END -------------
});
```

### every

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

//every()测试函数，返回boolean(所有元素都通过为true)
var test = [1,2,3,4].every(function(item,index,arr){
  return item > 0
})
console.log(test)//true
    
//// ------------- END -------------
});
```

### filter

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

//filter()通过测试的元素，创建出新的数组
var arr = [1,2,3,4,5].filter(function(item,index,arr){
  return item>2
})
console.log(arr)//[3,4,5]
    
//// ------------- END -------------
});
```

### reduce

缩减运算，把一个arr运算后成一个值

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

var str = ['a','b','c'].reduce(function(total,item){
    return total +=item
},'')
console.log(str) // abc
    
//// ------------- END -------------
});
```

### slice

`slice()` 方法以新的数组对象，返回数组中被选中的元素。

`slice()` 方法选择从给定的 *start* 参数开始的元素，并在给定的 *end* 参数处结束，但不包括。

```jsx

/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

var fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
var citrus = fruits.slice(1, 3);
console.log(fruits) 
console.log(citrus)
    
//// ------------- END -------------
});
```



### splice

splice 参数1 必需。整数，指定在什么位置添加/删除项目，使用负值指定从数组末尾开始的位置。参数2 可选。要删除的项目数。如果设置为 0，则不会删除任何项目。

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

//删除与替换
let arr = [1,2,3,4]
arr.splice(1,1,99)//删除一号位元素，一个，并插入99，返回删除元素
console.log(arr) // [1, 99, 3, 4]
    
//// ------------- END -------------
});
```

### includes

检测一个元素是否存在

```js
arr.includes(12,-10) 
//在-10的位置往后查，是否有12这个元素有返回true 
//可以检查是否有NaN
```

### sort

排序

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

let arr = [1,2,5,4]
arr.sort(function(a,b){
  return b-a //从大到小
  // 由于 b-a ，为正数时，则互换元素（a为前边数，b为后边数，a如果小于b前边换到后边，小的在后边，则倒序排列）
})
console.log(arr) // 5421

//// ------------- END -------------
});
```

### 其他

```js
arr.push(2) // 尾添加元素
arr.pop() // 尾删除元素
arr.unshift(1) // 头添加元素
arr.shift() // 头删除元素

arr.indexOf(99) // 返回查到的位置，没有返回 -1
```



## [案例] 打平数组

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

// 2 数组平整化
var arr = [[1,2],[1,2],[3,4]].reduce(function(total,item){
    return total = total.concat(item)
},[])
console.log(arr)//[1,2,1,2,3,4]

arr = arr.concat(1,2,3)
console.log(arr)

//// ------------- END -------------
});
```

## [案例] 数组去重

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

Array.prototype.uniq = function () {
    var resArr = [];
    var flag = true;

    for(var i=0;i<this.length;i++){
        if(resArr.indexOf(this[i]) == -1){
            if(this[i] != this[i]){   //排除 NaN
                if(flag){
                    resArr.push(this[i]);
                    flag = false;
                }
            }else{
                resArr.push(this[i]);
            }
        }
    }
    return resArr;
}
var arr =[1,2,3,5,6,55,6]
console.log(arr)
console.log(arr.uniq())

//// ------------- END -------------
});
```

> 注：NaN特性，NaN！=NaN
>
> es6 也可以 `Array.from(new Set(arr))` 实现

## [案例] 反转数组

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

var arr = [0,1,2,3,4,5];
var arr2 = new Array();
for (var i = arr.length - 1; i >= 0; i--) {
    arr2[arr.length-i-1] = arr[i];
}
console.log(arr);   
console.log(arr2);

//// ------------- END -------------
});
```

> es6 也可以`arr.reverse()`

## [案例] 杨辉三角

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

//1
//1 1
//1 2 1
//1 3 3 1
//1 4 6 4 1
//1 5 10 10 5 1
function yhTriangle(n) {
    var dp = [[1]]
    for (var i = 1; i < n; i++) {
        var arr = [1]
        for (var j = 0; j < dp[i - 1].length - 1; j++) {
            arr.push(dp[i - 1][j] + dp[i - 1][j + 1])
        }
        arr.push(1)
        dp.push(arr)
    }
    return dp
}
console.log(yhTriangle(8))

//// ------------- END -------------
});
```

## [案例] 构建乘积数组（剑指offer）

构建一个数组，数组中的 i 位置是其他位置数字的乘积。

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

    function multiply(array)
    {
        if(array.length == 0)return []
        if(array.length == 1)return []
        var arr_b = []
        for(var i = 0;i<array.length;i++){
            arr_b[i] = 1
            for(var j =0;j<array.length;j++){
                if(j!=i){
                    arr_b[i]*=array[j]
                }
            }
        }
        return arr_b
    }
    console.log(multiply([4,2,6]))

//// ------------- END -------------
});
```

## [案例] 滑动窗口最大值（剑指offer）

输入一个数组num，以及连续子数组的长度size，输出长度为size的所有连续子数组中最大值，例如[2,3,4,3]，3输出[4,4]。原因在于其连续子数组且长度为3有[2,3,4]、[3,4,3]

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

function maxInWindows(num, size) {
    if (size == 0) return []
    if (size > num.length) return []
    var arr = []
    for (var i = 0; i <= num.length - size; i++) {
        var item = []
        for (var j = 0; j < size; j++) {
            item.push(num[i + j])
        }
        arr.push(Math.max.apply(null, item))
    }
    return arr
}

console.log(maxInWindows([2, 3, 4, 2, 6, 2, 5, 1], 3))         //4,4,6,6,6,5

//// ------------- END -------------
});
```

## [案例] 数组内元素出现次数超过一半的元素（剑指offer）

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

function MoreThanHalfNum_Solution(numbers){
    if(numbers == []||!Array.isArray(numbers))return 0
    var maxNum = 0
    var max = 0
    for(var i =0 ;i<numbers.length;i++){
        var arr = numbers.filter(function(item){
            return numbers[i] === item
        })
        if(arr.length>numbers.length/2&&arr.length>maxNum){
            maxNum = arr.length
            max = arr[0]
        }
    }
    return max
}
console.log(MoreThanHalfNum_Solution([1,2,3,2,2,2,5,4,2]))

//// ------------- END -------------
});
```

## [案例] 数组排序使得奇数位于偶数前面（剑指offer）

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

    function reOrderArray(array){
        var r_arr = []
        array.forEach(function(item,i){
            if(item%2 === 0){
                r_arr.push(array.splice(i,1)[0])
                //注：splice返回以数组形式返回，改变原来函数
            }
        })
        array = array.concat(r_arr)
        return array
    }
    console.log(reOrderArray([1,2,3,4,5,6,7,8]))

//// ------------- END -------------
});
```

## [案例] 数组旋转（剑指offer）

```js
    /*把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。 输入一个非减排序的数组的一个旋转，输出旋转数组的最小元素。 例如数组{3,4,5,1,2}为{1,2,3,4,5}的一个旋转，该数组的最小值为1。 NOTE：给出的所有元素都大于0，若数组大小为0，请返回0。*/
    //递增序列的一个旋转
    function minNumberInRotateArray(rotateArray)
    {
        if(rotateArray.length == 0)return 0
        if(rotateArray.length == 1)return rotateArray[0]
        var temp = rotateArray[0]
        for(var i = 1;i<rotateArray.length;i++){
            if(temp>rotateArray[i])return rotateArray[i]
            temp = rotateArray[i]
        }
    }
```

## [案例] 顺时针打(方形)印矩阵数据（剑指offer）

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

    // 输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字，
    // 例如，如果输入如下4 X 4矩阵： 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16
    // 则依次打印出数字1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10.
    /*1 ,2 ,3 ,4 ,115
    * 5 ,6 ,7 ,8 ,116
    * 9 ,10,11,12,117
    * 13,14,15,16,118
    * 17,18,19,20,119*/
    function f(arr,x,y,leng) {
        var tarr = [[],[],[],[]]
        if(leng==1)return [arr[x][y]]
        for (var i = 0; i < leng-1; i++) {
            tarr[0][i] = arr[y][i+x]
            tarr[1][i] = arr[i+x][leng-1+x]
            tarr[2][i] = arr[leng-1+x][leng-1-i+x]
            tarr[3][i] = arr[leng-1-i+x][y]
        }
        return tarr.reduce(function (total,item) {
            return total.concat(item)
        },[])
    }
    function f1(arr) {
        var leng = arr[0].length
        var tarr = []
        var x=0
        var y=0
        while(leng >0 ){
            tarr.push(f(arr,x,y,leng))
            leng-=2
            x++
            y++
        }
        return tarr.reduce(function (total,item) {
            return total.concat(item)
        },[])
    }
    var arr = [[1 ,2 ,3 ,4,115],[5 ,6 ,7 ,8,116],[9 ,10,11,12,117],[13,14,15,16,118],[17,18,19,20,119]]
    console.log(f1(arr))

//// ------------- END -------------
});
```

## [案例] 小矩形覆盖大矩形2_1,2_n（剑指offer）

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

/*
题目描述
我们可以用2*1的小矩形横着或者竖着去覆盖更大的矩形。
请问用n个2*1的小矩形无重叠地覆盖一个2*n的大矩形，总共有多少种方法？*/
function rectCover(n)
{
    var arr=[0,1,2]
    for(var i=3;i<n+1;i++){
        arr.push(arr[i-2]+arr[i-1])
    }
    return arr[n]
}
console.log(rectCover(5))

//// ------------- END -------------
});
```

## [案例] 有序二维数组查找（剑指offer）

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

/*
在一个二维数组中（每个一维数组的长度相同），每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。
    */
    var arr = [
    [1,2,3,4,6],
    [2,3,4,5,7],
    [8,9,10,11,12],
    [21,22,23,24,25]]
    /*
    在数组右上角开始找，假如target>item，row(列)++，
    如果target<item，col(行)--
    */ 
    function Find(target, array) {
      var row = 0;
      var col = array[0].length - 1;
      while (row <= array.length - 1 && col >= 0) {
        if (target == array[row][col])
          return true;
        else if (target > array[row][col])
          row++;
        else
          col--;
        }
      return false;
    }
	console.log(Find(10,arr))
    
//// ------------- END -------------
});
```

## [案例] 找重复数字（剑指offer）

```jsx
/**
 * defaultShowCode: true
 */
import {ConsoleReader} from '@/utils/ConsoleLog'
export default ConsoleReader(({console})=>{
//// --------- 执行代码如下 ----------

    var arr = [2,1,3,1,4,4]
    function duplicate(numbers, duplication){
        var arr = duplication.concat()
        for(var i=0;i<numbers;i++){
            var temp = arr.shift()
            var index = arr.indexOf(temp)
            if(index != -1)
                return arr[index]
        }
    }
    console.log(duplicate(7,arr),arr)
    
//// ------------- END -------------
});
```

## [案例] 冒泡排序

```js
 //从小到大
var arr = [5, 4, 6, 3, 9, 10,-1,20, 0];
var a;
for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
        if (arr[i] > arr[j]) {
            a = arr[i];
            arr[i] = arr[j];
            arr[j] = a;
        }
    }
}
document.write(arr);
console.log(arr);
```

## [案例] 快速排序

```js
//学习：http://www.ruanyifeng.com/blog/2011/04/quicksort_in_javascript.html
// "快速排序"的思想很简单，整个排序过程只需要三步：
//（1）在数据集之中，选择一个元素作为"基准"（pivot）。
//（2）所有小于"基准"的元素，都移到"基准"的左边；所有大于"基准"的元素，都移到"基准"的右边。
//（3）对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。
var arr = [5,10,12,1,22,3,0,100,75]
function quickSort(arr){
    arr = Array.from(arr) // 复制数组，同时格式化参数
    if(arr.length===0)return [];
    const index = Math.floor(arr.length/2);
    const left = [];
    const right = [];
    const temp = arr.splice(index,1)[0]
    for(let i = 0;i < arr.length;i++){
        arr[i]>temp?right.push(arr[i]):left.push(arr[i]);
    }
    return [...quickSort(left),temp,...quickSort(right)]
}
console.log(quickSort(arr))
```

