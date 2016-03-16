$(function(){
    $(document).on('click', '#install', installProcess);
});

var installProcess = function(){

    var $submitButton = $(this);

    $.ajax({
        url: $submitButton.parents('form').attr('action'),
        data: $submitButton.parents('form').serialize(),
        dataType: 'json',
        type: 'post',
        beforeSend: function() {
            $submitButton.text('Please Wait...');
            $submitButton.attr('disabled', 'disabled');
        },
        success: function(data){
            if(data.status){
                $submitButton.parents('form')[0].reset();
                $('#installation').remove();
                $('#installed').removeClass('hidden');
            }else{
                sweetAlert("Oops...", data.message.join("\r\n"), "error");
            }
            $submitButton.removeAttr('disabled');
            $submitButton.text('Install Smart Website Analyzer');

        }
    });
    return false;
};