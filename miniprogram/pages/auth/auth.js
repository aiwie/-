// pages/auth/auth.js
const util = require('../../utils/util.js');
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        logoUrl: '../../images/logo.png',
        checkChage: false,
        url: app.globalData.apiUrl,
        appId: app.globalData.appId,
        secret: app.globalData.secret,
        imgurl: "/images/auth/auth-1x.png"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    getPhoneNumber(e) { // 小程序换取用户编码code
        var that = this;
        var url = that.data.url + "/token-service/user/20/getUserCodeByOpenId";
        if (e.detail.errMsg == 'getPhoneNumber:ok') {
            var param = {
                openId: wx.getStorageSync("openid"),
                sessionKey: wx.getStorageSync("session_key"),
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData,
                corpCode: "TWZX"
            };
            util.getPostData(url, param).then(result => {
                if (result.data.code === 1) {
                    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
                        title: '加载中',
                        icon: 'loading',
                    });
                    // result.data.data.mobilePhone = "18062408738"
                    // result.data.data.userCode = "f154c732843c4a44a03740e7b29615bc"
                    // result.data.data.token = "7ac01dc8db4f4990ad951011fc5188bf"
                    wx.setStorageSync('usercode', result.data.data);
                    wx.hideLoading();
                    //跳转至我的公司项目
                    wx.reLaunch({
                        url: '/pages/mycompanyproject/mycompanyproject',
                    })
                } else {
                    wx.showToast({
                        title: result.data.msg,
                        icon: "none",
                        duration: 2000,
                        mask: false,
                    })
                }
            });
        } else {
            wx.showToast({
                title: '您已取消授权',
                icon: "none",
                duration: 2000,
                mask: false,
            })
        }
    },
    checkboxChange(e) { // 判断是否勾选隐私政策
        if (e.detail.value.length > 0) {
            this.setData({
                checkChage: true
            })
        } else {
            this.setData({
                checkChage: false
            })
        }
    },
    checkChangeMsg() { // 未勾选隐私政策提示
        if (!this.data.checkChage) {
            wx.showToast({
                title: '请勾选《智慧工地隐私政策》!',
                icon: "none",
                duration: 2000,
                mask: false,
            })
        }
    },
    jumpPrivacy() { // 跳转隐私政策详情
        wx.navigateTo({
            url: '/pages/privacypolicy/privacypolicy',
        })
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

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

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

})