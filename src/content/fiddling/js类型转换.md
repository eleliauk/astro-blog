---
title: js类型转换
published: 2024-08-17T16:47:37.000Z
description: ''
updated: ''
tags: []
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

# `Javascript`隐式类型转换

## 类型都有什么

- Number
- String
- Boolean
- Null
- Undefined
- Object
- Symbol (ES2015)
- BigInt (ESNext stage 4)

是不是感觉还有Function，毕竟能用**typeof**获取到？不，函数、数组都是Object的子类型。

类型分为`基本类型`和`复合类型`两种，除了对象，其它都是基本类型

### 接下来有请重量级嘉宾

## To Primitive

结构：toPrimitive(input: **any**, preferedType?: **'string' |'number'**)
作用：内部方法，将任意值转换成原始值

转换规则：

1. 如果是基本类型，则不处理。
2. 调用`valueOf()`，并确保返回值是基本类型。
3. 如果没有valueOf这个方法或者valueOf返回的类型不是基本类型，那么对象会继续调用`toString()`方法。
4. 如果同时没有valueOf和toString方法，或者返回的都不是基本类型，那么直接抛出`TypeError`异常。

> 注意：如果**preferedType=string**，那么2、3顺序调换

接着，我们看下各个对象的转换实现

| 对象     | valueOf() | toString()             | 默认 preferedType |
| -------- | --------- | ---------------------- | ----------------- |
| Object   | 原值      | "[object Object]"      | Number            |
| Function | 原值      | "function xyz() {...}" | Number            |
| Array    | 原值      | "x,y,z"                | Number            |
| Date     | 数字      | "Sat May 22 2021..."   | String            |

1. 数组的toString()可以等效为`join(",")`，遇到null, undefined都被忽略，遇到symbol直接报错，遇到无法ToPrimitive的对象也报错。
2. 使用`模板字符串`或者使用`String(...)`包装时，preferedType=string，即优先调用 .toString()。
3. 使用`减法`或者`Number(...)`包装时，preferedType=number，即优先调用`.valueOf()`

接下来看几个🌰

```javascript
[1, null, undefined, 2].toString() === '1,,,2';

// Uncaught TypeError: Cannot convert a Symbol value to a string
[1, Symbol('x')].toString()

// Uncaught TypeError: Cannot convert object to primitive value
  [1, Object.create(null)].toString()
```

## ToNumber

一些特殊值转为数字的例子，等下要用到

```javascript
Number('0') === 0
Number('') === 0
Number('   ') === 0
Number('\n') === 0
Number('\t') === 0
Number(null) === 0
Number(false) === 0
Number(true) === 1
Number(undefined) // NaN
Number('x') // NaN
```

## 加减法 +-

加减法运算中遵循了一些隐式转换规则：

##### 遇到对象先执行ToPrimitive转换为基本类型

- **加法**（+）运算，preferedType是默认值
- **减法**（-）运算，preferedType是Number

```javascript
// {}.toString() === "[object Object]"
1 + {} === '1[object Object]'

// [2, 3].toString() === "2,3"
1 + [2, 3] === '12,3'
  [1] + [2, 3] === '1,2,3'

function test() {}
// test.toString() === "function test() {}"
10 + test === '10function test() {}'
```

##### 非字符串 + 非字符串，两边都会先ToNumber

这里的非字符串都是指基本类型，因为对象会先执行ToPrimitive变成基础类型

```javascript
1 + true === 2
1 + false === 1
1 + null === 1
1 + null + false + 1 === 2
1 + undefined // NaN
1 + undefined + false // NaN
1 + undefined + [1] === 'NaN1'`${1 + undefined}1` === 'NaN1'
null + null === 0

// 1 + false
1 + ![] === 1
1 + !{} === 1
!{} + !{} === 0
```

**1 + undefined + [1] === "NaN1"**

​	•	**1 + undefined** **部分**：

​	•	如前所述，1 + undefined 的结果是 NaN。

​	•	**NaN + [1]**：

​	•	[1] 是一个数组对象，当数组对象与非字符串类型相加时，JavaScript会调用它的 toString() 方法，将数组转换为字符串。

​	•	[1].toString() 返回 "1"。

​	•	因此，NaN + [1] 等同于 NaN + "1"。

​	•	NaN 被隐式转换为字符串 "NaN"，然后与 "1" 进行字符串连接。

##### 任意值 - 任意值，一律执行ToNumber，进行数字运算。

此时的 preferedType === number

```javascript
3 - 1 === 2
3 - '1' === 2
'3' - 1 === 2
'3' - '1' - '2' === 0

// [].toString() => "" => Number(...) => 0
3 - [] === 3

// {}.toString() => "[object Object]" => Number(...) => NaN
3 - {} // NaN

// Date的默认preferedType === string
var date = new Date();
date.toString = () => 'str';
date.valueOf = () => 123;

date + 1 === 'str1';
date - 1 = 122;
```

再看`[] + {}`，这样是不是就easy

```javascript
[].toString() === "";
{}.toString() === "[object Object]";

[] + {} === "[object Object]";
```

##### {} 在最前面时可能不再是对象

不是对象是什么？别急，看看经典的例子

```javascript
{} +[] === 0
{ a: 2 } +[] === 0
```

这啥玩意？说好的"[object Object]"呢？

好吧，这是`{}`其实代表的是**代码块**，最后就变成了`+ []`，根据前面的原则，数组先被转换成字符串`""`，接着因为+x的运算，字符串被转成数字`0`。

那 { a: 2 } 总该是对象了吧？其实这时候`a`不是代表对象属性，而是被当成了标签（label），标签这东西IE6就已经有了。所以如果我们写成对象是会报错的，逗号要改成分号才能通过编译。

```javascript
// Uncaught SyntaxError: Unexpected token ':'
{ a: 2, b: 3 } + []

// 分号OK
{ a: 2; b: 3 } + [] === 0;
```

##### symbol不能加减

如果在表达式中有symbol类型，那么就会直接报错。比如`1 + Symbol("x")`报错如下：

```livecodeserver
Uncaught TypeError: Cannot convert a Symbol value to a number
```

## 宽松相等 ==

相等于全等都需要对类型进行判断，当类型不一致时，宽松相等会触发隐式转换。下面介绍规则：

##### 对象 == 对象，类型一致则不做转换

```javascript
{} != {}
[] != {}
[] != []
```

##### 对象 == 基本值，对象先执行ToPrimitive转换为基本类型

```javascript
// 小心代码块
"[object Object]" == {}
[] == ""
[1] == "1"
[1,2] == "1,2"
```

##### 布尔值 == 非布尔值，布尔值先转换成数字，再按数字规则操作

```javascript
// [] => "" => Number(...) => 0
// false => 0
[] == false

// [1] => "1" => 1
// true => 1
  [1] == true

// [1,2] => "1,2" => NaN
// true => 1
  [1, 2] != true

'0' == false
'' == false
```

##### 数字 == 字符串，字符串ToNumber转换成数字

```javascript
"2" == 2
[] == 0
[1] == 1
// [1,2].toString() => "1,2" => Number(...) => NaN
[1,2] != 1
```

##### null、undefined、symbol

null、undefined与任何非自身的值对比结果都是false，但是`null == undefined` 是一个特例。

```javascript
null == null
undefined == undefined
undefined == null

null != 0
null != false

undefined != 0
undefined != false

Symbol('x') != Symbol('x')
```

## 对比 < >

对比不像相等，可以严格相等（===）防止类型转换，对比一定会存在隐式类型转换。

##### 对象总是先执行ToPrimitive为基本类型

```javascript
[] < [] // false
// => "" < ""
[] <= {} // true
"" <= "[object Object]"
({} < {}) // false
({} <= {}) // true
```

后面这两个还挺有说法的

**{} < {}**

​	•	**代码块 vs 表达式**：

​	•	在没有括号的情况下，{} 被解释为一个代码块而不是对象字面量。

​	•	因此，{} < {} 被解释为一个空代码块 < 一个对象字面量的比较。

​	•	由于第一个 {} 被当作代码块，< 运算符之后的 {} 实际上是一个语法错误，因为它看起来像一个对象字面量的定义，但没有有效的上下文。

**实际上**，{} < {} 在大多数情况下会导致语法错误，但在某些环境中，可能解释为 false，因为 JavaScript 不能比较两个代码块。

加上括号就是

({} < {})：{} 被解释为对象字面量，并且 () 括起来确保 {} < {} 作为对象字面量被正确解析。

在这种情况下，{} 转换为 "[object Object]"，而 "[object Object]" < "[object Object]" 为 false，因为任何两个相同的字符串比较都是 false。

**{} <= {}**

​	•	**代码块 vs 表达式**：

​	•	和上面一样，{} <= {} 被解释为一个代码块 < 一个对象字面量的比较。

​	•	由于 <= 运算符和 < 运算符一样，可能导致语法错误或无效的比较。

**实际上**，{} <= {} 也可能会导致语法错误或被解释为 true 在某些特定的解析环境中，虽然理论上它是不被允许的。

##### 任何一边出现非字符串的值，则一律转换成数字做对比

```javascript
// ["06"] => "06" => 6
['06'] < 2 // false

  ['06'] < '2' // true
  ['06'] > 2 // true

null // true
- 1 < 5 < null // true
0 <= null // true

0 <= false // true
0 < false // false

// undefined => Number(...) => NaN
undefined < 5 // false
```

## To Boolean

既然是总结，那么可能还要讲一下布尔值的隐式转换。这个还是比较常见的，我们来看下有哪些地方会使用到：

- if(...)
- for(;...;)
- while(...)
- do while(...)
- ... ? :
- ||
- &&

既然知道会转换，那么什么值是真值，什么值是假值呢？换个思路，假值以外都是真值。看看哪些是**假值**：

- undefined
- null
- false
- +0
- -0
- NaN
- ""

## 总结

对象都需要先ToPrimitive转成基本类型，除非是宽松相等（==）时两个对象做对比。

- \+   没有字符串就全转数字
- \-   全转数字，preferedType===Number
- ==  同类型不转，数字优先，布尔全转数字，null、undefined、symbol不转
- <>  数字优先，除非两边都是字符串
