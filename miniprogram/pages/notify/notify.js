// pages/notify/notify.js
const app = getApp()
const util = require('../../utils/util.js')
const routes = require('../../router/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "通知",
    url: app.globalData.apiUrl,
    corpCode: app.globalData.corpCode, //客户编码
    platCode: app.globalData.platCode, //平台编码
    noticesList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      usercode: wx.getStorageSync('usercode'),
      mycompany: wx.getStorageSync('mycompany'),
    });
    that.getNoticesByUser("noticesList", "");


    let query = wx.createSelectorQuery().in(this)
    query.select('.content-title').boundingClientRect()
    query.select('.content-title').boundingClientRect()
    query.exec(res => {
      let searchHeight = res[0].height
      let titleHeight = res[1].height
      let windowHeight = wx.getSystemInfoSync().windowHeight
      let scrollHeight = windowHeight - searchHeight - titleHeight - 30 - 5 - 50
      this.setData({
        windowHeight: scrollHeight
      })
    })
  },
  noticeDetail(e){
    let id = e.currentTarget.dataset.index
    wx.navigateTo({
      url:"/pages/compannotifyview/compannotifyview?index="+id
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
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

  /**
   * 用户取我的通知公告
   * @param {搜索关键字} user 
   */
  getNoticesByUser: function (key, title) {
    var that = this;
    var url = that.data.url + "/oaservice/notice/20/getNoticesByUser";
    var param = {
      platCode: that.data.usercode.platCode,
      corpCode: that.data.mycompany.corpCode,
      "title": title
    };
    util.getPostData(url, param).then(
      function (result) {
        that.setData({
          [key]: result.data.data.list
        })
      });

  },

})