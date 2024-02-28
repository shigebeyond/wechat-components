// components/worktimePicker/worktimePicker.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    worktimes: { // 营业时间的json数组
      type: String,
      value: ''
    },
    required: { // 必填
      type: Boolean,
      value: false
    },
    label: { // 标签
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    //营业选择
    isShowweekselect: false,
    wtlist: [{
      index: "",
      weekText: "",
      date_from: "",
      date_to: "",
      work_start_time: "",
      work_end_time: "",
    }],
    // worktimes: "",
    weeklist: [{
      values: [{
        label: "一",
        key: 1
      }, {
        label: "二",
        key: 2
      }, {
        label: "三",
        key: 3
      }, {
        label: "四",
        key: 4
      }, {
        label: "五",
        key: 5
      }, {
        label: "六",
        key: 6
      }, {
        label: "日",
        key: 7
      }],
      className: "startweek",
      defaultIndex: 0
    }, {
      values: [{
        label: "一",
        key: 1
      }, {
        label: "二",
        key: 2
      }, {
        label: "三",
        key: 3
      }, {
        label: "四",
        key: 4
      }, {
        label: "五",
        key: 5
      }, {
        label: "六",
        key: 6
      }, {
        label: "日",
        key: 7
      }],
      className: "endweek",
      defaultIndex: 0
    }],
    //星期弹窗显示
    startWeek: "",
    startWeekkey: "",
    endWeek: "",
    endWeekkey: "",
    nowShowindex: "",
    //时间弹窗
    isShowweektime: false,
    nowWeektime: "00:00",
    nowShowtimetype: "",
    timeMaxhour: "23",
    timeMaxminute: "59",
    timeMinhour: "00",
    timeMinminute: "00",

  },
  observers: {
    'worktimes': function (worktimes) {
      if(worktimes != ""){
        this.setData({
          wtlist: JSON.parse(worktimes),
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    cancelWeek(e){
      this.setData({
        isShowweekselect: false,
      })
    },
    hidenTimeselect(e) {
      this.setData({
        isShowweektime: false,
      })
    },
    // 营业时间
    showweekselect(e) {

      var item = e.currentTarget.dataset.item
      var newWeeklist = this.data.weeklist
      var weekText = ["一", "二", "三", "四", "五", "六", "日"]
      newWeeklist[0].defaultIndex = item.date_from - 1
      newWeeklist[1].defaultIndex = item.date_to - 1
      this.setData({
        isShowweekselect: true,
        weeklist: newWeeklist,
        startWeek: "星期" + weekText[item.date_from - 1],
        endWeek: "星期" + weekText[item.date_to - 1],
        nowShowindex: item.index,
      })
    },
    weekChange(e) {

      // 0: {label: "三", key: 3}
      // 1: {label: "五", key: 5}
      var res = e.detail.value
      var weekText = ["一", "二", "三", "四", "五", "六", "日"]
      this.setData({
        startWeek: "星期" + weekText[res[0].key - 1],
        startWeekkey: res[0].key,
        endWeek: "星期" + weekText[res[1].key - 1],
        endWeekkey: res[1].key,
      })
    },
    submitWeek(e) {
      var weekTextarray = ["一", "二", "三", "四", "五", "六", "日"]
      this.setData({
        [`wtlist[${this.data.nowShowindex - 1}].weekText`]: `星期${weekTextarray[this.data.startWeekkey - 1]}到星期${weekTextarray[this.data.endWeekkey - 1]}`,
        [`wtlist[${this.data.nowShowindex - 1}].date_from`]: this.data.startWeekkey,
        [`wtlist[${this.data.nowShowindex - 1}].date_to`]: this.data.endWeekkey,
        isShowweekselect: false,
      },()=>{
        this.setData({
          worktimes: JSON.stringify(this.data.wtlist)
        })
      })
    },
    showweektime(e) {
      var item = e.currentTarget.dataset.item
      
      var type = e.currentTarget.dataset.type
      
      var idx = item.index
      this.setData({
        isShowweektime: true,
        nowWeektime: item[type],
        nowShowindex: idx,
        nowShowtimetype: type,
      })
      if (type.indexOf("start") > -1) {
        this.setData({
          timeMaxhour: item["work_end_time"].split(":")[0],
          timeMaxminute: "59",
          timeMinhour: "00",
          timeMinminute: "00"
        })

      } else {
        this.setData({
          timeMaxhour: "23",
          timeMaxminute: "59",
          timeMinhour: item["work_start_time"].split(":")[0],
          timeMinminute: "00"
        })
      }
    },
    weektimesubmit(e) {
      console.log('e: ', e);
      
      this.setData({
        [`wtlist[${this.data.nowShowindex - 1}].${this.data.nowShowtimetype}`]: e.detail,
        isShowweektime: false,
      },()=>{
        this.setData({
          worktimes: JSON.stringify(this.data.wtlist)
        })
      })
    },
    // 添加营业时间项
    addWtItem(e) {
      let wtlength = this.data.wtlist.length + 1
      if (wtlength <= 10) {
        let obj = {
          index: wtlength,
          weekText: "星期一到星期日",
          date_from: "1",
          date_to: "1",
          work_start_time: "00:00",
          work_end_time: "23:59",
        }
        this.data.wtlist.push(obj)
        var wtlist = this.data.wtlist
        this.setData({
          wtlist: wtlist,
          worktimes: JSON.stringify(wtlist)
        })
      }
    },
    //删除营业时间项
    reduceWtItem(e) {
      let delindex = e.currentTarget.dataset.index
      let wtlist = this.data.wtlist
      wtlist.splice(delindex - 1, 1)
      
      wtlist.forEach((el, index) => {
        el.index = index + 1
      });
      this.setData({
        wtlist: wtlist,
        worktimes: JSON.stringify(wtlist)
      })
    },
    timechange(res){
      let hour = res.detail.getColumnValue(0)
      let min = res.detail.getColumnValue(1)
      if(this.data.nowShowtimetype.indexOf("start")> -1){
        if(hour == this.data.wtlist[this.data.nowShowindex-1]["work_end_time"].split(":")[0]){
          this.setData({
            nowWeektime:`${hour}:${min}`,
            timeMaxminute:this.data.wtlist[this.data.nowShowindex-1]["work_end_time"].split(":")[1]
          })
        }else{
          this.setData({
            nowWeektime:`${hour}:${min}`,
            timeMaxminute:"59"
          })
        }
      }else{
        if(hour == this.data.wtlist[this.data.nowShowindex-1]["work_start_time"].split(":")[0]){
          this.setData({
            nowWeektime:`${hour}:${min}`,
            timeMinminute:this.data.wtlist[this.data.nowShowindex-1]["work_start_time"].split(":")[1]
          })
        }else{
          this.setData({
            nowWeektime:`${hour}:${min}`,
            timeMinminute:"00"
          })
        }
      }
    }
  }
})
