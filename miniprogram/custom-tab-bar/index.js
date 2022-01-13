const app = getApp()
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    slist: [],
    tabBarList: {
      company: [
        {
          "pagePath": "/pages/index/index",
          "text": "首页",
          "iconPath": "/images/menu/discovery.png",
          "selectedIconPath": "/images/menu/discovery_focus.png"
        },
        {
          "pagePath": "/pages/notify/notify",
          "text": "通知",
          "iconPath": "/images/menu/chat.png",
          "selectedIconPath": "/images/menu/chat_focus.png"
        },
        {
          "pagePath": "/pages/more/more",
          "text": "我的",
          "iconPath": "/images/menu/burger.png",
          "selectedIconPath": "/images/menu/burger_focus.png"
        }
      ],
      project: [
        {
          "pagePath": "/pages/proindex/proindex",
          "text": "首页",
          "iconPath": "/images/menu/discovery.png",
          "selectedIconPath": "/images/menu/discovery_focus.png"
        },
        {
          "pagePath": "/pages/emcs/emcs",
          "text": "设备监控",
          "iconPath": "/images/menu/emcs.png",
          "selectedIconPath": "/images/menu/emcs_focus.png"
        },
        {
          "pagePath": "/pages/more/more",
          "text": "我的",
          "iconPath": "/images/menu/burger.png",
          "selectedIconPath": "/images/menu/burger_focus.png"
        }
      ]
    }
  },
  attached() {
  },
  lifetimes: {
    created(){
      // console.log("created");
    },
    attached() {
      // console.log("attached");
    //  let tabType = app.globalData.tabType
     let tabType = wx.getStorageSync('tabType')
   
      this.setData({
        slist: this.data.tabBarList[tabType]
      })
      //  console.log(tabType)
    // console.log(this.data.slist)
    },
    detached(){
      // console.log('detached');
      this.setData({
        slist: []
      })
    },
    ready(){
      // console.log('ready');
      let tabType = wx.getStorageSync('tabType')
      // let tabType = app.globalData.tabType
      // console.log(tabType)
       this.setData({
         slist: this.data.tabBarList[tabType]
       })
   
      //  console.log(this.data.slist)
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      // console.log(app.globalData.tabType)
      // console.log(this.data.slist)
      // console.log(url)
      // let tabType = app.globalData.tabType
      // let tabType = wx.getStorageSync('tabType')
      // this.setData({
      //   slist:this.data.tabBarList[tabType]
      // })
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})