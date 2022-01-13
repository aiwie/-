//app.js
const util = require('utils/util')
App({
  onLaunch: function (op) {
    var that = this;
    // 展示本地存储能力
    var openid = wx.getStorageSync('openid') || [];
    var usercode = wx.getStorageSync('usercode') || [];
    //openid.unshift(Date.now())

    /*
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("请求完新版本信息的回调"+res.success);
      
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
            console.log('应用新版本并重启');
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      console.log('新版本下载失败');
    })
   */
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var url = that.globalData.apiUrl + "/oaservice/message/20/wxlogin";
          var param = {
            appid: that.globalData.appId,
            secret: that.globalData.secret,
            js_code: res.code
          };
          util.getPostData(url, param).then(result => {
            if (result.data.code === 1) {
              wx.setStorageSync('openid', result.data.data.openid)
              wx.setStorageSync('session_key', result.data.data.session_key);
            }
          });
        }
      }
    })

    // 没有用户信息跳转至授权页
    if (usercode.length <= 0) {
      wx.reLaunch({
        url: '/pages/auth/auth'
      })
    }

  },
  onShow: function () {
    // 判断是否从 微信企业平台登录
    let systemInfo = wx.getSystemInfoSync()
    if (!systemInfo.environment && systemInfo.environment != 'wxwork') {
      wx.reLaunch({
        url: '/pages/mycompanyproject/mycompanyproject'
      })
    } 

  },
  clearStorage: function () {
    wx.clearStorageSync();
  },
  clearStorageSync: function (key) {
    wx.setStorageSync(key, []);
  },
  getWeeklyDay: function () {
    var week = new Array("日", "一", "二", "三", "四", "五", "六");
    return " 星期" + week[new Date().getDay()];
  },
  getTime: function () {
    var week = new Array("日", "一", "二", "三", "四", "五", "六");
    return " 星期" + week[new Date().getDay()];
  },
  getOpenId: function () {
    var openid = wx.getStorageSync('openid') || [];
    return openid;
  },

  globalData: {
    systemInfo: wx.getSystemInfoSync() || {},
    appId: 'wx54810342fa01d963',
    secret: 'e46f5da77767e8138a986967301c0bbd',
    apiUrl: 'https://site.tieweizhixing.com', //api接口
    // apiUrl: 'http://121.36.223.253:7000/', //api 开发接口
    platCode: 'ibuildSite', //客户编码
    corpCode: 'TWZX', //平台编码
    h5PageUrl: 'https://site.tieweizhixing.com/file-service/files/h5/',
    tabType: ""
  }
})

