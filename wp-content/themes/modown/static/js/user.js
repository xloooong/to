jQuery(function($){
	var ajax_url = _MBT.uri+"/action/user.php";

	$(".prices label:last-child").addClass('active');

	$(".checkin").click(function(){
		var that = $(this);
		if(!that.hasClass('disabled')){
			that.addClass("disabled");
			layer.msg("签到中...");
			$.ajax({  
				type: 'POST',  
				url:  ajax_url,  
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
					layer.msg('签到成功！')
					that.addClass('active').text('已签到');
				}  

			});
		}
		
		return false;
		
	});

	$(".user-aff-card").click(function(){
		var i = jQuery(this).data("s-id");
		jQuery("body").append('<div class="mobile-share-bg"><div class="top_tips">请长按图片，将内容推荐给好友</div></div><div class="mobile-share-wrap"></div>'),
		popup.showToast({
			type: "icon",
			time: 1e5
		}),
		utils.ajax({
			url: _MBT.uri+'/action/share.php',
			data: {
				action: "cover_aff"
			},
			type: "POST",
			timeout: 1e4,
			success: function(t) {
				popup.hideToast();
				jQuery('#aff-qrcode').html('').qrcode({
					width: 195,
					height: 195,
					text: jQuery('#aff-qrcode').data('url')
				});
				t.callback = function(e) {
					jQuery(".mobile-share-wrap").html('<img src="' + e + '"><div class="mobile-share-close">×</div>'),
					jQuery(".mobile-share-bg .top_tips").show();
					jQuery('.mobile-share-close').click(function() {
						jQuery(".mobile-share-bg,.mobile-share-wrap").remove();
						jQuery('#aff-qrcode').html('')
					})
				};
				var o = jQuery("#aff-qrcode");
				t.qrcode = o.find("canvas")[0].toDataURL(),
				t.head && t.logo && t.qrcode ? utils.textToAffImage(t) : (popup.showToast({
					type: "text",
					text: "获取推广卡片失败！"
				}), jQuery(".mobile-share-bg,.mobile-share-wrap").remove())
			},
			error: function() {
				popup.showToast({
					type: "text",
					text: "获取推广卡片失败！"
				});
				jQuery(".mobile-share-bg,.mobile-share-wrap").remove()
			}
		});
	});

	$("#avatarphoto").change(function(){
        $("#uploadphoto").ajaxSubmit({
            dataType:  'json',
            beforeSend: function() {
              layer.msg('上传中...', {time: -1});	
            },
            uploadProgress: function(event, position, total, percentComplete) {

            },
            success: function(data) {
	            if (data.error) {
	            	layer.msg(data.msg);	
	                return false;     
	            }else{
	                layer.msg(data.msg);
	                location.reload();     
	            }
            },
            error:function(xhr){
              	layer.msg('上传失败');	
              	return false;
            }
        });				   
		
    });

	$('.container-user').on('click', function(e){

	 	e = e || window.event;
	 	var target = e.target || e.srcElement;
	 	var _ta = $(target);

	 	if( _ta.parent().attr('evt') ){
	 		_ta = $(_ta.parent()[0]);
	 	}else if( _ta.parent().parent().attr('evt') ){
	 		_ta = $(_ta.parent().parent()[0]);
	 	}

	 	var type = _ta.attr('evt')

	 	if( !type || _ta.hasClass('disabled') ) return 

	 		
	 		/* Theme by mobantu.com */
	 		switch( type ){

	 			case 'user.avatar.submit':
          			$("#avatarphoto").trigger("click");
            	break;

            	case 'user.affcover.submit':
          			$("#affphoto").trigger("click");
            	break;

	 			case 'price.select':
	 				$(".prices label").removeClass('active');
	 				_ta.addClass('active');
	 			break;

	 			case 'user.data.submit':

	 			var form = _ta.parent().parent().parent();
	 			var inputs = form.serializeObject();
	 			var ispass = false;
	 			if( inputs.action === 'user.password' ) ispass = true;

	 				if( !inputs.action ){
	 					return
	 				}

	 				if( ispass ){

	 					if( !$.trim(inputs.passwordold) ){
	 						layer.msg('请输入原密码');
	 						return
	 					}

	 					if( !inputs.password || inputs.password.length < 6 ){
	 						layer.msg('新密码不能为空且至少6位');
	 						return
	 					}

	 					if( inputs.password !== inputs.password2 ){
	 						layer.msg('两次密码输入不一致');
	 						return
	 					}
	 				}else{
	 					if( !/.{2,20}$/.test(inputs.nickname) ){
	 						layer.msg('昵称限制在2-20字内');
	 						return
	 					}

	 					if( inputs.qq && !is_qq(inputs.qq) ){
	 						layer.msg('QQ格式错误');
	 						return
	 					}
	 				}

	 				layer.msg('修改中...');

	 				$.ajax({  
	 					type: 'POST',  
	 					url:  ajax_url,  
	 					data: inputs,  
	 					dataType: 'json',
					success: function(data){  
						if( data.error ){
							if( data.msg ){
								layer.msg(data.msg)
							}
							return
						}

						layer.msg('修改成功！');
						cache_userdata = null;
						$('.user-meta:eq(1) input:password').val('')
					}  

				});  



	 				break;


	 				case 'user.email.submit':
		 				var form = _ta.parent().parent().parent();
		 				var inputs = form.serializeObject();
		 				if( !inputs.action ){
		 					return
		 				}

		 				if( !inputs.email ){
		 					layer.msg('邮箱不能为空');
		 					return
		 				}

		 				if( !is_mail(inputs.email) ){
		 					layer.msg('邮箱格式错误');
		 					return
		 				}

		 				if( !inputs.captcha ){
		 					layer.msg('请输入邮箱验证码');
		 					return
		 				}

		 				
		 				layer.msg('修改中...',0)
		 				$.ajax({  
		 					type: 'POST',  
		 					url:  ajax_url,  
							dataType: 'json',
							data: {
								action: inputs.action,
								captcha: inputs.captcha,
								email: inputs.email
							},
							success: function(data){  
								if( data.error ){
									if( data.msg ){
										layer.msg(data.msg)
									}
									return
								}
								layer.msg('邮箱修改成功！');
								location.reload();
							}  

						});
	 				break;

	 				case 'user.mobile.submit':
		 				var form = _ta.parent().parent().parent();
		 				var inputs = form.serializeObject();
		 				if( !inputs.action ){
		 					return
		 				}

		 				if( !inputs.mobile ){
		 					layer.msg('手机号不能为空');
		 					return
		 				}

		 				if( !is_mobile(inputs.mobile) ){
		 					layer.msg('手机号格式错误');
		 					return
		 				}

		 				if( !inputs.captcha ){
		 					layer.msg('请输入手机验证码');
		 					return
		 				}

		 				
		 				layer.msg('修改中...')
		 				$.ajax({  
		 					type: 'POST',  
		 					url:  ajax_url,  
							dataType: 'json',
							data: {
								action: inputs.action,
								captcha: inputs.captcha,
								mobile: inputs.mobile
							},
							success: function(data){  
								if( data.error ){
									if( data.msg ){
										layer.msg(data.msg)
									}
									return
								}
								layer.msg('手机号修改成功！');
								location.reload();
							}  

						});
	 				break;

	 				
	 				case 'user.email.captcha.submit':
		 				var form = _ta.parent().parent().parent();
		 				var inputs = form.serializeObject();

		 				if( !inputs.action ){
		 					return
		 				}

		 				if( !inputs.email ){
		 					layer.msg('邮箱不能为空');
		 					return
		 				}

		 				if( !is_mail(inputs.email) ){
		 					layer.msg('邮箱格式错误');
		 					return
		 				}
		 				var captchabtn = _ta;

		 				if(captchabtn.hasClass("disabled")){
		 					layer.msg('您操作太快了，等等吧')
		 				}else{
		 					layer.msg('发送验证码中...')
		 					captchabtn.addClass("disabled");
		 					$.ajax({  
		 						type: 'POST',  
		 						url:  ajax_url,  
								dataType: 'json',
								data: {
									action: 'user.email.captcha',
									email: inputs.email
								},
								success: function(data){  
									if( data.error ){
										if( data.msg ){
											layer.msg(data.msg);
											captchabtn.removeClass("disabled");   
										}
										return
									}

									layer.msg('验证码已发送至新邮箱！')
									var countdown=60; 
									settime();
									function settime() { 
										if (countdown == 0) { 
											captchabtn.removeClass("disabled");   
											captchabtn.text("重新获取验证码");
											countdown = 60; 
											return;
										} else { 
											captchabtn.addClass("disabled");
											captchabtn.text("重新获取(" + countdown + ")"); 
											countdown--; 
										} 
										setTimeout(function() { settime() },1000) 
									}
								}  
							});
		 				}
	 				break;

	 				case 'user.mobile.captcha.submit':
		 				var form = _ta.parent().parent().parent();
		 				var inputs = form.serializeObject();

		 				if( !inputs.action ){
		 					return
		 				}

		 				if( !inputs.mobile ){
		 					layer.msg('新手机号不能为空');
		 					return
		 				}

		 				if( !is_mobile(inputs.mobile) ){
		 					layer.msg('手机号格式错误');
		 					return
		 				}
		 				var captchabtn = _ta;

		 				if(captchabtn.hasClass("disabled")){
		 					layer.msg('您操作太快了，等等吧')
		 				}else{
		 					layer.msg('发送验证码中...')
		 					captchabtn.addClass("disabled");
		 					$.ajax({  
		 						type: 'POST',  
		 						url:  ajax_url,  
								dataType: 'json',
								data: {
									action: 'user.mobile.captcha',
									mobile: inputs.mobile
								},
								success: function(data){  
									if( data.error ){
										if( data.msg ){
											layer.msg(data.msg);
											captchabtn.removeClass("disabled");   
										}
										return
									}

									layer.msg('验证码已发送至新手机号！')
									var countdown=60; 
									settime();
									function settime() { 
										if (countdown == 0) { 
											captchabtn.removeClass("disabled");   
											captchabtn.text("重新获取验证码");
											countdown = 60; 
											return;
										} else { 
											captchabtn.addClass("disabled");
											captchabtn.text("重新获取(" + countdown + ")"); 
											countdown--; 
										} 
										setTimeout(function() { settime() },1000) 
									}
								}  
							});
		 				}
	 				break;

	 				

	 				case 'user.charge.submit':
	 					var paytype = $("input[name='paytype']:checked").val();
	 					var iframe = 0;
	 					if($("#ice_money").length){
	 						var ice_money = $("#ice_money").val();
	 					}else{
		 					var ice_money = $("input[name='ice_money']:checked").val();
		 				}
	 					if(paytype && ice_money > 0){
	 						layer.msg('跳转中...')
		 					$.ajax({  
		 						type: 'POST',  
		 						url:  ajax_url,  
		 						dataType: 'json',
		 						async: false,
		 						data: {
		 							action: 'user.charge.submit',
		 							paytype: paytype,
		 							ice_money: ice_money
		 						},
		 						success: function(data){  
	 								if(data.iframe){
	 									iframe = 1;
	 									layer.open({
										  	type: 2,
										  	title: false,
										  	shadeClose: false,
										  	shade: 0.8,
										  	area: ['330px', '470px'],
										  	content: data.url+"&iframe=1"
										});
	 									return false;
	 								}
		 						} 
		 					}); 
	 					}

	 					if(iframe){
	 						return false;
	 					}

	 				break;
	 				
	 				case 'user.charge.card.submit':
	 				if(document.getElementById("erphpcard_num").value==""){
	 					layer.msg("请输入充值卡号");
	 					return false;
	 				}else{
	 					layer.msg('充值中...')
	 					$.ajax({  
	 						type: 'POST',  
	 						url:  ajax_url,  
	 						dataType: 'json',
	 						data: {
	 							action: 'user.charge.card',
	 							num: document.getElementById("erphpcard_num").value
	 						},
	 						success: function(data){  
	 							if( data.error ){
	 								if( data.msg ){
	 									layer.msg(data.msg)
	 								}
	 								return
	 							}
	 							layer.msg('充值成功')
	 							location.reload();
	 						}  
	 					}); 
	 				}
	 				break;

	 				case 'user.mycred.submit':
	 				if(document.getElementById("erphpmycred_num").value==""){
	 					layer.msg("请输入要兑换的数量");
	 					return false;
	 				}else{
	 					layer.msg('兑换中...')
	 					$.ajax({  
	 						type: 'POST',  
	 						url:  ajax_url,  
	 						dataType: 'json',
	 						data: {
	 							action: 'user.mycred',
	 							num: document.getElementById("erphpmycred_num").value
	 						},
	 						success: function(data){  
	 							if( data.error ){
	 								if( data.msg ){
	 									layer.msg(data.msg)
	 								}
	 								return
	 							}
	 							layer.msg('兑换成功')
	 							location.reload();
	 						}  
	 					}); 
	 				}
	 				break;

	 				case 'withdraw.submit':

	 				var form = _ta.parent().parent().parent()

	 				var inputs = form.serializeObject()

		                if( !inputs.ice_alipay ){
		                    layer.msg('支付宝账号不能为空')
		                    return
		                }

		                if( !inputs.ice_name ){
		                    layer.msg('支付宝姓名不能为空')
		                    return
		                }

		                if( !inputs.ice_money ){
		                    layer.msg('提现金额不能为空')
		                    return
		                }

		                layer.msg('申请中...')

			            $.ajax({  
			                type: 'POST',  
			                url:  ajax_url,  
			                data: {
			                	action: 'user.withdraw',
			                	ice_alipay: $("#ice_alipay").val(),
			                	ice_name: $("#ice_name").val(),
			                	ice_money: $("#ice_money").val()
			                },
			                dataType: 'json',
			                success: function(data){  

			                    if( data.error ){
			                        if( data.msg ){
			                            layer.msg(data.msg)
			                        }
			                        return
			                    }

			                    layer.msg('申请成功，请等待审核！')

			                    location.href=_MBT.usr+"?action=withdraws";
			                }  
			            });  

		            break;
	 				

	 				case 'user.vip.submit':
						
		 				if(!_ta.hasClass('disabled')){
			 				_ta.addClass('disabled');
			 				var msgTips = layer.msg('升级中...')

			 				$.ajax({  

			 					type: 'POST',  

			 					url:  ajax_url,  

			 					dataType: 'json',

			 					data: {

			 						action: 'user.vip',

			 						userType: _ta.data("type"),

			 					},

			 					success: function(data){  
			 						layer.close(msgTips);
			 						if( data.error ){

			 							if(data.error == 3){
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
												var msgTips = layer.msg('升级中...');
												jQuery.post(
												_MBT.uri+'/action/user.php',
												{
													userType: jQuery(this).data("type"),
													action: "user.vip.credit"
												},
												function (data) {
													layer.close(msgTips);
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

			 							_ta.removeClass('disabled');

			 							return

			 						}

			 						layer.msg('升级成功')
			 						location.reload();

			 						cache_vipdata = null

			 					}  

			 				});  
			 			}
				 		
		 				return false;

	 				break;

	 				case 'user.social.ews.bind':
	 					$(".erphp-weixin-scan-bind").slideDown();
	 					if(MOBANTU.mpfp){
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
						                            }else if(data.status == "2"){
						                                clearInterval(erphpWeixinScan);
						                                if(typeof(layer) != "undefined"){
						                                    layer.msg("绑定失败！此微信已绑定过其他账号了～");
						                                }
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
	 					}
	 				break;

	 				case 'user.social.cancel':
	 				layer.msg('解绑中...')
	 				var type = _ta.data('type');

 					$.ajax({  

	 					type: 'POST',  

	 					url:  ajax_url,  

	 					dataType: 'json',

	 					data: {

	 						action: 'user.social.cancel',

	 						type: type,

	 					},

	 					success: function(data){  

	 						if( data.error ){

	 							if( data.msg ){

	 								layer.msg(data.msg)

	 							}

	 							return

	 						}

	 						layer.msg('解绑成功')
	 						location.reload();

	 					}  

	 				});  
	 				

	 			}

	 		})



});



function is_name(str) {    

	return /^[\w]{3,16}$/.test(str) 

}

function is_url(str) {

	return /^((http|https)\:\/\/)([a-z0-9-]{1,}.)?[a-z0-9-]{2,}.([a-z0-9-]{1,}.)?[a-z0-9]{2,}$/.test(str)

}

function is_qq(str) {

	return /^[1-9]\d{4,13}$/.test(str)

}

function is_mail(str) {

	return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(str)

}