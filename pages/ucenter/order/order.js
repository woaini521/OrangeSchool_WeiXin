var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    this.getOrderList();
  },
  getOrderList(){
    let that = this;
    util.request(api.OrderList).then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderList: res.data.data
        });
      }
    });
  },
  payOrder(e){
    console.log(e);
    var order_index = e.target.dataset.orderIndex;
    var orderid = this.data.orderList[order_index].id;
    var actualPrice = this.data.orderList[order_index].actual_price;
    wx.redirectTo({
      url: '/pages/pay/pay?orderId='+orderid+"&actualPrice="+actualPrice,
      options:{
        orderId:orderid,
        actualPrice:actualPrice,
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})