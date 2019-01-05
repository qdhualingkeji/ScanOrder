//获取应用实例
const app = getApp()
var orderedList;
var selectorQuery;
var foodMount=0;
var type;

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
    type = options.type;
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
      url: 'http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/getOrderDetailsByOrderNumber?orderNumber=1812283456410058&shopId=82&token=ba1cef27-3b9e-4bbe-bbca-f679ece55475',
      method: 'POST',
      success: function (res) {
        console.log(res);
        var data = res.data;
        if (data.code == 100) {
          var productList = data.data.productList;
          orderedList.setData({
            productList: productList
          });

          for (let i = 0; i < productList.length;i++){
            if(!orderedList.checkIfExist(productList[i])){
              getApp().addSelectedFood(productList[i]);
            }
          }
        }
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
        duration:'2000'
      })
    }
    else{
      orderedList.toConfirm();
    }
  },
  toConfirm:function(){
    wx.navigateTo({
      url: '/pages/comfirmOrder/comfirmOrder?type=tiaodan'// + type,
    })
  }
})