<template>
	<view class="content">
		<view class="reg-t">
			<image class="reg-logo" :src="logoImage" mode="aspectFill"></image>
		</view>
		<view class="reg-m">
			<block v-if="type=='reset'">
				<view class="reg-item">
					<input type="number" v-model="mobile" disabled="disabled" :maxlength="maxMobile" placeholder="请输入手机号码" focus placeholder-class="reg-item-i-p" />
				</view>
				<view class="reg-item flc">
					<input class="reg-item-input" placeholder-class="reg-item-i-p" type="text" v-model="code" placeholder="请输入验证码" />
					<view  @click="sendCode" v-if="verification">发送验证码</view>
					<view class="btn btn-" v-if="!verification">{{ timer }} 秒后重新获取</view>
				</view>
			</block>
			<view class="reg-item" v-if="type=='modify'">
				<input class="login-item-input" :password="true" placeholder-class="login-item-i-p" type="text" v-model="pwd"
				 placeholder="请输入旧密码" />
			</view>
			<view class="reg-item">
				<input class="login-item-input" :password="true" placeholder-class="login-item-i-p" type="text" v-model="pwd1"
				 placeholder="请输入新密码" />
			</view>
			<view class="reg-item">
				<input class="login-item-input" :password="true" placeholder-class="login-item-i-p" type="text" v-model="pwd2"
				 placeholder="请再次确认新密码" />
			</view>
		</view>
		<view class="reg-b">
			<button :class="regButtonClass" @click="toReg()" hover-class="btn-hover">确认修改</button>
		</view>
		<view class="registered-item">
			<!-- <view class="btn btn-g btn-square registered" @click="toLogin">立即登录</view> -->
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
				pwd: '', // 用户旧密码
				pwd1: '', // 用户新密码
				pwd2: '', // 用户确认新密码
				verification: true, // 通过v-show控制显示获取还是倒计时
				timer: 60, // 定义初始时间为60s
				btnb: 'btn btn-c btn-square btn-all', //按钮背景
				type: "",

			}
		},
		onLoad(options) {
			let _this = this
			this.type = options.type
			this.verification = true
			if (this.type == "reset") {
				uni.setNavigationBarTitle({
					title: "重置密码"
				})
				this.mobile = this.$api.getStorage('kejia_order_userInfo').mobile
			} else {
				uni.setNavigationBarTitle({
					title: "修改密码"
				})
			}
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
				if(this.type == 'reset'){
					return this.pwd2 && this.pwd1 && this.code ?
						this.btnb + ' btn-b' :
						this.btnb
				}
				if(this.type == 'modify'){
					return this.pwd && this.pwd1 && this.pwd2 ?
						this.btnb + ' btn-b' :
						this.btnb
				}
				
			},
			// 动态修改发送验证码按钮
			sendCodeBtn() {
				let btn = 'btn btn-g'
				if (this.mobile && this.mobile.length === this.maxMobile && this.rightMobile.status) {
					return btn + ' btn-b'
				} else {
					return btn
				}
			},
			logoImage() {
				return this.$store.state.shop_logo
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
						title: "发送中..."
					})
					setTimeout(() => {
						uni.hideLoading()
						_this.$api.ajax('smdc/user/sendCode',{
							mobile:_this.mobile,
							shop_id:_this.$store.state.shopId,
							template_id:2,		
						}, function(res) {
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
				if (this.type == "reset") {
					this.resetPsd()
				}
				if (this.type == "modify") {
					this.modifPsd()
				}
			},
			
            // 短信重置密码
			resetPsd() {
				if (!this.rightMobile.status) {
					this.$api.errorToShow(this.rightMobile.msg)
				} else if (!this.code) {
					this.$api.errorToShow('请输入短信验证码')
				} else if (this.pwd1 != this.pwd2) {
					this.$api.errorToShow('两次密码输入不一致')
				} else {
					let data = {
						password: this.pwd1,
						code: this.code,
						mobile: this.mobile,
						shop_id: this.$store.state.shopId
					}
					var _this = this
					_this.$api.ajax('smdc/user/resetPassword', data, function(res) {
						_this.$api.toast("密码重置成功")
						uni.navigateBack({
							delta: 1
						})
					}, "POST");
				}
			},
			// 旧密码修改密码
			modifPsd() {
				if (!this.pwd || !this.pwd1 || !this.pwd2) {
					this.$api.errorToShow('请输入完整信息')
				} else if (this.pwd1 != this.pwd2) {
					this.$api.errorToShow('输入的新密码与确认密码不一制，请重新输入')
				} else {
					let data = {
						password: this.pwd1,
						password1: this.pwd2,
						passwordOld: this.pwd,
						shop_id: this.$store.state.shopId
					}
					var _this = this
					_this.$api.ajax('smdc/user/revisePassword', data, function(res) {
						_this.$api.toast("密码修改成功")
						uni.navigateBack({
							delta: 1
						})
					}, "POST");
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

		.btn {
			border: none;
			width: 40%;
			text-align: right;

			&.btn-b {
				color: #FFFFFF;
				background-color: #F37B1D !important;
			}
		}
	}

	.reg-item-input {
		flex: 1;
	}

	.reg-b .btn {
        color: #FFFFFF;
        background-color: #F37B1D !important;
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
