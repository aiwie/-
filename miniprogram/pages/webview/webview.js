// pages/webview/webview.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url:"",
        urlList:{
            "1":"circumstances.html",
            "2":"spray.html",
            "3":"lift.html",
            "4":"videoSurve.html",
            "5":"towerCrane.html",
            "6":"unwashed.html",
            "7":"unloading.html",
            "8":"thosePresent.html",
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // let baseUrl = 'http://127.0.0.1:5500/'
        let baseUrl = app.globalData.h5PageUrl
        let platCode = wx.getStorageSync('myproject').platCode
        let projectCode = wx.getStorageSync('myproject').projectCode
        let token = wx.getStorageSync('usercode').token
        let url = baseUrl + this.data.urlList[options.index] + '?platCode='+platCode+ '&projectCode='+projectCode + '&token=' + token
        this.setData({
            url:url
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

    }
})