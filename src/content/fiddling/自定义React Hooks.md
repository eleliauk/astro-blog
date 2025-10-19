---
title: 自定义React hooks
published: 2024-03-08T02:24:34.000Z
description: ''
updated: ''
tags: []
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

# 自定义`React Hooks`

### 1.为什么会出现`hooks`这个东西捏 :question:

刚看`hooks` 就出现了这个问题 `hooks`出现的意义在哪里呢

`hooks`能解决什么问题

`React`中组件有两种写法 一种类组件 一种函数组件

但是函数组件相对于类组件来说有一个小小滴缺点  就是没有`state` :pensive:

所以`hooks`就应运而生勒:grinning:

`hooks`是一类特殊的函数 允许在React的函数式组件中"钩入"状态,生命周期等其他`React`的特性

提供了一种无需类组件的方式,使得现在在函数式组件中可以使用像 `this.state`,`this.props`的概念勒:cactus:

###

### 2.那`hooks`都这么厉害了 为什么还要有自定义的`hooks`捏:grey_question:

正常的`useState`接受两个参数

```jsx
const [state, setState] = useState('')
```

正常在类组件中`setState`会支持两个参数: 一个是更新后的`state`或者回调式更新的`state` 另一个参数是更新后的回调函数

`tips`:什么是回调函数:sweat:

回调 (callback) 是**作为参数传递给另一个函数的函数** ,并在被调用函数执行完毕后被调用

个人的小理解: 回调函数就是先定义了`functionA`然后再定义了`functionB`

但是在使用时候先用了`functionB` 并且把`functionA`当成了参数给了`functionB`

`useState` hook并不直接支持像类组件中的`setState`方法那样可以接收第二个参数作为回调函数。`useState` hook返回的更新函数只能用于更新状态，并且不会提供回调函数的选项

所以自定义`hooks`就出现啦

### 3.来自定义`useState`吧:sake:

```jsx
const useStatePro =(initState)=>{
    const [state,setState]=useState(initState);
    //存储一手回调函数
    const isUpdate=useRef()
    //定义一个新函数喽 (接受一个新状态和一个回调函数)
    const setStatePro =(newState,cb)=>{
        //使用setState更新状态 把回调函数储存在current里
        //如果newState是个函数的情况下 就计算新状态
        setState(
        prev=>{
            isUpdate.current=cb
            return typeof newState='function' ? newState(prev):newState
        }
        )
    }
    //检查一下current有无回调函数 有就直接执行
    useEffect(()=>{
        if(isUpdate.current)
            {
				return isUpdate.current()
            }
    })
    return [state,useStatePro]
}
```

这样就实现了`useState`的功能 但是多了一个在状态更新后执行回调函数的功能

### 4.自定义一个更新函数`useUpdate`

如果正常使用`hooks`想让组件重新渲染 一般是要更新state的

但是有的时候可能一个state掌握着好几个组件的生死大权:smiling_imp:

不能就为了一个小小的组件就让state作出无意义的更新

这时候可以想想能不能定义一个更新的`hooks`来优雅一些实现组件的强制更新

```jsx
function Update() {
  const [,setFlag] = useState()
  const update = () => {
    // 更新一手时间
    setFlag(Date.now())
  }
  return update
}
```

发现这个函数返回了一个函数 这个函数就是用来强制更新的

咋使用他捏:nail_care:

```jsx
const Time=()=>{
    const update=useUpdate();
    return(
        {Date.now()}
   		 <div><button onCLick={update}>更新喽</button></div>
    )
}
```

### 5.自定义hooks实现`redux`

`Redux`目前来说还是常用的管理状态的工具 但是`Redux`需要遵守的规则和步骤有点小多:rage:

所以来制作一个属于自己的`Redux`

#### 1.首先先把应用接口做好

在顶部引入`Provider`组件为所有的儿孙组件提供所有数据源`store`

```jsx
import React from 'react'
import ReactDOM, { render } from 'react-dom'
import App from './components/App'
import Provider from './store/provider'
// 挂载节点
render((
  <Provider>
    <App />
  </Provider>
), document.getElementById('app')
)
```

#### 2.然后就可以开始设计`store`啦:happy:

首先就是数据项

```jsx
//初始化数据
const initState={
 count:0;
}
//reducer 处理器
const reducer =(state,action)=>{
    const{type,payload}=action
    switch(type){
            case'ADD_COUNT':return{...state ,count:state.count+1}
            default : return state;
    }
}// 创建上下文
const Context = React.createContext()
const Provider = (props) => {
const [state, dispatch] = useReducer(reducer, initState)
return (
    <Context.Provider value={{state, dispatch}}>
        {props.children}
    </Context.Provider>
)
}
export default { Context, Provider }

```

在这个数据项中可以看出 initState` `reducer`的定义和使用`redux`是一模一样的

重点看下面的创建的上下文 首先通过`React.createContext()`创建一个空的上下文

然后定义`Provider`这个组件 在内部用`useReducer`把`reducer`和初始化的`initState`传入进去

返回的`state`和`dispatch`提供到`Provider`作为数据源

数据项聚合一下

```jsx
// 聚合count、todo这些数据项
const providers = [
    Count.Provider,
    Todo.Provider
];
// 递归包裹Provider
const ProvidersComposer = (props) => (
    props.providers.reduceRight((children, Parent) => (
        return Parent({children})
    ), props.children)
)
const Provider = (props) => {
return (
    <ProvidersComposer providers={providers}>
        {props.children}
    </ProvidersComposer>
)
}
export default Provider
```

最后出来的组件结构： `Provider > Context.Provider > Context.Provider > App` 我们通过ProviderComposer进行递归包裹，把每个`Provider`进行一层一层的包裹 这里使用了`parent({children})`替代了`<Parent>{children}</Parent>`，这样的做法可以减少一层嵌套结构。

如何使用捏:hankey:

```jsx
import React, { useContext, useEffect } from 'react'
// 引入count数据源
import CountStore from '@/store/modules/count'

function App(props) {
  // 通过useContext使用Count这个store的上下文
  const { state, dispatch } = useContext(CountStore.Context)
  // 每秒更新count
  useEffect(() => {
    setInterval(() => {
      dispatch({ type: 'ADD_COUNT' })
    }, 1000)
  }, [])

  return (
    <div className="app">
      {JSON.stringify(state)}
    </div>
  )
}

export default App
```

这样就实现啦一个小型`redux` 感觉比正常的`redux`会好用一些捏
