---
title: Javascript-class类
published: 2023-12-16T21:23:46.000Z
description: ''
updated: ''
tags: []
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

# `Javascript`-class类

### 类的定义

有两个组成部分

类表达式和类声明

每个类中包含了一个特殊的方法 `constructor()`，它是类的构造函数，这种方法用于创建和初始化一个由 `class` 创建的对象

```javascript
// 类声明
class A {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}
// 类表达式
const B = class {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}
```

以上创造了一个类  叫`A`

初始化了两个参数 `name , age`

### 使用类

```javascript
const a1 = new A ('shanyujia', 18)
console.log(a1)
// =>{ name: 'shanyujia', age: 18 }
```

基于这个类去创造这个类的实例

基于这个对象生成 结构相同 内部数据不同的对象形式

### 自定义方法

```javascript
class A {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  introduce() {
    console.log(`我的名字是${this.name},我的年龄是${this.age} `)
  }
}
a1.introduce()
// => 我的名字是shanyujia,我的年龄是18
```

### 类的继承

```javascript
class B extends A {
  constructor(name, age, sex) {
    // 如果希望继承A的属性 写一个super的调用
    // 调用父类的constructor 将属性也在B类生成
    super(name, age)
    this.sex = sex
  }

  sayHello() {
    console.log(`你好我是${this.name}`)
  }
}
const b1 = new B('张三', 20, '男')
console.log(b1)
b1.sayHello()
b1.introduce()
/* { name: '张三', age: 20, sex: '男' }
我的名字是张三,我的年龄是20
你好我是张三 */
```
