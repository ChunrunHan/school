define(['mui', 'mall'], function(mui, $) {

	mui.init();
	var checkedNum = [];
	
	mui.plusReady(function() {
		webviewInit();

		//	自动刷新
		$.receiveHandler(function(id) {
			checkedNum = [];
			console.log('checkedNum'+checkedNum);
			console.log(typeof checkedNum);
			console.log('id'+id);
			console.log(typeof id);
			if(id != ""){
				var dou = /[,]/
				if(!dou.test(id)){
					console.log(id)
					checkedNum[0] = id;
				}else{
					console.log(id)
					checkedNum = id.split(",");
				}
			}
			console.log('处理完的checkedNum： '+checkedNum)
			getAreaZones();
		}, 'getSelectArea');
		
		// 点击确认选择
		$.tapHandler({
			selector: '.commit-red',
			callback: function() {
				submitSelect();
				return false;
			}
		});

	});

	//获取小区列表
	function getAreaZones() {
		console.log('select zone getAreaZones');
		plus.nativeUI.showWaiting();
		urlBaseP = plus.storage.getItem('urlBaseP');
		var url = urlBaseP + '/seller/list/zones';
		console.log("url: " + url);
		$.get(url).then(function(data) {
			plus.nativeUI.closeWaiting();
			console.log('获取小区列表：' + JSON.stringify(data));
			var go = 0;
			if(data.errCode === 0) {
				document.querySelector('.commit-red').classList.remove('mui-hidden');
				document.querySelector('.search-result').classList.add('mui-hidden');
				$.render('tpl/select_zone_data.html',data).then(function(data) {
				  $.setValue('#zone-list', data);
				  console.log(data)
				  console.log('dddd')
				  go = 1;
				  if(go){
					autoChecked();
				  }
				});
			} else {
				mui.toast('没有关联小区');
				document.querySelector('.search-result').classList.remove('mui-hidden');
				document.querySelector('.commit-red').classList.add('mui-hidden');
			}
			

		}).fail(function(status) {
			console.log('出错了')
			statusHandler(status);
		});
		
		
	}

	//	点击确认选择
	function submitSelect() {
		console.log('submitSelect：');
		var zone = getCheckValue();
		console.log('checkedNum : ' + checkedNum);

		console.log(zone);
		var redpacket = plus.webview.getWebviewById('red_packet_send.html');
		mui.fire(redpacket,'sendArea',{
			zone: zone,
			checkedNum: checkedNum
		})
		checkedNum = [];
		mui.back();
		
	}
	
	//	获得所有选中小区的value
	function getCheckValue(){
		checkedNum = [];
		var allCheckBox = document.getElementsByName('checkbox');
		var checkVal = [];
		var k = 0;
		for(var i=0;i<allCheckBox.length;i++){
			if(allCheckBox[i].checked){
				checkVal[k] = allCheckBox[i].value;
				k++;
				checkedNum.push(i);
			}
		}
		return checkVal;
	}
	
	//	默认选中赋值
	function autoChecked(){
		var num = checkedNum;
		console.log('默认选中的有 : '+num)
		console.log(typeof num)
		if(num != null && num != ''){
			var allCheckBox = document.getElementsByName('checkbox');
			console.log("allCheckBox ： "+allCheckBox)
//			if(num.length > 0){
				for(var i = 0;i < num.length; i++){
					var j = num[i];
					console.log("j: "+ j);
					j = parseInt(j);
					console.log(typeof j)
					var btn = document.getElementsByName('checkbox')[j];
					console.log(btn)
					btn.addEventListener("tap",function () {
					  console.log("tap event trigger");
					  btn.setAttribute('checked','checked');

					});
					mui.trigger(btn,'tap');
					
//				}
			}
		}
	
	}
});