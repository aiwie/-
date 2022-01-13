// pages/videosurvedetail/videosurvedetail.js
const app = getApp()
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        platCode:'',
        projectCode:'',
        url: app.globalData.apiUrl,
        videoList:[],
        monitorId:'',
        pickerShow:false,
        videoUrl:'',
        monitorName:'',
        livePlayerCtx:'',
        isNotFullScreen:true,
        total:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            projectCode : wx.getStorageSync('myproject').projectCode,
            platCode : wx.getStorageSync('usercode').platCode,
          })
    },
    getSelectMonitorList() {
        var that = this;
        var params = {
            platCode: this.data.platCode,
            projectCode: this.data.projectCode,
        };
        let url = this.data.url+ "/projectservice/monitor/20/selectMonitorList"
        util.getPostData(url, params).then(result => {
            if (result.data.code === 1) {
                let videoList = result.data.data.list
                let videourl = ''
                let monitorName = ""
                // videoList.forEach(el => {
                //     if(el.monitorId == this.data.monitorId){
                //         videourl = el.mediaRtmpUrl  //等等看接口具体返回啥
                //         monitorName = el.monitorName
                //     }
                // });
                that.setData({
                    videoList:videoList,
                    videoUrl:videoList[0].mediaRtmpUrl,
                    monitorName:videoList[0].monitorName,
                    monitorId:videoList[0].monitorId,
                    total:videoList.length
                })
            }
          }).then(()=>{
           
          }).catch(()=>{})
    },
    handlePlay(e){
        let el = e.currentTarget.dataset.item
        let monitorId = el.monitorId
        let url = el.mediaRtmpUrl 
        let monitorName = el.monitorName
        this.setData({
            monitorId:monitorId,
            videoUrl:url,
            monitorName:monitorName
        })
    },
    // 视频操作盘显视
    videoCao(){
        this.setData({
            pickerShow:!this.data.pickerShow
        })
    },
    FullScreen(){
        let that = this
        this.data.livePlayerCtx = wx.createLivePlayerContext('liveplayer')
        if(this.data.isNotFullScreen){
            this.data.livePlayerCtx.requestFullScreen({
                direction:90,
                success(e){
                    that.setData({
                        isNotFullScreen:false
                    })
                },
            })
        }else{
            this.data.livePlayerCtx.exitFullScreen({
                success(e){
                    that.setData({
                        isNotFullScreen:true
                    })
                },
            })
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
        this.getSelectMonitorList()
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