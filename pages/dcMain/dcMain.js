//dcMain.js
//获取应用实例
const app = getApp()
var dcMain;
var allSelectedFood;
var foodMount = 0;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    dcMain=this;
    allSelectedFood=getApp().getAllSelectedFood();
  },
  onReady:function(){
    this.getShopShowInfoById();
    this.getCategoryList();
  },
  getShopShowInfoById:function(){
    wx.request({
      url: 'http://120.27.5.36:8080/htkApp/API/shopDataAPI/getShopShowInfoById?shopId=80',
      method: 'POST',
      success: function (res){
        console.log(res);
        var data = res.data;
        if (data.code == 100){
          dcMain.setData({
            shopName: data.data.shopName,
            locationAddress: data.data.locationAddress,
            logoUrl: data.data.logoUrl
          });
        }
      }
    })
  },
  getCategoryList:function(){
    //console.log(111111111);
    wx.request({
      url: 'http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/getCategoryList?shopId=82',
      data: { shopId:"82"},
      method: 'POST',
      success:function(res){
        var data = res.data;
        if(data.code==100){
          //console.log(data.data);
          let categoryList=data.data;
          dcMain.setData({
            categoryList: categoryList
          });
          //console.log(dcMain.data.categoryList[0].id);
          //var categoryId = dcMain.data.categoryList[0].id;
          let goodsListArr=[];
          for (let i = 0; i < categoryList.length;i++){
            wx.request({
              url: 'http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/getGoodsListByCategoryId?categoryId=' + categoryList[i].id,
              method: 'POST',
              success: function (res) {
                var data = res.data;
                if (data.code == 100) {
                  let goodsList = data.data;
                  for (let j = 0; j < goodsList.length; j++) {
                    goodsList[j].quantity = 0;
                    goodsList[j].display = "none";
                    dcMain.initFoodQuantity(goodsList[j]);
                  }
                  goodsListArr=goodsListArr.concat(goodsList);
                  if (i == categoryList.length-1){
                    dcMain.setData({
                      goodsList: goodsListArr
                    });
                    dcMain.getGoodsListByCategoryId();
                    dcMain.calulateMoneyAndAmount();
                  }
                }
              }
            })
          }
        }
      },
      fail: function (res){
        console.log("---"+res);
      }
    })
  },
  getGoodsListByCategoryId: function (e) {
    let categoryId;
    if (e == undefined) {
      categoryId = dcMain.data.categoryList[0].id;
    }
    else {
      categoryId = e.currentTarget.id.substring(8);
    }
    let goodsList=dcMain.data.goodsList;
    for (let i = 0; i < goodsList.length;i++){
      if (goodsList[i].categoryId == categoryId){
        goodsList[i].display="block";
      }
      else{
        goodsList[i].display = "none";
      }
    }
    dcMain.setData({
      goodsList: goodsList
    });
  },
  initFoodQuantity: function (food) {
    let iter = getApp().getAllSelectedFood();
    for (let i = 0; i < iter.length; i++) {
      if (food.categoryId == iter[i].categoryId & food.id == iter[i].id) {
        food.quantity = iter[i].quantity;
        return true;
      }
    }
    return false;
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goGoodsdetail:function(e){
    let index=e.currentTarget.dataset.index;
    let goodsdetail=JSON.stringify(dcMain.data.goodsList[index]);
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?goodsdetail=' + goodsdetail,
    })
  },
  calulateMoneyAndAmount: function () {
    let mount = 0, price = 0;
    let goodsList = dcMain.data.goodsList;
    let length = goodsList.length;
    for (let i = 0; i < length; i++) {
      mount += goodsList[i].quantity;
      price += goodsList[i].price * goodsList[i].quantity;
    }
    dcMain.setData({
      foodTypeMount: mount,
      foodMoney: price
    });
  },
  addGood: function (e) {
    let index = e.currentTarget.dataset.index;
    let newQuantity = dcMain.data.goodsList[index].quantity + 1;
    dcMain.data.goodsList[index].quantity = newQuantity;
    if(allSelectedFood.length>0)
      allSelectedFood[index].quantity = newQuantity;
    dcMain.setData({
      goodsList: dcMain.data.goodsList
    });
    dcMain.showModify();
  },
  removeGood: function (e) {
    let index = e.currentTarget.dataset.index;
    console.log(index);
    if (dcMain.data.goodsList[index].quantity <= 0)
      return
    else {
      let newQuantity = dcMain.data.goodsList[index].quantity - 1;
      dcMain.data.goodsList[index].quantity = newQuantity;
      if (allSelectedFood.length > 0)
        allSelectedFood[index].quantity = newQuantity;
    }
    dcMain.setData({
      goodsList: dcMain.data.goodsList
    });
    dcMain.showModify();
  },
  showModify: function () {
    foodMount = 0;
    let goodsList = dcMain.data.goodsList;
    for (let i = 0; i < goodsList.length; i++) {
      foodMount += goodsList[i].quantity;
    }
    dcMain.calulateMoneyAndAmount();
  },
  quJieSuan:function(){
    let goodsList=dcMain.data.goodsList;
    dcMain.addFoodToList(goodsList);
  },
  addFoodToList: function (goodsList){
    let gsList=[];
    for (let i = 0; i < goodsList.length; i++) {
      let g = { categoryId: "", categoryName: "", id: "", quantity: "", imgUrl: "", price: "", productName:""};
      g.categoryId = goodsList[i].categoryId;
      g.categoryName = goodsList[i].categoryName;
      g.id=goodsList[i].id;
      g.quantity = goodsList[i].quantity;
      g.imgUrl=goodsList[i].imgUrl;
      g.price=goodsList[i].price;
      g.productName=goodsList[i].productName;
      gsList.push(g);
    }
    dcMain.checkIfAlreadyExistOrder(gsList);
  },
  checkIfAlreadyExistOrder: function (gsList){
    wx.request({
      url: 'http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/checkIfAlreadyExistOrder?shopId=82&token=ba1cef27-3b9e-4bbe-bbca-f679ece55475',
      method: 'POST',
      success: function (res) {
        console.log(res);
        var data = res.data;
        if (data.code == 100) {
          dcMain.nextAction(gsList,"xiadan");
        }
        else{
          dcMain.nextAction(gsList,"tiaodan");
        }
      }
    })
  },
  nextAction: function (gsList, type){
    for (let i = 0; i < gsList.length;i++){
      if (!dcMain.checkIfExist(gsList[i])){
        console.log(1111111);
      }
    }
    wx.navigateTo({
      url: '/pages/orderedList/orderedList?type=' + type,
    })
  },
  checkIfExist: function (food){
    let allSelectedFood=getApp().getAllSelectedFood();
    for (let i = 0; i < allSelectedFood.length;i++){
      let f=allSelectedFood[i];
      if(food.categoryId==f.categoryId){
        if(food.id==f.id){
          f.quantity = food.quantity;
          return true;
        }
      }
    }
    return false;
  }
})
