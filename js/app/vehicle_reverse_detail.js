define(['mui', 'mall'], function(mui, $) {
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#refreshList',
			up: getPullupOptions(pullupRefresh)
		}
	});

	var carnum;
	var old_back = mui.back;
	var houseId = '';
	var subweb = '';
	
	
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		

		$.receiveHandler(function(id) {
			//	{{id}}:{{carNum}}:{{enterTime}}:{{leaveTime}}:{{purpose}}:{{mobile}}:{{houseId}} :{{in/out/warn}}
			console.log(id);
			var json = {
				entertime: entertime,
				leavetime: leavetime,
				mobile: mobile,
				purpose: purpose
			}
			
			$.bind(json);
			document.getElementById('carNum').innerText = carnum;
			document.querySelector('.call-owner').setAttribute('tel', mobile);
		}, 'getCarInfo');

	});

	//	拨打业主电话
	$.tapHandler({
		selector: '.call-owner',
		id: 'tel',
		callback: function(id) {
			plus.device.dial(id);
		}
	});
	

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
		
	}

});