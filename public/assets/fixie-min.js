(function(a){a.fn.fixie=function(b){var e=jQuery;var d=this;this.bindEvents=function(){e(c.target).bind(c.event+"."+c.token,c.callback);e(window).bind("resize."+c.token,this.onReflow)};this.onReflow=function(){c.offset=c.el.offset();d.evaluate()};this.evaluate=function(){if(c.fixed===false){if(window.pageYOffset>=c.offset.top&&window.pageYOffset+c.dimensions.height<c.container.height){c.el.css({position:"fixed",left:c.offset.left+c.offsetX,top:c.offsetY});c.fixed=true;c.glued=false;c.onFix();c.onUnGlue();return}}if(c.fixed===true){if(window.pageYOffset<=c.offset.top){c.el.css(c.original);c.fixed=false;c.glued=false;c.onUnFix();c.onUnGlue()}if(window.pageYOffset+c.dimensions.height>=c.container.height&&c.constrain===true){c.el.css({position:"absolute",right:c.original.right,left:c.original.left,top:window.pageYOffset-c.container.el.offset().top+"px"});c.fixed=false;c.glued=true;c.onGlue()}}};this.destroy=function(){e(c.target).unbind(c.event+"."+c.token)};var c={el:null,fixed:false,target:window,container:{},event:"scroll",callback:this.evaluate,position:null,offset:null,glued:false,offsetX:0,offsetY:0,thresholdX:0,thresholdY:0,onFix:function(){return true},onGlue:function(){return true},onUnFix:function(){return true},onUnGlue:function(){return true},constrain:true,token:123};return this.each(function(){c.token=Math.random()*100000;c.el=a(this);c.position=c.el.position();c.original={position:c.el.css("position"),top:c.el.css("top"),right:c.el.css("right"),bottom:c.el.css("bottom"),left:c.el.css("left")};c.offset=c.el.offset();if(b){a.extend(c,b)}c.container.el=("el" in c.container)?e(c.container.el):c.el.parent();c.container.height=c.container.el.height();c.container.width=c.container.el.width();c.dimensions={width:c.el.width(),height:c.el.height()};d.bindEvents()})}})(jQuery);