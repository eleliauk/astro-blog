---
title: React hook
published: 2024-02-17T18:17:34.000Z
description: ''
updated: ''
tags: []
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

# `React hook`

### Hook 的优势

- Hook 使你在无需改变组件结构的情况下复用状态逻辑（自定义 Hook）
- Hook 将组件中互相关联的部分拆分成更小的函数（比如设置订阅或请求数据）
- Hook 使你在非 class 的情况下可以使用更多的 React 特性

### Hook 使用规则

Hook 就是 `Javascript` 函数，使用它们时有两个额外的规则：

- 只能在**函数外层**调用 Hook，不要在循环、条件判断或者子函数中调用
- 只能在 **React 的函数组件** 和**自定义 Hook** 中调用 Hook。不要在其他 JavaScript 函数中调用

在组件中 React 是通过判断 Hook 调用的顺序来判断某个 state 对应的 `useState`的，所以必须保证 Hook 的调用顺序在多次渲染之间保持一致，React 才能正确地将内部 state 和对应的 Hook 进行关联

## `useState`

`useState` 可以使函数组件像类组件一样拥有 `state`，函数组件通过 `useState` 可以让组件重新渲染，更新视图

```jsx
const [ ①state , ②dispatch ] = useState(③initData)
```

① `state`，目的提供给 `UI` ，作为渲染视图的数据源

② `dispatchAction`(setState) 改变 state 的函数，可以理解为推动函数组件渲染的渲染函数

③ `initData` 有两种情况，第一种情况是非函数，将作为 state 初始化的值。 第二种情况是函数，函数的返回值作为 `useState` 初始化的值

基础用法

```jsx
function DemoState(props) {
  /* number为此时state读取值 ，setNumber为派发更新的函数 */
  let [number, setNumber] = useState(0) /* 0为初始值 */
  return (
    <div>
      <span>{ number }</span>
      <button onClick={() => {
        setNumber(number + 1)
        console.log(number) /* 这里的number是不能够即使改变的  */
      }}
      >
      </button>
    </div>
  )
}
```

**``useState 注意事项`：**

① 在函数组件一次执行上下文中，state 的值是固定不变的

② 如果两次 `dispatchAction` 传入相同的 state 值，那么组件就不会更新

③ 当触发 `dispatchAction` 在当前执行上下文中获取不到最新的 `state`, 只有在下一次组件 rerender 中才能获取到。

## `useReducer`

组件中可能有多个位置包括了对某个状态的修改操作

`useReducer`用于统一管理状态的操作方式

使用 `useReducer` 还能给那些会触发深更新的组件做性能优化，因为父组件可以向子组件传递 `dispatch` 而不是回调函数

```jsx
const [state, dispatch] = useReducer (countReducer, 0)
```

① 更新之后的 state 值。

② 派发更新的 dispatch 函数, 本质上和 `useState` 的 dispatch是一样的。

③ 一个函数`countReducer` 常规reducer里面的 state 和action

准备一个用来进行状态功能管理的函数

```jsx
function countReducer(state, action)
// state reducer管理状态的是哪个
// action 对这个状态进行哪些操作
{
  switch (action.type) {
    case 'increment' :return state + 1
    case 'decrement':return state - 1
    default:
      throw new Error()
  }
}
export default function App() {
  // state 状态当前值
  // dispatch 用来进行状态修改的触发器 (函数值)
  const [state, dispath] = useReducer(countReducer, 0)
  const handleIncrement = () => dispath({ type: 'increment' })
  const handleDecrement = () => dispath({ type: 'decrement' })
  return (
    <div>
      <button onClick={handleIncrement}>-</button>
      <span>{state}</span>
      <button onClick={handleDecrement}>+</button>
    </div>
  )
}
```

## `useSyncExternalStore`

不懂以后再说

## `useTransition`

别急

## `useDeferredValue`

你也别急

## `useEffect`

```jsx
useEffect(() => {
  return destory
}, dep)
```

第一个参数`callback`返回的 `destroy`    作为下一次`callback`执行之前调用 用于清楚上一次`callback`产生的副作用

第二个参数作为依赖项，是一个数组，可以有多个依赖项，依赖项改变，执行上一次callback 返回的 `destory` ，和执行新的 effect 第一个参数 callback

```jsx
/* 模拟数据交互 */
function getUserInfo(a){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve({
                name:a,
                age:16,
            })
        },500)
    })
}
const Demo = ({ a }) => {
    const [ userMessage , setUserMessage ] :any= useState({})
    const div= useRef()
    const [number, setNumber] = useState(0)
    /* 模拟事件监听处理函数 */
    const handleResize =()=>{}
  /* useEffect使用 ，这里如果不加限制 ，会是函数重复执行，陷入死循环*/
    useEffect(()=>{
        /* 请求数据 */
        getUserInfo(a).then(res=>{
            setUserMessage(res)
        })
        /* 定时器 延时器等 */
        const timer = setInterval(()=>console.log(666),1000)
        /* 操作dom  */
        console.log(div.current) /* div */
        /* 事件监听等 */
        window.addEventListener('resize', handleResize)
        /* 此函数用于清除副作用 */
        return function(){
            clearInterval(timer)
            window.removeEventListener('resize', handleResize)
        }
          /* 只有当props->a和state->number改变的时候 ,useEffect副作用函数重新执行 ，如果此时数组为空[]，证明函数只有在初始化的时候执行一次相当于componentDidMount */
    },[ a ,number ])
    return (<div ref={div} >
                <span>{ userMessage.name }</span>
                <span>{ userMessage.age }</span>
                <div onClick={ ()=> setNumber(1) } >{ number }</div>
            </div>)
}

```

如上在 `useEffect` 中做的功能如下：

- ① 请求数据。
- ② 设置定时器,延时器等。
- ③ 操作 `Dom `
- ④ 注册事件监听器, 事件绑定
- ⑤ 还可以清除定时器，延时器，解绑事件监听器等。

##  `useLayoutEffect`

别急

## `useInsertionEffect`

你也别急

## `useContext`

可以用`useContext` 来获取父级组件传递过来的`context`的值

这个当前值就是最近的父级组件`Provider` 设置的`value`值 ,

`useContext` 参数一般是由`createContext`方式创建的,也可以父级上下文`context`传递的(参数是`context` )

```jsx
const contextValue = useContext(context)
```

`useContext` 接受一个参数 一般都是 context 对象，返回值为 context 对象内部保存的 value 值

```jsx
/* 用useContext方式 */
function DemoContext() {
  const value = useContext(Context)
  /* my name is alien */
  return (
    <div>
      {' '}
      my name is
      { value.name }
    </div>
  )
}

/* 用Context.Consumer 方式 */
function DemoContext1() {
  return (
    <Context.Consumer>
      {/*  my name is alien  */}
      { value => (
        <div>
          {' '}
          my name is
          { value.name }
        </div>
      ) }
    </Context.Consumer>
  )
}

export default () => {
  return (
    <div>
      <Context.Provider value={{ name: 'alien', age: 18 }}>
        <DemoContext />
        <DemoContext1 />
      </Context.Provider>
    </div>
  )
}
```

## `useRef`

`useRef` 可以用来获取元素，缓存状态，接受一个状态 `initState` 作为初始值，返回一个 ref 对象 cur, cur 上有一个 current 属性就是 ref 对象需要获取的内容

```jsx
const cur = React.useRef(initState)
console.log(cur.current)
```

`useRef` 创建的 ref 对象就是一个普通的对象，而 `useRef()` 和自建一个 `{current: ...}` 对象的唯一区别是，`useRef` 会在每次渲染时返回同一个 ref 对象

### `useRef 基础用法：`

`useRef`来获取DOM节点

```jsx
function DemoUseRef() {
  const dom = useRef(null)
  const handerSubmit = () => {
    /*  <div >表单组件</div>  dom 节点 */
    console.log(dom.current)
  }
  return (
    <div>
      {/* ref 标记当前dom节点 */}
      <div ref={dom}>表单组件</div>
      <button onClick={() => handerSubmit()}>提交</button>
    </div>
  )
}
```

useRef 保存状态

可以利用 useRef 返回的 ref 对象来保存状态，只要当前组件不被销毁，那么状态就会一直存在

```jsx
const status = useRef(false)
/* 改变状态 */
function handleChangeStatus() {
  status.current = true
}
```

## `useImperativeHandle`

这什么玩意

## `useMemo`

useMemo 可以在函数组件 render 上下文中同步执行一个函数逻辑，这个函数的返回值可以作为一个新的状态缓存起来。那么这个 hooks 的作用就显而易见了

场景一：在一些场景下，需要在函数组件中进行大量的逻辑计算，那么我们不期望每一次函数组件渲染都执行这些复杂的计算逻辑，所以就需要在 useMemo 的回调函数中执行这些逻辑，然后把得到的产物（计算结果）缓存起来就可以了。

场景二：React 在整个更新流程中，`diff` 起到了决定性的作用，比如 `Context` 中的 `provider` 通过 `diff value` 来判断是否更新

### `useMemo 基础介绍：`

```jsx
const cacheSomething = useMemo(create, deps)
```

① create：第一个参数为一个函数，函数的返回值作为缓存值，如上 demo 中把 Children 对应的 element 对象，缓存起来。

② deps： 第二个参数为一个数组，存放当前 useMemo 的依赖项，在函数组件下一次执行的时候，会对比 deps 依赖项里面的状态，是否有改变，如果有改变重新执行 create ，得到新的缓存值。

③ `cacheSomething`：返回值，执行 create 的返回值。如果 deps 中有依赖项改变，返回的重新执行 create 产生的值，否则取上一次缓存值。

### `useMemo 基础用法：`

派生新状态：

```jsx
function Scope() {
  const keeper = useKeep()
  const { cacheDispatch, cacheList, hasAliveStatus } = keeper

  /* 通过 useMemo 得到派生出来的新状态 contextValue  */
  const contextValue = useMemo(() => {
    return {
      cacheDispatch: cacheDispatch.bind(keeper),
      hasAliveStatus: hasAliveStatus.bind(keeper),
      cacheDestory: payload => cacheDispatch.call(keeper, { type: ACTION_DESTORY, payload })
    }
  }, [keeper])
  return (
    <KeepaliveContext.Provider value={contextValue}>
    </KeepaliveContext.Provider>
  )
}
```

如上通过 `useMemo` 得到派生出来的新状态 `contextValue` ，只有 keeper 变化的时候，才改变 Provider 的 value

## `useCallback`

这个好像有点急 但是先别急

## `useDebugValue`

这什么玩意

## `useId`

看不懂思密达

## `自定义hook`

别急
