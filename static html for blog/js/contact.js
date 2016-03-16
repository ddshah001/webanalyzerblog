$(document).ready(function(){

    $('#send-me').on('click', contact);

});


var contact = function(){

    var $submitButton = $(this);

    $submitButton.text($submitButton.data('loading-text'));
    $submitButton.attr('disabled', 'disabled');
    $.ajax({
        url: $submitButton.parents('form').attr('action'),
        data: $submitButton.parents('form').serialize(),
        dataType: 'json',
        type: 'post',
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
