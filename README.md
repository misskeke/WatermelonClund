西瓜云
===

## 网站原码公开git repo

** 运行前 **

    npm install body-parser ccap cookie-parser debug express jade marked memcached mongoose morgan nodemailer pygmentize-bundled

欢迎以及感谢您使用西瓜云服务！您可以在这里下载到我们网站的原码。
网站使用node.js + Express.js构建。您可以使用node app运行，也可以使用

    sudo npm install -g nodemon
    nodemon

当修改时自动重启。

### 帮助 + 参考资料
[Express API参考](http://expressjs.jser.us/3x_zh-cn/api.html)

[mongodb数据库初始文件](#mongodb%E6%95%B0%E6%8D%AE%E5%BA%93%E5%88%9D%E5%A7%8B%E6%96%87%E4%BB%B6)

[数据库结构说明](#%E6%95%B0%E6%8D%AE%E5%BA%93%E7%BB%93%E6%9E%84%E8%AF%B4%E6%98%8E)

[改造发布许可](#%E6%94%B9%E9%80%A0%E5%8F%91%E5%B8%83%E8%AE%B8%E5%8F%AF)

[原码结构说明](#%E5%8E%9F%E7%A0%81%E7%BB%93%E6%9E%84%E8%AF%B4%E6%98%8E)


## mongodb数据库初始文件
未完成
## 数据库结构说明
未完成
## 改造发布许可
未完成
## 原码结构说明
### app.js

主文件，包括程序启动

    var app = express();

，404处理

    app.use(function (req, res, next) {
        var err = new Error('内容不存在');
        err.status = "E_CONTENT_NOT_FIND";
        next(err);
    });

异常处理

    app.use(function (err, req, res, next) {
        errpc(res, err, 404);
    });
### /bin/

自建类库

#### /bin/str.js

加缓存的字符串处理

### /public
#### /public/i
图片
#### /public/j
客户端JS
#### /public/s
Stylesheet
### /routes

处理请求的模块

#### /routes/index.js

主模块，包括所有的URL Handler

### /views

模版

### a.js

测试用
