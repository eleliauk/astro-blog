---
title: React技术揭秘——理念2
published: 2024-10-26T19:01:02.000Z
description: ''
updated: ''
tags: []
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

# React16的新架构
React16架构可以分为三层：

- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入**Reconciler**
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

可以看到，相较于React15，React16中新增了**Scheduler（调度器）**，让我们来了解下他。

### Scheduler（调度器）:haircut:

既然我们以浏览器是否有剩余时间作为任务中断的标准，那么我们需要一种机制，当浏览器有剩余时间时通知我们。

其实部分浏览器已经实现了这个API，这就是[requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)。但是由于以下因素，`React`放弃使用：

- 浏览器兼容性
- 触发频率不稳定，受很多因素影响。比如当我们的浏览器切换tab后，之前tab注册的`requestIdleCallback`触发的频率会变得很低

基于以上原因，`React`实现了功能更完备的`requestIdleCallback`polyfill，这就是**Scheduler**。除了在空闲时触发回调的功能外，**Scheduler**还提供了多种调度优先级供任务设置。

> [Scheduler](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/README.md)是独立于`React`的库

### Reconciler（协调器）

我们知道，在React15中**Reconciler**是递归处理虚拟DOM的。让我们看看[React16的Reconciler](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1673)。

我们可以看见，更新工作从递归变成了可以中断的循环过程。每次循环都会调用`shouldYield`判断当前是否有剩余时间。
```js
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

那么React16是如何解决中断更新时DOM渲染不完全的问题呢？

在React16中，**Reconciler**与**Renderer**不再是交替工作。当**Scheduler**将任务交给**Reconciler**后，**Reconciler**会为变化的虚拟DOM打上代表增/删/更新的标记，类似这样：

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

> 全部的标记见[这里](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js)

整个**Scheduler**与**Reconciler**的工作都在内存中进行。只有当所有组件都完成**Reconciler**的工作，才会统一交给**Renderer**。

> 你可以在[这里](https://zh-hans.reactjs.org/docs/codebase-overview.html#fiber-reconciler)看到`React`官方对React16新**Reconciler**的解释

### Renderer（渲染器）

**Renderer**根据**Reconciler**为虚拟DOM打的标记，同步执行对应的DOM操作。


`state.count = 1`，每次点击按钮`state.count++`

列表中3个元素的值分别为1，2，3乘以`state.count`的结果 

在React16架构中整个更新流程为：

<img src="https://react.iamkasong.com/img/process.png" alt="更新流程" />

其中红框中的步骤随时可能由于以下原因被中断：

- 有其他更高优任务需要先更新
- 当前帧没有剩余时间

由于红框中的工作都在内存中进行，不会更新页面上的DOM，所以即使反复中断，用户也不会看见更新不完全的DOM

>接下来看看Fiber是什么？
>他和Reconciler或者说和React之间是什么关系

# fiber架构的心智模型

>React核心团队成员Sebastian Markbåge（React Hooks的发明者）曾说：我们在React中做的就是践行代数效应（Algebraic Effects）。
>那么，代数效应是什么呢？他和React有什么关系呢。

## 什么是代数效应

`代数效应`是`函数式编程`中的一个概念，用于将`副作用`从`函数`调用中分离。

接下来我们用`虚构的语法`来解释。

假设我们有一个函数`getTotalPicNum`，传入2个`用户名称`后，分别查找该用户在平台保存的图片数量，最后将图片数量相加后返回。

```js
function getTotalPicNum(user1, user2) {
  const picNum1 = getPicNum(user1);
  const picNum2 = getPicNum(user2);

  return picNum1 + picNum2;
}
```

在`getTotalPicNum`中，先别关注`getPicNum`的实现，只在乎“获取到两个数字后将他们相加的结果返回”这一过程。

接下来我们来实现`getPicNum`。

"用户在平台保存的图片数量"是保存在服务器中的。所以，为了获取该值，我们需要发起异步请求。

为了尽量保持`getTotalPicNum`的调用方式不变，我们首先想到了使用`async await`：

```js
async function getTotalPicNum(user1, user2) {
  const picNum1 = await getPicNum(user1);
  const picNum2 = await getPicNum(user2);

  return picNum1 + picNum2;
}
```

但是，`async await`是有`传染性`的 —— 当一个函数变为`async`后，这意味着调用他的函数也需要是`async`，这破坏了`getTotalPicNum`的同步特性。

有没有什么办法能保持`getTotalPicNum`保持现有调用方式不变的情况下实现异步请求呢？

没有。不过我们可以`虚构`一个。

我们虚构一个类似`try...catch`的语法 —— `try...handle`与两个操作符`perform`、`resume`。

```js
function getPicNum(name) {
  const picNum = perform name;
  return picNum;
}

try {
  getTotalPicNum('shanyujia', 'react');
} handle (who) {
  switch (who) {
    case 'shanyujia':
      resume with 230;
    case 'react':
      resume with 122;
    default:
      resume with 0;
  }
}
```

当执行到`getTotalPicNum`内部的`getPicNum`方法时，会执行`perform name`。

此时函数调用栈会从`getPicNum`方法内跳出，被最近一个`try...handle`捕获。类似`throw Error`后被最近一个`try...catch`捕获。

类似`throw Error`后`Error`会作为`catch`的参数，`perform name`后`name`会作为`handle`的参数。

与`try...catch`最大的不同在于：当`Error`被`catch`捕获后，之前的调用栈就销毁了。而`handle`执行`resume`后会回到之前`perform`的调用栈。

对于`case 'kaSong'`，执行完`resume with 230;`后调用栈会回到`getPicNum`，此时`picNum === 230`

>注意:warning:
>
>再次申明，`try...handle`的语法是虚构的，看看`代数效应`的思想。

总结一下：`代数效应`能够将`副作用`（例子中为`请求图片数量`）从函数逻辑中分离，使函数关注点保持纯粹。

并且，从例子中可以看出，`perform resume`不需要区分同步异步。

## 代数效应在React中的应用

那么`代数效应`与`React`有什么关系呢？最明显的例子就是`Hooks`。

对于类似`useState`、`useReducer`、`useRef`这样的`Hook`，我们不需要关注`FunctionComponent`的`state`在`Hook`中是如何保存的，`React`会为我们处理。

我们只需要假设`useState`返回的是我们想要的`state`，并编写业务逻辑就行。

```js
function App() {
  const [num, updateNum] = useState(0);
  
  return (
    <button onClick={() => updateNum(num => num + 1)}>{num}</button>  
  )
}
```

## 代数效应与Generator

从`React15`到`React16`，协调器（`Reconciler`）重构的一大目的是：将老的`同步更新`的架构变为`异步可中断更新`。

`异步可中断更新`可以理解为：`更新`在执行过程中可能会被打断（浏览器时间分片用尽或有更高优任务插队），当可以继续执行时恢复之前执行的中间状态。

这就是`代数效应`中`try...handle`的作用。

其实，浏览器原生就支持类似的实现，这就是`Generator`。

但是`Generator`的一些缺陷使`React`团队放弃了他：

- 类似`async`，`Generator`也是`传染性`的，使用了`Generator`则上下文的其他函数也需要作出改变。这样心智负担比较重。
- `Generator`执行的`中间状态`是上下文关联的。

看看下面的🌰

```js
function* doWork(A, B, C) {
  var x = doExpensiveWorkA(A);
  yield;
  var y = x + doExpensiveWorkB(B);
  yield;
  var z = y + doExpensiveWorkC(C);
  return z;
}
```

每当浏览器有空闲时间都会依次执行其中一个`doExpensiveWork`，当时间用尽则会中断，当再次恢复时会从中断位置继续执行。

只考虑“单一优先级任务的中断与继续”情况下`Generator`可以很好的实现`异步可中断更新`。

但是当我们考虑“高优先级任务插队”的情况，如果此时已经完成`doExpensiveWorkA`与`doExpensiveWorkB`计算出`x`与`y`。

此时`B`组件接收到一个`高优更新`，由于`Generator`执行的`中间状态`是上下文关联的，所以计算`y`时无法复用之前已经计算出的`x`，需要重新计算。

如果通过`全局变量`保存之前执行的`中间状态`，又会引入新的复杂度。

基于这些原因，`React`没有采用`Generator`实现`协调器`。

## 代数效应与Fiber

`Fiber`并不是计算机术语中的新名词，他的中文翻译叫做`纤程`，与进程（Process）、线程（Thread）、协程（Coroutine）同为程序执行过程。

在很多文章中将`纤程`理解为`协程`的一种实现。在`JS`中，`协程`的实现便是`Generator`。

所以，我们可以将`纤程`(Fiber)、`协程`(Generator)理解为`代数效应`思想在`JS`中的体现。

`React Fiber`可以理解为：

`React`内部实现的一套状态更新机制。支持任务不同`优先级`，可中断与恢复，并且恢复后可以复用之前的`中间状态`。

其中每个任务更新单元为`React Element`对应的`Fiber节点`。

接下来，康康`Fiber架构`的实现

## Fiber的起源

> 最早的`Fiber`官方解释来源于[2016年React团队成员Acdlite的一篇介绍](https://github.com/acdlite/react-fiber-architecture)。

在`React15`及以前，`Reconciler`采用递归的方式创建虚拟DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。

为了解决这个问题，`React16`将**递归的无法中断的更新**重构为**异步的可中断更新**，由于曾经用于递归的**虚拟DOM**数据结构已经无法满足需要。于是，全新的`Fiber`架构应运而生。

## Fiber的含义

`Fiber`包含三层含义：

1. 作为架构来说，之前`React15`的`Reconciler`采用递归的方式执行，数据保存在递归调用栈中，所以被称为`stack Reconciler`。`React16`的`Reconciler`基于`Fiber节点`实现，被称为`Fiber Reconciler`。
2. 作为静态的数据结构来说，每个`Fiber节点`对应一个`React element`，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
3. 作为动态的工作单元来说，每个`Fiber节点`保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

## Fiber的结构

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

### 作为架构来说

每个Fiber节点有个对应的`React element`，多个`Fiber节点`是怎么连接形成树呢？用下面三个属性：

```js
// 指向父级Fiber节点
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;
```

举个例子，如下的组件结构：

```js
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  )
}
```

<img src="https://react.iamkasong.com/img/fiber.png" alt="" />

> 这里需要提一下，为什么父级指针叫做`return`而不是`parent`或者`father`呢？因为作为一个工作单元，`return`指节点执行完`completeWork`（本章后面会介绍）后会返回的下一个节点。子`Fiber节点`及其兄弟节点完成工作后会返回其父级节点，所以用`return`指代父级节点。

### 作为静态的数据结构

作为一种静态的数据结构，保存了组件相关的信息：

```js
// Fiber对应组件的类型 Function/Class/Host...
this.tag = tag;
// key属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
```

### 作为动态的工作单元

作为动态的工作单元，`Fiber`中如下参数保存了本次更新相关的信息，我们会在后续的更新流程中使用到具体属性时再详细介绍

```js
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// 保存本次更新会造成的DOM操作
this.effectTag = NoEffect;
this.nextEffect = null;

this.firstEffect = null;
this.lastEffect = null;
```

如下两个字段保存调度优先级相关的信息，会在讲解`Scheduler`时介绍。

```js
// 调度优先级相关
this.lanes = NoLanes;
this.childLanes = NoLanes;
```

注意

在2020年5月，调度优先级策略经历了比较大的重构。以`expirationTime`属性为代表的优先级模型被`lane`取代。可以看看[这个PR](https://github.com/facebook/react/pull/18796)

那么`Fiber树`和页面呈现的`DOM树`有什么关系，`React`又是如何更新`DOM`的呢？

且听下回分解！ （写不动了）🥱

## 复活！ 补上
我们现在知道了Fiber是什么，知道Fiber节点可以保存对应的DOM节点。
相应的，Fiber节点构成的Fiber树就对应DOM树。
那么如何更新DOM呢？这需要用到被称为“双缓存”的技术。


