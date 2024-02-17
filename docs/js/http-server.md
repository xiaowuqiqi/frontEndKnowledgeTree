---
title: http-server 工具
order: 1
group: 6 Node
---
# http-server 工具

## 安装

这将全局安装`http-server`，以便可以从任何地方的命令行运行。

```bash
npm install --global http-server
```

## 用法

```bash
http-server [path] [options]
# 例如
http-server -p 8080 build
```

`[path]`默认为`./public`文件夹是否存在，`./`否则。

*现在你可以访问[http://localhost:8080](http://localhost:8080/)来查看你的服务器*

**注意：**默认情况下缓存处于启用状态。添加`-c-1`为禁用缓存的选项。

## 可用选项

| 命令                     | 描述                                                         | 默认值     |
| ------------------------ | ------------------------------------------------------------ | ---------- |
| `-p`或者`--port`         | 要使用的端口。用于`-p 0`查找从 8080 开始的开放端口。它还会从 读取`process.env.PORT`。 | 8080       |
| `-a`                     | 使用地址                                                     | 0.0.0.0    |
| `-d`                     | 显示目录列表                                                 | `true`     |
| `-i`                     | 显示自动索引                                                 | `true`     |
| `-g`或者`--gzip`         | 启用后，它将代替文件的 gzip 版本存在且请求接受 gzip 编码时`./public/some-file.js.gz`提供服务。`./public/some-file.js`如果 brotli 也已启用，它将尝试首先提供 brotli。 | `false`    |
| `-b`或者`--brotli`       | 启用后，它将代替文件的 brotli 压缩版本存在且请求接受编码时`./public/some-file.js.br`提供服务。如果也启用了 gzip，它将首先尝试提供 brotli。`./public/some-file.js``br` | `false`    |
| `-e`或者`--ext`          | 如果没有提供默认文件扩展名                                   | `html`     |
| `-s`或者`--silent`       | 禁止输出日志消息                                             |            |
| `--cors`                 | `Access-Control-Allow-Origin`通过标头启用 CORS               |            |
| `-o [path]`              | 启动服务器后打开浏览器窗口。 （可选）提供要打开的 URL 路径。例如：-o /其他/目录/ |            |
| `-c`                     | 设置cache-control max-age header的缓存时间（以秒为单位），例如`-c10`10秒。要禁用缓存，请使用`-c-1`. | `3600`     |
| `-U`或者`--utc`          | 在日志消息中使用 UTC 时间格式。                              |            |
| `--log-ip`               | 启用客户端 IP 地址的记录                                     | `false`    |
| `-P`或者`--proxy`        | 将所有无法在本地解析的请求代理到给定的 url。例如：-P [http://someurl.com](http://someurl.com/) |            |
| `--proxy-options`        | 使用嵌套的点对象传递代理[选项](https://github.com/http-party/node-http-proxy#options)。例如： --proxy-options.secure false |            |
| `--username`             | 用于基本身份验证的用户名                                     |            |
| `--password`             | 基本身份验证的密码                                           |            |
| `-S`，`--tls`或者`--ssl` | 使用 TLS/SSL (HTTPS) 启用安全请求服务                        | `false`    |
| `-C`或者`--cert`         | ssl 证书文件的路径                                           | `cert.pem` |
| `-K`或者`--key`          | ssl 密钥文件的路径                                           | `key.pem`  |
| `-r`或者`--robots`       | 自动提供一个/robots.txt（内容默认为`User-agent: *\nDisallow: /`） | `false`    |
| `--no-dotfiles`          | 不显示点文件                                                 |            |
| `--mimetypes`            | 用于自定义 mimetype 定义的 .types 文件的路径                 |            |
| `-h`或者`--help`         | 打印此列表并退出。                                           |            |
| `-v`或者`--version`      | 打印版本并退出。                                             |            |
