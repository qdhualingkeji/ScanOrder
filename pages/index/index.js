// pages/index/index.js
var index;
var rootIP;
var rootIP1;
var appID ="wxabae78128214e23b";
var secret ="f39c986468559a017529597a74da9ad5";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    index = this;
    rootIP = getApp().getRootIP();
    rootIP1 = getApp().getRootIP1();
    let shopId = options.shopId;
    wx.setStorageSync("shopId", 82);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    index.getShopSeatInfoById();
    let token = wx.getStorageSync("token");
    if (token == "")
      index.wxlogin();
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
  getShopSeatInfoById:function(){
    let shopId=wx.getStorageSync("shopId");
    wx.request({
      url: rootIP+"getShopSeatInfoById",
      method: 'POST',
      data: { shopId: shopId},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res);
        var data = res.data;
        if (data.code == 100) {
          index.setData({
            seatList:data.data
          });
        }
      }
    })
  },
  toDcMain:function(e){
    let seatName=e.currentTarget.dataset.seatname;
    wx.setStorageSync("zhuoNo", seatName);
    wx.navigateTo({
      url: '/pages/dcMain/dcMain',
    })
  },
  getUserInfo:function(){
    wx.getUserInfo({
      success: function (res) {

        console.log("res===" + JSON.stringify(res));
        /*
        that.data.userInfo = res.userInfo;

        that.setData({
          userInfo: that.data.userInfo
        })
        */
      },
      fail: function (res) {
        console.log("res1===" + JSON.stringify(res));
      }
    })
  },
  getPhoneNumber: function (e) {
    //console.log(e.detail)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    console.log(encodeURIComponent(e.detail.encryptedData))
    /*
    wx.login({
      success: res => {
        console.log(res.code);
        wx.request({
          url: 'https://你的解密地址',
          data: {
            'encryptedData': encodeURIComponent(e.detail.encryptedData),
            'iv': e.detail.iv,
            'code': res.code
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/json'
          }, // 设置请求的 header
          success: function (res) {
            if (res.status == 1) {//我后台设置的返回值为1是正确
              //存入缓存即可
              wx.setStorageSync('phone', res.phone);
            }
          },
          fail: function (err) {
            console.log(err);
          }
        })
      }
    })
    */
  },
  wxlogin:function(){
    wx.login({
      success: (res) => {
        console.log("res===" + JSON.stringify(res));
        console.log(res.code);
        index.initToken(res.code);
      }
    })
  },
  initToken: function (code){
    wx.request({
      url: rootIP1 + "login",
      method: 'POST',
      data: { appID: appID, secret: secret, code: code},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        var data = res.data;
        if (data.code == 100) {
          console.log("token===" + data.data);
          wx.setStorageSync("token", data.data);
        }
      }
    })
  } 
})