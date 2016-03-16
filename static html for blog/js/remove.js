$(function(){
    $('#verification-method').on('change', verificationMethodSelectbox);
    $('#start-verification').on('click', startVerification);
});

var verificationMethodSelectbox = function(){
    $('.verification-methods').hide();
    $('#' + $(this).val()).show();
};

var startVerification = function(){

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
            if(data.status){
                $submitButton.parents('form')[0].reset();
                sweetAlert("Success", data.message, "success");
            }else{
                sweetAlert("Oops...", data.message, "error");
            }
            $submitButton.removeAttr('disabled');
            $submitButton.text($submitButton.data('text'));
        }
    });
    return false;
};