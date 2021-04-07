var MOBANTU = {
	paged: 1,
	lazy: 0,
	ias: 0,
	mpf: 0,
	mbf: 0,
	mpfp: 0,
	water: 0,
	body: jQuery("body"),
	bodywid: jQuery(window).width(),
	init: function(obj){
		var that = this;
		that.lazy = obj.lazy;
		that.ias = obj.ias;
		that.water = obj.water;
		that.mbf = obj.mbf;
		that.mpf = obj.mpf;
		that.mpfp = obj.mpfp;
		that.other();
		that.scroll();
		if(that.body.hasClass("page-template-waterfall")){
			that.water = 1;
			that.ias = 1;
			that.lazy = 0;
		}
		if(that.lazy) that.lazyload();
		if(that.ias) that.iasLoad();
		that.catFilter();
		that.video();
		that.audio();
		if(!that.body.hasClass("logged-in")){
			that.login();
		}
		if(that.body.hasClass("page-template-tougao")){
			that.tougao();
		}
		that.sidebar();
		if(that.body.hasClass("page") || that.body.hasClass("single")){
			that.comment();
			that.singular();
			that.share();
		}
	},
	other: function(){
		var that = this;
		var bodyWidth = jQuery(window).width();

		jQuery(window).resize(function(event) {
		    bodyWidth = jQuery(window).width();
		});

		jQuery('.fullscreen').click(function(){
			that.fullScreen();
			jQuery(this).toggleClass('active');
		});

		if(jQuery('.counter').length){
			jQuery('body').running();
		}

		jQuery(".page-jump").click(function(){
			var num = jQuery("#jump_page").val();
		    if(/^\d+$/.test(num) && num>0){
		        if (window.location.href.indexOf("?") != -1) {  
		            location.href=window.location.href+'&paged='+num;
		        }else{
		            location.href=window.location.href+'?paged='+num;
		        }
		    }
		});

		jQuery(".footer-fixed-nav .footer-nav-trigger").click(function(){
			if(jQuery(this).hasClass("active")){
				jQuery(this).removeClass("active");
				jQuery(".footer-fixed-nav").css("height","45px");
				jQuery.cookie('mbt_footer_nav', '0', {path: '/'});
			}else{
				jQuery(this).addClass("active");
				jQuery(".footer-fixed-nav").css("height","0px");
				jQuery.cookie('mbt_footer_nav', '1', {path: '/'});
			}
		});

		jQuery('.theme_night').on('click', function () {
	        if (!that.body.hasClass('night')) {
	            jQuery.cookie('mbt_theme_night', '1', {path: '/'});
	            that.body.addClass('night');
	            jQuery(this).addClass('active');
	        } else {
	            jQuery.cookie('mbt_theme_night', '2', {path: '/'});
	            that.body.removeClass('night');
	            jQuery(this).removeClass('active');
	        }
    	});

		jQuery(".search-loader").click(function(){
			jQuery(".search-wrap").addClass('show');
			jQuery(".search-input").focus();
			jQuery(".search-wrap .icon").click(function(){
				jQuery(".search-wrap").removeClass('show');
			});
		});

		jQuery(".nav-loader").click(function(){
			if(!jQuery(".header").hasClass("nav-mobile-show")){
				jQuery(".header").append('<div class="nav-mobile-show-mask"></div>');
			}else{
				jQuery(".nav-mobile-show-mask").remove();
			}
			jQuery(".header").toggleClass('nav-mobile-show');
			jQuery('body,html').toggleClass('noscroll');
			jQuery(".nav-mobile-show-mask").click(function(){
				jQuery(".header").removeClass("nav-mobile-show");
				jQuery(".nav-mobile-show-mask").remove();
				jQuery('body,html').removeClass('noscroll');
			});
		});

		if(bodyWidth <= 768){
			if(jQuery(".nav-main .mega4").length){
				jQuery(".nav-main .mega4").removeClass('mega4');
			}
			if(jQuery(".nav-main .mega3").length){
				jQuery(".nav-main .mega3").removeClass('mega3');
			}
			if(jQuery(".nav-main .mega2").length){
				jQuery(".nav-main .mega2").removeClass('mega2');
			}
			jQuery(".menu-item-has-children > a").each(function(){
				jQuery(this).append('<span class="explose"><i class="icon icon-arrow-down"></i></span>');
				jQuery(this).find('.explose').click(function(){
					console.log(1);
					jQuery(this).find(".icon").toggleClass("icon-arrow-up");
					var sub = jQuery(this).parent().next();
					if(sub.hasClass("show")){
						sub.removeClass("show");
					}else{
						sub.addClass("show");
					}
					return false;
				});
			});
		}

		if(jQuery(".nav-main .mega4").length){
			jQuery(".nav-main > li.mega4 > .sub-menu > li").hover(function(){
				jQuery(".nav-main > li.mega4 > .sub-menu > li").addClass('mg-hide');
				jQuery(this).removeClass('mg-hide').addClass('mg-show');
			},function(){
				jQuery(".nav-main > li.mega4 > .sub-menu > li").removeClass('mg-hide').removeClass('mg-show');
			});
		}

		if(that.body.hasClass("logged-in")){
			var clipboard_aff = new Clipboard(".article-aff");
			clipboard_aff.on("success", function(e) {
				layer.msg("已复制推广链接",{time:500});
			});
		}else{
			jQuery(".article-aff").click(function(){
				layer.msg("请先登录后才能生成推广链接哦~");
			});
		}

		jQuery(".vmenu-trigger").click(function() {
			jQuery(this).toggleClass("active"),
			jQuery(".videos-menu").toggleClass("active");
		});

		if(jQuery(".videos-menu")){
			jQuery(".vmenu-trigger").addClass("active");
			jQuery(".videos-menu").addClass("active");
			setTimeout(function(){
				jQuery(".vmenu-trigger").removeClass("active");
				jQuery(".videos-menu").removeClass("active");
			},3000);
		}

		if(jQuery(".mocat .waterfall").length){
			jQuery(".mocat .waterfall").each(function(){
				var id = jQuery(this).parent().parent().attr('id');
				var grids = document.querySelector('#'+id+' .waterfall');
				imagesLoaded( grids, function() {
				    var msnry = new Masonry( grids, {
				      itemSelector: '.grid',
				      visibleStyle: { transform: 'translateY(0)', opacity: 1 },
						  hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
				    });
				});
			});
		}

		if(jQuery(".ckplayer-video-real").length){
			jQuery(".ckplayer-video-real").bind('contextmenu',function() { return false; });
			jQuery(".ckplayer-video-real").each(function(){
				var conv = jQuery(this).data("video")
					conn = jQuery(this).data("nonce");
		        new ckplayer({
		            container:"#ckplayer-video-"+conn,
		            variable:"player",
		            autoplay:false,
		            video:conv
		        });
			});
		}

		if(jQuery(".dplayer-video-real").length){
			jQuery(".dplayer-video-real").bind('contextmenu',function() { return false; });
			jQuery(".dplayer-video-real").each(function(){
				var conv = jQuery(this).data("video")
					conn = jQuery(this).data("nonce");
		        new DPlayer({
				    container: document.getElementById("dplayer-video-"+conn),
				    screenshot: true,
				    video: {
				        url: conv,
				        pic: '',
				        thumbnails: '',
				    }
				});
			});
		}

		if(jQuery(".single-related .waterfall").length){
			var grids = document.querySelector('.single-related .waterfall');
			imagesLoaded( grids, function() {
			    var msnry = new Masonry( grids, {
			      itemSelector: '.grid',
			      visibleStyle: { transform: 'translateY(0)', opacity: 1 },
					  hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
			    });
			});
		}
		

		jQuery(".totop").click(function(){
			that.scrollTo();
		});

		jQuery(".tocomm").click(function(){
			that.scrollTo('#respond',-140);
		});

		jQuery(".btn-vip-action").click(function(){
			var currbtn = jQuery(this);
			layer.open({
			  title: '提示',
			  content: '确认升级VIP？',
			  yes: function(index, layero){
			  	layer.close(index);
				if(!currbtn.hasClass("disabled")){	
					currbtn.addClass("disabled");
					var msgTips = layer.msg('升级中...');
					jQuery.post(
					_MBT.uri+'/action/user.php',
					{
						userType: currbtn.data("type"),
						action: "user.vip"
					},
					function (data) {
						layer.close(msgTips);
						currbtn.removeClass("disabled");
						if( data.error ){
							if( data.msg ){
								if(data.error == 2){
									layer.open({
									  title: '提示',
									  content: '余额不足，现在去充值？',
									  yes: function(index, layero){
									    location.href=data.link;
									  }
									});
								}else if(data.error == 3){
									layer.open({
									  type: 1,
									  skin: 'layui-layer-dialog',
									  title: '选择支付方式',
									  content: data.payment
									});
									jQuery('body').on("click",".erphpdown-type-link",function(){
										layer.closeAll();
									});
									jQuery('body').on("click",".erphpdown-type-credit",function(){
										layer.msg('升级中...');
										jQuery.post(
										_MBT.uri+'/action/user.php',
										{
											userType: jQuery(this).data("type"),
											action: "user.vip.credit"
										},
										function (data) {
											if( data.error ){
												if( data.msg ){
													if(data.error == 2){
														layer.open({
														  title: '提示',
														  content: '余额不足，现在去充值？',
														  yes: function(index, layero){
														    location.href=data.link;
														  }
														});
													}else{
														layer.msg(data.msg);
													}
												}
												return false;
											}
											layer.msg('恭喜您，升级VIP成功～');
										},'json');
									});
								}else{
									layer.msg(data.msg);
								}
							}
							return false;
						}
						layer.msg('恭喜您，升级VIP成功～');
					},'json');
				}
			  }
			});
			return false;
		});

		jQuery(".day-checkin").click(function(){
			var that = jQuery(this);
			if(that.hasClass("active")){
				layer.msg("您今天已经签过到了，明儿再来哦～");
				return false;
			}
			if(!that.hasClass('disabled')){
				that.addClass("disabled");
				jQuery.ajax({  
					type: 'POST',  
					url:  _MBT.uri+'/action/user.php',
					dataType: 'json',
					data: {
						action: 'user.checkin',
					},
					success: function(data){  
						if( data.error ){
							if( data.msg ){
								layer.msg(data.msg)
							}
							return
						}
						layer.msg('恭喜您，签到成功～');
						that.addClass('active');
					}  

				});
			}
			
			return false;
		});

		if(document.cookie.indexOf("sitetips=") == -1){
			jQuery(".sitetips").fadeIn();
		}

		jQuery(".sitetips .close").click(function(){
			jQuery(".sitetips").fadeOut();
			jQuery.cookie('sitetips', '1', { expires: 3, path: '/'});
		});

	},
	audio: function(){
		var that = this;
		jQuery(function($){
            function audiosInit($playBtn,$waveLength) {
                var oldPlayItem = null,
                hasOtherPlay = false,
                isDetailPage = false;
	            var timeTip = document.createElement('p');
	            timeTip.className = 'timeTip';
                $playBtn.each(function (i, ele) {
                    var that = this,
                        $this = $(this);
                    this.isPlay = true;
                    this.showTime = 0;
                    this.first = true;
                    this.$thisAudio = $this.parent().find('audio');
                    this.audio = this.$thisAudio.get(0);

                    this.$toTime = this.$thisAudio.data("time");
                    //this.$toTime = Math.ceil(this.audio.duration);
                    this.pgBar = $this.siblings('.time-bar').get(0);
                    this.pgBar.pgBarClientLeft = this.pgBar.getBoundingClientRect().left;
                    this.pgBar.audio = this.audio;
                    this.pgBar.$toTime = this.$toTime;
                    this.pgBar.timeTip = timeTip;
                    this.pgBar.audioBox = $this.parent().get(0);
                    // this.pgBar.toParLeft = $(this.pgBar).position().left;
                    this.pgBar.toParLeft = this.pgBar.pgBarClientLeft -  this.pgBar.audioBox.getBoundingClientRect().left;
                    // console.log('this.pgBar.toParLeft=',this.pgBar.toParLeft);
                    that.$curTime = $this.parent().find('.star-time');
                    that.$moveColor = $this.parent().find('.time-bar').find('.move-color');
                    that.$rotateImg = $this.parent().parent().find('.souse-img');

                    if ($this.parents('.work-info-wrap').length > 0) {
                        $waveLength = parseInt( $(this.pgBar).css('width'));
                    }
                    if($this.parents('.detail-style').length > 0) {
                        $waveLength = parseInt($(this.pgBar).css('width'));
                    }
                    that.t = TweenMax.to(that.$moveColor, that.$toTime, {
                                width: $waveLength,
                                ease: Linear.easeNone,
                                onComplete: function () {
                                    that.$moveColor.css('width', 0);
                                }
                            });
                    that.t.pause();
                    that.audio.onended = function () {
                        clearInterval(that.$audioInterval);
                        that.t.seek(that.$toTime);
                        that.$moveColor.css('width', 0);
                        that.$curTime.text('00:00');
                        $(that).removeClass('on');
                        if($($playBtn).parents('.audio-bodyBg').length);
                        $('.gp').removeClass('skewing'); 
                        $('.guxz').removeClass('xuanz'); 
                        that.$rotateImg.removeClass('running');
                        that.isPlay = true;
                        hasOtherPlay = false;
                        that.first = true;
                    }
                 
                    this.pgBar.onmouseover = function (e) {
                        this.audioBox.appendChild(countTips(e, this));
                        this.onmousemove = function (e) {
                            countTips(e, this);
                        };
                        // this.onmouseout = function () {
                        //     this.audioBox.removeChild(this.timeTip);
                        // }
                        this.onclick = function (e) {
                            var willTo = Math.round((e.clientX - this.pgBarClientLeft) / $waveLength * this.$toTime);
                            that.t.seek(willTo);
                            this.audio.currentTime = willTo;
                            if (this.audio.paused) {
                                that.t.resume();
                                this.audio.play();
                                doPlay(that);
                                window.onblur = function () {
                                    doPause(that);
                                    that.isPlay = true;
                                }
                                that.isPlay = !that.isPlay;
                            }
                        };

                        function countTips(e, that) {
                            var $that = $(that);
                            if ($that.parents('.work-info-wrap').length > 0) {
                                $waveLength = parseInt( $that.css('width'));
                            }
                            if($that.parents('.detail-style').length > 0) {
                                $waveLength = parseInt($that.css('width'));
                            }
                        
                            that.pgBarClientLeft=that.getBoundingClientRect().left;
                            that.toParLeft=that.pgBarClientLeft - that.audioBox.getBoundingClientRect().left;
                            var willTo = Math.round((e.clientX - that.pgBarClientLeft) / $waveLength * that.$toTime);
                            var minute = willTo / 60;
                            var second = willTo % 60;
//                             if (second <= 9) {
//                                 that.timeTip.innerHTML = parseInt('0' + minute) + ":" + '0' + second;
//                             } else {
//                                 that.timeTip.innerHTML = parseInt('0' + minute) + ":" + second;
//                             }
//                             that.timeTip.style.left = e.clientX - that.pgBarClientLeft + that.toParLeft - 15 + 'px';
// //                            console.log(e.clientX,that.pgBarClientLeft,that.toParLeft);
                            return that.timeTip;
                        }
                    }
                    function doPlay(that) {
                        if (hasOtherPlay || oldPlayItem != that) {
                            if (oldPlayItem) {
                                var $old = $(oldPlayItem);
                                clearInterval(oldPlayItem.$audioInterval);
                                oldPlayItem.$rotateImg.removeClass('running');
                                oldPlayItem.$thisAudio.get(0).pause();
                                oldPlayItem.t.pause();
                                $old.removeClass('on');
                                if($($playBtn).parents('.audio-bodyBg').length); 
                                $('.gp').removeClass('skewing'); 
                                $('.guxz').removeClass('xuanz');
                                oldPlayItem.isPlay = true;
                            }
                        }
                        that.$rotateImg.addClass('running');
                        $this.addClass('on');
                       if($($playBtn).parents('.audio-bodyBg').length) ;
                       $('.gp').addClass('skewing'); 
                       $('.guxz').addClass('xuanz');
                        that.$audioInterval = setInterval(function () {
                            fun(that);
                        }, 500);
                        hasOtherPlay = true;
                        oldPlayItem = that;
                    }
                    function fun(audio) {
                        audio.showTime = Math.floor(audio.$thisAudio.get(0).currentTime);
                        // var minute = audio.showTime / 60;
                        // var second = audio.showTime % 60;
                        // if (audio.showTime <= 9) {
                        //     audio.$curTime.text(parseInt('0' + minute) + ":" + '0' + second)
                        // } else {
                        //     audio.$curTime.text(parseInt('0' + minute) + ":" + second)
                        // }
                        var minute = Math.floor(audio.showTime / 60);
                        var second = Math.round(audio.showTime % 60);
                        if (minute <= 9) {
                            minute = '0' + minute;
                        }
                        if (second <= 9) {
                            second = '0' + second;
                        }

                        audio.$curTime.text(minute + ":" + second);
                    }
                    function doPause(that) {
                        clearInterval(that.$audioInterval);
                        that.$rotateImg.removeClass('running');
                        that.pauseTime = that.audio.currentTime;
                        that.audio.pause();
                        that.t.pause();
                        $this.removeClass('on');
                       if($($playBtn).parents('.audio-bodyBg').length);
                        $('.gp').removeClass('skewing'); 
                        $('.guxz').removeClass('xuanz');
                        hasOtherPlay = false;
                    }
                    $(this).off('click').click(function () {
                        var $this = $(this),
                            that = this;
                        if (this.isPlay) {
                            if (that.first) {
                                if (that.t.progress() == 1) {
                                    that.t.progress(0);
                                }
                                that.t.resume();

                                window.onblur = function () {
                                    doPause(that);
                                    that.isPlay = true;
                                }

                                if (that.first && that.$toTime < 5) {
                                    setTimeout(function () {
                                        that.audio.play();
                                    }, 300);
                                } else {
                                    that.audio.play();
                                }
                                that.first = false;
                            } else {
                                that.t.resume(that.pauseTime);
                                that.audio.play();
                            }
                            doPlay(that);
                        } else {
                            doPause(that);
                        }
                        this.isPlay = !this.isPlay;
                  

                    })
                });
            }
		   //音频播放方法调用
		    audiosInit($('.audio .audio-play'),parseInt($('.audio .time-bar').css('width')));
		    window.onresize = function () {
		        audiosInit($('.audio .audio-play'),parseInt($('.audio .time-bar').css('width')));
		    }
		});
	},
	video: function(){
		var that = this;
		jQuery(".grids .grid-vd").each(function(){
			var video = jQuery(this).data('video');
			var id = jQuery(this).data('id');
			var myVid = document.getElementById('video-' + id);
			var picwidth = jQuery(this).find('.thumb')[0].getBoundingClientRect().width;
			var picheight = jQuery(this).find('.thumb')[0].getBoundingClientRect().height;
			jQuery(this).hover(function(){
				if(video){
					jQuery(this).find('.grid-video').height(picheight);
					jQuery(this).find('.video-icon').hide();
					jQuery(this).find('.thumb').hide();
					if(jQuery(this).find('video').length){
						jQuery(this).find('video').attr('src', video);
						jQuery(this).find('.grid-video').show();
						myVid.muted=false;
						myVid.play();
					}else if(jQuery(this).find('iframe')){
						jQuery(this).find('iframe').attr('src', video);
						jQuery(this).find('.grid-video').show();
					}
				}
			},function(){
				if(video){
					jQuery(this).find('.thumb').show();
					jQuery(this).find('.video-icon').show();
					jQuery(this).find('.grid-video').hide();
					if(jQuery(this).find('video').length){
						myVid.pause();
						jQuery(this).find('video').attr('src', '');
					}else if(jQuery(this).find('iframe')){
						jQuery(this).find('iframe').attr('src', '');
					}
				}
			});
		});
	},
	tougao: function(){
		var that = this;
		jQuery("#start_down2").on("click",function(){
			jQuery(".tougao-item-erphpdown").show();
		});

		jQuery("#start_see2, #start_see1").on("click",function(){
			jQuery(".tougao-item-erphpdown").hide();
			jQuery(".tougao-item-erphpdown-see").show();
		});

		jQuery("#start_down1").on("click",function(){
			jQuery(".tougao-item-erphpdown").hide();
		});

		jQuery(".tougao-select #cat").change(function(){
			var cid = jQuery(this).find("option:selected").attr("value");
			if(cid){
				jQuery.post(
					_MBT.uri+'/action/user.php',
					{
						action: 'tougao.tax',
						cat: cid
					},
					function (data) {
						jQuery(".tougao-tax").html(data);
					}
				);
			}else{
				jQuery(".tougao-tax").html('');
			}
			return false;
		});

		var upImagec = 1
		jQuery(".tougao-upload").click(function(){
			if(jQuery("#imageForm").length){
				jQuery("#imageFile").trigger('click');
		        jQuery("#imageFile").change(function(){
		        	if(jQuery("#imageFile").val() && upImagec){
		        		upImagec = 0
			            jQuery("#imageForm").ajaxSubmit({
			            	dataType:  'json',
			                beforeSend: function() {
			                    
			                },
			                uploadProgress: function(event, position, total, percentComplete) {
			                    jQuery('#file-progress').text(percentComplete+'%');
			                },
			                success: function(data) {
			                	upImagec = 1;
			                	if(data.error){
			                		layer.msg(data.msg);
			                	}else{
				                	jQuery('.tougao-image-box').html('<img src="'+data.url+'" />');
				                    jQuery('#image').val(data.url);   
				                    jQuery('#file-progress').hide();
				                    layer.msg('上传成功');
				                }
			                },
			                error:function(xhr){
			                	upImagec = 1;
			                	layer.msg('上传失败～');
			                }
			            });
			        }
		        });
		    }else{
		    	layer.msg('抱歉，未开启上传图片权限，请输入外链图片地址');
		    	jQuery(".tougao-image-input").show();
		    }
		});

		var upFilec = 1;
		jQuery(".tougao-upload2").click(function(){
			if(jQuery("#fileForm").length){
				jQuery("#fileFile").trigger('click');
		        jQuery("#fileFile").change(function(){
		        	if(jQuery("#fileFile").val() && upFilec){
		        		upFilec = 0;
			            jQuery("#fileForm").ajaxSubmit({
			            	dataType:  'json',
			                beforeSend: function() {

			                },
			                uploadProgress: function(event, position, total, percentComplete) {
			                    jQuery('#file-progress2').text(percentComplete+'%');
			                },
			                success: function(data) {
			                	upFilec = 1;
			                	if(data.error){
			                		layer.msg(data.msg);
			                	}else{
				                	jQuery('.tougao-file-box').html('<img src="'+_MBT.uri+'/static/img/file.png" />');
				                    jQuery('#down_url').val(data.url); 
				                    jQuery('#file-progress2').hide();
				                    layer.msg('上传成功'); 
				                }
			                },
			                error:function(xhr){
			                	upFilec = 1;
			                    layer.msg('上传失败～');
			                }
			            });
			        }
		            return false;
		        });
		    }else{
		    	layer.msg('抱歉，未开启上传附件权限，请输入外链下载地址');
		    	jQuery(".tougao-file-input").show();
		    }
		});
	},
	sidebar: function(){
		var that = this;
		jQuery(function($){
	        if ($('.sidebar').length) {
	            $('.theiaStickySidebar').theiaStickySidebar({"containerSelector":".content","additionalMarginTop":"90px"});
	        }
	    });
	},
	scroll: function(){
		var that = this;
		var windowTop = 0,  windowTop2 = 0;
		jQuery(window).scroll(function() {
			document.documentElement.scrollTop + document.body.scrollTop > 79 ? jQuery('.header').addClass('scrolled') : jQuery('.header').removeClass('scrolled');
			document.documentElement.scrollTop + document.body.scrollTop > 150 ? jQuery('.totop-li').show() : jQuery('.totop-li').hide();

			if(document.documentElement.scrollTop + document.body.scrollTop > 40){
				jQuery('.pageside').css("top", jQuery(this).scrollTop()-20);
			}else{
				jQuery('.pageside').css("top", "0");
			}

			if(_MBT.hanimated == '1' && that.bodywid > 1024){
				var scrolls = jQuery(this).scrollTop();
			    if(scrolls>=windowTop){
			        if (!jQuery('.header').hasClass('slideOutUp')) {
			            jQuery('.header').addClass('animated slideOutUp');
			            jQuery('.header').removeClass('slideInDown');
			        }
			        windowTop=scrolls;
			    }else{
			        if (!jQuery('.header').hasClass('slideInDown')) {
			            jQuery('.header').addClass('animated slideInDown');
			            jQuery('.header').removeClass('slideOutUp');
			        }
			        windowTop=scrolls;
			    }
			}
		});
	},
	lazyload: function(){
		var that = this;
		if(jQuery('.thumb:first').data('src') || jQuery('.home-blogs .thumb:first').data('src')){
			jQuery('.thumb').lazyload({
		          data_attribute: 'src',
		          placeholder: _MBT.uri + '/static/img/thumbnail.png',
		          threshold: 400
		    });
		    jQuery('.home-blogs .thumb').lazyload({
		          data_attribute: 'src',
		          placeholder: _MBT.uri + '/static/img/thumbnail.png',
		          threshold: 400
		    });
		}
	},
	iasLoad: function(){
		var that = this;
		if(that.water){
			if(jQuery(".posts").length && jQuery(".grids").length){
				var grids = document.querySelector('.grids');
				imagesLoaded( grids, function() {
					
				    var msnry = new Masonry( grids, {
				      itemSelector: '.grid',
				      visibleStyle: { transform: 'translateY(0)', opacity: 1 },
  					  hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
				    });

					jQuery.ias({
						triggerPageThreshold : 3,
						history              : false,
						container            : '.posts',
						item                 : '.post',
						pagination           : '.pagination',
						next                 : '.next-page a',
						loader               : '<img src="'+_MBT.uri+'/static/img/loader.gif">',
						trigger              : '加载更多',
						onLoadItems          : function(items){
							/* Theme by mobantu.com */
						},
						onRenderComplete     : function(items) {
							imagesLoaded( grids, function() {
							  msnry.appended( items );
							  jQuery('.grid').css({ opacity: 1 });
							});
							
						}
				    });
				    
				});
			}else{
				if(jQuery(".posts").length){
					jQuery.ias({
						triggerPageThreshold : 3,
						history              : false,
						container            : '.posts',
						item                 : '.post',
						pagination           : '.pagination',
						next                 : '.next-page a',
						loader               : '<img src="'+_MBT.uri+'/static/img/loader.gif">',
						trigger              : '加载更多',
						onRenderComplete     : function(items) {
							that.video();
							if(that.lazy) that.lazyload();
						}
				    });
				}
			}
		}else{
			if(jQuery(".posts").length){
				jQuery.ias({
					triggerPageThreshold : 3,
					history              : false,
					container            : '.posts',
					item                 : '.post',
					pagination           : '.pagination',
					next                 : '.next-page a',
					loader               : '<img src="'+_MBT.uri+'/static/img/loader.gif">',
					trigger              : '加载更多',
					onRenderComplete     : function(items) {
						that.video();
						if(that.lazy) that.lazyload();
					}
			    });
			}
		}
	},
	share: function(){
		var that = this;
        if(jQuery('.article-content img:first').length ){
            _MBT.shareimage = jQuery('.article-content img:first').attr('src')
        }  
		var share = {
	        url: document.URL,
	        pic: _MBT.shareimage,
	        title: document.title || '',
	        desc: jQuery('meta[name="description"]').length ? jQuery('meta[name="description"]').attr('content') : ''    
	    }
	    jQuery('.share-weixin').each(function(){
		    if( !jQuery(this).find('.share-popover').length ){
				jQuery(this).append('<span class="share-popover"><span class="share-popover-inner" id="weixin-qrcode"></span></span>');
				jQuery('#weixin-qrcode').qrcode({
					width: 80,
					height: 80,
					text: jQuery(this).data('url')
				});
			}
		})
		jQuery('.article-shares a').on('click', function(){
			var dom = jQuery(this);
		    var to = dom.data('share'); 
		    var url = dom.data('url');
		    switch(to){
		        case 'qq':
		            url = 'http://connect.qq.com/widget/shareqq/index.html?url='+url+'&desc='+share.desc+'&summary='+share.title+'&site=zeshlife&pics='+share.pic;
		            break;
		        case 'weibo':
		            url = 'http://service.weibo.com/share/share.php?title='+share.title+'&url='+url+'&source=bookmark&pic='+share.pic;
		            break;
		        case 'douban':
		            url = 'http://www.douban.com/share/service?image='+share.pic+'&href='+url+'&name='+share.title+'&text='+share.desc;
		            break;
		        case 'qzone':
		            url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url+'&title='+share.title+'&desc='+share.desc;
		            break;
		        case 'tqq':
		            url = 'http://share.v.t.qq.com/index.php?c=share&a=index&url='+url+'&title='+share.title;
		            break;
		        case 'renren':
		            url = 'http://widget.renren.com/dialog/share?srcUrl='+share.pic+'&resourceUrl='+url+'&title='+share.title+'&description='+share.desc;
		            break;
		    }
		    if( !dom.attr('href') && !dom.attr('target') ){
		    	dom.attr('href', url).attr('target', '_blank');
		    }
		});
	},
	catFilter: function(){
		var that = this;

		jQuery('.mocat .child a').on('click',function(){
			var the = jQuery(this);
			var con = the.parent().parent().next(),
				link = the.data("link");
			con.html('<div class="posts-loading" style="display:block"><img src="'+_MBT.uri+'/static/img/loader.gif"></div>');
			the.parent().parent().find('a').removeClass('active');
	        the.addClass('active');
			jQuery.ajax({
		        type: 'get',
		        url: _MBT.uri + '/action/mocat.php?c='+jQuery(this).data('c')+'&c2='+jQuery(this).data('c2')+'&num='+jQuery(this).data('num'),
		        success: function(data){
		            con.html(data);
		            that.video();
		            if(link){
		            	con.next().find('a').attr("href",link);
		            }
		            if(the.parent().parent().parent().parent().hasClass('water')){
			            var id = the.parent().parent().parent().parent().attr('id');
						var grids = document.querySelector('#'+id+' .waterfall');
						imagesLoaded( grids, function() {
						    var msnry = new Masonry( grids, {
						      itemSelector: '.grid',
						      visibleStyle: { transform: 'translateY(0)', opacity: 1 },
								  hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
						    });
						});
					}else{
						if(that.lazy) that.lazyload();
					}
		           
		        }
		    });
		    return false;
		});

		jQuery('.mocat .cfilter a').on('click',function(){
			var the = jQuery(this);
			var con = the.parent().parent().next();
			con.html('<div class="posts-loading" style="display:block"><img src="'+_MBT.uri+'/static/img/loader.gif"></div>');
			the.parent().parent().find('a').removeClass('active');
	        the.addClass('active');
			jQuery.ajax({
		        type: 'get',
		        url: _MBT.uri + '/action/mocat.php?cf=1&c='+jQuery(this).data('c')+'&o='+jQuery(this).data('o')+'&num='+jQuery(this).data('num'),
		        success: function(data){
		            con.html(data);
		            that.video();
		            if(the.parent().parent().parent().parent().hasClass('water')){
			            var id = the.parent().parent().parent().parent().attr('id');
						var grids = document.querySelector('#'+id+' .waterfall');
						imagesLoaded( grids, function() {
						    var msnry = new Masonry( grids, {
						      itemSelector: '.grid',
						      visibleStyle: { transform: 'translateY(0)', opacity: 1 },
								  hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
						    });
						});
					}else{
						if(that.lazy) that.lazyload();
					}
		        }
		    });
		    return false;
		});

		jQuery('.cat-nav > li > a').on('click',function(){
			var next_url = jQuery(this).attr("href");
		    
	        jQuery('.cat-nav > li').removeClass('current-menu-item');
	        jQuery(this).parent().addClass('current-menu-item');
	        jQuery(".posts-loading").show();
	        jQuery("#posts, .pagination").hide();
	        jQuery(".pagination").html('');
	        jQuery(".pagination-trigger").remove();

		    jQuery.ajax({
		        type: 'get',
		        url: next_url + '#posts',
		        success: function(data){
		            posts = jQuery(data).find("#posts .post");
		            pagination = jQuery(data).find(".pagination ul");

		            next_link = jQuery(pagination).find(".next-page > a").attr("href");
		            if (next_link != undefined){
		                jQuery(".pagination").html(pagination.fadeIn(100));
		            }else{
		            	jQuery(".pagination").html('');
		            }
		            
	                if (next_url.indexOf("page") < 1) {
	                  jQuery("#posts").html('');
	                }
	                jQuery("#posts").append(posts.fadeIn(100));

	                if(that.lazy) that.lazyload();

	                if(that.ias){
		                that.iasLoad();
		            }else{
		            	jQuery(".pagination").show();
		            }
	                
                    jQuery(".posts-loading").hide();
                    jQuery("#posts").show();
                    that.video();    
		            
		        }
		    });
		    return false;
		});
	},
	login: function(){
		var that = this;
		var erphpWeixinScan;
		jQuery(function($){
			$("body").on("click", ".erphp-login-must", function(){
				clearInterval(erphpWeixinScan);
				that.body.addClass('sign-show');
				$('#sign-in').show();
				$('#sign-up').hide();
				$('#sign-mp').hide();
				$('#sign-sms').hide();

				document.onkeydown = function() {
					if (event.keyCode == 13) {
						$(".signinsubmit-loader").click();
					}
				}

				return false;
			});

			$("body").on("click", ".signin-loader", function(){
				clearInterval(erphpWeixinScan);
				that.body.addClass('sign-show');
				if(that.mbf){
					$('#sign-sms').show();
					$('#sign-up').hide();
					$('#sign-in').hide();
					$('#sign-mp').hide();

					document.onkeydown = function() {
						if (event.keyCode == 13) {
							$(".signsmssubmit-loader").click();
						}
					}
				}else if(that.mpf){
					$('#sign-mp').show();
					$('#sign-up').hide();
					$('#sign-in').hide();
					$('#sign-sms').hide();
					if(that.mpfp){
						that.loginMpPro();
					}
				}else{
					$('#sign-in').show();
					$('#sign-up').hide();
					$('#sign-mp').hide();
					$('#sign-sms').hide();

					document.onkeydown = function() {
						if (event.keyCode == 13) {
							$(".signinsubmit-loader").click();
						}
					}
				}
				return false;
			});

			$('.erphp-reg-must').on('click', function(){
				clearInterval(erphpWeixinScan);
				that.body.addClass('sign-show');
				$('#sign-up').show();
				$('#sign-in').hide();
				$('#sign-mp').hide();
				$('#sign-sms').hide();

				document.onkeydown = function() {
					if (event.keyCode == 13) {
						$(".signupsubmit-loader").click();
					}
				}
				return false;
			});

			$('.signup-loader').on('click', function(){
				clearInterval(erphpWeixinScan);
				that.body.addClass('sign-show');
				if(that.mbf){
					$('#sign-sms').show();
					$('#sign-up').hide();
					$('#sign-in').hide();
					$('#sign-mp').hide();

					document.onkeydown = function() {
						if (event.keyCode == 13) {
							$(".signsmssubmit-loader").click();
						}
					}
				}else if(that.mpf){
					$('#sign-mp').show();
					$('#sign-up').hide();
					$('#sign-in').hide();
					$('#sign-sms').hide();
					if(that.mpfp){
						that.loginMpPro();
					}
				}else{
					$('#sign-up').show();
					$('#sign-in').hide();
					$('#sign-mp').hide();
					$('#sign-sms').hide();
					document.onkeydown = function() {
						if (event.keyCode == 13) {
							$(".signupsubmit-loader").click();
						}
					}
				}
				return false;
			});

			$('.signsms-loader').on('click', function(){
				clearInterval(erphpWeixinScan);
				that.body.addClass('sign-show');
				$('#sign-sms').show();
				$('#sign-up').hide();
				$('#sign-in').hide();
				$('#sign-mp').hide();

				document.onkeydown = function() {
					if (event.keyCode == 13) {
						$(".signsmssubmit-loader").click();
					}
				}
				return false;
			});

			$('.signmp-loader').on('click', function(){
				clearInterval(erphpWeixinScan);
				that.body.addClass('sign-show');
				$('#sign-mp').show();
				$('#sign-up').hide();
				$('#sign-in').hide();
				$('#sign-sms').hide();
				if(that.mpfp){
					that.loginMpPro();
				}
				return false;
			});

			$('.signclose-loader').on('click', function(){
				that.body.removeClass('sign-show');
				clearInterval(erphpWeixinScan);
			});

			$('.sign-mask').on('click', function(){
				that.body.removeClass('sign-show');
				clearInterval(erphpWeixinScan);
			});
			
			$('.signinsubmit-loader').on('click', function(){
				if( $("#user_login").val() == '' ){
					logtips('用户名/邮箱不能为空');
					return false;
				}
				if( $("#user_pass").val() == '' ){
					logtips('密码不能为空');
					return false;
				}
				logtips("登录中，请稍等...");
				$('.signinsubmit-loader').attr("disabled",true);
				$.post(
					_MBT.uri+'/action/login.php',
					{
						log: $("#user_login").val(),
						pwd: $("#user_pass").val(),
						cpt: $("#user_captcha").val(),
						action: "mobantu_login",
					},
					function (data) {
						if ($.trim(data) != "1") {
							logtips(data);
							$('.signinsubmit-loader').attr("disabled",false);
						}
						else {
							logtips("登录成功，跳转中...");
							location.reload();                     
						}
					}
				);
			});

			$('.signupsubmit-loader').on('click', function(){
				if( $("#user_register").val().length < 4 ){
					logtips('用户名长度至少4位');
					return false;
				}
				if( !is_mail($("#user_email").val()) ){
					logtips('邮箱格式错误');
					return false;
				}
				if( !$("#user_pass2").val() ){
					logtips('请输入密码');
					return false;
				}
				if( $(".form-policy").length && !$("input[name='policy_reg']").is(':checked')){
					logtips('请阅读并同意用户注册协议');
					return false;
				}
	            logtips("注册中，请稍等...");
	            $('.signupsubmit-loader').attr("disabled",true);
	            $.post(
	            	_MBT.uri+'/action/login.php',
	            	{
	            		user_register: $("#user_register").val(),
	            		user_email: $("#user_email").val(),
	            		password: $("#user_pass2").val(),
	            		captcha: $("#captcha").val(),
					    action: "mobantu_register"
					},
					function (data) {
						if ($.trim(data) == "1") {
							logtips("注册成功，登录中...");
							location.reload(); 
						}else {
							logtips(data);
							$('.signupsubmit-loader').attr("disabled",false);
						}
					}
				);										   
	        });

	        $('.signsmssubmit-loader').on('click', function(){
				if( !is_mobile($("#user_mobile").val()) ){
					logtips('手机号格式错误');
					return false;
				}

				if( !$("#user_mobile_captcha").val() ){
					logtips('请输入验证码');
					return false;
				}
				if( $(".form-policy").length && !$("input[name='policy_sms']").is(':checked')){
					logtips('请阅读并同意用户注册协议');
					return false;
				}
	            logtips("登录中，请稍等...");
	            $('.signsmssubmit-loader').attr("disabled",true);
	            $.post(
	            	_MBT.uri+'/action/login.php',
	            	{
	            		mobile: $("#user_mobile").val(),
	            		captcha: $("#user_mobile_captcha").val(),
					    action: "mobantu_mobile_login"
					},
					function (data) {
						if ($.trim(data) == "1") {
							logtips("登录成功，跳转中...");
							location.reload(); 
						}else {
							logtips(data);
							$('.signsmssubmit-loader').attr("disabled",false);
						}
					}
				);										   
	        });

	        $('.captcha-clk2').bind('click',function(){
				var captcha = _MBT.uri+'/action/captcha2.php?'+Math.random();
				$(this).attr('src',captcha);
			});

			$('.captcha-clk').bind('click',function(){
				if( !is_mail($("#user_email").val()) ){
					logtips('邮箱格式错误');
					return false;
				}
				
				var captcha = $(this);
				if(captcha.hasClass("disabled")){
					logtips('您操作太快了，等等吧')
				}else{
					captcha.addClass("disabled");
					captcha.html("发送中...");
					$.post(
						_MBT.uri+'/action/captcha.php?'+Math.random(),
						{
							action: "mobantu_captcha",
							email:$("#user_email").val()
						},
						function (data) {
							if($.trim(data) == "1"){
								logtips('已发送验证码至邮箱，可能会出现在垃圾箱里哦~')
								var countdown=60; 
								settime();
								function settime() { 
									if (countdown == 0) { 
										captcha.removeClass("disabled");   
										captcha.html("重新获取验证码");
										countdown = 60; 
										return;
									} else { 
										captcha.addClass("disabled");
										captcha.html("重新获取(" + countdown + ")"); 
										countdown--; 
									} 
									setTimeout(function() { settime() },1000) 
								}
								
							}else if($.trim(data) == "2"){
								logtips('邮箱已存在')
								captcha.html("获取邮箱验证码");
								captcha.removeClass("disabled"); 
							}else{
								logtips('验证码发送失败，请稍后重试')
								captcha.html("获取邮箱验证码");
								captcha.removeClass("disabled"); 
							}
						}

						);

				}

			});

			$('.captcha-sms-clk').bind('click',function(){
				if( !is_mobile($("#user_mobile").val()) ){
					logtips('手机号格式错误');
					return false;
				}
				
				var captcha = $(this);
				if(captcha.hasClass("disabled")){
					logtips('您操作太快了，等等吧')
				}else{
					captcha.addClass("disabled");
					captcha.html("发送中...");
					$.post(
						_MBT.uri+'/action/login.php',
						{
							action: "mobantu_captcha_sms",
							mobile:$("#user_mobile").val()
						},
						function (data) {
							if($.trim(data) == "1"){
								logtips('已发送验证码至手机，请注意查收~')
								var countdown=60; 
								settime();
								function settime() { 
									if (countdown == 0) { 
										captcha.removeClass("disabled");   
										captcha.html("重新获取验证码");
										countdown = 60; 
										return;
									} else { 
										captcha.addClass("disabled");
										captcha.html("重新获取(" + countdown + ")"); 
										countdown--; 
									} 
									setTimeout(function() { settime() },1000) 
								}
								
							}else{
								logtips("验证码发送失败，请稍后重试")
								captcha.html("获取验证码");
								captcha.removeClass("disabled"); 
							}
						}

					);

				}

			});	
		});
	},
	loginMpPro: function(){
		var that = this;
		jQuery(function($){
			$(".erphp-weixin-scan").addClass("erphp-weixin-scan-pro");
			if($(".erphp-weixin-scan-pro").length){
		        $(".erphp-weixin-scan-pro .ews-qrcode").addClass("blur");
		        $.post(ews_ajax_url, {
		            "action": "ews_login_pro"
		        }, function(result) {
		            if(result.status == "1"){
		                $(".erphp-weixin-scan-pro .ews-qrcode").attr("src", result.img).removeClass("blur");
		                if(result.scene_id){
		                    erphpWeixinScan = setInterval(function() {
		                        $.post(ews_ajax_url, {
		                            "action": "ews_login_pro_scan",
		                            "scene_id": result.scene_id
		                        }, function(data) {
		                            if(data.status == "1"){
		                                clearInterval(erphpWeixinScan);
		                                if(typeof(layer) != "undefined"){
		                                    layer.msg("操作成功");
		                                }
		                                location.reload();
		                            }
		                        });
		                    }, 3000);
		                }
		            }else{
		                if(typeof(layer) != "undefined"){
		                    layer.msg(data.msg);
		                }else{
		                    alert(data.msg);
		                }
		            }
		        });
		    }
		});
	},
	comment: function(){
		var that = this;
		jQuery(function($){

			$('.comment-reply-link').on('click', function(){
				addComment.moveForm( "comment-"+$(this).attr('data-commentid'), $(this).attr('data-commentid'), "respond", $(this).attr('data-postid') );
				return false;
			});

			$('.commentlist .url').attr('target','_blank')

			$('.comment-user-change').on('click', function(){
				$('#comment-author-info').slideDown(300)
		    	$('#comment-author-info input:first').focus()
			})

			$('#addsmile').on("click", function(e) {
				$('.smile').toggleClass('open');
				$(document).one("click", function() {
					$('.smile').toggleClass('open');
				});
				e.stopPropagation();
				return false;
			});


		    var edit_mode = '0',
		        txt1 = '<div class="comt-tip comt-loading">提交中...</div>',
		        txt2 = '<div class="comt-tip comt-error">#</div>',
		        txt3 = '">',
		        cancel_edit = '取消编辑',
		        edit,
		        num = 1,
		        comm_array = [];
		    comm_array.push('');

		    $comments = $('#comments-title');
		    $cancel = $('#cancel-comment-reply-link');
		    cancel_text = $cancel.text();
		    $submit = $('#commentform #submit');
		    $submit.attr('disabled', false);
		    $('.comt-tips').append(txt1 + txt2);
		    $('.comt-loading').hide();
		    $('.comt-error').hide();
		    $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
		    $('#commentform').submit(function() {
		        $('.comt-loading').slideDown(300);
		        $submit.attr('disabled', true).fadeTo('slow', 0.5);
		        if (edit) $('#comment').after('<input type="text" name="edit_id" id="edit_id" value="' + edit + '" style="display:none;" />');
		        $.ajax({
		            url: _MBT.uri + '/action/comment.php',
		            data: $(this).serialize(),
		            type: $(this).attr('method'),
		            error: function(request) {
		                $('.comt-loading').slideUp(300);
		                $('.comt-error').slideDown(300).html('提交失败，请稍后重试！');
		                setTimeout(function() {
		                        $submit.attr('disabled', false).fadeTo('slow', 1);
		                        $('.comt-error').slideUp(300)
		                    },
		                    3000)
		            },
		            success: function(data) {
		                $('.comt-loading').slideUp(300);
		                comm_array.push($('#comment').val());
		                $('textarea').each(function() {
		                    this.value = ''
		                });
		                var t = addComment,
		                    cancel = t.I('cancel-comment-reply-link'),
		                    temp = t.I('wp-temp-form-div'),
		                    respond = t.I(t.respondId),
		                    post = t.I('comment_post_ID').value,
		                    parent = t.I('comment_parent').value;
		                if (!edit && $comments.length) {
		                    n = parseInt($comments.text().match(/\d+/));
		                    $comments.text($comments.text().replace(n, n + 1))
		                }
		                new_htm = '" id="new_comm_' + num + '"></';
		                new_htm = (parent == '0') ? ('\n<ol style="clear:both;" class="commentlist commentnew' + new_htm + 'ol>') : ('\n<ul class="children' + new_htm + 'ul>');
		                ok_htm = '\n<span id="success_' + num + txt3;
		                ok_htm += '</span><span></span>\n';

		                if (parent == '0') {
		                    if ($('#postcomments .commentlist').length) {
		                        $('#postcomments .commentlist').before(new_htm);
		                    } else {
		                        $('#respond').after(new_htm);
		                    }
		                } else {
		                    $('#respond').after(new_htm);
		                }

		                $('#comment-author-info').slideUp()

		                $('#new_comm_' + num).hide().append(data);
		                $('#new_comm_' + num + ' li').append(ok_htm);
		                $('#new_comm_' + num).fadeIn(1000);
		                $('#new_comm_' + num).find('.comt-avatar .avatar').attr('src', $('.commentnew .avatar:last').attr('src'));
		                countdown();
		                num++;
		                edit = '';
		                $('*').remove('#edit_id');
		                cancel.style.display = 'none';
		                cancel.onclick = null;
		                t.I('comment_parent').value = '0';
		                if (temp && respond) {
		                    temp.parentNode.insertBefore(respond, temp);
		                    temp.parentNode.removeChild(temp)
		                }
		            }
		        });
		        return false
		    });
		    addComment = {
		        moveForm: function(commId, parentId, respondId, postId, num) {
		            var t = this,
		                div, comm = t.I(commId),
		                respond = t.I(respondId),
		                cancel = t.I('cancel-comment-reply-link'),
		                parent = t.I('comment_parent'),
		                post = t.I('comment_post_ID');
		            if (edit) exit_prev_edit();
		            num ? (t.I('comment').value = comm_array[num], edit = t.I('new_comm_' + num).innerHTML.match(/(comment-)(\d+)/)[2], $new_sucs = $('#success_' + num), $new_sucs.hide(), $new_comm = $('#new_comm_' + num), $new_comm.hide(), $cancel.text(cancel_edit)) : $cancel.text(cancel_text);
		            t.respondId = respondId;
		            postId = postId || false;
		            if (!t.I('wp-temp-form-div')) {
		                div = document.createElement('div');
		                div.id = 'wp-temp-form-div';
		                div.style.display = 'none';
		                respond.parentNode.insertBefore(div, respond)
		            }!comm ? (temp = t.I('wp-temp-form-div'), t.I('comment_parent').value = '0', temp.parentNode.insertBefore(respond, temp), temp.parentNode.removeChild(temp)) : comm.append(respond);/*comm.parentNode.insertBefore(respond, comm.nextSibling)*/
		            $body.animate({
		                    scrollTop: $('#respond').offset().top - 180
		                },
		                400);
		            if (post && postId) post.value = postId;
		            parent.value = parentId;
		            cancel.style.display = '';
		            cancel.onclick = function() {
		                if (edit) exit_prev_edit();
		                var t = addComment,
		                    temp = t.I('wp-temp-form-div'),
		                    respond = t.I(t.respondId);
		                t.I('comment_parent').value = '0';
		                if (temp && respond) {
		                    temp.parentNode.insertBefore(respond, temp);
		                    temp.parentNode.removeChild(temp)
		                }
		                this.style.display = 'none';
		                this.onclick = null;
		                return false
		            };
		            try {
		                t.I('comment').focus()
		            } catch (e) {}
		            return false
		        },
		        I: function(e) {
		            return document.getElementById(e)
		        }
		    };

		    function exit_prev_edit() {
		        $new_comm.show();
		        $new_sucs.show();
		        $('textarea').each(function() {
		            this.value = ''
		        });
		        edit = ''
		    }
		    var wait = 15,
		        submit_val = $submit.val();

		    function countdown() {
		        if (wait > 0) {
		            $submit.val(wait);
		            wait--;
		            setTimeout(countdown, 1000)
		        } else {
		            $submit.val(submit_val).attr('disabled', false).fadeTo('slow', 1);
		            wait = 15
		        }
		    }
		});
	},
	singular: function(){
		var that = this;

		jQuery('pre').each(function(){
		    if( !jQuery(this).attr('style') ) jQuery(this).addClass('prettyprint')
		});

		if( jQuery('.prettyprint').length ){
		    prettyPrint();
		}

		jQuery(".article-content iframe, .article-content embed, .article-content object, .article-content video").each(function(){
		    jQuery(this).width("100%");
		    jQuery(this).height(jQuery(this).width()*0.5678);
		});


		jQuery(window).resize(function (){
		    jQuery(".article-content iframe, .article-content embed, .article-content object, .article-content video").each(function(){
			    jQuery(this).height(jQuery(this).width()*0.5678);
		    });
		});

		if(jQuery('.ckplayer-video').length){
			jQuery('.ckplayer-video').each(function(){
				jQuery(this).height(jQuery(this).width()*0.5678);
			});
		}

		if(jQuery('.dplayer-video').length){
			jQuery('.dplayer-video').each(function(){
				jQuery(this).height(jQuery(this).width()*0.5678);
			});
		}

		if(jQuery('.article-content .gallery').length){
			jQuery('.article-content .gallery').each(function(){
				var gid = jQuery(this).attr("id");
				jQuery(this).find(".gallery-fancy-item a").attr("data-fancybox",gid);
			});
		}

		if(jQuery(".article-shang").length){
			var _article_shang = {
		        resetPlatformLi: function(){
		            jQuery("#article-shang-popup ul.platform li").each(function(){
		                jQuery(this).removeClass("active");
		            });
		        },
		        resetQrcode: function(){
		            jQuery("#article-shang-popup div.qrcode .qrcode-li").each(function(){
		                jQuery(this).hide();
		            });
		        }
		    };

			jQuery(".article-shang").click(function(){
				if(jQuery("#article-shang-popup").length){
					jQuery("#article-shang-popup").remove();
					jQuery(".article-shang").html("赏");
				}else{
					jQuery(".article-act").append('<div id="article-shang-popup" class="wechat popup"><div class="head">~谢谢打赏~</div><div class="qrcode"><div class="qrcode-li wechat"><img src="'+jQuery(this).data("weixin")+'"></div><div class="qrcode-li alipay" style="display: none;"><img src="'+jQuery(this).data("alipay")+'"></div></div><ul class="platform"><li class="sicon-wechat active" data-bg-color="#05af4e" data-thanks="~谢谢打赏~"></li><li class="sicon-alipay" data-bg-color="#00a2ea" data-thanks="~谢谢打赏~"></li></ul></div>');

					jQuery(".article-shang").html("✕");

					jQuery("#article-shang-popup ul.platform li").each(function(index){
				        jQuery(this).click(function(){
				            _article_shang.resetPlatformLi();
				            _article_shang.resetQrcode();
				            jQuery(this).addClass("active");
				            var bgColor = jQuery(this).attr("data-bg-color");
				            var thanks = jQuery(this).attr("data-thanks");
				            jQuery("#article-shang-popup").css("background-color", bgColor);
				            jQuery("#article-shang-popup .head").html(thanks);
				            jQuery("#article-shang-popup div.qrcode div:eq(" + index + ")").each(function(){
				                jQuery(this).show();
				            });
				        });
				    });
				}
			});
		}

		jQuery('.article-cover').click(function(){
			var i = jQuery(this).data("s-id");
			jQuery("body").append('<div class="mobile-share-bg"><div class="top_tips">请长按图片，将内容推荐给好友</div></div><div class="mobile-share-wrap"></div>'),
			popup.showToast({
				type: "icon",
				time: 1e5
			}),
			utils.ajax({
				url: _MBT.uri+'/action/share.php',
				data: {
					id: i,
					action: "cover_share"
				},
				type: "POST",
				timeout: 1e4,
				success: function(t) {
					popup.hideToast();
					jQuery('#wx-thumb-qrcode').html('').qrcode({
						width: 195,
						height: 195,
						text: jQuery('#wx-thumb-qrcode').data('url')
					});
					t.callback = function(e) {
						jQuery(".mobile-share-wrap").html('<img src="' + e + '"><div class="mobile-share-close">×</div>'),
						jQuery(".mobile-share-bg .top_tips").show();
						jQuery('.mobile-share-close').click(function() {
							jQuery(".mobile-share-bg,.mobile-share-wrap").remove();
							jQuery('#wx-thumb-qrcode').html('')
						})
					};
					var o = jQuery("#wx-thumb-qrcode");
					t.qrcode = o.find("canvas")[0].toDataURL(),
					t.head && t.logo && t.qrcode ? utils.textToImage(t) : (popup.showToast({
						type: "text",
						text: "获取分享图片失败！"
					}), jQuery(".mobile-share-bg,.mobile-share-wrap").remove())
				},
				error: function() {
					popup.showToast({
						type: "text",
						text: "获取分享图片失败！"
					});
					jQuery(".mobile-share-bg,.mobile-share-wrap").remove()
				}
			});
		});


		//文章点赞
		if(jQuery('.article-zan').length){
			if(checkZan(jQuery('.article-zan').data('id'))){
				jQuery('.article-zan').addClass('active').find('.icon').addClass('icon-zan-s');
			}

			jQuery('.article-zan').on('click', function() {
			  var vote_btn = jQuery(this);
			  if (vote_btn.hasClass('active')) {
			    return false;
			  }
			  var nn = Number(vote_btn.find("span").text());
			  var pid = vote_btn.data('id');
			  if (checkZan(pid)) {
			  	layer.msg('您已经赞过啦～');   
			    return false;
			  }
			  jQuery.ajax({
			       url: _MBT.uri+'/action/zan.php',
			       type: 'POST',
			       dataType: 'json', 
			       data: {
			         action:'post',
			         id:pid
			       },
			      success: function(data) {
			        if (data.result == '1') {
			          vote_btn.addClass('active').html('<i class="icon icon-zan-s"></i> <span>'+(nn+1)+'</span>');
			          addZan(pid);
			        }   
			      }
			 });
			});
		}

		function checkZan(pid){
		  zanIds=getCookie('zanIds')
		  if (zanIds!=null && zanIds!="")
		  {
		    comArr = zanIds.split(",");
		    for (i=0;i<comArr.length ;i++ ) 
		    { 
		      if (comArr[i] == pid) {
		        return true;
		      }
		    } 
		  }
		  return false;
		}

		function addZan(pid){
		  zanIds=getCookie('zanIds')
		  if (zanIds!=null && zanIds!="")
		  {
		    zanIds = zanIds+','+pid;
		    setCookie('zanIds', zanIds, 30);
		  }
		  else 
		  {
		    setCookie('zanIds', pid, 30);
		  }
		} 

		function setCookie(c_name,value,expiredays){
		  var exdate=new Date()
		  exdate.setDate(exdate.getDate()+expiredays)
		  document.cookie=c_name+ "=" +escape(value)+
		  ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
		}

		function getCookie(c_name){
			if (document.cookie.length>0){
			  c_start=document.cookie.indexOf(c_name + "=")
			  if (c_start!=-1){ 
				c_start=c_start + c_name.length+1 
				c_end=document.cookie.indexOf(";",c_start)
				if (c_end==-1) c_end=document.cookie.length
				return unescape(document.cookie.substring(c_start,c_end))
			  } 
			}
			return ""
		}

		jQuery('.article-collect').on('click', function() {
		  var vote_btn = jQuery(this);
		  var pid = vote_btn.data('id');
		  if (pid) {
		  	var nn = Number(vote_btn.find("span").text());
		    jQuery.ajax({
		       url: _MBT.uri+'/action/collect.php',
		       type: 'POST',
		       dataType: 'json', 
		       data: {
		         id:pid
		       },
		      success: function(data) {
		        if (data.result == '1') {
		          vote_btn.addClass('active').html('<i class="icon icon-star"></i> <span>'+(nn+1)+'</span>');
		        }else if (data.result == '2') {
		        	if(jQuery(".user-commentlist").length){
		        		location.reload();
		        	}else{
		        		vote_btn.removeClass('active').html('<i class="icon icon-star"></i> <span>'+(nn-1)+'</span>');
		        	} 
		        }    
		      }
		 	});
		  }
		  
		});

		jQuery('.side-collect').on('click', function() {
		  var vote_btn = jQuery(this);
		  var pid = vote_btn.data('id');
		  if (pid) {
		    jQuery.ajax({
		       url: _MBT.uri+'/action/collect.php',
		       type: 'POST',
		       dataType: 'json', 
		       data: {
		         id:pid
		       },
		      success: function(data) {
		        if (data.result == '1') {
		            vote_btn.addClass('active').text('已收藏');
		        }else if (data.result == '2') {
		        	vote_btn.removeClass('active').text('收藏');
		        }    
		      }
		 	});
		  }
		  
		});
	},
	fullScreen: function(){
		let element = document.documentElement;
        if (this.fullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
        this.fullscreen = !this.fullscreen;
	},
	scrollTo: function(name, add, speed) {
	    if (!speed) speed = 300;
	    if (!name) {
	        jQuery('html,body').animate({
	            scrollTop: 0
	        }, speed);
	    } else {
	        if (jQuery(name).length > 0) {
	            jQuery('html,body').animate({
	                scrollTop: jQuery(name).offset().top + (add || 0)
	            }, speed);
	        }
	    }
	}
}

weixinShareApi = {
	init: function() {
		var that = this;
		if (that.openInWeixin()) {
			var e, i = location.href.split("#")[0],
			o = document.querySelector("body").classList,
			s = 0;
			if (o.contains("single")) for (var r = 0; r < o.length; r++)(e = o[r].match(/postid-(\d+)$/)) && (s = e[1]);
			jQuery.ajax({
				url: _MBT.uri+'/action/share.php',
				type: "POST",
				data: {
					action: "weixin_share",
					url: encodeURIComponent(i),
					ID: s
				},
				dataType: "json",
				success: function(e) {
					//console.log(e);
					if (e.signature) {
						var n = e.thumb,
						o = document.title,
						s = jQuery("meta[name=description]").attr("content");
						s = s || e.desc;
						var r = document.createElement("script");
						r.src = "//res.wx.qq.com/open/js/jweixin-1.2.0.js",
						r.onload = function() {
							window.wx.config({
								debug: !1,
								appId: e.appId,
								timestamp: e.timestamp,
								nonceStr: e.noncestr,
								signature: e.signature,
								jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo"]
							}),
							wx.ready(function() {
								var e = {
									imgUrl: n,
									link: i,
									desc: s,
									title: o
								},
								r = {
									imgUrl: n,
									link: i,
									title: o
								};
								wx.onMenuShareAppMessage(e),
								wx.onMenuShareTimeline(r),
								wx.onMenuShareQQ(e),
								wx.onMenuShareWeibo(e)
							}),
							wx.error(function(t) {
								console.log(t)
							})
						},
						document.body.appendChild(r)
					}
				}
			})
		}
	},
	openInWeixin: function() {
		return /MicroMessenger/i.test(navigator.userAgent)
	}
};
weixinShareApi.init();


utils = {
	ajax: function() {
		var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
		t = e.url,
		i = void 0 === t ? "": t,
		a = e.data,
		o = void 0 === a ? {}: a,
		n = e.type,
		s = void 0 === n ? "GET": n,
		r = e.success,
		c = e.fail;
		jQuery.ajax({
			type: s,
			url: i,
			data: o,
			dataType: 'json',
			success: function(e) {
				"function" == typeof r && r(e)
			},
			fail: c
		})
	},
	textToImage: function(t) {
		function e(t, e, i, n, o) {
			for (var a = 0,
			s = 0,
			r = 0,
			l = 0; l < t.length; l++) r = o.measureText(t[l]).width,
			a += r,
			a > 560 && (o.fillText(t.substring(s, l), e, i), i += n, a = 0, s = l),
			l == t.length - 1 && (o.fillText(t.substring(s, l + 1), e, i), i += n);
			return i
		} !
		function() {
			var i = document.createElement("canvas"),
			n = i.getContext("2d");
			i.width = 640,
			i.height = 1e4;
			var o = 0;
			n.fillStyle = "#fff",
			n.fillRect(0, 0, i.width, i.height);
			var a = new Image;
			a.src = t.head,
			a.onerror = function(t) {
				popup.showToast({
					type: "text",
					text: "获取分享图片失败！"
				});
				jQuery(".mobile-share-bg,.mobile-share-wrap").remove()
			},
			a.onload = function() {
				o += 640 / a.width * a.height,
				n.drawImage(this, 0, 0, a.width, a.height, 0, 0, 640, 640 / a.width * a.height);
				var s = new Date(1e3 * t.timestamp),
				r = s.getDate(),
				l = s.getFullYear(),
				d = s.getMonth() + 1;
				r = r < 10 ? "0" + r: "" + r,
				d = d < 10 ? "0" + d: "" + d,
				d = l + "/" + d;
				var c = 0,
				u = 0;
				n.fillStyle = "#fff",
				n.textAlign = "center",
				n.font = "68px PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Source Han Sans CN,sans-serif";
				for (var h = 0; h < r.length; h++) c += n.measureText(r[h]).width;
				n.fillText(r, 80, o - 72),
				n.fillStyle = "#fff",
				n.textAlign = "center",
				n.font = "30px PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Source Han Sans CN,sans-serif";
				for (var h = 0; h < d.length; h++) u += n.measureText(d[h]).width;
				n.fillText(d, 80, o - 28);
				var p = parseInt(u > c ? u: c);
				n.moveTo(80 - p / 2, o - 60),
				n.lineTo(80 - p / 2 + p, o - 60),
				n.lineWidth = 1,
				n.strokeStyle = "rgba(255,255,255, 1)",
				n.stroke(),
				n.fillStyle = "#000",
				n.textAlign = "center",
				n.font = "600 36px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Source Han Sans CN,sans-serif",
				o += 80,
				o = e(jQuery("<div>").html(t.title).text(), 320, o, 50, n),
				n.textAlign = "left",
				n.fillStyle = "#333",
				n.font = "300 26px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Source Han Sans CN,sans-serif",
				o += 30,
				o = e(jQuery("<div>").html(t.excerpt).text(), 30, o, 42, n),
				o += 100,
				n.lineWidth = 1,
				n.beginPath(),
				n.setLineDash([7, 7]),
				n.strokeStyle = "#ccc",
				n.moveTo(0, o),
				n.lineTo(640, o),
				n.stroke();
				var f = new Image;
				f.src = t.logo,
				f.onerror = function(t) {
					popup.showToast({
						type: "text",
						text: "获取分享图片失败！"
					});
					jQuery(".mobile-share-bg,.mobile-share-wrap").remove()
				},
				f.onload = function() {
					o += 40;
					var e = 400 / f.width * f.height;
					e = e > 100 ? 100 : e;
					var a = f.width / (f.height / e);
					a = a > 400 ? 400 : a,
					e = a / f.width * f.height,
					n.drawImage(this, 0, 0, f.width, f.height, 30, o + (100 - e) / 2, a, e);
					var s = new Image;
					s.src = t.qrcode,
					s.onerror = function(t) {
						popup.showToast({
							type: "text",
							text: "获取分享图片失败！"
						});
						jQuery(".mobile-share-bg,.mobile-share-wrap").remove()
					},
					s.onload = function() {
						n.drawImage(this, 0, 0, s.width, s.height, 510, o, 100, 100 / s.width * s.height);
						var a = 100 / s.width * s.height;
						o += a > e ? a: e,
						o += 40;
						var r = n.getImageData(0, 0, 640, o);
						i.height = o,
						n.putImageData(r, 0, 0);
						var l = i.toDataURL("image/jpeg", 1);
						t.callback(l)
					}
				}
			}
		} ()
	},
	textToAffImage: function(t) {
		function e(t, e, i, n, o) {
			for (var a = 0,
			s = 0,
			r = 0,
			l = 0; l < t.length; l++) r = o.measureText(t[l]).width,
			a += r,
			a > 560 && (o.fillText(t.substring(s, l), e, i), i += n, a = 0, s = l),
			l == t.length - 1 && (o.fillText(t.substring(s, l + 1), e, i), i += n);
			return i
		} !
		function() {
			var i = document.createElement("canvas"),
			n = i.getContext("2d");
			i.width = 360,
			i.height = 1e4;
			var o = 0;
			n.fillStyle = "#fff",
			n.fillRect(0, 0, i.width, i.height);
			var a = new Image;
			a.src = t.head,
			a.onerror = function(t) {
				popup.showToast({
					type: "text",
					text: "获取推广卡片失败！"
				});
				jQuery(".mobile-share-bg,.mobile-share-wrap").remove()
			},
			a.onload = function() {
				o += 360 / a.width * a.height,
				n.drawImage(this, 0, 0, a.width, a.height, 0, 0, 360, 360 / a.width * a.height);
				var s = new Date(1e3 * t.timestamp),
				r = s.getDate(),
				l = s.getFullYear(),
				d = s.getMonth() + 1;
				r = r < 10 ? "0" + r: "" + r,
				d = d < 10 ? "0" + d: "" + d,
				d = l + "/" + d;
				var c = 0,
				u = 0;
				var f = new Image;
				f.src = t.logo,
				f.onerror = function(t) {
					popup.showToast({
						type: "text",
						text: "获取推广卡片失败！"
					});
					jQuery(".mobile-share-bg,.mobile-share-wrap").remove()
				},
				f.onload = function() {
					o += 20;
					var e = 400 / f.width * f.height;
					e = e > 60 ? 60 : e;
					var a = f.width / (f.height / e);
					a = a > 400 ? 400 : a,
					e = a / f.width * f.height,
					n.drawImage(this, 0, 0, f.width, f.height, 20, o + (60 - e) / 2, a, e);
					var s = new Image;
					s.src = t.qrcode,
					s.onerror = function(t) {
						popup.showToast({
							type: "text",
							text: "获取推广卡片失败！"
						});
						jQuery(".mobile-share-bg,.mobile-share-wrap").remove()
					},
					s.onload = function() {
						n.drawImage(this, 0, 0, s.width, s.height, 280, o, 60, 60 / s.width * s.height);
						var a = 60 / s.width * s.height;
						o += a > e ? a: e,
						o += 20;
						var r = n.getImageData(0, 0, 360, o);
						i.height = o,
						n.putImageData(r, 0, 0);
						var l = i.toDataURL("image/jpeg", 1);
						t.callback(l)
					}
				}
			}
		} ()
	}

}


var _loginTipstimer;
function logtips(str){
	if( !str ) return false
		_loginTipstimer && clearTimeout(_loginTipstimer)
	jQuery('.sign-tips').html(str).animate({

		height: 29

	}, 220)

	_loginTipstimer = setTimeout(function(){
		jQuery('.sign-tips').animate({
			height: 0
		}, 220)
	}, 5000)
}

function is_name(str) {    
	return /^[\w]{3,16}$/.test(str);
}

function is_mail(str) {
	return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(str);
}

function is_url(str) {
    return /^((http|https)\:\/\/)([a-z0-9-]{1,}.)?[a-z0-9-]{2,}.([a-z0-9-]{1,}.)?[a-z0-9]{2,}$/.test(str);
}

function is_mobile(str){
    return /^[1][3,4,5,7,8,9][0-9]{9}$/.test(str);
}

function grin(tag) {
    var myField;
    tag = ' ' + tag + ' ';
    if (document.getElementById('comment') && document.getElementById('comment').type == 'textarea') {
        myField = document.getElementById('comment');
    } else {
        return false;
    }
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = tag;
        myField.focus();
    }
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        var cursorPos = endPos;
        myField.value = myField.value.substring(0, startPos)
                      + tag
                      + myField.value.substring(endPos, myField.value.length);
        cursorPos += tag.length;
        myField.focus();
        myField.selectionStart = cursorPos;
        myField.selectionEnd = cursorPos;
    }
    else {
        myField.value += tag;
        myField.focus();
    }
}

function scrollTo(name, add, speed){
    if (!speed) speed = 300;
    if (!name) {
        jQuery('html,body').animate({
            scrollTop: 0
        }, speed);
    } else {
        if (jQuery(name).length > 0) {
            jQuery('html,body').animate({
                scrollTop: jQuery(name).offset().top + (add || 0)
            }, speed);
        }
    }
}