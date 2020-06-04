<template>
	<view>
		<hmsearch @doSearch='doSearch' :hotKeywordList='hotKeywordList' :defaultKeyword='defaultKeyword' v-if="!list.length"></hmsearch>
		
		<!-- 顶部搜索 start -->
		<block v-if="list.length">
			<view class="cu-bar search bg-white x-bg">
				<view class="search-form round">
					<text class="cuIcon-search" @click="doSearch()"></text>
					<input :adjust-position="false" type="text" v-model="keyWord" placeholder="请输入关键字搜索" confirm-type="search" @confirm="doSearch()"></input>
				</view>
				<view class="action">
					<button class="cu-btn bg-green shadow-blur round" @click="doSearch()">搜索</button>
				</view>
			</view>
			
			<view class="goods-list x-flex-sp" >
				<block v-for="(item,index) in list" :key="index">
					<view class="goods-item" @click="goodsDetail(item.id)">
						<image mode="aspectFill" :src="item.cover ? item.cover : '/static/noImg.png'" class="goods-img"></image>
						<view class="goods-msg">
							<view class="goods-name">{{item.name}}</view>
							<view class="goods-price">
								<view>￥{{item.sale_price!='0.00' ? item.sale_price : item.price}}</view>
								<view class="goods-price2">￥{{item.price}}</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</block>
		
	</view>
</template>

<script>
	import hmsearch from '../../components/HM-search.vue'
	import nodata from '../../components/nodata.vue'
	export default {
		data() {
			return {
				keyWord:'',
				page:1,
				more:false,
				list:[],
				hotKeywordList:[],
				defaultKeyword:''
			};
		},
		components:{hmsearch},
		onLoad() {
			this.init()
		},
	   onReachBottom() {
	   	if(this.more){
			return
		}
		this.page=this.page+1
		this.doSearch()
	   },
		methods:{
			// 初始化数据
			init(){
				let _this = this;
				_this.$api.ajax('smdc/index/index',{
					shop_id:_this.$store.state.shopId,
				},function(ret){
					_this.defaultKeyword = ret.data.shop.default_search
					var hot_search =  ret.data.shop.hot_search
					_this.hotKeywordList = hot_search.split(',')
				});
			},
			
			// 搜索
			doSearch(e) {
				let _this = this;
				_this.more=true;
				if(e){
					_this.keyWord = e
				}
				_this.saveKeyword(_this.keyWord)
				_this.$api.ajax('smdc/cart/food',{
					shop_id:_this.$store.state.shopId,
					search:'name',
					keyword:_this.keyWord,
					type:'',
					limit:10,
					page:_this.page
				},function(ret){
					let data=ret.data.foodlist;
					_this.more=false
					if(_this.page==1){
						_this.list = data
						if(!data.length){
							_this.$api.toast('无搜索结果')
							return
						}
					}else{
						_this.list=_this.list.concat(data);
					}
				});
			},
			goodsDetail(id) {
				this.$api.openWin('../details/details?goodsId='+id);
			},
			
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.bg-green{
		background: $skin;
	}
	.goods-list{
		flex-wrap: wrap;
		padding: 20upx 24upx;
		.goods-item{
			width: 340upx;
			margin-bottom: 30upx;
			.goods-img{
				border-radius: 30upx 30upx 0 0;
				width: 100%;
				height: 337upx;
				display: block;
			}
			.goods-msg{
				background: #fff;
				border-radius: 0 0 30upx 30upx;
				padding: 20upx;
				.goods-name{
					font-size:24upx;
					font-weight:bold;
					color:rgba(34,34,34,1);
					line-height:40upx;
					max-height: 80upx;
					min-height: 80upx;
					overflow: hidden;
				}
				.goods-price{
					font-size:29upx;
					font-weight:bold;
					color:rgba(34,34,34,1);
					// line-height:38px;
					display: flex;
					align-items: center;
				}
				.goods-price2{
					font-size:23upx;
					text-decoration:line-through;
					color:rgba(136,136,136,1);
					margin-left: 10upx;
					// line-height:38px;
				}
			}
		}
	}
</style>
