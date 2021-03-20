

const Constants = require('../../utils/constants');
const api = require('../../config/api.js');
const Rest = require('../../utils/rest');
var util = require('../../utils/util.js');
const app = getApp();
Page({
    data: {
        logo: '',
        page:1,
        offset:20,
        background: '',
        //顶部导航
        topNav: [
            {
            index: 0,
            name: '首页'
            },{
            index: 1,
            name: '侃侃而谈'
        },{
            index: 2,
            name: '怼天怼地'
        },{
            index: 3,
            name: '互助时空'
        },{
            index: 4,
            name: '匿名提问'
        },{
            index: 5,
            name: '我的动态'
        }],
        currentTab: 0, //预设当前项的值
        index_articles:[],
        other_articles:[],
        //幻灯片
        slide: [],
        banner:[],
        //图片导航
        iconNav: [],

        //热门文章
        hot: [],

        //热门tab
        postsLast: [],
        loaddingLast: false,
        pullUpOnLast: true,
        
        //其他tab
        posts: [],
        loadding: false,
        pullUpOn: true,

        //列表模式
        listMode: 3,
    },

    onLoad: function (options) {
        let that = this;
        util.request(api.ArticleAdvert).then(res => {
            this.setData({
                banner: res.data.data
            });
          });
        console.log(getApp().globalData);
        //加载文章
        // this.loadPostLast(true);
        this.load_article_Post(true);
    },
      //下拉刷新
  onPullDownRefresh:function()
  {
    let that = this;
    that.setData({
        page:1,
        index_articles:[],
        other_articles:[],
        banner:[]
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    util.request(api.ArticleAdvert).then(res => {
        this.setData({
            banner: res.data.data
        });
      });
    this.load_article_Post();
    //模拟加载
    setTimeout(function()
    {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },1500);
  },
    onReachBottom: function () {
        if (this.data.currentTab == 0) {
            // console.log(this.data.pullUpOnLast);
            if (!this.data.pullUpOnLast) {
                return;
            }else{
                this.load_article_Post(false);
            }
            
            // this.loadPostLast(false);
            
        } else {
            if (!this.data.pullUpOn) {
                return;
            }else{
                this.load_article_Post(false);
            }
            // this.loadPost(false);
        }
    },

    onShareAppMessage: function () {
        return {
            title: getApp().appName,
            path: 'pages/index/index',
        }
    },

    onShareTimeline: function () {
        return {
            title: getApp().appName,
        }
    },

    //nav start----
    handlerSearchClick: function (e) {
        wx.navigateTo({
            url: './search/search'
        })
    },
    //nav end ----

    //slide start----
    handlerSlideChange: function (e) {
        this.setData({
            current: e.detail.current
        })
    },
    //slide end----

    //tab -- start
    swichNav: function (e) {
        this.setData({
            page:1,
            other_articles:"",
        });
        // console.log(e);
        let cur = e.currentTarget.dataset.current;
        if (this.data.currentTab == cur) {
            return false;
        }

        this.setData({
            background: "",
            currentTab: cur
        })

        if (cur >= 0) {
            // this.loadPost(true);
            this.load_article_Post(true);
        }
    },

    handlerTabMoreClick: function (e) {
        wx.switchTab({
          url: '/pages/categories/categories',
        })
    },
    //tab -- end

    handlerIconNavClick: function(e) {
        let link = e.currentTarget.dataset.link;
        this.openLink(link);
    },

    handlerActiveClick: function(e) {
        let link = e.currentTarget.dataset.link;
        this.openLink(link);
    },

    handlerArticleClick: function (e) {
        // console.log(e);
        let post_id = e.currentTarget.dataset.id;
        wx.navigateTo ({
            url: '/pages/article/article?post_id=' + post_id
        })
    },

    //加载数据
    // loadPostLast: function (refresh) {
    //     let that = this;

    //     that.setData({
    //         loaddingLast: true
    //     });

    //     let offset = 0;
    //     if (!refresh) {
    //         offset = that.data.postsLast.length;
    //     }
    // },

    // loadPost: function (refresh) {
    //     let that = this;

    //     that.setData({
    //         loadding: true
    //     });

    //     let offset = 0;
    //     if (!refresh) {
    //         offset = that.data.posts.length;
    //     }

    // },

    openLink: function(link) {
        if(link.startsWith('/pages')) {
            wx.navigateTo({
              url: link,
            })
        } else {
            wx.navigateToMiniProgram({
                appId: link,
                fail: res => {
                    wx.showToast({
                      title: '无效链接',
                    })
                } 
            })
        }
    },

    createPost: function(){
        wx.navigateTo({
            url: './writer/writer',
          })
    },
    isEmptyObject: function (obj) {
        var name;
        for ( name in obj ) {
            return false;
        }
        return true;
    },
    handlerDeleteArticle:function(e){
        let that = this;
    //   console.log(e.currentTarget.dataset.article_id);
      let article_target = e.currentTarget.dataset.article_id;
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success(res) {
            if (res.confirm) {
                util.request(api.ArticleDelete,{
                    article_id:article_target,
                },'POST').then(function(res){
                    if(res.errno==0){
                        wx.showToast({
                            title: '删除成功！', // 标题
                            icon: 'success',  // 图标类型，默认success
                            duration: 1500  // 提示窗停留时间，默认1500ms
                          }).then(function(res){
                            that.setData({
                                page:1,
                                index_articles:[],
                                other_articles:[],
                            })
                            wx.showNavigationBarLoading() //在标题栏中显示加载
                            this.load_article_Post(true);
                            //模拟加载
                            setTimeout(function()
                            {
                              // complete
                              wx.hideNavigationBarLoading() //完成停止加载
                              wx.stopPullDownRefresh() //停止下拉刷新
                            },1500);
                          })
                    }else{
                        wx.showToast({
                            title: '删除失败！', // 标题
                            duration: 1500  // 提示窗停留时间，默认1500ms
                          })
                      }
                });
            }
        }
    });
      
    },
    load_article_Post: function (refresh) {
        var that = this;
        if(refresh){
            this.setData({
                page:1,
            })
        }
        util.request(api.ArticleList,{
            page:this.data.page,
            offset:20,
            article_type:this.data.currentTab,
        }).then(function(res){
                  console.log(res);
                      if(res.errno==0){
                        var if_empty = that.isEmptyObject(res.data);
                        if(if_empty){
                            if(that.data.currentTab==0){
                                that.setData({
                                    pullUpOnLast:false,
                                    loaddingLast:false
                                });
                            }else{
                                that.setData({
                                    pullUpOn:false,
                                    loadding:false
                                });
                            }
                            // console.log(that.data.pullUpOnLast);
                        }else{
                            if(that.data.currentTab==0){
                                var temp_index_articles = Object.assign(that.data.index_articles,res.data);
                                that.setData({
                                    index_articles:temp_index_articles,
                                    loaddingLast:false,
                                    page:that.data.page+1,
                                });
                                // console.log(that.data.page);
                            }else{
                                var temp_index_articles = Object.assign(that.data.other_articles,res.data);
                                that.setData({
                                    other_articles:temp_index_articles,
                                    loadding:false,
                                    page:that.data.page+1,
                                });
                                // console.log(that.data.page);
                            }
                            
                        }
                  }
                })
    }
})