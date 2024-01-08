---
title: enhanced-resolve
nav: webpack
group:
  title: 基础
  order: 0
order: 1.5
---
# enhanced-resolve
enhanced-resolve 提供了一个异步的 require.resolve 函数，具有高度可配置性。

## 特性

- **插件系统**
- 提供**自定义文件系统**
- 包含**同步和异步**的 Node.js **文件系统**

## 入门

### 安装

```sh
# 使用 npm 安装
npm install enhanced-resolve
# 或者使用 Yarn 安装
yarn add enhanced-resolve
# 测试
yarn test
```

### 直接使用

有一个 Node.js API，允许根据 Node.js 解析规则解析请求。
提供同步和异步的 API。`create` 方法允许创建一个自定义解析函数。

```js
const resolve = require("enhanced-resolve");

resolve("/some/path/to/folder", "module/dir", (err, result) => {
	result; // === "/some/path/node_modules/module/dir/index.js"
});

resolve.sync("/some/path/to/folder", "../../dir");
// === "/some/path/dir/index.js"

const myResolve = resolve.create({
	// 或者使用 resolve.create.sync
	extensions: [".ts", ".js"]
	// 查看下面更多的选项
});

myResolve("/some/path/to/folder", "ts-module", (err, result) => {
	result; // === "/some/node_modules/ts-module/index.ts"
});
```

### 创建一个解析器

创建解析器的最简单方法是使用 `ResolveFactory` 上的 `createResolver` 函数，以及提供的文件系统实现之一。

```js
const fs = require("fs");
const { CachedInputFileSystem, ResolverFactory } = require("enhanced-resolve");

// 创建一个解析器
const myResolver = ResolverFactory.createResolver({
	// 典型的用法将消耗 `fs` + `CachedInputFileSystem`，它包装了 Node.js `fs` 来添加缓存。
	fileSystem: new CachedInputFileSystem(fs, 4000),
	extensions: [".js", ".json"]
	/* 这里还有其他解析器选项。可以在下面看到选项/默认值 */
});

// 使用新的解析器解析一个文件
const context = {};
const resolveContext = {};
const lookupStartPath = "/Users/webpack/some/root/dir";
const request = "./path/to-look-up.js";
myResolver.resolve({}, lookupStartPath, request, resolveContext, (
	err /*Error*/,
	filepath /*string*/
) => {
	// 对路径进行处理
});
```

### 属性一些规则

#### alias 规则

如果设置的 alias 属性，可以把模块别名做路径中的映射。代码执行步骤会有下边几步：

1，首先，路径中**替换 alias key** 映射的值，看能否找到正确路径，找到则返回文件路径。

2，上边结果的路径添加 index，继续查找，找到则返回文件路径。

3，其次，**不替换**，看是否找到正确路径，找到则返回文件路径。

4，上边结果的路径添加 index，继续查找，找到则返回文件路径。

如果都没有找到正确路径，报错退出。

```js
const {Volume} = require("memfs");
// Volume 用于模拟一个文件系统，fileSystem 可以当作一个文件系统用于测试文件读取目录读取。
var fileSystem = Volume.fromJSON(
    {
        "/recursive/index": "",
        // "/recursive/dir/index": "",
        "/recursive/dir/index2.js": "",
    },
    "/"
);
// 创建解析器
resolver = ResolverFactory.createResolver({
    alias: {
        recursive: "recursive/dir",
    },
    modules: "/",
    useSyncFileSystemCalls: true,
    fileSystem: fileSystem
});
// 结果
resolver.resolveSync({}, "/", "recursive"); // 报错
resolver.resolveSync({}, "/", "recursive/index2"); // /recursive/dir/index2
resolver.resolveSync({}, "/", "recursive/dir"); // 报错
resolver.resolveSync({}, "/", "recursive/dir/index2");// /recursive/dir/index2


```

如果仅上边文件系统配置做些修改，对比如下：

```js
var fileSystem = Volume.fromJSON(
    {
        "/recursive/index": "",
        "/recursive/dir/index": "",
        // "/recursive/dir/index2.js": "",
    },
    "/"
);
// 结果
resolver.resolveSync({}, "/", "recursive") // /recursive/dir/index
resolver.resolveSync({}, "/", "recursive/index") // /recursive/dir/index
resolver.resolveSync({}, "/", "recursive/dir") // /recursive/dir/index
resolver.resolveSync({}, "/", "recursive/dir/index") // /recursive/dir/index
```

#### modules 规则

modules 可以规定**模块目录的位置**，modules 的默认值是 ["node_modules"]。

首先，路径 **不以 "./" 或 "/" 开头** ，表示引入一个模块。

说明是在模块目录（通常为node_modules，或者说是外部引入的依赖模块）中引入文件。

> 注意这时 resolve 方法中 path 参数将没有作用被忽略。

做 **modules 与 request** 参数的**拼接**形成路径，引入规则有一下几步

1，首先，查看路径对应的目录中 **package.json 中 main** 属性对应**路径**，再拼接这个路径，找到文件则返回。

2，上边结果的路径添加 index，继续查找，找到则返回文件路径。

3，其次，如果没有 package.json 或者没有 main 属性，或者没有找到文件，则**直接用拼接路径**查找，找到文件则返回。

4，上边结果的路径添加 index，继续查找，找到则返回文件路径。

最后，如果都找不到，报错退出。

> path属性设置后，会与 request 属性拼接，生成文件查找的路径。
>
> **注意**的是，path **只在** request 为**相对路径**（路径 “./” 开头）有用，**引入模块**和**绝对路径**（路径 “/” 开头）**都没有作用**。



```js
const CachedInputFileSystem = require("../lib/CachedInputFileSystem");

const nodeFileSystem = new CachedInputFileSystem(fs, 4000); // 缓存文件系统操作的结果，并在一定时间内有效。

const resolver = ResolverFactory.createResolver({
    modules: path.resolve(__dirname, "../node_modules"),
    useSyncFileSystemCalls: true,
    fileSystem: nodeFileSystem // 调用 createResolver 时的必须值，传入 fs
});
resolver.resolveSync(
    {},
    path.resolve(__dirname, '../'), // 失去作用
    "husky" // 获取node_modules中的husky包
)// D:\gitHub\public\enhanced-resolve\node_modules\.store\husky@6.0.0\node_modules\husky\lib\index.js
```

> **CachedInputFileSystem 的作用：**
>
> 主要缓存文件系统操作的结果，而不是文件的实际数据。其主要目的是提高文件系统操作的性能，避免重复执行相同的文件系统查询。
>
> 具体来说，缓存的信息包括：
>
> 1. **错误信息 (`err`)**: 如果文件系统操作发生错误，例如文件不存在或权限问题，错误信息将被缓存，以避免重复触发相同的错误。
> 2. **操作结果 (`result`)**: 如果文件系统操作成功，操作的结果将被缓存。这可能是文件的元数据（如 `stat` 或 `lstat` 的结果）或文件的内容（如 `readFile` 或 `readJson` 的结果）。
> 3. **缓存级别 (`level`)**: 缓存被分为不同的级别，根据最近的访问时间划分。这允许在一定时间内保留最近访问的文件系统操作结果，并定期清理不再需要的缓存。
>
> 缓存的键是文件路径，而值是包含上述信息的对象。在使用缓存之前，会首先检查缓存是否包含特定路径的结果，如果存在，则直接返回缓存的结果，否则会触发文件系统操作，并将操作结果存储到缓存中。

**最后补充，注意：**

上述出现 **package.json** 只是常用默认值，可以通过 **descriptionFiles** 另外设置。

上述出现 **index** 只是常用默认值，可以通过 **mainFiles** 另外设置。

上述出现 **node_modules** 只是常用默认值，可以通过 **modules** 另外设置。

上述出现 **main** 只是常用默认值，可以通过 **mainFields** 另外设置。



**useSyncFileSystemCalls: true**，设为true，对 resolver 使用**同步文件**系统调用。

表示Webpack会使用同步的文件系统调用。这意味着在解析模块等文件系统操作时，Webpack将**等待文件系统返回结果**后再继续执行。这可能会**影响构建性能**，尤其是在大型项目中。



### 解析器选项

| 字段             | 默认值                      | 描述                                                         |
| ---------------- | --------------------------- | ------------------------------------------------------------ |
| alias            | []                          | 一个模块**别名**配置列表或将键映射到值的对象                 |
| aliasFields      | []                          | 描述文件中的别名字段列表                                     |
| extensionAlias   | {}                          | 将扩展名映射到扩展名别名的对象                               |
| cachePredicate   | function() { return true }; | 一个函数，决定是否应该缓存请求。一个对象被传递给该函数，具有 `path` 和 `request` 属性。 |
| cacheWithContext | true                        | 如果启用了不安全的缓存，则在缓存键中包含 `request.context`   |
| conditionNames   | ["node"]                    | 导出字段条件名称列表                                         |
| descriptionFiles | ["package.json"]            | 读取的描述文件列表                                           |
| enforceExtension | false                       | 强制使用扩展名                                               |
| exportsFields    | ["exports"]                 | 描述文件中的导出字段列表                                     |
| extensions       | [".js", ".json", ".node"]   | 应尝试的文件的扩展名列表                                     |
| fallback         | []                          | 与 `alias` 相同，但仅在默认解析失败时使用                    |
| fileSystem       |                             | 应该使用的文件系统                                           |
| fullySpecified   | false                       | 传递给解析的请求已经完全指定，对于它不会解析扩展名或主文件（对于内部请求仍然会解析它们） |
| mainFields       | ["main"]                    | 描述文件中的主字段列表                                       |
| mainFiles        | ["index"]                   | 目录中的主文件列表                                           |
| modules          | ["node_modules"]            | 解析模块的目录列表，可以是绝对路径或文件夹名称               |
| plugins          | []                          | 应用的附加解析插件列表                                       |
| resolver         | undefined                   | 一个准备好的 Resolver，插件附加到这个 Resolver 上            |
| resolveToContext | false                       | 解析到上下文而不是文件                                       |
| preferRelative   | false                       | 更喜欢将模块请求解析为相对请求，然后回退到解析为模块         |
| preferAbsolute   | false                       | 更喜欢将服务器相对路径解析为绝对路径，然后回退到在根目录中解析 |
| restrictions     | []                          | 解析限制列表                                                 |
| roots            | []                          | 根路径列表                                                   |
| symlinks         | true                        | 是否解析符号链接到它们的符号链接位置                         |
| unsafeCache      | false                       | 使用此缓存对象来不安全地缓存成功的请求                       |

## 插件

类似于 `webpack`，`enhanced-resolve` 的核心功能是作为单独插件实现的，这些插件使用 [`tapable`](https://github.com/webpack/tapable) 执行。
这些插件可以扩展库的功能，添加其他解析文件/上下文的方式。

插件应该是一个 `class`（或其 ES5 等效形式），具有一个 `apply` 方法。`apply` 方法将接收到一个 `resolver` 实例，该实例可以用于连接到事件系统。

### 插件脚手架

```js
class MyResolverPlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("MyResolverPlugin", (request, resolveContext, callback) => {
				// 可以在这里放置创建新 `request` 所需的任何逻辑
				resolver.doResolve(target, request, null, resolveContext, callback);
			});
	}
}
```

插件以管道方式执行，并注册它们应该在哪个事件之前/之后执行。在上面的例子中，`source` 是启动管道的事件的名称，`target` 是此插件应该触发的事件，这是继续管道执行的事件。有关这些不同插件事件如何创建链的示例，请参见 `lib/ResolverFactory.js` 中的 `//// pipeline ////` 部分。

## 转义

允许将 `#` 转义为 `\0#`，以避免将其解析为片段。

`enhanced-resolve` 将尝试解析包含 `#` 的请求，作为路径和片段，因此它将自动判断 `./some#thing` 是否意味着 `.../some.js#thing` 还是 `.../some#thing.js`。当 `#` 被解析为路径时，它将在结果中被转义。这里是一个例子：`.../some\0#thing.js`。

## 从 webpack 传递选项

如果使用 `webpack`，并且想要将自定义选项传递给 `enhanced-resolve`，则选项从 webpack 配置的 `resolve` 键传递，例如：

```js
resolve: {
  extensions: ['.js', '.jsx'],
  modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  plugins: [new DirectoryNamedWebpackPlugin()]
  ...
},
```

## 源码部分分析

### index

```js
const resolve = require("enhanced-resolve");
resolve()
resolve.sync()
resolve.create()
resolve.create.sync()
```

对外暴露方法，create，sync，ResolverFactory，CachedInputFileSystem

#### create

create 本质是 create 方法。

create.sync 本质是 createSync 方法。

他们处理入参，添加 useSyncFileSystemCalls 和 fileSystem 文件系统相关属性，以及context 属性的默认参数。

以 createSync 方法为例，返回一个 Resolver 实例

```js
const nodeFileSystem = new CachedInputFileSystem(fs, 4000);

const nodeContext = {
	environments: ["node+es3+es5+process+native"]
};

function createSync(options) {
	options = {
		useSyncFileSystemCalls: true,
		fileSystem: nodeFileSystem,
		...options
	};
	const resolver = ResolverFactory.createResolver(options);
	return function (context, path, request) {
		if (typeof context === "string") {
			request = path;
			path = context;
			context = nodeContext;
		}
		return resolver.resolveSync(context, path, request);
	};
}
```

#### resolve

resolve  本质是 resolve 方法。

resolve.sync 本质是 resolveSync 方法。

他们同上边create相比会闭包保存 ResolverFactory.createResolver 的实例，同时添加 conditionNames 和 extensions 的默认配置。

以 resolveSync 方法为例，直接运行 Resolver 实例获取路径。

```js
const nodeFileSystem = new CachedInputFileSystem(fs, 4000);

const nodeContext = {
	environments: ["node+es3+es5+process+native"]
};

const asyncResolver = ResolverFactory.createResolver({
 conditionNames: ["node"],
 extensions: [".js", ".json", ".node"],
 fileSystem: nodeFileSystem
});

function resolve(context, path, request, resolveContext, callback) {
 if (typeof context === "string") {
  callback = resolveContext;
  resolveContext = request;
  request = path;
  path = context;
  context = nodeContext;
 }
 if (typeof callback !== "function") {
  callback = resolveContext;
 }
 asyncResolver.resolve(context, path, request, resolveContext, callback);
}
```

### ResolverFactory

#### createResolve

最重要的方法 createResolver 用于注册多个 hook ，注入系统内的一些 plugin ，然后创建 Resolver 实例。

```js
exports.createResolver = function (options) {
 ……
 const {
  alias,
  fallback,
  aliasFields,
  exportsFields,
  extensionAlias,
  importsFields,
  extensions,
  fileSystem,
  fullySpecified,
  mainFields,
  mainFiles,
  modules,
  plugins: userPlugins,
  unsafeCache,
  resolver: customResolver,
  restrictions,
  roots
  ……
 } = ……

 const plugins = userPlugins.slice();

 const resolver = customResolver
  ? customResolver
  : new Resolver(fileSystem, normalizedOptions);

 //// pipeline ////
 // 这里是按顺序注册对应 hook 进入，本质是 tapable.AsyncSeriesBailHook 注册。
 // return (this.hooks[name] = new AsyncSeriesBailHook(
 // 	["request", "resolveContext"],
 // 		name
 // ));
 resolver.ensureHook("resolve");
 resolver.ensureHook("internalResolve");
 resolver.ensureHook("newInternalResolve");
 resolver.ensureHook("parsedResolve");
 resolver.ensureHook("describedResolve");
 resolver.ensureHook("rawResolve");
 resolver.ensureHook("normalResolve");
 resolver.ensureHook("internal");
 resolver.ensureHook("rawModule");
 resolver.ensureHook("module");
 resolver.ensureHook("resolveAsModule");
 resolver.ensureHook("undescribedResolveInPackage");
 resolver.ensureHook("resolveInPackage");
 resolver.ensureHook("resolveInExistingDirectory");
 resolver.ensureHook("relative");
 resolver.ensureHook("describedRelative");
 resolver.ensureHook("directory");
 resolver.ensureHook("undescribedExistingDirectory");
 resolver.ensureHook("existingDirectory");
 resolver.ensureHook("undescribedRawFile");
 resolver.ensureHook("rawFile");
 resolver.ensureHook("file");
 resolver.ensureHook("finalFile");
 resolver.ensureHook("existingFile");
 resolver.ensureHook("resolved");

 // TODO remove in next major
 // cspell:word Interal
 // Backward-compat
 
 resolver.hooks.newInteralResolve = resolver.hooks.newInternalResolve;

 // 下边所有 Plugin 后缀的都继承 ParsePlugin class 
 // 最后一个参数就是执行 hook 的 name（下边入参是 target）去调用 doResolve。
 // resolver.doResolve( target, alternative, null, resolveContext, (err, result) => {
 //		if (err) return callback(err);
 //		if (result) return callback(null, result);
 //		resolver.doResolve(target, obj, null, resolveContext, callback);
 //	});
 // doResolve 中执行了 this.hooks.resolveStep.call(hook, request);
    
 // resolve
 for (const { source, resolveOptions } of [
  { source: "resolve", resolveOptions: { fullySpecified } },
  { source: "internal-resolve", resolveOptions: { fullySpecified: false } }
 ]) {
  if (unsafeCache) {
   plugins.push(
    new UnsafeCachePlugin(
     source,
     cachePredicate,
     unsafeCache,
     cacheWithContext,
     `new-${source}`
    )
   );
   plugins.push(
    new ParsePlugin(`new-${source}`, resolveOptions, "parsed-resolve")
   );
  } else {
   plugins.push(new ParsePlugin(source, resolveOptions, "parsed-resolve"));
  }
 }

 // parsed-resolve
 plugins.push(
  new DescriptionFilePlugin(
   "parsed-resolve",
   descriptionFiles,
   false,
   "described-resolve"
  )
 );
 plugins.push(new NextPlugin("after-parsed-resolve", "described-resolve"));

 // described-resolve
 plugins.push(new NextPlugin("described-resolve", "raw-resolve"));
 if (fallback.length > 0) {
  plugins.push(
   new AliasPlugin("described-resolve", fallback, "internal-resolve")
  );
 }

 // raw-resolve
 if (alias.length > 0) {
  plugins.push(new AliasPlugin("raw-resolve", alias, "internal-resolve"));
 }
 aliasFields.forEach(item => {
  plugins.push(new AliasFieldPlugin("raw-resolve", item, "internal-resolve"));
 });
 extensionAlias.forEach(item =>
  plugins.push(
   new ExtensionAliasPlugin("raw-resolve", item, "normal-resolve")
  )
 );
 plugins.push(new NextPlugin("raw-resolve", "normal-resolve"));

 // normal-resolve
 if (preferRelative) {
  plugins.push(new JoinRequestPlugin("after-normal-resolve", "relative"));
 }
 plugins.push(
  new ConditionalPlugin(
   "after-normal-resolve",
   { module: true },
   "resolve as module",
   false,
   "raw-module"
  )
 );
 plugins.push(
  new ConditionalPlugin(
   "after-normal-resolve",
   { internal: true },
   "resolve as internal import",
   false,
   "internal"
  )
 );
 if (preferAbsolute) {
  plugins.push(new JoinRequestPlugin("after-normal-resolve", "relative"));
 }
 if (roots.size > 0) {
  plugins.push(new RootsPlugin("after-normal-resolve", roots, "relative"));
 }
 if (!preferRelative && !preferAbsolute) {
  plugins.push(new JoinRequestPlugin("after-normal-resolve", "relative"));
 }

 // internal
 importsFields.forEach(importsField => {
  plugins.push(
   new ImportsFieldPlugin(
    "internal",
    conditionNames,
    importsField,
    "relative",
    "internal-resolve"
   )
  );
 });

 // raw-module
 exportsFields.forEach(exportsField => {
  plugins.push(
   new SelfReferencePlugin("raw-module", exportsField, "resolve-as-module")
  );
 });
 modules.forEach(item => {
  if (Array.isArray(item)) {
   if (item.includes("node_modules") && pnpApi) {
    plugins.push(
     new ModulesInHierarchicalDirectoriesPlugin(
      "raw-module",
      item.filter(i => i !== "node_modules"),
      "module"
     )
    );
    plugins.push(
     new PnpPlugin("raw-module", pnpApi, "undescribed-resolve-in-package")
    );
   } else {
    plugins.push(
     new ModulesInHierarchicalDirectoriesPlugin(
      "raw-module",
      item,
      "module"
     )
    );
   }
  } else {
   plugins.push(new ModulesInRootPlugin("raw-module", item, "module"));
  }
 });

 // module
 plugins.push(new JoinRequestPartPlugin("module", "resolve-as-module"));

 // resolve-as-module
 if (!resolveToContext) {
  plugins.push(
   new ConditionalPlugin(
    "resolve-as-module",
    { directory: false, request: "." },
    "single file module",
    true,
    "undescribed-raw-file"
   )
  );
 }
 plugins.push(
  new DirectoryExistsPlugin(
   "resolve-as-module",
   "undescribed-resolve-in-package"
  )
 );

 // undescribed-resolve-in-package
 plugins.push(
  new DescriptionFilePlugin(
   "undescribed-resolve-in-package",
   descriptionFiles,
   false,
   "resolve-in-package"
  )
 );
 plugins.push(
  new NextPlugin("after-undescribed-resolve-in-package", "resolve-in-package")
 );

 // resolve-in-package
 exportsFields.forEach(exportsField => {
  plugins.push(
   new ExportsFieldPlugin(
    "resolve-in-package",
    conditionNames,
    exportsField,
    "relative"
   )
  );
 });
 plugins.push(
  new NextPlugin("resolve-in-package", "resolve-in-existing-directory")
 );

 // resolve-in-existing-directory
 plugins.push(
  new JoinRequestPlugin("resolve-in-existing-directory", "relative")
 );

 // relative
 plugins.push(
  new DescriptionFilePlugin(
   "relative",
   descriptionFiles,
   true,
   "described-relative"
  )
 );
 plugins.push(new NextPlugin("after-relative", "described-relative"));

 // described-relative
 if (resolveToContext) {
  plugins.push(new NextPlugin("described-relative", "directory"));
 } else {
  plugins.push(
   new ConditionalPlugin(
    "described-relative",
    { directory: false },
    null,
    true,
    "raw-file"
   )
  );
  plugins.push(
   new ConditionalPlugin(
    "described-relative",
    { fullySpecified: false },
    "as directory",
    true,
    "directory"
   )
  );
 }

 // directory
 plugins.push(
  new DirectoryExistsPlugin("directory", "undescribed-existing-directory")
 );

 if (resolveToContext) {
  // undescribed-existing-directory
  plugins.push(new NextPlugin("undescribed-existing-directory", "resolved"));
 } else {
  // undescribed-existing-directory
  plugins.push(
   new DescriptionFilePlugin(
    "undescribed-existing-directory",
    descriptionFiles,
    false,
    "existing-directory"
   )
  );
  mainFiles.forEach(item => {
   plugins.push(
    new UseFilePlugin(
     "undescribed-existing-directory",
     item,
     "undescribed-raw-file"
    )
   );
  });

  // described-existing-directory
  mainFields.forEach(item => {
   plugins.push(
    new MainFieldPlugin(
     "existing-directory",
     item,
     "resolve-in-existing-directory"
    )
   );
  });
  mainFiles.forEach(item => {
   plugins.push(
    new UseFilePlugin("existing-directory", item, "undescribed-raw-file")
   );
  });

  // undescribed-raw-file
  plugins.push(
   new DescriptionFilePlugin(
    "undescribed-raw-file",
    descriptionFiles,
    true,
    "raw-file"
   )
  );
  plugins.push(new NextPlugin("after-undescribed-raw-file", "raw-file"));

  // raw-file
  plugins.push(
   new ConditionalPlugin(
    "raw-file",
    { fullySpecified: true },
    null,
    false,
    "file"
   )
  );
  if (!enforceExtension) {
   plugins.push(new TryNextPlugin("raw-file", "no extension", "file"));
  }
  extensions.forEach(item => {
   plugins.push(new AppendPlugin("raw-file", item, "file"));
  });

  // file
  if (alias.length > 0)
   plugins.push(new AliasPlugin("file", alias, "internal-resolve"));
  aliasFields.forEach(item => {
   plugins.push(new AliasFieldPlugin("file", item, "internal-resolve"));
  });
  plugins.push(new NextPlugin("file", "final-file"));

  // final-file
  plugins.push(new FileExistsPlugin("final-file", "existing-file"));

  // existing-file
  if (symlinks)
   plugins.push(new SymlinkPlugin("existing-file", "existing-file"));
  plugins.push(new NextPlugin("existing-file", "resolved"));
 }

 // resolved
 if (restrictions.size > 0) {
  plugins.push(new RestrictionsPlugin(resolver.hooks.resolved, restrictions));
 }
 plugins.push(new ResultPlugin(resolver.hooks.resolved));
 // 以上是各个 plugins 的注册
 //// RESOLVER ////

 for (const plugin of plugins) {
  if (typeof plugin === "function") {
   plugin.call(resolver, resolver);
  } else {
   plugin.apply(resolver);
  }
 }

 return resolver;
};
```
