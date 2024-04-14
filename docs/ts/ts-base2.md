---
title: TS类与接口
order: 2
nav: TS
---
# TS类与接口

## Class 类

一个简单例子

```js
Class Greeter{
	constructor(greeting){
        this.greeting = greeting
	}
    greet(){
        return "Hello,"+this.greeting
    }
}
```

### extends 继承

在TypeScript里，我们可以使用常用的面向对象模式。 基于类的程序设计中一种最基本的模式是允许使用继承来扩展现有的类。

```ts
class Person {
    name: string;

    getName(): void {}

    constructor(theName: string) {
        this.name = theName;
    }
}

class Child extends Person {
    age: number;

    getAge(): void {
        console.log(`我的年龄是${this.age}`)
    }

    getName() {
        super.getName = function () {
            console.log(`我的名字${this.name}`)
        };
    }

    constructor(name, age: number) {
        super(name)
        this.age = age
    }

}

let sam2 = new Child('wz',12);
sam2.getAge();
sam2.getName();
```

### 公共，私有与受保护的修饰符

#### public 公共

> 默认为 public

你也可以明确的将一个成员标记成 `public`。 我们可以用下面的方式来重写上面的 `Person`类：

```js
class Person {
    public name: string;
    public getName(): void {}
    public constructor(theName: string) {
        this.name = theName;
    }
}
```

#### private 私有

当成员被标记成 `private`时，它就不能在声明它的类的外部访问。比如：

```ts
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // 错误: 'name' 是私有的.
```

**类型兼容**

类内成员类型标记有 private、public、protected 三种，我们认为，只有两个类内他们的成员类型相同，且 protected 和 private 标记成语来自同一个地方，才认为他们兼容。

```ts
class Animal { //1
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal { //1
    constructor() { super("Rhino"); }
}

class Employee { //2
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;//由于有同源同类型的属性，所以可以赋值
animal = employee; // 由于有不同源属性，所以错误: Animal 与 Employee 不兼容.
```

#### protected 受保护

`protected`修饰符与 `private`修饰符的行为很相似，但有一点不同， `protected`成员在**派生类（继承他的子类）**中仍然可以访问。例如：

```ts
class Parent {
    protected parentName: string;
    constructor(parentName: string) { this.parentName = parentName; }
}

class Child extends Parent {
    private childName: string;

    getName():string{
        return `父亲名字：${this.parentName}。孩子名字：${this.childName}。`
        //注意，使用 protected 继承父级的变量可以读取。
    }
    constructor(childName: string, parentName: string) {
        super(parentName)
        this.childName = childName;
    }

}

let child = new Child("wzChild", "wz");
console.log(child.getName()); // 正确，输出：父亲名字：wz。孩子名字：wzChild。
console.log(howard.name); // 错误，无法访问
```

### readonly 修饰符

你可以使用 `readonly`关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。

```ts
class MyReadonly{
    readonly name:string
    constructor(name:string){
        this.name = name
    }
    setName(name){
        // this.name = name //报错，在class内部也不能赋值。
    }
}
new MyReadonly('wz').name = 1
```

**参数属性也可以readonly**

参数属性可以方便地让我们在一个地方定义并初始化一个成员。

```js
class Octopus {
    //不需要单独声明了，如： readonly name:string已经不需要。
    constructor(readonly name: string) {
        //readonly 、 public 、 protected 都可以
        //不需要 this.name = name
    }
}
```

参数属性通过给构造函数参数前面添加一个访问限定符来声明。 使用 `private`限定一个参数属性会声明并初始化一个私有成员；对于 `public`和 `protected`来说也是一样。

### getters/setters 存取器

TypeScript支持**通过getters/setters来**截取对对象成员的访问。

下面这个版本里，我们先检查用户密码是否正确，然后再允许其修改员工信息。 我们把对 `fullName`的直接访问改成了可以检查密码的 `set`方法。 我们也加了一个 `get`方法，让上面的例子仍然可以工作。

```js
class PassCode{
   private _pass:string|number
    get pass():string|number{
        if(this._pass)
            return this._pass
        return null
    }
    set pass(newPass:string|number){
       //该方法不能有返回类型， :void 都不可以
       if(newPass&&/^[a-z\d]{6,}$/.test(newPass.toString())){
           this._pass = newPass
       }else{
           console.log('密码不符合规范')
       }
    }
}
let passCode = new PassCode()

console.log(1,passCode.pass) //null
passCode.pass=1 //密码不符合规范
console.log(2,passCode.pass)//null
passCode.pass=22221122
console.log(3,passCode.pass)//22221122
```

### static 静态属性

到目前为止，我们只讨论了类的实例成员，那些仅当类被实例化的时候才会被初始化的属性。 我们也可以创建类的静态成员，这些属性存在于类本身上面而不是类的实例上。

```js
class Circular {
    static pai = 3.1415926;

    getGirth(): number {
        return Circular.pai * 2 * this.radius
    }

    getArea(): number {
        return Circular.pai ** 2 * this.radius
    }

    constructor(public radius: number) {
    }
}
let cir = new Circular(1)
console.log('圆周：',cir.getGirth())
console.log('面积：',cir.getArea())
```

### abstract 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例 化。 不同于接口，抽象类可以包含成员的实现细节。`abstract`关键字是用于定义抽象类和在抽象类内部定义抽象方法。

```ts
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}
```

抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。 抽象方法的语法与接口方法相似。 两者都是定义方法签名但不包含方法体。

 然而，**抽象方法**必须**包含 `abstract`关键字**，并且**可**以**包含**访问**修饰符**。

```ts
abstract class Person2 {
    constructor(public name: string) {
    }

    toString(): string {
        return this.name.toString()
    }

    abstract getName(): any; // 必须在派生类中实现
}

class Wuzhan extends Person2 {
    constructor(public age: number) {
        super("展1"); // 在派生类的构造函数中必须调用 super()
    }

    getName(): string {
        return `我的名字是：${this.name}`
    }

    getAge(): string {
        return `我的年龄是：${this.age}`
    }

    toString(): string {
        return super.toString()+this.age.toString();
    }
}

// let per = new Person(); // 错误: 不能创建一个抽象类的实例
let wz:Person2
wz = new Wuzhan(21)
console.log(wz.getName())
// console.log(wz.getAge()) //getAge 在 Person2中不存在
console.log(wz.toString())
```

### 实例类型与构造函数类型

类定义会创建两个东西：类的**实例类型**和一个**构造函数**。如下例，直接使用 **Greeter** 则是**实例类型**，当使用 **typeof 关键字**则可以获取到**构造函数的类型**。

```ts
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
// 类型使用
let greeter: Greeter = new Greeter("world");
console.log(greeter.greet());

let greeterType: typeof Greeter = Greeter;
```

因为类可以创建出类型，所以你能够在允许使用接口的地方使用类。

```ts
class Point {
    constructor(public x:number,public y:number){}
}

interface Point3d extends Point {
    z: number;22
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

## TS接口

```ts
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
  console.log(labelledObj.size); //错误，接口没有定义的属性，不能使用
}

let myObj = {size: 10, label: "Size 10 Object"};
//但是，size可以以变量包裹方式传进去
printLabel(myObj);
printLabel({size: 10, label: "Size 10 Object"});//但是这样就不行了。
```

类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以。

### 可选属性 ?:

接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在。 

可选属性在应用 “option bags” 模式时很常用，即给函数传入的参数对象中只有部分属性赋值了。

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): {
    color: string; area: number
} {
  let newSquare = {color: "white", area: 100};
  if (config.colr) {
      //Error: Property 'clor' does not exist on type 'SquareConfig'
      //故意写错，会有提示
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({color: "black"});
//
```

> createSquare 返回值为一个对象 {color: string; area: number}
>
> 传入的参数继承了 SquareConfig 接口。

### 只读属性 readonly

一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 `readonly`来指定只读属性:

```ts
interface Point {
    readonly x: number;
    readonly y: number;
}
```

你可以通过赋值一个对象字面量来构造一个`Point`。 赋值后， `x`和`y`再也不能被改变了。

```ts
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
```

**ReadonlyArray**

TypeScript 具有`ReadonlyArray<T>`类型,它与`Array<T>`相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：

```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error! 类型'readonly<number>'是'readonly'，不能分配给可变类型'number[]'。

```

上面代码的最后一行，可以看到就算把整个`ReadonlyArray`赋值到一个普通数组也是不可以的。 但是你可以用类型断言重写：

```ts
a = ro as number[];
```

**readonly vs const**

最简单判断该用`readonly`还是`const`的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 `const`，若做为属性则使用`readonly`。

### 额外的属性检查 [_:String]:any

像上边例子，color 拼写错误会被检查，假如我们不想被检查，或者假如**额外属性**，可以这样定义：

```ts
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
    //可以这样些[_:String]: any
}
```

```ts
const createSquare = (param: { width?: number }) => {
    console.log(param)
}
```

使用**断言**修改入参类型，这样可以忽**略掉检查**。

```ts
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

还有最后一种**跳过**这些**检查**的方式，将这个对象**赋值给**一个另一个**变量**： 因为 `squareOptions`不会经过额外属性检查，所以编译器不会报错。

```ts
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

### 函数类型

接口能够描述JavaScript中对象拥有的各种各样的外形。 除了描述带有属性的普通对象外，**接口**也可以**描述函数类型**。

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
//定义参数类型，与返回值类型
}
```

这样定义后，我们可以像使用其它接口一样使用这个函数类型的接口。 下例展示了如何创建一个函数类型的变量，并将一个同类型的函数赋值给这个变量。

```ts
let mySearch: SearchFunc;//使用接口
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}
//或者
let mySearch: SearchFunc;
mySearch = function(src, sub) { 
    //参数名字不需要和接口参数名字相同
    let result = src.search(sub);
    return result > -1;
}
```

### 可索引的类型

与使用接口描述函数类型差不多，我们也可以描述那些能够“通过**索引**得到”的**类型**，比如`a[10]`或`ageMap["daniel"]`。 

可索引类型具有一个**索引签名**，它描述了对象索引的类型，还有相应的索引返回值类型。 让我们看一个例子：

**利用接口定义数组**

```ts
//利用接口定义数组
interface StringArray {
  [index: number]: string; 
  //假如键的类型为 number ，则该键对应的值必须为string
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

> TypeScript支持两种索引签名：**字符串**和**数字**。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 `number`来索引时，JavaScript会将它转换成`string`然后再去索引对象。 也就是说用 `100`（一个`number`）去索引等同于使用`"100"`（一个`string`）去索引，因此两者需要保持一致。
>
> ```ts
> interface NotOkay {
>  [x: number]: Animal;
>  [x: string]: Dog;
> }
> // 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
> ```

**利用接口实现只读数组**

```js
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
// myArray[2] = "Mallory"; // error!
```

### 类类型

与C#或Java里接口的基本作用一样，TypeScript也能够用它来明确的强制一个类去符合某种契约。

**implements**

```ts
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date = new Date();
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
let clock = new Clock(1,2)
console.log(clock.currentTime)
```

### 混合类型

先前我们提过，接口能够描述JavaScript里丰富的类型。 因为JavaScript其动态灵活的特点，有时你会希望一个对象可以同时具有上面提到的**多种类型**。

一个例子就是，一个对象可以同时做为函数和对象使用，并带有额外的属性。

```ts
interface Counter {
    (start: number): string;//（）这里的小括号是函数的参数。
    interval: number; // 这里的属性，表示函数的属性
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

在使用JavaScript第三方库的时候，你可能需要像上面那样去完整地定义类型。

### 继承接口

和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。

```ts
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```

### 接口继承类

当**接口继承**了一个**类类型**时，它会**继承类**的**成员**但**不包括其实现**。 

就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样。 接口同样会继承到类的private 和 protected 成员。 

这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。

当你有一个庞大的继承结构时这很有用，但要指出的是你的代码只在子类拥有特定属性时起作用。 这个子类除了继承至基类外与基类没有任何关系。 例：

```ts
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    //注意：只有继承 Control 类才能 使用 SelectableControl 接口
    select() { }
}


// 错误：“Image”类型缺少“state”属性。
class Image implements SelectableControl {
    select() { }
}

class Location {

}
```

