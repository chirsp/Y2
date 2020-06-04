<template>
	<view class="content">
		<view class="reg-t">
			<image class="reg-logo" :src="logoImage" mode="aspectFill"></image>
		</view>
		<view class="reg-m">
			<view class="reg-item">
				<input class="login-item-input"  placeholder-class="login-item-i-p" type="text" v-model="username"
				 placeholder="请输入用户名" />
			</view>
			<view class="reg-item">
				<input type="number" v-model="mobile" :maxlength="maxMobile" placeholder="请输入手机号码" focus placeholder-class="reg-item-i-p" />
			</view>
			<view class="reg-item flc">
				<input class="reg-item-input" placeholder-class="reg-item-i-p" type="text" v-model="code" placeholder="请输入验证码" />
				<view @click="sendCode" v-if="verification">发送验证码</view>
				<view class="" v-if="!verification">{{ timer }} 秒后重新获取</view>
			</view>
			<view class="reg-item">
				<input class="login-item-input" :password="true" placeholder-class="login-item-i-p" type="text" v-model="pwd"
				 placeholder="请输入密码" />
			</view>
		</view>
		<view class="reg-b">
			<button :class="regButtonClass" @click="toReg()" hover-class="btn-hover">注册</button>
		</view>
		<view class="registered-item">
			<view class="btn btn-g btn-square registered" @click="toLogin">已有账号，立即登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				maxMobile: 11,
				mobile: '', // 用户手机号
				code: '', // 短信验证码
				pwd: '', // 用户密码
				username: '',//用户名
				verification: true, // 通过v-show控制显示获取还是倒计时
				timer: 60, // 定义初始时间为60s
				btnb: 'btn btn-c btn-square btn-all' ,//按钮背景
			}
		},
		onLoad(options) {
			let _this = this
			_this.timer = parseInt(_this.$api.getStorage('timer'))
			if (_this.timer != null && _this.timer > 0) {
				_this.countDown()
				_this.verification = false
			}

			if (options.invitecode) {
				this.$api.setStorage('invitecode', options.invitecode)
			}
			
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
			// 动态更改登录按钮bg
			regButtonClass() {
				return this.mobile && this.mobile.length === 11 && this.pwd && this.username ?
					this.btnb + ' btn-b' :
					this.btnb
			},
		
			logoImage() {
				return this.$store.state.shop_logo
			}
		},
		onLoad(e) {
			this.mobile_bind = e.mobile_bind
			this.uid = e.uid
			if(this.mobile_bind==0){
				uni.setNavigationBarTitle({
					title:"绑定手机号"
				})
			}
		},
		onShow() {
			let _this = this
			let userToken = _this.$api.getStorage('kejia_order_token')
			if (userToken && userToken != '') {
				uni.switchTab({
					url: '/pages/index/index'
				})
				return true
			}
			_this.timer = parseInt(_this.$api.getStorage('timer'))
			if (_this.timer != null && _this.timer > 0) {
				_this.countDown()
				_this.verification = false
			}
		},
		methods: {
			// 发送短信验证码
			sendCode() {
				var _this = this
				if (!_this.rightMobile.status) {
					_this.$api.errorToShow(_this.rightMobile.msg)
				} else {
					uni.showLoading({
						title:"发送中..."
					})
					setTimeout(() => {
						uni.hideLoading()
						_this.$api.ajax('smdc/user/sendCode',{
							mobile:_this.mobile,
							shop_id:_this.$store.state.shopId,
							template_id:1,	
						},function(res){
						 	 _this.timer = 60
						 	 _this.verification = false
						 	 _this.countDown() // 执行验证码计时
						 	 _this.btnb = 'btn btn-square btn-all btn-b'
						 },"POST");
						
					}, 1000)
				}
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
			toReg() {
				if (!this.rightMobile.status) {
					this.$api.errorToShow(this.rightMobile.msg)
				} 
				else if (!this.code) {
					this.$api.errorToShow('请输入短信验证码')
				}
				else if (!this.username) {
					this.$api.errorToShow('请输入用户名')
				}
				 else if (!this.pwd) {
					this.$api.errorToShow('请输入登录密码')
				} else {
					let data = {
						mobile: this.mobile,
						code: this.code,
						password: this.pwd,
						username:this.username,
						shop_id: this.$store.state.shopId
					}
					// 获取邀请码
					let invicode =  this.$api.getStorage('invitecode')
					if (invicode) {
						data.invitecode = invicode
					}
				var _this = this
				_this.$api.ajax('smdc/user/register',data,function(res){
					console.log(res);
					_this.$api.toast("注册成功")
					_this.$api.openWin('/pages/login/login1')
				 },"POST");
				}
			},
			toLogin() {
				this.$api.openWin('/pages/login/login1')
			}
		}
	}
</script>

<style lang="scss">
	.fz12 {
		font-size: 24upx;
	}

	.flc {
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

	.reg-t {
		text-align: center;
		padding: 50upx 0;
	}

	.reg-logo {
		width: 180upx;
		height: 180upx;
		border-radius: 20upx;
		background-color: #f8f8f8;
		/* margin: 0 auto; */
	}

	.reg-m {
		margin-bottom: 100upx;
	}

	.reg-item {
		border-bottom: 2upx solid #d0d0d0;
		overflow: hidden;
		padding: 10upx;
		color: #333;
		margin-bottom: 30upx;

		.btn-b {
			border: none;
			width: 40%;
			text-align: right;

			&.btn-b {
				color: #fff !important;
				background-color: #F87B16;
			}
		}
	}

	.reg-item-input {
		flex: 1;
	}

	.reg-b .btn {
		color: #999;
		&.btn-b {
			color: #fff !important;
			background-color: #F87B16;
		}
	}

	.registered-item {
		overflow: hidden;
		width: 100%;
	}

	.registered {
		float: right;
	}

	.btn-square {
		color: #333;
		height: 80upx;
		line-height: 80upx;
		padding: 0;
		font-size: 24upx;
	}
</style>
