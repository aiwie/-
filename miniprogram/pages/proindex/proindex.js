// pages/more/more.js
import * as echarts from '../../components/ec-canvas/echarts'
var warningChart = null;
var amapFile = require('../../libs/amap-wx.130.js');
const util = require('../../utils/util')
const app = getApp()
// key:b7b0bb562506755ee726db486c972316
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    warning_ec: {
      onInit: function (canvas, width, height) {
        warningChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart);
        return chart;
      },
      lazyLoad: true // 延迟加载
    },
    statusType: {
      currentTab: '0',
      data: [{
        name: "我的待办",
        page: 0,
      }, {
        name: "我的已办",
        page: 0,
      }
        // , {
        //   name: "抄送",
        //   page: 0,
        // }
      ]
    },
    backlogList: [
    ],
    markersData: {
      key: "b7b0bb562506755ee726db486c972316", //申请的高德地图key
      markers: [],
      polygons: [],
      latitude: 0, //纬度
      longitude: 0, //经度
      createDate: '', // 开工时间
      address: '', // 地址
      textData: {}
    },
    // 现场人员数据
    fieldForceData: {},
    // 升降机 - 塔吊 - 视频监控数据
    timeData: [],
    liftData: [],
    videoData: [],
    towerData: [],
    // 预警提醒
    earlyMsg: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.csrEchartsComponnet = this.selectComponent('#csr_mychart');
    var myAmapFun = new amapFile.AMapWX({
      key: that.data.markersData.key
    });

    //如果是第一次绘制
    if (!warningChart) {
      this.init_echarts(); //初始化图表
    } else {
      this.setCsrOption(Chart); //更新数据
    }
    // 人员统计接口
    this.getCountTypePeople()
    this.getAapprovedWork('/oaservice/examine/20/getWaitDoWork')

  },
  /**
   * 加载地图信息
   */
  loadMapInfo() {
    var that = this;
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
        selected: 0, //这个数是，tabBar从左到右的下标，从0开始
        slist: this.getTabBar().data.tabBarList['project']
      })
    }
    let myproject = wx.getStorageSync('myproject')
    let posLanLon = JSON.parse(myproject.gpsFence)
    let points = []
    posLanLon.forEach(item => {
      points.push({ latitude: item.lat, longitude: item.lng })
    })
    this.setData({
      "markersData.latitude": posLanLon[0].lat,
      "markersData.longitude": posLanLon[0].lng,
      "markersData.createDate": myproject.createDate,
      "markersData.address": myproject.address,
      "markersData.polygons": [{
        points: points,
        fillColor: '#23a5f3',
        strokeColor: '#fff',
        strokeWidth: 2,
        zIndex: 1
      }],
      title: myproject.projectName
    })
    this.getCategory()
    this.getSelectWarnMessage()
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
  // 切换tab栏
  swichNav(e) {
    let index = e.currentTarget.dataset.index
    if (this.data.statusType.currentTab == index) return
    this.setData({
      "statusType.currentTab": index
    })
    if (this.data.statusType.currentTab === 0) {
      wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
        title: '加载中',
        icon: 'loading',
      });
      setTimeout(() => {
        this.getAapprovedWork('/oaservice/examine/20/getWaitDoWork')
        wx.hideLoading();
      }, 500)
    } else {
      wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
        title: '加载中',
        icon: 'loading',
      });
      setTimeout(() => {
        this.getAapprovedWork('/oaservice/examine/20/getAapprovedWork')
        wx.hideLoading();
      }, 500)

    }
  },
  // 更新图表数据
  init_echarts: function () {
    this.csrEchartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setCsrOption(Chart)
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setCsrOption: function (Chart) {
    Chart.clear(); // 清除
    Chart.setOption(this.getCsrOption()); //获取新数据
  },
  // 获取每月客户变化图表配置项
  getCsrOption() {
    const that = this
    var option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['升降机', '吊塔', '视频监控']
      },
      grid: {
        top: '15%',
        left: '2%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: wx.getStorageSync('timeData'),
        textStyle: {
          "fontSize": 6
        }
      },
      yAxis: {
        max: 5,
        type: 'value'
      },
      series: [{
        name: '升降机',
        type: 'line',
        stack: '总量',
        data: wx.getStorageSync('liftData')
      },
      {
        name: '吊塔',
        type: 'line',
        stack: '总量',
        data: wx.getStorageSync('towerData')
      },
      {
        name: '视频监控',
        type: 'line',
        stack: '总量',
        data: wx.getStorageSync('videoData')
      },
      ]
    };
    return option;
  },
  // 已办任务 接口
  getAapprovedWork(url) {
    var that = this;
    var url = app.globalData.apiUrl + url;
    var param = {
      platCode: app.globalData.platCode,
      userCode: wx.getStorageSync('usercode').userCode,
      projectCode: wx.getStorageSync('myproject').projectCode
      // platCode: 'ibuildSite',
      // userCode: '528c3d35a4e748c9ba8b631ee5975505',
      // projectCode: 'WDXMC_20210927164658945'
    };
    util.getPostData(url, param).then(result => {
      // examineResult = null = 待审批
      // examineResult = 0 = 通过 或者 1 拒绝
      // examineStatus = approved/通过 reject/拒绝
      if (result.data.code === 1) {
        result.data.data.list.forEach(item => {
          item.examineContent = JSON.parse(item.examineContent)
          if (item.examineType === "safety") {
            item.typeName = '安全问题'
            item.category = item.examineContent.apply_data.contents[0].value.text
            item.describe = item.examineContent.apply_data.contents[3].value.text
            item.initiator = item.examineContent.apply_data.contents[5].value.text
          }
          if (item.examineType === "quality") {
            item.typeName = '质量问题'
            item.category = item.examineContent.apply_data.contents[0].value.text
            item.describe = item.examineContent.apply_data.contents[3].value.text
            item.initiator = item.examineContent.apply_data.contents[5].value.text
          }
        })
        that.setData({
          backlogList: result.data.data.list
        })
      } else {
        that.setData({
          backlogList: []
        })
      }
    });
  },
  // 首页预警信息 接口
  getSelectWarnMessage() {
    var that = this;
    var url = app.globalData.apiUrl + "/oaservice/message/20/getAlarmMessageByProject";
    var myDate = new Date();
    var time = myDate.toLocaleDateString().split('/').join('-');
    var param = {
      msgType: "alarm",
      // projectCode:"WDXMC_20210927164658945",
      projectCode: wx.getStorageSync('myproject').projectCode,
      platCode: app.globalData.platCode,
      beginTime: time,
      endTime: time,
    };
    util.getPostData(url, param).then(result => {
      console.log(result.data.data.list);
      if (result.data.code === 1 && result.data.data.list > 0) {
        that.setData({
          earlyMsg: result.data.data.list
        })
      } else {
        console.error('无数据');
      }
    });
  },
  // 人员分类统计 接口
  getCountTypePeople() {
    let that = this
    var url = app.globalData.apiUrl + "/projectservice/personScreen/20/countTypePeople";
    var param = {
      projectCode: wx.getStorageSync('myproject').projectCode,
    };
    util.getPostData(url, param).then(result => {
      if (result.data.code === 1) {
        that.setData({
          fieldForceData: result.data.data
        })
      }
    });
  },
  // 过去15天报警次数 接口
  getCategory() {
    let that = this
    var url = app.globalData.apiUrl + "/oaservice/message/20/getMeaage15DaysByCategory";
    let type = ['elevator', 'towercrane', 'monitor']
    let token = wx.getStorageSync('usercode').token
    let projectCode = wx.getStorageSync('myproject').projectCode
    // 升降机监测
    util.getPostData(url, {
      faciCategory: type[0],
      token,
      projectCode,
    }).then(result => {
      if (result.data.code === 1 && result.data.data.length > 0) {
        let liftData = []
        let timeData = []
        result.data.data.forEach(item => {
          liftData.push(item.total)
          timeData.push(item.createDate)
        })
        that.setData({
          liftData: liftData,
          timeData: timeData
        })
        wx.setStorageSync('liftData', liftData)
        wx.setStorageSync('timeData', timeData)
      }
    });
    // 塔吊监测
    util.getPostData(url, {
      faciCategory: type[0],
      token,
      projectCode,
    }).then(result => {
      if (result.data.code === 1 && result.data.data.length > 0) {
        let towerData = []
        result.data.data.forEach(item => {
          towerData.push(item.total)
        })
        that.setData({
          towerData: towerData,
        })
        wx.setStorageSync('towerData', towerData)
      }
    });
    // 视频监控
    util.getPostData(url, {
      faciCategory: type[0],
      token,
      projectCode,
    }).then(result => {
      if (result.data.code === 1 && result.data.data.length > 0) {
        let videoData = []
        result.data.data.forEach(item => {
          videoData.push(item.total)
        })
        that.setData({
          videoData: videoData,
        })
        wx.setStorageSync('videoData', videoData)
      }
    });
  },
  // 待办 已办 跳转
  detailsSkip(e) {
    let index = e.currentTarget.dataset.index
    let examineType =e.currentTarget.dataset.examinetype
    let requestCode = e.currentTarget.dataset.requestcode // 代办已办的ID
    wx.navigateTo({
      url: '/pages/issuesm/issuesm?index=' + index +  '&requestCode=' + requestCode +'&examineType='+examineType
    })
  },
  // 点击调转到各个页面
  btnIssuesM(e) {
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/issuesm/issuesm?index=' + index
    })
  },
})