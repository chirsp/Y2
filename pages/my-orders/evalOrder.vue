<template>
	<view class="backgroud">
		<!-- 点星 -->
		<view class="Order">
			<view class="title">您对商家/菜品满意吗?</view>
			<view class="Star">
				<text class="score">评分:</text>
				<view v-for="(item,index) in 5" :key="index" class="ViewStar">
					<image class="StarImg" :src="log>=index?'../../static/star.png':'../../static/blackstar.png' " @click="Star(index)"></image>
				</view>
			</view>
		</view>

		<!-- 评价 -->
		<view class="evaluate">
			<textarea class="txtarea" placeholder="请填写你的建议,感谢你的光临~" v-model="content"></textarea>
			<view class="ImgList">
				<view v-for="(item,index) in urlpath" :key="index">
					<image class="txtImg" :src="item" mode="aspectFill"></image>
					<image class="dele" src="../../static/shanchu.png" @click="Delete(index)"></image>
				</view>
				<image class="txtImg" src="../../static/xiangpian.png" @click="Incude()"></image>
			</view>

			<!-- :style="orderimg==='chooseImage:ok'?'display:block':'display:none'" -->
		</view>


		<!-- 提交 -->
		<view class="submit" @click="Submit">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderimg: "",
				urlpath: [],
				content: "",
				log: 0,
				image: [],
				id:''

			}
		},
		onLoad(e) {
			this.id = e.id
		},
		methods: {
			Incude() {
				var choose = this
				var _this = this
				uni.chooseImage({
					success(ret) {
						choose.orderimg = ret.errMsg,
						choose.urlpath.push(ret.tempFilePaths);
						let token =  uni.getStorageSync('kejia_order_token')
						uni.uploadFile({
							     url: _this.$api._api_root +'smdc/upload/images?token=' + token +'&shop_id=' +_this.$store.state.shopId +'&uniacid=' + 1,
								 filePath: ret.tempFilePaths[0],
								 name: 'image',
								 success: (uploadFileRes) => {
										console.log(uploadFileRes)
										let data = JSON.parse(uploadFileRes.data);
										let id = data.data.id;
										_this.image.push(id);
								}
						})
					}
				})
			},
			Delete(index) {
				this.urlpath.splice(index, 1);
				this.image.splice(index, 1);
			},
			Star(index) {
				this.log = index;
			},
			Submit() {
				let image = "";
				for (let i = 0; i < this.image.length; i++) {
					if (i == this.image.length - 1) {
						image += this.image[i];
					} else {
						image += this.image[i] + ',';
					}
				}
				let _this = this;
				_this.$api.ajax('smdc/Comment/add', {
					shop_id: _this.$store.state.shopId,
					content: _this.content,
					images: image,
					order_id: _this.id,
					score: this.log,
				}, function(ret) {
					_this.$api.toast('评价成功~')
					uni.reLaunch({
						url:'../menu/menu'
					})
				}, 'POST')
			}


		}
	}
</script>

<style>
	.backgroud {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #F1F1F1;
		overflow: hidden;
		display: block;
	}

	.Order {
		background: rgba(255, 255, 255, 1);
		opacity: 1;
		border-radius: 20upx;
		margin: 30upx;
		margin-left: 32upx;
		padding-left: 32upx;
		padding: 40upx;
	}

	.title {
		width: 357upx;
		height: 48upx;
		font-size: 34upx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 34upx;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
	}

	.score {
		width: 84upx;
		height: 40upx;
		font-size: 28upx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 34upx;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
		margin-top: 28upx;
	}

	.Star {
		display: flex;
	}

	.ViewStar {
		margin-top: 28upx;
	}

	.StarImg {
		width: 30upx;
		height: 30upx;
		margin-left: 3upx;
	}

	.evaluate {
		background: rgba(255, 255, 255, 1);
		border-radius: 20upx;
		margin: 32upx;
		padding: 26upx;
	}

	.txtarea {
		width: 100%;
		height: 362upx;
		background: rgba(248, 248, 248, 1);
		border-radius: 20upx;
		padding-top: 25upx;
		padding-left: 23upx;
		font-size: 28upx;
		font-family: PingFang SC;
		font-weight: 300;
		line-height: 34upx;
		color: rgba(51, 51, 51, 1);

	}

	.txtImg {
		width: 129upx;
		height: 129upx;
		margin-right: 20upx;

	}

	.submit {
		width: 100%;
		background: rgba(254, 176, 38, 1);
		position: absolute;
		bottom: 0;
		text-align: center;
		font-size: 36upx;
		font-weight: 500;
		padding: 30upx 0;
		color: rgba(255, 255, 255, 1);
	}

	.ImgList {
		display: flex;
		margin-top: -143upx;
		position: absolute;
		margin-left: 32upx;
		z-index: 100;
	}

	.dele {
		width: 25upx;
		height: 25upx;
		position: absolute;
		margin-left: -35upx;
		margin-top: -5upx;


	}

	/* .checkImg{
		width: 129upx;
		height: 129upx; */
	/* position: relative;
		float: left;
		margin-top: -126upx;
		margin-left: 30upx; */
	/* } */
</style>
