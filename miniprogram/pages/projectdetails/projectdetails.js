// pages/projectdetails/projectdetails.js
const app = getApp();
const util = require('../../utils/util.js');
const routes = require('../../router/index.js');
Page({
    data: {
        url: app.globalData.apiUrl,
        projectCode: "", //项目编码
        projectDetail: [], //项目详情
        faciStat: [], //已接入授权数量
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let json = options.encodedData != 'undefined' ? routes.extract(options) : {};
        this.setData({
            projectCode: json.projectCode
        });
        this.setData({
            usercode: wx.getStorageSync('usercode'),
            mycompany: wx.getStorageSync('mycompany'),
        });
        this.getProjectDetail();
        this.getFaciStatByProject();
    },

    /**
     * 获取项目详情
     */
    getProjectDetail: function () {
        var that = this;
        var url = that.data.url + "/customerservice/project/20/getProjectDetail";
        var param = {
            projectCode: that.data.projectCode
        };
        util.getPostData(url, param).then(result => {
            if (result.data.code === 1) {
                that.setData({
                    projectDetail: result.data.data
                })
            }
        });
    },

    /**
     * 获取项目设备按分类进行数量统计
     */
    getFaciStatByProject() {
        var that = this;
        var url = that.data.url + "/iotservice/analysis/20/faciStatByProject";
        var param = {
            projectCode: that.data.projectCode,
            platCode: that.data.usercode.platCode,
        };
        util.getPostData(url, param).then(result => {
            if (result.data.code === 1) {
                that.setData({
                    faciStat: result.data.data.list
                })
            }
        });
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