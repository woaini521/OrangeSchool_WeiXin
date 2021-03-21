### OrangeSchool

##### 基于Node.js+MySQL开发的开源微信小程序商城[nideshop](https://github.com/tumobi/nideshop-mini-program)二次开发（微信小程序）

### 后端API开发环境配置
+ 创建数据库nideshop并导入项目根目录下的nideshop.sql
```
CREATE SCHEMA `nideshop` DEFAULT CHARACTER SET utf8mb4 ;
```
> 注意数据库字符编码为utf8mb4 
+ 更改数据库配置
  src/common/config/database.js
```
const mysql = require('think-model-mysql');

module.exports = {
    handle: mysql,
    database: 'nideshop',
    prefix: 'nideshop_',
    encoding: 'utf8mb4',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '你的密码',
    dateStrings: true
};
```

+ 填写微信登录和微信支付配置
src/common/config/config.js
```
// default config
module.exports = {
  default_module: 'api',
  weixin: {
    appid: '', // 小程序 appid
    secret: '', // 小程序密钥
    mch_id: '', // 商户帐号ID
    partner_key: '', // 微信支付密钥
    notify_url: '' // 微信异步通知，例：https://www.nideshop.com/api/pay/notify
  }
};
```

+ 安装依赖并启动
```
npm install
npm start
```
### 小程序及后台功能列表
+ 首页
+ 分类首页、分类商品
+ 品牌功能
+ 品牌的增加、删除
+ 商品详情页面，包含加入购物车、收藏商品等功能
+ 商品搜索功能
+ 专题功能
+ 专题的增加、删除
+ 首页广告栏的增加、删除
+ 商品的加入、编辑、删除、批量选择，收货地址的选择
+ 个人中心（订单、收藏、足迹、收货地址、意见反馈）
+ 用户管理
+ 文章发布、删除、点赞、评论（评论删除）
+ 二手商品上架、审核、删除
+ ....

### 项目截图
<img src="https://github.com/Sovea/OrangeSchool_WeiXin/blob/master/screenshots/orange_school_1.png" width="35%">
<img src="https://github.com/Sovea/OrangeSchool_WeiXin/blob/master/screenshots/orange_school_2.png" width="35%">
<img src="https://github.com/Sovea/OrangeSchool_WeiXin/blob/master/screenshots/orange_school_3.png" width="35%">
<img src="https://github.com/Sovea/OrangeSchool_WeiXin/blob/master/screenshots/orange_school_4.png" width="35%">


### 项目结构
```
├─config                
├─lib
│  └─wxParse　　　
├─pages
|  ├─article
│  ├─auth
│  │  ├─login
│  │  ├─register
│  │  └─reset
│  ├─brand
│  ├─brandDetail
│  ├─cart
│  ├─catalog
│  ├─category
│  ├─comment
|  ├─forum
|  │  ├─search
│  │  ├─writer
│  │  └─forum
│  ├─goods
│  ├─hotGoods
│  ├─index
│  ├─logs
│  ├─newGoods
│  ├─pay
│  ├─search
│  ├─shopping
│  │  ├─address
│  │  ├─addressAdd
│  │  └─checkout
│  ├─topic
│  ├─topicDetail
│  └─ucenter
│      ├─address
│      ├─addressAdd
│      ├─collect
│      ├─coupon
│      ├─feedback
│      ├─footprint
│      ├─index
│      ├─order
│      ├─resale
│  |   |   └─writer
│      └─orderDetail
├─static
│  └─images
└─utils
```
