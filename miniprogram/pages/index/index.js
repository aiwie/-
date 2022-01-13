// index.js
// 获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
const routes = require('../../router/index.js');
Page({
  data: {
    title: '',
    url: app.globalData.apiUrl,
    usercode: [], //用户信息
    mycompany: [], //当前选择的公司
    statGeneral: [], //公司综合统计数据
    statusType: {
      currentTab: 0,
      data: [{
        name: "待办",
        page: 0,
      }, {
        name: "已办",
        page: 0,
      }, {
        name: "我发起",
        page: 0,
      }]
    },
    myWork: [], //代办、已办、我发起
  },

  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad() {
    var that = this;
    that.setData({
      usercode: wx.getStorageSync('usercode'),
      mycompany: wx.getStorageSync('mycompany'),
    });
    //如果openId不存在则跳转到我的授权页进行一次注册
    if (that.data.usercode.length <= 0) {
      wx.reLaunch({
        url: '/pages/auth/auth'
      })
    }
    //如果未选择用户跳转至用户选择
    if (that.data.mycompany.length <= 0) {
      wx.reLaunch({
        url: '/pages/mycompanyproject/mycompanyproject'
      })
    }
    //获取运营综合统计数据
    that.getStatGeneral();
    //取我的代办，已办，我发起数据
    that.getMyWork();
  },

  getMyWork: function () {
    var that = this;
    var tab = that.data.statusType.currentTab;
    var url = that.data.url;
    var param = {
      platCode: wx.getStorageSync('usercode').platCode,
      userCode: wx.getStorageSync('usercode').userCode,
      corpCode: that.data.mycompany.corpCode
    };
    if (tab === 0) {
      //代办地址
      url = url + "/oaservice/examine/20/getWaitDoWork";
    }
    if (tab === 1) {
      //已办地址
      url = url + "/oaservice/examine/20/getAapprovedWork";
    }
    if (tab === 2) {
      //我发起地址
      url = url + "/oaservice/examine/20/getMyRequest";
    }
    util.getPostData(url, param).then(result => {
      if (result.data.code === 1) {
        wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
          title: '加载中',
          icon: 'loading',
        });
        setTimeout(() => {
          that.setData({
            myWork: result.data.data.list
          })
          wx.hideLoading();
        }, 500)
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        slist: this.getTabBar().data.tabBarList['company']
      })
    }

    this.setData({
      title: wx.getStorageSync('mycompany').corpName
    })
  },

  /**
   * 获取公司综合统计数据
   */
  getStatGeneral: function () {
    var that = this;
    var url = that.data.url + "/customerservice/analysis/20/getStatGeneral";
    var param = {
      platCode: that.data.usercode.platCode,
      corpCode: that.data.mycompany.corpCode,
    };
    util.getPostData(url, param).then(result => {
      if (result.data.code === 1) {
        that.setData({
          statGeneral: result.data.data
        })
      }
    });
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
      "statusType.currentTab": index,
      myWork: []
    })
    this.getMyWork();
  },

  //页面跳转
  projectDetails(e) {
    //项目
    routes.navigateTo('project')
    //   wx.navigateTo({
    //     url: '/pages/project/project'
    // })
  },
  clientDetails(e) {
    //子公司
    routes.navigateTo('customer')
  },
  equipsDetails(e) {
    //设备
    routes.navigateTo('equips')
  },
  /**
   * 跳转审核页面
   * @param {*} e 
   */
  approvalPage(e) {
    ////子公司开通审批,子公司变更审批,新建项目审批,项目变更审批
    let pages = ['subsidiaryaddapproval', 'subsidiarychangeapproval', 'projectaddapproval', 'projectchangeapproval'];
    // let showbtn = e.currentTarget.dataset.btn;
    let type = e.currentTarget.dataset.type
    let item = e.currentTarget.dataset.item
    switch (type) {
      case '客户变更审批':
        routes.navigateTo(pages[3], {
          item: item,
        })
        break
      case '新建客户审批':
        routes.navigateTo(pages[2], {
          item: item,
        })
        break
      case '子公司变更审批':
        routes.navigateTo(pages[1], {
          item: item,
        })
        break
      case '子公司开通审批':
        routes.navigateTo(pages[0], {
          item: item,
        })
        break
    }

  },
})