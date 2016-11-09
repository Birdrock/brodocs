// https://jsfiddle.net/upqwhou2/

$(document).ready(function() {
    window.location = window.location.href;
    var navigationLinks = $('#sidebar-wrapper > ul > li > a');
    var sectionIdTonavigationLink = {};
    var sections = $("#page-content-wrapper").children().map(function(index, node) {
        if (node.id) {
            sectionIdTonavigationLink[node.id] = $('#sidebar-wrapper > ul > li > a[href="#' + node.id + '"]');
            return node;
        }
    });
    var sectionsReversed = $(sections.get().reverse());

    function checkScroll() {
        var scrollPosition = $(window).scrollTop();
        var offset = 250;
        scrollPosition += offset;
        sections.each(function() {
            var currentSection = $(this);
            var sectionTop = $(this).offset().top;
            var id = $(this).attr('id');
            if (scrollPosition >= sectionTop) {
                navigationLinks.removeClass('selected');
                console.log("section navigation link ", navigationLinks);
                sectionIdTonavigationLink[id].addClass('selected');
            }
        });
    }
    checkScroll();
    $(window).scroll(checkScroll);
});