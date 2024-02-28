// components/routerBefore.ts
import { routerJump } from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    to: String,
    requireLogin: {
      type: Boolean,
      value: true, // todo use default
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
    /**
     * 检查是否需要登录 requireLogin = true
     */
    routerCheck() {
      const to = encodeURIComponent(this.data.to)
      const requireLogin = this.data.requireLogin
      const userInfo = wx.getStorageSync("userInfo")
      // 需要登录才能访问的页面
      if (requireLogin) {
        // 未登录
        if (userInfo == "" || !userInfo.uid) {
          wx.navigateTo({
            url: '/pages/login/login?redirect=' + to
          })
        } else {
          // 已经登录
          routerJump(to, false)
        }
      }
      else {
        // 不需要登录，直接跳转
        routerJump(to, false)
      }
    }
  }
})
