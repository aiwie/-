// pages/mycompanyproject/mycompanyproject.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: app.globalData.apiUrl,
        usercode: [],
        corporationList: [], //我的公司数据
        projectList: [], //我的项目数据
        windowHeight: '',
        statusType: {
            currentTab: '0',
            data: [{
                name: "我的公司",
                page: 0,
            }, {
                name: "我的项目",
                page: 0,
            }]
        },
        myProjectList: [{
            state: 0,
            title: '中铁十一局集团有限公司',
            subhead: '轨道交通',
            content: '上海轨道交通14号线22标丰浜车辆段',
            duration: '2017.11.01-2019.12.31',
            area: '132.8万㎡',
            projecttype: '铁路',
        }, {
            state: 1,
            title: '中铁十一局集团有限公司',
            subhead: '轨道交通',
            content: '彭酉路',
            duration: '2017.11.01-2019.12.31',
            area: '132.8万㎡',
            projecttype: '房建',
        }, {
            state: 1,
            title: '中铁十一局集团有限公司',
            subhead: '项目3',
            content: '项目3',
            duration: '2017.11.01-2019.12.31',
            area: '132.8万㎡',
            projecttype: '隧道',
        },
        {
            state: 0,
            title: '中铁十一局集团有限公司',
            subhead: '轨道交通',
            content: '上海轨道交通14号线22标丰浜车辆段',
            duration: '2017.11.01-2019.12.31',
            area: '132.8万㎡',
            projecttype: '铁路',
        }, {
            state: 1,
            title: '中铁十一局集团有限公司',
            subhead: '轨道交通',
            content: '彭酉路',
            duration: '2017.11.01-2019.12.31',
            area: '132.8万㎡',
            projecttype: '房建',
        }, {
            state: 1,
            title: '中铁十一局集团有限公司',
            subhead: '项目3',
            content: '项目3',
            duration: '2017.11.01-2019.12.31',
            area: '132.8万㎡',
            projecttype: '隧道',
        },
        {
            state: 0,
            title: '中铁十一局集团有限公司',
            subhead: '轨道交通',
            content: '上海轨道交通14号线22标丰浜车辆段',
            duration: '2017.11.01-2019.12.31',
            area: '132.8万㎡',
            projecttype: '铁路',
        }, {
            state: 1,
            title: '中铁十一局集团有限公司',
            subhead: '轨道交通',
            content: '彭酉路',
            duration: '2017.11.01-2019.12.31',
            area: '132.8万㎡',
            projecttype: '房建',
        }, {
            state: 1,
            title: '中铁十一局集团有限公司',
            subhead: '项目3',
            content: '项目3',
            duration: '2017.11.01-2019.12.31',
            area: '132.8万㎡',
            projecttype: '隧道',
        }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        let systemInfo = wx.getSystemInfoSync()
        this.setData({
            windowHeight: systemInfo.windowHeight
        })
        that.setData({
            usercode: wx.getStorageSync('usercode')
        })
        that.getEmployeeCorporationList();
        that.getEmployeeProjectList();
    },

    /**
     * 查询当前用户所有公司列表
     */
    getEmployeeCorporationList() {
        var that = this;
        var url = that.data.url + "/token-service/corporation/20/selectEmployeeCorporationList";
        var param = {
            token: that.data.usercode.token
            // token: '783dcdb4b969450ca78534bd3e64e066'
        };
        util.getPostData(url, param).then(result => {
            if (result.data.code === 1) {
                wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
                    title: '加载中',
                    icon: 'loading',
                });
                setTimeout(() => {
                    that.setData({
                        corporationList: result.data.data.list
                    })
                    wx.hideLoading();
                }, 500)
            }
        });
    },

    /**
     * 查询当前用户所有项目列表
     */
    getEmployeeProjectList() {
        var that = this;
        var url = that.data.url + "/token-service/project/20/selectEmployeeProjectList";
        var param = {
            token: that.data.usercode.token
            // token: '8b30b23e952b48928194f092b1dadb6a'
        };
        util.getPostData(url, param).then(result => {
            if (result.data.code === 1) {
                that.setData({
                    projectList: result.data.data.list
                })
            } else {
                wx.reLaunch({
                    url: '/pages/auth/auth'
                })
            }
        });
    },
    /**
     * 进入公司首页
     */
    enterTheCompanyHomepage(e) {
        // app.globalData.tabType = "company"
        wx.setStorageSync('tabType', 'company')
        var key = e.currentTarget.dataset.key;
        var corporation = this.data.corporationList[key];
        if (corporation != null) {
            //把选择的公司数据存入缓存
            wx.setStorageSync('mycompany', corporation);
            // console.log(wx.getStorageSync('mycompany'))
            //跳转至公司首页
            wx.reLaunch({
                url: '/pages/index/index'
            })
        } else {
            wx.reLaunch({
                url: '/pages/auth/auth'
            })
        }
    },
    /**
     * 进入项目首页
     */
    enterTheProjectHomePage(e) {
        // app.globalData.tabType = "project"
        wx.setStorageSync('tabType', 'project')
        var key = e.currentTarget.dataset.key;
        var project = this.data.projectList[key];
        if (project != null) {
            //把选择的公司数据存入缓存
            wx.setStorageSync('myproject', project);
            // console.log(wx.getStorageSync('myproject'))
            //跳转至项目首页
            // wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
            //     title: '加载中',
            //     icon: 'loading',
            // });
            setTimeout(() => {
                wx.reLaunch({
                    url: '/pages/proindex/proindex'
                })
                wx.hideLoading();
            }, 500)

        } else {
            wx.reLaunch({
                url: '/pages/auth/auth'
            })
        }
    },



    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.hideHomeButton();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // console.log('onHide');
        // console.log(wx.getStorageSync('tabType'));
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        // console.log('onUnload');
        // console.log(wx.getStorageSync('tabType'));
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * 切换tab栏
     */
    swichNav({
        currentTarget: {
            dataset: {
                index
            }
        }
    }) {

        if (this.data.statusType.currentTab == index) return
        this.setData({
            "statusType.currentTab": index
        })
    },
    /**
     * swiper切换时会调用
     */
    pagechange: function (e) {
        if ("touch" === e.detail.source) {
            this.setData({
                "statusType.currentTab": e.detail.current
            });
        }
    },
})