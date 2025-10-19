---
title: eslint
published: 2024-08-04T17:04:23.000Z
description: ''
updated: ''
tags: []
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

# eslint小妙招:sake:

# 1. 基本使用

1. 项目安装eslint：`yarn add eslint -D`；
2. 初始化eslint配置：eslint --init；
3. 检测eslint：运行eslint；

## 1.1 基本参数

eslint配置参数的方式有两种，一种是通过配置文件，一种是通过命令行；配置文件的参数不一定包含命令行的，为了方便查看和使用，**推荐优先在配置中配置**；

### 1.1.1 .eslintrc参数

详情请查看[eslint.org/docs/user-g…](https://link.juejin.cn?target=https%3A%2F%2Feslint.org%2Fdocs%2Fuser-guide%2Fconfiguring%2Fconfiguration-files%23configuration-file-formats)；

```javascript
javascript

代码解读
复制代码module.exports = {
  // 若项目中有多个子项目，且每个项目都会有.eslintrc，子项目会一直向上查找所有的.eslintrc，直到找到root:true的eslintrc，再将所有的.eslintrc合并
  root: true,
  // 对环境定义的一组全局变量的预设 详细看：https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments
  env: {
    // 浏览器全局变量
    browser: true,
    // Node.js 全局变量和作用域
    node: true,
    // CommonJS全局变量和CommonJS作用域
    commonjs: true,
    // 启用除模块之外的所有ECMAScript 6功能
    es6: true
  },
  // 将数据提供给每一个将被执行的规则
  settings: {
    sharedData: 'Hello'
  },
  // 继承另一个配置文件的所有特性
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  // 插件，向ESLint添加各种扩展，可以定义规则，环境或配置的第三方模块
  plugins: [
    '@typescript-eslint'
  ],
  // 全局变量
  globals: {
    // false、readable、readonly 这 3 个是等价的，表示变量只可读不可写；
    // true、writeable、writable 这 3 个是等价的，表示变量可读可写；
    $: true,
    console: false
  },
  // 解释器
  parser: '@typescript-eslint/parser',
  // 解释器的配置
  parserOptions: {
    // 代码模块类型，可选script(默认)，module
    sourceType: 'module',
    // 指定ECMAScript版本，默认为5
    ecamVersion: 6,
    // 额外的语言特性，所有选项默认都是 false
    ecmaFeatures: {
      // 是否允许 return 语句出现在 global 环境下
      globalReturn: true,
      // 是否开启全局 script 模式
      impliedStrict: true,
      // 是否启用 JSX
      jsx: true,
      // 是否启用对实验性的objectRest/spreadProperties的支持
      experimentalObjectRestSpread: false
    }
  },
  // 规则
  rules: {
    // 禁止使用 alert
    'no-alert': 'off',
    // 逗号前面没有空格 后面有空格
    'comma-spacing': [2, {
      before: false,
      after: true
    }],
  }
}
```

### 1.1.2 命令行参数

详情请查看[eslint.cn/docs/user-g…](https://link.juejin.cn?target=http%3A%2F%2Feslint.cn%2Fdocs%2Fuser-guide%2Fcommand-line-interface)；

```lua
lua

 代码解读
复制代码eslint [options] file.js [file.js] [dir]

Basic configuration:
  --no-eslintrc                  禁止使用配置文件.eslintrc.*
  -c, --config path::String      指定使用.eslintrc.*配置文件的路径（可以不是这个名字）
  --env [String]                 指定环境
  --ext [String]                 指定JavaScript文件扩展名，默认值：.js
  --global [String]              定义全局变量
  --parser String                指定解析器
  --parser-options Object        指定解析器配置
  --resolve-plugins-relative-to path::String  应该从中解析插件的文件夹，默认为CWD

Specifying rules and plugins:
  --rulesdir [path::String]      使用其他规则的目录
  --plugin [String]              指定插件
  --rule Object                  指定规则

Fixing problems:
  --fix                          自定修复eslint问题
  --fix-dry-run                  自动修复问题但不保存对文件的更改
  --fix-type Array               指定要应用的修复类型（问题、建议、布局）

Ignoring files:
  --ignore-path path::String     指定忽略的路径 即指定一个文件作为.eslintignore
  --no-ignore                    禁用忽略文件和模式的使用
  --ignore-pattern [String]      要忽略的文件模式（除了.eslintignore中的文件）

Using stdin:
  --stdin                        <STDIN>上提供的Lint代码-默认值：false
  --stdin-filename String        指定STDIN的文件名

Handling warnings:
  --quiet                        仅报告错误-默认值：false
  --max-warnings Int             触发退出代码的警告次数-默认值：-1

Output:
  -o, --output-file path::String  指定要将报告写入的文件
  -f, --format String            使用特定的输出格式-默认值：stylish
  --color, --no-color            强制启用/禁用颜色

Inline configuration comments:
  --no-inline-config             防止注释更改配置或规则
  --report-unused-disable-directives  添加错误信息给未被使用的eslint-disable指令

Caching:
  --cache                        仅检查已更改的文件-默认值：false
  --cache-file path::String      缓存文件的路径，不推荐使用：使用--cache-location - 默认值：.eslintcache
  --cache-location path::String  缓存文件或目录的路径

Miscellaneous:
  --init                         运行配置初始化向导-默认值：false
  --debug                        输出调试信息
  -h, --help                     显示help文档
  -v, --version                  输出版本号
  --print-config path::String    打印给定文件的配置
```

## 2.2 常用参数概念补充

### 2.2.1 解析器

1. esprima：eslint早期使用的解析器；
2. espree：基于esprema v1.2.2开发，现在默认的解析器；
3. @babel/eslint-parser：js高级语法的解析器；
4. @typescript-eslint/parser：ts的解析器；

### 2.2.2 规则配置

1. "off" 或 0： 关闭规则；
2. "warn" 或 1： 开启规则，使用警告级别的错误：warn (不会导致程序退出)；
3. "error" 或 2： 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)；

### 2.2.3 extends支持的配置类型

1. eslint开头：ESLint官方扩展；
2. plugin开头：插件类型扩展；和configs里面配置的一一对应；
3. eslint-config开头：npm包，使用时可省略前缀eslint-config-；
4. 文件路径；

**常用扩展：**

1. eslint:recommended：ESLint内置的推荐规则，即 ESLint Rules 列表中打了钩的那些规则；
2. eslint:all：ESLint 内置的所有规则；
3. eslint-config-standard：standard 的 JS 规范；
4. eslint-config-prettier：关闭和 ESLint 中以及其他扩展中有冲突的规则；
5. eslint-plugin-vue：vue官方eslint配置插件，配置共享有：
   1. plugin:vue/base：基础；
   2. plugin:vue/essential：必不可少的；
   3. plugin:vue/recommended：推荐的；
   4. plugin:vue/strongly-recommended：强烈推荐；

## 2.3 配置不需要lint的文件或目录

可以在.eslintignore中指定对应的文件或目录，以达到eslint执行时不检测（eslint本身是忽略node_modules和bower_components的）；如：

```lua
lua

 代码解读
复制代码mock
build/*.js
config/*.js
```

##  ESLint配置共享

每个团队的规范是不一样的，公司内部希望每个产品线的规范一致，那么可以将配置分享出来打成npm包，以供不同团队直接配置使用；

**如何写一个配置共享？**

1. 创建一个文件夹，名称为eslint-config-myconfig；
2. 执行`yarn init -y`；（模块名必须以eslint-config-开头，项目文件名称随意）；
3. 创建index.js，里面写入需要分享的.eslintrc.js的配置；
4. 用 [peerDependencies](https://link.juejin.cn?target=https%3A%2F%2Fdocs.npmjs.com%2Ffiles%2Fpackage.json%23peerdependencies) 字段声明依赖的 ESLint（明确插件需要 ESLint 才能正常运行）；
5. 发包即可；

**PS**：发包形式写插件都支持@scope/eslint-xxx-xxx形式，[详情](https://link.juejin.cn?target=https%3A%2F%2Fdocs.npmjs.com%2Fcli%2Fv7%2Fusing-npm%2Fscope%2F)；

**如何使用上面的包？**

1. 安装包，如： `yarn add eslint-config-myconfig -D`；
2. 在项目中的.eslintrc中配置extends配置，具体查看基本使用；

# 2 [ESLint插件](https://link.juejin.cn?target=http%3A%2F%2Feslint.cn%2Fdocs%2Fdeveloper-guide%2Fworking-with-plugins)

## 2.1 ESLint插件是什么？

插件可向ESLint添加各种扩展，是可定义规则，环境、处理器或配置的第三方模块；

**如何自定义一个ESLint插件？**

使用[generator-eslint](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fgenerator-eslint)创建一个项目，该项目的模块名需以eslint-plugin-开头，使用的时候，则是去掉eslint-plugin-；

如npm包名：eslint-plugin-myplugin；

### 2.1.1 定义规则

规则：eslint检测的规则方式；
 定义方式：规定必须暴露一个rules对象；

```javascript
javascript

代码解读
复制代码// 这是插件的index.js
module.exports = {
  rules: {
    'my-rule': {
      // 规则的一些数据配置
      meta: {
        // 规则的类型 "problem"、"suggestion" 或 "layout"
        type: 'suggestion',
        // 文档信息 自定义规则或插件中可省略，对eslint核心规则是必须的
        docs: {
          description: '规则的简短描述，在eslint规则首页展示',
          category: '规则在规则首页处于的分类',
          recommended: true, // "extends": "eslint:recommended"属性是否启用该规则
          url: 'https://eslint.org/docs/rules/no-extra-semi' // 访问完整文档的 url
        },
        // 打开修复功能，如果没有 fixable 属性，即使规则实现了 fix 功能，ESLint 也不会进行修复。如果规则不是可修复的，就省略 fixable 属性
        fixable: 'code',
        // 指定该规则对应的配置，用于验证配置的选项是否有效
        schema: [
          {
            enum: ['always', 'never']
          },
          {
            type: 'object',
            properties: {
              exceptRange: {
                type: 'boolean'
              }
            },
            additionalProperties: false
          }
        ]
      },
      // create 返回一个对象，对象的格式是key对应一个回调方法；这个对象包含了ESLint在遍历JavaScript代码的AST树(ESTree定义的AST)时，用来访问节点的方法。
      // context 当前执行eslint时的上下文对象，其中包含了各种相关数据，如eslint的配置信息、当前遍历节点的信息、报告问题的方法等；
      create(context) {
        return {
          // callback functions
          'ReturnStatement': function (node) {
            // at a ReturnStatement node while going down
          },
          // at a function expression node while going up:
          'FunctionExpression:exit': function checkLastSegment(node) {
            // report problem for function if last code path segment is reachable
          },
          'ArrowFunctionExpression:exit': function checkLastSegment(node) {
            // report problem for function if last code path segment is reachable
          },
          'onCodePathStart': function (codePath, node) {
            // at the start of analyzing a code path
          },
          'onCodePathEnd': function (codePath, node) {
            // at the end of analyzing a code path
          }
        }
      }
    }
  }
}
```

使用方式：

```javascript
javascript

代码解读
复制代码module.exports = {
  plugins: ['myplugin'],
  rules: {
    'myplugin/my-rule': [2, 'never', { exceptRange: true }],
  }
}
```

#### 2.1.1.1 rules的参数

rules的meta参数是填写一些基本信息，create参数中的value是用于执行检测AST规则的回调方法；

**create的context参数：**

1. id：在.eslintrc的rules中配置的规则名称，如上面使用方式中的`myplugin/my-rule`；
2. options：在.eslintrc的rules中配置的规则参数，如上面例子的结果是：["never", {exceptRange: true}]
3. report：用于发布警告或错误的，在回调中判断调用；[具体参数](https://link.juejin.cn?target=http%3A%2F%2Feslint.cn%2Fdocs%2Fdeveloper-guide%2Fworking-with-rules%23contextreport)；

**create的return对象：**

- 如果一个 key 是个节点类型或 selector，在 **向下** 遍历树时，ESLint 调用 **visitor** 函数；
- 如果一个 key 是个节点类型或 selector，并带有 **:exit**，在 **向上** 遍历树时，ESLint 调用 **visitor** 函数；
- 如果一个 key 是个事件名字，ESLint 为[代码路径分析](https://link.juejin.cn?target=http%3A%2F%2Feslint.cn%2Fdocs%2Fdeveloper-guide%2Fcode-path-analysis)调用 **handler** 函数；

**节点类型：** AST的节点类型；

具体如下：

| 序号 | 类型原名称           | 中文名称      | 描述                                                  |
| ---- | -------------------- | ------------- | ----------------------------------------------------- |
| 1    | Program              | 程序主体      | 整段代码的主体                                        |
| 2    | VariableDeclaration  | 变量声明      | 声明一个变量，例如 var let const                      |
| 3    | FunctionDeclaration  | 函数声明      | 声明一个函数，例如 function                           |
| 4    | ExpressionStatement  | 表达式语句    | 通常是调用一个函数，例如 console.log()                |
| 5    | BlockStatement       | 块语句        | 包裹在 {} 块内的代码，例如 if (condition){var a = 1;} |
| 6    | BreakStatement       | 中断语句      | 通常指 break                                          |
| 7    | ContinueStatement    | 持续语句      | 通常指 continue                                       |
| 8    | ReturnStatement      | 返回语句      | 通常指 return                                         |
| 9    | SwitchStatement      | Switch 语句   | 通常指 Switch Case 语句中的 Switch                    |
| 10   | IfStatement          | If 控制流语句 | 控制流语句，通常指 if(condition){}else{}              |
| 11   | Identifier           | 标识符        | 标识，例如声明变量时 var identi = 5 中的 identi       |
| 12   | CallExpression       | 调用表达式    | 通常指调用一个函数，例如 console.log()                |
| 13   | BinaryExpression     | 二进制表达式  | 通常指运算，例如 1+2                                  |
| 14   | MemberExpression     | 成员表达式    | 通常指调用对象的成员，例如 console 对象的 log 成员    |
| 15   | ArrayExpression      | 数组表达式    | 通常指一个数组，例如 [1, 3, 5]                        |
| 16   | NewExpression        | New 表达式    | 通常指使用 New 关键词                                 |
| 17   | AssignmentExpression | 赋值表达式    | 通常指将函数的返回值赋值给变量                        |
| 18   | UpdateExpression     | 更新表达式    | 通常指更新成员值，例如 i++                            |
| 19   | Literal              | 字面量        | 字面量                                                |
| 20   | BooleanLiteral       | 布尔型字面量  | 布尔值，例如 true false                               |
| 21   | NumericLiteral       | 数字型字面量  | 数字，例如 100                                        |
| 22   | StringLiteral        | 字符型字面量  | 字符串，例如 vansenb                                  |
| 23   | SwitchCase           | Case 语句     | 通常指 Switch 语句中的 Case                           |

可以顺便看下vue的节点类型：[github.com/vuejs/vue-e…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-eslint-parser%2Fblob%2Fmaster%2Fsrc%2Fast%2Fnodes.ts)

**选择器（selector）** ：是一个字符串，可用于匹配抽象语法树(AST)中的节点。这对于描述代码中的特定语法模式非常有用。选择器不限于对单个节点类型进行匹配。例如，选择器"VariableDeclarator > Identifier"将匹配所有具有VariableDeclarator的Identifier。[详情](https://link.juejin.cn?target=http%3A%2F%2Feslint.cn%2Fdocs%2Fdeveloper-guide%2Fselectors)；

**事件**：分析代码路径所触发的事件；

```javascript
javascript

代码解读
复制代码module.exports = function (context) {
  return {
    /**
     * 这在分析代码路径的开始时被调用，此时，代码路径对象只有初始段。
     *
     * @param {CodePath} codePath - The new code path.
     * @param {ASTNode} node - The current node.
     * @returns {void}
     */
    onCodePathStart(codePath, node) {
      // do something with codePath
    },

    /**
     * 这在分析代码路径的末尾被调用。此时，代码路径对象已经完成。
     *
     * @param {CodePath} codePath - The completed code path.
     * @param {ASTNode} node - The current node.
     * @returns {void}
     */
    onCodePathEnd(codePath, node) {
      // do something with codePath
    },

    /**
     * 这在创建代码路径段时调用。
     * 这意味着代码路径是分叉或合并的。
     * 在这段时间内，该段具有先前的段，并且已被判断为可到达或不可到达。
     *
     * @param {CodePathSegment} segment - The new code path segment.
     * @param {ASTNode} node - The current node.
     * @returns {void}
     */
    onCodePathSegmentStart(segment, node) {
      // do something with segment
    },

    /**
     * 这是在代码路径段离开时调用的。
     * 此时还没进入下个阶段。
     *
     * @param {CodePathSegment} segment - The leaved code path segment.
     * @param {ASTNode} node - The current node.
     * @returns {void}
     */
    onCodePathSegmentEnd(segment, node) {
      // do something with segment
    },

    /**
     * 在代码路径段被循环时调用的。
     * 通常每段在创建时都有以前的段，
     * Usually segments have each previous segments when created,
     * but when looped, a segment is added as a new previous segment into a
     * existing segment.
     *
     * This is called when a code path segment was looped.Usually segments have each previous segments when created,but when looped, a segment is added as a new previous segment into aexisting segment.
     *
     * 当循环代码路径段时调用此函数。通常创建段时，段具有每个先前段，但循环时，段作为新的先前段添加到现有段中。
     * @param {CodePathSegment} fromSegment - A code path segment of source.
     * @param {CodePathSegment} toSegment - A code path segment of destination.
     * @param {ASTNode} node - The current node.
     * @returns {void}
     */
    onCodePathSegmentLoop(fromSegment, toSegment, node) {
      // do something with segment
    }
  }
}
```

[eslint.cn/docs/develo…](https://link.juejin.cn?target=http%3A%2F%2Feslint.cn%2Fdocs%2Fdeveloper-guide%2Fcode-path-analysis)

### 2.1.2 定义环境

环境：就是某一组配置，比如jquery里面所有的全局变量；

插件的环境可定义以下对象：
 **globals：** 同配置文件中的globals一样。
 **parserOptions：** 同配置文件中的parserOptions一样。

定义方式：必须暴露environments对象；

```javascript
javascript

代码解读
复制代码// 这是插件的index.js
module.exports = {
  environments: {
    jquery: {
      globals: {
        $: false
      },
      parserOptions: {
      }
    }
  }
}
```

使用方式：

```javascript
javascript

代码解读
复制代码module.exports = {
  plugins: ['myplugin'],
  env: {
    'myplugin/jquery': true,
  }
}
```

### 2.1.3 定义处理器

eslint只能检测js，如果是其他文件则需要配置自定义处理器；
 定义方式：必须暴露processors，以文件后缀为key，包含以文件内容和文件名作为参数的函数，并返回一个要检测的字符串数组；

```javascript
javascript

代码解读
复制代码// 这是插件的index.js
// processor-name
module.exports = {
  processors: {

    // 不同后缀名 (.js, .jsx, .html, etc.)
    '.ext': {
      // 获取文件的文本和文件名
      preprocess(text, filename) {
        // 在这里，您可以去掉任何非JS内容，并将其拆分为多个字符串以进行lint
        return [string] // return an array of strings to lint
      },

      // 获取Message[][]和文件名
      postprocess(messages, filename) {
        // `messages`参数是一个包含消息对象的二维数组，其中每个数组项的第一个参数包含了preprocess()方法返回的文本相关的lint消息数组
        // postprocess 方法接受一个二维数组，包含检测消息和文件名。输入数组中的每一项都对应从 preprocess 方法返回的部分。preprocess 方法必须调整所有错误的位置，使其与原始的未处理的代码中的位置相对应，并将它们聚合成一个打平的数组并返回。
        // 返回你想保留的一维数组
        return messages[0]
      },

      supportsAutofix: true // (optional, defaults to false)
    }
  }
}
```

使用方式：

```javascript
javascript

 代码解读
复制代码// 方式一：统一
module.exports = {
  	"plugins": ["myplugin"],
  	"processor": "myplugin/processor-name"
}
// 方式二：为特定类型的文件指定处理器
module.exports = {
  	"plugins": ["myplugin"],
  	"overrides": [
        {
            "files": ["*.md"],
            "processor": "a-plugin/markdown"
        },
        {// 在 config 部分为命名代码块指定其他配置
            "files": ["**/*.md/*.js"],
            "rules": {
                "strict": "off"
            }
        }
    ]

```

#  工程化最佳使用方案

项目的工程化可以提升开发效率，减少一些容易避免的错误；下面推荐一些和eslint搭配的好用的工具：

有时间找个项目试试水:smiley:

1. [husky](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fhusky)：commit之前执行eslint命令，如果eslint没过，则commit失败；

2. [lint-staged](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Flint-staged)：跑husky的hooks只针对拿到的staged文件；

3. [prettier](https://link.juejin.cn?target=https%3A%2F%2Fprettier.io%2F)：修改代码风格，只管代码风格，不管一些低级问题；如果有一些配置和eslint冲突了，可以配合[eslint-plugin-prettier](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Feslint-plugin-prettier)和eslint一起使用；
