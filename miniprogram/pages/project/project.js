// pages/project/project.js
import * as echarts from '../../components/ec-canvas/echarts';
const util = require('../../utils/util.js');
const routes = require('../../router/index.js');
var CsrChart = null;
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: app.globalData.apiUrl,
        usercode: [], //用户信息
        mycompany: [], //当前选择的公司
        statGeneral:[],//公司综合统计数据
        allHeight: null, // 整个屏幕高度（包含不可见区域）
        clientHight: null, // 可见区域屏幕高度，不包含滚动条折叠不可见区域
        gap: null, // 第二次后者更后面计算整个高度的时候（包含不可见区域）会有误差，需要加上这个误差
        num: 0,
        projectList: [], //项目列表
        pageSize: 10, //每页显示数据
        pageNumber: 1, //当前页
        inputVal: "", //搜索内容
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
        that.getStatGeneral();
        that.csrEchartsComponnet = that.selectComponent('#csr_mychart');
        //如果是第一次绘制
        if (!CsrChart) {
            that.init_echarts(); //初始化图表
        } else {
            that.setCsrOption(Chart); //更新数据
        }
        that.getProjectList();
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
            this.getProjectAnalysis(Chart)
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return Chart;
        });
    },

    /**
     * 获取周期项目变化统计
     */
    getProjectAnalysis(Chart) {
        var that = this;
        var url = that.data.url + "/customerservice/analysis/20/getProjectAnalysis";
        var param = {
            corpCode: that.data.mycompany.corpCode,
            platCode: that.data.usercode.platCode,
            dateType: "year"
        };
        util.getPostData(url, param).then(result => {
            Chart.clear(); // 清除
            if (result.data.code == 1) {
                var data = result.data.data;
                Chart.setOption(that.getCsrOption(data));
            }
        });
    },

    /**
     * 获取每月客户变化图表配置项
     */
    getCsrOption(data) {
        var windowwidth = wx.getSystemInfoSync().windowWidth / 750;
        let fontsize = parseInt(16 * windowwidth); //字体大小
        let topandright = parseInt(20 * windowwidth); //上和右边距
        let leftandbottom = parseInt(10 * windowwidth); //下和左边距
        var option = {
            renderAsImage: true, //支持渲染为图片模式
            color: ["#1485EE"], //图例图标颜色
            grid: { //网格
                top: topandright,
                left: leftandbottom,
                right: topandright,
                bottom: leftandbottom,
                containLabel: true, //grid 区域是否包含坐标轴的刻度标签
            },
            xAxis: {
                type: 'category',
                boundaryGap: false, //1.true 数据点在2个刻度直接  2.fals 数据点在分割线上，即刻度值上
                data: data.xAxis,
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: fontsize, //更改坐标轴文字大小
                        rich: {}
                    },
                },
            },
            yAxis: {
                type: 'value',
                axisPointer: {
                    snap: true
                },
                axisLabel: {
                    show: true,
                    fontSize: fontsize, //更改坐标轴文字大小
                    rich: {}
                },
            },
            series: [{
                data: data.series.addvalue,
                type: 'line',
            }]
        };
        return option;
    },

    /**
     * 获取项目列表
     */
    getProjectList() {
        var that = this;
        var url = that.data.url + "/customerservice/project/20/selectProjectList";
        var param = {
            customerCode: that.data.mycompany.corpCode,
            platCode: that.data.usercode.platCode,
            pageSize: that.data.pageSize,
            pageNumber: that.data.pageNumber,
            projectName: that.data.inputVal
        };
        util.getPostData(url, param).then(result => {
            if (result.data.code == 1) {
                var data = result.data.data.list;
                that.setData({
                    projectList: data
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
        this.getProjectList();
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    search: function (e) {
        this.setData({
            projectList: [],
            pageNum: 1,
            allHeight: null,
            gap: null,
            num: 0
        })
        this.getProjectList()
    },

    /**
     * 项目详情页面跳转
     */
    projectdetails(e) {
        let projectCode = e.currentTarget.dataset.projectcode;
        routes.navigateTo('projectdetails', {
            projectCode: projectCode
        })
    },

})