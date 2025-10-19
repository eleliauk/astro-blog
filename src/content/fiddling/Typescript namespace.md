---
title: Typescript namespace
published: 2024-07-12T08:55:09.000Z
description: ''
updated: ''
tags: []
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

# Typescript namespace

namespace 是一种将相关代码组织在一起的方式，中文译为“命名空间”。

它出现在 ES 模块诞生之前，作为 TypeScript 自己的模块格式而发明的。但是，自从有了 ES 模块，官方已经不推荐使用 namespace 了。

## 基本用法

namespace 用来建立一个容器，内部的所有变量和函数，都必须在这个容器里面使用。

```ts
namespace Utils {
  function isString(value: any) {
    return typeof value === 'string'
  }

  // 正确
  isString('yes')
}

Utils.isString('no') // 报错
```

上面示例中，命名空间`Utils`里面定义了一个函数`isString()`，它只能在`Utils`里面使用，如果用于外部就会报错。

如果要在命名空间以外使用内部成员，就必须为该成员加上`export`前缀，表示对外输出该成员。

```typescript
namespace Utility {
  export function log(msg: string) {
    console.log(msg)
  }
  export function error(msg: string) {
    console.error(msg)
  }
}

Utility.log('Call me')
Utility.error('maybe!')
```

上面示例中，只要加上`export`前缀，就可以在命名空间外部使用内部成员。

编译出来的js代码长这个样:thinking:

```ts
let Utility;

(function (Utility) {
  function log(msg) {
    console.log(msg)
  }
  Utility.log = log
  function error(msg) {
    console.error(msg)
  }
  Utility.error = error
})(Utility || (Utility = {}))
```

上面代码中，命名空间`Utility`变成了 JavaScript 的一个对象，凡是`export`的内部成员，都成了该对象的属性。

这就是说，namespace 会变成一个值，保留在编译后的代码中。这一点要小心，它不是纯的类型代码。

namespace 内部还可以使用`import`命令输入外部成员，相当于为外部成员起别名。当外部成员的名字比较长时，别名能够简化代码

```ts
namespace Utils {
  export function isString(value: any) {
    return typeof value === 'string'
  }
}

namespace App {
  import isString = Utils.isString

  isString('yes')
  // 等同于
  Utils.isString('yes')
}
```

上面示例中，`import`命令指定在命名空间`App`里面，外部成员`Utils.isString`的别名为`isString`。

`import`命令也可以在 namespace 外部，指定别名

```ts
import polygons = Shapes.Polygons

namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}

// 等同于 new Shapes.Polygons.Square()
let sq = new polygons.Square()
```

上面示例中，`import`命令在命名空间`Shapes`的外部，指定` Shapes.Polygons`的别名为`polygons`。

namespace 可以嵌套 :sassy_man:

```ts
namespace Utils {
  export namespace Messaging {
    export function log(msg: string) {
      console.log(msg)
    }
  }
}

Utils.Messaging.log('hello') // "hello"
```

上面示例中，命名空间`Utils`内部还有一个命名空间`Messaging`。注意，如果要在外部使用`Messaging`，必须在它前面加上`export`命令。

使用嵌套的命名空间，必须从最外层开始引用，比如`Utils.Messaging.log()`。

namespace 不仅可以包含实义代码，还可以包括类型代码。

```ts
namespace N {
  export interface MyInterface {}
  export class MyClass {}
}
```

上面代码中，命令空间`N`不仅对外输出类，还对外输出一个接口，它们都可以用作类型。

namespace 与模块的作用是一致的，都是把相关代码组织在一起，对外输出接口。区别是一个文件只能有一个模块，但可以有多个 namespace。由于模块可以取代 namespace，而且是 JavaScript 的标准语法，还不需要编译转换，所以建议总是使用模块，替代 namespace。

如果 namespace 代码放在一个单独的文件里，那么引入这个文件需要使用三斜杠的语法。

```ts
/// <reference path = "SomeFileName.ts" />
```

PS: 三斜杠指令是特殊注释，为编译器提供有关如何处理文件的说明。这些指令以三个连续斜杠 (`///`) 开头，通常放置在 TypeScript 文件的顶部，对运行时行为没有影响。

三斜杠指令用于引用外部依赖项、指定模块加载行为、启用/禁用某些编译器功能等等。
