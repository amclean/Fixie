var fixie = function(target,parent, positionProfile, overrides){
  this.id               = Math.random() * 10000;
  this.target           = jQuery(target);
  this.parent           = jQuery(parent);
  
  this.axis             = 'y';
  this.positioned       = false;
  this.monitoring       = false;
          
  this.offset           = this.getOffset();
  this.timer            = null;
  this.state            = null;
  this.lockTo           = 'top';
  this.relativeTo       = window;
  this.cachedEvent      = jQuery.proxy(this.position,this);
          
  this.fixedClassName   = 'fixie-positionIsFixed';
  // this.preventReflow    = (navigator.userAgent.match(/iPad|iPhone/i) != null) ? true : this.hasChildSWF();
  this.preventReflow    = true;
  
  this.setOriginalPosition();
  this.setOriginalOffset();
  
  // override base values
  _.extend(this, overrides);
  this.relativeTo       = jQuery(this.relativeTo);
  this.positionProfile  = positionProfile;                
  
  // begin monitoring
  this.startMonitoringScroll();
};

// setup the original positions
fixie.prototype.setOriginalPosition = function(target){
  var targetElementPosition = this.target.position();        
  this.originalPosition  = {
    top       : targetElementPosition.top+'px',
    right     : targetElementPosition.right+'px',
    bottom    : targetElementPosition.bottom+'px',
    left      : targetElementPosition.left+'px',
    position  : this.target.css('position')
  };        
};

// setup the original offsets
fixie.prototype.setOriginalOffset = function(target){
  var targetElementOffset   = this.target.offset();        
  this.positionProfiles = {
    top:    { threshold: 0, css: { position: 'fixed', left: targetElementOffset.left+'px', top: 0 } },
    bottom: { threshold: 0, css: { position: 'fixed', left: targetElementOffset.left+'px', bottom: 0 } },
    left:   { threshold: 0, css: { position: 'fixed', left: 0 } },
    right:  { threshold: 0, css: { position: 'fixed', right: 0 } }
  };        
};      

// setup offset
fixie.prototype.getOffset = function(target){
  var offset = this.offset;
  if(this.axis === 'y'){
    offset = jQuery(this.parent).offset().top;
  }else if(this.axis === 'x'){
    offset = jQuery(this.parent).offset().left;          
  }
  
  return offset;
};

// cache element references for monitoring
fixie.prototype.position = function(){
  var newScrollPosition = parseInt(jQuery(this.relativeTo).scrollTop(),10) - this.offset;
  if(newScrollPosition > this.positionProfiles[this.positionProfile].threshold){
    if(this.preventReflow === true){
      this.target.css('top', newScrollPosition);
      if(this.positioned === false){
        this.target.addClass(this.fixedClassName);
        this.positioned = true;
      }
    }else{
      if(this.positioned === false){
        this.target.css(this.positionProfiles[this.positionProfile].css);
        this.target.addClass(this.fixedClassName);
        this.positioned = true;
      }            
    }          
  }else{
    if(this.preventReflow === true){
      this.target.css('top', this.originalPosition.top);
      if(this.positioned === true){
        this.target.removeClass(this.fixedClassName);
        this.positioned = false;
      }                         
    }else{
      if(this.positioned === true){
        this.target.css(this.originalPosition);
        this.target.removeClass(this.fixedClassName);
        this.positioned = false;
      }            
    }          
  }
};      

// cache element references for monitoring
fixie.prototype.hasChildSWF = function(target){
  var target = target || this.targetContainer;
  return (jQuery(target).find('object').length >= 1) ? true : false;
};      
  
// start monitoring the container for scroll events
fixie.prototype.startMonitoringScroll = function(){
  if(this.monitoring === false){
    this.relativeTo.bind('scroll', this.cachedEvent);
    this.monitoring = true;
    this.startCheckForLayoutChanges();
  }
};
// alias
fixie.prototype.start = fixie.startMonitoringScroll;

// stop monitoring the container for scroll events
fixie.prototype.stopMonitoringScroll  = function(){
  if(this.monitoring === true){        
    this.relativeTo.unbind('scroll', this.cachedEvent);
    this.stopCheckForLayoutChanges();
    this.monitoring = false;          
  }  
};
// update offset coordinates if necessary
fixie.prototype.checkForLayoutChanges = function(){
  var offset = this.getOffset();
  if(this.offset !== offset){
    console.log('changed')
    this.offset = offset;
    this.setOriginalPosition();
    this.setOriginalOffset();          
  }
};      
// monitor layout changes that affect position
fixie.prototype.startCheckForLayoutChanges  = function(){
  this.stopCheckForLayoutChanges();
  
  this.timer = setInterval(jQuery.proxy(this.checkForLayoutChanges,this),100);
};
// stop monitoring for layout changes
fixie.prototype.stopCheckForLayoutChanges  = function(){
  if(this.timer !== false){
    clearInterval(this.timer);          
  }
};      
// alias
fixie.prototype.stop = fixie.stopMonitoringScroll;      

// kill cached events and elements
fixie.prototype.kill  = function(){
  if(this.monitoring === true){
    this.stopMonitoringScroll();
  }
  this.target       = null;
  this.relativeTo   = null;
  this.cachedEvent  = null;
};