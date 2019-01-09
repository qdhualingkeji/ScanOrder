//dcMain.js
//获取应用实例
const app = getApp()
var dcMain;
var allSelectedFood;
var foodMount = 0;
var strJiaCai;
var orderNumber;

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
  onLoad: function (options) {
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
    strJiaCai=options.jiacai;
    orderNumber=wx.getStorageSync("orderNumber");
    //orderNumber ="1901055929510278";
    //console.log(orderNumber);
  },
  onReady:function(){
    this.getShopShowInfoById();
    this.getCategoryList();
  },
  getShopShowInfoById:function(){
    wx.request({
      url: 'http://120.27.5.36:8080/htkApp/API/shopDataAPI/getShopShowInfoById',
      method: 'POST',
      data: { shopId: 80},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
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
    wx.request({
      url: "http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/getCategoryList",
      method: 'POST',
      data: { shopId:82},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        var data = res.data;
        if(data.code==100){
          let categoryList=data.data;
          dcMain.setData({
            categoryList: categoryList
          });
          //console.log(dcMain.data.categoryList[0].id);
          //var categoryId = dcMain.data.categoryList[0].id;
          let goodsListArr=[];
          for (let i = 0; i < categoryList.length;i++){
            wx.request({
              url: 'http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/getGoodsListByCategoryId',
              method: 'POST',
              data: { categoryId: categoryList[i].id, token: "ba1cef27-3b9e-4bbe-bbca-f679ece55475"},
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              success: function (res) {
                var data = res.data;
                if (data.code == 100) {
                  let goodsList = data.data;
                  for (let j = 0; j < goodsList.length; j++) {
                    goodsList[j].quantity = 0;
                    goodsList[j].display = "none";
                  }
                  goodsListArr=goodsListArr.concat(goodsList);
                  if (i == categoryList.length - 1) {
                    dcMain.initFoodQuantity(goodsListArr);
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
  initFoodQuantity: function (foodsList) {
    if(strJiaCai=="jiacai"){
      for (let i = 0; i < foodsList.length;i++){
        let food=foodsList[i];
        let iter = getApp().getAllSelectedFood();
        for (let j = 0; j < iter.length; j++) {
          if (food.categoryId == iter[j].categoryId & food.id == iter[j].id) {
            food.quantity = iter[j].quantity;
            break;
          }
        }
      }

      dcMain.setData({
        goodsList: foodsList
      });

      dcMain.getGoodsListByCategoryId();
      dcMain.calulateMoneyAndAmount();
    }
    else if (orderNumber != "") {
      wx.request({
        url: "http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/getOrderDetailsByOrderNumber",
        method: 'POST',
        data: { orderNumber: orderNumber, shopId: 82, token:"ba1cef27-3b9e-4bbe-bbca-f679ece55475"},
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function (res) {
          //console.log(res);
          var data = res.data;
          if (data.code == 100) {
            var productList = data.data.productList;
            for (let i = 0; i < foodsList.length; i++){
              let food = foodsList[i];
              for (let j = 0; j < productList.length; j++) {
                let product = productList[j];
                if ((food.categoryId == product.categoryId) & (food.id == product.id)) {
                  food.quantity = product.quantity;
                  break;
                }
              }
            }

            dcMain.setData({
              goodsList: foodsList
            });

            dcMain.getGoodsListByCategoryId();
            dcMain.calulateMoneyAndAmount();
          }
        }
      })
    }
    else {
      console.log("foodsList===" + foodsList.length);
      dcMain.setData({
        goodsList: foodsList
      });

      dcMain.getGoodsListByCategoryId();
      dcMain.calulateMoneyAndAmount();
    }
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
    /*
    console.log(allSelectedFood[index]);
    if(allSelectedFood.length>0)
      allSelectedFood[index].quantity = newQuantity;
      */
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
      /*
      if (allSelectedFood.length > 0)
        allSelectedFood[index].quantity = newQuantity;
        */
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
      url: 'http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/checkIfAlreadyExistOrder',
      method: 'POST',
      data: { shopId: 82, token:"ba1cef27-3b9e-4bbe-bbca-f679ece55475"},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
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
      if (gsList[i].quantity>0&!dcMain.checkIfExist(gsList[i])){
        //console.log("=====" + dcMain.checkIfExist(gsList[i]));
        getApp().addSelectedFood(gsList[i]);
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
  },
  goOrder:function(){
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail',
    })
  }
})
