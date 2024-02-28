// components/datePicker.ts
import { timestampToobj } from "../../utils/util"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dateValue: { // 选中的时间
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
    border:{
      type: Boolean,
      value: false
    },
    maxDate:{
      type:Number,
      value:new Date().getTime()+10*365*24*60*60*1000
    },
    minDate:{
      type:Number,
      value:new Date().getTime()-10*365*24*60*60*1000
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //时间选择
    isShowtimeselect: false,
    currentDate:new Date().getTime(),
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`
      }
      if (type === "month") {
        return `${value}月`
      }
      return value
    },
  },

  observers:{
    'dateValue':function(dateValue){
      let time = new Date(dateValue).getTime()
      console.log('time: ', time);
      this.setData({
        currentDate:time?time:new Date().getTime()
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //时间选择
    showTimeselect(e) {
      this.setData({
        isShowtimeselect: true,
      })
    },
    timesubmit(e) {
      let timeObj = timestampToobj(e.detail)
      let timeStr = `${timeObj.year}/${timeObj.month}/${timeObj.Date}`
      this.setData({
        currentDate: e.detail,
        isShowtimeselect: false,
        dateValue: timeStr,
      })
      console.log(this.data.dateValue)
    },
    hidenTimeselect(e) {

      this.setData({
        isShowtimeselect: false,
      })
    },
  }
})
