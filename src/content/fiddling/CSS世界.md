---
title: CSS世界
published: 2025-01-19T17:59:40.000Z
description: ''
updated: ''
tags: ['CSS']
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---
# 一些基础概念
## 一些零碎的知识点吧
1. div 块级元素
 span 内联元素
2. 声明块
```css
{
 height: 99px;
 color: transparent;
}
```
3. 规则/规则集
选择器 + 声明块
```css
.vocabulary {
 height: 99px;
 color: transparent;
}
```
4. 选择器
选择器是用来瞄准目标元素的东西，例如，上面的.vocabulary 就是一个选择器。
- 类选择器：指以“.”这个点号开头的选择器。很多元素可以应用同一个类选择器。“类”，
天生就是被公用的命。
- ID 选择器：“#”打头，权重相当高。ID 一般指向唯一元素。但是，在 CSS 中，ID
样式出现在多个不同的元素上并不会只渲染第一个，而是雨露均沾。但显然不推荐
这么做。
- 属性选择器：指含有 [] 的选择器，形如 [title]{}、[title= "css-world"]{}、
[title~="css-world"]{}、[title^= "css-world"]{}和 [title$="cssworld"]{}等。
- 伪类选择器：一般指前面有个英文冒号（:）的选择器，如:first-child 或:lastchild 等。
- 伪元素选择器：就是有连续两个冒号的选择器，如::first-line::firstletter、::before 和::after。
5. 关系选择器
关系选择器是指根据与其他元素的关系选择元素的选择器，常见的符号有空格、>、~，还
有 + 等，这些都是非常常用的选择器
- 后代选择器：选择所有合乎规则的后代元素。空格连接。
- 相邻后代选择器：仅仅选择合乎规则的儿子元素，孙子、重孙元素忽略，因此又称“子
选择器”。>连接。适用于 IE7 以上版本。
- 兄弟选择器：选择当前元素后面的所有合乎规则的兄弟元素。~连接。适用于 IE7 以上
版本。
- 相邻兄弟选择器：仅仅选择当前元素相邻的那个合乎规则的兄弟元素。+连接。适用于
IE7 以上版本。
6. @规则
@规则指的是以@字符开始的一些规则，像`@media、@font-face、@page `或者 `@support`，
诸如此类
## 未定义行为
我们的 firefox 可能在日常开发中出现一些很神秘的 bug
此时遇到的表现差异并不是浏览器的 bug，用计算机领域的专业术语描述应该是“未定义行为”（undefined behavior）。
举个🌰
伪类元素中 比较常用的就是 :active
通用情况下，:active 的表现都是符合预期的，但是，当遭遇其他一些处理的时候，事情
就会变得不一样，让我们来看看到底是什么情况捏
假设我们现在有一个<a>标签模拟的按钮
css 如下
```css
a:active { background-color: red; }
```
假设我们的此按钮的 DOM 对象变量名为 button，js 代码如下：
```js
button.addEventListener('mousedown', (event) => {
  // 此处省略 N 行
  event.preventDefault()
})
```
你会发现这不就是一个取消了默认事件吗
能有什么情况
最后却发生了意想不到的情况：Firefox 浏览器的:active 阵
亡了，鼠标按下去没有 UI 变化，按钮背景没有变红！其他所有浏览器，如 IE 和 Chrome 浏览
器，:active 正常变红，符合预期
这里，Firefox 和 IE/Chrome 浏览器表现不一样，这是 Firefox 浏览器的 bug 吗？这可不是
bug，而是因为规范上并没有对这种场景的具体描述，所以 Firefox 认为:active 发生在
mousedown 事件之后，你也不能说它什么，对吧？
像这种规范顾及不到的细枝末节的实现，就称为 *未定义行为*。
