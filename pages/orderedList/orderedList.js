//获取应用实例
const app = getApp()
var orderedList;
var selectorQuery;
var foodMount=0;
var type;
var orderNumber;
var shopId;
var rootIP;

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
    orderedList = this;
    rootIP = getApp().getRootIP();
    type = options.type;
    shopId = wx.getStorageSync("shopId");
    orderNumber = wx.getStorageSync("orderNumber");
    //orderNumber ="1901055929510278";
    selectorQuery = wx.createSelectorQuery();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getOrderDetailsByOrderNumber();
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

  getOrderDetailsByOrderNumber:function(){
    wx.request({
      url: rootIP+"getOrderDetailsByOrderNumber",
      method: 'POST',
      data: { orderNumber: orderNumber, shopId: shopId, token:"ba1cef27-3b9e-4bbe-bbca-f679ece55475"},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        var data = res.data;
        let productList=[];
        if (data.code == 100) {
          productList = data.data.productList;
          //console.log(productList);
          if (productList!=null){
            for (let i = 0; i < productList.length; i++) {
              //console.log("food===" + orderedList.checkIfExist(productList[0]));
              if(!orderedList.checkIfExist(productList[i])){
                getApp().addSelectedFood(productList[i]);
              }
            }
          }
        }
        let ofList=getApp().getAllSelectedFood();
        /*
        for (let i = 0; i < ofList.length; i++) {
          productList.push(ofList[i]);
        }
        */
        orderedList.setData({
          productList: ofList
        });
        orderedList.calulateMoneyAndAmount();
      }
    })
  },
  checkIfExist: function (food){
    let iter = getApp().getAllSelectedFood();
    for (let i = 0; i < iter.length; i++) {
      if (food.categoryId == iter[i].categoryId & food.id == iter[i].id) {
        return true;
      }
    }
    return false;
  },
  calulateMoneyAndAmount:function(){
    let mount = 0, price=0;
    let productList=orderedList.data.productList;
    let length=productList.length;
    for(let i=0;i<length;i++){
      mount+=productList[i].quantity;
      price+=productList[i].price*productList[i].quantity;
    }
    orderedList.setData({ 
      foodTypeMount: mount,
      foodMoney: price
    });
    foodMount = mount;
  },
  plusProduct: function (e) {
    let index=e.currentTarget.dataset.index;
    //selectorQuery.select("#quantity_input" + id).boundingClientRect();
    let newQuantity =orderedList.data.productList[index].quantity+1;
    orderedList.data.productList[index].quantity = newQuantity;
    let allSelectedFood=getApp().getAllSelectedFood();
    if(allSelectedFood[index]==undefined){
      let selectedFood;
      allSelectedFood[index] = selectedFood;
    }
    allSelectedFood[index].quantity = newQuantity;
    orderedList.setData({
      productList: orderedList.data.productList
    });
    orderedList.showModify();
  },
  reduceProduct:function(e){
    let index = e.currentTarget.dataset.index;
    if (orderedList.data.productList[index].quantity<=1)
      return
    else{
      let newQuantity=orderedList.data.productList[index].quantity-1;
      orderedList.data.productList[index].quantity = newQuantity;
      getApp().getAllSelectedFood()[index].quantity = newQuantity;
    }
    orderedList.setData({
      productList: orderedList.data.productList
    });
    orderedList.showModify();
  },
  deleteProduct:function(e){
    let index=e.currentTarget.dataset.index;
    let productList=orderedList.data.productList;
    productList.splice(index, 1);
    console.log(productList);
    orderedList.setData({
      productList: productList
    });
    getApp().getAllSelectedFood().splice(index, 1);
    orderedList.showModify();
  },
  showModify:function(){
    foodMount = 0;
    let productList=orderedList.data.productList;
    for (let i = 0; i < productList.length; i++) {
      foodMount += productList[i].quantity;
    }
    orderedList.calulateMoneyAndAmount();
  },
  jiaCai:function(){
    wx.navigateTo({
      url: '/pages/dcMain/dcMain?jiacai=jiacai',
    })
  },
  confirm:function(){
    if (foodMount <= 0){
      wx.showToast({
        title: '食品数量不符合要求',
        duration:2000
      })
    }
    else{
      orderedList.toConfirm();
    }
  },
  toConfirm:function(){
    console.log(22222);
    wx.navigateTo({
      url: '/pages/comfirmOrder/comfirmOrder?type=' + type,
    })
  }
})