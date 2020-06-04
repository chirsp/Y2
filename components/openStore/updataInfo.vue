<template>
	<view class="backgroud">
		<!-- 菜单 -->
		<view class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==TabCur?'text-orange cur':''" v-for="(item,index) in Tab" :key="index"
				 @tap="tabSelect(index)">
					{{item}}
				</view>
			</view>		
		</view>
		<!-- 菜单 -->
		<view style="height: 100upx;"></view>
		<!-- 申请通过 -->
		<view class="apply flex_row flex_ai">
			<image class="applyImg" src="../../static/yes.png"></image>
			<view class="applytxt">{{title}}</view>
		</view>

		<!-- 资料 -->
		<block v-if="TabCur==0">
			<view class="means">
				<view class="bor-bt">
					<view class="storename">门店名称</view>
					<input class="storeinput" placeholder="请输入门店名称" v-model="store_name" @blur="Telcheck" />
				</view>
				<view>
					<view class="storename">联系电话</view>
					<input class="storeinput" placeholder="请输入电话号码" maxlength="11" v-model="tel" @blur="Telcheck2" />
				</view>
			</view>
			<!-- 区域 -->
			<view class="means">
			<view>
				<view class="storename">请选择区域</view>
				<pick-regions  @getRegions="handleGetRegions">
					<view class="radinput" >
						<text class="pad-t10" :class="regionsName?'':'_c66'">{{regionsName || '请选择区域'}}</text>
				    </view>
				</pick-regions>
				
			</view>
				<view class="bor-bt">
					<view class="storename">详细地址</view>
					<input class="storeinput" placeholder="请输入门店名称" v-model="address" />
					<!-- <image class="img" src="../../static/location.png"></image> -->
				</view>
				<view>
					<view class="storename">营业时间</view>
					<input class="radinput" placeholder="请输入营业时间 格式:09:30-21:30"  v-model="business_time" />
					<!-- <image class="img" :style="item.src?'display:block':'display:none'" :src="item.src"></image> -->
				</view>
			</view>
			 
			<!-- 门店头照 -->
			<view class="storephoto flex_col">
				<view class="storename">门店门头照&nbsp;&nbsp;&nbsp;(最多上传一张)</view>
				<view class="storeHead">
					<view class="storebg" v-for="(item,index) in stoimg" :key="index" v-if="stoimg">
						<image class="storeimg" :src="item" mode="aspectFill"></image>
						<image class="dele" src="../../static/shanchu.png" @click="Deletes(index)"></image>
					</view>
					<view class="storebg _flex-center" @click="OutLet" v-if="stoimg.length==0">
						<image class="storeimg_add" src="../../static/store.png"></image>
					</view>
				</view>
			</view>
			
			<!-- 商家店铺 -->
			<view class="storephoto flex_col">
				<view class="storename">商家店铺照</view>
				<view class="storeHead">
					<view class="storebg" v-for="(item,index) in urlpath" :key="index" v-if="urlpath">
						<image class="storeimg" :src="item" mode="aspectFill"></image>
						<image class="dele" src="../../static/shanchu.png" @click="Delete(index)"></image>
					</view>
					<view class="storebg _flex-center" @click="Store">
						<image class="storeimg_add" src="../../static/store.png"></image>
					</view>
				</view>
			
			</view>
			
			<view class="business">
				<view class="txt">请补充营业执照</view>
				<view class="busbg">
					<view class="busline" @click="upload()">
						<image class="busImg" src="../../static/add.png"></image>
						<view class="bustips">点击上传营业执照</view>
					</view>
					<image class="buslineImg" @click="upload()" :src="business" :style="business.length>0?'display:block':'display:none'"></image>
			
				</view>
			</view>
			<view class="business">
				<view class="txt">请上传食品经营许可证</view>
				<view class="busbg">
					<view class="busline" @click="upload2()" >
						<image class="busImg" src="../../static/add.png"></image>
						<view class="bustips">点击上传食品经营许可证</view>
					</view>
					<image class="buslineImg" @click="upload2()" :src="food" mode="aspectFill" v-if="food"></image>
				</view>
			</view>
			
			<view class="business">
				<view class="txt">请上传身份证正面照</view>
				<view class="busbg">
					<view class="busline" @click="uploadFront(1)">
						<image class="busImg" src="../../static/add.png"></image>
						<view class="bustips">点击请上传身份证正面照</view>
					</view>
					<image class="buslineImg" @click="uploadFront(1)" :src="frontSrc" v-if="frontSrc"></image>
				</view>
			</view>
			<view class="business">
				<view class="txt">请上传身份证反面照片</view>
				<view class="busbg">
					<view class="busline"  @click="uploadFront(2)">
						<image class="busImg" src="../../static/add.png"></image>
						<view class="bustips">点击上传身份证反面照片</view>
					</view>
					<image class="buslineImg"  @click="uploadFront(2)" :src="backSrc" v-if="backSrc" ></image>
				</view>
			</view>
		</block>
		
		
		<!-- 账户信息 -->
		<block v-if="TabCur==1">
			<view class="means">
				<view class="bor-bt">
					<view class="storename ">持卡人/收款人</view>
					<input class="storeinput" placeholder="请输入持卡人姓名" v-model="cardholder" @blur="Telcheck3" />
				</view>
				<view class="bor-bt">
					<view class="storename">银行卡号</view>
					<input class="storeinput" placeholder="请输入银行卡号" v-model="bank_no" @blur="Telcheck3" />
				</view>
				<view class="bor-bt">
					<view class="storename">银行名称</view>
					<input class="storeinput" placeholder="请输入银行名称" v-model="bank_name" @blur="Telcheck3" />
				</view>
				<view class="bor-bt ">
					<view class="storename">支付宝号</view>
					<input class="storeinput" placeholder="请输入支付宝号" v-model="alicode" @blur="Telcheck2" />
				</view> 
				<view>
					<view class="storename">微信号</view>
					<input class="storeinput" placeholder="请输入微信号" v-model="wxcode" />
				</view>
			</view>
		</block>
		
		
		
		<view class="agreement flex_row" @click="selectFlag()">
			<label>
				<checkbox color="#FEB026" style="transform: scale(0.5);" :checked="flag"  /><text></text>
			</label>
			<view class="flex_col" style="flex-wrap: wrap">
			  <view>我已阅读并同意: </view>
			  <view v-for="(item,index) in agreement" :key="index" class="flex_col">
				  <view class="text-yellow" @click.stop="lookDetailInfo(item.id)">《{{item.name}}》</view>
			   </view> 
			</view>
		</view>



		<!-- 提交  -->
		<view class="submit" @click="submit">提交</view>
	</view>
</template>

<script>
	import pickRegions from '../pick-regions/pick-regions.vue'
	export default {
		components: {
			pickRegions
		},
		props:{
			agreement:{
				type:Array,
				default:()=>([])
			},
			updataInfo:{
				type:Object,
				default:()=>({})
			},

		},
		data() {
			return {
				flag:false,
				title: "您的申请已通过，请补充余下资料",
				Tab: ['商家信息', '账户信息'],
				TabCur: 0,
				stoimg: [],
				store_name : '',
				tel: "",
				bank_no: "",
				address: "",
				business_time: "",
				sub: 0,
				image: [],
				storeimage: [],
				urlpath: [],
				bank_name:"",
				cardholder:"",
				alicode:"",
				wxcode:"",
				backSrc:"",
			    back:"",
				front:"",
				frontSrc:"",
				store: [{
						"name": "门店名称",
						"tips": "请输入门店名称"
					},
					{
						"name": "联系电话",
						"tips": "请输入电话号码"
					},
					{
						"name": "银行卡号",
						"tips": "请输入银行卡号"
					}
				],
				area: [
					{
						"name": "详细地址",
						"tips": "请输入详细地址",
						"src": "../../static/location.png"
					},
					{
						"name": "营业时间",
						"tips": "请选择营业时间",
						"src": ""
					},
				],
				voucher: [{
						"title": "请补充营业执照",
						"txt": "点击上传营业执照"
					},
					{
						"title": "请上传食品经营许可证",
						"txt": "点击上传食品经营许可证"
					}
				],
				tips: 0,
				id: 0,
				business: "",
				busindessid: 0,
				food: "",
				foodid: 0,
				regions: [],
				area_id: "",
				token : uni.getStorageSync('kejia_order_token'),
				card:""
			}
		},
		computed: {
			regionsName() {
				// 转为字符串
				return this.regions.map(item => item.name).join(' ') 
			},

		},
		onShow() {

		},
		methods: {
			// banner选择
			tabSelect(index){
				this.TabCur = index
			},
			
			// 查看用户协议detail
			lookDetailInfo(id){
				this.$api.openWin('/pages/personal-center/agreemenet?id=' + id)
			},
			
			// 用户协议id
			selectFlag(){
				this.flag =! this.flag
			},
			// 获取选择的地区
			handleGetRegions(regions) {
				this.regions = regions
				this.area_id = this.regions[2].code
			},
			
			Telcheck() {
				if (this.store_name == "") {
					this.$api.toast('店铺名不能为空')
				}
			},
			Telcheck2() {
				if (this.tel.length != 11 || this.tel == "") {
					this.$api.toast('手机号码格式错误')
				}
			},
			Telcheck3() {
				if (this.bank_no.length < 14 || this.bank_no == "") {
					this.$api.toast('银行卡号格式错误')
				}
				if (this.cardholder == "") {
					this.$api.toast('请输入收款人')
				}
				if (this.bank_name == "") {
					this.$api.toast('请输入银行名称')
				}
			},
			upload() {
				var _this = this
				uni.chooseImage({
					success(ret) {
						_this.business = ret.tempFilePaths[0]
					
						_this.$api.uploadImg('smdc/upload/images',{
							token:_this.token,
							shop_id:_this.$store.state.shopId,
							imgUrl:ret.tempFilePaths[0]
						},function(res){
							_this.busindessid = res.id;
						},true)
					}
				})
			},
			upload2() {
				var _this = this
				uni.chooseImage({
					success(ret) {
						_this.food = ret.tempFilePaths[0]
						_this.$api.uploadImg('smdc/upload/images',{
							token:_this.token,
							shop_id:_this.$store.state.shopId,
							imgUrl:ret.tempFilePaths[0]
						},function(res){
							_this.foodid = res.id;
						},true)
						_this.secondStatus =3;
					}
				})
			},


			Store() {
				var _this = this
				uni.chooseImage({
					success(ret) {
						_this.urlpath.push(ret.tempFilePaths);
						_this.$api.uploadImg('smdc/upload/images',{
							token:_this.token,
							shop_id:_this.$store.state.shopId,
							imgUrl:ret.tempFilePaths[0]
						},function(res){
							_this.storeimage.push(res.id)
						},true)
						
					}
				})
			},
			OutLet() {
				var _this = this
				_this.sub++;
				if (_this.sub % 2 == 0) {
					_this.stoimg.splice(0, 1);
					_this.sub = 1;
				}
				uni.chooseImage({
					success(ret) {
						_this.stoimg.push(ret.tempFilePaths[0])
						_this.$api.uploadImg('smdc/upload/images',{
							token:_this.token,
							shop_id:_this.$store.state.shopId,
							imgUrl:ret.tempFilePaths[0]
						},function(res){
							_this.id = res.id;
						},true)
					}
				})
			},
			
			// 上传身份证照
			uploadFront(param){
				let _this =  this
				uni.chooseImage({
					success(ret) {
						if(param==1){
							_this.frontSrc = ret.tempFilePaths[0]
						} else if(param == 2){
							_this.backSrc = ret.tempFilePaths[0]
						}
						_this.$api.uploadImg('smdc/upload/images',{
							token:_this.token,
							shop_id:_this.$store.state.shopId,
							imgUrl:ret.tempFilePaths[0]
						},function(res){
							if(param==1){
								_this.front =res.id;
							} else if(param==2){
								_this.back  = res.id;
							}
						},true)
					
					}
				})
			},
			
			Delete(index) {
				this.urlpath.splice(index, 1)
			},
			Deletes(index) {
				this.stoimg.splice(index, 1);
			},
			submit() {
				var _this = this
				if(!_this.store_name){
					_this.$api.toast('请输入门店名称')
					return
				}
				if (this.tel.length != 11 || this.tel == "") {
					this.$api.toast('手机号码格式错误')
				}
				if(!_this.area_id){
					_this.$api.toast('请选择地区')
					return
				}
				if(!_this.id){
					_this.$api.toast('请上传门店门头照')
					return
				}
				if(!_this.storeimage.join(',')){
					_this.$api.toast('请上传商家店铺照')
					return
				}
				if(!_this.business || !_this.food ){
					_this.$api.toast('请上传营业执照与食品经营许可证')
					return
				}
				if(!_this.back || !_this.front ){
					_this.$api.toast('请上传身份证照片信息')
					return
				}
				if(!_this.cardholder || !_this.bank_no || !_this.bank_name ){
					_this.$api.toast('请完善银行卡信息')
					return
				}


				console.log(_this.updataInfo.store_name);
				let shopid = _this.updataInfo.id?_this.updataInfo.id:'';
				console.log(shopid);
				let data = {
						id: shopid,
					store_name: _this.store_name,
					tel: _this.tel,
					bank_no: _this.bank_no,
					address: _this.address,
					business_time: _this.business_time,
					store_cover: _this.id,
					shop_photo: _this.storeimage.join(','),
					business_photo: _this.busindessid,
					management_photo: _this.foodid,
					shop_id:_this.$store.state.shopId,
					cardholder:_this.cardholder,
					bank_name:_this.bank_name,
					area_id:_this.area_id,
					alicode:_this.alicode,
					wxcode:_this.wxcode,
						front:_this.front,
						back:_this.back,
						true_name:_this.cardholder,

					}
				if(_this.flag==false ){
					_this.$api.toast('请阅读合作条款')
					return
				}
					_this.$api.ajax('smdc/Merchant/add',data,function(ret){
						_this.$api.toast('资料已提交成功~')
						setTimeout(function(){
							uni.reLaunch({
								url:"/pages/personal-center/personal-center"
							})
						},2000)
					})
			},
			Person(va) {
				console.log(va);
			}

		}
	}
</script>

<style>
	.nav{
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 2;
		background-color: #FFFFFF;
	}
	.mar-5{
		margin: 0 10upx;
	}
	.agreement{
		margin: 0 20upx;
		color: #787878;
	}
	.bor-bt {
		border-bottom: 1upx solid #EEE;
		padding-bottom: 10upx;
	}

	.backgroud {
		background-color: #F1F1F1;
		overflow: hidden;
		display: block;
		/* position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0; */
	}

	.apply {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 3upx 6upx rgba(0, 0, 0, 0.1);
		opacity: 1;
		border-radius: 20upx;
		margin: 30upx;
		padding: 25upx;
		display: flex;
	}

	.applyImg {
		width: 44upx;
		height: 44upx;
	}

	.applytxt {
		width: 420upx;
		height: 40upx;
		font-size: 28upx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 34upx;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
		margin-top: 8upx;
		margin-left: 23upx;
	}

	.means {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 3upx 6upx rgba(0, 0, 0, 0.1);
		opacity: 1;
		border-radius: 20upx;
		padding: 10upx 30upx 30upx 30upx;
		margin: 30upx;
	}

	.storename {
		font-size: 32upx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 34upx;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
	}

	.storeinput {
		height: 37upx;
		font-size: 26upx;
		font-weight: 500;
		line-height: 34upx;
		margin-top: 21upx;
	}

	.radinput {
		width: 550upx;
		height: 60upx;
		background: rgba(255, 255, 255, 1);
		border: 1upx solid rgba(219, 219, 219, 1);
		opacity: 1;
		border-radius: 178upx;
		font-size: 26upx;
		font-weight: 500;
		line-height: 34upx;
		padding-left: 31upx;
		margin-top: 23upx;
		display: flex;
	}
   .pad-t10{
	   padding-top: 13upx;
   }
	.img {
		width: 48upx;
		height: 48upx;
		position: absolute;
		right: 85upx;
		margin-top: -55upx;
	}

	.storephoto {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 3upx 6upx rgba(0, 0, 0, 0.1);
		opacity: 1;
		border-radius: 20upx;
		margin: 30upx;
		padding: 0 30upx;

	}

	.storename {
		font-size: 32upx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		margin-top: 30upx;
	}

	.storeHead {
		display: flex;
		margin: 30upx;

	}

	.storebg {
		width: 124upx;
		height: 124upx;
		background: rgba(248, 248, 248, 1);
		opacity: 1;
		border-radius: 20upx;
		margin-right: 24upx;
	}

	.storeimg {
		width: 124upx;
		height: 124upx;
	}

	.storeimg_add {
		width: 56upx;
		height: 56upx;
	}

	.business {
		margin: 30upx;
	}

	.busbg {
		box-shadow: 0upx 3upx 6upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;
		margin-top: 22upx;
		padding: 52upx;
		text-align: center;
		background-color: #fff;
	}

	.busline {
		height: 300upx;
		background: rgba(255, 255, 255, 1);
		border: 1upx solid rgba(219, 219, 219, 1);
		border-radius: 20upx;
	}

	.buslineImg {
		width: 595upx;
		height: 300upx;
		background: rgba(255, 255, 255, 1);
		border: 1upx solid rgba(219, 219, 219, 1);
		opacity: 1;
		border-radius: 20upx;
		position: absolute;
		left: 80upx;
		margin-top: -302upx;
	}

	.busImg {
		width: 85upx;
		height: 85upx;
		margin-top: 68upx;
	}

	.bustips {
		height: 40upx;
		font-size: 28upx;
		font-weight: 500;
		line-height: 34upx;
		color: rgba(153, 153, 153, 1);
		margin-top: 24upx;
	}

	.submit {
		width: 690upx;
		height: 75upx;
		background: rgba(254, 176, 38, 1);
		border-radius: 20upx;
		font-size: 36upx;
		font-weight: 500;
		line-height: 38upx;
		color: rgba(255, 255, 255, 1);
		letter-spacing: 20upx;
		text-align: center;
		margin-bottom: 66upx;
		padding-top: 19upx;
		margin-top: 89upx;
		margin-left: 30upx;
	}

	.dele {
		width: 35upx;
		height: 35upx;
		position: absolute;
		margin-left: -11upx;
		margin-top: -16upx;

	}
</style>
