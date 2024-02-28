// components/addressPicker/addressPicker.ts
import { get_area } from "../../api/home"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    areaAddress:{ // 三级区域地址
      type: String,
      value: ""
    },
    required:{ // 三级区域地址
      type: Boolean,
      value: false
    },
    detailAddress:{ // 详细地址
      type: String,
    	value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    areaObj: {},
    fieldNames: {
      text: 'area_name',
      value: 'id',
      children: 'children',
    },
    //地址选择
    addressBoxshow: false,
    addressValue: "",
    addressOptions: [],
  },
  lifetimes: {
    ready: function () {
      this.get_province(0, 1)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    get_province(pid, level) {
      
      
      var Odata = this.data.addressOptions
      if (level <= 2) {
        get_area({ pid: pid }).then((e) => {
          if (level != 2) {
            e.forEach((el) => {
              el.children = []
            })
          }
          if (pid == 0) {
            Odata = e
          } else {
            let rec = (data) => {
              data.forEach((el, index) => {
                if (el.id == pid) {
                  el.children = e
                } else if (el.children) {
                  rec(el.children)
                }
              })
            }
            rec(Odata)
          }
          
          this.setData({
            addressOptions: Odata,
          })
          
        })
      }
    },
    province_change(e) {
      
      let pid = e.detail.value
      let level = e.detail.tabIndex + 1
      this.get_province(pid, level)
    },
    showAddresbox() {
      this.setData({
        addressBoxshow: true,
      })
    },
    hidenAddressbox() {
      this.setData({
        addressBoxshow: false,
      })
    },
    selectRegion(e) {
      const {selectedOptions, value} = e.detail
      
      const fieldValue = selectedOptions.map((option) => option.area_name).join("")
      //后端传值时需要传省区市id
      let address_obj = {
        province_id: selectedOptions[0]['id'],//省id
        city_id: selectedOptions[1]['id'],//市id
        district_id: selectedOptions[2]['id'],//区id
        province_name: selectedOptions[0]['area_name'],//省名
        city_name: selectedOptions[1]['area_name'],//市名
        district_name: selectedOptions[2]['area_name']//区名
      }
      this.setData({
        areaObj: address_obj,
        areaAddress: fieldValue,
        addressValue: value,
        addressBoxshow: false,
      })
    },
  },
})
