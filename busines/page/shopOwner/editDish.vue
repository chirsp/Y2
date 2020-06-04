<template>
	<view>
		<view class="box">
			<view class="info flex_row flex_sb flex_ai">
				<view class="flex_col">
					<text class="_f32 _fw">点击上传菜品图</text>
					<text class="_c66 mar-t12">提示：建议上传340*340px的图片</text>
				</view>
			</view>
			<view class="flex_row flex-wrap">
				<view class="pos_re" v-for="(item,index) in goodImgs" :key='index'>
					<image class="uploadImg-img" :src="item" mode="aspectFill" @click="lookImg(index)"></image>
					<image src="../../../static/shanchu.png" class="delImg" @click.stop="delImg(index)"></image>
				</view>
				<view class="uploadImg-img" @click="chooseImg()"></view>
			</view>
		</view>

		<view class="box">
			<view class="info flex_row flex_sb flex_ai">
				<view class="flex_row flex_ai">
					<text class="_f28 _fw">菜品名称</text>
					<text class="mCol">*</text>
				</view>
				<input type="text" placeholder="请输入菜品名称" v-model="name" class="infoInput" />
			</view>
			<view class="info flex_row flex_sb flex_ai bor-t">
				<view class="flex_row flex_ai">
					<text class="_f28 _fw">分类</text>
					<text class="mCol">*</text>
				</view>
				<view class="infoInput bor-t">
					<picker :range="dishList" @change="selectDish" range-key="type_name">
						<view class="flex_row flex_ai flex_sb">
							<text></text>
							<view class="flex_row flex_ai">
								<text :class="dishIndex<0?'_c66':'_c22'">{{dishtype|| '请选择菜品分类'}}</text>
								<image src="../../static/image/select.png" class="selectIncon"></image>
							</view>
						</view>
					</picker>
				</view>
			</view>
			<view class="info flex_row flex_sb flex_ai">
				<view class="flex_row flex_ai">
					<text class="_f28 _fw">菜品单位</text>
					<text class="mCol">*</text>
				</view>
				<input type="text" placeholder="请输入菜品单位如:份/箱/瓶" v-model="unit" class="infoInput" />
			</view>
		</view>


		<view class="box">
			<view class="info flex_row flex_sb flex_ai bor-t">
				<view class="flex_row flex_ai">
					<text class="_f28 _fw">菜品原价(元)</text>
					<text class="mCol">*</text>
				</view>
				<input type="text" placeholder="￥0.00" v-model="price" class="infoInput" />
			</view>
			<view class="info flex_row flex_sb flex_ai bor-t">
				<view class="flex_row flex_ai">
					<text class="_f28 _fw">优惠价(元)</text>
					<text class="mCol">*</text>
				</view>
				<input type="text" placeholder="￥0.00" v-model="sale_price" class="infoInput" />
			</view>
			<view class="info flex_row flex_sb flex_ai">
				<view class="flex_row flex_ai">
					<text class="_f28 _fw">成本价(元)</text>
					<!-- <text class="mCol">*</text> -->
				</view>
				<input type="text" placeholder="￥0.00" v-model="chenben_price" class="infoInput" />
			</view>
		</view>

		<view class="box flex_col">
			<view class="info flex_row flex_sb flex_ai">
				<view class="flex_row flex_ai">
					<text class="_f30  _fw">菜品设置</text>
				</view>
			</view>
			<view class="info flex_row flex_sb flex_ai bor-bt">
				<view class="flex_row flex_ai">
					<text class="_f24 _fw">单次最大制作菜品数量</text>
				</view>
				<view class="flex_row infoInput flex_row flex_sb">
					<text></text>
					<view class=" _f24 flex_row flex_ai">
						<input type="digit" placeholder="请输入单次最大制作菜品数量" v-model="make_num" class="infoInput" />
					</view>
				</view>
			</view>
			<view class="info flex_row flex_sb flex_ai bor-bt">
				<view class="flex_row flex_ai">
					<text class="_f24 _fw">默认菜品备货量</text>
				</view>
				<view class="flex_row infoInput flex_row flex_sb">
					<text></text>
					<view class=" _f24 flex_row flex_ai">
						<input type="digit" placeholder="请输入默认菜品备货量" v-model="default_num" class="infoInput" />
					</view>
				</view>
			</view>
			<view class="info flex_row flex_sb flex_ai bor-bt">
				<view class="flex_row flex_ai">
					<text class="_f24 _fw">今日菜品备货量</text>
				</view>
				<view class="flex_row infoInput flex_row flex_sb">
					<text></text>
					<view class=" _f24 flex_row flex_ai">
						<input type="digit" placeholder="请输入今日菜品备货量" v-model="num" class="infoInput" />
					</view>
				</view>
			</view>
			<view class="info flex_row flex_sb flex_ai bor-bt">
				<view class="flex_row flex_ai">
					<text class="_f24 _fw">菜品预警备货量</text>
				</view>
				<view class="flex_row infoInput flex_row flex_sb">
					<text></text>
					<view class=" _f24 flex_row flex_ai">
						<input type="digit" placeholder="请输入菜品预警备货量" v-model="warning_num" class="infoInput" />
					</view>
				</view>
			</view>
		</view>

		<view class="box">
			<view class="info flex_row flex_sb flex_ai">
				<view class="flex_row flex_ai">
					<text class="_f28 _fw">菜品介绍</text>
				</view>
			</view>
			<view class="info flex_row flex_sb flex_ai bor-t">
				<view class="flex_row flex_ai">
					<text class="_f28 _fw">主料</text>
					<text class="mCol">*</text>
				</view>
				<input type="text" placeholder="请输入菜品主料" v-model="main" class="infoInput" />
			</view>
			<view class="info flex_row flex_sb flex_ai bor-t">
				<view class="flex_row flex_ai">
					<text class="_f28 _fw">辅料</text>
					<text class="mCol">*</text>
				</view>
				<input type="text" placeholder="请输入菜品辅料" v-model="ingredients" class="infoInput" />
			</view>
		</view>

		<!-- 	<view class="box flex_col">
			  <video id="myVideo" class="dishViedo" 
			  src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4"
			  @error="videoErrorCallback"></video>
			<view class="addpeople mBg _cff _f30">
				上传视频
			</view>
		</view> -->

		<view class="box">
			<view class="info flex_row flex_sb flex_ai">
				<view class="flex_row flex_ai">
					<text class="_f30 _fw">菜品设置</text>
				</view>
			</view>
			<view class="flex_row">
				<view class="mar-r20 flex_ai">
					<text class="_f28 _fw">是否新品</text>
					<!-- <text class="mCol">*</text> -->
				</view>
				<view class="info flex_row flex_ai ">
					<radio-group @change="getXP">
						<label>
							<radio value="0" :checked="is_new=='0'" style="transform: scale(0.5);" /><text>否</text>
							<radio value="1" :checked="is_new=='1'" style="transform: scale(0.5);" /><text>是</text>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="flex_row">
				<view class="mar-r20 flex_ai">
					<text class="_f28 _fw">菜品上架</text>
					<text class="mCol">*</text>
				</view>
				<view class="info flex_row flex_ai ">
					<radio-group @change="getSJ">
						<label>
							<radio value="0" :checked="status=='0'" style="transform: scale(0.5);" /><text>下架</text>
							<radio value="1" :checked="status=='1'" style="transform: scale(0.5);" /><text>上架</text>
						</label>
					</radio-group>
				</view>
			</view>
			
			<view class="flex_row flex_ai">
				<view class="mar-r20">
					<text class="_f28 _fw">制作流程</text>
					<text class="mCol">*</text>
				</view>
				<view class="info flex_row flex_ai ">
					<radio-group @change="getdishLC">
						<label>
							<radio value="1" :checked="is_process=='1'" style="transform: scale(0.5);" /><text>设定制菜流程</text>
							<radio value="0" :checked="is_process=='0'" style="transform: scale(0.5);" /><text>无需制菜流程</text>
						</label>
					</radio-group>
				</view>
			</view>

			<view class="flex_row flex_ai" v-if="is_process=='1'">
				<view class="mar-r20">
					<text class="_f28 _fw">设定制作流程</text>
					<text class="mCol">*</text>
				</view>
				<view class="info flex_row flex_ai ">
					<checkbox-group name="" class="flex_row flex-wrap " @change="getDishProcess">
						<label v-for="(item,index) in dishStatus" :key="index" class="flex_row flex_ai">
							<checkbox :value="item.id" :checked="item.check" style="transform: scale(0.5);" />
							<text>{{item.name}}</text>
						</label>
					</checkbox-group>
				</view>
			</view>

			<view class="flex_row flex_ai">
				<view class="mar-r20">
					<text class="_f28 _fw">菜品热销</text>
				</view>
				<view class="info flex_row flex_ai">
					<radio-group @change="getdishHot">
						<label>
							<radio value="0" :checked="is_rexiao=='0'" style="transform: scale(0.5);" /><text>否</text>
							<radio value="1" :checked="is_rexiao=='1'" style="transform: scale(0.5);" /><text>是</text>
						</label>
					</radio-group>
				</view>
			</view>

			<view class="flex_row flex_ai">
				<view class="mar-r20">
					<text class="_f28 _fw">菜品标签</text>
				</view>
				<view class="info flex_row flex_ai ">
					<checkbox-group name="" class="flex_row flex-wrap" @change="getdishFlag">
						<label v-for="(item,index) in flagList" :key="index" class="flex_row flex_ai">
							<checkbox :value="item.value" :checked="item.check" style="transform: scale(0.5);color: #0081FF;" />
							<text>{{item.name}}</text>
						</label>
					</checkbox-group>
				</view>
			</view>
		</view>

		<view class="addpeople mBg _cff _f30" @click="addDish()">
			{{!goodsId?'确认新增':'完成编辑'}}
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				dishList: [],
				dishIndex: -1,
				goodsId:"",
				goodImgs: [],
				foodIds: [],
				token: "",
				dishStatus: '', //制菜流程
				dishtype:"",
				flagList: [{
						value: '1',
						name: "本店招牌",
						check: false
					},
					{
						value: '2',
						name: "为您优选",
						check: false
					},
					{
						value: '3',
						name: "主厨推荐",
						check: false
					},
				],
				name: "",
				status: "1", //上下架
				chenben_price: "",
				price: "",
				sale_price: "",
				make_num:'',
				default_num: "20",
				unit: "",
				num: "20",
				warning_num: "5",
				ingredients: "",
				main: "",
				is_process: '',
				is_rexiao: "0",
				is_new:'1',
				flag: [],
				process: [],
			}
		},
		onPullDownRefresh() {
				this.goodsId && this.getDishInfo()
				// 如果新增就1秒后停止刷新
				if(this.goodsId==undefined){
					setTimeout(function () {
					            uni.stopPullDownRefresh();
					        }, 1000);
				}
			
		},
		
		onLoad(e) {
			this.storeId = e.storeId;
			this.goodsId = e.goodsId;
			this.token = uni.getStorageSync('kejia_order_token');
			this.getDishType();
			this.getdishStatus();
			this.goodsId && this.getDishInfo();
		},
		methods: {
			// 获取菜品详情
			getDishInfo(){
				let that = this
				that.$api.ajax('smdc/food/getonefood', {
					shop_id: that.$store.state.shopId,
					id:that.goodsId
				}, res => {
					setTimeout(function(){
						uni.stopPullDownRefresh()
					},1500)
					console.log(res)
					let food = res.data.food
					that.name = food.name
					that.make_num = food.make_num || '3'
					that.is_rexiao = food.is_rexiao || '0'
					that.main = food.main
					that.ingredients = food.ingredients
					that.price = food.price
					that.chenben_price = food.chenben_price
					that.sale_price = food.sale_price
					that.num = food.num
					that.unit = food.unit
					that.default_num=food.default_num
					that.status = food.status
					that.goodImgs = food.img_ids
					that.is_new = food.is_new || '0'
					that.is_process = JSON.stringify(food.is_process) || '0'
					that.foodIds = food.img_id.split(',')
					that.cover = that.foodIds[0]
					if(that.is_process =='1'){
						that.process = food.process.split(',')
						that.dishStatus.map(item =>{
							that.process.map(x =>{
								if(item.id ==x){
									item.check = true
								}
							})
						})
					}
					if(food.top=='1'){
						that.flagList[0].check = true
					}
					if(food.youxuan=='1'){
						that.flagList[1].check = true
					}
					if(food.is_zhuchu=='1'){
						that.flagList[2].check = true
					}
					for (let i = 0; i < that.dishList.length; i++) {
						if(that.dishList[i].id == food.cat_id){
							that.dishIndex = i
							that.dishtype = that.dishList[i].type_name
						}
					}	
				},'POST',true)
			},
			
			// 获取菜品分类
			getDishType(e) {
				let that = this
				that.$api.ajax('smdc/food/get_cat', {
					shop_id: that.$store.state.shopId,
				}, res => {
					that.dishList = res.data
				})
			},

			// 制菜流程
			getdishStatus() {
				let _this = this;
				_this.$api.ajax('smdc/food_process/processLists', {
					shop_id: _this.$store.state.shopId,
				}, function(ret) {
					_this.dishStatus = ret.data
					_this.dishStatus.map(item => {
						item.check=false
					})
				})
			},
            
			lookImg(index){
				let _this = this
				uni.previewImage({
				     urls: _this.goodImgs,
					 current :index,
					 loop:true,
					 indicator:"number"
				});
			},
			
			// 选择菜品分类
			selectDish(e) {
				this.dishIndex = e.detail.value
				this.dishtype = this.dishList[this.dishIndex].type_name
			},
			getXP(e){
				this.is_new = e.detail.value
			},
			// 获取菜品上下架信息
			getSJ(e) {
				this.status = e.detail.value
			},
			// 是否设置制作流程
			getdishLC(e) {
				this.is_process = e.detail.value
				this.is_process == '0' && (this.process = "")
			},
			// 是否热销
			getdishHot(e) {
				this.is_rexiao = e.detail.value
				console.log(this.is_rexiao);
			},
			// 设置菜品标签
			getdishFlag(e) {
				this.flag = e.detail.value
				console.log(this.flag)
			},
			// 设置菜品流程
			getDishProcess(e) {
				this.process = e.detail.value
			},

			// 上传图片
			chooseImg() {
				var _this = this
				uni.chooseImage({
					success(ret) {
						// let imgList=[];
						// for(let i=0;i<ret.tempFilePaths.length;i++){
						// 	let obj={};
						// 	obj.name="images"+i;
						// 	obj.uri=ret.tempFilePaths[i];
						// 	imgList.push(obj)
						// }
						// 目前暂时处理为多次单个上传
						for(let i=0;i<ret.tempFilePaths.length;i++){
							_this.uploadImg(ret.tempFilePaths[i])
						}
						
					}
				})
			},

			// 删除图片
			delImg(index) {
				this.goodImgs.splice(index, 1)
				this.foodIds.splice(index, 1)
			},

			// 上传菜品图片
			uploadImg(url) {
				let _this = this
				uni.uploadFile({
					url: _this.$api._api_root + 'smdc/upload/images?token=' + _this.token + '&shop_id=' + _this.$store.state.shopId +
						'&uniacid=' + 1,
					filePath:url,
					name:'image',
					// fileType:'image', 
					// header: {"Content-Type": "multipart/form-data"},
					success: (uploadFileRes) => {
						let data = JSON.parse(uploadFileRes.data);
						_this.goodImgs.push(data.data.url)
						_this.foodIds.push(data.data.id);
					}
				})
			},

			// 新增菜品
			addDish() {
				let _this = this;
				if (!_this.goodImgs.length) {
					_this.$api.toast('至少上传一张菜品图片')
					return
				}
				if (!_this.name) {
					_this.$api.toast('请输入菜品名称')
					return
				}
				if (_this.dishIndex < 0) {
					_this.$api.toast('请选择菜品分类')
					return
				}
				if (!_this.unit) {
					_this.$api.toast('请设置菜品单位')
					return
				}
				if (!_this.price) {
					_this.$api.toast('请设置菜品原价')
					return
				}
				if (!_this.sale_price ) {
					_this.$api.toast('请设置菜品优惠价')
					return
				}
				if (!_this.main) {
					_this.$api.toast('请填写菜品主料')
					return
				}
				if (!_this.ingredients) {
					_this.$api.toast('请填写菜品辅料')
					return
				}
				if (_this.is_process == '1' && _this.process.length == 0) {
					_this.$api.toast('亲，您没有设定制作流程，默认为无需制作流程！')
					//设置为无需制作流程
					_this.is_process==0;
					return
				}
				if(!_this.status){
					_this.$api.toast('请选择商品是否上下架')
					return
				}
				if(_this.process.length){
					_this.process.sort(function(a, b){return a - b});
				}
				
				var top = '0'
				var youxuan = '0'
				var is_zhuchu = '0'
				if (_this.flag.length) {
					_this.flag.map(item => {
						switch (item) {
							case '1':
								top = '1'
								break;
							case '2':
								youxuan = '1'
								break;
							case '3':
								is_zhuchu = '1'
								break;
							default:
								break;
						}
					})
				}
				let data ={
					shop_id: _this.$store.state.shopId,
					// cat_id:_this.dishStatus[_this.dishIndex].id,
					cat_id:_this.storeId,
					id:_this.goodsId || 0,
					name:_this.name,
					price:_this.price,
					chenben_price:_this.chenben_price,
					sale_price:_this.sale_price,
					unit:_this.unit,
					img_ids:_this.foodIds.length? _this.foodIds.join(',') : '',
					default_num:_this.default_num,
					warning_num:_this.warning_num,
					num:_this.num,
					is_new:_this.is_new,
					is_zhuchu:is_zhuchu,
					is_rexiao:_this.is_rexiao,
					make_num:_this.make_num,
					process:_this.process.length? _this.process.join(',') :'',
					is_process:_this.is_process,
					main:_this.main,
					ingredients:_this.ingredients,
					status:_this.status,
					top:top,
					youxuan:youxuan,
					cover:_this.foodIds[0],
					
				};
				_this.$api.ajax('smdc/food/toAddOrEdit',data, function(ret) {

					setTimeout(function(){
						_this.$api.toast('操作成功~')
					},300)
					setTimeout(function(){
						uni.navigateBack()
					},2000)
				},'POST',true)
		
			},
		},
		
	
	}
</script>

<style lang="less">
	page{
		background-color: #f7f7f7;
	}
	.mar-t12 {
		margin-top: 12rpx;
	}
	.mar-r20 {
		width: 26%;
	}

	.bor-t {
		border-top: 1rpx solid #EEEEEE;
	}

	.bor-bt {
		border-bottom: 1rpx solid #EEEEEE;
	}

	.dishViedo {
		width: 100%;
		height: 400rpx;
		margin-top: 20rpx;
	}

	.addpeople {
		width: 90%;
		padding: 24rpx 0;
		text-align: center;
		margin: 43rpx auto;
		border-radius: 20rpx; 
	}

	.box {
		margin-bottom: 20rpx;
		padding: 0 30rpx;
		background-color: #FFFFFF;
	}

	.info {
		padding: 26rpx 0rpx;
		flex: 1;

		.infoInput {
			flex: 1;
			margin-left: 30rpx;
			border: none;
			font-size: 28rpx;
			text-align: right;

			.selectIncon {
				width: 24rpx;
				height: 24rpx;
				margin-left: 10rpx;
			}
		}
	}

	.pos_re {
		position: relative;
	}

	.uploadImg-img {
		width: 132rpx;
		height: 132rpx;
		background: rgba(238, 238, 238, 1);
		opacity: 1;
		border-radius: 20rpx;
		margin: 0 20rpx 20rpx 0;
		position: relative;
	}

	.delImg {
		width: 25rpx;
		height: 25rpx;
		position: absolute;
		z-index: 2;
		margin-left: -36rpx;
		margin-top: -10rpx;
	}
</style>
