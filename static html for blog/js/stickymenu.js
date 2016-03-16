(function($){
    $.fn.stickymenu = function(options){

        var defaults = {
        };


        var that     = this; 
        var settings = $.extend({}, defaults, options); 

        var $stickyMenu = $(this);
        var $stickyMenuPosition = $stickyMenu.offset().top + $stickyMenu.height();
        var $activeModule = '';
        var positionMap = {};
        
        var listeners = {
            
            scrollListener : function(){
                $(document).on("scroll", scrollHandlers);
            },

            linkListener : function(){
                $(document).on('click', '.stickymenu li a', stickyMenuLink)
            }
 
        };

        var scrollHandlers = function(){
            stickyMenuControl();
            checkPosition();
        };

        var stickyMenuControl = function(){
            if( $(window).scrollTop() > $stickyMenuPosition ){
                stickyMenuActive();
            }else{
                stickyMenuHide();   
            }
        };

        var stickyMenuActive = function(){
            if($(that).hasClass('active'))
                return false;

            $stickyMenu.addClass('active');
            $stickyMenu.animate({
                top : 0
            },800);

        };

        var stickyMenuLinkAnimation = function(){

            if($stickyMenu.hasClass('active')){
                var time = 0;
            }else{
                var time = 500;
            }

            setTimeout(function(){
                $activeLink = $stickyMenu.find('ul li a.active-link');
                
                $stickyMenu.find('.sticky-bg').animate({
                      width: $activeLink.outerWidth(),
                      left: $activeLink.offset().left
                      }, 1000);

                },time);

        };

        var clearLinkAnimation = function(){
            $stickyMenu.find('.sticky-bg').css({
                width: 0,
                left: 0
            });
        };

        var stickyMenuHide = function(){
            if(! $stickyMenu.hasClass('active'))
                return false;

            $stickyMenu.css({
                top : -40
            });

            $stickyMenu.removeClass('active'); 

            clearLinkAnimation();
        };

        var stickyMenuLink = function(){

                $stickyMenu.find('ul li a').removeClass('active-link');
                $(this).addClass('active-link');

                $targetPosition = $($(this).attr('href')).offset().top;

                if($targetPosition > $stickyMenuPosition ){
                    var pushHeight = 60;
                }else{
                    var pushHeight = 5;
                }

                $('html,body').animate({
                  scrollTop: $($(this).attr('href')).offset().top - pushHeight
                  }, 1000);

                stickyMenuLinkAnimation();

                return false;
        }

        var timing = false;
        var height = 100;
        var checkPosition = function(){

            $.each($('.analyze-group'), function(){
                var id = $(this).attr('id');
                var startPos = $(this).offset().top;
                var endPos = startPos + $(this).outerHeight();
                positionMap[id] = {start:startPos, end:endPos};
            });

            if(timing !== false) clearTimeout(timing);

            timing = setTimeout(function(){
                $.each(positionMap, function(id, position){
                    if($(window).scrollTop()+height > position.start && $(window).scrollTop() < position.end){
                        console.log(id);
                        $stickyMenu.find('ul li a').removeClass('active-link');
                        $stickyMenu.find('ul li a[href=#' + id + ']').addClass('active-link');
                        var $activeLink = $stickyMenu.find('ul li a.active-link');
                        $stickyMenu.find('.sticky-bg').css({
                            width: $activeLink.outerWidth(),
                            left: $activeLink.offset().left
                        });
                        //stickyMenuLinkAnimation();
                    }
                });
                timing = false;
            }, 50);

            
        };
        

        var init = function(){
            // init listeners
            listeners.scrollListener();
            listeners.linkListener();




        };
        
        init(); 

    }
}( jQuery ));