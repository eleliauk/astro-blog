---
title: Javascript忍者秘籍blog-1
published: 2024-04-21T13:12:28.000Z
description: ''
updated: ''
tags: ['Javascript']
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

# `Javascript`忍者秘籍(一)

最近一直都在看这本书 感觉之前的js底子太差了 看这本书回顾一下吧(感觉有些概念都是没听过的):cactus:

这篇主要写第四章理解函数调用的东西吧

调用函数时，隐式的函数参数 this 和 arguments 会被静默的传递给函数,可以像函数体内显式声明的参数一样使用

`this` 表示调用函数的上下文对象

`arguments` 表示函数调用过程中传递的所有参数。通过 arguments 参数可以访问 函数调用过程中传递的实际参数。

函数调用的方式 对 函数的隐式参数有很大的影响:sake:

### 1.隐式函数参数

#### `arguments`参数

arguments参数表示传入函数的所有参数的集合。

使用arguments.length属性来获取传递给函数的实际参数个数。

通过数组下标的方式访问到arguments参数中的每个参数值，如arguments[2]将获取第三个参数。

arguments是一个类数组对象，不可以对arguments对象使用数组的方法。

在非严格模式下，arguments对象是函数参数的别名，修改arguments对象会影响对应的函数实参，反之亦然。

arguments作为参数别名使用时，会影响代码可读性，应该避免使用参数别名修改参数。在严格模式下通过arguments修改参数是不起作用的

#### `this`参数

this表示函数上下文，即与函数调用相关联的对象。(还是有很多抽象小题的 经典this指向问题):anger:

但是，在`javascript`中，将一个函数作为方法调用仅仅是函数的一种调用方式。this参数是由函数的**定义方式**和**调用方式**决定

### 2.函数调用方式

基本上是4种

1. 作为函数直接被调用；`myfunc()`
2. 作为方法关联在一个对象上，实现面向对象编程；`obj.myfunc()`
3. 作为构造函数调用，实例化一个对象；`new Myfunc()`
4. 通过函数的apply和call方法

#### 作为函数被直接调用

```js
/* 函数定义作为函数被调用 */
function aa() {
  console.log(this)
}
aa() // =>object.window
/* 函数表达式作为函数被调用 */
let bb = function () {
  console.log(this)
}
bb(); // =>object.window
/* 立即调用函数表达式作为函数被调用 */
(function () { console.log(this) })()
// =>object.window
```

#### 作为对象方法被调用

当一个函数被赋值一个对象的属性，并且通过对象属性引用的方式调用函数时，函数会作为对象的方法被调用。 作为对象方法调用的函数this值与对象关联，通过this可以访问所关联对象的其他方法和属性

```js
function aa() { return this }
console.log(aa() == window)
// =>true
let obj1 = {}
obj1.aa = aa
console.log(obj1.aa() == obj1)
// =>true
let obj2 = {}
obj2.bb = aa
console.log(obj2.bb() == obj2)
// =>true
```

#### 作为构造函数调用

在函数调用之前加上关键字new，即为构造函数调用。

构造函数目的是用来创建和初始化一个新对象，然后将这个对象作为构造函数的返回值

使用关键字new调用函数会触发以下几个动作：:hamburger:

1. 创建一个新的空对象；
2. 该对象作为this参数传递给构造函数，成为构造函数的上下文；
3. 新构造的对象作为new运算符的返回值。
4. 如果构造函数返回一个对象，则该对象将作为整个表达式的返回值，而传入构造函数的this将被丢弃。
5. 如果构建函数返回的是非对象类型，则忽略返回值，返回新创建的对象。

```js
function Ninja() {
  // 这里的this表示Ninja函数的上下文
  this.skulk = function () {
    // 这里的this表示该匿名函数的上下文
    return this
  }
}
// skulk以对象的方式调用是，返回值是其关联的对象
let ninja1 = new Ninja()
let ninja2 = new Ninja()
console.log(ninja1.skulk() == ninja1)
console.log(ninja2.skulk() == ninja2)
// skulk复制给一个变量后，直接调用函数时，非严格模式下skulk返回的值是window
let skulk = ninja2.skulk
console.log(skulk() == window)
```

#### 通过apply与call方法调用

javascript提供了可以显示指定任何对象作为函数的上下文的函数调用方式。每个函数都存在apply和call方法。通过apply与call方法来设置函数的上下文。

##### call函数

```js
function.call(context, arg1, arg2, ...)
```

`context` 是指定函数中的 `this` 关键字指向的对象，`arg1`, `arg2`, ... 是传递给函数的参数

##### apply函数

```js
function.apply(context, [argsArray])
```

`context` 是指定函数中的 `this` 关键字指向的对象，`argsArray` 是一个数组，其中包含要传递给函数的参数

```js
function juggle() {
  let result = 0
  for (let n = 0; n < arguments.length; n++) {
    result += arguments[n]
  }
  this.result = result
}

let ninja1 = {}
let ninja2 = {}

juggle.apply(ninja1, [1, 2, 3, 4, 5])
juggle.call(ninja2, 1, 2, 3, 4, 5, 6)

console.log(ninja1.result == 15)
console.log(ninja2.result == 21)
```

apply和call功能类似，唯一的不同在于如何传递参数。apply和call第一个参数作为函数的上下文，apply第二个参数是一个包含参数值的数组。call可以传入任意数量参数，作为函数的参数。

#### 总结!!!!!

##### 总结四种函数的调用方式对this取值的影响

- 如果作为函数调用，在非严格模式下，this指向全局window对象；在严格模式下，this指向undefined。
- 作为方法调用，this通常指向调用的对象
- 作为构造函数调用，this指向新创建的对象。
- 通过call或apply调用，this指向call或apply的第一个参数。

### 3.`this`指向问题!  (天天被拷打版)

#### 在全局作用域

`this->window`

#### 在普通函数中

谁调用我 this指向谁

```javascript
let obj = {
  fn1() {
    console.log(this)
  },
  fn2() {
    fn3()
  }
}
function fn3() {
  console.log(this)
}
fn3()// this->window
obj.fn1()// this->obj
obj.fn2()// this->window
```

#### 箭头函数的this

箭头函数没有自己的this，箭头函数的this就是上下文中定义的this，因为箭头函数没有自己的this所以不能用做构造函数。

```js
let div = document.querySelector('div')
let o = {
  a() {
    let arr = [1]
    // 就是定义所在对象中的this
    // 这里的this—>o
    arr.forEach((item) => {
      // 所以this -> o
      console.log(this)
    })
  },
  // 这里的this指向window o是定义在window中的对象
  b: () => {
    console.log(this)
  },
  c() {
    console.log(this)
  }
}
div.addEventListener('click', (item) => {
  console.log(this)// this->window 这里的this就是定义上文window环境中的this
})
o.a() // this->o
o.b()// this->window
o.c()// this->o 普通函数谁调用就指向谁
```

#### 事件绑定中的this

基本上都是指向this->事件源的:laughing:

```js
let div = document.querySelector('div')
div.addEventListener('click', function () {
  console.log(this) // this->div
})

div.onclick = function () {
  console.log(this) // this->div
}
```

#### 定时器的this

定时器中采用回调函数作为处理函数 回调函数的this->window

```js
setInterval(function () {
  console.log(this) // this->window
}, 500)

setTimeout(function () {
  console.log(this) // this->window
}, 500)
442
```

#### 构造函数的this

构造函数配合new使用, 而new关键字会将构造函数中的this指向实例化对象，所以构造函数中的this->实例化对象

```js
function Person(name, age) {
  this.name = name
  this.age = age
}
let person1 = new Person()
person1.name = 'ggb'
person1.age = 21
console.log(person1)// Person {name: "ggb", age: 21}
let person2 = new Person()
person2.name = 'syj'
person2.age = 19
console.log(person2)// Person {name: "syj", age: 19}
```
