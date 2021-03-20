var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    goodList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    this.getgoodList();
  },
  getgoodList(){
    let that = this;
    util.request(api.GoodsMine).then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          goodList: res.data
        });
      }
    });
  },
  del_mygood:function(e){
    console.log(e);
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
          if (res.confirm) {
            util.request(api.GoodsDestory,{id:e.target.dataset.orderIndex},'POST').then(function (res){
              if (res.errno === 0) {
                console.log(res.data);
                wx.showToast({
                  title:'删除成功',
                  icon:'success',
                  duration:1500
                })
              }else{
                wx.showToast({
                  title:'删除失败',
                  duration:1500
                })
              }
            });
          }
          else{

          }
      }
    });
    
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      goodList:[],
    });
    this.onShow();
    setTimeout(function()
    {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },1500);
},
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.setData({
      goodList:[],
    });
    this.getgoodList();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  createPost: function(){
    wx.navigateTo({
        url: './writer/writer',
      })
},
})