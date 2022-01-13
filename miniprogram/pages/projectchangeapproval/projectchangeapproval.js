// pages/changeapproval/changeapproval.js
const routes = require('../../router/index.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showbtn: "no", //是否显示按钮
        checkboxItems: [
            { name: '劳务实名制', value: '0', checked: true },
            { name: '视频监控', value: '1' },
            { name: '塔吊检测', value: '2', checked: true },
            { name: '卸料平台检测', value: '3', checked: true },
            { name: '升降机检测', value: '4' },
            { name: '环境测试', value: '5' }
        ],
        approver: '', // 发起人
        examineContent:[], // 项目变更审批详情
        authorizationProject:[] // 项目授权详情
    },

    /**
     * 生命周期函数--监听页面加载s
     */
    onLoad: function (options) {
        let approver = routes.extract(options).item.approver
        let examineContent = JSON.parse(routes.extract(options).item.examineContent).apply_data.contents
        let authorizationProject = examineContent[6].value.text.split(',')
        this.setData({
            approver,
            examineContent,
            authorizationProject
        })
        // let json = options.encodedData != 'undefined' ? routes.extract(options) : {};
        // this.setData({
        //     showbtn: json && json.showbtn ? json.showbtn : "no"
        // })
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