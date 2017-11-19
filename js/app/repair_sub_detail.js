define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true //启用右滑关闭功能
	});

	var old_back = mui.back;
	var reject = -1; //	拒绝原因 type
	var rejectedname;
	var repair = 0;
	var repairId;
	var repairname;
	var memo;
	var type = -1; //默认已完成
	var status = -1; //要切换到的维修状态，状态定义参考最上面 接单(1->4), 拒绝(1->6), 完成(1->5) 完成(4->5), 拒绝(4->6)
	var datatext = '';
	mui.plusReady(function() {
		
//		mui('.mui-scroll').scroll({
//			deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
//		});
		console.log('#repair_sub_detail plus ready');
		plus.screen.lockOrientation("portrait-primary");
		plus.webview.currentWebview().setStyle({
			scrollIndicator: 'none'
		});

		//	获取单条维修记录信息
		$.receiveHandler(function(id) {
//			alert('报修id: ' + id);
			repairId = id;
			getInfo(repairId);
			getWorkflow(repairId);
		}, 'getRepairInfo');

		//		GET /repair/{repairId}
		
		//	图片预览
		mui('body').on('tap', '.imgs', function() {
			var src = this.getAttribute('src');
			src = src.split("?");
			console.log(src[0]);
			goSeeImg(src[0]);

		});

		//	通过监听输入框的变化，开启计数功能
		document.getElementById('textarea').addEventListener('input', function() {
			console.log('sss')
			document.getElementById('count-text').innerText = document.getElementById('textarea').value.length;
		});
		document.getElementById('textarea').addEventListener('keydown', function(event) {
			checkEnter(event);
		});

		urlBaseP = plus.storage.getItem('urlBaseP');
		console.log("urlBaseP : " + urlBaseP);

		//	接单操作
		$.tapHandler({
			selector: '.repair-take',
			callback: function() {
				var reasontext = "";
				pickerBlur();
				status = 4;
				type = '';
				btnConfirm('接单',reasontext);
			}
		});

		//	完成操作
		$.tapHandler({
			selector: '.repair-success',
			callback: function() {
				var reasontext = document.querySelector('.success-reason').value;
				pickerBlur();
				status = 5;
				type = -1;
				btnConfirm('完成',reasontext);
			}
		});

		//	拒绝操作
		$.tapHandler({
			selector: '.repair-reject',
			callback: function() {
				pickerBlur();
				status = 6;
				//	必须给出原因
				var reasontext = document.querySelector('.reject-reason').value;
				if(reject == -1){
					mui.toast('请选择拒绝原因');
					return;
				}else{
					type = reject;
					btnConfirm('拒绝',reasontext);
				}
				
			}
		});

		// 拨打电话
		document.getElementById("call-user").addEventListener('tap', function() {
			var mobile = this.getAttribute('mobile');
			plus.device.dial(mobile);
		});

		//	选择报修操作
		$.tapHandler({
			selector: '#repari-select',
			callback: function() {
				pickerBlur();
				mui('#sheet1').popover('toggle');
			}
		});

		//	报修操作显示
		$.tapHandler({
			selector: '.repair-list',
			id: 'repair',
			callback: function(id) {
				console.log(id);
				repair = parseInt(id);
				switch(repair) {
					case 1:
						repairname = '接单';
						document.getElementById('repaired').style.display = 'block';
						document.getElementById('finish').style.display = 'none';
						document.getElementById('rejected').style.display = 'none';
//						mui('.mui-scroll').scroll().scrollToBottom(100);
						break;
					case 2:
						repairname = '完成';
						document.getElementById('repaired').style.display = 'none';
						document.getElementById('finish').style.display = 'block';
						document.getElementById('rejected').style.display = 'none';
//						mui('.mui-scroll').scroll().scrollToBottom(100);
						break;
					case 3:
						repairname = '拒绝';
						document.getElementById('repaired').style.display = 'none';
						document.getElementById('finish').style.display = 'none';
						document.getElementById('rejected').style.display = 'block';
//						mui('.mui-scroll').scroll().scrollToBottom(100);
						break;
				}
				document.getElementById('repari-select').value = repairname;
				mui('#sheet1').popover('toggle');
			}
		});

		//	选择拒绝原因
		$.tapHandler({
			selector: '#rejected-select',
			callback: function() {
				pickerBlur();
				mui('#sheet2').popover('toggle');
			}
		});
		//	报修显示
		$.tapHandler({
			selector: '.rejected-list',
			id: 'rejected',
			callback: function(id) {
				console.log(id);
				reject = parseInt(id);
				rejectedname = feedbackInfo(reject);
				document.getElementById('rejected-select').value = rejectedname;
				mui('#sheet2').popover('toggle');
			}
		});

		//	提交申请
		//		$.tapHandler({
		//			selector: '.goods-save',
		//			callback: function() {
		//				pickerBlur();
		//				getValue();
		//			}
		//		});

	});
	
	//	图片预览
	function goSeeImg(src) {
		mui.openWindow({
			url: 'show_img.html',
			id: 'show_img.html',
			extras: {
				path: src
			},
			show: {
				autoShow: false
			}
		});
	}

	//	确认操作
	function btnConfirm(info,reasontext) {
		console.log('btnConfirm(' + info + ')');
		//	弹出删除框
		mui.confirm('确定要' + info, '', ['是', '否'],
			function(event) {
				if(event.index === 0) {
					confirmSwitch(reasontext);
				}
			});
	}

	//	获取单条报修记录信息
	function getInfo(repairId) {
		plus.nativeUI.showWaiting();
		bucketP = plus.storage.getItem('bucketP');
		var url = plus.storage.getItem('urlBaseP');
		url = url + "/repair/" + repairId;
		console.log(url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('单条信息数据： ' + JSON.stringify(data));

			switch(data.status) {
				case 1:
					data.statusImg = 'images/dealwith.svg';
					data.status = '已报修'
					document.getElementById('repaired-box').style.display = 'block';
					document.getElementById('repaired').style.display = 'block';
					repairThreeShow();
					break;
				case 2:
					data.statusImg = 'images/dealwith.svg';
					data.status = '已接单'
					document.getElementById('repaired-box').style.display = 'block';
					document.getElementById('repaired').style.display = 'none';
					repairHideJd();
					break;
				case 3:
					data.statusImg = 'images/dealwith.svg';
					data.status = '已分配'
					document.getElementById('repaired-box').style.display = 'block';
					document.getElementById('repaired').style.display = 'none';
					repairHideJd();
					break;
				case 4:
					data.statusImg = 'images/true.svg';
					data.status = '待解决'
//					alert('待解决')
					document.getElementById('repaired-box').style.display = 'block';
					document.getElementById('repaired').style.display = 'none';
					repairHideJd();
					break;
				case 5:
					data.statusImg = 'images/true.svg';
					data.status = '已解决'
					document.getElementById('repaired-box').style.display = 'none';
					break;
				case 6:
					data.statusImg = 'images/true.svg';
					data.status = '已拒绝'
					document.getElementById('repaired-box').style.display = 'none';
					break;
				case 7:
					data.statusImg = 'images/dealwith.png';
					data.status = '已撤销'
					document.getElementById('repaired-box').style.display = 'none';
					break;
				case 8:
					data.statusImg = 'images/no.svg';
					data.status = '已评价'
					document.getElementById('repaired-box').style.display = 'none';
					break;
			}
			document.getElementById('call-user').setAttribute('mobile', data.phone);
			var room = data.house.building + '栋' + data.house.unit + '单元' + data.house.floor + '楼' + data.house.room + '房间';
			var json = {
				name: data.contact,
				phone: data.phone,
				status: data.status,
				room: room,
				text: data.text,
				zoneName: data.house.zoneName,
				day: data.day,
				time: data.time
			}
//			alert(data.text);
//			datatext = data.text;
			$.bind(json);
			if(data.images == ''){
				document.getElementById('showimgbox').style.display = 'none';
//				document.getElementById('showimgbox').innerText = '暂无图片';
				
			}else{
				document.getElementById('showimgbox').style.display = 'block';
				data.images = data.images.split("|");
				for(var i = 0; i < data.images.length; i++) {
					if(data.images[i] != "") {
						data.images[i] = 'http://' + bucketP + '.oss-cn-qingdao.aliyuncs.com/' + data.userSsoId + '/' + data.images[i] + '.jpg?x-oss-process=style/thumbnail';
						var html = '<img class="imgs" src="' + data.images[i] + '" alt="" / width="30%" height="">';
						document.getElementsByClassName('imgbox')[0].insertAdjacentHTML('beforeBegin', html);
					} else {
						data.images[i] = 'images/default_goods.png'
						var html = '<img class="imgs" src="' + data.images[i] + '" alt="" / width="30%" height="">';
						document.getElementsByClassName('imgbox')[0].insertAdjacentHTML('beforeBegin', html);
					}
				}
	
				var imgs = document.querySelectorAll('#imgsbox .imgs');
				for(var i = 0; i < imgs.length; i++) {
//					alert(imgs[i])
					imgs[i].height = imgs[i].width;
				}
			}
			

		}).fail(function(status) {
			console.log('got fail status:' + status);
			console.log('getInfo' + status);
			statusHandler(status);
		});
	}
	//	获取维修工作流
	function getWorkflow(repairId) {
		plus.nativeUI.showWaiting();
		bucketP = plus.storage.getItem('bucketP');
		var url = plus.storage.getItem('urlBaseP');
		url = url + "/repair/workflow/" + repairId;
		console.log(url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('工作流信息： ' + JSON.stringify(data));
			mui.each(data, function(index, item) {
				//				console.log(item)
				switch(item.event) {
					case 1:
						item.statusImg = 'images/dealwith.svg';
						item.status = '已报修'
						break;
					case 2:
						item.statusImg = 'images/dealwith.svg';
						item.status = '已接单'
						break;
					case 3:
						item.statusImg = 'images/dealwith.svg';
						item.status = '已分配'
						break;
					case 4:
						item.statusImg = 'images/true.svg';
						item.status = '待解决'
						break;
					case 5:
						item.statusImg = 'images/true.svg';
						item.status = '已解决'
						break;
					case 6:
						item.statusImg = 'images/true.svg';
						item.status = '已拒绝'
						break;
					case 7:
						item.statusImg = 'images/dealwith.png';
						item.status = '已撤销'
						break;
					case 8:
						item.statusImg = 'images/no.svg';
						item.status = '已评价'
						break;
				}
				var time = item.eventTime;
				item.day = formatDateDay(time);
				item.time = formatDateTime(time);
				console.log(item.memo);
				console.log(typeof item.memo); //	 string
				if(item.memo != "" && item.memo != undefined) {
//					alert('有数据')
					item.memo = JSON.parse(item.memo); //	 object
					console.log(typeof item.memo);
					console.log(JSON.stringify(item.memo));
					console.log(item.memo.reason)
					if(item.memo.reason != '') {
						item.reason = "反馈信息: " + item.memo.reason;
					} else {
						item.reason = "";
					}
					console.log(item.memo.type)
					console.log(typeof item.memo.type)

					item.memo.type = parseInt(item.memo.type);
					//					alert(item.memo.type);
					switch(item.memo.type) {
						case 0:
							item.type = '已解决用户的问题';
							break;
						case 1:
							item.type = '其他原因，见具体原因';
							break;
						case 2:
							item.type = '开发商工程质量问题';
							break;
						case 3:
							item.type = '暂无配件';
							break;
						case 4:
							item.type = '重复的问题';
							break;
						case 5:
							item.type = '已经解决过';
							break;
						case 6:
							item.type = '超出服务范围';
							break;
						default:
							item.type = '';
							break;
					}
					//					alert(item.type);

				}
				console.log(item.type);
				console.log(item.reason);
//				if(item.reason == 'undefined'){
//					item.reason = datatext;
//				}

			})
			console.log(JSON.stringify(data))
//			alert(typeof data.reason);
//			if(data.reason == 'undefined'){
//				data.reason = datatext;
//			}
			var dataJson = {
				dataList: data
			};
			document.querySelector('.workflow').innerHTML = '';
			$.render('tpl/repair_workflow_data.html', dataJson).then(function(html) {
				
				$.setValue('.workflow', html);
			});

		}).fail(function(status) {
			console.log('got fail status:' + status);
			console.log('getInfo' + status);
			statusHandler(status);
		});
	}

	mui.back = function() {
		//		alert('返回');
		showEmpty();
		var html = '<div class="goods-title">报修图片</div>';
			html +=	'	 <div class="content-img">';
			html +=	'	<div class="imgbox" id="imgsbox"></div>';
			html +=	'</div>';
//		document.querySelector('.content-img').innerHTML = html;
		document.getElementById('showimgbox').innerHTML = html;
		document.querySelector('.success-reason').value = '';
		document.querySelector('.reject-reason').value = '';
		document.getElementById('rejected-select').value = '';
		document.getElementById('repari-select').value = '';
		showRepaired();
		reject = -1; //	拒绝原因 type
		repair = 0;
		type = -1; 
		status = -1; 
		old_back();
	}
	
	function showEmpty(){
		var html = '<li class="tl-item">';
			html += ' <div class="tl-wrap">';
			html += '	<span class="tl-date" data-bind="day"></span>';
			html += '	<span class="tl-date2" data-bind="time"></span>';
			html += '	<div class="tl-content">';
			html += '		<span class="arrow left pull-up"></span>';
			html += '		<div class="text-lt">';
			html += '			<img src="images/default_header.png" width="20" height="20">&nbsp;&nbsp;';
			html += '			<span data-bind="status"></span>';
			html += '		</div>';
			html += '		<div class="panel-body">';
			html += '					<div class="">';
			html += '							<span class="text-primary" data-bind="text"></span>';
			html += '						</div>';
			html += '						<div class="">';
			html += '							<span class="text-success"></span>';
			html += '						</div>';
			html += '				</div>';
			html += '				</div>';
			html += '			</div>';
			html += '	</li>';
		document.querySelector('.workflow').innerHTML = html;
	}

	//	切换维修记录状态
	function confirmSwitch(reasontext) {
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/repair/switch';
		var memotext = {
			type: type,
			reason: reasontext
		}
		memotext = JSON.stringify(memotext);
		console.log(memotext);
		console.log(repairId);
		repairId = parseInt(repairId);
		console.log(repairId);
		var json = {
			status: status,
			id: repairId,
			memo: memotext,
			eventImages: ""
		}
		console.log('提交的数据：'+JSON.stringify(json));
		$.put(url, json).then(function(data) {
			console.log(JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.code === 0) {
				mui.toast('切换成功');
				var list = plus.webview.getWebviewById('repair_sub.html');
				mui.fire(list, 'repairRefresh',{num:1});
				mui.back();
			} else {
				mui.toast('切换失败');
			}

		}).fail(function(status) {
			console.log('切换维修记录' + status)
			statusHandler(status);
		});
	}

	function feedbackInfo(reject) {
		var feedbackName;
		switch(reject) {
			case 0:
				feedbackName = '已解决用户的问题';
				break;
			case 1:
				feedbackName = '其他原因，见具体原因';
				break;
			case 2:
				feedbackName = '开发商工程质量问题';
				break;
			case 3:
				feedbackName = '暂无配件';
				break;
			case 4:
				feedbackName = '重复的问题';
				break;
			case 5:
				feedbackName = '已经解决过的问题';
				break;
			case 6:
				feedbackName = '超出服务范围';
				break;
		}
		return feedbackName;
	}

	function repairThreeShow() {
		document.getElementById('jd').style.display = 'block';
		document.getElementById('jj').style.display = 'block';
		document.getElementById('wc').style.display = 'block';
	}

	function repairHideJd() {
		document.getElementById('jd').style.display = 'none';
		document.getElementById('jj').style.display = 'block';
		document.getElementById('wc').style.display = 'block';
	}
	
	function showRepaired() {
		document.getElementById('repaired').style.display = 'block';
		document.getElementById('finish').style.display = 'none';
		document.getElementById('rejected').style.display = 'none';
	}
	
	
});