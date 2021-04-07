jQuery(function($){
	var ajax_url = _MBT.uri+"/action/ticket.php";
	var _tipstimer
	var allowtypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

	function tips(str){
		if( !str ) return false
			_tipstimer && clearTimeout(_tipstimer)
		$('.user-tips').html(str).animate({
			top: 0
		}, 220)
		_tipstimer = setTimeout(function(){
			$('.user-tips').animate({
				top: -30
			}, 220)
		}, 5000)
	}

	$('.ticket-reply-submit').click(function(){
		_ta = $(this);
		_ta.addClass('disabled')

		var forms = $('.ticket-reply').serializeObject()
		forms.action = 'ticket.reply'

		if( forms.content.length<10 || forms.content.length>500 ){
			tips( '回复内容在10-500字之间' )
			_ta.removeClass('disabled')
			return
		}

		if( forms.pic && forms.pic.length > 3 ){
			tips( '图片最多上传3张' )
			_ta.removeClass('disabled')
			return
		}
		tips('回复中...')
		$.ajax({
			url: ajax_url,
			type: 'POST',
			dataType: 'json',
			data: forms,
			success: function(data, textStatus, xhr) {
				if( data.msg ){
					tips( data.msg )
				}

				if( !data.error ){

					$('.ticket-reply textarea').val('')
					if($('.ticket-reply .pics').length){
						$('.ticket-reply .pics').html('')
						for (var i = 0; i < 3; i++) {
							$('.ticket-reply .pics').append('<div class="pic pic-no ticket-upload"><i class="dripicons dripicons-plus"></i></div>')
						};
					}
					var imgs = ''
					if( data.pic ){
						imgs += '<div class="thumbs">'
						for (var i = 0; i < data.pic.length; i++) {
							imgs += '<img class="ticket-thumb" src="'+data.pic[i]+'">'
						};
						imgs += '</div>'
					}
					var adminr = ''
					if(data.admin) adminr = 'class="ticket-item-reply"'
					$('.ticket-item-content').append('<dl '+adminr+'><dt>'+data.avatar+'</dt><dd>'+data.content+imgs+'</dd></dl>')
				}
				_ta.removeClass('disabled')
			},
			error: function(xhr, textStatus, errorThrown) {
				_ta.removeClass('disabled')
			}
		});
	});

	$('.ticket-new-submit').click(function(){
		var forms = $('.ticket-new').serializeObject();
		_ta = $(this);
		forms.action = 'ticket.new'

		if( !forms.item ){
			tips( '请选择工单类别' )
			_ta.removeClass('disabled')
			return
		}

		if( forms.content.length<10 || forms.content.length>500 ){
			tips( '提问内容在10-500字之间' )
			_ta.removeClass('disabled')
			return
		}
		
		if( !forms.email ){
	        tips('邮箱不能为空')
			_ta.removeClass('disabled')
	        return
	    }

	    if( !is_mail(forms.email) ){
	        tips('邮箱格式错误')
			_ta.removeClass('disabled')
	        return
	    }

		if( forms.pic && forms.pic.length > 3 ){
			tips( '图片最多上传3张' )
			_ta.removeClass('disabled')
			return
		}

		tips('提交中...')
		$.ajax({
			url: ajax_url,
			type: 'POST',
			dataType: 'json',
			data: forms,
			success: function(data, textStatus, xhr) {
				if( data.msg ){
					tips( data.msg )
				}

				if( !data.error ){
					tips('提交成功')
					location.href = window.location.href+'&id='+data.id
				}
				_ta.removeClass('disabled')
			},
			error: function(xhr, textStatus, errorThrown) {
				tips('提交失败')
				alert(errorThrown);
				_ta.removeClass('disabled')
			}
		});
	});

	$('.ticket-close').click(function(){
		_ta = $(this);
		_ta.addClass('disabled')
		var id = $.trim($('.ticket-reply [name="id"]').val())

		if( id <= 0 ){
			tips( '工单异常' )
			_ta.removeClass('disabled')
		}

		if(window.confirm('确定关闭该工单？')){
            $.ajax({
				url: ajax_url,
				type: 'POST',
				dataType: 'json',
				data: {
					id: id,
					action: 'ticket.close'
				},
				success: function(data, textStatus, xhr) {
					if( data.msg ){
						tips( data.msg )
					}

					if( !data.error ){
						location.reload()
					}
					_ta.removeClass('disabled')
				},
				error: function(xhr, textStatus, errorThrown) {
					_ta.removeClass('disabled')
				}
			});
        }
	});

	$('.ticket-solved').click(function(){
		_ta = $(this);
		_ta.addClass('disabled')
		var id = $.trim($('.ticket-reply [name="id"]').val())

		if( id <= 0 ){
			tips( '工单异常' )
			_ta.removeClass('disabled')
		}

		if(window.confirm('确定该工单已解决？')){
            $.ajax({
				url: ajax_url,
				type: 'POST',
				dataType: 'json',
				data: {
					id: id,
					action: 'ticket.solved'
				},
				success: function(data, textStatus, xhr) {
					if( data.msg ){
						tips( data.msg )
					}

					if( !data.error ){
						location.reload()
					}
					_ta.removeClass('disabled')
				},
				error: function(xhr, textStatus, errorThrown) {
					_ta.removeClass('disabled')
				}
			});
        }
	});

	$('body').on('click','.ticket-upload .dripicons-plus',function(){
		_ta = $(this).parent();
		
		$('.ticket-file').trigger('click')

		$('.ticket-file').change(function(){
	        var file = $(this).get(0).files[0]
	        if( file.size > 102400*5 ){
	            tips( '上传的图片不能大于500KB' )
	            return false
	        }

	        if( $.inArray(file.type, allowtypes)==-1 ){
	            tips( '上传的图片格式应是：jpeg、jpg、png、gif' )
	            return false
	        }

	        $('body').append('<form id="itemimg-form" style="display:none" enctype="multipart/form-data" action="'+ajax_url+'" method="post"><input type="hidden" name="action" value="ticket.upload"></form>')
	        $(this).after( $(this).clone(true) )

	        $(this).attr('name', 'file').appendTo('#itemimg-form')

	        $('#itemimg-form').ajaxSubmit({
	            dataType: 'json',
	            beforeSubmit: function (data) { },
	            success: function (data) {
	                if( data.msg ){
	                    tips( data.msg )
	                }

	                if( !data.error ){
	                    _ta.html('<img src="'+data.img+'"><input type="hidden" value="'+data.img+'" name="pic[]"><a href="javascript:;" class="pic-delete"><i class="dripicons dripicons-cross"></i></a>').removeClass('pic-no')
	                    $('.pic-delete').click(function(){
							$(this).parent().html('<i class="dripicons dripicons-plus"></i>').addClass('pic-no')
						});
	                }
	            }
	        })

	        $('#itemimg-form').remove()
	    })
		
	});


	$('.ticket-thumb').click(function(){
		_ta = $(this);
		if( !$('.ticket-thumb-lg').length ){
			$('.container-user').append('<div class="ticket-thumb-lg"><div class="ticket-thumb-mask ticket-thumb-close"></div><div class="ticket-thumb-content"><img ></div></div>')
		}else{
			$('.ticket-thumb-lg').show()
		}

		$('.ticket-thumb-close').click(function(){
			_ta = $(this);
			_ta.parent().hide()
		});

		ticket_thumbs = _ta.parent().children()
		ticket_thumbs_index = _ta.index()

		$('.ticket-thumb-content').css({
			'margin-top': _ta[0].naturalHeight/2*-1-20,
			'margin-left': _ta[0].naturalWidth/2*-1
		}).find('img').attr('src', _ta.attr('src'))
	});


});