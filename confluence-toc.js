(function() {
	bookmarkSign = '★';

	tocGoto = function(index) {
		$([document.documentElement, document.body]).animate({
			scrollTop: $('.toc-' + index).offset().top - 80
		}, 0);
	};

	buildTocBox = function() {
		
		$('body').append('<div id="toc-box"><div id="toc-toggle-box"><button id="toc-toggle" title="Mostra/nascondi indice">Indice</button></div></div>');
		$('#toc-box').css({'position': 'fixed', 'top': '100px', 'right': '10px', 'font-size': 'smaller'});
		$('#toc-toggle-box').css({'text-align': 'right'});
		$('#toc-toggle').css({'cursor': 'pointer'});

		$('#toc-box').append('<div id="toc-content-box"><ul id="toc-bookmark"></ul><ol id="toc-content"></ol></div>');
		var maxHeight = $('body').height() - 140 + 'px';
		$('#toc-content-box').css({'display': 'none', 'background-color': 'white', 'border': '1px solid gray', 'max-height': maxHeight, 'overflow': 'auto'});
		$('#toc-bookmark').css({'border-bottom': '1px solid gray', 'padding-inline-start': '5px'});
		$('#toc-content').css({'margin': '0', 'padding-inline-start': '20px'});
		
		$('#toc-toggle').click(function() {
			if ($('#toc-content-box').is(":hidden")) {
				$('#toc-content-box').show();
			} else {
				$('#toc-content-box').hide();
			}
		})
	};

	saveBookmarks = function() {
		var list = new Array();
		$('#toc-bookmark li').each(function() {
			var bookmark = {};
			bookmark.id = $(this).data('toc-id');
			bookmark.title = $(this).find('.toc-bookmark-link').text();
			list.push(bookmark);
		});
		
		var savedBookmarks = JSON.parse(localStorage.getItem('my-bookmarks'));
		if (savedBookmarks == null) {
			savedBookmarks = new Array();
			var pageBookmarks = {};
			pageBookmarks.url = window.location.href;
			pageBookmarks.list = new Array();
			savedBookmarks.push(pageBookmarks);
		}
		
		for (var i = 0; i < savedBookmarks.length; i++) {
			if (savedBookmarks[i].url == window.location.href) {
				savedBookmarks[i].list = list;
			}
		}
		
		localStorage.setItem('my-bookmarks', JSON.stringify(savedBookmarks));
	};

	loadBookmarks = function() {
		var savedBookmarks = JSON.parse(localStorage.getItem('my-bookmarks'));
		
		if (savedBookmarks != null) {
			for (var i = 0; i < savedBookmarks.length; i++) {
				if (savedBookmarks[i].url == window.location.href) {
					
					var pageBookmarks = savedBookmarks[i].list;
					
					for (var i = 0; i < pageBookmarks.length; i++) {
						var id = pageBookmarks[i].id;
						var title = pageBookmarks[i].title;
						addBookmark(id, title);
					}
				}
			}
		}
	};

	addBookmark = function(id, title) {
		if ($('.toc-bookmark-' + id).length == 0) {
			title = title.replace(bookmarkSign, '');
			$('#toc-bookmark').append('<li class="toc-bookmark-' + id + '" data-toc-id="' + id + '">'
				+ '<span style="color: orange">' + bookmarkSign + '</span> '
				+ '<a class="toc-bookmark-link" href="javascript:tocGoto(' + id + ')">' + title + '</a> ' 
				+ '<a class="bookmark-delete" href="javascript:removeBookmark(' + id + ')" style="color: red">X</a></li>');
				
			$('.toc-bookmark-' + id).css({ 'list-style': 'none'});
			$('.toc-add-bookmark-' + id).css({ 'color': 'orange'});
			
			$("#toc-bookmark li").sort(function(a, b) {
				return parseInt($(b).data('toc-id')) < parseInt($(a).data('toc-id')) ? 1 : -1;    
			}).appendTo('#toc-bookmark');
			$('#toc-content-box').scrollTop(0);
		}
	};

	removeBookmark = function(id) {
		$('.toc-bookmark-' + id).remove();
		$('.toc-add-bookmark-' + id).css({ 'color': 'gray'});
		saveBookmarks();
	};

	generateToc = function(name) {
		
		buildTocBox();
		curr1 = '';
		curr2 = '';
		curr3 = '';
		
		$('#main-content').find('h1, h2, h3, strong').each(function(index) {
			var title = $(this).text();
			
			if ($(this).is('h1')) {
				curr1 = index;
				curr2 = '';
				curr3 = '';
				
				$('#toc-content').append('<li><a href="javascript:tocGoto(' + index + ')">' + title + '</a><ol id="toc-list-' + index + '"></ol></li>');
			} else if ($(this).is('h2')) {
				curr2 = index;
				curr3 = '';
				
				var par = curr1 != '' ? '#toc-list-' + curr1 : '#toc-content';
				$(par).append('<li><a href="javascript:tocGoto(' + index + ')">' + title + '</a><ol id="toc-list-' + index + '"></ol></li>');
			} else if ($(this).is('h3')) {
				curr3 = index;
				
				var par = curr2 != '' ? '#toc-list-' + curr2 : curr1 != '' ? '#toc-list-' + curr1 : '#toc-content';
				$(par).append('<li><a href="javascript:tocGoto(' + index + ')">' + title + '</a><ol id="toc-list-' + index + '"></ol></li>');
			} else if ($(this).is('strong')) {
				
				if ($(this).closest('table').length != 0 || title != $(this).parent().text()) {
					return;
				}
					
				var par = curr3 != '' ? '#toc-list-' + curr3 : curr2 != '' ? '#toc-list-' + curr2 : curr1 != '' ? '#toc-list-' + curr1 : '#toc-content';
				$(par).append('<li><a href="javascript:tocGoto(' + index + ')">' + title + '</a></li>');
			}
			
			$(this).data('toc-id', index).addClass('toc').addClass('toc-' + index);
			$(this).append('<span class="toc-add-bookmark toc-add-bookmark-' + index + '">' + bookmarkSign + '</span>');
			
			$('#toc-list-' + index).css({'margin': '0', 'padding-inline-start': '20px'});
		});
		
		$('.toc-add-bookmark').css({ 'color': 'gray', 'cursor': 'pointer'});
		$('.toc-add-bookmark').click(function() {
			var titleElem = $(this).parent();
			var id = titleElem.data('toc-id');
			var title = titleElem.text();
			addBookmark(id, title);
			saveBookmarks();
		})
	};

	generateToc();
	loadBookmarks();

})();
