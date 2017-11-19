define(['mui', 'mall'], function(mui, $) {
			mui.init({
				swipeBack: true, //启用右滑关闭功能
				beforeback: function() {
					pickerBlur();
					return true;
				}
			});

			mui.plusReady(function() {
					plus.screen.lockOrientation("portrait-primary");
					
					
					var dtpicker = new mui.DtPicker({
					    type: "datetime",//设置日历初始视图模式 
					    beginDate: new Date(2015, 04, 25),//设置开始日期 
					    endDate: new Date(2016, 04, 25),//设置结束日期 
					    labels: ['Year', 'Mon', 'Day', 'Hour', 'min'],//设置默认标签区域提示语 
					    customData: { 
					        h: [
					            { value: 'AM', text: 'AM' },
					            { value: 'PM', text: 'PM' }
					        ] 
					    }//时间/日期别名 
					}) 
					

					//	时间picker
//					var myTimer = new Date();
//					var currentYear = myTimer.getFullYear();
//					var currentMonth = myTimer.getMonth() + 1;
//					var currentDate = myTimer.getDate();
//					var year = new Date().getFullYear();
//					var month = new Date().getMonth() + 1;
//					var day = new Date().getDate();
//
//					var timePicker = new mui.DtPicker({
//						type: "Datetime",
//						beginYear: currentYear,
//						endYear: currentYear
//					});

					var timeStartPicker = document.getElementById('demo1');
					//	开始时间选择处理
					timeStartPicker.addEventListener('tap', function(event) {
//						console.log('你点击了开始时间');
//						pickerBlur();
//						timePicker.show(function(items) {
//							var startTime = items.y.text + "-" + items.m.text + "-" + items.d.text + " " + items.h.text + ":" + items.i.text;
//							document.getElementById('serviceStart').value = startTime;
//
//						})
						dtpicker.show(function(e) {
					 	   console.log(e);
						}) 

					});
				});

			});