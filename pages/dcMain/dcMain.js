//dcMain.js
//获取应用实例
const app = getApp()
var dcMain;

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
  quJieSuan:function(){
    wx.navigateTo({
      url: '/pages/orderedList/orderedList',
    })
  }
})
