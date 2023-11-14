---
title: snapshot 缓存
nav: webpack
group:
  title: 其他属性
  order: 2
order: 2
---
# snapshot

主要用于优化性能。

当你运行Webpack构建时，Webpack要做的其中一个任务是**检查模块和文件之间的依赖关系**。

为了避免在每次构建时重新计算这些依赖关系，Webpack提供了"snapshot"特性来**捕获**关于**模块、文件**或其他任何事物的某种**状态**。在后续的构建中，它可以**检查**这些**快照**是否有任何**变化**，从而决定是否需要**重新计算**某些事物。

```js
module.exports = {
  // ...其他配置
  snapshot: {
    managedPaths: [path.resolve(__dirname, 'node_modules')], // 默认包括 node_modules
    immutablePaths: [], // 你认为不会改变的路径
    buildDependencies: {
      hash: true,  // 启用/禁用对构建依赖的快照处理
      timestamp: true,  // 启用/禁用对构建依赖的时间戳处理
    },
    module: {
      hash: true, // 启用/禁用对模块的快照处理
      timestamp: true, // 启用/禁用对模块的时间戳处理
    },
    resolve: {
      hash: true, // 启用/禁用对解析的快照处理
      timestamp: true, // 启用/禁用对解析的时间戳处理
    }
  }
};
```

## buildDependencies

用于**捕获和比较构建依赖**（例如webpack配置和加载器）的**状态**。从而直到那些文件修改。

```js
snapshot.buildDependencies = { timestamp: true, hash: true }
```

`hash`和`timestamp`允许Webpack通过不同的方式比较构建依赖的状态。

使用**哈希比较内容**，使用**时间戳比较最后修改时间**。如果文件系统支持高分辨率时间戳（大多数现代文件系统都支持），那么时间戳通常会更快。

- `{ hash: true }`：对 CI 缓存很有帮助，使用新的 checkout，不需要保存时间戳，并且使用哈希。
- `{ timestamp: true }`：对应本地开发缓存很用帮助。
- `{ timestamp: true, hash: true }`：对于以上提到的两者都很有帮助。首先比较时间戳，这代价很低，因为 webpack 不需要读取文件来计算它们的哈希值。仅当时间戳相同时才会比较内容哈希，这对初始构建的性能影响很小。

## immutablePaths

它是为了优化构建性能的特性之一。

此特性允许你明确**指定某些路径**下的文件或**模块**是**不变**的，从而Webpack可以**跳过**对这些路径的**检查**，提高构建的速度。

```js
F(snapshot, "immutablePaths", () =>
    process.versions.pnp === "3"
        ? [/^(.+?[\\/]cache[\\/][^\\/]+\.zip[\\/]node_modules[\\/])/]
        : []
);
```

## managedPaths

主要目的是用于优化构建性能。此属性告诉 Webpack 哪些**目录**是由**包管理器**（如 `npm` 或 `yarn`）**管理的**，因此Webpack可以进行特定的优化操作。

```js
F(snapshot, "managedPaths", () =>
    process.versions.pnp === "3"
        ? [
                /^(.+?(?:[\\/]\.yarn[\\/]unplugged[\\/][^\\/]+)?[\\/]node_modules[\\/])/
          ]
        : [/^(.+?[\\/]node_modules[\\/])/]
);
```

## module

```
object = {hash boolean = true, timestamp boolean = true}
```

构建模块的快照。

- `hash`：比较内容哈希以判断无效。（比 `timestamp` 更昂贵，但更改的频率较低）。
- `timestamp`：比较时间戳以确定无效。

## resolve

```
object = {hash boolean = true, timestamp boolean = true}
```

解析请求的快照。

- `hash`：比较内容哈希以判断无效。（比 `timestamp` 更昂贵，但更改的频率较低）。
- `timestamp`：比较时间戳以确定无效。

## resolveBuildDependencies

```
object = {hash boolean = true, timestamp boolean = true}
```

使用持久缓存时用于解析构建依赖项的快照。

- `hash`：比较内容哈希以判断无效。（比 `timestamp` 更昂贵，但更改的频率较低）。
- `timestamp`：比较时间戳以确定无效。

# Q&A

## docuker中构建前端项目，如何让webpack的snapshot选项生效

在Docker容器环境中使用Webpack的`snapshot`功能可能会遇到一些特殊的问题，尤其是与文件系统相关的问题。以下是一些建议和步骤，帮助你确保Webpack的`snapshot`选项在Docker中正常工作：

1. **确保文件系统兼容性**：

   `snapshot`功能中的`timestamp`选项依赖于文件系统的时间戳。但是，某些Docker存储驱动程序或共享文件系统可能不提供高精度的时间戳。这可能会影响到`snapshot`功能的效果。在这种情况下，考虑使用`hash`选项而不是`timestamp`。

2. **使用卷(Volumes)来持久化数据**：

   如果你希望在连续的Docker容器启动之间保留Webpack的`snapshot`状态，应该使用Docker卷来持久化你的项目目录。这样，即使容器被删除和重建，Webpack的缓存和快照数据也会被保留。

   ```
   dockerfileCopy code
   VOLUME [ "/app/node_modules" ]
   ```

   当运行容器时，可以挂载一个卷到该路径：

   ```
   bashCopy code
   docker run -v your_volume_name:/app/node_modules your_image_name
   ```

3. **配置Webpack**：

   确保你的`webpack.config.js`中已经设置了`snapshot`选项：

   ```
   javascriptCopy codemodule.exports = {
     // ...其他配置
     snapshot: {
       buildDependencies: {
         hash: true,
         timestamp: true
       },
       // ...其他snapshot选项
     }
   };
   ```

4. **优化Docker构建**：

   如果你在Dockerfile中安装了依赖并构建项目，考虑利用Docker的缓存机制。首先复制`package.json`和`package-lock.json`，然后运行`npm install`，这样只有当这些文件发生变化时Docker才会重新安装依赖。

   ```
   dockerfileCopy codeCOPY package*.json ./
   RUN npm install
   COPY . .
   ```

## managedPaths  和 immutablePaths区别是什么，他们不都是判断文件是否修改吗

是的，`managedPaths` 和 `immutablePaths` 都是 Webpack 的配置选项，它们都关系到决定文件或模块是否在连续构建中发生了变化。但它们的侧重点和使用场景是有所不同的。以下是它们之间的主要区别：

1. **目的**：
   - `managedPaths`: 主要用于告诉 Webpack 哪些路径是由包管理器（如 npm 或 yarn）管理的。这意味着这些路径下的内容很可能在项目的常规开发过程中不会发生变化，除非进行了明确的包更新操作。默认情况下，这通常是 `node_modules`。
   - `immutablePaths`: 用于指定哪些文件或目录是完全不变的，即它们不会在任何情况下被更改。这可以是某些特定的库、已编译的资产或任何其他你确定永远不会更改的文件。
2. **应用场景**：
   - `managedPaths`: 通常用于 `node_modules` 或其他包管理目录，其中的文件可能会因为包的更新而发生变化，但在项目的常规开发过程中不太可能更改。
   - `immutablePaths`: 适用于那些你确定永远不会更改的文件或目录，例如某些已经被编译并压缩的第三方库。
3. **灵活性和风险**：
   - `managedPaths`: 相对较为安全，因为它基于的假设是，在项目的常规开发过程中，我们不直接修改包管理器管理的文件。但如果进行了包的更新操作，你可能需要重启 Webpack 或清除其缓存。
   - `immutablePaths`: 需要更多的谨慎。只有当你绝对、完全确定某个文件或目录不会发生任何变化时，才应该使用这个选项。如果这些文件发生了变化，但由于配置而没有被 Webpack 重新处理，可能会导致不可预见的构建问题。
