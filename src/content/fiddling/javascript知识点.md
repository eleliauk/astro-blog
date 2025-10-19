---
title: javascript1
published: 2023-11-27T22:29:42.000Z
description: ''
updated: ''
tags: []
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

### javascript第一章

##### 一元运算符

------

```javascript
console.log(typeof 4.5)
// 输出 number
console.log(typeof 'x')
// 输出 string
```

typeof生成一个字符串值 得出你给它的值的类型名

##### 布尔值

有两个值  `true` 和 `false`

生成布尔值的方法

```javascript
console.log (3 > 2)
// true
console.log (3 < 2)
// false
```

符号 > 和 < 表示 “大于”和“小于” 二元运算符

返回的结果是一个布尔值，表示其运算是否为真。

也可以用这种方法比较字符串

```javascript
console.log('Aardvark' < 'Zoroaster')
// → true
```

在 JavaScript 中，只有一个值不等于其自身，那就是NaN（非数值）

```javascript
console.log (Number.NaN == Number.NaN)
// → false
```

NaN用于表示非法运算的结果

逻辑运算符

`&&` 运算符表示逻辑与，该运算符是二元运算符，只有当赋给它的两个值均为`true`时其结果才是真

```javascript
console.log(true && false)
// → false
console.log(true && true)
// → true
```

`||`运算符表示逻辑或。当两个值中任意一个为`true`时，结果就为真

```javascript
console.log(false || true)
// → true
console.log(false || false)
// → false
```

优先级问题

`||`优先级最低,其次是`&&`,然后是比较运算符(`>,==,<`)

最后是其他运算符

三元预算符

`A?B:C`

```javascript
console.log(true ? 1 : 2)
// → 1
console.log(false ? 1 : 2)
// → 2
```

被叫做条件运算符

问号左面的值挑选一个值

它为 `true` 是 选择中间的值

它为`false` 是选择右面的值

##### 空值

`null` `undefined`

表示不存在有意义的值

两者差别不大
