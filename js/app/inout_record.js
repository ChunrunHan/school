define(['mui', 'mall'], function(mui, $) {

	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#refreshList',
			up: getPullupOptions(pullupRefresh)
		}
	});
	
	var carnum = '';
	var priorityId = 0;
	var priorityName = '全部车辆'
	var page = 0;
	var size = 20;
	var oldHtml = '';
	var newhtml = '';
	var old_back = mui.back;
	mui.plusReady(function() {
		webviewInit();

		$.receiveHandler(function() {
			priorityId = 0;
			document.getElementById('selectMode').value = "全部车辆";
			page = 0;
			getAllRecord(page, size, true);
		}, 'getAllcar');
		
		//	推送获取
		window.addEventListener('getPush', function() {
			priorityId = 0;
			document.getElementById('selectMode').value = "全部车辆";
			page = 0;
			getAllRecord(page, size, true);
		});
		
		//	车牌号选择
		var picker = new mui.PopPicker({
			buttons: ['取消', '确认']
		})
		picker.setData(carList);

		var select = document.getElementById('selectCity');
		select.addEventListener('tap', function(event) {
			mui('#refreshList').pullRefresh().disablePullupToRefresh();
			picker.show(function(item) {
				console.log(item[0].text);
				document.getElementById('selectCity').value = item[0].value;
			})

		},false);
		
		var html = document.querySelector('html');
		html.addEventListener('tap', function(event) {
			mui('#refreshList').pullRefresh().enablePullupToRefresh();
			mui('#refreshList').pullRefresh().refresh(true);
		},true);
		
		
		
		
		
		//	选择车辆进出类型
		$.tapHandler({
			selector: '#selectMode',
			callback: function() {
				pickerBlur();
				mui('#sheet1').popover('toggle');
			}
		});
		//	车辆类型显示
		$.tapHandler({
			selector: '.priority-list',
			id: 'priority',
			callback: function(id) {
				console.log(id);
				priorityId = parseInt(id);
				switch(priorityId){
					case 0:
						priorityName = '全部车辆';
						break;
					case 1:
						priorityName = '允许通行';
						break;
					case 2:
						priorityName = '禁止通行';
						break;
				}
			    document.getElementById('selectMode').value = priorityName;
				mui('#sheet1').popover('toggle');
			}
		});
		
		//	点击搜索
		$.tapHandler({
			selector: ".search-btn",
			callback: function() {
				console.log('点击搜索')
				oldHtml = '';
				newhtml = '';
				carnum = document.getElementById('carnum').value;
				if(carnum != ''){
					var city = document.getElementById('selectCity').value; 
					carnum = city + carnum;
					carnum = carnum.toUpperCase();
					var re=/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
					if(!re.test(carnum)){
						mui.toast('请输入正确的车牌号');
						return;
					}else{
						carnum = encodeURIComponent(carnum);
					}
					
				}else{
					carnum = '';
				}
				page = 0;
				getAllRecord(page, size, true);
			
			}
		})

	});

	//	上拉加载
	function pullupRefresh() {
		page++;
//		mui.toast('上拉加载啊')
		getAllRecord(page, size, true);
	}

	//	获取记录
	function getAllRecord(page, size, isUp) {
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		console.log("carnum: " + carnum);
		urlBaseP = plus.storage.getItem('urlBaseP');
//		var url = urlBaseP + "/ipms/" + zoneId + "//////" + carnum +"/"+ priorityId +"///list/IORecord/car/" + page + "/" + size;
		var url = urlBaseP + "/ipms/"+ zoneId +"//////" + carnum +"/"+ priorityId +"///list/IORecord/car/" + page + "/" + size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('getAllRecord ' + JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.errCode == 0) {
				console.log('搜索成功');
				document.querySelector('.search-result').classList.add('mui-hidden');
				mui.each(data.dataList, function(index, item) {
					item.recordTime = formatDate(item.recordTime);
					console.log(item.passed);
					console.log(typeof item.passed);
					var pass = item.passed;
					if(pass) {
						item.parkingZoneName = 'images/pass.svg';
					} else {
						item.parkingZoneName = 'images/reject.svg';
					}
					console.log(item.image);
					if(item.image == undefined || item.image == ''){
						item.image = 'null';
					} else {
						item.image = 'http://data.ipms.yezhubao.net/'+ item.cameraSn + '/' + encodeURI(item.image);
					}
				})
				return $.render('tpl/inout_record_data.html', data);
			} else if(data.errCode === 9){
//				alert('没数据')
				if(isUp === true) {
					mui.toast('没有更多数据了');
				}
				showDomTag('.zone-area li','.search-result');
				return;
			}

		}).then(function(html) {
			if(isUp === true) {
				if(html == undefined) {
					html = '';
				}
				newhtml = oldHtml + html;
				mui('#refreshList').pullRefresh().endPullupToRefresh(false);
			}
			
			oldHtml = newhtml;
			if(!newhtml || !oldHtml) {
				newhtml = '';
			}
			
//			console.log(newhtml)
			$.setValue('.zone-area', newhtml);
			
			$.tapHandler({
				selector: '.zone-area li',
				id: 'image',
				callback: function(id){
//					alert(id);
//					alert(typeof id);
					id = id.split(',');
					console.log(id[1]);
					if(id[1] != 'null'){
						goSeeImg(id[1]);
						
					}else{
						mui.toast('当前没有'+id[0]+'图片');
					}
				}
			});
			
			if(newhtml == ''){
				showDomTag('.zone-area li','.search-result');
			}

			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#refreshList', isUp);
			console.log('获取进出列表' + status);
			statusHandler(status);
			if(status == 204){
				showDomTag('.zone-area li','.search-result');
			}
		});

	}
	
	mui.back = function(){
		document.querySelector(".zone-area").innerHTML = '';
		document.getElementById('carnum').value = '';
		oldHtml = '';
		newhtml = '';
		carnum = '';
		priorityId = 0;
		priorityName = '全部车辆';
		page = 0;
		size = 20;
		old_back();
	}
	
	//	点击li显示图片
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

});