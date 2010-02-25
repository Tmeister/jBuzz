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
		function cuteDate(date)
		{
			
			if( date.length == 0)
			{
				return "";
			}
			
			var regexp = 	"([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
    								"(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
    								"(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    		
			var d = date.match(new RegExp(regexp));
		    
			var offset = 0;
		    var date = new Date(d[1], 0, 1);
		    if (d[3]) { date.setMonth(d[3] - 1); }
		    if (d[5]) { date.setDate(d[5]); }
		    if (d[7]) { date.setHours(d[7]); }
		    if (d[8]) { date.setMinutes(d[8]); }
		    if (d[10]) { date.setSeconds(d[10]); }
		    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
		    if (d[14]) {
		        offset = (Number(d[16]) * 60) + Number(d[17]);
		        offset *= ((d[15] == '-') ? 1 : -1);
		    }
		    offset -= date.getTimezoneOffset();
		    d = (Number(date) + (offset * 60 * 1000));
		    dateFunc = new Date();
			timeSince = dateFunc.getTime() - d;
			inSeconds = timeSince / 1000;
			inMinutes = timeSince / 1000 / 60;
			inHours = timeSince / 1000 / 60 / 60;
			inDays = timeSince / 1000 / 60 / 60 / 24;
			inYears = timeSince / 1000 / 60 / 60 / 24 / 365;
			
			if(Math.round(inSeconds) == 1)
			{
				return "1 second ago";
			}
			else if(inMinutes < 1.01)
			{
				return (Math.round(inSeconds) + " seconds ago");
			}
			else if(Math.round(inMinutes) == 1){
				return "1 minute ago";
			}
			else if(inHours < 1.01)
			{
				return (Math.round(inMinutes) + " minutes ago");
			}
			else if(Math.round(inHours) == 1)
			{
				return "1 hour ago";
			}
			else if(inDays < 1.01)
			{
				return (Math.round(inHours) + " hours ago");
			}
			else if(Math.round(inDays) == 1)
			{
				return "1 day ago";
			}
			else if(inYears < 1.01)
			{
				return (Math.round(inDays) + " days ago");
			}
			else if(Math.round(inYears) == 1)
			{
				return ("1 year ago");
			}
			else
			{
				return (Math.round(inYears) + " years ago");
			}
		}
})(jQuery);