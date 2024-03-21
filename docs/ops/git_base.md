---
title: Git 基础与概念
order: 1
group:
  order: 3
  title: Git 学习
---
# git 基础与概念

![image-20240318221806085](./git_base.assets/image-20240318221806085.png)



## git介绍

Git是目前世界上最先进的分布式版本控制系统，[git与svn的五个基本区别](https://www.cnblogs.com/specter45/p/github.html#gitandsvn)。它有以下特点：

分布式 : Git版本控制系统是一个分布式的系统, 是用来保存工程源代码历史状态的命令行工具;

保存点 : Git的保存点可以追踪源码中的文件, 并能得到某一个时间点上的整个工程项目额状态; 可以在该保存点将多人提交的源码合并, 也可以会退到某一个保存点上;

Git离线操作性 :Git可以离线进行代码提交, 因此它称得上是完全的分布式处理, Git所有的操作不需要在线进行; 这意味着Git的速度要比SVN等工具快得多, 因为SVN等工具需要在线时才能操作, 如果网络环境不好, 提交代码会变得非常缓慢;

Git基于快照 : SVN等老式版本控制工具是将提交点保存成补丁文件, Git提交是将提交点指向提交时的项目快照, 提交的东西包含一些元数据(作者, 日期, GPG等);

Git的分支和合并 : 分支模型是Git最显著的特点, 因为这改变了开发者的开发模式, SVN等版本控制工具将每个分支都要放在不同的目录中, Git可以在同一个目录中切换不同的分支；

分支即时性 : 创建和切换分支几乎是同时进行的, 用户可以上传一部分分支, 另外一部分分支可以隐藏在本地, 不必将所有的分支都上传到GitHub中去;

分支灵活性 : 用户可以随时 创建 合并 删除分支, 多人实现不同的功能, 可以创建多个分支进行开发, 之后进行分支合并, 这种方式使开发变得快速, 简单, 安全。

## 安装教程

官方下载地址：http://git-scm.com/download/ 

1，下载

![image-20240318222054268](./git_base.assets/image-20240318222054268.png)

2，配置

1）图标组件(Addition icons) : 选择是否创建快速启动栏图标 或者 是否创建桌面快捷方式;
2）桌面浏览(Windows Explorer integration) : 浏览源码的方法, 单独的上下文浏览 只使用bash 或者 只用Git GUI工具; 高级的上下文浏览方法 使用git-cheetah plugin插件;
3）关联配置文件(Associate .git*) : 是否关联git配置文件, 该配置文件主要显示文本编辑器的样式;
4）关联shell脚本文件(Associate .sh) : 是否关联Bash命令行执行的脚本文件;
5）使用TrueType编码 : 在命令行中是否使用TruthType编码, 该编码是微软和苹果公司制定的通用编码;

![image-20240318222104440](./git_base.assets/image-20240318222104440.png)

第五步：选择默认的编辑器，我们直接用推荐的就行，下一步

![image-20240318222113916](./git_base.assets/image-20240318222113916.png)

第六步：勾上第二项，这样就可以在cmd中操作，下一步

![image-20240318222123019](./git_base.assets/image-20240318222123019.png)

> （1）Git自带：使用Git自带的Git Bash命令行工具。
>
> （2）系统自带CMD：使用Windows系统的命令行工具。
>
> （3）二者都有：上面二者同时配置，但是注意，这样会将windows中的find.exe 和 sort.exe工具覆盖，如果不懂这些尽量不要选择。

第七步：使用默认设置就行，下一步：

![image-20240318222131415](./git_base.assets/image-20240318222131415.png)

第八步：配置行结束标记，保持默认“Checkout”

![image-20240318222139618](./git_base.assets/image-20240318222139618.png)

>（1）检查出windows格式转换为unix格式：将windows格式的换行转为unix格式的换行再进行提交。
>
>（2）检查出原来格式转为unix格式：不管什么格式的，一律转为unix格式的换行再进行提交。
>
>（3）不进行格式转换 : 不进行转换，检查出什么，就提交什么。

第九步：在终端模拟器选择页面，默认即可，配置后Git

![image-20240318222148952](./git_base.assets/image-20240318222148952.png)

第十步：最后配置Git额外选择默认即可，然后安装。

![image-20240318222156317](./git_base.assets/image-20240318222156317.png)

这里注意到是 Enable Git Credential Manager 是开启 manager 模式，在安装时会默认帮我们把 credential.helper 设置成 manager。详情参考下边的 credential.helper 配置篇。

## 登录

### ssh key创建公钥密钥

在我们选择 clone 文件时，会有 ssh 和 http 两个方式，其中 ssh 就需要配置公钥密钥。

![image-20240318222257151](./git_base.assets/image-20240318222257151.png)

1.检测是否创建

```
$ ssh -T git@github.com
```

> git@github.com: Permission denied (publickey).//没有创建

![image-20240318222455331](./git_base.assets/image-20240318222455331.png)

2.创建

```
$ ssh-keygen -t rsa -C "2805080748@qq.com"
```

> 1）是路径确认，直接按回车存默认路径即可
>
> 2）直接回车键，这里我们不使用密码进行登录, 用密码太麻烦;
>
> 3）直接回车键

生成成功后，去对应目录 C:\Users\specter\.ssh里（specter为电脑用户名，每个人不同）用记事本打开id_rsa.pub，得到ssh key公钥

![](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/git/872853-20160202191422975-805839228.png)

3.添加到 github

![872853-20160202191730225-1616073973](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/git/872853-20160202191730225-1616073973.png)

![](https://letwz-1258488629.cos.ap-chengdu.myqcloud.com/git/872853-20160202191810975-749785034.png)

如此，github账号的SSH keys配置完成。

### credential-helper 密码存储

在使用 http 链接时，每次都需要登录比较繁琐，git 中可以通过 **credential helper** 工具来完成**用户名密码存储**的。

查看存储方式

```bash
git config --global credential.helper
```

设置存储方式

```bash
git config --global credential.helper cache/store/manager-core
```

注意，存**储方式有**：

#### cache

**cache**：cache 将凭据在内存中进行短时间的缓存。使用的比较少。

#### store

**store**：store 通过明文的方式将用户名和密码保存到**用户目录**下，可以使用记事本直接打开：

![image-20240318224013479](./git_base.assets/image-20240318224013479.png)

文件中形式例如 `***\*https://username:password@gitee.com\****` 。

**可以设置读取 **.git-credentials 文件的位置。

```bash
git config --global credential.helper store --file=xxxxx
```

#### manager-core

**manager-core**：如果是 windows 机器，可以使用名为 windows 凭据的 **[credential helper]** 工具，这是一种windows 自带的密码管理器，非常适合存储git用户名和密码。如下图

![image-20240318224327436](./git_base.assets/image-20240318224327436.png)

如果想以这种方式存储 git 的用户名和密码，就需要使用 **cmd 命令**了

```bash
# 删除某个windows凭据
cmdkey /delete:git:https://gitee.com
# 添加某个windows凭据
cmdkey /generic:git:http://gitee.com /user:%username% /password:%password%
```

当设置好 credential-helper 后就不需要执行 push、clone 等命令时多次登录了。

## 存储原理

工作步骤示意图

![](./git_base.assets/bg2015120901.png)

- Workspace：工作区
- Index / Stage：暂存区
- Repository：仓库区（或本地仓库）
- Remote：远程仓库

## 分支相关规范

### git分支切换\创建\规范

![image-20240318223102091](./git_base.assets/image-20240318223102091.png)

- Production 分支

也就是我们经常使用的Master分支，这个分支最近发布到生产环境的代码，最近发布的Release， 这个分支只能从其他分支合并，不能在这个分支直接修改

- Develop 分支

这个分支是我们是我们的主开发分支，包含所有要发布到下一个Release的代码，这个主要合并与其他分支，比如Feature分支

- Feature 分支

这个分支主要是用来开发一个新的功能，一旦开发完成，我们合并回Develop分支进入下一个Release

- Release分支

当你需要一个发布一个新Release的时候，我们基于Develop分支创建一个Release分支，完成Release后，我们合并到Master和Develop分支

- Hotfix分支

当我们在Production发现新的Bug时候，我们需要创建一个Hotfix, 完成Hotfix后，我们合并回Master和Develop分支，所以Hotfix的改动会进入下一个Release

### 提交命名规约

除了分支的名称需要规范，提交的命名也同样如此。猪齿鱼并没有把这个规则固化到系统中，需要团队共同遵守。

格式为：[操作类型]操作对象名称，如[ADD]readme，代表增加了readme描述文件。

常见的操作类型有：

- [IMP] 提升改善正在开发或者已经实现的功能
- [FIX] 修正BUG
- [REF] 重构一个功能，对功能重写
- [ADD] 添加实现新功能
- [REM] 删除不需要的文件

