---
title: React组件通信
published: 2025-01-17T11:09:16.000Z
description: ''
updated: ''
tags: []
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---
# React 组件通信
>随着 2019 年 2 月 React 稳定版 hooks 在 16.8 版本发布，涌现了越来越多的“hooks 时代”的状态管理库（如 zustand），“class 时代”的状态管理库（如 redux）也全面拥抱了 hooks。无一例外，它们都聚焦于解决 组件通信 的问题 🤔

- 组件通信的方式有哪些？
- 这么多的状态管理库要怎么选？
- 可变状态 or 不可变状态？

截至目前，React 中组件间的通信方式一共有 5 种，

- props 和 callback
- Context（官方）
- Event Bus（事件总线）
- ref 传递
- 状态管理库（如：redux、mobx、zustand、recoil、valtio、jotai、hox 等）

接下来一个一个介绍一下

## props 和 callback

props 和 callback 是 React 中组件通信最基本的方式，也是最常用的方式。

React 组件最基础的通信方式是使用 props 来传递信息，props 是只读的，每个父组件都可以提供 props 给它的子组件，从而将一些信息传递给它，这里的信息可以是，

- JSX 标签信息，如 className、src、alt、width 和 height 等
- 对象或其他任意类型的值
- 父组件中的 state
- children
- balabala...

一般情况在“父传子”的通信场景下使用 props，下面是一个 props 通信的例子

```jsx
import React, { useState } from "react";

function Parent() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <button type="button" onClick={() => setCount(count + 1)}>Add</button>
      <Child count={count}>Children</Child>
    </>
  );
}

function Child(props) {
  // 解构 props
  const { count, children } = props;

  return (
    <>
      <p> parent: {count}</p>
      <p>Received children from parent: {children}</p>
    </>
  );
}

```
callback 回调函数也可以是 props 
利用 callback 回调函数，子组件可以向父组件传递信息，来一个 callback 通信的🌰
```jsx
function Parent() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <button type="button" onClick={() => setCount(count + 1)}>Add</button>
      <Child updateCount={(value) => setCount(value)}>Children</Child>
    </>
  );
}

function Child(props) {
  const { updateCount } = props;
  
  return <button type="button" onClick={() => updateCount(count + 1)}>Add</button>;
}
```

此外，如果多个组件需要共享 state，且层级不是太复杂时，我们通常会考虑 状态提升
实现的思路是：
将公共 state 向上移动到它们的最近共同父组件中
再使用 props 传递给子组件 
<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd435d248bfe4407b4199abd9c7e2bea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?" alt="" />
这时候一般会发现一个问题
在多级嵌套组件的场景下，使用 props 进行通信是一件成本极高的事情
你要一直穿穿穿
所以 context 就应运而生了 😎
## Context
react 官方对于 context 的使用场景是
>使用 Context 看起来非常诱人！
> 然而，这也意味着它也太容易被过度使用了。*如果你只想把一些 props 传递到多个层级中，这并不意味着你需要把这些信息放到 context 里。*
>在使用 context 之前，你可以考虑以下几种替代方案：
>1. 从 传递 props 开始。如果你的组件看起来不起眼，那么通过十几个组件向下传递一堆 props 并不罕见。这有点像是在埋头苦干，但是这样做可以让哪些组件用了哪些数据变得十分清晰！维护你代码的人会很高兴你用 props 让数据流变得更加清晰。
>2. 抽象组件并 将 JSX 作为 children 传递 给它们。如果你通过很多层不使用该数据的中间组件（并且只会向下传递）来传递数据，这通常意味着你在此过程中忘记了抽象组件。举个例子，你可能想传递一些像 posts 的数据 props 到不会直接使用这个参数的组件，类似 `<Layout posts={posts} />`。取而代之的是，让 Layout 把 children 当做一个参数，然后渲染 `<Layout><Posts posts={posts} /></Layout>`。这样就减少了定义数据的组件和使用数据的组件之间的层级。
>如果这两种方法都不适合你，再考虑使用 context。


<img src="https://camo.githubusercontent.com/e58c76397f171c4d8b42c4f1ab30ccc8ff24f5a0116df2ee86d84473d9e00368/68747470733a2f2f70332d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f39623061653466366232626434663730383131373032313631363338323166357e74706c762d6b3375316662706663702d7a6f6f6d2d696e2d63726f702d6d61726b3a313531323a303a303a302e6177656270" alt="context" />
Context 让父组件可以为它下面的整个组件树提供数据，这在一些特定的场景下非常有用，比如，

- 主题：可以在应用顶层放一个 context provider，并在需要调整其外观的组件中使用该 context
- 全局的共享信息：如当前登录的用户信息，将它放到 context 中可以方便地在树中任何位置读取
- 路由：大多数路由解决方案在内部使用 context 保存当前路由，用于判断链接是否处于活动状态

需要注意的是，使用 Context 我们需要考量具体的场景，因为 Context 本身存在以下问题，

- context 的值一旦变化，所有依赖该 context 的组件全部都会 force update
- context 会穿透 React.memo 和 shouldComponentUpdate 的对比

此外，对于异步请求和数据间的联动，Context 也没有提供任何 API 支持，如果使用 Context，需要自己做一些封装。

## ref
使用 ref 可以访问到由 React 管理的 DOM 节点，ref 一般适用以下的场景，

管理焦点，获取子组件的值，文本选择或媒体播放
触发强制动画
集成第三方 DOM 库

ref 也是组件通信的一种方案，通过 ref 可以获取子组件的实例，以 input 元素的输入值为例，

```tsx
import React, { useRef, useState } from "react";

interface ChildProps {
  inputRef: React.RefObject<HTMLInputElement>;
}

const Child: React.FC<ChildProps> = ({ inputRef }) => <input ref={inputRef} />;

const Parent: React.FC = () => {
  const [text, setText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      setText(inputRef.current.value);
    }
  };

  return (
    <div>
      <Child inputRef={inputRef} />
      <button type="button" onClick={handleClick}>Get Input Value</button>
      <p>Input Value: {text}</p>
    </div>
  );
};

```

## 状态管理库
好啦 上述的组件通信方案都有自己的使用场景 但是 如果项目复杂度很高 组件很多 组件通信就会变得很复杂 这时候就需要状态管理库了
React 的状态管理库一直以来都是 React 生态中非常内卷的一个领域
介绍一下比较常用的几个

### redux
Redux 是一个基于 Flux 架构的一种实现，遵循“单向数据流”和“不可变状态模型”的设计思想

这个简单介绍一下 flux 架构
Flux 将一个应用分成四个部分。

- View：视图层
- Action（动作）：视图层发出的消息（比如 mouseClick）
- Dispatcher（派发器）：用来接收 Actions、执行回调函数
- Store（数据层）：用来存放应用的状态，一旦发生变动，就提醒 Views 要更新页面

<img src="https://www.ruanyifeng.com/blogimg/asset/2016/bg2016011503.png" alt="flux" />

> Flux 的最大特点，就是数据的"单向流动"。

1. 用户访问 View
2. View 发出用户的 Action
3. Dispatcher 收到 Action，要求 Store 进行相应的更新
4. Store 更新后，发出一个"change"事件
5. View 收到"change"事件后，更新页面

上面过程中，数据总是"单向流动"，任何相邻的部分都不会发生数据的"双向流动"。这保证了流程的清晰

#### 通过 Action-Reducer-Store 的工作流程实现状态的管理，具有以下的优点，

- 可预测和不可变状态，行为稳定可预测、可运行在不同环境
- 单一 store，单项数据流集中管理状态，在做 撤销/重做、 状态持久化 等场景有天然优势
- 成熟的开发调试工具，Redux DevTools 可以追踪到应用的状态的改变

使用 Redux 就得遵循他的设计思想，包括其中的“三大原则”，

- 使用单一 store 作为数据源
- state 是只读的，唯一改变 state 的方式就是触发 action
- 使用纯函数来执行修改，接收之前的 state 和 action，并返回新的 state

下面有一个简单的 demo
```tsx
import React from "react";
import { createStore, combineReducers } from "redux";
import { Provider, useSelector, useDispatch } from "react-redux";

// 定义 action 类型
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

// 定义 action 创建函数
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

// 定义 reducer
const counter = (state = 0, action: { type: string }) => {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
    default:
      return state;
  }
};

// 创建 store
const rootReducer = combineReducers({ counter });
const store = createStore(rootReducer);

// 定义 Counter 组件
const Counter: React.FC = () => {
  const count = useSelector((state: { counter: number }) => state.counter);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button type="button" onClick={() => dispatch(increment())}>add</button>
      <button type="button" onClick={() => dispatch(decrement())}>dec</button>
    </div>
  );
};

// 使用 Provider 包裹根组件
const App: React.FC = () =>
  <Provider store={store}>
    <Counter />
  </Provider>
```
可以看到，由于没有规定如何处理异步加上相对约定式的设计，导致 Redux 存在以下的一些问题，

陡峭的学习曲线，副作用扔给中间件来处理，导致社区一堆中间件，学习成本陡然增加
大量的模版代码，包括 action、action creator 等大量和业务逻辑无关的模板代码
性能问题，状态量大的情况下，state 更新会影响所有组件，每个 action 都会调用所有 reducer

虽然 Redux 一致尝试致力解决上述部分问题，比如后面推出的 redux toolkit，但即便如此，对于开发者（尤其是初学者）而言，仍然有比较高的学习成本和心智负担。
相比之下我还是更推荐 zustand
## zustand
zustand 是一个轻量级的状态管理库，经过 Gzip 压缩后仅 954B 大小，
zustand 凭借其函数式的理念，优雅的 API 设计，成为 2021 年 Star 数增长最快的 React 状态管理库，

与 redux 的理念类似，zustand 也是基于不可变状态模型和单向数据流，区别在于，

- redux 需要包装一个全局 / 局部的 Context Provider，而 zustand 不用
- redux 基于 reducers 纯函数更新状态，zustand 通过类原生 useState 的 hooks 语法，更简单灵活
- zustand 中的状态更新是同步的，不需要异步操作或中间件

zustand 的心智模型非常简单，包含一个发布订阅器和渲染层，工作原理如下

<img src="https://camo.githubusercontent.com/259b5a04bd2ce117a36babaabfda622ac60e8a81a2f7e286965e73980d882b89/68747470733a2f2f70312d6a75656a696e2e62797465696d672e636f6d2f746f732d636e2d692d6b3375316662706663702f38366262633438393732623634353034386463643938623134663434373732377e74706c762d6b3375316662706663702d77617465726d61726b2e696d6167653f" alt="zustand" />
其中 Vanilla 层是发布订阅模式的实现，提供了 `setState`、`subscribe` 和 `getState` 方法，React 层是 Zustand 的核心，实现了 reselect 缓存和注册事件的 listener 的功能，并且通过 `forceUpdate` 对组件进行重渲染，发布订阅相信大家都比较了解了，我们重点介绍下渲染层。
首先思考一个问题，React hooks 语法下，我们如何让当前组件刷新？
是不是只需要利用 useState 或 useReducer 这类 hook 的原生能力即可，调用第二个返回值的 dispatch 函数，就可以让组件重新渲染，这里 zustand 选择的是 useReducer，

```ts
const [, forceUpdate] = useReducer((c) => c + 1, 0) as [never, () => void]
```
有了 forceUpdate 函数，接下来的问题就是什么时候调用 forceUpdate
参考一下 zustand 源码
```ts
// create 函数实现
// api 本质就是就是 createStore 的返回值，也就是 Vanilla 层的发布订阅器
const api: CustomStoreApi = typeof createState === 'function' ? createStore(createState) : createState

// 这里的 useIsomorphicLayoutEffect 是同构框架常用 API 套路，在前端环境是 useLayoutEffect，在 node 环境是 useEffect
useIsomorphicLayoutEffect(() => {
  const listener = () => {
    try {
      // 拿到最新的 state 与上一次的 compare 函数
      const nextState = api.getState()
      const nextStateSlice = selectorRef.current(nextState)
      // 判断前后 state 值是否发生了变化，如果变化调用 forceUpdate 进行一次强制刷新
      if (!equalityFnRef.current(currentSliceRef.current as StateSlice, nextStateSlice)) {
        stateRef.current = nextState
        currentSliceRef.current = nextStateSlice
        forceUpdate()
      }
    } catch (error) {
      erroredRef.current = true
      forceUpdate()
    }
  }
  // 订阅 state 更新
  const unsubscribe = api.subscribe(listener)
  if (api.getState() !== stateBeforeSubscriptionRef.current) {
    listener()
  }
  return unsubscribe
}, [])

```
我们首先从第 24 行 `api.subscribe(listener)` 开始，这里先创建了 `listener` 的订阅，这就使得任何的 `setState` 调用都会触发 `listener` 的执行，接着回到 `listener` 函数的内部，利用 `api.getState()` 拿到了最新 state，以及上一次的 compare 函数 equalityFnRef，然后执行比较函数后判断值前后是否发生了改变，如果改变则调用 `forceUpdate` 进行一次强制刷新。
这就是 zustand 渲染层的原理，简单而精巧，zustand 实现状态共享的方式本质是将状态保存在一个对象里

tips:
- useEffect 是异步执行的，而 useLayoutEffect 是同步执行的。
- useEffect 的执行时机是浏览器完成渲染之后，而 useLayoutEffect 的执行时机是浏览器把内容真正渲染到界面之前

## 小结
都 2025 年了，对于 React 组件的通信，我们有太多可选的方式
对于选型可以参考下面的大致的思路，

如果组件间需要共享 state，且层级不是太复杂时，我们通常会考虑状态提升
Context 更适合存储一些全局的共享信息，如主题，用户登陆信息等
ref 更适用于管理焦点，获取子组件的值，触发强制动画，第三方 DOM 库集成等场景
如果你习惯了不可变更新，可以考虑生态丰富的 redux 和轻量的 zustand
如果你习惯了类 Vue 的响应式可变模型，mobx 和 valtio 可能更适合
如果你想尝试原子状态的方案，recoil 和 jotai 是个不错的选择 (recoil 已经被 gank 了 据说有内存泄漏问题🤣)
如果你想基于 custom hook 实现状态持久化和共享，hox 可能更适合





