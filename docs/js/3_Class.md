---
title: Class
group:
  order: 2
  title: js基础与案例
order: 6
---
# Class

在ES6中，class (类)作为对象的模板被引入，可以通过 class 关键字定义类。

class 的本质是 function。

它可以看作一个语法糖，让对象原型的写法更加清晰、更像面向对象编程的语法。

## getter / setter

用于定义属性的写入与读取

```js
class Example{
    constructor(a) {
        this.a = a; // 实例化时调用 set 方法
    }
    get a(){
        console.log('getter');
        return this._a;
    }
    set a(a){
        console.log('setter');
        this._a = a; 
    }
}
```

## 静态方法

```js
class Example{
    static sum(a, b) {
        console.log(a+b);
    }
}
Example.sum(1, 2); // 3
```

## super

使用 super 可以调取父级 prototype上的方法

```js
class A {
    hasSuper() {
        return true; 
    }
}
class B extends A {
    hasSuper() { 
        return super.hasSuper(); //使用super可以调取父级prototype上的方法
    }
}
```

## 方法定义与this指向

**函数声明**方式创建方法，拿取当前执行上下文作为 this。

```js
class ApiFactory {
  request(AxiosConfig){ // this拿到的是上一个方法返回的this
    console.log(this)
  };
}
```

**函数表达式**方式创建方法，this 永远是自己 Class 的实例。

```js
class ApiFactory {
  request2=(AxiosConfig)=>{ // this拿到的永远是ApiFactory的实例
    console.log(this)
  };
}
```

**案例**

```js
class ApiFactory {
  overwrite(Property, value) {
    // 以当前this为模板，创建一个新对象
    const temp = Object.create(this);
    // 不直接temp[Property] = value;的原因是，如果这个属性只有getter，会报错
    Object.defineProperty(temp, Property, {
      get() {
        return value;
      },
    });
    // 返回新对象
    return temp;
  }
}
apiFactory.overwrite('name',1).request2() // 报错  // this拿到的永远是ApiFactory的实例
apiFactory.overwrite('name',1).request() // 正确拿到this // this拿到的是上一个方法返回的this
```

这里使用了overwrite 后，overwrite 会创造一个冗余属性，存在**调用连中**，而使用**函数声明**函数可以拿到**调用连中this**。
