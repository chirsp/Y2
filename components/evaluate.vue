<template>
	<view>
		<!-- 评价内容 -->
		<view class="evapaper" v-for="(item,index) in listeva" :key="index">
			<image class="evaimg" :src="item.avatarurl || '../static/head.png'"></image>
			<view class="details">
				<view class="name  flex_row flex_ai" >
				    <text>{{item.nickname || '匿名用户'}}</text>
					<view v-for="(items,indexs) in 5" :key="indexs" class="ViewStar">
						<image class="StarImg" :src="item.score>=indexs?'/static/star.png':'/static/blackstar.png'"></image>
					</view>
				</view>
				<view class="Star">
					<!-- <text class="score">评分</text> -->
					<text class="data">{{item.ctime}}</text>
				</view>
				<!-- 图片以及建议 -->
				<view class="matter">
					<view class="mattertxt">{{item.content}}</view>
					<image v-if="item.images.length" class="matterImg" v-for="(ite,ind) in item.images" :key="ind" :src="ite" @click="lookImg(item.images,ind)" mode="aspectFill"></image>
				</view>
				<!-- 商家回复 -->
				<view class="answer" :style="item.seller_content?'display:block':'display:none'">商家回复:<text class="answertxt">{{item.seller_content}}</text></view>
			</view>

		</view>
        <view class="space"></view>
		<nodata msg='评价空空如也~' v-if="listeva.length==0"></nodata>
	</view>
</template>

<script>
	import nodata from './nodata.vue'
	export default {
		props: {
			listeva: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				evanum: "",
				index: 'eva',
				headimg: "../../static/tupian.png",
				log: 3,
				tips: 1,
			}
		},
		components: {
			nodata
		},
		onLoad() {

		},
		methods: {
           lookImg(goodImgs,index){
           	let _this = this
           	uni.previewImage({
           	     urls: goodImgs,
           		 current :index,
           		 loop:true,
				 indicator:"number"
           	});
           },
		}
	}
</script>

<style>
	.head {
		height: 90upx;
		background: rgba(254, 176, 38, 1);
		opacity: 1;
		padding-left: 32upx;
		padding-top: 5upx;
		display: flex;

	}

	.Sou {
		width: 35upx;
		height: 35upx;
		margin-left: 21upx;
		position: absolute;
		margin-top: 16upx;

	}
	.space{
		height: 100upx;
	}

	input {
		width: 610upx;
		height: 66upx;
		background: rgba(248, 248, 248, 1);
		opacity: 1;
		border-radius: 30upx;
		padding-left: 73upx;
	}

	.biao {
		width: 750upx;
		height: 85upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 8upx 15upx rgba(114, 124, 142, 0.06);
		opacity: 1;
		display: flex;
		padding-top: 30upx;
		padding-left: 165upx;
	}

	.order {
		width: 64upx;
		height: 45upx;
		font-size: 32upx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 45upx;
		color: rgba(102, 102, 102, 1);
		opacity: 1;
	}

	.evaluate {
		color: #FEB026;
		margin-left: 302upx;

	}

	.txt {
		width: 112upx;
		height: 45upx;
		font-size: 22upx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 30upx;
		color: rgba(153, 153, 153, 1);
		opacity: 1;
		margin-left: 10upx;
	}

	.evapaper {
		display: flex;
		padding-top: 32upx;
		padding-left: 34upx;
	}

	.details {
		margin-left: 20upx;
	}

	.name {
		height: 45upx;
		font-size: 32upx;
		font-family: PingFangSC-Medium;
		line-height: 33upx;
		color: rgba(102, 102, 102, 1);
		opacity: 1;
	}

	.data {
		font-size: 24upx;
		font-family: PingFangSC-Medium;
		color: rgba(153, 153, 153, 1);
		opacity: 1;
		margin-top: 10upx;
	}

	.evaimg {
		width: 80upx;
		height: 80upx;
        border-radius: 10upx;
	}

	.Star {
		display: flex;
	}

	.score {
		height: 33upx;
		font-size: 24upx;
		font-family: PingFangSC-Medium;
		line-height: 33upx;
		color: rgba(102, 102, 102, 1);
		opacity: 1;
	}

	.ViewStar {
		margin-left: 3upx;
	}

	.StarImg {
		width: 25upx;
		height: 25upx;
		margin-left: 3upx;
	}

	.matter {}

	.mattertxt {
		margin-top: 15upx;
		height: 33upx;
		font-size: 27upx;
		font-family: PingFangSC-Medium;
		line-height: 33upx;
		color: rgba(102, 102, 102, 1);
		opacity: 1;
	}

	.matterImg {
		width: 128upx;
		height: 128upx;
		margin-top: 15upx;
		background-color: #EEEEEE;
		margin-right: 10upx;
		border-radius: 10upx;
	}

	.answer {
		width: 592upx;
		height: 60upx;
		background: rgba(238, 238, 238, 1);
		opacity: 1;
		border-radius: 8upx;
		color: rgba(102, 102, 102, 1);
		padding-left: 15upx;
		padding-top: 20upx;
		font-size: 26upx;

	}

	.answertxt {
		width: 384upx;
		height: 33upx;
		font-size: 24upx;
		font-family: PingFangSC-Medium;
		line-height: 33upx;
		color: rgba(102, 102, 102, 1);
		opacity: 1;
		margin-left: 10upx;
	}
</style>
