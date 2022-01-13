// pages/customer/equips.js
import * as echarts from '../../components/ec-canvas/echarts'
const app = getApp();
const util = require('../../utils/util.js');
const routes = require('../../router/index.js');
Page({
    data: {
        url: app.globalData.apiUrl,
        usercode: [], //用户信息
        mycompany: [], //当前选择的公司
        deviceAnalysis: [], //接入设备及活跃数统计
        deviceAnalysisCate: [], //设备数分类统计
        inputVal: '', //设备筛选内容
        csr_ec: {
            onInit: function (canvas, width, height) {
                CsrChart = echarts.init(canvas, null, {
                    width: width,
                    height: height
                });
                canvas.setChart(chart);
                return chart;
            },
            lazyLoad: true // 延迟加载
        },
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
        //每月接入项目数
        that.addEchartsComponnet = that.selectComponent('#add_mychart');
        //每日活跃设备数
        that.activeEchartsComponnet = that.selectComponent('#active_mychart');
        //获取接入设备及活跃数统计
        that.getDeviceAnalysis();
        //获取设备数分类统计
        that.getDeviceAnalysisByCate();
    },

    /**
     * 获取接入设备及活跃数统计
     */
    getDeviceAnalysis: function () {
        var that = this;
        var url = that.data.url + "/customerservice/analysis/20/getDeviceAnalysis";
        var param = {
            dateType: "year",
            platCode: that.data.usercode.platCode,
            corpCode: that.data.mycompany.corpCode,
        };
        util.getPostData(url, param).then(result => {
            if (result.data.code === 1) {
                that.setData({
                    deviceAnalysis: result.data.data
                })
                //初始化接入设备分析、每月活跃设备数图表
                that.init_echarts(result.data.data);
            }
        });
    },

    /**
     * 更新图表数据
     */
    init_echarts: function (data) {
        this.addEchartsComponnet.init((canvas, width, height) => {
            // 初始化图表
            const Chart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            Chart.clear(); // 清除
            Chart.setOption(this.getCsrOption(data.addlist));
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return Chart;
        });
        this.activeEchartsComponnet.init((canvas, width, height) => {
            // 初始化图表
            const Chart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            Chart.clear(); // 清除
            Chart.setOption(this.getCsrOption(data.activelist));
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return Chart;
        });
    },

    /**
     * 获取每月接接入项目数、每月活跃设备数图表配置项
     */
    getCsrOption(data) {
        var windowwidth = wx.getSystemInfoSync().windowWidth / 750;
        let fontsize = parseInt(12 * windowwidth); //字体带下
        let topandright = parseInt(20 * windowwidth); //上和右边距
        let leftandbottom = parseInt(40 * windowwidth); //下和左边距
        var option = {
            color: '#71d5fe',
            renderAsImage: true, //支持渲染为图片模式
            grid: { //网格
                top: topandright,
                left: leftandbottom,
                right: topandright,
                bottom: leftandbottom,
                containLabel: false, //grid 区域是否包含坐标轴的刻度标签
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.xAxis,
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: fontsize, //更改坐标轴文字大小
                        rich: {}
                    },
                    interval: 0,
                    rotate: 50 // 角度
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '50%'],
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    fontSize: fontsize, //更改坐标轴文字大小
                    rich: {}
                },
                show: true
            },
            series: [{
                data: data.value,
                type: 'bar',
                areaStyle: {}
            }]
        };
        return option;
    },

    /**
     * 获取设备数分类统计
     */
    getDeviceAnalysisByCate() {
        var that = this;
        var url = that.data.url + "/customerservice/analysis/20/getDeviceAnalysisByCate";
        var param = {
            dateType: "year",
            platCode: that.data.usercode.platCode,
            corpCode: that.data.mycompany.corpCode,
        };
        util.getPostData(url, param).then(result => {
            if (result.data.code == 1) {
                if (result.data.data.list.length > 0) {
                    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
                        title: '加载中',
                        icon: 'loading',
                    });
                    var devicelist = result.data.data.list;
                    //条件筛选
                    if (that.data.inputVal != '') {
                        var facicategory = util.getfaciCategoryByName(that.data.inputVal);
                        devicelist = result.data.data.list.filter(x => x.faciCategory == facicategory)
                    }
                    setTimeout(() => {
                        that.setData({
                            deviceAnalysisCate: devicelist
                        })
                        that.initDevice_echarts();
                        wx.hideLoading();
                    }, 500)
                }
            }
        });
    },
    /**
     * 初始化设备列表图表
     */
    initDevice_echarts() {
        var that = this;
        if (that.data.deviceAnalysisCate.length <= 0) {
            return false;
        }
        var index = 0;
        that.data.deviceAnalysisCate.forEach(item => {
            that.selectComponent('#device_mychart_' + index + '').init((canvas, width, height) => {
                // 初始化图表
                const Chart = echarts.init(canvas, null, {
                    width: width,
                    height: height
                });
                // 注意这里一定要返回 chart 实例，否则会影响事件处理等
                Chart.setOption(this.getDeviceCsrOption(item));
                return Chart;
            });
            index++;
        })
    },
    /**
     * 获取设备列表图表配置项
     */
    getDeviceCsrOption(data) {
        var windowwidth = wx.getSystemInfoSync().windowWidth / 750;
        let fontsize = parseInt(12 * windowwidth); //字体带下
        let topandright = parseInt(20 * windowwidth); //上和右边距
        let leftandbottom = parseInt(40 * windowwidth); //下和左边距
        var option = {
            grid: { //网格
                top: topandright,
                left: leftandbottom,
                right: topandright,
                bottom: leftandbottom,
                containLabel: false, //grid 区域是否包含坐标轴的刻度标签
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: data.addlist.xAxis,
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    fontSize: fontsize, //更改坐标轴文字大小
                    rich: {}
                },
            }],
            yAxis: [{
                type: 'value',
                boundaryGap: [0, '50%'],
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    fontSize: fontsize, //更改坐标轴文字大小
                    rich: {}
                },
            }],
            series: [{
                    name: 'addlist',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    color: '#baddff',
                    emphasis: {
                        focus: 'series'
                    },
                    data: data.addlist.value
                },
                {
                    name: 'activelist',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    color: '#d1e8ff',
                    emphasis: {
                        focus: 'series'
                    },
                    data: data.activelist.value
                }
            ]
        };
        return option;
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

    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
        this.getDeviceAnalysisByCate()
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    search: function () {
        this.setData({
            deviceAnalysisCate: [],
        })
        this.getDeviceAnalysisByCate()
    }
})