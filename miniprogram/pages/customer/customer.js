// pages/customer/customer.js
import * as echarts from '../../components/ec-canvas/echarts'
const routes = require('../../router/index.js');
const util = require('../../utils/util.js');
const app = getApp();
var CsrChart = null;
Page({
    data: {
        url: app.globalData.apiUrl,
        usercode: [], //用户信息
        mycompany: [], //当前选择的公司
        allHeight: null, // 整个屏幕高度（包含不可见区域）
        clientHight: null, // 可见区域屏幕高度，不包含滚动条折叠不可见区域
        gap: null, // 第二次后者更后面计算整个高度的时候（包含不可见区域）会有误差，需要加上这个误差
        num: 0,
        statGeneral: [], //公司综合统计数据
        subcorpList: [], //子公司列表数据
        pageNum: 1, //客户数据当前页码
        pageSize: 10, //每次加载10条数据
        inputVal: "", //搜索的值
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
        // 获取可见区域高度
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    clientHight: res.windowHeight
                })
            },
        })
        that.setData({
            usercode: wx.getStorageSync('usercode'),
            mycompany: wx.getStorageSync('mycompany'),
        });
        //获取公司综合统计数据
        that.getStatGeneral();
        //每月子公司变化
        that.csrEchartsComponnet = that.selectComponent('#csr_mychart');
        //每月子公司项目变化
        that.equipEchartsComponnet = that.selectComponent('#equip_mychart');
        //获取子公司及子公司项目统计数据
        that.getSubCorpProjectAnalysis();
        //获取子公司列表数据
        that.getSubcorpList();
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
     * 获取子公司及子公司项目统计数据
     */
    getSubCorpProjectAnalysis() {
        var that = this;
        var url = that.data.url + "/customerservice/analysis/20/getSubCorpProjectAnalysis";
        var param = {
            dateType: "year",
            platCode: that.data.usercode.platCode,
            corpCode: that.data.mycompany.corpCode,
        };
        util.getPostData(url, param).then(result => {
            if (result.data.code === 1) {
                //初始化每月子公司变化、每月子公司项目变化图标
                that.init_echarts(result.data.data);
            }
        });
    },

    /**
     * 更新图表数据
     */
    init_echarts: function (data) {
        this.csrEchartsComponnet.init((canvas, width, height) => {
            // 初始化图表
            const Chart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            Chart.clear(); // 清除
            Chart.setOption(this.getCsrOption(data[0]));
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return Chart;
        });
        this.equipEchartsComponnet.init((canvas, width, height) => {
            // 初始化图表
            const Chart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            Chart.clear(); // 清除
            Chart.setOption(this.getCsrOption(data[1]));
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return Chart;
        });
    },

    /**
     *  获取echars数据结构
     */
    getCsrOption(data) {
        var windowwidth = wx.getSystemInfoSync().windowWidth / 750;
        let fontsize = parseInt(12 * windowwidth); //字体带下
        let topandright = parseInt(20 * windowwidth); //上和右边距
        let leftandbottom = parseInt(52 * windowwidth); //下和左边距
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
                show: true,
            },
            series: [{
                data: data.value,
                type: 'line',
                areaStyle: {},
            }]
        };

        return option;
    },

    /**
     * 获取子公司列表
     */
    getSubcorpList() {
        var that = this;
        var url = that.data.url + "/customerservice/subcorp/20/selectSubcorpList";
        var param = {
            platCode: that.data.usercode.platCode,
            parentCode: that.data.mycompany.corpCode,
            corpName: that.data.inputVal,
            pageNum: that.data.pageNum,
            pageSize: that.data.pageSize
        };
        util.getPostData(url, param).then(result => {
            if (result.data.code == 1) {
                if (result.data.data.list.length > 0) {
                    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
                        title: '加载中',
                        icon: 'loading',
                    });
                    setTimeout(() => {
                        var subcorplist = that.data.subcorpList; //原先的数据
                        result.data.data.list.forEach((e) => { //装载新数据
                            subcorplist.push(e)
                        })
                        that.setData({
                            subcorpList: subcorplist
                        })
                        that.pageScrollToBottom()
                        wx.hideLoading();
                    }, 500)
                }
            } else {
                console.error(result.data.msg);
            }
        });
    },


    /**
     * 获取屏幕总高度（包含不可见区域）
     */
    pageScrollToBottom: function () {
        const that = this
        wx.createSelectorQuery().select('#page').boundingClientRect(function (rect) {
            // 计算第一次的差值，这时候才能算出真正的高度，第二次及以后bottom的值不正确
            if (that.data.num === 0) {
                const gap = rect.bottom - rect.height
                that.setData({
                    gap: gap
                })
            }
            const num = that.data.num + 1
            that.setData({
                num: num
            })
            that.setData({
                allHeight: parseInt(rect.height + that.data.gap)
            })
        }).exec()

    },
    /**
     * 监听屏幕滚动事件，只要屏幕往上或者往下滚动都会触发此方法
     */
    onPageScroll: function (e) {
        // 判断是否滚动动到底部
        if (this.data.allHeight - this.data.clientHight === parseInt(e.scrollTop)) {
            if (!this.data.noMore) {
                const pageNum = this.data.pageNum + 1
                this.setData({
                    pageNum: pageNum
                })
                this.getSubcorpList()
            }
        }
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
        this.getSubcorpList();
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },

    search: function (e) {
        this.setData({
            subcorpList: [],
            pageNum: 1,
            allHeight: null,
            gap: null,
            num: 0
        })
        this.getSubcorpList()
    },

    /**
     * 子公司详情跳转
     */
    subcorpDetail(e) {
        let corpcode = e.currentTarget.dataset.corpcode;
        routes.navigateTo('subsidiarydetails', {
            corpCode: corpcode
        })
    },
})