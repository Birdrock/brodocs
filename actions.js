// https://jsfiddle.net/upqwhou2/

// $(document).ready(function() {
//     var navigationLinks = $('#sidebar-wrapper a');
//     var sections = $("#page-content-wrapper").children().map(function(index, node) {
//         if (node.id) {
//             return node;
//         }
//     });
//     var sectionsReversed = $(sections.get().reverse());

//     var scrollPosition = $(window).scrollTop();
//     sections.each(function() {
//         var sectionTop = $(this).offset().top;
//         var id = $(this).attr('id');

//         if (scrollPosition >= sectionTop) {
//             $('#sidebar-wrapper > ul > li > a').removeClass('active');
//             $('#sidebar-wrapper > ul > li > a[href=#' + id + ']').addClass('active');
//         }
//     });
//     console.log("doc ready");
// });


// $(document).ready(function() {

//     var $navigationLinks = $('#sidebar-wrapper a');
//     var $sections = $(".section");
//     var $sectionsReversed = $($(".section").get().reverse());
//     var sectionIdTonavigationLink = {};

//     $navigationLinks.each(function() {
//         sectionIdTonavigationLink[$(this).attr('href')] = $('#sidebar-wrapper a[href=#' + $(this).attr('id') + ']');
//     });


//     function optimized() {
//         var scrollPosition = $(window).scrollTop();

//         $sectionsReversed.each(function() {
//             var currentSection = $(this);
//             var sectionTop = currentSection.offset().top;

//             if (scrollPosition >= sectionTop) {
//                 var id = currentSection.attr('id');
//                 var $navigationLink = sectionIdTonavigationLink[id];
//                 if (!$navigationLink.hasClass('active')) {
//                     $navigationLinks.removeClass('active');
//                     $navigationLink.addClass('active');
//                 }
//                 return false;
//             }
//         });
//     }
// });