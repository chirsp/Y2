<template>
	<view class="content">
		<view class="login-t">
			<image class="login-logo" :src="logoImage" mode="aspectFill"></image>
		</view>
		<view>
			<view class="login-m">
				<view class="login-item">
					<input type="number" v-model="mobile" :maxlength="maxMobile" placeholder="请输入手机号码" placeholder-class="login-item-i-p" />
				</view>
				<view class="login-item flc">
					<input class="login-item-input" :password="true" placeholder-class="login-item-i-p" type="text" v-model="pwd"
					 placeholder="请输入密码" />
				</view>
				<view class="login-item" v-if="isCaptcha">
					<input class="login-item-input" placeholder-class="login-item-i-p" type="text" v-model="captcha" placeholder="输入验证码" />
					<img class='codeimg' :src="captchaUrl" alt="">
				</view>
			</view>
			<view class="login-b">
				<button :class="loginButtonClass" @click="loginHandler" hover-class="btn-hover">登录</button>

				<view class="login-other flc">
					<!-- <view class="fz12 item" @click="$api.openWin('/pages/index/index')">
						暂不登录
					</view> -->
					<view class="fz12 item" @click="selectLoginType">
						验证码登录
					</view>
					<view class="fz12 item" @click="toReg">
						注册
					</view>
				</view>
				<!-- <view class="forgetpw" @click="$api.openWin('/pages/login/forgetpw')">
			<text>修改密码?</text>
		</view> -->
			</view>
		</view>
		<!--  微信浏览器里 -->
		<!-- #ifdef H5 -->
		<template v-if="weixinBrowser">
			<view class="fz12 g5">
				第三方账号登录：
			</view>
			<view class="flc third-block">
				<view class="third-item" v-for="(item, key,index) in thirdPartyLogins" :key="index" @click="handleThirdLogin(item)">
					<image class="third-item-img" :src="getThirdLoginImg(key)" mode="aspectFill"></image>
				</view>
			</view>
		</template>
		<!-- #endif -->

		<!-- app中的第三方登录 -->
		<!-- #ifdef APP-PLUS || APP-PLUS-NVUE -->
		<view class="fz12 g5">
			第三方账号登录：
		</view>
		<view class="flc third-block" v-if="thirdPartyLogins.length>0">
			<view class="third-item" v-for="(item,index) in thirdPartyLogins" :key="index" @click="handleThirdLoginApp(item)">
				<image class="third-item-img" src="/static/weixin.png" mode="aspectFill" v-if="item=='weixin'"></image>
			</view>
		</view>
		<!-- #endif -->

		<!-- 微信小程序中的第三方登录 -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="fz12 g5">
			第三方账号登录：
		</view>
		<view class="flc third-block" v-if="thirdPartyLogins.length>0">
			<view class="third-item" v-for="(item,index) in thirdPartyLogins" :key="index">
				<button @getuserinfo='getUserInfo' open-type="getUserInfo" type="primary" class='wxlogin' plain>
					<image class="third-item-img" src="/static/weixin.png" mode="aspectFill" v-if="item=='weixin'"></image>
				</button>
			</view>
		</view>

		<!-- #endif -->
         <view class="_c66 agreement" >
			 <label  @click="selectFlag()">
			 	<checkbox color="#FEB026" style="transform: scale(0.7);" :checked="flag"  /><text></text>
			 </label>
         	<text>登录代表同意</text> 
			 <text class="mCol" @click="lookDetailInfo(agreemenet.id)">{{agreemenet.name}}</text>
			 <text>,并授权使用您的第三方账号信息(如昵称,头像) 以便您统一管理</text>
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
				mobile: '', // 手机号
				pwd: '', // 密码
				isCaptcha: false, // 是否需要验证码
				captcha: '', // 输入的验证码
				captchaUrl: '', // 验证码图片地址
				btnb: 'btn btn-square btn-c btn-all', // 按钮bg
				weixinBrowser: false, // 是否是微信浏览器
				thirdPartyLogins: ['weixin'], // 第三方登录列表	
				type:"",
				agreemenet:"",
				flag:false,
			}
		},
		onLoad(options) {
			// uni.hideShareMenu();
            this.getAgreement()
			
			// 判断浏览器环境
			this.weixinBrowser = this.$api.isWeiXinBrowser()

			if (this.weixinBrowser) {
				this.getAuths()
			}
			
			
			// #ifdef APP-PLUS
			 this.type = "app"
			 this.getAppAuths();
			// #endif
			
			// #ifdef H5
			  this.type = "h5"
			// #endif
			
			// #ifdef MP-WEIXIN
			  this.type = "weixin"
			// #endif
			console.log(this.type)
		},
		onShow() {
			// if (this.$api.get('userToken')) {
			// 	uni.switchTab({
			// 		url: '/pages/index/index'
			// 	})
			// }
		},
		computed: {
			// 动态更改登录按钮bg
			loginButtonClass() {
				return this.mobile && this.mobile.length === 11 && this.pwd ?
					this.btnb + ' btn-b' :
					this.btnb
			},
			logoImage() {
				return this.$store.state.shop_logo
			},
			getThirdLoginImg(key) {
				return key => {
					if (key == 'Wxofficial') {
						return '/static/weixin.png'
					} else if (key == 'weixin') {
						return '/static/weixin.png'
					}
				}
			}
		},
		methods: {
			...mapMutations(['login', 'changeNeedScan']),
			// 验证手机号
			rightMobile() {
				let res = {}
				if (!this.mobile) {
					res.status = false
					res.msg = '请输入手机号'
				} else if (!/^1[3456789]{1}\d{9}$/gi.test(this.mobile)) {
					res.status = false
					res.msg = '手机号格式不正确'
				} else if (!this.pwd) {
					res.status = false
					res.msg = '请输入密码'
				} else {
					res.status = true
				}
				return res
			},
			
			// 用户协议id
			selectFlag(){
				this.flag =! this.flag
			},
			
			// 登录处理
			loginHandler() {
				if (this.mobile && this.mobile.length === 11 && this.pwd) {
					if (!this.rightMobile().status) {
						this.$api.errorToShow(this.rightMobile().msg)
						return
					} else if(!this.flag){
						this.$api.toast("请先阅读并勾选用户协议和隐私政策")
						return
					}
					else {
						this.toLogin()
					}
				}
			},
			
			
			// 获取用户协议
			getAgreement(){
				let _this = this
				_this.$api.ajax('smdc/version/intro',{
					  shop_id:_this.$store.state.shopId,
				},function(ret){
					_this.agreemenet = ret.data[0]
				})
				
			},
			
			// 查看用户协议详情
			lookDetailInfo(id){
				this.$api.openWin('/pages/personal-center/agreemenet?id=' + id)
			},
			
			// 去注册
			toReg() {
				uni.redirectTo({
					url:"/pages/login/register"
				})
			},
			// 去登录
			toLogin() {
				let data = {
					mobile: this.mobile,
					password: this.pwd,
					shop_id: this.$store.state.shopId,
					type:this.type
				}

				if (this.isCaptcha) {
					data.captcha = this.captcha
				}

				// 获取邀请码
				let invicode = this.$api.getStorage('invitecode')
				if (invicode) {
					data.invitecode = invicode
				}

				var _this = this
				_this.$api.ajax('smdc/user/login', data, function(ret) {
					console.log(ret)
					ret.data.id ? _this.$api.toast("登录成功", "success") : _this.$api.toast("未成功登录，请重试")
					let info = {
						uid: ret.data.id,
						userInfo: ret.data
					}
					_this.login(info);
					console.log(ret)
					_this.$api.setStorage("kejia_order_uid", ret.data.id);
					_this.$api.setStorage("kejia_order_openId", ret.data.openid);
					_this.$api.setStorage("kejia_order_userInfo", ret.data);
					_this.$api.setStorage("kejia_order_token", ret.data.token);
					if(_this.type=='app' && (ret.data.openid=='' || ret.data.openid==undefined)){
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
				}, "POST");


			},
			// 重定向跳转 或者返回上一个页面
			redirectHandler() {
				this.$api.del('invitecode')
				this.handleBack()
			},
			// 登录方式切换
			selectLoginType() {
				this.$api.openWin('/pages/login/codelogin')
			},
			// 获取第三方登录列表
			getAuths() {

			},
			// 第三方登录授权
			handleThirdLogin(url) {
				this.$common.redirectTo('')
				let redirect = this.$store.state.redirectPage
				this.$db.set('redirectPage', redirect)
				window.location.href = url
			},

			// 微信小程序微信登录
			getUserInfo(e) {
				// console.log(e)
				let _this = this;
				let ret = e.detail;
				if (ret.errMsg == "getUserInfo:fail auth deny") {
					_this.$api.toast("为了更好的服务，请同意授权");
				} else if (ret.errMsg == "getUserInfo:ok") {
					_this.userLogin(e.detail);
				} else {
					_this.$api.toast("授权失败")
				}
			},
			userLogin(e) {
				let _this = this;
				uni.login({
					success: res => {
						let code = res.code;
						if (code) {
							let data = {
								code: code,
								signature: e.signature,
								iv: e.iv,
								encryptedData: e.encryptedData,
								rawData: e.rawData,
								shop_id: _this.$store.state.shopId || 0,
								type:_this.type
							}
							_this.$api.ajax('smdc/index/login', data, function(ret) {
								// console.log(ret)
								//判断是否返回了token，如果没有，就说明没有绑定账号，跳转到绑定页面
								if (ret.code == 2) {
									uni.redirectTo({
										url: '/pages/login/bingphone?wxinfo=' + JSON.stringify(ret.data)
									})
								} else {
									//登录成功，设置token，并返回上一页
									ret.data.id ? _this.$api.toast("登录成功", "success") : _this.$api.toast("未成功登录，请重试")
									let info = {
										uid: ret.data.id,
										userInfo: ret.data
									}
									_this.login(info);
									_this.$api.setStorage("kejia_order_uid", ret.data.id);
									_this.$api.setStorage("kejia_order_openId", ret.data.openid);
									_this.$api.setStorage("kejia_order_token", ret.data.token);
									_this.$api.setStorage("kejia_order_userInfo", ret.data);
									// uni.navigateBack();
									uni.reLaunch({
										url:"../index/index"
									})
								}

							}, 'POST', true);
						}
					},
					fail: () => {
						_this.$api.toast("没有获取到登陆信息，请重试")
					}
				});
			},


			//获取APP信任登录
			getAppAuths() {
				let _this = this;
				_this.thirdPartyLogins = [];
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						if (res.errMsg == 'getProvider:ok') {
							_this.thirdPartyLogins = res.provider;

						}
					}
				});
			},
			//app第三方登录
			handleThirdLoginApp(ret) {
				let resu=ret;
				if(!this.flag){return this.$api.toast("请先阅读并勾选用户协议和隐私政策")};
				uni.showLoading({
					title: "正在登录"
				})
				var that = this
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						//支持微信、qq和微博等
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									// console.log("App微信获取用户信息成功", loginRes);
								if(typeof resu=='object'){
									let result=Object.assign(resu,loginRes)
									console.log(result)
									that.getApploginData(result)
								}else{
									that.getApploginData(loginRes)
								}
									
								
									
								},
								fail: function(res) {
									console.log("App微信获取用户信息失败", res);
								}
							})
						}
					}
				});
			},
            
			// 通过接口换取微信登录信息
			getApploginData(data) {
				// let da=data;
				let mobile="";
				if(typeof data=='object'){
					if("data" in data){
						console.log(111)
						 mobile=data.data.mobile;
					}else{
						console.log(2222)
						mobile="";
					}
					
				}else{
					console.log(333)
					 mobile="";
				}
				console.log(mobile)
				var that = this
				uni.request({
					url: "https://api.weixin.qq.com/sns/userinfo?access_token=" + data.authResult.access_token + "&openid=" + data.authResult.openid,
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
							console.log(ret)
							uni.hideLoading()
							//判断是否返回了token，如果没有，就说明没有绑定账号，跳转到绑定页面
							if (ret.code == 2 && mobile=='') {
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
	.agreement{
		text-align: center;
		font-size: 24upx;
		margin-top: 50upx;
	}
	.fz12 {
		font-size: 24upx;
	}

	.flc {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.forgetpw {
		float: right;
		font-size: 24upx;
		color: #666666;
		margin-bottom: 30upx;
	}

	.wxlogin {
		border: 1upx solid #fff !important;
		width: 131upx;
		height: 131upx;
		padding: 0;
		margin: 0;
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
		// background-color: #f8f8f8;
		/* margin: 0 auto; */
	}

	.login-m {
		margin-bottom: 100upx;
	}

	.login-item {
		border-bottom: 2upx solid #d0d0d0;
		overflow: hidden;
		padding: 10upx;
		font-size: 28upx;
		color: #333;
		margin-bottom: 30upx;
		display: flex;
		align-items: center;
	}

	.login-item-input {
		display: inline-block;
		// width: 60%;
		flex: 1;
		box-sizing: border-box;
	}

	.codeimg {
		width: 210rpx;
	}

	.login-item .btn {
		display: inline-block;
		font-size: 28upx;
		border: none;
		width: 40%;
		padding: 0;
		line-height: 1.7;
		float: right;
	}

	.login-b .btn {
		color: #999;
	}

	.btn-b {
		color: #fff !important;
		background-color: #FEB026;
	}

	.registered-item {
		overflow: hidden;
		width: 100%;
	}

	.registered {
		float: right;
	}

	.registered-item .btn-square {
		color: #333;
	}

	.third-block {
		justify-content: center;
		padding-top: 40upx;

		.third-item {
			width: 160upx;
			height: 160upx;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
 
			&-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}
		}
	}

	.login-other {
		margin-bottom: 40upx;
		.item {
			padding: 30upx 0;
		}
	}
</style>
