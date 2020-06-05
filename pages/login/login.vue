<template>
	<view class="auth">	
		
			<view class="x-popup">
				<view class="top">
					<image class="head" src='../../static/weixin.png'></image>
				</view>
				<view class='btm'>
					<view class='tag'>
						<view>申请微信登陆获取以下权限</view>
						<view class='text'>获得你的公开信息（昵称、头像等）</view>
					</view>
					
					<!-- 微信登录 -->
				  <!-- #ifdef MP-WEIXIN -->
					<button @getuserinfo='getUserInfo' open-type="getUserInfo" plain="true" class='login login_btn'>授权登录</button>
				    <button @click="$api.openWin('/pages/menu/menu')" plain="true" class='unlogin login_btn'>暂不登录</button>
				  <!-- #endif -->
				  
				  <!-- app+h5登录 -->
				  <!-- #ifndef MP-WEIXIN -->
				  <button @click="appLogin()"  type="primary" class='login'>授权登录</button>
				  <!-- #endif -->
				</view>
			</view>
		
		
		
		
		<!-- #ifndef MP-WEIXIN -->
			<!-- <view class="x-popup">
				<view class="">
					<input type="text" placeholder="用户名" value="" />
				</view>
				<view class="">
					<input type="password" placeholder="密码" value="" />
				</view>
				<view class="">
					<view class="" @click="userLoginH5">登陆</view>
				</view>
			</view> -->
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				title:'login',
				type:""
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			 this.type = "app"
			// #endif
			
			// #ifdef H5
			  this.type = "h5"
			// #endif
			
			// #ifdef MP-WEIXIN
			  this.type = "weixin"
			// #endif
			uni.hideShareMenu();
		},
		onShow() {
			//this.logout();
		},
		methods:{
			...mapMutations(['login','changeNeedScan']),
			getUserInfo(e) {
				console.log(e);
				let _this = this;
				let ret=e.detail;
				if(ret.errMsg == "getUserInfo:fail auth deny") {
					_this.$api.toast("为了更好的服务，请同意授权");
				}else if(ret.errMsg == "getUserInfo:ok") {
					_this.userLogin(e.detail);	
				}else {
					_this.$api.toast("授权失败")
				}
			},
			userLogin(e) {
				let _this = this ;
				uni.login({
					success: res => {
						let code = res.code;
						if(code){
							let data={
								code: code,
								signature:e.signature,
								iv:e.iv,
								encryptedData:e.encryptedData,
								rawData:e.rawData,
								shop_id:_this.$store.state.shopId || 0,
								type:_this.type,
								nickName:e.userInfo.nickName,
								avatarUrl:e.userInfo.avatarUrl,
							}
							_this.temdata = data;
							_this.$api.ajax('smdc/index/login',data,function(ret){
								//ret值没有data
								console.log(111)
								console.log(ret)
								ret.data.id ? _this.$api.toast("登陆成功","success") : _this.$api.toast("未成功登陆，请重试")
								let info={
									uid:ret.data.id,
									userInfo:ret.data
								}
								_this.login(info);
								// console.log(ret.token);
								_this.$api.setStorage("kejia_order_uid",ret.data.id);
								_this.$api.setStorage("kejia_order_openId",ret.data.openid);
								_this.$api.setStorage("kejia_order_userInfo",ret.data);
								_this.$api.setStorage("kejia_order_token",ret.token);
								// uni.navigateBack();
								
								if(ret.data.id==-2){
								   uni.redirectTo({
								      url: './bingphone?wxinfo=' + JSON.stringify(ret.data)
								   })
								}
							    // 强制登录后绑定手机号
								if(ret.code==0){
									uni.redirectTo({
										url: '/pages/login/bingphone?wxinfo=' + JSON.stringify(ret.data)
									})
								}
								if(ret.msg =="用户信息2-修改"){
									uni.redirectTo({
										url:'/pages/index/index'
									})
									return
								}

							},'POST',true);
						}
					},
					fail: () => {
						_this.$api.toast("没有获取到登陆信息，请重试")
					}
				});
			},
		
			appLogin(){
				console.log(1111)
				var that=this
				uni.getProvider({
				    service: 'oauth',
				    success: function(res) {
				        // console.log(res.provider);
				        //支持微信、qq和微博等
				        if (~res.provider.indexOf('weixin')) {
				            uni.login({
				            	  provider: 'weixin',
				            	  success: function (loginRes) {
				            	      that.getAppLogin(loginRes)
				            	  },
				            	  fail:function(res){
				            		  
				            	  }
				            })
				        }
				    }
				}); 
			},
			
			getAppLogin(data){
				var that =this
				uni.request({
					url: "https://api.weixin.qq.com/sns/userinfo?access_token="+data.authResult.access_token+"&openid="+data.authResult.openid,
					method: 'GET',
					dataType: 'json',
					header: {
					  'content-type': 'application/x-www-form-urlencoded' // 默认值
					},
					success(res) {
						that.$api.ajax('smdc/index/applogin',res.data,function(ret){
							console.log(ret)
						},'POST',true);
						
					},fail() {
						
					}
				})
			},
			
			hide() {
				this.$emit('hidePopup')
			},
			moveHandle() {},
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.auth{
		.x-popup{	
			.top{
				height: 320upx;
				display: flex;
				align-items: center;
				justify-content: center;
				.head{
					width: 150upx;
					height: 150upx;
				}
			}
			.btm{
				padding: 60upx;
				border-top: 1upx solid #eaeaea;
				.tag{
					font-size: 30upx;
					color: #000;
					line-height: 60upx;
					margin-bottom: 60upx;
					.text{
						font-size: 26upx;
						color: #888;
					}
				}
				.login_btn{
					border-radius: 60upx;
					font-size: 30upx;
					border: none;
					padding: 5upx 0;
					width:80%;
				}
				.login{
					color: #ffffff;
					background: $skin;
				}
				.unlogin{
					color: #999;
					background: #eee;
					margin-top: 20upx;
				}
			}
		}
	}
</style>
