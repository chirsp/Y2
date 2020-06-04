<script>
	import {
	    mapMutations
	} from 'vuex'
	export default {
		onLaunch: function(e) {
			// 程序启动场景
			this.onStartupScene(e.query.q)
			
			// #ifdef MP-WEIXIN
				if (uni.canIUse('getUpdateManager')) {
				  const updateManager = uni.getUpdateManager()
				  updateManager.onCheckForUpdate(function (res) {
					if (res.hasUpdate) {
					  updateManager.onUpdateReady(function () {
						uni.showModal({
						  title: '更新提示',
						  content: '新版本已经准备好，是否重启应用？',
						  success: function (res) {
							if (res.confirm) {
							  updateManager.applyUpdate()
							}
						  }
						})
					  })
					  updateManager.onUpdateFailed(function () {
						uni.showModal({
						  title: '已经有新版本了哟~',
						  content: '新版本已经上线啦~，请您删除当前小程序，重新扫描店铺码或搜索打开哟~'
						})
					  })
					}
				  })
				} else {
				  uni.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				  })
				}
			// #endif
			let uid=this.$api.getStorage("kejia_order_uid");
			let userInfo=this.$api.getStorage("kejia_order_userInfo");
			let shopId=this.$api.getStorage("kejia_order_shopId");
			// debugger ;
			if(shopId) {
				this.intoShop(shopId);
			}
			if(uid && userInfo) {
				let info={
					uid:uid,
					userInfo:userInfo
				}
				this.login(info);
			}
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		},
		methods:{
			...mapMutations(['intoShop','intoDesk','login','changeNeedScan']),
			
			// 程序启动扫码进入，获取店铺id和桌号id
			onStartupScene(query){
				if(!query ){return}
				let pathStr = '';
				let path =  decodeURIComponent(query)
				let _this = this
				if (path.indexOf('%') != -1) {
					let ss = _this.$api.getParam(path, 'scene'); //提取参数
					let scenes = decodeURIComponent(ss);
					pathStr = 'pages/xxx?' + scenes;
				} else {
					pathStr = path.replace('scene=', '');
				}
				let uniacid = _this.$api.getParam(pathStr, 'uniacid');
				let shop_id = _this.$api.getParam(pathStr, 'shop_id');
				let desk = _this.$api.getParam(pathStr, 'desk');
				_this.intoShop(shop_id);
				_this.intoDesk(desk);
				_this.$api.setStorage('kejia_order_shopId',shop_id);
				_this.$api.setStorage('deskId',desk);
				_this.changeNeedScan(false); //不用再扫码
				// console.log("程序启动参数：",shop_id,desk)
			},
			  

		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "colorui/common.css";
	/* @import "colorui/iconfont.css"; */
	.x-flex{
		display: flex;
		align-items: center;
	}
	.x-flex-sp{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.x-flex-center{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.page-block{
		background: #fff;
	}
	.toast-info{
		text-align: center;
		padding-top: 30upx;
		padding-bottom: 30upx;
	}
</style>
