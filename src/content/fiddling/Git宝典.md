---
title: Git宝典
published: 2024-04-11T00:31:43.000Z
description: ''
updated: ''
tags: ['工具']
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

# Git宝典

其实这次mini对我自身来说 学到了很多 技术这里就先不说了 终于意识到了git在多人协作写一个大项目的重要性 :satisfied:

### 啥是Git

我对`Git`这个东西的理解就是 在进行大型项目的开发时候 你不可能单兵作战 一般是有好多好多人一起的 这个时候怎么进行每个人之间的汇总勒

这个时候 就要用到`Git`了

说点官方的话术就是:unamused:

Git 是一个开源的分布式版本控制系统，用于敏捷高效地处理项目

### Git是怎么工作的呢:question:

如图

<img src="https://www.ruanyifeng.com/blogimg/asset/2015/bg2015120901.png" alt="img" />

具体都是什么意思勒

- Workspace：工作区 (就是你电脑能看到的)
- Index / Stage：暂存区 (一般是在.`git`目录下的`index`文件下)
- Repository：仓库区（或本地仓库）
- Remote：远程仓库

### Git咋使用呢

#### 1.第一步肯定是新建Git库喽 :new:

有两种方法

:one:直接新建!

```shell
git init
```

:two:克隆下来一个已经存在的库

```shell
git clone "url"
```

#### 2.基本操作

该说不说这玩意真多啊:rage:

| `git add`    | `添加文件到暂存区`                        |
| ------------ | ----------------------------------------- |
| `git status` | `查看仓库当前的状态 显示有变更的文件`     |
| `git commit` | `提交暂存区到本地仓库`                    |
| `git mv`     | `移动或重命名工作区文件`                  |
| `git log`    | `查看历史提交记录`                        |
| `git blame`  | `以列表形式查看指定文件的历史修改记录`    |
| `git remote` | `远程仓库操作`                            |
| `git fetch`  | `从远程获取代码库`                        |
| `git pull`   | `下载远程代码并合并`                      |
| `git push`   | `上传远程代码并合并 添加文件到本地暂存区` |

- 添加文件到暂存区

  ```shell
  git add 文件名 //这样是添加某个问价
  git add . //添加该目录下所有未被忽略的文件
  ```

  Tips:一般都忽略什么呢?:thinking:

  一般都会忽略你的node_modules文件夹 因为依赖太多多多多了

- 提交更改到本地仓库

  ```shell
  git commit -m "说明"
  ```

  这个说明也是有规范滴

  ```shell
  feat - 新功能 feature
  fix - 修复 bug
  docs - 文档注释
  style - 代码格式(不影响代码运行的变动)
  refactor - 重构、优化(既不增加新功能，也不是修复bug)
  perf - 性能优化
  test - 增加测试
  chore - 构建过程或辅助工具的变动
  revert - 回退
  build - 打包
  ```

  就像

<img src="https://img2.imgtp.com/2024/04/13/LVOmRtNs.png" alt="git commit规范.png" />

这样写commit的话 就能非常清楚的看到你每次提交了一些什么

- 分支管理

  创建分支

  ```shell
  git branch (分支名)
  ```

  切换分支

  ```shell
  git checkout (分支名)
  ```

  创建新的分支并且立即切换到该分支

  ```shell
  git checkout -b (分支名)
  ```

  合并分支

  ```shell
  git merge
  ```

  列出分支

  ```shell
  //列出本地分支
  git branch
  //列出全部分支(包括远程分支)
  git branch -a
  ```

  删除分支

  ```shell
  git branch -d (分支名)
  ```

### 多人协作

在进行一个大型项目的时候 该怎么使用Git呢

就是刘总经常说的提PR了 :anguished:

怎么提呢

首先你需要找到你用的大型项目仓库

然后fork!!!!!!!!!!!

<img src="https://img2.imgtp.com/2024/04/13/6LtBRn7z.png" alt="fork.png" />

然后回到你自己仓库

就能看到你的本地仓库了

<img src="https://img2.imgtp.com/2024/04/13/OnfI0lWy.png" alt="本地仓库.png" />

怎么提PR勒 :thinking:

点击你本地Contribute按钮 然后Open Pull Request

<img src="https://img2.imgtp.com/2024/04/13/NuoY09og.png" alt="pr.png" />

就可以跟本地一样写说明喽 标准也是跟commit的标准差不多的

小小小Tips:

在执行`git push`之前，为了防止远程仓库已有其他人提交的更改与你的更改产生冲突，要先执行`git pull`拉取远程仓库的代码，如果显示确有冲突，就要在本地手动更改冲突，可利用ide解决。 如果没有冲突，就可以直接推送。如果有冲突，解决冲突后重新执行`git add和git commit` ，再推送到远程仓库

就像

<img src="https://img2.imgtp.com/2024/04/13/xIbOddt2.png" alt="git 手动操作.png" />

基本上Git常用的就这些勒 好像博客也可以用Github Actions自动部署 以后有时间试试

:smile_cat:
