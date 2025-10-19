---
title: Javascript 函数
published: 2023-12-09T19:24:34.000Z
description: ''
updated: ''
tags: []
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

# JavaScript 函数

### 1.`typeof`

会产生一个字符串的值，内容是给定值的具体类型

```javascript
console.log(typeof 4.5)
// → number
console.log(typeof 'x')
// → string
```

### 2.`prompt`

包含一函数，个显示一个小对话框，请求用户输入

```javascript
prompt('Enter passcode')
```

### 3.`cosole.log`

输出值

```javascript
let x = 30
console.log('the value of x is', x)
// → the value of x is 30
```

### 4.`Math.max`

接受任意数量的参数并返回最大

```javascript
console.log(Math.max(2, 4))
// → 4
```

### 5.`Math.min`

跟Math.max相反

```javascript
console.log(Math.min(2, 4) + 100)
// → 102
```

### 6.`Number.isNaN`

仅当它给出的参数是`NaN`时才返回`true`

 当你给它一个不代表有效数字的字符串时

`Number`函数恰好返回`NaN`

### 7.函数定义

```javascript
function square(x) {
  return x * x
}
```

以关键字`function`起始的表达式创建

函数有一组参数（例子中只有`x`）和一个主体

它包含调用该函数时要执行的语句

`return` 决定 函数返回值

没有`return`的函数 返回`undefined`

### 8.箭头函数

`=>`

```javascript
function square1(x) { return x * x }
const square2 = x => x * x
```

箭头出现在参数列表之后,然后是函数主体

表达的意思类似于 这个输入(参数)产生这个结果(主体)

### 9.push

将值添加到数组的末尾

```javascript
let sequence = [1, 2, 3]
sequence.push(4)
sequence.push(5)
console.log(sequence)
// → [1, 2, 3, 4, 5]
console.log(sequence.pop())
// → 5
console.log(sequence)
// → [1, 2, 3, 4]
```

### `10.pop`

与push相反 删除数组中最后的一个值并将其返回

### `11.delete`

一元运算符

当应用于对象属性时，将从对象中删除指定的属性

```javascript
let anObject = { left: 1, right: 2 }
console.log(anObject.left)
// → 1
delete anObject.left
console.log(anObject.left)
// → undefined
console.log('left' in anObject)
// → false
console.log('right' in anObject)
// → true
```

### `12.in`

二元运算符  会告诉你该对象是否具有名称为它的属性

将属性设置为 undefined 和实际删除它的区别在于

在设置为undefined的时候 对象仍然具有属性 只是没有意义

删除它时 属性不再存在 `in` 会返回 `false`

### 13.`Object.keys`

给它一个对象 它返回一个字符串数组 -对象的属性名称

```javascript
console.log(Object.keys({ x: 0, y: 0, z: 2 }))
// → ["x", "y", "z"]
```

### `14.Object.assgin`

可以将一个对象的所有属性复制到另一个对象中

```javascript
let objectA = { a: 1, b: 2 }
Object.assign(objectA, { b: 3, c: 4 })
console.log(objectA)
// → {a: 1, b: 3, c: 4}
```

### `15.Math.sqrt`

平方根函数

### `16.unshift`

在数组开头添加元素

### `17.shift`

在数组的开头删除元素

`remember("groceries")`将任务添加到队列的末尾

`getTask()`从队列中获取（并删除）第一个项目

`rememberUrgently`函数也添加任务 .

但将其添加到队列的前面而不是队列的后面

```javascript
let todoList = []
function remember(task) {
  todoList.push(task)
}
function getTask() {
  return todoList.shift()
}
function rememberUrgently(task) {
  todoList.unshift(task)
}
```

### `18.lastIndexOf`

跟`indexof` 类似  `indexof`从数组第一个元素开始搜索

`lastIndexOf` 从最后一个元素向前搜索

```javascript
console.log([1, 2, 3, 2, 1].indexOf(2))
// → 1
console.log([1, 2, 3, 2, 1].lastIndexOf(2))
// → 3
```

### 19.`Math`

`Math.max`最大值

`Math.min`最小值

`Math.sqrt`平方根

`Math.random`生成一个随机数 范围在 0（包括）到 1（不包括）之间

`Math.PI`表示数字`π`

`Math.floor`向下取整到与当前数字最接近的整数

`Math.ceil`向上取整

`Math.abs`取数字的绝对值

`Math.round`四舍五入
