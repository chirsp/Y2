<template>
  <view class="content">
    <view class="login-t">
      <image class="login-logo" src="/static/head.png" mode="aspectFill"></image>
    </view>
    <view class="login-m">
      <view class="login-item">
        <input type="number" v-model="mobile" :maxlength="maxMobile" placeholder="请输入手机号码" focus placeholder-class="login-item-i-p" />
      </view>
      <view class="login-item flc">
        <input class="login-item-input" placeholder-class="login-item-i-p" type="text" v-model="code" placeholder="请输入验证码" />
        <view :class="sendCodeBtn" @click="sendCode()" v-if="verification">发送验证码</view>
        <view class="btn btn-g" v-if="!verification">{{ timer }} 秒后重新获取</view>
      </view>

    </view>
    <view class="login-b">
     <button :class="regButtonClass" @click="showTopTips()" hover-class="btn-hover">登录</button>
    </view>
  </view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
export default {
  data() {
    return {
      maxMobile: 11,
      mobile: '', // 用户手机号
      code: '', // 短信验证码
      user_wx_id: '', //授权id
      verification: true, // 通过v-show控制显示获取还是倒计时
      timer: 60, // 定义初始时间为60s
      btnb: 'btn btn-square btn-c btn-all', //按钮背景
      type: '', // 有值是第三方登录账号绑定
      isWeixinBrowser: this.$api.isWeiXinBrowser()
    }
  },
  onLoad(option) {
      this.verification = true
  },
  computed: {
    // 验证手机号
    rightMobile() {
      let res = {}
      if (!this.mobile) {
        res.status = false
        res.msg = '请输入手机号'
      } else if (!/^1[3456789]{1}\d{9}$/gi.test(this.mobile)) {
        res.status = false
        res.msg = '手机号格式不正确'
      } else {
        res.status = true
      }
      return res
    },
    // 动态计算发送验证码按钮样式
    sendCodeBtn() {
      let btn = 'btn btn-g'
	 
      if (this.rightMobile.status) {
        return btn + ' btn-b'
      } else {
        return btn
      }
    },
    // 动态更改登录按钮bg
    regButtonClass() {
      return this.mobile && this.mobile.length === this.maxMobile && this.code
        ? this.btnb + ' btn-b'
        : this.btnb
    },

  },
  onShow() {
    let _this = this
    let userToken = _this.$api.getStorage("kejia_order_token")
    if (userToken) {
      uni.switchTab({
        url: '/pages/index/index'
      })
      return true
    }
    this.timer=0 // 递减时间
    this.verification = true
  },
  methods: {
	  ...mapMutations(['login']),
    // 发送短信验证码
    sendCode() {
      if (!this.rightMobile.status) {
        this.$api.toast(this.rightMobile.msg)
      } else {
		  uni.showLoading({
		  	title:"发送中..."
		  })
        setTimeout(() => {
          uni.hideLoading()
		  var _this = this
		  
		  // 请求发送验证码接口
		  _this.$api.ajax('smdc/user/sendCode',{
		  	mobile:_this.mobile,
			shop_id:_this.$store.state.shopId,
			template_id:2,
		  },function(ret){
		  	_this.timer = 60
		  	_this.verification = false
		  	_this.countDown() // 执行验证码计时
		  },"POST");
		  
        }, 1000)
      }
    },
    // 去注册
    toReg() {
      this.$api.openWin('/pages/login/register')
    },
    // 验证码倒计时
    countDown() {
      let auth_timer = setInterval(() => {
        // 定时器设置每秒递减
        this.timer-- // 递减时间
        uni.setStorage({
          key: 'timer',
          data: this.timer,
          success: function() {}
        })
        if (this.timer <= 0) {
          this.verification = true // 60s时间结束还原v-show状态并清除定时器
          clearInterval(auth_timer)
        }
      }, 1000)
    },
   
    // 重定向跳转 或者返回上一个页面
    redirectHandler() {
       this.$api.successToShow('登录成功!', () => {
        this.$api.setStorage('timer', 0)
        this.$api.del('invitecode')
        this.handleBack()
      })
    },
    // 跳转到普通登录
    toLogin() {
      uni.navigateTo({
        url: '/pages/login/login1'
      })
    },
    //提交按钮
    showTopTips() {
		console.log(1111)
      let _this = this
      if (_this.mobile == '') {
        _this.$api.toast('请输入手机号码')
        return false
      }
      if (this.code == '') {
          _this.$api.toast('请输入验证码')
        return false
      }
	  this.timer==0 // 递减时间
	  this.verification = true
      
	 // 请求发送验证码接口
	 _this.$api.ajax('smdc/user/loginByCode',{
	 	mobile:_this.mobile,
	 	shop_id:_this.$store.state.shopId,
	 	code:_this.code
	 },function(ret){
		 console.log(ret)
		 let info = {
		 	uid: ret.data.id,
		 	userInfo: ret.data
		 }
		 _this.login(info);
		 _this.$api.setStorage("kejia_order_uid", ret.data.id);
		 _this.$api.setStorage("kejia_order_openId", ret.data.openid);
		 _this.$api.setStorage("kejia_order_userInfo", ret.data);
		 _this.$api.setStorage("kejia_order_token", ret.data.token);
		 console.log(_this.type)
		 if((ret.data.openid=='' || ret.data.openid==undefined)){
			 console.log(333)
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					
					// console.log("App微信获取用户信息成功", loginRes);
					let result=Object.assign(ret,loginRes)
					console.log(result)
					_this.getApploginData(result)
				
				},
				fail: function(res) {
					console.log("App微信获取用户信息失败", res);
				}
			})
		 }
		 // uni.navigateBack();
		// uni.reLaunch({
		// 		url:"/pages/index/index"
		// 	})	
	 },"POST");
	  
    },
  
    // 切换登录方式
    selectLoginType() {
		this.$api.openWin("/pages/login/login1")
    },
	//app第三方登录
		handleThirdLoginApp(ret) {
			let resu=ret;
			console.log(ret)
			// if(!this.flag){return this.$api.toast("请先阅读并勾选用户协议和隐私政策")};
			// uni.showLoading({
			// 	title: "正在登录"
			// })
			console.log(11111)
			var that = this
		
		},
	    
		// 通过接口换取微信登录信息
		getApploginData(data) {
			console.log(222)
			let mobile;
			if(typeof data=='object'){
				if(data.hasOwnProperty(data)){
					 mobile=data.data.mobile;
				}else{
					mobile="";
				}
				
			}else{
				 mobile="";
			}
			var that = this
			uni.request({
				url: "https://api.weixin.qq.com/sns/userinfo?access_token=" + data.authResult.access_token + "&openid=" + data.authResult
					.openid,
				method: 'GET',
				dataType: 'json',
				header: {
					'content-type': 'application/x-www-form-urlencoded' // 默认值
				},
				success(res) {
					that.$api.ajax('smdc/index/applogin', {
						shop_id: that.$store.state.shopId || 0,
						openid: res.data.openid,
						nickName: res.data.nickname,
						avatarUrl: res.data.headimgurl,
						mobile:mobile ,
					}, function(ret) {
						uni.hideLoading()
						//判断是否返回了token，如果没有，就说明没有绑定账号，跳转到绑定页面
						if (ret.code == 2) {
							uni.showToast({
								title: "登录成功，前往绑定手机号"
							})
							uni.navigateTo({
								url: '/pages/login/bingphone?wxinfo=' + JSON.stringify(ret.data)
							})
						} else {
							let info = {
								uid: ret.data.id,
								userInfo: ret.data
							}
							that.login(info);
							that.$api.setStorage("kejia_order_uid", ret.data.id);
							that.$api.setStorage("kejia_order_openId", ret.data.openid);
							that.$api.setStorage("kejia_order_userInfo", ret.data);
							that.$api.setStorage("kejia_order_token", ret.token);
							// uni.navigateBack();
							uni.reLaunch({
								url:'../index/index'
							})
						}
					}, 'POST', false)
	
				},
				fail() {
	
				}
			})
		},
	
  }
}
</script>

<style lang="scss">
	.fz12{
		font-size: 24upx;
	}
	.flc{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
.content {
  /*  #ifdef  H5  */
  height: calc(100vh - 90upx);
  /*  #endif  */
  /*  #ifndef  H5  */
  height: 100vh;
  /*  #endif  */
  background-color: #fff;

  padding: 0upx 100upx;
}
.login-t {
  text-align: center;
  padding: 50upx 0;
}
.login-logo {
  width: 180upx;
  height: 180upx;
  border-radius: 20upx;
  background-color: #f8f8f8;
  /* margin: 0 auto; */
}
.login-m {
  margin-bottom: 100upx;
}
.login-item {
  border-bottom: 2upx solid #d0d0d0;
  overflow: hidden;
  padding: 10upx;
  color: #333;
  margin-bottom: 30upx;
}
.login-item-input {
  display: inline-block;
  flex: 1;
  box-sizing: border-box;
}
.login-item .btn {
  border: none;
  width: 40%;
  text-align: right;
  padding: 0;
  &.btn-b {
    background: none;
    color: #333 !important;
  }
}
.login-b .btn {
  color: #999;
}
.btn-b {
  color: #fff !important;
  background-color: #F87B16;
}
.login-other {
  margin-bottom: 40upx;
  .item {
    padding: 20upx 0;
  }
}
.btn-square {
  color: #333;
}
</style>
