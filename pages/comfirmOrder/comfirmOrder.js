var comfirmOrder;
var mount = 0;
var money = 0;
var productStr = "";

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
    comfirmOrder=this;

    let pay; 
    options.pay ="tiaodan";
    if (options.pay =="xiadan")
      pay = "确认下单";
    else if (options.pay == "tiaodan")
      pay = "确认调单";
    let orderedFood = { productList: [] }
    comfirmOrder.setData({
      pay: pay,
      zhuohao: getApp().getZhuoNo(),
      orderedFood: orderedFood
    });
    comfirmOrder.initMenuInfo();
    comfirmOrder.getMineInfo();
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
  //用本地数据初始化菜单信息
  initMenuInfo:function(){
    let allSelectedFood = getApp().getAllSelectedFood();
    let productList=comfirmOrder.data.orderedFood.productList;
    for (let i = 0; i < allSelectedFood.length;i++){
      //console.log(allSelectedFood[i]);
      productList.push(allSelectedFood[i]);
    }
    comfirmOrder.setData({
      orderedFood: { productList: productList}
    });
    comfirmOrder.calulateMoneyAndAmount();
  },
  calulateMoneyAndAmount: function () {
    let productList = comfirmOrder.data.orderedFood.productList;
    for (let i = 0; i < productList.length;i++){
      mount += productList[i].quantity;
      money += productList[i].price * productList[i].quantity;
      if (i < (productList.length - 1)) {
        productStr += JSON.stringify(productList[i]) + ",";
      } else {
        productStr += JSON.stringify(productList[i]);
      }
    } 
    productStr = "[" + productStr + "]";
    comfirmOrder.refreshUI();
    console.log(productStr);
  },
  refreshUI:function(){
    comfirmOrder.setData({
      mount: mount,
      mount1: mount,
      money: money,
      money1: money,
      totalAmount:money,
      shiFu:money
    });
  },
  getMineInfo:function(){
    wx.request({
      url: 'http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/getAccountMes?token=ba1cef27-3b9e-4bbe-bbca-f679ece55475',
      method: 'POST',
      success: function (res) {
        console.log(res);
        var data = res.data;
        if (data.code == 100) {
          comfirmOrder.setData({
            imgUrl: data.data.imgUrl,
            nickName: data.data.nickName
          });
        }
      }
    })
  }
})