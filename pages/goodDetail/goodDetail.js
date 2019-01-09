var good;
var goodDetail;
var num=1;

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
    good = JSON.parse(options.goodsdetail);
    goodDetail=this;
    goodDetail.setData({
      good: good,
      sum: num
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    goodDetail.refreshUI();
    goodDetail.setStarNumber();
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
  setStarNumber:function(){
    let grade=goodDetail.data.good.grade;
    let xxaImgUrl, xxbImgUrl, xxcImgUrl, xxdImgUrl, xxeImgUrl;
    if (grade==0){
      xxaImgUrl = "/image/015.png";
      xxbImgUrl = "/image/015.png";
      xxcImgUrl = "/image/015.png";
      xxdImgUrl = "/image/015.png";
      xxeImgUrl = "/image/015.png";
    }
    else if (grade == 1) {
      xxaImgUrl = "/image/016.png";
      xxbImgUrl = "/image/015.png";
      xxcImgUrl = "/image/015.png";
      xxdImgUrl = "/image/015.png";
      xxeImgUrl = "/image/015.png";
    }
    else if (grade == 2) {
      xxaImgUrl = "/image/016.png";
      xxbImgUrl = "/image/016.png";
      xxcImgUrl = "/image/015.png";
      xxdImgUrl = "/image/015.png";
      xxeImgUrl = "/image/015.png";
    }
    else if (grade == 3) {
      xxaImgUrl = "/image/016.png";
      xxbImgUrl = "/image/016.png";
      xxcImgUrl = "/image/016.png";
      xxdImgUrl = "/image/015.png";
      xxeImgUrl = "/image/015.png";
    }
    else if (grade == 4) {
      xxaImgUrl = "/image/016.png";
      xxbImgUrl = "/image/016.png";
      xxcImgUrl = "/image/016.png";
      xxdImgUrl = "/image/016.png";
      xxeImgUrl = "/image/015.png";
    }
    else if (grade == 5) {
      xxaImgUrl = "/image/016.png";
      xxbImgUrl = "/image/016.png";
      xxcImgUrl = "/image/016.png";
      xxdImgUrl = "/image/016.png";
      xxeImgUrl = "/image/016.png";
    }
    goodDetail.setData({
      xxaImgUrl: xxaImgUrl,
      xxbImgUrl: xxbImgUrl,
      xxcImgUrl: xxcImgUrl,
      xxdImgUrl: xxdImgUrl,
      xxeImgUrl: xxeImgUrl
    });
  },
  refreshUI:function(){
    let collectState = goodDetail.data.good.collectState;
    var shoucangImgUrl;
    if (collectState==1){
      shoucangImgUrl="/image/020.png";
    }
    else{
      shoucangImgUrl="/image/014.jpg";
    }
    goodDetail.setData({
      shoucangImgUrl: shoucangImgUrl
    });
    goodDetail.updateTotalPriceAndNumber(1);
  },
  updateTotalPriceAndNumber: function (amount){
    let price=goodDetail.data.good.price;
    goodDetail.setData({
      foodAmount: amount,
      totalPrice: price * amount,
      zongjia: price * amount
    });
    goodDetail.data.good.quantity=num;
  },
  shouCang:function(){
    let good = goodDetail.data.good;
    if(good.collectState==1){
      goodDetail.postIsCollect(0);
    }
    else{
      goodDetail.postIsCollect(1);
    }
  },
  postIsCollect: function (isCollect) {
    let good=goodDetail.data.good;
    let productId = good.id;
    wx.request({
      url: "http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/addToWishListById",
      method: 'POST',
      data: { token: "ba1cef27-3b9e-4bbe-bbca-f679ece55475", productId: productId, state: isCollect},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        var data = res.data;
        //console.log(data);
        if (data.code == 100 & good.collectState==1) {
          goodDetail.data.good.collectState=0;
          goodDetail.setData({
            shoucangImgUrl:"/image/014.jpg"
          });
          wx.showToast({
            title: '已取消收藏',
            duration:2000
          })
        }
        else if (data.code == 100 & good.collectState == 0) {
          goodDetail.data.good.collectState = 1;
          goodDetail.setData({
            shoucangImgUrl: "/image/020.png"
          });
          wx.showToast({
            title: '已收藏',
            duration: 2000
          })
        }
      }
    })
  },
  addGood:function(){
    num++;
    goodDetail.setData({
      sum: num
    });
    goodDetail.updateTotalPriceAndNumber(num);
  },
  jianGood:function(){
    //最低数量是1
    if (num <= 1){
      wx.showToast({
        title: '不能再少啦！',
        duration:2000
      })
      return;
    }
    num--;
    goodDetail.setData({
      sum: num
    });
    goodDetail.updateTotalPriceAndNumber(num);
  },
  addFoodToList:function(){
    
  }
})