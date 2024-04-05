---
nav: Webpack
title: assets-webpack-plugin
group:
  title: plugin
  order: 4
order: 6
---

# assets-webpack-plugin

Webpack 插件，在打包后生成一个json文件，里边存放打包后的文件（dist目录中的文件）对应路径的集合。

json 文件默认输出到**根目录**

## 输出示例

输出是一个 JSON 对象，格式如下：

```js
{
    "bundle_name": {
        "asset_kind": "/public/path/to/asset"
    }
}
```

其中：

- `"bundle_name"`是包的名称（webpack 配置中条目对象的键，如果条目是数组，则为“main”）。
- `"asset_kind"`是资源的驼峰式文件扩展名

![image-20231119101444318](./webpack-plugin.assets/image-20231119101444318.png)

## API

```js
 new AssetsPlugin({
    path: resolve(output), // 输出json的路径
    useCompilerPath: false, // path 属性是否被 webpack output 属性覆盖掉
    prettyPrint: true, // 格式化json文件
    removeFullPathAutoPrefix: true // 删除json中路径的 auto 前缀
 }),
```

注意：如果path 设置为 dist （打出包的路径），会被 output.clean 删除掉。
