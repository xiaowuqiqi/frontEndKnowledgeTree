---
title: ERPNextV14 安装
order: 1
group:
  order: 9
  title: ERPNext
---
# ERPNextV14 安装
  环境：华为云服务器
	系统：Ubuntu 22.04 LTS
	APP版本：Frappe  / ERPNext v14

#### 安装前准备

- 华为至今为止提供的最新版本Ubuntu镜像仍是20.04，要安装ERPNext v14，最好将系统更新到22.04
- 默认的镜像源是华为的，无法直接更新到22.04，所以有必要先将镜像源改为阿里源，阿里做的源默认只有focal的，源地址里需要将focal改为jammy。

#### 变量总结

frappe-user：ubuntu系统用户

sitename：站点名字

#### 安装步骤

1. 新建一个ERP系统用户

   ```bash
   # frappe-user 可以叫 erp
   adduser [frappe-user]
   # 把用户添加到sudo用户组中
   usermod -aG sudo [frappe-user] 
   ```

   > sudo（superuser do）用户组比较特殊。在Unix或Linux系统中，sudo用户组是一个具有特殊权限的用户组，它允许普通用户以特定的条件获得管理员或root权限。
   >
   > -a：表示添加选项，即将用户添加到指定的用户组中。
   >
   > -G：表示组名选项，后跟要添加用户的用户组名称，本例中为sudo。

2. 更新并重启

   ```bash
   sudo apt update && apt upgrade -y && shutdown -r now
   ```

   > - apt update：这个命令用来更新系统软件源，获取最新的可用软件包信息。
   >
   > - apt upgrade -y：这个命令用来升级系统中已安装的软件包，其中-y选项表示默认选择yes确认所有更新。
   >
   > - shutdown -r now：这个命令会立即重启系统。其中，-r选项表示重启，now表示立即执行。
   >
   > 该命令的意思是：首先更新系统软件源，然后升级所有已安装的软件包并确认更新所有内容，最后立即重启系统以使所有的更新生效。

3. 重启后以前面新建的用户登录,下载node.js

   ```bash
   # 没有curl用以下命令安装
   # snap install curl 
   # sudo apt install curl 
   
   sudo curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   ```
   
   > 该脚本会向系统添加Node.js软件包的源。-sL参数表示在安装过程中不要显示任何输出。sudo表示以管理员身份运行脚本。
   >
   > -E参数是将当前用户环境变量传递给sudo。bash表示要在sudo下使用Bash shell来运行脚本。因此，-E bash表示以管理员权限运行Bash shell，并将当前用户的环境变量传递给sudo以保持一致。
   
4. 安装操作系统所需的各种依赖

   ```bash
   sudo apt install -y python3.10-dev python3-setuptools python3-pip python3-distutils python3.10-venv software-properties-common mariadb-server mariadb-client redis-server nodejs xvfb libfontconfig libmysqlclient-dev nginx
   ```

5. 用nano编辑my.cnf文件

   ```bash
   sudo vim /etc/mysql/mariadb.cnf
   ```

   将光标移动到最后空白行(不要用滚轮)，复制以下文本内容，粘贴后注意格式和换行要同下方，ctrl + X返回命令行，保存cy.cnf。

   ```
   [mysqld]
   character-set-client-handshake = FALSE 
   character-set-server = utf8mb4 
   collation-server = utf8mb4_unicode_ci 
   
   [mysql]
   default-character-set = utf8mb4
   ```

6. 重启sql

  ```bash
  sudo service mysql restart
  ```

7. mysql的安全配置

   ```bash
   sudo mysql_secure_installation
   ```

   第一个输入数据库密码对话框出来的时候，直接敲回车代表没有密码，剩下的按照下面选择：	

   ```bash
   # 注：运行结果用 ··· 代替
   Enter current password for root (enter for none):  # 输入root(mysql)的密码，初次安装默认没有，直接回车 
    ... 
   Switch to unix_socket authentication [Y/n] n # 是否切换到unix套接字身份验证[Y/n]
    ... 
   Change the root password? [Y/n] y #是否设置root用户密码
   New password: # 新密码
   Re-enter new password:  # 再次输入密码
    ... 
   Remove anonymous users? [Y/n] y # 是否删除匿名用户，建议删除
    ... 
   Disallow root login remotely? [Y/n] n # 是否禁止root远程登录，建议不开启
    ... 
   Remove test database and access to it? [Y/n] n # 是否删除test数据库，可以保留
   ...
   Reload privilege tables now? [Y/n] y # 是否重新加载权限表，也可以直接回车
    ... 
   Thanks for using MariaDB! # 看到这句话证明设置成功
   
   
   ##如果要设置root远程登录数据库，初始化 MariaDB 完成后，以 MySQL 的 root 身份登录
   
   mysql -uroot -p密码
   
   ## 赋予 root 用户远程连接权限
   grant all privileges on *.* to 'root'@'%' identified by '自己设置的root密码';
   flush privileges;
   
   ## 但一般不建议这么干！
   ```

8. 安装yarn

   ```bash
   sudo npm install -g yarn
   # 如果安装yarn报错，虚拟机使用NAT网络模式，然后挂上vpn，然后执行
   # sudo npm install -g yarn --registry=https://registry.npm.taobao.org
   ```

   下边直接全部复制进去

   ```bash
   #yarn config get registry查看源, 如果官方源请设置为以下国内源
   
   yarn config set registry https://registry.npmmirror.com/ --global  && \
   yarn config set disturl https://npmmirror.com/package/dist --global && \
   yarn config set sass_binary_site https://cdn.npmmirror.com/binaries/node-sass --global  && \
   yarn config set electron_mirror https://registry.npmmirror.com/binary.html?path=electron/ --global  && \
   yarn config set puppeteer_download_host https://registry.npmmirror.com/binary.html --global  && \
   yarn config set chromedriver_cdnurl https://cdn.npmmirror.com/binaries/chromedriver --global  && \
   yarn config set operadriver_cdnurl https://cdn.npmmirror.com/binaries/operadriver --global  && \
   yarn config set phantomjs_cdnurl https://cdn.npmmirror.com/binaries/phantomjs --global  && \
   yarn config set selenium_cdnurl https://cdn.npmmirror.com/binaries/selenium --global  && \
   yarn config set node_inspector_cdnurl https://cdn.npmmirror.com/binaries/node-inspector --global
   
   
   
   npm set registry https://registry.npmmirror.com/ && \
   npm set disturl https://npmmirror.com/package/dist && \
   npm set sass_binary_site https://cdn.npmmirror.com/binaries/node-sass && \
   npm set electron_mirror https://registry.npmmirror.com/binary.html?path=electron/ && \
   npm set puppeteer_download_host https://registry.npmmirror.com/binary.html && \
   npm set chromedriver_cdnurl https://cdn.npmmirror.com/binaries/chromedriver && \
   npm set operadriver_cdnurl https://cdn.npmmirror.com/binaries/operadriver && \
   npm set phantomjs_cdnurl https://cdn.npmmirror.com/binaries/phantomjs && \
   npm set selenium_cdnurl https://cdn.npmmirror.com/binaries/selenium && \
   npm set node_inspector_cdnurl https://cdn.npmmirror.com/binaries/node-inspector && \
   npm cache clean --force
   
   # 已经改了源，但安装过程中还是从官方镜像下载导致超时报网络问题的，换个时间也许就好了。这是因为esbuild这个东西是新东西，比较时髦，国内用的比较少，国内源都没有收录这个包，国内源没有的包就会去官方找，当下载超时了就报错了。
   ```

9. 查看版本，对照一下，这一步不做也行

   ```bash
   node -v && npm -v && python3 -V && pip3 -V && yarn -v
   ```

10. 设置pip3的源（可以省略看实际情况）

    ```bash
    # dev 用户下
    # ~目录下，自己创建目录与文件
    vim .pip/pip.conf
    
    
    [global]
    index-url = https://pypi.douban.com/simple/
    trusted-host=https://pypi.douban.com
    
    ```

11. 安装bench，即erpnext系统的命令行管理工具，类似windows系统的程序管理器。

    ```bash
    sudo -H pip3 install frappe-bench  #直接安装装不上的时候，可以先指定5.6.0版本，再升级到最新版本
    # 保险起见重启一下系统,因为第一步升级系统以来,没有重启过；很多补丁可能需要重启，为了下面安装的问题不要因为系统环境的问题而失败。
    sudo reboot
    ```

12. 使用bench命令安装frappe框架，记得把frappe-bench（下方的version-14后面的名字）改成自己想要的名字，这一步时间比较长，别着急，代码库已经加了码云地址参数。

    如果网络超时失败，可重新运行该命令，重新运行之前需使用命令 `rm -r frappe-bench` 删除之前生成的目录。如果上面没改yarn的镜像源，安装的等待时间会非常长。(--verbose 参数的目的是输出安装的详细过程)

    ```bash
    bench init --frappe-branch v14.34.0 frappe-bench --frappe-path=https://gitee.com/mirrors/frappe --verbose
    # 如果yarn报错，更换淘宝源yarn config set registry https://registry.npm.taobao.org --global
    # 然后输入yarn config set "strict-ssl" false -g,虚拟机的话更改连接方式为桥接试试
    ```

    如有错误，查看对应包的版本

    ```bash
    pip show setuptools | grep Version
    
    pip install --upgrade setuptools==59.6.0
    pip uninstall pytest-runner
    pip uninstall pip
    python -m pip install pip==22.0.2
    
    sudo reboot
    ```

    

13. 再将安装的系统用户分配一下执行权限。

    ```bash
    chmod -R o+rx /home/[frappe-user]/ #这里 frappe-user 可以是erp
    ```

14. 进入bench目录，同样记得改名

    ```
    cd frappe-bench
    ```

15. 新建站点，名字自己取，安装时会提示输入数据库root账号的密码

    新站点数据库及erp系统管理员账号Administator以及密码，其中数据库root账号密码须与上述数据库安装时密码一致。Administrator密码请一定记住，这是初始化系统时使用的密码。

    ```bash
    # 新建一个站点，下面的命令示例站点名称（sitename）为erpnext
    bench new-site {sitename}
    # 这里要输入mysql root的密码
    # 安装完后提示要设置系统用户Administrator的密码
    ```

16. 下载app

    ```bash
    bench get-app https://gitee.com/phipsoft/payments # 支付应用程序
    bench get-app --branch version-14 erpnext https://gitee.com/mirrors/erpnext 
    bench get-app --branch version-14 https://gitee.com/phipsoft/hrms  # hr系统
    ```

17. 安装app

    ```bash
    bench --site {sitename} install-app payments # sitename 是站点名字如 erpnext
    bench --site {sitename} install-app erpnext
    bench --site {sitename} install-app hrms #如果报错，则在安装hrms前需要先bench start，再开一个窗口来安装，
    ```

18. 设置为生产环境，即用supervisorctl管理所有进程，使用nginx做反向代理，USERNAME换成第3步新建的账号，大功告成。

    ```bash
    sudo bench setup production {USERNAME}
    #重要：设置成生产环境后，不用执行bench start进行启动！！！
    #这里的{USERNAME}要换成安装时用的用户名，比如用erp用户时，这里的{USERNAME}就是erp
    ```

19. 安装完后可查看一下是否有活动的wokers（要在 `frappe-bench` 目录下）

    ```bash
    bench doctor
    
    #正常情况下会显示如下：
    -----Checking scheduler status-----
    Scheduler disabled for erpnext
    Scheduler inactive for erpnext
    Workers online: 3
    -----erpnext Jobs-----
    ```

20. 以上完成后查看一下安装了哪些app

    ```
    bench version 
    ```

    正常会显示以下三个app

    ```
    erpnext 14.x.x
    frappe 14.x.x
    hrms 14.x.x
    ```


#### 常用app安装

ERPNext中文汉化

1. 获取app，需要在frappe-bench目录下

   ```bash
   bench get-app https://gitee.com/yuzelin/erpnext_chinese.git
   ```

2. 安装，需要在frappe-bench目录下

   ```bash
   bench --site {sitename} install-app erpnext_chinese
   
   bench clear-cache && bench clear-website-cache
   sudo supervisorctl restart all
   ```

3. 升级，需要在frappe-bench目录下

   ```bash
   bench update --apps zh_chinese_language --pull --reset
   bench clear-cache && bench clear-website-cache
   sudo supervisorctl restart  all
   ```

ERPNext开箱即用

1. 拉app时先修改一个配置文件。

   ```
   sudo nano /etc/supervisor/supervisord.conf
   
   [unix_http_server]
   file=var/tmp/supervisord.sock
   chmod=0700
   chown=frappe:frappe  #在这个位置加上这一行
   
   
   改完后执行
   sudo -A systemctl restart supervisor
   ```

   

2. 获取app

   ```
   bench get-app --branch version-14 https://gitee.com/yuzelin/erpnext_oob.git
   ```

3. 安装

   ```
   bench --site {sitename} install-app erpnext_oob
   ```



ERPNext权限优化

1. 获取app

   ```
   bench get-app https://gitee.com/yuzelin/zelin_permission.git
   ```

2. 安装

   ```
   bench --site {sitename} install-app zelin_permission
   ```



#### Ubuntu20.04 安装打印wkhtmltopdf 库(上面已经装有了，这部分仅做参考)

1、先下载适合我们系统的安装包并进行安装：

```
wget "https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.jammy_amd64.deb" -O /tmp/wkhtml.deb
```

2、下一步进行安装

```
sudo dpkg -i /tmp/wkhtml.deb
```

3、这时可能会显示缺少依赖的错误，以下命令可解决这一问题：

```
sudo apt -f install
```

4、现在，我们可以检查wkhtmltopdf 库是否正确安装并确认是否为所需版本：

```
wkhtmltopdf –version
```

##### 显示wkhtmltopdf 0.12.6 (with patched qt)即是正确版本

其他注意：

```
apt install wkhtmltopdf
```

##### 这条命令国内阿里云源自动安装版本0.12.5，非patched qt 版本，erpnext 不打印页面头部和底部。

如果wkhtmltopdf 库不是我们需要的版本，应对其进行卸载，命令如下：

```
sudo apt remove --purge wkhtmltopdf
```



#### 其他常见问题

1. 使用过程中突然无法连接服务器，页面出现报错。

   **原因**：

   生产环境的fail2ban在同一ip操作太频繁时视为受到DDOS攻击而触发自动保护。

   **处理方法**：

   打开/etc/fail2ban/jail.d/nginx-proxy.conf

   ```
   sudo nano /etc/fail2ban/jail.d/nginx-proxy.conf
   ```

   将maxtry数值改大一些，比如25，bantime改小一些，改完保存退出。

   重启fail2ban

   ```
   sudo systemctl restart fail2ban
   ```

   

更多问题见余老师在码云的问题库：

https://gitee.com/yuzelin/erpnext-chinese-docs/issues?assignee_id=&author_id=&branch=&collaborator_ids=&issue_search=&label_ids=&label_text=&milestone_id=&priority=&private_issue=&program_id=&project_id=yuzelin%2Ferpnext-chinese-docs&project_type=&scope=&single_label_id=&single_label_text=&sort=&state=closed&target_project=

站点：erpnext

username：erp

用户名/密码：Administator/.Wzxcvbnm213116

网站名称：xiaowu1024





1、Frappe-基础知识 现在让我们了解 Frappe 的基本概念以及该技术的工作原理。 1.1 Frappe技术 Frappe 构建了自己的称为 Frappe Framework 的低代码 Web 框架，可帮助社区快速构建和定制应用程 序。 1.2 Frappe Framework Frappe 框架是一个开源的、元数据驱动的、Python 和 Javascript 的全栈框架。 1.3 Bench Bench是管理 Frappe 部署的命令行工具。 1.4 Frappe 环境 Frappe 环境由各种资源组成，用于启动 frappe 应用程序 1.5 Desk Desk是 frappe 框架的 Web 用户管理界面。 1.6 ERPNext ERPNext 是 Frappe 在其框架上构建的应用程序之一，该应用程序可以安装在 frappe-bench 中，并且 可以在 Desk 上访问。 为了安装 ERPNext，您需要了解 frappe 环境。 首先，看下图，然后阅读详细信息





#############################################################

#### 安装node问题
