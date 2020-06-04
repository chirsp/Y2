<template>
	<view class="">
		<view class="my-order-n" @click="link(index)" v-for="(item,index) in tarbar" :key="index" v-if="3>index">
			<view class="add-block">
				<view>
					{{item.name}}
				</view>
			</view>
			<view class="btn-group">
				<view class="center ico-ico">
					<text class="lg text-gray cuIcon-right"></text>
				</view>
			</view>
		</view>
		
		<view class="outlogin" @click="outlogin()">
			退出登录
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
				tarbar:[
					{name:'修改密码',url:"/pages/login/forgetpw?type=modify"},
					{name:'重设密码',url:"/pages/login/forgetpw?type=reset"},
				]
			}
		},
		onLoad() {
			this.getAgreement()
		},
		methods:{
			...mapMutations(['logout']),
			link(index){
				let _this =this
				let url = _this.tarbar[index].url
			    if(url){
					_this.$api.openWin(url)
				}else{
					let id = _this.tarbar[index].id
					this.$api.openWin('/pages/personal-center/agreemenet?id=' + id)
				}
			},
			
			// 退出登录
			outlogin(){
				uni.showModal({
				    title: '提示',
				    content: '确认退出登录吗',
					success: res=> {
				        if (res.confirm) {
							 this.uerInfo = {}  
            				// uni.removeStorage({  
							// 	// key: 'uerInfo',
							// 	key:'kejia_order_userInfo',
							// })
							try {  
								uni.clearStorageSync();  
							} catch (e) {
								console.log(e)
							}
				            uni.reLaunch({
				              url: '/pages/index/index'
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			
			// 获取用户协议
			getAgreement(){
				let _this = this
				_this.$api.ajax('smdc/version/intro',{
					  shop_id:_this.$store.state.shopId,
				},function(ret){
				   _this.tarbar = _this.tarbar.concat(ret.data)
				})
				
			},
		}
		}
</script>

<style lang="less">
	page{
		background: #f7f7f7;
	}
	.outlogin{
		margin: 30upx 0;
		text-align: center;
		padding: 30upx 0;
		color: red;
		background-color: #FFFFFF;
	}
	.my-order-n {
		display: flex;
		align-items: center;
		padding: 30upx 24upx;
		border-bottom: 1px solid #EEEEEE;
		background-color: #FFFFFF;
		justify-content: space-between;
	}
	
	.border-bottom {
		border: none;
	}
	.add-block {
		display: flex;
		align-items: center;
	}
	
	.btn-group {
		font-size: 24upx;
		color: #888888;
		font-weight: bold;
		display: flex;
		align-items: center;
	
	}
	
	.ico-ico image {
		width: 17upx;
		height: 28upx;
	}
	
	.ico-ico {
		margin-left: 14upx;
	}
</style>
