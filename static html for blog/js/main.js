$(document).ready(function() {
    scrollTopHandler();
    $('.remove-my-website').on('click', removeMyWebSite);
    parseHostName();
    autoComplete();
    searchHandler();
});
$.ajaxSetup({
    beforeSend: function() {
        $('.pre-loader').fadeIn();
    },
    complete: function() {
        $('.pre-loader').hide();
    }
});
var scrollTopHandler = function() {
    var pageTopFlag = false;
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 250 && pageTopFlag === false) {
            if ($('.pagetop').hasClass('hid')) {
                $('.pagetop').removeClass('hid').fadeIn();
            }
        }
        if ($(window).scrollTop() < 250 && pageTopFlag === false) {
            $('.pagetop').fadeOut(function() {
                $(this).addClass('hid');
            });
        }
    });
    $(document).on('click', '.pagetop', function() {
        pageTopFlag = true;
        $('.pagetop').fadeOut(function() {
            $(this).addClass('hid');
        });
        $('html,body').animate({
            scrollTop: 0
        }, 800, function() {
            pageTopFlag = false;
        });
        return false;
    });
};
var removeMyWebSite = function() {
    var $handlerButton = $(this);
    swal({
        title: $handlerButton.data('title'),
        text: $handlerButton.data('desc'),
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top"
    }, function(inputValue) {
        if (inputValue === false) return false;
        if (inputValue === "") {
            swal.showInputError($handlerButton.data('desc'));
            return false
        }
        $.post($handlerButton.data('ajax-url'), 'website=' + inputValue, function(data) {
            if (data.status) {
                location.href = data.message;
            } else {
                swal.showInputError(data.message);
                return false
            }
        }, 'json');
    });
    return false;
};
var autoComplete = function() {

    var sites = new Bloodhound({
        datumTokenizer: function(datum) {
            return Bloodhound.tokenizers.whitespace(datum.value);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/api/sites/%QUERY',
            filter: function(site) {
                return $.map(site.results, function(site) {
                    return {
                        favicon: site.favicon,
                        name: site.name,
                        detail_url: site.detail_url,
                        alexa: site.alexa
                    };
                });
            }
        }
    });
    sites.initialize();
    $('#main-search-form .index-search-input, #general-search-form .searchinput').typeahead({
        hint: false
    }, {
        displayKey: 'name',
        source: sites.ttAdapter(),
        templates: {
            suggestion: function(data) {
                return '<p><img src="' + data.favicon + '">' + data.name + '  <span>' + data.alexa + '</span></p>';
            }
        }
    }).bind('typeahead:selected', function(obj, data, s) {
        location.href = data.detail_url;
    });




};
var serverBusy = false;
var searchHandler = function() {
    $('#search-button').on('click', search);
    $('#main-search-form,#general-search-form').on('submit', search);
}
var search = function() {
    if (serverBusy) return false;
    var $submitButton = $('#search-button');
    serverBusy = true;
    $.ajax({
        url: $submitButton.parents('form').attr('action'),
        data: $submitButton.parents('form').serialize(),
        dataType: 'json',
        type: 'post',
        success: function(data) {
            if (data.status) {
                if (data.hasOwnProperty('redirect')) {
                    location.href = data.redirect;
                    return false;
                }
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
var startAnalyze = function(hash, protocol, name) {
    var types = ['alexa', 'search', 'dmoz', 'social', 'whois', 'html', 'meta', 'color'];
    var typeCount = 0;
    $('.popup-container .url').text(protocol + '://' + name);
    $('.popup-container').removeClass('hidden');

    var animateLoader = function(percentage) {
        $('.popup-container .bar .activebar').animate({
            width: '+=' + percentage + '%'
        }, {
            duration: 500,
            step: function(now, fx) {
                $('.popup-container .bar span').text(Math.round(now) + '%');
            }
        });
    }
    var checkComplete = function() {
        if (typeCount == types.length) {
            $('.popup-container').addClass('hidden');
            $('.pre-loader').fadeIn();
            location.href = '/site/initialize/' + hash;
        }
    };
    var send = function(type, hash) {
        $.ajax({
            url: '/analyze/' + type + '/' + hash,
            dataType: 'json',
            type: 'post',
            beforeSend: function() {},
            success: function(data) {
                if (data.status) {
                    typeCount++;
                    $('.popup-container .popup').append('<div class="status"><img src="/img/true-icon.png"><span>' + type + ' information completed</span></div>');
                    animateLoader(10);
                    checkComplete();
                }
            }
        });
    }
    animateLoader(20);
    $.each(types, function(k, v) {
        send(v, hash);
    });
}

var parseHostName = function(){
    $(document).on('paste', '#main-search-form .index-search-input', function(){
        setTimeout(function(){
            //console.log($('#main-search-form .index-search-input').val());
            $('#main-search-form .index-search-input').val(getHost($('#main-search-form .index-search-input').val()));
        }, 250);

    });
    $(document).on('paste', '#general-search-form .searchinput', function(){
        setTimeout(function(){
            $('#general-search-form .searchinput').val(getHost($('#general-search-form .searchinput').val()));
        }, 250);

    });
}

var getHost = function(href) {
    var original = href;
    href = href.replace(' ', '');



    href = href.replace('http://', '');
    href = href.replace('https://', '');

    var l = document.createElement("a");
    l.href = 'http://' + href;

    if(original.substr(0, 5) == 'https'){
        return 'https://' + l.hostname;
    }if(original.substr(0, 4) == 'http'){
        return 'http://' + l.hostname;
    }else{
        return l.hostname;
    }

};

