

const Constants = require('../../utils/constants');
// const Util = require('../../utils/util');
const Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const Rest = require('../../utils/rest');
const Auth = require('../../utils/auth');
const WxParse = require('../../components/wxParse/wxParse');
const Poster = require('../../components/poster/poster/poster');

Page({

    data: {
        user_id:"",
        post: {},
        post_like: 0,
        post_favorite: 0,
        comment_count: 0,
        comments: [],
        loadding: false,
        pullUpOn: true,
        loaded: false,
        show_comment_submit: false,
        comment_content: '',
        comment_count_change: 0,
        page:1,
        post_id: 0,
        comment_id: 0,
        needRefresh: true,
        //小程序码
        wxacode: '',
    },
    
    
    

    //返回页面是否需要刷新
    

    onLoad: function (options) {
        if (options.scene) {
            this.data.post_id = decodeURIComponent(options.scene);
        } else if (options.post_id) {
            this.data.post_id = options.post_id;
        }
        //小程序码
        this.loadWxacode();
    },

    onShow: function () {
        
        if (!this.data.needRefresh) {
            this.data.needRefresh = true;
            return;
        }

        let that = this;
        this.setData({
            user_id:getApp().globalData.user_id,
        })
        util.request(api.ArticleInfo,{
            article_id:that.data.post_id,
        }).then(function(res){
            if(res.errno==0){
                // console.log(res);
                      that.setData({
                        post: res.data,
                        // post_like: res.data.user.islike,
                        // post_favorite: res.data.user.isfavorite,
                        comment_count: Number(res.data.num_comment),
                        // like_list: res.data.like_list,
                    });
                    WxParse.wxParse('article', 'html', res.data.article_content, that, 5);
            }else{

            }
        });
        this.loadComments(true);
    },
          //下拉刷新
  onPullDownRefresh:function()
  {
    let that = this;
    this.setData({
        page:1,
        post: {},
        post_like: 0,
        post_favorite: 0,
        comment_count: 0,
        comments: [],
        loadding: false,
        pullUpOn: true,
        loaded: false,
        show_comment_submit: false,
        comment_content: '',
        comment_count_change: 0,
        needRefresh:true
    });
    // console.log(this.data.page);
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow();
    //模拟加载
    setTimeout(function()
    {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },1500);
  },
    onReachBottom: function () {
        if (!this.data.pullUpOn) {
            return;
        }

        this.loadComments(false);
    },

    onShareAppMessage: function () {
        return {
            title: this.data.post.title,
            imageUrl: this.data.post.thumbnail,
            path: 'pages/article/article?post_id=' + this.data.post_id,
        }
    },

    onShareTimeline: function () {
        return {
            title: this.data.post.title,
            query: 'post_id=' + this.data.post_id,
            imageUrl: this.data.post.thumbnail,
        }
    },

    /**
     * 海报分享
     */
    // sharePosterClick: function (e) {
    //     let posterConfig = {
    //         width: 750,
    //         height: 1334,
    //         backgroundColor: '#E6372F',
    //         debug: false,
    //         pixelRatio: 1,
    //         blocks: [{
    //             width: 690,
    //             height: 1000,
    //             x: 30,
    //             y: 234,
    //             backgroundColor: '#FFFFFF'
    //         }, ],
    //         texts: [{
    //                 x: 375,
    //                 y: 120,
    //                 baseLine: 'middle',
    //                 textAlign: 'center',
    //                 text: this.data.post.title,
    //                 width: 600,
    //                 fontSize: 38,
    //                 color: '#FFFFFF',
    //             },
    //             {
    //                 x: 70,
    //                 y: 780,
    //                 fontSize: 28,
    //                 lineHeight: 40,
    //                 baseLine: 'middle',
    //                 text: this.data.post.excerpt,
    //                 width: 600,
    //                 lineNum: 3,
    //                 color: '#000000',
    //                 zIndex: 200,
    //             },
    //             {
    //                 x: 360,
    //                 y: 1170,
    //                 baseLine: 'middle',
    //                 textAlign: 'center',
    //                 text: getApp().appName,
    //                 fontSize: 28,
    //                 color: '#888888',
    //                 zIndex: 200,
    //             }
    //         ],
    //         images: [
    //             {
    //                 width: 690,
    //                 height: 520,
    //                 x: 30,
    //                 y: 200,
    //                 url: this.data.post.thumbnail,
    //                 zIndex: 100
    //             },
    //             {
    //                 width: 200,
    //                 height: 200,
    //                 x: 275,
    //                 y: 920,
    //                 url: this.wxacode,
    //             }
    //         ]

    //     }

    //     this.setData({
    //         posterConfig: posterConfig
    //     }, () => {
    //         Poster.create(true); // 入参：true为抹掉重新生成 
    //     });
    // },

    /**
     * 画报生成成功
     */
    // onPosterSuccess(e) {
    //     this.data.needRefresh = false;

    //     const {
    //         detail
    //     } = e;
    //     wx.previewImage({
    //         current: detail,
    //         urls: [detail]
    //     })
    // },

    /**
     * 画报生成失败
     */
    // onPosterFail(err) {
    //     console.error(err);
    // },

    /**
     * 文章中a标签点击
     */
    wxParseTagATap: function (e) {
        wx.setClipboardData({
            data: e.currentTarget.dataset.src
        });
    },

    /**
     * 点击 TAG
     */
    handlerTagClick: function (e) {
        let tag_id = e.currentTarget.dataset.id;
        let tag = e.currentTarget.dataset.tag;
        wx.navigateTo({
            url: '/pages/list/list?title=' + tag + '&tag_id=' + tag_id,
        })
    },

    /**
     * 跳转返回
     */
    jumpBtn: function (options) {
        Util.navigateBack();
    },

    /**
     * 文章 点赞
     */
    handlerLikeClick: function (e) {
        let that = this;
        util.request(api.ArticleLike,{
            post_like:that.data.post_like,
            article_id:that.data.post_id
        }).then(function(res){
            if(res.errno==0){
                that.setData({
                    post_like: (that.data.post_like == 1 ? 0 : 1),
                });
            }
        });
    },

    /**
     * 评论 弹框
     */
    handlerCommentClick: function (e) {
        this.data.comment_id = 0;
        this.setData({
            show_comment_submit: true
        });
    },

    /**
     * 评论 取消
     */
    handlerCancelClick: function (e) {
        this.setData({
            show_comment_submit: false
        });
    },
    getdate :function (date) {
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
    /**
     * 评论 提交
     */
    handlerCommentSubmit: function (e) {
        let that = this;
        var date = new Date();
        var time = this.getdate(date);
        util.request(api.ArticleCommentPost,{
            comment_content:that.data.comment_content,
            post_date:time,
            article_id:that.data.post_id
        },'POST').then(function(res){
            if(res.errno==0){
                that.setData({
                    show_comment_submit: false,
                    comment_count:that.data.comment_count+1,
                });
                that.loadComments(true);
            }
        });

    },

    /**
     * 评论 回复
     */
    // handlerCommentReplyClick: function (e) {
    //     this.data.comment_id = e.currentTarget.dataset.id;
    //     this.setData({
    //         show_comment_submit: true
    //     });
    // },

    /**
     * 评论 删除
     */
    handlerCommentDeleteClick: function (e) {
        let that = this;
        // console.log(e);
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success(res) {
                if (res.confirm) {
                    let comment_id = e.currentTarget.dataset.id;
                    util.request(api.ArticleCommentDelete,{comment_id: comment_id},'POST').then(function(res){
                        if(res.errno==0){
                            that.setData({
                                comment_count_change: that.data.comment_count_change - 1
                            });
                            that.loadComments(true);
                        }
                    });
                }
            }
        });
    },

    /**
     * 评论输入
     */
    handlerContentInput: function (e) {
        // console.log(e.detail.value);
        this.setData({
            comment_content: e.detail.value
        });
    },

    /**
     * 文章 收藏
     */
    handlerFavoriteClick: function (e) {
        let that = this;

    },

    /**
     * 加载小程序码
     */
    loadWxacode: function () {
        let that = this;
        // Rest.get(Api.JIANGQIE_POST_WXACODE, {
        //     post_id: that.post_id
        // }).then(res => {
        //     that.wxacode = res.data;
        // }, err => {
        //     console.log(err);
        // });
    },

    /**
     * 加载 评论
     */
    isEmptyObject: function (obj) {
        var name;
        for ( name in obj ) {
            return false;
        }
        return true;
    },
    loadComments: function (refresh) {
        let that = this;

        that.setData({
            loadding: true
        });

        let offset = 0;
        if (!refresh) {
            offset = that.data.comments.length;
        }
        if(refresh){
            that.setData({
                page:1,
            })
        }
        util.request(api.ArticleCommentList,{article_id:that.data.post_id,page:that.data.page,offset:20}).then(function(res){
            if(res.errno==0){
                that.setData({
                    loaded: true,
                    loadding: false,
                    comments: refresh ? res.data : that.data.comments.concat(res.data),
                });
                // console.log(that.data.page)
                that.data.page=that.data.page+1;
                // console.log(that.data.comments)
                if(that.isEmptyObject(res.data)){
                    that.setData({
                        pullUpOn: false,
                    });
                }
            }
        });
    },

    handlerLoginCancelClick: function (e) {
        this.setData({
            showPopLogin: false
        });
    },

    handlerDoLoginClick: function (e) {
        wx.navigateTo({
            url: '/pages/login/login',
        });
        this.setData({
            showPopLogin: false
        });
    },
})