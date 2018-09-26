//logs.js
const util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    logs: [],
    openid:'',
    queryResult: [],
    // axis: [
    //   {
    //     time: '4-16',
    //     name: '杨丹',
    //     event: '生日快乐'
    //   },
    //   {
    //     time: '4-21(农历)',
    //     name: '兰丰',
    //     event: '生日快乐'
    //   },
    //   {
    //     time: '8-5(农历)',
    //     name: '丰爱莲',
    //     event: '生日快乐'
    //   },
    //   {
    //     time: '8-6(农历)',
    //     name: '兰泽军',
    //     event: '生日快乐'
    //   },
    //   {
    //     time: '8-16(农历)',
    //     name: '兰小兵',
    //     event: '祝大哥生日快乐'
    //   },
    //   {
    //     time: '9-24(农历)',
    //     name: '兰继平',
    //     event: '2018-11-1，周四，提前祝生日快乐'
    //   },
    // ],
  },


  onLoad: function() {
    this.onQuery();
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      }),
      openid: (app.globalData.openid || 'openid')
    })
  },

  onQuery: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('counters').where({
      _openid: this.data.openid
    }).orderBy('time','asc').get({
      success: res => {
        let datas = res.data;
        let queryResult = [];
        for (var i = 0; i < datas.length; i++) {
          let row = {};
          row.id = datas[i]._id;
          row._openid = datas[i]._openid;
          row.title = datas[i].title;
          row.event = datas[i].event;
          row.time = util.formatDate(datas[i].time);
          queryResult.push(row);
        }
        this.setData({
          // queryResult: JSON.stringify(res.data, null, 2)
          queryResult: queryResult
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }
})