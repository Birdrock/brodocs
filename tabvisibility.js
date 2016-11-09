$(document).ready(function() {
    // console.log("tab switcher");
    $('.kubectl').addClass('active');
    $('#kubectl').addClass('tab-selected');

    $('#kubectl').on('click', function() {
        $('#curl').removeClass('tab-selected');
        $('#kubectl').addClass('tab-selected');
        $('.code-block').removeClass('active');
        $('.kubectl').addClass('active');
    });
    $('#curl').on('click', function() {
        $('#kubectl').removeClass('tab-selected');
        $('#curl').addClass('tab-selected');
        $('.code-block').removeClass('active');
        $('.curl').addClass('active');
    });
});