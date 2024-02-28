// components/stepper/stepper.ts
Component({
  options: {
    styleIsolation: 'shared',
  },
  /**
   * 组件的属性列表
   */
  properties: {
    num:{
      type:Number,
      value:1
    },
    type:{
      type:String,
      value:""
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e){
      
      console.log('e: ', e);
      var num = e.detail
      this.setData({
        num:num,
      })
      this.triggerEvent('numchange', num)
      console.log(this.data.num);
    }
  }
})
