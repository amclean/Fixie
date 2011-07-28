(function($){    
  $.fn.fixie = function(options){
    var $j = jQuery;
    var me = this;
    
    // bind the events
    this.bindEvents = function(){
      $j(settings.target).bind(settings.event+'.'+settings.token, settings.callback);
      $j(window).bind('resize.'+settings.token,this.onReflow);
      
    };
    
    // triggered on page reflows and resizes
    this.onReflow = function(){
      settings.offset = settings.el.offset();
      me.evaluate();
    };
    
    // check position of monitored element
    this.evaluate = function(){
      if(settings.fixed === false){
        if(window.pageYOffset >= settings.offset.top && window.pageYOffset+settings.dimensions.height < settings.container.height){
          settings.el.css({ position: 'fixed', left: settings.offset.left+settings.offsetX, top: settings.offsetY })
          settings.fixed = true;
          settings.glued = false;          
          settings.onFix();
          settings.onUnGlue();
          return;
        }
      }
      
      if(settings.fixed === true){
        if(window.pageYOffset <= settings.offset.top){     
          settings.el.css(settings.original);
          settings.fixed = false;
          settings.glued = false;
          settings.onUnFix();
          settings.onUnGlue();
        }
        if(window.pageYOffset+settings.dimensions.height >= settings.container.height && settings.constrain === true){
          settings.el.css({ position: 'absolute', right: settings.original.right, left: settings.original.left, top: window.pageYOffset-settings.container.el.offset().top+'px' });          
          settings.fixed = false;
          settings.glued = true;
          settings.onGlue();
        }
      }
    };
    
    // destroy bound events
    this.destroy = function(){
      $j(settings.target).unbind(settings.event+'.'+settings.token);
    };    
    
    // default settings
    var settings  = {
      el          : null,
      fixed       : false,
      target      : window,
      container   : {},
      event       : 'scroll',
      callback    : this.evaluate,
      position    : null,
      offset      : null,
      glued       : false,
      offsetX     : 0,
      offsetY     : 0,
      thresholdX  : 0,
      thresholdY  : 0,
      onFix       : function(){ return true; },
      onGlue      : function(){ return true; },
      onUnFix     : function(){ return true; },
      onUnGlue    : function(){ return true; },      
      // should the element stick to the inside of its container
      constrain   : true,
      // random token for namespacing events
      token       : 123
    };

    return this.each(function(){
      settings.token            = Math.random() * 100000;
      settings.el               = $(this);
      settings.position         = settings.el.position();
      settings.original         = {
        position  : settings.el.css('position'),
        top       : settings.el.css('top'),
        right     : settings.el.css('right'),
        bottom    : settings.el.css('bottom'),
        left      : settings.el.css('left')                        
      };
      settings.offset           = settings.el.offset();
      // merge options into settings      
      if(options) $.extend(settings, options);
      // get initial bounds for container
      settings.container.el     = ('el' in settings.container) ? $j(settings.container.el) : settings.el.parent()
      settings.container.height = settings.container.el.height();
      settings.container.width  = settings.container.el.width();      
      // get initial bounds for element      
      settings.dimensions       = { 
        width    : settings.el.width(),
        height   : settings.el.height()
      };      
      
      me.bindEvents();
    });

  };
})(jQuery);

