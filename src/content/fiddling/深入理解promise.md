---
title: 深入理解promise
published: 2025-02-25T20:29:53.000Z
description: ''
updated: ''
tags: ['Javascript']
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

# 深入理解Promise

一位高端的前端攻城狮曾经说过，一位不愿意透露姓名的顶级摸鱼工程师曾经说过，**学习 Promise 最好的方式就是先阅读它的规范定义**。那么哪里可以找到 Promise 的标准定义呢？

答案是 [Promises/A+ 规范](https://promisesaplus.com/)。

假设你已经打开了上述的规范定义的页面并尝试开始阅读（不要因为是英文的就偷偷关掉，相信自己，你可以的），规范在开篇描述了 Promise 的定义，与之交互的方法，然后强调了规范的稳定性。关于稳定性，换言之就是：我们可能会修订这份规范，但是保证改动微小且向下兼容，所以放心地学吧，这就是权威标准，五十年之后你再去谷歌 Promise，出来的规范还是这篇 😂。

好的，让我们回到规范。从开篇的介绍看，到底什么是 Promise ？

>A promise represents the eventual result of an asynchronous operation.

**Promise就是表示一个异步操作的最终结果**

划重点！！这里其实引出了 JavaScript 引入 Promise 的动机：**异步**。

学习一门新技术，最好的方式是先了解它是如何诞生的，以及它所解决的问题是什么。Promise 跟我们说的异步编程有什么联系呢？Promise 到底解决了什么问题？

要回答这些问题，我们需要先回顾下没有 Promise 之前，异步编程存在什么问题？

## 异步编程

由于web是单线程的架构，决定了javascript的异步编程模型是基于**消息队列**和**事件循环**

看图说话

<img src="https://camo.githubusercontent.com/273d06b169aae8c02aae623d6514ca18fe74682512c24461b3c20e1387f4ecf1/68747470733a2f2f70332d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f32333836616265663662326634336638623739663133353765663661363637377e74706c762d6b3375316662706663702d7a6f6f6d2d312e696d616765" alt="渲染进程" />

我们的异步任务的回调函数会被放入消息队列，然后等待主线程上的同步任务执行完成，执行栈为空时，由事件循环机制调度进执行栈继续执行。

这导致了 JavaScript 异步编程的一大特点：**异步回调**，比如网络请求，

```js
// 成功的异步回调函数
function resolve(response) {
  console.log(response)
}
// 失败的异步回调函数
function reject(error) {
  console.log(error)
}

let xhr = new XMLHttpRequest()

xhr.onreadystatechange = () => resolve(xhr.response)
xhr.ontimeout = e => reject(e)
xhr.onerror = e => reject(e)

xhr.open('Get', 'http://xxx')
xhr.send()
```

虽然可以通过简单的封装使得异步回调的方式变得优雅一些，比如，

```js
$.ajax({
  url: 'https://xxx',
  method: 'GET',
  fail: () => {},
  success: () => {},
})
```

但是仍然没有办法解决业务复杂后的“回调地狱”的问题，比如多个依赖请求，

```js
$.ajax({
  success(res1) {
    $.ajax({
      success(res2) {
        $.ajax({
          success(res3) {
            // do something...
          },
        })
      },
    })
  },
})
```

这种线性的嵌套回调使得异步代码变得难以理解和维护，也给人很大的心智负担。
所以我们需要一种技术，来解决**异步编程风格的问题**，这就是 Promise 的动机。

了解 Promise 背景和动机有利于我们理解规范，现在让我们重新回到规范的定义

## 规范

Promise A+ 规范首先定义了 Promise 的一些相关术语和状态。

### Terminology，术语

1. “promise” ，一个拥有 `then` 方法的对象或函数，其行为符合本规范
2. “thenable”，一个定义了 `then` 方法的对象或函数
3. “value”，任何 JavaScript 合法值（包括 `undefined`， `thenable` 和 `promise`）
4. “exception”，使用 `throw` 语句抛出的一个值
5. “reason”，表示一个 `promise` 的拒绝原因

### State，状态

promise 的当前状态必须为以下三种状态之一：`Pending`， `Fulfilled` ， `Rejected`

- 处于 Pending 时，promise 可以迁移至 Fullfilled 或 Rejected
- 处于 Fulfilled 时，promise 必须拥有一个不可变的终值且不能迁移至其他状态
- 处于 Rejected 时，promise 必须拥有一个不可变的拒绝原因且不能迁移至其他状态

所以 Promise 内部其实维护了一个类似下图所示的状态机

<img src="https://camo.githubusercontent.com/255a484d55fbcf1119ce1afb11e8e9558b7eaeaab4d60399f212a4b0d4ca055d/68747470733a2f2f70332d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f65666664623534323937633434313038616337323535656435346239656631367e74706c762d6b3375316662706663702d77617465726d61726b2e696d616765" alt="" />

Promise 在创建时处于 Pending（等待态），之后可以变为 Fulfilled（执行态）或者 Rejected（拒绝态），一个承诺要么被兑现，要么被拒绝，这一过程是不可逆的。

定义了相关的术语和状态后，是对 `then` 方法执行过程的详细描述。

### Then

一个 promise 必须提供一个 `then` 方法以访问其当前值、终值和拒绝原因。

`then` 方法接受两个参数

```js
promise.then(onFulfilled, onRejected)
```

- onFulfilled，在 promise 执行结束后调用，第一个参数为 promise 的终值
- onRejected，在 promise 被拒绝执行后调用，第一个参数为 promise 的拒绝原因

对于这两个回调参数和 `then` 的调用及返回值，有如下的一些规则，

1. onFulfilled 和 onRejected 都是可选参数。
2. onFulfilled 和 onRejected 必须作为函数被调用，调用的 `this` 应用默认绑定规则，也就是在严格环境下，`this` 等于 `undefined`，非严格模式下是全局对象（浏览器中就是 `window`）。关于 `this` 的绑定规则如果不了解的可以参考我之前的一篇文章 [《可能是最好的 this 解析了...》](https://juejin.cn/post/6844904182814621709)，里面有非常详细地介绍。
3. onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用。由于 promise 的实施代码本身就是平台代码（JavaScript），这个规则可以这么理解：就是要确保这两个回调在 then 方法被调用的那一轮事件循环之后异步执行。这不就是微任务的执行顺序吗？所以 promise 的实现原理是基于微任务队列的。
4. `then` 方法可以被同一个 promise 调用多次，而且所有的成功或拒绝的回调需按照其注册顺序依次回调。所以 promise 的实现需要支持链式调用，可以先想一下怎么支持链式调用，稍后我们会有对应的实现。
5. `then` 方法必须返回一个 promise 对象。

针对第 5 点，还有如下几条扩展定义，我们将返回值与 promise 的解决过程结合起来，

```js
promise2 = promise1.then(onFulfilled, onRejected)
```

`then` 的两个回调参数可能会抛出异常或返回一个值，

5.1 如果 onFulfilled 或者 onRejected 抛出一个异常 `e`，那么返回的 promise2 必须拒绝执行，并返回拒绝的原因 `e`。

5.2 如果 onFulfilled 或者 onRejected 返回了一个值 `x`，会执行 promise 的解决过程

- 如果 `x` 和返回的 promise2 相等，也就是 promise2 和 `x` 指向同一对象时，以 `TypeError` 作为拒绝的原因拒绝执行 promise2
- 如果 `x` 是 promise，会判断 `x` 的状态。如果是等待态，保持；如果是执行态，用相同的值执行 promise2；如果是拒绝态，用相同的拒绝原因拒绝 promise2
- 如果 `x` 是对象或者函数，将 `x.then` 赋值给 `then`；如果取 `x.then` 的值时抛出错误 `e` ，则以 `e` 为拒绝原因拒绝 promise2。如果 `then` 是函数，将 `x` 作为函数的 `this`，并传递两个回调函数 resolvePromise, rejectPromise 作为参数调用函数

读到这里，相信你跟我一样已经迫不及待想要实现一个 Promise 了，既然了解了原理和定义，我们就来手写一个 Promise 吧。

```js
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function resolve(value) {
  return value
}

function reject(err) {
  throw err
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(
      new TypeError('Chaining cycle detected for promise #<Promise>')
    )
  }
  let called
  if ((typeof x === 'object' && x != null) || typeof x === 'function') {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (called)
              return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          (r) => {
            if (called)
              return
            called = true
            reject(r)
          }
        )
      }
      else {
        resolve(x)
      }
    }
    catch (e) {
      if (called)
        return
      called = true
      reject(e)
    }
  }
  else {
    resolve(x)
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.resolveCallbacks = []
    this.rejectCallbacks = []

    let resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.resolveCallbacks.forEach(fn => fn())
      }
    }

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.rejectCallbacks.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject)
    }
    catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : resolve
    onRejected = typeof onRejected === 'function' ? onRejected : reject
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          }
          catch (e) {
            reject(e)
          }
        }, 0)
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          }
          catch (e) {
            reject(e)
          }
        }, 0)
      }

      if (this.status === PENDING) {
        this.resolveCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            }
            catch (e) {
              reject(e)
            }
          }, 0)
        })

        this.rejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            }
            catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })

    return promise2
  }
}
```
