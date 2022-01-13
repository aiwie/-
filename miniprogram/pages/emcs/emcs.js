// pages/emcs/emcs.js
import * as echarts from '../../components/ec-canvas/echarts'
const app = getApp();
const util = require('../../utils/util.js');
var warningChart = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        custom: wx.getMenuButtonBoundingClientRect(),
        cBarHeight: 68,
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
        url: app.globalData.apiUrl,
        projectCode: "",
        projectData:"",
        token:"",
        liftData:'',
        timeData:'',
        towerData:'',
        videoData:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({
        projectCode : wx.getStorageSync('myproject').projectCode,
        token : wx.getStorageSync('usercode').token,
        liftData: wx.getStorageSync('liftData'),
        timeData: wx.getStorageSync('timeData'),
        towerData: wx.getStorageSync('towerData'),
        videoData: wx.getStorageSync('videoData')
      })
        var that = this;
        this.getKindsEquipmentCount()
        that.setcBarHeightTab();

       

        that.csrEchartsComponnet = that.selectComponent('#csr_mychart');
        //如果是第一次绘制
        if (!warningChart) {
            that.init_echarts(); //初始化图表
        } else {
            that.setCsrOption(Chart); //更新数据
        }
    },
    goWebview(e){
      let index = e.currentTarget.dataset.index
      if(index == 4){
        console.log(index)
        wx.navigateTo({
          url:"/pages/videosurvedetail/videosurvedetail"
        })
      }else{
        wx.navigateTo({
          url:"/pages/webview/webview?index="+index
        })
      }

      
    },
    getKindsEquipmentCount(){
      var that = this
      var url = that.data.url + "/projectservice/tower/20/kindsEquipmentCount";
      let arr = [
        { value: 'monitor', label: '视频监控' },
        { value: 'envi', label: '环境监测' },
        { value: 'car', label: '车辆道闸' },
        { value: 'facedoor', label: '人脸门禁' },
        { value: 'elevator', label: '升降机监测' },
        { value: 'towercrane', label: '塔吊监测' },
        { value: 'dischargplat', label: '卸料平台监测' },
        { value: 'truckclean', label: '车辆清洗监测' }, 
        { value: 'spray', label: '喷淋' }  
      ]
      let objData = {}
      arr.forEach(el=>{
        let param = {
          projectCode:that.data.projectCode,
          // projectCode: "GGDLCJZX_20211019102801798",
          faciCategory:el.value
        }
        util.getPostData(url, param).then(result => {
          if (result.data.code === 1) {
            let data = result.data.data
            if(data.monitoringTime){
              data.monitoringTime = data.monitoringTime.split(',')
            }
            objData[el.value] = data
          }
        }).then(()=>{
          console.log(objData)
          this.setData({
            projectData : objData
          })
        })
      })
     
    },
    getMeaage15DaysByCategory(){
      let that = this
      let url = that.data.url + "/oaservice/message/20/getMeaage15DaysByCategory"
      let arr = [
        { value: 'monitor', label: '视频监控' },
        { value: 'elevator', label: '升降机监测' },
        { value: 'towercrane', label: '塔吊监测' },
      ]
      let dataObj = {}
      arr.forEach(el=>{
        let params = {
          token:that.data.token,
          projectCode:that.data.projectCode,
          faciCategory:el.value
        }
        util.getPostData(url, params).then(result => {
          if (result.data.code === 1) {
            // dataObj[el.value] = result.data.data
          }
        }).then(()=>{
          
        })
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
       selected: 1 //这个数是，tabBar从左到右的下标，从0开始
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
     * 设置标签位置高度
     */
    setcBarHeightTab: function () {
        var that = this;
        wx.getSystemInfo({
            success: e => {
                let sH = e.statusBarHeight,
                    bH = that.data.custom.bottom * 2 - that.data.custom.height - sH
                bH = bH < that.data.cBarHeight ? that.data.cBarHeight : bH
                that.setData({
                    cBarHeight: that.data.height || bH,
                })
            }
        })
    },
    /**
   * 更新图表数据
   */
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
  /**
   * 获取每月客户变化图表配置项
   */
  getCsrOption() {
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
        data: this.data.timeData,
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
          data: this.data.liftData
        },
        {
          name: '吊塔',
          type: 'line',
          stack: '总量',
          data: this.data.towerData
        },
        {
          name: '视频监控',
          type: 'line',
          stack: '总量',
          data: this.data.videoData
        },
      ]
    };
    return option;
  },
})