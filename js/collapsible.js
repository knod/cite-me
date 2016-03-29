// 01/26/2014
// jquery source: http://code.jquery.com/jquery-1.11.0.min.js

var activateCollapsible;

$(document).ready(function() {

	// Start with the abstracts hidden
	$(".collapsible").hide();
	// This won't affect the citation creation, because those elements
	// are created later and thus won't be effected

	var animatedExpand = function ( $collapsers ) {
		// Make collapsed elements visible with slide
		$collapsers.next('.collapsible').slideDown();
		// Change the appearence of the arrow
		$collapsers.children('.arrow').addClass('expanded');
		// Change the alt text to reflect change
		$collapsers.removeAttr("alt","Click to expand abstract");
		$collapsers.attr("alt","Click to collapse abstract");

		return $collapsers;
	};  // End animatedExpand()

	activateCollapsible = function () {
		// When somethign with the ".collapser" class is clicked
		$(".collapsers")
			// Toggle hiding any of the divs nested herein that have the
			// ".collapsible" class (using the slide animation/transition)
			.on("click", function (evt) {
				$(this).next(".collapsible").slideToggle();
				$(this).children(".arrow").toggleClass("expanded");
				// For accessibility, change the alt text of the arrow
				if ($(this).attr("alt")=="Click to collapse abstract") {
					// If it's "Expanded", replace that with "Collapsed"
					$(this).removeAttr("alt","Click to collapse abstract");
					$(this).attr("alt","Click to expand abstract");
				}
	   			else if ($(this).attr("alt")=="Click to expand abstract") {
	   				// Otherwise, do it the other way around
					$(this).removeAttr("alt","Click to expand abstract");
					$(this).attr("alt","Click to collapse abstract");
	   			}
				// These makes sure nothing higher up the DOM
				// gets clicked by this click
				evt.stopPropagation();
				evt.preventDefault();
		});
	};  // End activateCollapsible()
	
	activateCollapsible();
});
