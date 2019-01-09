var comfirmOrder;
var mount = 0;
var money = 0;
var productStr = "";
var type;
var seatName;
var discountAmount=0;
var remark;
var orderAmount=20;
var discountCouponId=0;
var orderNumber;

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
    type = options.type;
    if (type =="xiadan")
      pay = "确认下单";
    else if (type == "tiaodan")
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
  },
  bottompay:function(){
    if (type == "xiadan")
      comfirmOrder.commitOrderBtn();
    else if (type == "tiaodan")
      comfirmOrder.comfirmTiaoDan();
  },
  commitOrderBtn:function(){
    //seatName = getApp().getZhuoNo();
    seatName = "3";
    console.log(seatName);
    discountAmount=0;
    remark ="微辣";
    orderAmount=comfirmOrder.data.shiFu;
    let jsonStr = comfirmOrder.createJsonStr();
    //let jsonStr = "[{productId:47,productName:美味鸡腿堡,quantity:2,price:10.0}]";
    console.log("jsonStr===" + jsonStr);
    let shopId="82";
    //return false;
    wx.request({
      url: "http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/confirmOrderButton",
      method: 'POST',
      data: { shopId: shopId, remark: remark, jsonProductList: jsonStr, discountAmount: discountAmount, seatName: seatName, orderAmount: orderAmount, discountCouponId: discountCouponId, token:"ba1cef27-3b9e-4bbe-bbca-f679ece55475"},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        //console.log("res==="+JSON.stringify(res));
        var data = res.data;
        //console.log("data==="+data);
        if (data.code == 100) {
          wx.setStorageSync("orderNumber",data.data);
          wx.showToast({
            title: '下单成功',
            duration:2000
          })
          wx.navigateTo({
            url: '/pages/dcMain/dcMain'
          })
        }
        else{
          wx.showToast({
            title: '下单失败',
            duration: 2000
          })
        }
      }
    })
  },
  comfirmTiaoDan:function(){
    /*
    orderNumber = wx.getStorageSync("orderNumber");
    seatName = wx.getStorageSync("zhuoNo");
    let shopId = wx.getStorageSync("shopId");
    */
    orderNumber ="1901055929510278";
    seatName="3";
    let shopId="82";
    //productStr ="[{productId:47,productName:美味鸡腿堡,quantity:1,price:10.0}]";
    productStr = productStr;

    wx.request({
      url: "http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/enterAdjustOrder",
      method: 'POST',
      data: { orderNumber: orderNumber, shopId: shopId, seatName: seatName, jsonProductList: productStr, token:"ba1cef27-3b9e-4bbe-bbca-f679ece55475"},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res);
        var data = res.data;
        console.log(data);
        if (data.code == 100) {
          wx.showToast({
            title: '发送调单请求成功，请等待商家确认',
            duration:2000
          })
          wx.navigateTo({
            url: '/pages/dcMain/dcMain',
          })
        }
        else{
          wx.showToast({
            title: '商家未接单，无法调单',
            duration: 2000
          })
        }
      }
    })
  },
  createJsonStr:function(){
    let result="";
    result+="[";
    let productList=comfirmOrder.data.orderedFood.productList;
    for (let i = 0; i < productList.length;i++){
      result += comfirmOrder.convertFoodToString(productList[i])+",";
    }
    result=result.substring(0, result.length-1);
    result += "]";
    return result;
  },
  convertFoodToString: function (food) {
    let newFood = { productId: "", productName: "", quantity: "", price: "" };
    newFood.productId = food.id;
    newFood.productName = food.productName;
    newFood.quantity = food.quantity;
    newFood.price = food.price;
    return JSON.stringify(newFood);
  }
})