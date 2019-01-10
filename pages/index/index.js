// pages/index/index.js
var index;

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
    index=this;
    let shopId = options.shopId;
    wx.setStorageSync("shopId", 82);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    index.getShopSeatInfoById();
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
      url: 'http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/getShopSeatInfoById',
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
  }
})