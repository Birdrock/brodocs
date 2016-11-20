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

    function checkScroll() {
        var firstLevelTocLength = toc.length;
        var scrollPosition = $(window).scrollTop();
        var offset = 25;
        scrollPosition += offset;
        var lastSectionToken;
        var prevSectionToken;
        var nextSectionToken;

        for (var i = 0; i < firstLevelTocLength; i++) {
            var sectionToken = toc[i];
            prevSectionToken = toc[i-1];
            nextSectionToken = toc[i+1];
            var currentSection = tocItems[sectionToken.section];
            if (scrollPosition >= currentSection.top) {
                // TODO: Revisit to only collapse previous menu to avoid having to collapse all
                collapseAllNavs();
                lastSectionToken = sectionToken[i];
                $('#' + sectionToken.section + '-nav').toggle(true);
                setActiveSubsection(sectionToken.section, sectionToken.subsections, scrollPosition);
                return;
            } 
        }
    }

    function collapseAllNavs() {
        toc.forEach(function(section) {
            $('#' + section.section + '-nav').toggle(false);
        });
    }

    function setActiveSubsection(sectionToken, subsectionTokens, scrollPosition) {
        for (var i = 0; i < subsectionTokens.length; i++) {
            var currentSubSection = subsectionTokens[i];
            var subSections = tocItems[sectionToken].subsections;
            var subSection = subSections[currentSubSection];
            if (scrollPosition <= subSection.top) {
                deactivateSubsections(subsectionTokens, subSections);
                console.log(currentSubSection);
                $('#sidebar-wrapper > ul li a[href="#' + currentSubSection + '"]').addClass('selected');
            }
        }
    }

    function deactivateSubsections(subsectionTokens, subSections) {
        subsectionTokens.forEach(function(subsectionToken) {
            var subsection = subSections[subsectionToken];
            $('#sidebar-wrapper > ul li a[href="#' + subsectionToken + '"]').removeClass('selected');
        });
    }

    checkScroll();

    // TODO: prevent scroll on sidebar from propogating to window
    $(window).on('scroll', function(event) {
        checkScroll();
    });
});