const AstEditor = new function() {
	this.db = {};
	this.uploadServer = '';
	this.init = e => {
		$('head').append('<link rel="stylesheet" type="text/css" href="AstEditor/styles.css">');
		$('[ae__asteditor]').each((_,e) => {
			this.newBox($(e));
		});

		$('body').on('ae__toolbox_lock',(_,e) => {
			if (e.html() == '<i class="far fa-lock"></i>') {
				e.html('<i class="far fa-unlock"></i>');
				e.attr('title','Разблокировать toolbox')
				e.parent().children().addClass('ae__locked')
			} else {
				e.html('<i class="far fa-lock"></i>');
				e.attr('title','Заблокировать toolbox')
				e.parent().children().removeClass('ae__locked')
			}
		});
		$('body').on('ae__add_row',(_,e) => {
			let row = new Array(e[0]+1).fill('').map(e => ({type: 'none'}));
			this.db[e[1]].push( row );
			this.render(e[1]);
		});
		$('body').on('ae__remove_row',(_,e) => {
			this.db[e[0]].pop();
			this.render(e[0]);
		});
		$('body').on('ae__show_toolbox',(event,e) => {
			let r = this.db[e[0]][e[1]];
			let b = this.db[e[0]][e[1]][e[2]];
			$('body').append(
				'<div onmousedown="AstEditor.overlayController(event,this)" class="row m-0" style="z-index:99999;width:100vw;height:100vh;position:absolute;top:0;left:0;background:rgba(0,0,0,.25)">'+
					'<div class="col-6 mx-auto my-auto p-3 bg-white rounded-lg shadow">'+
						'<ul class="nav nav-tabs" id="myTab">'+
							'<li class="nav-item">'+
								'<a class="nav-link'+(b.type == 'p' ? ' active' : '')+'" id="ae__p-tab" data-toggle="tab" href="#ae__p">Текст</a>'+
							'</li>'+
							'<li class="nav-item">'+
								'<a class="nav-link'+(b.type == 'img' ? ' active' : '')+'" id="ae__img-tab" data-toggle="tab" href="#ae__img">Изображение</a>'+
							'</li>'+
							'<li class="nav-item">'+
								'<a class="nav-link'+(b.type == 'video' ? ' active' : '')+'" id="ae__video-tab" data-toggle="tab" href="#ae__video">Видео</a>'+
							'</li>'+
							'<li class="nav-item'+(r.length > 1 ? ' d-none' : '')+'">'+
								'<a class="nav-link'+(b.type == 'hr' ? ' active' : '')+'" id="ae__hr-tab" data-toggle="tab" href="#ae__hr">Разделитель</a>'+
							'</li>'+
							'<li class="nav-item">'+
								'<a class="nav-link'+(b.type == 'none' ? ' active' : '')+'" id="ae__none-tab" data-toggle="tab" href="#ae__none">Пустота</a>'+
							'</li>'+
						'</ul>'+
						'<div class="tab-content" id="myTabContent">'+
							'<div class="tab-pane fade'+(b.type == 'p' ? ' show active' : '')+'" id="ae__p">'+
								'<div class="row py-2" style="margin-right:-.5rem;margin-left:-.5rem;">'+
									'<div class="col-3 px-2">'+
										'<label class="m-0">Вертикально</label>'+
										'<select class="custom-select">'+
											'<option'+(typeof b.hAlign != undefined && b.type == 'p' && b.hAlign == 'left' ? ' selected' : '')+' value="left">Слева</option>'+
											'<option'+(typeof b.hAlign != undefined && b.type == 'p' && b.hAlign == 'center' ? ' selected' : '')+' value="center">По центру</option>'+
											'<option'+(typeof b.hAlign != undefined && b.type == 'p' && b.hAlign == 'right' ? ' selected' : '')+' value="right">Справа</option>'+
											'<option'+(typeof b.hAlign != undefined && b.type == 'p' && b.hAlign == 'justify' ? ' selected' : '')+' value="justify">Заполнение</option>'+
										'</select>'+
									'</div>'+
									'<div class="col-3 px-2">'+
										'<label class="m-0">Горизонтально</label>'+
										'<select class="custom-select">'+
											'<option'+(typeof b.vAlign != undefined && b.type == 'p' && b.vAlign == 'start' ? ' selected' : '')+' value="start">Сверху</option>'+
											'<option'+(typeof b.vAlign != undefined && b.type == 'p' && b.vAlign == 'center' ? ' selected' : '')+' value="center">По центру</option>'+
											'<option'+(typeof b.vAlign != undefined && b.type == 'p' && b.vAlign == 'end' ? ' selected' : '')+' value="end">Снизу</option>'+
										'</select>'+
									'</div>'+
									'<div class="col-3 px-2">'+
										'<label class="m-0">Размер</label>'+
										'<select class="custom-select">'+
											'<option'+(typeof b.fSize != undefined && b.type == 'p' && b.fSize == 'h6' ? ' selected' : '')+' value="h6">H6</option>'+
											'<option'+(typeof b.fSize != undefined && b.type == 'p' && b.fSize == 'h5' ? ' selected' : '')+' value="h5">H5</option>'+
											'<option'+(typeof b.fSize != undefined && b.type == 'p' && b.fSize == 'h4' ? ' selected' : '')+' value="h4">H4</option>'+
											'<option'+(typeof b.fSize != undefined && b.type == 'p' && b.fSize == 'h3' ? ' selected' : '')+' value="h3">H3</option>'+
											'<option'+(typeof b.fSize != undefined && b.type == 'p' && b.fSize == 'h2' ? ' selected' : '')+' value="h2">H2</option>'+
											'<option'+(typeof b.fSize != undefined && b.type == 'p' && b.fSize == 'h1' ? ' selected' : '')+' value="h1">H1</option>'+
										'</select>'+
									'</div>'+
									'<div class="col-3 px-2">'+
										'<label class="m-0">Жирность</label>'+
										'<select class="custom-select">'+
											'<option'+(typeof b.fWeight != undefined && b.type == 'p' && b.fWeight == 'normal' ? ' selected' : '')+' value="normal">Normal</option>'+
											'<option'+(typeof b.fWeight != undefined && b.type == 'p' && b.fWeight == 'light' ? ' selected' : '')+' value="light">Light</option>'+
											'<option'+(typeof b.fWeight != undefined && b.type == 'p' && b.fWeight == 'bold' ? ' selected' : '')+' value="bold">Bold</option>'+
										'</select>'+
									'</div>'+
								'</div>'+
								'<textarea class="col-12 p-2 mt-2 mb-0 rounded-lg" rows="15" id="summernote">'+(typeof b.cnt != undefined && b.type == 'p' ? b.cnt : '')+'</textarea>'+
							'</div>'+
							'<div class="tab-pane fade'+(b.type == 'img' ? ' show active' : '')+'" id="ae__img">'+
								'<div class="form-group pt-2 mb-2">'+
									'<p class="m-0">Введите ссылку на изображение</p>'+
									'<p class="m-0" style="font-size:.7rem;margin-top:-.5rem !important">(или кликните на превью, что бы загрузить свое)</p>'+
									'<input type="text" onchange="$(this).parent().next().attr(\'src\',$(this).val())" class="form-control rounded-lg" value="'+(typeof b.cnt != undefined && b.type == 'img' ? b.cnt : '/dist/img/preview_placeholder.jpg')+'">'+
								'</div>'+
								'<img onclick="$(this).next().click()" class="col-12 p-0 rounded-lg cursor-pointer" src="'+(typeof b.cnt != undefined && b.type == 'img' ? b.cnt : '/dist/img/preview_placeholder.jpg')+'">'+
								'<input onchange="AstEditor.imgUploader(this)" type="file" accept=".jpg,.jpeg,.png,.bmp" class="d-none">'+
							'</div>'+
							'<div class="tab-pane fade'+(b.type == 'video' ? ' show active' : '')+'" id="ae__video">'+
								'<div class="form-group pt-2 mb-2">'+
									'<p class="m-0">Введите ссылку на видео Youtube</p>'+
									'<input onchange="AstEditor.videoUploader(this)" type="text" class="form-control rounded-lg" value="'+(b.type == 'video' && typeof b.cnt != undefined ? 'https://youtube.com/watch?v='+b.cnt : '')+'">'+
									'<input type="hidden" value="'+(b.type == 'video' && typeof b.cnt != undefined ? b.cnt : '')+'">'+
								'</div>'+
								(
									b.type == 'video' && typeof b.cnt != undefined ?
									'<div class="mt-2 rounded-lg overflow-hidden embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="https://www.youtube.com/embed/'+b.cnt+'" allowfullscreen></iframe></div>' :
									'<img class="col-12 p-0 rounded-lg" src="/dist/img/preview_placeholder.jpg">'
								)+
							'</div>'+
							'<div class="tab-pane fade'+(b.type == 'hr' ? ' show active' : '')+'" id="ae__hr">'+
								'<p class="py-5 my-5 text-center">Блок будет содержать горизонтальный разделитель</p>'+
							'</div>'+
							'<div class="tab-pane fade'+(b.type == 'none' ? ' show active' : '')+'" id="ae__none">'+
								'<p class="py-5 my-5 text-center">Блок будет пустым</p>'+
							'</div>'+
						'</div>'+
						'<hr class="my-2">'+
						'<div class="row">'+
							'<div class="col-6"><div class="btn btn-danger" onclick="$(this).parent().parent().parent().parent().remove()">Отмена</div></div>'+
							'<div class="col-6 text-right"><div class="btn btn-success" onclick="AstEditor.saveBlock($(this),\''+e[0]+'\','+e[1]+','+e[2]+')">Сохранить</div></div>'+
						'</div>'+
					'<div>'+
				'</div>'
			);
			$("#summernote").summernote({placeholder:"Hello stand alone ui",tabsize:2,height:120,toolbar:[["style",["style"]],["font",["bold","underline","clear"]],["color",["color"]],["para",["ul","ol","paragraph"]],["table",["table"]],["insert",["link"]],["view",["fullscreen","codeview","help"]]]});
		});
	}
	this.newBox = e => {
		boxId = 'box_id_'+Math.floor(Math.random() * 1e9);
		e.attr(boxId,'');
		e.attr('ae__box','');
		e.html(
			'<div ae__content></div>'+
			'<div ae__toolbox>'+
				'<div class="ae__toolbox_container">'+
					'<a target="_blank" href="https://github.com/andrew-astetik/AstEditor" class="ae__symbol text-decoration-none" title="GitHub"><i class="fab fa-github" style="margin-bottom:-.25rem;"></i></a>'+
					'<div class="ae__symbol" title="Добавить строку с 1 блоком" onclick="$(this).trigger(\'ae__add_row\',[[0,\''+boxId+'\']])"><i class="far fa-plus" style="margin-bottom:-.25rem;"></i></div>'+
					'<div class="ae__symbol" title="Добавить строку с 2 блоками" onclick="$(this).trigger(\'ae__add_row\',[[1,\''+boxId+'\']])"><i class="far fa-plus" style="margin-bottom:-.25rem;"></i></div>'+
					'<div class="ae__symbol ae__rotate-center" title="Удалить строку" onclick="$(this).trigger(\'ae__remove_row\',[[\''+boxId+'\']])"><i class="far fa-plus" style="margin-bottom:-.25rem;"></i></div>'+
					'<div class="ae__symbol" title="Добавить строку с 3 блоками" onclick="$(this).trigger(\'ae__add_row\',[[2,\''+boxId+'\']])"><i class="far fa-plus" style="margin-bottom:-.25rem;"></i></div>'+
					'<div class="ae__symbol" title="Добавить строку с 4 блоками" onclick="$(this).trigger(\'ae__add_row\',[[3,\''+boxId+'\']])"><i class="far fa-plus" style="margin-bottom:-.25rem;"></i></div>'+
					'<div class="ae__symbol" title="Заблокировать toolbox" onclick="$(this).trigger(\'ae__toolbox_lock\',[$(this)])"><i class="far fa-lock"></i></div>'+
				'</div>'+
			'</div>'
		);
		this.db[boxId] = [];

		$('['+boxId+']').children('[ae__content]').children().children().mouseover(e => {
			$(e.currentTarget).css('background','rgba(0,0,1,0.1)')
		});
		$('['+boxId+']').children('[ae__content]').children().children().mouseout(e => {
			$(e.currentTarget).css('background','')
		});
	}
	this.getHtml = (e,t=false) => {
		let result = '';
		let box = this.db[e];
		box.forEach((r,ri) => {
			let rowResult = '';
			let toolbox = '';
			r.forEach((b,bi) => {
				let s = ['col-12','col-12 col-md-6','col-12 col-md-4','col-6 col-md-3'];
				switch(b.type) {
					case 'none':
						toolbox = t ? 'onclick="$(this).trigger(\'ae__show_toolbox\',[[\''+e+'\','+ri+','+bi+']])" ' : '';
						rowResult += '<div '+toolbox+'class="p-2 '+s[r.length - 1]+'">'+(t ? '<div class="p-0 py-3 border border-primary rounded-xl col-12 text-center">Настроить</div>' : '')+'</div>';
						break;

					case 'img':
						toolbox = t ? 'onclick="$(this).trigger(\'ae__show_toolbox\',[[\''+e+'\','+ri+','+bi+']])" ' : '';
						rowResult += '<div '+toolbox+'class="p-2 '+s[r.length - 1]+'"><img src="'+b.cnt+'" class="col-12 p-0 rounded-xl"></div>';
						break;

					case 'p':
						toolbox = t ? 'onclick="$(this).trigger(\'ae__show_toolbox\',[[\''+e+'\','+ri+','+bi+']])" ' : '';
						rowResult += '<div '+toolbox+'class="p-2 '+s[r.length - 1]+'"><p class="col-12 p-0 m-0 '+b.fSize+' font-weight-'+b.fWeight+' align-self-'+b.vAlign+' text-'+b.hAlign+'">'+b.cnt+'</p></div>';
						break;

					case 'hr':
						toolbox = t ? 'onclick="$(this).trigger(\'ae__show_toolbox\',[[\''+e+'\','+ri+','+bi+']])" ' : '';
						rowResult += '<div '+toolbox+'class="px-2 col-12"><hr class="my-2"></div>';
						break;

					case 'video':
						toolbox = t ? 'onclick="$(this).trigger(\'ae__show_toolbox\',[[\''+e+'\','+ri+','+bi+']])" ' : '';
						rowResult += '<div '+toolbox+'class="p-2 '+s[r.length - 1]+'"><div '+toolbox+'class="rounded-xl overflow-hidden embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="https://www.youtube.com/embed/'+b.cnt+'" allowfullscreen></iframe></div></div>';
						break;

					default:
						rowResult += '';
						break;
				}
			});
			result += '<div class="row" style="margin-left: -.5rem !important; margin-right: -.5rem !important;">'+rowResult+'</div>';
		});
		return result;
	}
	this.getJson = e => {
		let box = this.db[e];
		return JSON.stringify(box);
	}
	this.render = e => {
		$('['+e+']').children('[ae__content]').html( this.getHtml(e,true) );
	}
	this.renderAll = e => {
		Object.keys(this.db).forEach(k => {
			this.render(k);
		});
	}
	this.readImgURL = (input,target) => {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = e => {
				$.ajax({
					url: this.uploadServer,
					cache: false,
					method: 'POST',
					data: e.target.result,
					success: function(html){
						let resp = JSON.parse(html);
						if (resp.type == 'ok') {
							target.prev().children().val(resp.data);
							target.attr('src', resp.data);
						} else {
							alert('Ошибка: '+resp.data);
						}
					}
				});
			}
			reader.readAsDataURL(input.files[0]);
		}
	}
	this.imgUploader = (e) => {
		this.readImgURL(e,$(e).prev());
	}
	this.videoUploader = (e) => {
		$(e).parent().next().remove();
		let videoTag = $(e).val().match(/(?<=v=)[a-zA-Z0-9-_]+/)[0];
		$(e).next().val(videoTag);
		$(e).parent().append('<div class="mt-2 rounded-lg overflow-hidden embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="https://www.youtube.com/embed/'+videoTag+'" allowfullscreen></iframe></div>')
	}
	this.saveBlock = (e,bid,rid,eid) => {
		let blockData = {};
		blockData.type = e.parent().parent().siblings('ul').children('li').children('.active').attr('href').split('__')[1];
		switch(blockData.type) {
			case 'p':
				let par = e.parent().parent().siblings('div').eq(0).children('#ae__'+blockData.type);
				blockData.cnt = par.children('textarea').val();
				blockData.hAlign = par.children('div').children('div').eq(0).children('select').val();
				blockData.vAlign = par.children('div').children('div').eq(1).children('select').val();
				blockData.fSize = par.children('div').children('div').eq(2).children('select').val();
				blockData.fWeight = par.children('div').children('div').eq(3).children('select').val();
				break;

			case 'img':
				blockData.cnt = e.parent().parent().siblings('div').eq(0).children('#ae__'+blockData.type).children().children('input').val();
				break;

			case 'video':
				blockData.cnt = e.parent().parent().siblings('div').eq(0).children('#ae__'+blockData.type).children().children('input[type=hidden]').val();
				break;
		}
		this.db[bid][rid][eid] = blockData;
		e.parent().parent().parent().parent().remove();
		this.render(bid);
	}
	this.overlayController = (event,e) => {
		if (event.target == e)  {
			$(e).remove();
		}
	} 
}

AstEditor.init();