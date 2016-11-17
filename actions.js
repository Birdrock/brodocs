// https://jsfiddle.net/upqwhou2/

$(document).ready(function() {
    var navigationLinks = $('#sidebar-wrapper > ul > li > a');
    var sectionIdTonavigationLink = {};
    var sections = $('#page-content-wrapper').find('h1, h2').map(function(index, node) {
        if (node.id) {
            sectionIdTonavigationLink[node.id] = $('#sidebar-wrapper > ul > li > a[href="#' + node.id + '"]');
            return node;
        }
    });

    var sectionsReversed = $(sections.get().reverse());

    function checkScroll() {
        var scrollPosition = $(window).scrollTop();
        var offset = 50;
        scrollPosition += offset;
        sections.each(function() {
            var currentSection = $(this);
            var sectionTop = $(this).offset().top;
            var id = $(this).attr('id');
            if (scrollPosition >= sectionTop) {
                navigationLinks.removeClass('selected');
                sectionIdTonavigationLink[id].addClass('selected');
            }
            if (($(this).offset().top < window.pageYOffset + 50) && $(this).offset().top + $(this).height() > window.pageYOffset) {
                window.location.hash = id;
            }
        });
    }
    checkScroll();
    $(window).scroll(function() {
        checkScroll();
    });
});