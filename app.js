//app.js
var allSelectedFood=[];
//var rootIP = "http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/";
var rootIP = "https://www.bainuojiaoche.com/htkApp/API/buffetFoodAPI/";
//var rootIP1 = "https://120.27.5.36:8080/htkApp/API/wxScanUserAPI/";
var rootIP1 = "https://www.bainuojiaoche.com/htkApp/API/wxScanUserAPI/";

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  addSelectedFood:function(food){
    for (let i = 0; i < allSelectedFood.length;i++){
      let existFood=allSelectedFood[i];
      if (existFood.categoryId == food.categoryId & existFood.id == food.id){
        allSelectedFood[i] =food;
        return;
      }
    }
    allSelectedFood.push(food);
    return;
  },
  getAllSelectedFood: function () {
    //console.log("allSelectedFood==="+JSON.stringify(allSelectedFood));
    return allSelectedFood;
  },
  getRootIP:function(){
    return rootIP;
  },
  getRootIP1: function () {
    return rootIP1;
  }
})