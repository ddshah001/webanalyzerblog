$(document).ready(function(){
	
	$('.stickymenu').stickymenu();
	alexaTraficTabs();
	seeMoreTable();
	moduleModalHandler();
	acordionTabHandler();
	alexaGraphTabHandler();
	metaChart();
	htmlSizeChart();
    pageSpeedScore();
    resizeHandler();
    mobileMenuHandler();

    $('#new-comment-btn').on('click', newComment);
    $('#re-analyze').on('click', reAnalyze)

});

var serverBusy = false;

var resizeHandler = function(){
    var resizeId;
    $( window ).resize(function() {
        clearTimeout(resizeId);
        resizeId = setTimeout(function(){
            drawRegionsMap();
            initialize();
            pageSpeedScore();
        }, 500);
    });
};

var alexaTraficTabs = function(){
	$('#alexa-traffic-tabs a').on('click', function(){
		$('#alexa-traffic-tabs a').removeClass('active');
		$(this).addClass('active');
		$('.alexa-tables').css('display', 'none');
		$($(this).attr('href')).fadeIn();
		return false;
	});

};

var newComment = function(){

    var $submitButton = $(this);
    $.ajax({
        url: $submitButton.parents('form').attr('action'),
        data: $submitButton.parents('form').serialize(),
        dataType: 'json',
        type: 'post',
        beforeSend: function() {
            $submitButton.text($submitButton.data('loading-text'));
            $submitButton.attr('disabled', 'disabled');
        },
        success: function(data){
            grecaptcha.reset();
            if(data.status){
                $submitButton.parents('form')[0].reset();
                sweetAlert("Success", data.message, "success");
            }else{
                sweetAlert("Oops...", data.message.join("\r\n"), "error");
            }
            $submitButton.removeAttr('disabled');
            $submitButton.text($submitButton.data('text'));
        }
    });
    return false;
};

var seeMoreTable = function(){
	$('.see-more-table').on('click', function(){
		
		var moreLimit = 10;
		
		$hiddenRows = $(this).parents('.table-responsive').find('tbody tr.hidden');
		$hiddenRows.slice(0,moreLimit).removeClass('hidden');

		if( $hiddenRows.size() <= moreLimit )
			$(this).hide();
		return false;
	});
};

var moduleModalHandler = function(){
	$('.modul .titleh a.info-modal').on('click', function(){
		BootstrapDialog.show({
            title: $(this).data('title'),
            message: $('<div></div>').load($(this).data('xhr-url'))
        });
        return false;
	});
};

var acordionTabHandler = function(){
	$('a.akordiyon').on('click', function(){
        var $icon = $(this).find('.icon');
        if($icon.hasClass('open')){
            $icon.removeClass('open').attr('src', '/img/arrow.png');
        }else{
            $icon.addClass('open').attr('src', '/img/arrow-up.png');
        }
		$(this).next().slideToggle();
		return false;
	});
};

var alexaGraphTabHandler = function(){
	$('#alexa-graph-tab a').on('click', function(){
		
		$('#alexa-graph-tab a').removeClass('active');
		$(this).addClass('active');

		$('#alexa-graph-container img').attr('src', generateAlexaUrl());

		return false;
	});

	$('#alexa-graph-period').on('change', function(){

		$('#alexa-graph-container img').attr('src', generateAlexaUrl());

	});

};

var generateAlexaUrl = function(){
	
	var alexaGraphTemplate = $('#alexa-graph-container img').data('template');

	alexaGraphTemplate = alexaGraphTemplate.replace('%type%', $('#alexa-graph-tab a.active').data('type-id'));
	alexaGraphTemplate = alexaGraphTemplate.replace('%period%', $('#alexa-graph-period').val());
	alexaGraphTemplate = alexaGraphTemplate.replace('%site%', site);	

	return alexaGraphTemplate;
};

var metaChart = function(){

    if($('#meta-char-doughnut').size() == 0){
        return false;
    }
	var canvas1 = document.getElementById('meta-char-doughnut');

    var moduleDoughnut = new Chart(canvas1.getContext('2d')).Doughnut(keywordDensityData, { responsive: true, tooltipTemplate : "<%if (label){%><%=label%>: <%}%><%= value %>", animation: true });

    var legendHolder = document.createElement('div');
    legendHolder.innerHTML = moduleDoughnut.generateLegend();

    Chart.helpers.each(legendHolder.firstChild.childNodes, function(legendNode, index){

        Chart.helpers.addEvent(legendNode, 'mousemove', function(){
            var activeSegment = moduleDoughnut.segments[index];
            activeSegment.save();
            activeSegment.fillColor = activeSegment.highlightColor;
            moduleDoughnut.showTooltip([activeSegment]);
            activeSegment.restore();
        });

        Chart.helpers.addEvent(legendNode, 'mouseleave', function(){
            moduleDoughnut.draw();
        });

    });

    $('.meta-chart .legend-container').append(legendHolder.firstChild);

};

var htmlSizeChart = function(){

    if($('.html-size-chart').size() == 0){
        return false;
    }

	var canvas = document.getElementById('html-size-doughnut');

		var moduleData = [
			{
				value: parseFloat(textSize),
				color: '#f1b300',
				highlight: Colour('#f1b300', 10),
				label: "Text Size"
			},
		
			{
				value: parseFloat(codeSize),
				color: '#5b90bf',
				highlight: Colour('#5b90bf', 10),
				label: "Code Size"
			}
		];

		var moduleDoughnut = new Chart(canvas.getContext('2d')).Doughnut(moduleData, { tooltipTemplate : "<%if (label){%><%=label%>: <%}%><%= value %>kb", animation: true });
		
		var legendHolder = document.createElement('div');
		legendHolder.innerHTML = moduleDoughnut.generateLegend();

		Chart.helpers.each(legendHolder.firstChild.childNodes, function(legendNode, index){

			Chart.helpers.addEvent(legendNode, 'mousemove', function(){
				var activeSegment = moduleDoughnut.segments[index];
				activeSegment.save();
				activeSegment.fillColor = activeSegment.highlightColor;
				moduleDoughnut.showTooltip([activeSegment]);
				activeSegment.restore();
			});

			Chart.helpers.addEvent(legendNode, 'mouseleave', function(){
				moduleDoughnut.draw();
			});

		});
		$legendContainer = $('.html-size-chart .legend-container');
		
		$legendContainer.html(legendHolder.firstChild);

		//$legendContainer.find('ul li').eq(0).append(': <strong>' + $legendContainer.data('html-size') + ' KB</strong>');
		$legendContainer.find('ul li').eq(0).append(': <strong>' + $legendContainer.data('text-size') + ' KB</strong>');
		$legendContainer.find('ul li').eq(1).append(': <strong>' + $legendContainer.data('code-size') + ' KB</strong>');
        $legendContainer.find('ul li').eq(0).before('<li><span style="background-color:#e95321"></span>HTML Size: <strong>'+$legendContainer.data('html-size')+' KB</strong></li>');
};

var Colour = function(col, amt) {

	var usePound = false;

	if (col[0] == "#") {
		col = col.slice(1);
		usePound = true;
	}

	var num = parseInt(col,16);

	var r = (num >> 16) + amt;

	if (r > 255) r = 255;
	else if  (r < 0) r = 0;

	var b = ((num >> 8) & 0x00FF) + amt;

	if (b > 255) b = 255;
	else if  (b < 0) b = 0;

	var g = (num & 0x0000FF) + amt;

	if (g > 255) g = 255;
	else if (g < 0) g = 0;

	return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

};

var pageSpeedScore = function(){

    if($('#pagespeed-gauge').size() == 0){
        return false;
    }

    $('#pagespeed-gauge').html('');

    var g = new JustGage({
        id: "pagespeed-gauge",
        value: pagespeed,
        min: 0,
        max: 100,
        title: ' ',
        titleFontColor: '#fff',
        levelColors: [
            "#ff0000",
            "#f9c802",
            "#a9d70b"
        ],
        levelColorsGradient: true

    });
};

google.load("visualization", "1", {packages:["geochart"]});
google.setOnLoadCallback(drawRegionsMap);
function drawRegionsMap() {

    if($('#alexa-country-map').size() == 0){
        return false;
    }

	var data = google.visualization.arrayToDataTable(alexaTopCountries);

	var options = {};
    //options['dataMode'] = 'regions';

	var chart = new google.visualization.GeoChart(document.getElementById('alexa-country-map'));

	chart.draw(data, options);
}

var serverLocation = new google.maps.LatLng(latitude, longitude);
var marker;
var map;

function initialize() {
  var mapOptions = {
    zoom: 5,
    center: serverLocation
  };

  map = new google.maps.Map(document.getElementById('server-location-map'),
          mapOptions);

  marker = new google.maps.Marker({
    map:map,
    draggable:false,
    animation: google.maps.Animation.DROP,
    position: serverLocation
  });

}

google.maps.event.addDomListener(window, 'load', initialize);

var mobileMenuHandler = function(){

    if($('#mobile-fixed-menu').css('display') == 'none'){
        return false;
    }

   $(document).on("scroll", function(){
        if( $(window).scrollTop() > $('#header').height() ){
            if(! $('#mobile-fixed-menu').hasClass('active')){
                $('#mobile-fixed-menu').addClass('active').animate({
                    top : 0
                },100);
            }
            return false;
        }
        $('#mobile-fixed-menu').removeClass('active').css('top', -60);




    });

    $(document).on('click', '.mobile-top-button', function(){
        $('html,body').animate({
            scrollTop : 0
        },800);
        return false;
    });

    $(".mobile-menu-button, .mobilebutton").click(function(){
        $(".stickymenu-mobile").toggle(100);
        return false;
    });

    $(".stickymenu-mobile a").click(function(){
        $(".stickymenu-mobile").toggle(100);
        $('html,body').animate({
            scrollTop : ($($(this).attr('href')).offset().top - $('#mobile-fixed-menu').height() - 10)
        },800);
        return false;
    });
};

var reAnalyze = function() {
    if (serverBusy) return false;
    var $analyzeButton = $('#re-analyze');
    serverBusy = true;
    $.ajax({
        url: $analyzeButton.data('url'),
        data: { site : $analyzeButton.data('name')},
        dataType: 'json',
        type: 'post',
        success: function(data) {
            if (data.status) {
                if (data.hasOwnProperty('hash')) {
                    startAnalyze(data.hash, data.protocol, data.name);
                    return false;
                }
            } else {
                sweetAlert("Oops...", data.message.join("\r\n"), "error");
            }
            serverBusy = false;
        }
    });
    return false;
};