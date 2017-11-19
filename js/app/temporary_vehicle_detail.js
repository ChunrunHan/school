define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#refreshList',
			up: getPullupOptions(pullupRefresh)
		}
	});

	var page = 0;
	var size = 20;
	var carnum;
	var oldHtml = '';
	var newhtml = '';
	var old_back = mui.back;
	var houseId = '';
	var subweb = '';
	
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		

		$.receiveHandler(function(id) {
			//			{{id}}:{{carNum}}:{{enterTime}}:{{leaveTime}}:{{purpose}}:{{mobile}}:{{houseId}} :{{in/out/warn}}
			console.log(id);
			id = id.split(',');
			console.log(id[1]);
			carnum = id[1];
			var entertime = id[2];
			var leavetime = id[3];
			leavetime = parseInt(leavetime);
			leavetime = formatDate(leavetime);
//			alert(leavetime);
			var purpose = purposeText(id[4]);
			var mobile = id[5];
			houseId = id[6];
			subweb = id[7];
//			alert(subweb);
			var json = {
				entertime: entertime,
				leavetime: leavetime,
				mobile: mobile,
				purpose: purpose

			}
			if(houseId != ""){
				document.getElementById('ownershow').style.display = 'block';
				getHouseByid(houseId);
			}else{
				document.getElementById('ownershow').style.display = 'none';
			}
			//	滚动区域的top值
			var scrollTop = document.getElementById('intop').offsetTop;
//			alert(scrollTop + 35);
			document.getElementById('refreshList').style.top = scrollTop + 35 + 'px';
			
			$.bind(json);
			document.getElementById('carNum').innerText = carnum;
			document.querySelector('.call-owner').setAttribute('tel', mobile);
			page = 0;
			getAllRecord(carnum, page, size, true)
		}, 'showCarInfo');

	});

	//	拨打业主电话
	$.tapHandler({
		selector: '.call-owner',
		id: 'tel',
		callback: function(id) {
			plus.device.dial(id);
		}
	});

	//	上拉加载
	function pullupRefresh() {
		page++;
		//		mui.toast('上拉加载啊')
		carnum = carnum;
		getAllRecord(carnum, page, size, true);
	}

	//	获取记录
	function getAllRecord(carnum, page, size, isUp) {
		plus.nativeUI.showWaiting();
		zoneId = plus.storage.getItem('zoneId');
		console.log("carnum: " + carnum);
		carnum = encodeURIComponent(carnum);
		urlBaseP = plus.storage.getItem('urlBaseP');
		//		var url = urlBaseP + "/ipms/" + zoneId + "//////" + carnum +"/"+ priorityId +"///list/IORecord/car/" + page + "/" + size;
		var url = urlBaseP + "/ipms///////" + carnum + "////list/IORecord/car/" + page + "/" + size;
		console.log(url);
		$.get(url).then(function(data) {
			console.log('getAllRecord ' + JSON.stringify(data));
			plus.nativeUI.closeWaiting();
			if(data.errCode == 0) {
				document.querySelector('.search-result').classList.add('mui-hidden');
				mui.each(data.dataList, function(index, item) {
					item.recordTime = formatDate(item.recordTime);
					console.log(item.passed);
					console.log(typeof item.passed);
					var pass = item.passed
					if(pass) {
						item.parkingZoneName = 'images/pass.svg';
					} else {
						item.parkingZoneName = 'images/reject.svg';
					}
				})
				return $.render('tpl/inout_record_data.html', data);
			} else {
				if(isUp === true) {
					mui.toast('没有更多数据了');
					showTag('.zone-area li');
				} else {
					document.querySelector(".zone-area").innerHTML = '';
					document.querySelector('.search-result').classList.remove('mui-hidden');
				}
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
			//			console.log(newhtml);

			$.setValue('.zone-area', newhtml);

			plus.nativeUI.closeWaiting();
		}).fail(function(status) {
			stopDownRefresh('#refreshList', isUp);
			console.log('获取进出列表' + status);
			statusHandler(status);
		});

	}
	
	function getHouseByid(id){
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/admin/house/' + id;
		console.log(url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('getHouseByid ' + JSON.stringify(data));
			var house = data.building +'-' + data.unit + '-' + data.floor + '-'+ data.room;
			document.getElementById('owner').value = house;
		}).fail(function(status){
			console.log('获取房屋' + status);
			statusHandler(status);
		})

	}
	

	function purposeText(num) {
		var num = parseInt(num);
		var reasonName;
		switch(num) {
			case 1:
				reasonName = '走亲访友';
				break;
			case 2:
				reasonName = '维修装修';
				break;
			case 3:
				reasonName = '家政保洁';
				break;
			case 4:
				reasonName = '快递外卖';
				break;
			case 5:
				reasonName = '其他';
				break;
		}
		return reasonName;
	}

	mui.back = function() {
		oldHtml = '';
		newhtml = '';
		document.querySelector('.zone-area').innerHTML = '';
		var sub;
		switch(subweb){
			case 'in':
				subweb = 'showin';
				break;
			case 'out':
				subweb = 'showout';
				break;
			case 'warn':
				subweb = 'showwarn';
				break;
		}
		sub = plus.webview.getWebviewById('temporary_vehicle.html');
		mui.fire(sub, subweb);
		old_back();
	}

});