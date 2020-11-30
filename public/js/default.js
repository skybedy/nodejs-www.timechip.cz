$(function(){

    $('#testbutton').click(function(){
        $.getJSON('/testy/test-socket',function(xhr){
            $('#testbox').html(xhr.neco);
        });


    });




});