// import {navList,getLabel} from '../../utils/utils'
const util = require('/../../../../utils/util.js');
const api = require('../../../../config/api.js');

// const { forEach } = require('../../../../utils/lodash.js');
const app = getApp();
Page({
    data:{
        sendForm:{},
        categoryList:[],
        // topicArray:getLabel(navList),
        // good_sort:["二手交易","以物换物"],
        good_sort:{
          name:["二手交易","以物换物"],
          id:[1036005,1036007]
        },
        good_sort_index:0,
        disabled:false,
        loginInfo:{},
        imgList:[],
        img_url:[]
    },
        onLoad:function(){
            var that = this;
            var cate_id=[];
        // console.log(app.globalData.userInfo);
        // Get_UserInfo();
        this.setData({
            loginInfo:app.globalData.userInfo,
        });
        util.request(api.CatalogList).then(function (res) {
          console.log(res);
          if (res.errno === 0) {
            console.log(res.data.categoryList);
            that.setData({
              categoryList:res.data.categoryList,
            });
            console.log(that.data.categoryList);
            for(var item in that.data.categoryList){
              // console.log(item);
              if(that.data.categoryList[item].name == "二手"){
                cate_id[0]=that.data.categoryList[item].id;
                util.request(api.CatalogCurrent,{id:cate_id[0]}).then(function (res) {
                  let currentCategoryList = res.data.currentCategory;
                  that.setData({
                    good_sort:{name:["二手交易","以物换物"],id:[currentCategoryList.subCategoryList[0].id,currentCategoryList.subCategoryList[1].id]},
                  });
                  console.log(that.data.good_sort);
                })
                break;
              }
              };
            
          }
        });
      },
    ChooseImage() {
      let that = this;
        wx.chooseImage({
          count: 9, //默认9
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album','camera'], //从相册选择
          success: (res) => {
            if (this.data.imgList.length != 0) {
              this.setData({
                imgList: this.data.imgList.concat(res.tempFilePaths)
              })
            } else {
              this.setData({
                imgList: res.tempFilePaths
              })
            };
            
          }
        });
        
      },
    // onLoad:function(){
    //     let that = this
    //   wx.getStorage({
    //       key:'loginInfo',
    //       success:function(res){
    //           that.setData({loginInfo:res.data})
    //       }
    //   })
    // },
    // pickerHandler:function(e){
    //     //console.log('携带数据为：', e.detail.value)
    //     this.setData({pickerIndex:e.detail.value})
    // },
    ViewImage:function(e){
      console.log(e);
    },
    DelImg:function(e){
      console.log(e);
      console.log(this.data.imgList);
      this.data.imgList.splice(e.currentTarget.dataset.index,1);
      this.setData({
        imgList: this.data.imgList
      });
      console.log(this.data.imgList);
    },
    getdate(date) {
        var year = date.getFullYear();
        var month = date.getMonth()+1; 
        var day = date.getDate(); 
        var hours = date.getHours(); 
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        let time =
            year +
            "-" +
            month +
            "-" +
            day +
            " " +
            hours +
            ":" +
            minutes +
            ":" +
            seconds;
        return time 
    },
    // bindPickerChange:function(e){
    //   console.log(e);
    //   console.log(this.data.good_sort.id[e.detail.value]);
    //   console.log(this.data.good_sort.id[this.data.good_sort_index]);
    // },
    storeImg(){
      return new Promise(resolve=>{
        setTimeout(() => {
        let that = this;
        for(var item in that.data.imgList){
          wx.uploadFile({
            url: api.GoodsPicStore,
            filePath: that.data.imgList[item],
            name: 'good_pic',
            header: {
              'Content-Type': 'application/json',
              'X-Nideshop-Token': wx.getStorageSync('token')
            },
            success: function (res) {
            //  console.log(res);
            if(res.errMsg=="uploadFile:ok"){
              let temp_data = JSON.parse(res.data);
              
                that.setData({
                img_url:that.data.img_url.concat(temp_data.data.fileUrl)
                })
                console.log(that.data.img_url);
            }
          }
           })
        }
        resolve(that.data.img_url);
      },0);
      })
    },
    // number: function (e) {
    //   let value = this.validateNumber(e.detail.value)
    //   console.log(e.detail.value)
    //   console.log(value);
    //   this.setData({
    //     //parseInt将数字字符串转换成数字
    //     number: parseInt(value)
    //   })
    // },
    validateNumber(val) {
      //正则表达式指定字符串只能为数字
      return val.replace(/\D/g, '')
    },
    // jian: function () {
    //   if (this.data.number <= 0) {
    //     this.setData({
    //       number: 0
    //     })
    //   } else {
    //     this.setData({
    //       number: this.data.number - 1
    //     })
    //   }
  
    // },
    jia: function () {
      var value = this.data.number
      this.setData({
        number: value + 1
      })
    },
    // 组织函数队列
    reduce(arr) {
      var sequence = Promise.resolve()

      arr.forEach(function(item) {
          sequence = sequence.then(item)
      })

      return sequence
    },
    formSubmit:async function(e){
            let that = this;
              console.log('form发生了submit事件，携带数据为：', e);
              if(e.detail.value.name.length>140||e.detail.value.name==""){
                wx.showModal({
                  title: '提示',
                  content: '名称应小于140个字且不为空',
                  success(res) {
                  }
              });
              return;
              }else if(e.detail.value.goods_brief.length>200||e.detail.value.goods_brief==""){
                  wx.showModal({
                    title: '提示',
                    content: '简介应小于200个字且不为空',
                    success(res) {
                    }
                });
                return;
              }
              else if(e.detail.value.goods_desc.length>1000||e.detail.value.goods_desc==""){
                wx.showModal({
                  title: '提示',
                  content: '商品介绍应小于1000个字且不为空',
                  success(res) {
                  }
              });
              return;
            }else if(e.detail.value.goods_number==""){
              wx.showModal({
                title: '提示',
                content: '商品数目应不为空',
                success(res) {
                }
            });
            return;
          }else if(e.detail.value.retail_price==""){
            wx.showModal({
              title: '提示',
              content: '商品价格应不为空',
              success(res) {
              }
          });
          return;
        }
              // console.log(this.data.good_sort_index);
              // console.log(this.data.img_url);
              //发送请求
              // var date = new Date();
              // var time = this.getdate(date);
                that.storeImg().then((e1)=>{
                  return that.post_goods(e1);
                });
                // setTimeout(()=>{
                // await that.post_goods(e);
                // },2000);
      
          },
          post_goods(e){
            
      return new Promise(resolve=>{
        
        setTimeout(()=>{
          var that = this;
          console.log(that.data.img_url);
          util.request(api.GoodsStore,{
            "img_url":that.data.img_url,
            "id":0,
            "category_id":that.data.good_sort.id[that.data.good_sort_index],
            "goods_sn":0,
            "name":e.detail.value.name,
            "goods_desc":e.detail.value.goods_desc,
            "keywords":"",
            "brand_id":0,
            "goods_brief":e.detail.value.goods_brief,
            "goods_number":that.validateNumber(e.detail.value.goods_number),
            "is_on_sale":0,
            "add_time":parseInt(Date.now()/1000).toString(),
            "sort_order":100,
            "is_delete":0,
            "counter_price":0,
            "extra_price":0,
            "is_new":false,
            "goods_unit":"件",
            "primary_pic_url":"",
            "list_pic_url":"",
            "retail_price":that.validateNumber(e.detail.value.retail_price),
            "sell_volume":0,
            "primary_product_id":0,
            "unit_price":0,
            "promotion_desc":that.data.good_sort.name[that.data.good_sort_index],
            "promotion_tag":that.data.good_sort.name[that.data.good_sort_index],
            "app_exclusive_price":0,
            "is_app_exclusive":0,
            "is_limited":0,
            "is_hot":false
          },'POST').then(function(res){
            if(res.errno==0){
              wx.showToast({
                title:'发布成功',
                icon:'success',
                duration:2000
            })
            wx.navigateBack({
              delta: 1,
          });
            }else{
              wx.showModal({
                title:'发布提醒',
                content:"发布失败",
                success: function (res) {
                  if (res.confirm) {//这里是点击了确定以后
                    console.log('用户点击确定');
                      wx.navigateBack({
                          delta: 1,
                      });
                      resolve();
                  } else {//这里是点击了取消以后
                    console.log('用户点击取消');
                      wx.navigateBack({
                          delta: 1,
                      });
                      resolve();
                  }
                }
            })
            }
          });

        },1000);
        
      });
      
    }
})