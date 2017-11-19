define([], function() {

	var screenWidth;
	var screenHeight;

	var imgHeight;


	var qiu;
	var clip;

	var t = 45;
	var l = 0;



	var qiuTop = -10;
	var qiuLeft = -10;

	var w;
	var h;
	var p;
	
	
	var minW;
	var minH;

	function setClip(json){

		screenWidth = json.screenWidth || plus.display.resolutionWidth;
		screenHeight = json.screenHeight || plus.display.resolutionHeight;
		imgHeight = json.imgHeight || plus.display.resolutionHeight;
		qiu = json.qiu;
		clip = json.clip;
		w = json.w || 50;
		h = json.h || 50;	
		minW = w;
		minH = h;
		p = w / h;		
		start();
		
	}

	function getClip(){

		return {
			top: t - 45,
			left: l,
			width: w,
			height: h
		}
		
	}








	


	function init(clipWidth,clipHeight,clipTop,clipLeft){
		clip.style.width = clipWidth + 'px';
		clip.style.height = clipHeight + 'px';

		clip.style.left = clipLeft + 'px';
		clip.style.top = clipTop + 'px';

		qiu.style.left = clipWidth + qiuLeft + clipLeft + 'px';
		qiu.style.top = clipHeight + qiuTop + clipTop + 'px';
	}

	function start() {

		init(w,h,t,l);

		qiu.addEventListener('touchstart', function (e) {
			e.preventDefault();
		    e.stopPropagation();
		    
			qsX = e.changedTouches[0].clientX;
			qsY = e.changedTouches[0].clientY + 45;
		})

		qiu.addEventListener('touchmove', function (e) {
			e.preventDefault();
		    e.stopPropagation();

		    
		    
			var x = e.changedTouches[0].clientX;
			var y = e.changedTouches[0].clientY + 45;
			
			
			
			if(x < l + minW){
				x = l + minW
			}
			
			if(y < t + minH){
				y = t + minH
			}

				if(w - qsX > h - qsY){
					
					
					if(x > screenWidth || h + t > imgHeight){
						x = screenWidth
					}
					
					



					if(x <= screenWidth && h + t <= imgHeight){
						w = x - l;
						h = w / p;
						
						if(h > imgHeight - t){
							h = imgHeight - t;
							w = h * p;
						}
						init(w,h,t,l);
					}


				}
				
			
		})

		clip.addEventListener('touchstart', function (e) {
		    e.preventDefault();
		    e.stopPropagation();
			
			csX = e.changedTouches[0].clientX - l;
			csY = e.changedTouches[0].clientY - t + 45;
		})

		clip.addEventListener('touchmove', function (e) {
			e.preventDefault();
		    e.stopPropagation();
		    
			var x = e.changedTouches[0].clientX;
			var y = e.changedTouches[0].clientY + 45;
			
			if(x - csX < 0){
				x = csX;
			}
			
			if(x - csX > screenWidth - w){
				x = screenWidth - w + csX;
			}
			
			if(y > imgHeight - h + csY){
				y = imgHeight - h + csY
			}
			
			if(y < 45 + csY){
				y = 45 + csY
			}
			
			
			
			
			
			if(x - csX >= 0 && x - csX <= screenWidth - w){
				if(y - csY + h <= imgHeight && y - csY >= 45){
					l = x - csX ;
					t = y - csY ;
					init(w,h,t,l);
				}
			}
			
		})
	}

	return {
		setClip: setClip,
		getClip: getClip

	}

});