$(document).ready(function() {
    console.log("tab switcher");
    $('.kubectl').addClass('active');

    $('#kubectl').on('click', function() {
        $('.code-block').removeClass('active');
        $('.kubectl').addClass('active');
    });
    $('#curl').on('click', function() {
        $('.code-block').removeClass('active');
        $('.curl').addClass('active');
    });
});