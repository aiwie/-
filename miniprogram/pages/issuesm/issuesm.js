// pages/webview/webview.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
    index: 0,
    requestCode: '',
    examineType: '',
    urlList: {
      "1": "ProblemManagement.html",  //问题管理
      "2": "contractWorkers.html", //劳务实名
      "3": "logManagement.html", //施工日志
      "4": "notice.html", //通知公告
      "5": "warningNotice.html", //中间详情
      "6": "qualityProblemDetails.html", //我的代办详情
      "7": "playList.html" //进度上报
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index: options.index,
      requestCode: options.requestCode,
      examineType: options.examineType
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
    // let baseUrl = "http://127.0.0.1:5500/" // vueH5测试地址
    // let baseUrl = "http://115.29.176.221:8080/" // 测试地址
    let baseUrl = app.globalData.h5PageUrl // 正式地址
    let projectData = wx.getStorageSync('myproject')
    let usercodeData = wx.getStorageSync('usercode')
    let platCode = app.globalData.platCode
    let projectCode = projectData.projectCode
    let token = usercodeData.token
    let corpCode = projectData.corpCode
    let userCode = usercodeData.userCode
    let userName = encodeURI(usercodeData.name)
    let projectId = projectData.projectId
    let projectName = projectData.projectName
    let mobilePhone = ''
    // 获取登录的设备类型
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "devtools") {
          mobilePhone = 'pc'
          //PC
        } else if (res.platform == "ios") {
          mobilePhone = 'ios'
          //IOS
        } else if (res.platform == "android") {
          mobilePhone = 'android'
          //android
        }
      }
    })
    console.log(mobilePhone);
    let url = baseUrl + this.data.urlList[this.data.index] + '?platCode=' + platCode + '&projectCode=' + projectCode + '&token=' + token + '&corpCode=' + corpCode + '&userName=' + userName + '&userCode=' + userCode + '&projectId=' + projectId + '&requestCode=' + this.data.requestCode + '&examineType=' + this.data.examineType + '&projectName=' + projectName + '&mobilePhone=' + mobilePhone
    this.setData({
      url: url
    })
    console.log(this.data.url);
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