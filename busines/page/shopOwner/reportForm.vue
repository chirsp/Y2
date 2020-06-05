<template>
	<view class="">
		<view class="top">
			<view class="mBg topbanner">
				<view class="flex_row topSelect">
					<text v-for="(item,index) in dimension" :key="index" class="item"
					 :class="dIndex==index?'mB33 _cff':index?'bor-left':''" 
					 @click="selectType(index)">{{item}}</text>
				</view>
			</view>
			
		    
			<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft" v-if="dIndex>1">
				<view class="flex text-center" style="width: 100% ;">
					<view class="cu-item flex-sub timenav" :class="index==TabCur?'text-orange cur _f32':'noselect'" v-for="(item,index) in Time"
					 :key="index" @click="timeSelect(index,item.year,item.month)" >
						{{item.name}}
					</view>
				</view>
			</scroll-view>
		</view>
		
		<view :style="dIndex>1?'height:100px':'height:50px'" :class="dIndex?'':'mBg'"></view>
		 
		<!-- 今日订单/营业额统计 -->
		<block v-if="dIndex==0">
			<view class="todayALl flex_row flex_sa mBg">
				<view class="flex_col box">
					<text class="title">营业额(元)</text>
					<text class="_cff num">{{turnover || '0.00'}}</text>
				</view>
				<view class="flex_col border box">
					<text  class="title">订单数</text>
					<text class="_cff num">{{today_order || '0'}}</text>
				</view>
			</view>
			<view class="flex_center">
				<image src="../../static/image/noAllImg.png" class="noallImg"></image>
				<text class="_c66 _f26">数据统计在今日零点后生成</text>
			</view>
		</block>
		
		<!-- 报表统计模块 -->
		<block v-else>
			<view class="flex_col total-num _c99 _f30">
				<text>营业额(元):{{toatal.money || '0.00'}}</text>
				<!-- <text>订单总数(单):{{today_order || '0'}}</text> -->
			</view>
			
			<!-- 折线图 -->
			<view class="qiun-charts">
				<!--#ifdef MP-ALIPAY -->
				<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
				<!--#endif-->
				<!--#ifndef MP-ALIPAY -->
				<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
				<!--#endif-->
			</view>
			
			
			
			<!-- 菜品销量 -->
			<view class="dishTotal flex_col">
				<text class="title _c99 _f30">菜品销量</text>
				<nodata msg="暂无菜品销量统计数据~"  v-if="food_count.length==0"></nodata>
				<view class="title flex_col" v-for="(item,index) in food_count" :key='index' v-if="food_count.length">
					<view class="flex_sb flex_row">
						<text class="_fw _c33">{{item.name}}</text>
						<text class="_c66 _fw">￥{{item.money}}/{{item.num}}份</text>
					</view>
					<dishprogress :loading="loading" :num='item.percent_money'></dishprogress>
				</view>
				
			</view>
		</block>
	
	     
		
	</view>
</template>

<script>
	import dishprogress from '../../components/progress.vue'
	import nodata from '../../../components/nodata.vue'
	import uCharts from '../../components/u-charts/u-charts.js';
	var canvaLineA=null;
	var lastMoveTime=null;//最后执行移动的时间戳 
	export default{
		components:{dishprogress,nodata},
		data(){
			return{
				dimension:['今日','周','月','年'],
				dIndex:0,
				weekArr:[] ,//周数组
				loading:false,
				Time:[],
				TabCur:'',
				scrollLeft:0,
				
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				Interactive:'',//交互显示的数据
				toatal: '',
				food_count:'', //菜品销量
				turnover:'' ,
				today_order:0
			}
		},

		onLoad() {
			let _self = this
			_self.TabCur = _self.Time.length - 1
			_self.scrollLeft = (_self.TabCur - 1) * 60
			_self.getTimeNow()  //获取周时间
			 // _self.getServerData();
			 _self.cWidth=uni.upx2px(750);
			 _self.cHeight=uni.upx2px(500);
			 setTimeout(function() {
			 	_self.loading = true
			 }, 500)
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function (res) {
					if(res.pixelRatio>1){
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio =2;
					}
				}
			});
			//#endif
			
		},
		methods:{
			// 获取当月最后一天的日期
			 getLastDay(year,month) {
			        var new_year = year;    //取当前的年份
			        var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
			        if(month>12) {
			            new_month -=12;        //月份减
			            new_year++;            //年份增
			        }
			        var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天
			        return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期
			    },
			
			// 时间选择
			timeSelect(index,year,m){
				console.log("index:",index,"year:",year,m)
				let that = this
				let day =  that.getLastDay(year,m)
				that.TabCur =  index
				that.scrollLeft = (index- 1) * 60
				if(that.dIndex==1){
				   // day = day>30? day : 
					that.weekArr =[]
					for (let i = 1; i < 30 ; i++) {
						if(i%5==0 && i<26){
							that.weekArr.push(i)
						}
					}
					that.weekArr.push(day)
				}
				if(that.dIndex==2){
					that.weekArr =[]
					for (let i = 1; i < 13; i++) {
						that.weekArr.push(i+'月')
					}
				}
				this.getServerData(this.Time[index].start,this.Time[index].end)
			},
			
			// 选择维度
			selectType(index){
				console.log(index)
				this.dIndex = index
				if(this.dIndex==0){
					this.today_order = 0
					this.turnover = 0
					this.getServerData()
				}
				if(this.dIndex==1){
					this.getTimeNow()
				}
				if(this.dIndex==2){
					this.getMontharea()
				}
				if(this.dIndex==3){
					this.getYeararea()
				}
				
			},
		
			
			// 获取当前月度统计时间段
			getMontharea(){
				    var that = this
				    that.Time  = [];
				    var data = new Date();
				    var year = data.getFullYear();
				    data.setMonth(data.getMonth()+1, 1)//获取到当前月份,设置月份
				    for (var i = 0; i < 12; i++) {
				        data.setMonth(data.getMonth() - 1);//每次循环一次 月份值减1
				        var m = data.getMonth() + 1;
				        m = m < 10 ? "0" + m : m;
						let obj ={}
						if(m==1){
							year--
						}
						obj['name'] = year + "/" + m 
						obj['start'] = year +'/' + m + '/1' +' ' +'00:00:00'
						obj['end'] = year +'/' + m +'/' + that.getLastDay(year,m) +' ' +'00:00:00'
						obj['month'] = m
						obj['year'] = year
						that.Time.unshift(obj)
				    }
					that.TabCur = that.Time.length - 1
					that.scrollLeft = (that.TabCur - 1) * 60
					that.weekArr =[]
					for (let i = 1; i < that.getLastDay(year,m)+1 ; i++) {
						if(i%5==0){
							that.weekArr.push(i)
						}
					}
				    that.getServerData(that.Time[11].start,that.Time[11].end)
			},
			
			// 获取当前年度统计时间段
			getYeararea(){
				var that = this
				var date=new Date;
				var y = date.getFullYear()
				that.Time = []
				for (let i = 0; i < 3; i++) {
				  let obj = {}
				  obj['name'] = y +'年'
				  obj['start'] = y+'/' + '1/1' + ' ' +'00:00:00'
				  obj['end'] = y+'/' + '12/' + that.getLastDay(y,12) + ' ' +'00:00:00'
				  obj['year'] = y
				  y = y -1
				  that.Time.unshift(obj)
				}
				that.TabCur = that.Time.length - 1           
				that.scrollLeft = (that.TabCur - 1) * 120
				that.weekArr =[]
				for (let i = 1; i < 13; i++) {
					that.weekArr.push(i+'月')
				}
				that.getServerData(that.Time[2].start,that.Time[2].end)
			},
			
			
			
			// 获取折线图数据
			getServerData(start,end){
				uni.showLoading({
					title:'加载中..'
				})
				let _self = this
				start =  new Date(start).getTime()
				end =  new Date(end).getTime()
				
			    _self.$api.ajax('smdc/Shop_count/count', {
			  	shop_id: _self.$store.state.shopId,
				type:_self.dIndex,
				start_time:start / 1000,
				end_time:end / 1000, 
			  }, res => {
				  console.log("res:",res)
				       let LineA={categories:[],series:[]};
				  		//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						// 总的人员数和营业额
						_self.toatal= res.data.turnover_total || 0
						_self.worker_num= res.data.worker_num || 0
						_self.food_count= res.data.food_count || 0
						_self.turnover = res.data.turnover  || 0
						_self.today_order = res.data.today_order || 0
						// 周维度的统计
						LineA.categories=_self.weekArr;
						if( res.data.turnover ){
							_self.turnover = res.data.turnover
							let series =[
								{
								name: "营业额(元)",
								data: res.data.turnover
							},
							]
							LineA.series = series;
							console.log(LineA)
							//第二根线为虚线的设置
							_self.showLineA("canvasLineA",LineA);
						}
						
			    
			  })
						},
	// 准备绘制图形
	    showLineA(canvasId,chartData){
			uni.hideLoading()
	    	var _self = this
	    	canvaLineA=new uCharts({
	    		$this:_self,
	    		canvasId: canvasId,
	    		type: 'line',
	            colors:['#facc14', '#90ed7d', '#8543e0', '#90ed7d'],
	    		fontSize:11,
	    		padding:[15,15,0,15],
	    		legend:{
	    			show:true,
	    			padding:5,
	    			lineHeight:11,
	    			margin:0,
	    		},
	    		dataLabel:false,
	    		dataPointShape:true,
	    		background:'#FFFFFF',
	    		pixelRatio:_self.pixelRatio,
	    		categories: chartData.categories,
	    		series: chartData.series,
	    		animation: true,
	    		xAxis: {
	    			type:'grid',
	    			gridColor:'#CCCCCC',
	    			gridType:'dash',
	    			dashLength:8,
	    			//disableGrid:true
	    		},
	    		yAxis: {
	    			gridType:'dash',
	    			gridColor:'#CCCCCC',
	    			dashLength:8,
	    		},
	    		width: _self.cWidth*_self.pixelRatio,
	    		height: _self.cHeight*_self.pixelRatio,
	    		extra: {
	    			line:{
	    				type: 'straight'
	    			}
	    		}
	    	});
	    	
	    },
	    touchLineA(e) {
	    	lastMoveTime=Date.now();
	    },
	    moveLineA(e){
	    	let currMoveTime = Date.now();
	    	let duration = currMoveTime - lastMoveTime;
	    	if (duration < Math.floor(1000 / 60)) return;//每秒60帧
	    	lastMoveTime = currMoveTime;
	    	
	    	let currIndex=canvaLineA.getCurrentDataIndex(e);
	    	if(currIndex>-1&&currIndex<canvaLineA.opts.categories.length){
	    		let riqi=canvaLineA.opts.categories[currIndex];
	    		let leibie=canvaLineA.opts.series[0].name;
	    		let shuju=canvaLineA.opts.series[0].data[currIndex];
	    		this.Interactive=leibie+':'+riqi+'-'+shuju+'元';
	    	}
	    	canvaLineA.showToolTip(e, {
	    		format: function (item, category) {
	    			return category + ' ' + item.name + ':' + item.data 
	    		}
	    	});
	    },
	    touchEndLineA(e){
	    	let currIndex=canvaLineA.getCurrentDataIndex(e);
	    	if(currIndex>-1&&currIndex<canvaLineA.opts.categories.length){
	    		let riqi=canvaLineA.opts.categories[currIndex];
	    		let leibie=canvaLineA.opts.series[0].name;
	    		let shuju=canvaLineA.opts.series[0].data[currIndex];
	    		this.Interactive=leibie+':'+riqi+'-'+shuju+'元';
	    	}
	    	canvaLineA.touchLegend(e);
	    	canvaLineA.showToolTip(e, {
	    		format: function (item, category) {
	    			return category + ' ' + item.name + ':' + item.data 
	    		}
	    	});
	    },
			getTimeNow(){
				var now = new Date();  
				var nowTime = now.getTime();  
				var day = now.getDay();
				var year = now.getFullYear()
				var oneDayLong = 24 * 60 * 60 * 1000;  
		     	//计算上一周  
				this.weekArr =[]
				for (var i = 0; i < 7; i++) {
					var SundayTime = nowTime -(i+1) * oneDayLong;  
					var SundayTime = new Date(SundayTime);
					var m = SundayTime.getMonth() + 1;//月  
					var d = SundayTime.getDate();//日  
					var obj =m+"/"+d; 
					this.weekArr.unshift(obj)
				}
				let start = year +'/'+ this.weekArr[0] + ' ' +'00:00:00'
				let end =year +'/'+ this.weekArr[6] + ' ' +'23:59:59'
				this.getServerData(start,end)
			},
			
			
		}
		
		
	}
</script>

<style lang="less">
	page{
		background-color:#FFFFFF
	}
	.timenav{
		width: 200rpx;
	}
	.todayALl{
		padding:40upx 30upx 50upx 30upx;
		.title{
			margin-bottom: 15;
			font-size: 28upx;
			color: #EEEEEE;
		}
		.num{
			font-size: 62upx;
		}
		.right{
			text-align: right;
		}
		.border{
			border-left: 1upx dashed #FFFFFF;
		}
		.box{
			width: 50%;
			justify-content: center;
			align-items: center;
		}
	}
	.noallImg{
		width: 500upx;
		height: 350upx;
		margin: 150upx 0 20upx 0;
	}
	.dishTotal{
		padding: 45upx 30upx;
		.title{
			margin-bottom: 25upx;
		}
		.item-name{
			margin-bottom: 20upx;
		}
		
	}
/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
		border-bottom: 20upx solid #EEEEEE;
	}
	
	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
.total-num{
	margin: 38upx;
}
.total-num text{
	margin-bottom: 20upx;
}
.space{
	height: 200upx;
}
.top{
	position: fixed;
	top: 0;
	width: 100%;
	.topbanner{
		padding: 20upx 0;
	}
	.nav{
		box-shadow:0upx 8upx 15upx rgba(114,124,142,0.06);
		opacity:1;
	}
	.topSelect{
		// border-radius:10upx;
		border: 1upx solid #333333;
		width: 600upx;
		margin: auto;
	}
	.mB33{
		background-color: #333333;
	}
	.item{
		width:200upx;
		padding: 13upx 0;
		text-align: center;
	}
	.bor-left{
		border-left: 1upx solid #333333;
	}
}
</style>
