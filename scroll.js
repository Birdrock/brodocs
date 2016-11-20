$(document).ready(function() {

    var toc = navData.toc;

    function collectNodes() {
        var tocNodes = {};
        toc.map(function(node, index) {
            var sectionNode = $('#' + node.section);
            var subsections = node.subsections;
            var tocSubsections = {};
            var subsectionNodes = subsections.map(function(node, index) {
                var subNode = $('#' + node);
                tocSubsections[node] = {subsection: subNode};
            });
            tocNodes[node.section] = {section: sectionNode, subsections: tocSubsections};
        });
        return tocNodes;
    }
    var tocItems = collectNodes();

    function checkLocs(nodes) {
        for (var node in nodes) {
            if (nodes.hasOwnProperty(node)) {
                var currNode = nodes[node].section;
                nodes[node].top = currNode.position().top;
                nodes[node].bottom = currNode.position().top + currNode.offset().top + currNode.outerHeight(true);
                var subsections = nodes[node].subsections;
                for (var subnode in subsections) {
                    var currSubNode = subsections[subnode].subsection;
                    subsections[subnode].top = currSubNode.position().top;
                    subsections[subnode].bottom = currSubNode.position().top + currSubNode.offset().top + currSubNode.outerHeight(true);
                }
            }
        }
    }

    checkLocs(tocItems);
    console.log(tocItems);

    $(window).on('scroll', function() {

    });
});