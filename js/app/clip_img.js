define(['mui', 'mall','clipImg'], function(mui, $, clipP) {
	
  mui.init({
    swipeBack: true //启用右滑关闭功能
  });

  mui.plusReady(function() {
    console.log('clip_img plus ready');
    plus.screen.lockOrientation("portrait-primary");
    plus.webview.currentWebview().setStyle({
      scrollIndicator: 'none'
    });

    //  接受传过来的参数
    var self = plus.webview.currentWebview();
    var path = self.path;
    var id = self.idName;
    var filename = self.filename;
    var camera = self.camera;

    //  获得元素
    var qiu = document.getElementById('qiu');
    var clip = document.getElementById('clip');
    var img = document.getElementById('img');

    //  图片显示
    img.setAttribute('src', path);
    plus.nativeUI.closeWaiting();
    plus.webview.currentWebview().show();

    // 获得图片和屏幕的宽度，以及比例
    
//  var imgtemp = new Image();
//		imgtemp.src = img.src;
//  var imgWidth = imgtemp.width;
//  var imgHeight = imgtemp.height;
//  console.log('图片的宽度： ' + imgWidth);
//  console.log('图片的高度： ' + imgHeight);

	 // 获得图片和屏幕的宽度，以及比例
	var imgtemp = new Image();
		imgtemp.src = img.src;
	var imgWidth;
	var imgHeight;
	var proportion;
	console.log('max width'  + imgtemp.width);
		console.log('max height' + imgtemp.height);
		console.log('min width'  + img.width);
		console.log('min height' + img.height);
		console.log(typeof imgtemp.width)
	var displayWidth = plus.display.resolutionWidth;
	var system = plus.os.name;
	console.log(parseInt(camera))
	if(system !== 'Android' && parseInt(camera)==1){
		console.log('camera max width'  + imgtemp.width);
		console.log('camera max height' + imgtemp.height);
		imgWidth = imgtemp.height;
		imgHeight = img.height;
		proportion= getProportion(imgWidth, displayWidth);
	}else{
		if(imgtemp.width == 3264 && imgtemp.height == 2448 && system !== 'Android'){
			console.log('gallery max width'  + imgtemp.width);
			console.log('gallery max height' + imgtemp.height);
			imgWidth = imgtemp.height;
			imgHeight = img.height;
			proportion= getProportion(imgWidth, displayWidth);
		}else{
			console.log('width'  + imgtemp.width);
			console.log('height' + imgtemp.height);
			imgWidth = imgtemp.width;
			imgHeight = img.height;
			proportion = getProportion(imgWidth, displayWidth);	
		}
			
	}
	
//	if(system !== 'Android' && parseInt(camera)==1){
//		console.log('');
//		imgWidth = imgtemp.width;
//		imgHeight = imgtemp.height;
//		proportion= getProportion(imgHeight, displayWidth);
//	}else{
//		imgWidth = imgtemp.width;
//		imgHeight = img.height;
//		proportion = getProportion(imgWidth, displayWidth);
//	}

//	 var imgWidth = img.width;
//	 var imgHeight = img.height;
//	 var displayWidth = plus.display.resolutionWidth;
//	 var proportion = getProportion(imgWidth, displayWidth);
//	
//	 img.setAttribute("width", plus.display.resolutionWidth)
//
//   
    console.log('imgwidth: ' + imgWidth);
    console.log('imgheight: '+imgHeight);
//  
//  img.setAttribute("width", plus.display.resolutionWidth);
    
    
//  var displayWidth = plus.display.resolutionWidth;
//  var proportion = getProportion(imgWidth, displayWidth);
//  var proportionHeight = getProportion(imgHeight, displayWidth);
    
//  console.log("宽度/屏幕宽度" + proportion)
//  img.setAttribute("width", plus.display.resolutionWidth)
//  var maxHeight = imgHeight / proportion + 45;
//  console.log('maxHeight: ' + maxHeight)

/************* start *************/
	var w,h;
	if(id == "red_packet_send.html"){
			w = 90;
			h = 140;
	}else{
		w = h = 50;
	}
	
	console.log('图片高度' + imgHeight)
	clipP.setClip({
			imgHeight: imgHeight + 45,
			qiu: qiu,
			clip: clip,
			w: w,
			h: h
		});	
		
		
//		var imgInfo= clipP.getClip()
//		console.log(JSON.stringify(imgInfo));
/************* end *************/

    //  计算图片和显示屏的比例
    function getProportion(imgW, displayW) {
      return imgW  / displayW;
    }
		
    //移动球
//  qiu.addEventListener('touchmove', function(event) {
//    event.stopPropagation();
//    var clipTop = clip.getAttribute('data-t');
//    var clipLeft = clip.getAttribute('data-l');
//    var clipWidth = clip.getAttribute('data-k');
//    var touch = event.targetTouches[0];
//    var left = touch.pageX > displayWidth ? displayWidth : touch.pageX;
//    var top = touch.pageY >= imgHeight - clipTop ? imgHeight - clipTop : touch.pageY;
//    var imgHeight = img.height;
//
//    if(left > top - 45 - clipTop) {
//      if(left > displayWidth) {
//        clip.style.width = displayWidth - clipLeft + 'px';
//        clip.style.height = clip.style.width;
//        clip.setAttribute('data-k', displayWidth - clipLeft);
//      } else if(clipWidth > imgHeight - clipTop) {
//        clip.style.width = imgHeight - clipTop + 'px';
//        clip.style.height = clip.style.width;
//        clip.setAttribute('data-k', imgHeight - clipTop);
//      } else {
//        clip.style.width = left - clipLeft + 'px';
//        clip.style.height = clip.style.width;
//        clip.setAttribute('data-k', left - clipLeft);
//      }
//
//    } else {
//      if(top - 45 - clipTop > displayWidth) {
//        clip.style.width = displayWidth - clipLeft + 'px';
//        clip.style.height = clip.style.width;
//        clip.setAttribute('data-k', displayWidth - clipLeft);
//      } else if(clipWidth > imgHeight - clipTop) {
//        clip.style.width = imgHeight - clipTop + 'px';
//        clip.style.height = clip.style.width;
//        clip.setAttribute('data-k', imgHeight - clipTop);
//      } else {
//        clip.style.width = top - 45 - clipTop - clipLeft + 'px';
//        clip.style.height = clip.style.width;
//        clip.setAttribute('data-k', top - 45 - clipTop - clipLeft);
//      }
//
//    }
//
//  });
//
//  //  移动白色裁剪框
//  clip.addEventListener('touchstart', function(event) {
//    var touch = event.targetTouches[0];
//    borderLeft = touch.pageX - clip.offsetLeft;
//    borderTop = touch.pageY - clip.offsetTop;
//  });
//
//  clip.addEventListener('touchmove', function(event) {
//    event.preventDefault();
//    event.stopPropagation();
//    var touch = event.targetTouches[0];
//    var left = touch.pageX - borderLeft;
//    var top = touch.pageY - borderTop;
//    var clipWidth = clip.getAttribute('data-k');
//    var clipLeft = parseInt(clip.style.left);
//    var clipTop = parseInt(clip.style.top);
//    var imgHeight = img.height;
//
//    //left
//    if(left < 0) {
//      clip.style.left = '0px';
//      clip.setAttribute('data-l', 0);
//    } else if(left > displayWidth - clipWidth) {
//      clip.style.left = displayWidth - clipWidth + 'px';
//      clip.setAttribute('data-l', displayWidth - clipWidth + 'px');
//    } else {
//      clip.style.left = left + 'px';
//      clip.setAttribute('data-l', left);
//    }
//
//    //top
//    if(top < 0) {
//      clip.style.top = '0px';
//      clip.setAttribute('data-t', 0);
//    } else if(top > imgHeight - clipWidth) {
//      clip.style.top = imgHeight - clipWidth + 'px';
//      clip.setAttribute('data-t', imgHeight - clipWidth + 'px');
//    } else {
//      clip.style.top = top + 'px';
//      clip.setAttribute('data-t', top);
//    }
//
//  });

    mui('#header').on('tap', '#save', clipImg);

    function clipImg() {
      mui('#header').off("tap", '#save', clipImg);
      
			var imgInfo= clipP.getClip()
			console.log(JSON.stringify(imgInfo));
			
//		var height = imgInfo.height * proportion + 'px';
//    	var width = imgInfo.width * proportion + 'px';
//    	var top =  imgInfo.top * proportion + 'px';
//    	var left = imgInfo.left * proportion + 'px';

		var height = imgInfo.height * proportion + 'px';
      	var width = imgInfo.width * proportion + 'px';
      	var top =  imgInfo.top * proportion + 'px';
      	var left = imgInfo.left * proportion + 'px';
	
      console.log('比例' + proportion)
      console.log(height +","+ width +","+ top +"," + left)
      switch(id) {
        case 'user_edit.html':
          doit = 'userEditClip';
          break;

      }
      var view = plus.webview.getWebviewById(id);
//      alert(id);
//      alert('裁剪的值：' + top + ';' + left + ';' + width + filename + path);
      mui.fire(view, doit, {
        path: path,
        filename: filename,
        top: top,
        left: left,
        width: width,
        height: height
      });
      mui.back();
      
    }

  });

});