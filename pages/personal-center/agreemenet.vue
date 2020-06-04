<template>
	<view class="box">
		<rich-text :nodes="info"></rich-text>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				info:""
			}
		},
		onLoad(e) {
			e.id && this.getInfo(e.id)
		    
		},
		methods:{
			
			// 获取合作协议详情
			getInfo(id) {
				var that = this
				this.$api.ajax('smdc/version/introInfo', {
					shop_id: that.$store.state.shopId,
					id:id
				}, res => {
					that.info = res.data.intro
					uni.setNavigationBarTitle({
						title:res.data.name
					})
				})
			},
		}
	}
</script>

<style lang="less">
	page{
		background-color: #FFFFFF;
	}
	.box{
		margin: 20upx;
	}
</style>
