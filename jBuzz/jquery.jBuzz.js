(function($) 
{
	jQuery.getFeed = function(options) 
	{
	    options = jQuery.extend({
	        url: null,
	        success: null
	    }, options);
	    if(options.url) {
	
			$.ajax({
	            type: 'GET',
	            url: options.url,
	            dataType: 'xml',
	            success: function(xml) {
	            	var feed = new JFeed(xml);
	                if(jQuery.isFunction(options.success)) options.success(feed);
	            }
	        });
	    }
	};
	
	$.fn.defaults = {	user:null, count:5};
	
	$.fn.jBuzz = function(options) 
	{
		return this.each(function() 
		{
			var $this = $(this);
			
			var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
			
			var opts = $.extend({}, $.fn.defaults, options);
			
			
			
			if( opts.user == null )
			{
				return;
			}
			
			header = ''
			+'<div id="jBuzz-wrapper">'
			+'	<div id="jBuzz-wrapper-outter">'
			+'	<div id="jBuzz-wrapper-inner">'
			+'	<div id="jBuzz-header">'
			+'	<div id="jBuzz-avatar">'
			+'	<div id="jBuzz-avatar-outter">'
			+'	<div id="jBuzz-avatar-inner">'
			+'	<img width=50 heaight=50 title="Avatar" alt="Avatar" id="jBuzz-avatar-image" />'
			+'	</div>'
			+'	</div>	'
			+'	</div>'
			+'	<div id="jBuzz-user-data">'
			+'	<div id="jBuzz-user-name">'
			+'	<span class="jBuzz-name"></span><br />'
			+'	<span class="jBuzz-nick">'+opts.user+'</span><br />'
			+'	<div class="jBuzz-btn "><a href="#" id="jBuzz-btn-link">Follow me!</a></div> '
			+'	</div>'
			+'	</div>'
			+'	</div>'
			+'	<div id="jBuzz-posts">'
			+'	<div align="center" style="display:block;"><img src="jBuzz/loader.gif" alt="Loading" /></div> ';
			
			footer = ''
			+'	</div>'
			+'	<div id="jBuzz-credits">'
			+'	<div id="jBuzz-credits-content">'
			+'	<span class="jBuzz-by"><a href="http://klr20mg.com">By Tmeister</a></span>'
			+'	<span class="jBuzz-google"><a href="http://buzz.google.com">Powered by Google Buzz</a></span>'
			+'	<div class="jBuzz-clear"></div>'
			+'	</div>'
			+'	</div>'
			+'	</div>'
			+'	</div>'
			+'</div>'
			$.getJSON("proxy.php?url=http://socialgraph.apis.google.com/lookup?q=http://www.google.com/profiles/"+opts.user,
				function (data)
				{
					photo = eval(data.nodes["http://www.google.com/profiles/"+opts.user]).attributes.photo;
					name = eval(data.nodes["http://www.google.com/profiles/"+opts.user]).attributes.fn;
					profile = eval(data.nodes["http://www.google.com/profiles/"+opts.user]).attributes.profile;
					$this.append( header + footer );
					$($this).find("#jBuzz-avatar-image").attr("src", photo);
					$($this).find("#jBuzz-btn-link").attr("href", profile);
					$($this).find(".jBuzz-name").html(name);
				}
			);
			
			jQuery.getFeed({
				url: "proxy.php?type=xml&url=http://buzz.googleapis.com/feeds/"+opts.user+"/public/posted",
				success: function (feed)
				{
					buzzes = '';
					for(var i = 0; i < feed.items.length && i < opts.count; i++) 
					{
		                var item = feed.items[i];
		                buzzes += '<div class="jBuzz-post-content">'
						buzzes += '<p>'+item.summary+'</p>'
						buzzes += '<span class="jBuzz-date">'+cuteDate( item.published )+'</span>'
						buzzes += '<span class="jBuzz-comments"><a href="'+item.link+'">'+item.comment_count+' Comments</a></span>'
						buzzes += '<div class="jBuzz-clear">	</div>'
						buzzes += '</div>'
		            }
		            $("#jBuzz-posts").html(buzzes);
				}
			});
		});
	};
	function JFeed(xml) 
		{
		    if(xml) this.parse(xml);
		};
		JFeed.prototype = {
		    type: '',
		    version: '',
		    title: '',
		    link: '',
		    description: '',
		    parse: function(xml) 
		    {
			    if(jQuery('feed', xml).length == 1) 
			    {
			        this.type = 'atom';
		            var feedClass = new JAtom(xml);
		        }
		        if(feedClass) jQuery.extend(this, feedClass);
		    }
		};
		function JFeedItem() {};
		JFeedItem.prototype = {
		    title: '',
		    link: '',
		    description: '',
		    updated: '',
		    id: '',
		    summary:'',
		    published:'',
		    author_name:'',
		    author_uri:'',
		    comment_uri:'',
		    comment_count:''
		};
		function JAtom(xml) 
		{
		    this._parse(xml);
		};
		
		JAtom.prototype = 
		{
		    _parse: function(xml) 
		    {
	        	var channel = jQuery('feed', xml).eq(0);
		        this.version = '1.0';
		        this.title = jQuery(channel).find('title:first').text();
		        this.link = jQuery(channel).find('link:first').attr('href');
		        this.description = jQuery(channel).find('subtitle:first').text();
		        this.language = jQuery(channel).attr('xml:lang');
		        this.updated = jQuery(channel).find('updated:first').text();
		        this.author = jQuery(channel).find('author:first');
		        this.author_name = jQuery(this.author).find('name:first').text();
		        this.author_uri = jQuery(this.author).find('uri:first').text();
		        this.items = new Array();
		        var feed = this;
		        jQuery('entry', xml).each( function() 
		        {
		            var item = new JFeedItem();
		            item.title = jQuery(this).find('title').eq(0).text();
		            item.link = jQuery(this).find('link').eq(0).attr('href');
		            item.description = jQuery(this).find('content').eq(0).text();
		            item.updated = jQuery(this).find('updated').eq(0).text();
		            item.id = jQuery(this).find('id').eq(0).text();
		            item.summary = jQuery(this).find('summary').eq(0).text();
		        	item.published = jQuery(this).find('published').eq(0).text();
		        	author = jQuery(this).find('author').eq(0);
		        	item.author_name =  jQuery(author).find('name:first').eq(0).text();
		        	item.author_uri =  jQuery(author).find('uri:first').eq(0).text();
		        	links = jQuery(this).find('link');
		        	for (var i = links.length - 1; i >= 0; i--)
		        	{
		        		if ( jQuery(links[i]).attr('rel') == "replies")
		        		{
		        			item.comment_uri = jQuery(links[i]).attr('href');
		        			break;
		        		}
		        	};
		        	item.comment_count = jQuery(this).find('thr\\:total:first').eq(0).text()
		            feed.items.push(item);
		        });
		    }
		};
		
		
		function cuteDate(time){
	    var date = new Date((time.replace(/.000Z/g,'Z') || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		    diff = (((new Date()).getTime() - date.getTime()) / 1000),
		    day_diff = Math.floor(diff / 86400), month_diff = Math.floor( day_diff / 30 );
			
	    if ( isNaN(day_diff) || day_diff < 0 )
		    return ;
			
	    return day_diff == 0 && (
			    diff < 60 && "just now" ||
			    diff < 120 && "1 minute ago" ||
			    diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			    diff < 7200 && "1 hour ago" ||
			    diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		    day_diff == 1 && "Yesterday" ||
		    day_diff < 7 && day_diff + " days ago" ||
		    day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago" || 
		    month_diff == 1 && "This Month" ||
		    month_diff < 12 && month_diff + " months ago" ||
		    month_diff >= 12 && Math.ceil( day_diff / 12 ) + " years ago" ;
    }
})(jQuery);














