var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    array: ['请选择反馈类型', '商品相关', '物流状况', '客户服务', '优惠活动', '功能异常', '产品建议', '其他'],
    index: 0,
    content:"",
    phone:""
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e)
    this.setData({
      index: e.detail.value
    })
  },
  bindFormSubmit: function (e) {
    if(this.data.index<=0||e.detail.value.content==""){
      wx.showToast({
        title:'请选择反馈类型！',
        icon:'none',
        duration:1500
      });
      return;
    }else{
      console.log('FormSubmit，携带值为', e);
    }
    
  },
  onLoad: function (options) {
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  }
})