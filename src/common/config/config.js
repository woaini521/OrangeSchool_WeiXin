// default config
var https = require('https');
var fs = require('fs');
var options = {
  key:fs.readFileSync('/etc/apache2/ssl/Nginx/4760083_www.sparrowoo.top.key','utf8'),
  cert:fs.readFileSync('/etc/apache2/ssl/Nginx/4760083_www.sparrowoo.top.pem','utf8')
  }
  const app = (callback, port,host, think) =>{
    var httpsServer = https.createServer(options,callback);
    httpsServer.listen(8080,"0.0.0.0");
    return httpsServer;
  }

module.exports = {
  default_module: 'api',
  createServer:app,
  port:8080,
  host:"8.129.58.221",
  weixin: {
    appid: '', // 小程序 appid
    secret: '', // 小程序密钥
    mch_id: '', // 商户帐号ID
    partner_key: '', // 微信支付密钥
    notify_url: '' // 微信异步通知，例：https://www.nideshop.com/api/pay/notify
  },
  express: {
    // 快递物流信息查询使用的是快递鸟接口，申请地址：http://www.kdniao.com/
    appid: '', // 对应快递鸟用户后台 用户ID
    appkey: '', // 对应快递鸟用户后台 API key
    request_url: 'http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx'
  }
};
