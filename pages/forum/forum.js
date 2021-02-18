

const Constants = require('../../utils/constants');
const Api = require('../../utils/api.js');
const Rest = require('../../utils/rest');
const app = getApp();
Page({
    data: {
        logo: '',
        page:0,
        offset:20,
        background: '',
        //顶部导航
        topNav: [{
            id: 0,
            name: '侃侃而谈'
        },{
            id: 1,
            name: '怼天怼地'
        },{
            id: 2,
            name: '互助时空'
        },{
            id: 3,
            name: '我的动态'
        },],
        currentTab: 0, //预设当前项的值
        index_articles:[],
        other_articles:[],
        //幻灯片
        slide: [],

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

        //获取配置
        // Rest.get(Api.JIANGQIE_SETTING_HOME).then(res => {
        //     let logo = '../../images/logo.png';
        //     if (res.data.logo && res.data.logo.length > 0) {
        //         logo = res.data.logo;
        //     }
        //     that.setData({
        //         logo: logo,
        //         // topNav: that.data.topNav.concat(res.data.top_nav),
        //         slide: res.data.slide,
        //         iconNav: res.data.icon_nav,
        //         actives: res.data.actives,
        //         hot: res.data.hot,
        //         listMode: res.data.list_mode,
        //         background: (res.data.slide && res.data.slide.length>0)?Api.JIANGQIE_BG_INDEX:'',
        //     });

        //     if (res.data.title && res.data.title.length > 0) {
        //         getApp().appName = res.data.title;
        //     }
        // })
        console.log(getApp().globalData);
        //加载文章
        this.loadPostLast(true);
        this.load_article_Post(true);
        
        wx.request({
            url: 'https://sparrowoo.top:8234/user/Login', //登录
            method:'POST',
            data: {
              "open_id":getApp().globalData.user.openid,
              "username":getApp().globalData.userInfo.nickName
            },
            header: {
                'content-type': "application/x-www-form-urlencoded"
            },
            success (res) {
            //   console.log(res);
              getApp().globalData.tribune_cookie = res["cookies"][0].split(" ")[0]+res["cookies"][1].split(" ")[0];
            //   console.log(getApp().globalData.tribune_cookie);
            }
          })
    },
      //下拉刷新
  onPullDownRefresh:function()
  {
    let that = this;
    that.setData({
        page:0,
        index_articles:"",
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
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
            console.log(this.data.pullUpOnLast);
            if (!this.data.pullUpOnLast) {
                return;
            }
            
            // this.loadPostLast(false);
            this.load_article_Post(false);
        } else {
            if (!this.data.pullUpOn) {
                return;
            }
            this.load_article_Post(false);
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
            url: '/pages/search/search'
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
            page:0,
            other_articles:"",
        });
        console.log(this.data.other_articles);
        let cur = e.currentTarget.dataset.current;
        if (this.data.currentTab == cur) {
            return false;
        }

        this.setData({
            background: (cur==0 && this.data.slide && this.data.slide.length>0)?Api.JIANGQIE_BG_INDEX:'',
            currentTab: cur
        })

        if (cur !== 0) {
            this.loadPost(true);
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
        console.log(e);
        let post_id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/article/article?post_id=' + post_id
        })
    },

    //加载数据
    loadPostLast: function (refresh) {
        let that = this;

        that.setData({
            loaddingLast: true
        });

        let offset = 0;
        if (!refresh) {
            offset = that.data.postsLast.length;
        }

        Rest.get(Api.JIANGQIE_POSTS_LAST, {
            'offset': offset
        }).then(res => {
            that.setData({
                loaddingLast: false,
                postsLast: refresh ? res.data : that.data.postsLast.concat(res.data),
                pullUpOnLast: res.data.length >= Constants.JQ_PER_PAGE_COUNT
            });
        })
    },

    loadPost: function (refresh) {
        let that = this;

        that.setData({
            loadding: true
        });

        let offset = 0;
        if (!refresh) {
            offset = that.data.posts.length;
        }

        Rest.get(Api.JIANGQIE_POSTS_CATEGORY, {
            'offset': offset,
            'cat_id': that.data.topNav[that.data.currentTab].id
        }).then(res => {
            that.setData({
                loadding: false,
                posts: refresh ? res.data : that.data.posts.concat(res.data),
                pullUpOn: res.data.length >= Constants.JQ_PER_PAGE_COUNT
            });
        })
    },

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
    load_article_Post: function (refresh) {
        this.setData({
            page:this.data.page+1,
        })
        var that = this;
        wx.request({
            url:"https://sparrowoo.top:8234/Articles/Info",
            method:'GET',
            data:{
                page:this.data.page,
                offset:20,
                article_type:this.data.currentTab
            },
            header: {
                'content-type': "application/json"
            },
            success (res) {
                console.log(res);
                var if_empty = that.isEmptyObject(res.data.results);
                if(if_empty){
                    if(that.data.currentTab==0){
                        that.setData({
                            pullUpOnLast:false,
                        });
                    }else{
                        that.setData({
                            pullUpOn:false
                        });
                    }
                    console.log(that.data.pullUpOnLast);
                }else{
                    if(that.data.currentTab==0){
                        var temp_index_articles = Object.assign(that.data.index_articles,res.data.results);
                        that.setData({
                            index_articles:temp_index_articles,
                        });
                        console.log(that.data.index_articles);
                    }else{
                        var temp_index_articles = Object.assign(that.data.other_articles,res.data.results);
                        that.setData({
                            other_articles:temp_index_articles,
                        });
                        console.log(that.data.other_articles);
                    }
                    
                }
            }
        })
    }
})