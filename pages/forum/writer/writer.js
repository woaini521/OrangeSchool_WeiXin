// import {navList,getLabel} from '../../utils/utils'
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const app = getApp();
Page({
    data:{
        sendForm:{},
        // topicArray:getLabel(navList),
        article_sort:["侃侃而谈","怼天怼地","互助时空","匿名提问"],
        article_sort_index:0,
        disabled:false,
        user_id:0,
        formats: {},
        article_content:"",
        readOnly: false,
        placeholder: '开始输入...(要求少于3000字)',
        editorHeight: 300,
        keyboardHeight: 0,
        isIOS: false,
        textarea_length:2000,
        thumbnail:"",
        have_img:false,
        images_url:new Array()
    },
    
      onLoad:function() {
        var that = this;
        // console.log(app.globalData.userInfo);
        // Get_UserInfo();
        this.setData({
            user_id:app.globalData.user_id,
        });
        // console.log(this.data.loginInfo);
        const platform = wx.getSystemInfoSync().platform
        if(platform==='ios'){
            this.setData({ isIOS:true})
        }
        // this.updatePosition(0)
        let keyboardHeight = 0
        wx.onKeyboardHeightChange(res => {
          if (res.height === keyboardHeight) return
          const duration = res.height > 0 ? res.duration * 1000 : 0
          keyboardHeight = res.height
          that.setData({
            keyboardHeight:res.height
          });
          setTimeout(() => {
            wx.pageScrollTo({
              scrollTop: 0,
              success() {
                // that.updatePosition(keyboardHeight)
                that.editorCtx.scrollIntoView()
              }
            })
          }, duration)
    
        })
      },
      readOnlyChange() {
        this.setData({
          readOnly: !this.data.readOnly
        })
      },

    // updatePosition(keyboardHeight) {
    //     const toolbarHeight = 50
    //     const { windowHeight, platform } = wx.getSystemInfoSync()
    //     console.log(windowHeight);
    //     let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    //     this.setData({ editorHeight, keyboardHeight })
    //   },
      calNavigationBarAndStatusBar() {
        const systemInfo = wx.getSystemInfoSync()
        const { statusBarHeight, platform } = systemInfo
        const isIOS = platform === 'ios'
        const navigationBarHeight = isIOS ? 44 : 48
        return statusBarHeight + navigationBarHeight
      },
      onEditorReady() {
        const that = this
        this.createSelectorQuery().select('#editor').context(function (res) {
          that.editorCtx = res.context
        }).exec()
      },
      blur() {
        this.editorCtx.blur()
      },
      format(e) {
        let { name, value } = e.target.dataset
        if (!name) return
        // console.log('format', name, value)
        this.editorCtx.format(name, value)
    
      },
      onStatusChange(e) {
        const formats = e.detail
        this.setData({ formats })
      },
      insertDivider() {
        this.editorCtx.insertDivider({
          success: function () {
            console.log('insert divider success')
          }
        })
      },
      clear() {
        this.editorCtx.clear({
          success: function (res) {
            console.log("clear success")
          }
        })
      },
      removeFormat() {
        this.editorCtx.removeFormat()
      },
      insertDate() {
        const date = new Date()
        const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        this.editorCtx.insertText({
          text: formatDate
        })
      },
      insertImage() {
        let that = this;
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'], 
          success: function (res) {
            let path = res.tempFilePaths[0];
				let size = res.tempFiles[0].size / 1024;
				if (size > 100) { //大于100k压缩
					wx.getImageInfo({
						src: path,
						success(res) {
							//console.log('获得原始图片大小',res.width)
							let originWidth, originHeight;
							originHeight = res.height;
							originWidth = res.width;
							console.log(originWidth);
							//压缩比例
							// 最大尺寸限制
							let maxWidth = originWidth * that.data.scale,
								maxHeight = originHeight * that.data.scale;
							// 目标尺寸
							let targetWidth = originWidth,
								targetHeight = originHeight;
							//等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
							if (originWidth > maxWidth || originHeight > maxHeight) {
								if (originWidth / originHeight > maxWidth / maxHeight) {
									// 要求宽度*(原生图片比例)=新图片尺寸
									targetWidth = maxWidth;
									targetHeight = Math.round(maxWidth * (originHeight / originWidth));
								} else {
									targetHeight = maxHeight;
									targetWidth = Math.round(maxHeight * (originWidth / originHeight));
								}
							}
							//更新canvas大小
							that.setData({
								cw0: targetWidth,
								ch0: targetHeight
							});
							let id = "myCanvas0";
							//尝试压缩文件，创建 canvas
							let ctx = wx.createCanvasContext(id);
							ctx.clearRect(0, 0, targetWidth, targetHeight);
							ctx.drawImage(path, 0, 0, targetWidth, targetHeight);
							ctx.draw();
							wx.showLoading({
								title: "压缩中..."
							})
							//保存图片
							setTimeout(function() {
								wx.canvasToTempFilePath({
									fileType: "jpg",
									canvasId: id,
									success: (res) => {
										//写入图片数组
										let uploadFile = res.tempFilePath;
										wx.uploadFile({
                      url:api.ArticlePic,
                      filePath:uploadFile,
                      name:'article_pic',
                      header: {
                        'Content-Type': 'application/json',
                        'X-Nideshop-Token': wx.getStorageSync('token')
                      },
                      success(rees){
                        if(rees.errMsg=="uploadFile:ok"){
                          let temp_data = JSON.parse(rees.data);
                          console.log(temp_data);
                          that.editorCtx.insertImage({
                            src: temp_data.data.fileUrl,
                            // data: {
                            //   id: 'abcd',
                            //   role: 'god'
                            // },
                            width: '70%',
                            success: function () {
                              if(!that.data.have_img){
                                that.setData({
                                  have_img:true,
                                  thumbnail:temp_data.data.fileUrl
                                })
                              }
                              console.log('insert image success');
                              that.data.images_url.push(temp_data.data.fileUrl);
                            }
                          })
                        }
                          
                        
                      }
                    });
										wx.hideLoading()
									},
									fail: (err) => {
										console.error(err)
									}
								}, this)
							}, 500);
						}
					})
				} else {
          wx.uploadFile({
            url:api.ArticlePic,
            filePath:res.tempFilePaths[0],
            name:'article_pic',
            header: {
              'Content-Type': 'application/json',
              'X-Nideshop-Token': wx.getStorageSync('token')
            },
            success(rees){
              if(rees.errMsg=="uploadFile:ok"){
                let temp_data = JSON.parse(rees.data);
                console.log(temp_data);
                that.editorCtx.insertImage({
                  src: temp_data.data.fileUrl,
                  // data: {
                  //   id: 'abcd',
                  //   role: 'god'
                  // },
                  width: '70%',
                  success: function () {
                    if(!that.data.have_img){
                      that.setData({
                        have_img:true,
                        thumbnail:temp_data.data.fileUrl
                      })
                    }
                    console.log('insert image success');
                    that.data.images_url.push(temp_data.data.fileUrl);
                  }
                })
              }
                
              
            }
          });
				}
          }
        })
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
    formSubmit:function(e){
        let that = this;
        console.log('form发生了submit事件，携带数据为：', e);
        console.log(that.data.article_sort_index);
        if(e.detail.value.title.length>30||e.detail.value.title==""){
          wx.showModal({
            title: '提示',
            content: '标题应小于30个字且不为空',
            success(res) {
            }
        });
        return;
        }else if(e.detail.value.abstract.length>100||e.detail.value.abstract==""){
          wx.showModal({
            title: '提示',
            content: '摘要应小于100个字且不为空',
            success(res) {
            }
        });
        return;
        }
       
        that.editorCtx.getContents({
            success: function (res) {   
                console.log(res.html);
                that.setData({
                  article_content:res.html
                });
                //发送请求
                if(res.html.length>3000||res.html==""){
                  wx.showModal({
                    title: '提示',
                    content: '正文应小于3000个字且不为空',
                    success(res) {
                    }
                });
                return;
                }
        var date = new Date();
        var time = that.getdate(date);
        var header = {
            'content-type': "application/x-www-form-urlencoded",
            // 'cookie':getApp().globalData.tribune_cookie,
        };
        util.request(api.ArticlePost,{
            "article_header":e.detail.value.title,
            "article_abstract":e.detail.value.abstract,
            "article_content":that.data.article_content,
            "article_post_time":time,
            "article_type":parseInt(that.data.article_sort_index)+1,
            "thumbnail":that.data.thumbnail,
            "images_url":that.data.images_url
        },'POST').then(function(res){
                  console.log(res);
                      if(res.errno==0){
                          wx.showToast({
                              title:'发布成功',
                              icon:'success',
                              duration:1500
                          }).then(function(res){
                            wx.navigateBack({
                                delta: 1
                              })
                          })
                  }else{
                    wx.showToast({
                      title:'发布失败',
                      duration:1500
                  })
                  }
                });
            },
            fail: function (error){
                console.log(error)
                wx.showToast({
                  title:'发布失败',
                  duration:1500
              })
            }
        })
        
              }
        });

