//获取应用实例
const app = getApp()
var orderDetail;
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
    orderDetail = this;
    orderNumber = wx.getStorageSync("orderNumber");
    //console.log(wx.getStorageSync("aaa"));
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
      url: "http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/getOrderDetailsByOrderNumber",
      method: 'POST',
      data: { orderNumber: orderNumber, shopId: 82, token:"ba1cef27-3b9e-4bbe-bbca-f679ece55475"},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res);
        var data = res.data;
        if (data.code == 100){
          let orderState = data.data.orderState;
          let paid, cook, finished, stateTip;
          if(orderState==0){
            paid = "未付款";
            cook = "未开始";
            finished = "未开始";
            stateTip ="未付款";
          }
          else if (orderState == 1) {
            paid = "已付款";
            cook = "烹饪中";
            finished = "未完成";
            stateTip = "烹饪中";
          }
          else if (orderState == 2) {
            paid = "已付款";
            cook = "已完成";
            finished = "已完成";
            stateTip = "已完成";
          }
          orderDetail.setData({
            orderState: orderState,
            paid: paid,
            cook: cook,
            finished: finished,
            stateTip: stateTip,
            orderNumber: orderNumber
          });

          orderDetail.setData({
            orderTime: data.data.orderTime
          });

          orderDetail.setData({
            productList: data.data.productList,
            productListLength: data.data.productList.length,
            commitTime: data.data.commitTime
          });

          let totalMount=0, totalConsume=0;
          let length = orderDetail.data.productListLength;
          let productList=orderDetail.data.productList;
          for(let i=0;i<length;i++){
            totalMount += productList[i].quantity;
            totalConsume += productList[i].quantity*productList[i].price;
          }

          orderDetail.setData({
            totalMount: totalMount,
            totalConsume: totalConsume
          });
        }
      }
    })
  },
  tiaoDan: function () {
    if (orderNumber != null & orderNumber!=""){
      wx.navigateTo({
        url: '/pages/orderedList/orderedList?type=tiaodan'
      })
    }
    else{
      wx.showToast({
        title: '尚未初始化下单信息',
        duration:2000
      })
    }
  },
  cuiDan:function(){
    if (orderNumber != null & orderNumber != ""){
      //如果商家已接单
      if (orderDetail.data.orderState==1){
        let time = orderDetail.getReduceTimePeriod();
        if(time>10){
          orderDetail.cuiDanBtn();
        }
        else{
          wx.showToast({
            title: "美食正在烹饪，请不要频繁催单哦，" + (10 - time) + "分钟后再尝试吧~",
            duration: 2000
          })
        }
      }
      else{
        wx.showToast({
          title: '商家尚未接单，无法催单',
          duration: 2000
        })
      }
    }
    else{
      wx.showToast({
        title: '尚未初始化下单信息',
        duration: 2000
      })
    }
  },
  getReduceTimePeriod:function(){
    let lastDate = 0;//cuidanLastDate
    let date=new Date();
    let nowDate=date.getTime();
    let periodTime=nowDate-lastDate;
    let minute=periodTime/1000/60;
    return minute;
  },
  cuiDanBtn:function(){
    //put
    wx.request({
      url: "http://120.27.5.36:8080/htkApp/API/buffetFoodAPI/reminderInterface",
      method: 'POST',
      data: { orderNumber: orderNumber},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res);
        var data = res.data;
        if (data.code == 100) {
          wx.showToast({
            title: '催单成功',
            duration:2000
          })
        }
        else{
          wx.showToast({
            title: '商家未接单',
            duration: 2000
          })
        }
      }
    })
  },
  goDianCai:function(){
    wx.navigateTo({
      url: '/pages/dcMain/dcMain',
    })
  }
})