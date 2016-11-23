$(document).ready(function() {

    var toc = navData.toc;

    function collectNodes(tocMap) {
        var tocNodes = {};
        tocMap.map(function(node, index) {
            var sectionNode = $('#' + node.section);
            var tocSubsections = {};
            tocItem = {section: sectionNode};
            var subsectionNodes;
            if (node.subsections) {
                subsectionNodes = (collectNodes(node.subsections));
                tocItem.subsections = subsectionNodes;
            }
            tocNodes[node.section] = tocItem;
        });
        return tocNodes;
    }
    var tocItems = collectNodes(toc);

    function collectNodesFlat(tocMap, obj) {
        var collect = obj || {};
        tocMap.map(function(node, index) {
            var sectionNode = $('#' + node.section);
            tocItem = {section: sectionNode};
            if (node.subsections) {
                subsectionNodes = (collectNodesFlat(node.subsections, collect));
            }
            collect[node.section] = sectionNode;
        });
        return collect;
    }
    var tocFlat = collectNodesFlat(toc);

    var prevSectionToken;
    var prevSubsectionToken;

    function scrollActions(scrollPosition) {
        var activeSection = checkNodePositions(toc, tocFlat, scrollPosition);
        if (!prevSectionToken && activeSection) {
            prevSectionToken = activeSection.token;
        } else if (activeSection && (activeSection.token !== prevSectionToken)) {
            var currL1Nav = getNavNode(activeSection.token);
            var prevL1Nav = getNavNode(prevSectionToken);
            prevL1Nav.hide('fast');
            currL1Nav.show('fast');
            prevSectionToken = activeSection.token;
        } else if (activeSection && (activeSection.token === prevSectionToken)) {
            var activeSubSection = checkNodePositions(activeSection.subsections, tocFlat, scrollPosition);
            // var currL1SubNav = getNavNode()
        }
    }

    function getNavNode(token) {
        return $('#' + token + '-nav');
    }

    function checkNodePositions(nodes, flatNodeMap, scrollPosition) {
        var activeNode;
        for (var i = 0; i < nodes.length; i++) {
            var item = nodes[i];
            var node = flatNodeMap[item.section];
            var nodeTop = node.offset().top;
            if (scrollPosition >= nodeTop) {
                activeNode = {token: item.section, node: node, subsections: item.subsections};
                break;
            }
        }
        return activeNode;
    }
    console.log(checkNodePositions(toc, tocFlat, $(window).scrollTop()));


//// Old stuff

    // function checkScroll() {
    //     var firstLevelTocLength = toc.length;
    //     var scrollPosition = $(window).scrollTop();
    //     var offset = 25;
    //     scrollPosition += offset;
    //     var lastSectionToken;
    //     var prevSectionToken;
    //     var nextSectionToken;

    //     for (var i = 0; i < firstLevelTocLength; i++) {
    //         var sectionToken = toc[i];
    //         prevSectionToken = toc[i-1];
    //         nextSectionToken = toc[i+1];
    //         var currentSection = tocItems[sectionToken.section];
    //         if (scrollPosition >= currentSection.top) {
    //             // TODO: Revisit to only collapse previous menu to avoid having to collapse all
    //             collapseAllNavs();
    //             lastSectionToken = sectionToken[i];
    //             $('#' + sectionToken.section + '-nav').show();
    //             setActiveSubsection(sectionToken.section, sectionToken.subsections, scrollPosition);
    //             return;
    //         } 
    //     }
    // }

    function collapseAllNavs() {
        toc.forEach(function(section) {
            $('#' + section.section + '-nav').hide();
        });
    }

    function setActiveSubsection(sectionToken, subsectionTokens, scrollPosition) {
        for (var i = 0; i < subsectionTokens.length; i++) {
            var currentSubSection = subsectionTokens[i];
            var subSections = tocItems[sectionToken].subsections;
            var subSection = subSections[currentSubSection];
            if (scrollPosition <= subSection.top) {
                deactivateSubsections(subsectionTokens, subSections);
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


    // function checkLocs(nodes) {
    //     for (var node in nodes) {
    //         if (nodes.hasOwnProperty(node)) {
    //             var currNode = nodes[node].section;
    //             nodes[node].top = currNode.position().top;
    //             nodes[node].bottom = currNode.position().top + currNode.offset().top + currNode.outerHeight(true);
    //             var subsections = nodes[node].subsections;

    //             if (subsections) {
    //                 // checkLocs(subsections);
    //             }
    //             // for (var subnode in subsections) {
    //             //     var currSubNode = subsections[subnode].subsection;
    //             //     subsections[subnode].top = currSubNode.position().top;
    //             //     subsections[subnode].bottom = currSubNode.position().top + currSubNode.offset().top + currSubNode.outerHeight(true);
    //             // }
    //         }
    //     }
    // }
    // checkLocs(tocItems);

    // checkScroll();

    // TODO: prevent scroll on sidebar from propogating to window
    $(window).on('scroll', function(event) {
        var scrollPosition = $(window).scrollTop();
        // checkScroll();
        scrollActions(scrollPosition);
    });
});