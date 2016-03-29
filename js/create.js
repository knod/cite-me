/* create.js
* 
* Turn form data into two things:
* - Visual feedback of what the citation would look like (given css styles)
* - HTML code for that same visible citation that can be pasted
* 	into an HTML document
* 
* TODO:
* - Switch to ace editor with formating of html
* - ??: Don't update output html code unless there's a title?
* 
* NOTES:
* - Programatically created nodes are different than manually written html
*/

'use strict'
var htmlText;  // DEBUGGING
// When the document is all loaded and such (the elements we want to be able to
// manipulate all exist so we can add event listeners to them)
$(document).ready( function () {
	// ========================
	// DATA OBJECT
	// ========================
	var input = {};
	input.title_input 		= '';
	input.authors_input 	= '';
	input.citation_input 	= '';
	input.pdf_input 		= '';
	input.honor_input 		= '';
	input.abstract_input 	= '';

	// ================================================
	// OUTPUT
	// ================================================

	// ========================
	// HTML Output
	var updateHTMLOutput = function ( citationNode ) {
	/* ( DOM Node ) -> other jQuery Node
	* 
	* How do I get a version with all the right spacing goddamnit!?!!?!
	* TODO: Switch to ace editor with special formatting
	*/
		var clone = citationNode.cloneNode();
		// Deliver a version of the html where the abstract isn't already expanded
		// Not sure why this doesn't unexpand the text. Maybe because activateCollapsible() isn't called.
		var unexpandedArrow = $(clone.getElementsByClassName('arrow')).removeClass('expanded');

		htmlText = $('.paper')[0].outerHTML;

		// Take the existing html, use it like a string
		// Then use Regex to create the right line breaks and indentations
		var indent1 	= '    ';
		var indent2 	= indent1 + indent1
		htmlText = "<!-- Next paper starts here -->\n" + htmlText;
		htmlText = htmlText.replace( /\n/g, '' ).replace(/\t/g, '' );
		htmlText = htmlText.replace( /<div/g, '\n<div' )
							.replace( /<span/g, '\n    <span' )
							.replace( ' expanded', '' )
							.replace( '<span class="paper-authors">', indent1 + '<span class="paper-authors">' )
							.replace( '.</span>', '.\n    </span>' )
							.replace( /<\/div/g, '\n</div' )
							.replace( '<div class="abstract-label collapsers">', indent1 + '<div class="abstract-label collapsers">' )
							.replace( '<span class="arrow">', indent2 + '<span class="arrow">' )
							.replace( '<span class="abstract-label-text">', indent2 + '<span class="abstract-label-text">' )
							.replace( '/span>\n</div>\n<div', '/span>\n' + indent1 + '</div>\n' + indent1 + '<div' )
							.replace( '<div class="abstract-text collapsible">', '<div class="abstract-text collapsible">\n' + indent2 )
							.replace( '</div>\n</div>', indent1 + '</div>\n</div>' )
							.replace( /<br>/g, '\n' + indent2 + '<br>\n' + indent2 )
							.replace( '<div class="honor">', indent1 + '<div class="honor">\n' + indent2 )
							.replace( /(honor.*\n.*\n)([^\s].*)/, function (match, p1, p2) { return p1 + '    ' + p2} )
							.replace( /\n\s*\n/g, '\n');
		

		htmlText = htmlText + '\n<!-- Next paper ends here -->';

		// jQuery can turn that text into DOM nodes
		$('#output_html').val( htmlText );

		return $('#output_html');
	};  // End updateHTMLOutput()


	// ========================
	// Visual Output
	var addInitalHTML = function () {
	/* ( None ) -> jQuery Node
	* 
	* Reset the contents of the main visual feedback element to the
	* very inital HTML elements. Later we'll add other elements to
	* these elements
	*/
		// Create the string for the html elements.
		// Comments are there to clearly indicate start and end of
		// code in case someone later wants to add something by hand
		var initialHTML = "<!-- Next paper starts here -->\n" +
			// Re-made each time, so starts out as hidden each time
			"<div class='paper'>\n" +
			"	<span class='paper-title'></span>,\n" +
			"	<span class='paper-authors-container'>(with\n" +
			"	<span class='paper-authors'></span>).\n" +
			"	</span>\n" +
			"	\n"
			"</div>\n" +
			"<!-- Next paper ends here -->"
		;

		// Empty previous contents and put in the new html text
		// we just made. jQuery turns the single string into DOM nodes
		$(".in-paper-section").eq(0).html( initialHTML );

		return $(".in-paper-section").eq(0);
	};  // End addInitalHTML


	var fillInTitle = function () {
	/* ( None ) -> DOM Node
	* 
	* If there's title data, show the paper and all its stuff, and
	* add the title text from the input data
	*/
		// If the user has entered something for the title, show it
		// otherwise everything stays hidden to hide the comma
		// Not sure how to show the title without the comma :/
		if ( input.title_input !== '' ) {
			// Since this is re-made every time, it starts out as hidden every time
			$('.paper').css( 'display', 'inline' )
		}

		// Add the text in the input data to the appropriate element
		$('.paper-title').html( input.title_input );

		return document.getElementsByClassName('paper')[0];
	};  // End fillInTitle()


	var fillInAuthors = function () {
	/* ( None ) -> DOM Node
	* 
	* If there's author data, show the author node, and
	* add the author text from the input data
	*/
		// This element remains hidden unless the user has put authors in
		if ( input.authors_input !== '' ) {
			$('.paper-authors-container').css( 'display', 'inline' );
		}

		// Add the text in the input data to the appropriate element
		$('.paper-authors').html( input.authors_input );

		return document.getElementsByClassName('paper')[0];
	};  // End fillInAuthors()


	var addCitation = function () {
	/* ( None ) -> DOM Node
	* 
	* If there's citation data (the paper's been cited in a journal),
	* add that string to appropriate element
	* TODO: Use jQuery to make this smoother
	*/
		// If the input isn't empty
		if ( input.citation_input !== '' ) {
			// Add an element to show the citation
			var cit 		= document.createElement('span');
			$('.paper').append( cit );

			cit.className 	= 'citation';

			var citText = document.createTextNode( input.citation_input );
			cit.appendChild( citText );
		}

		return document.getElementsByClassName('paper')[0];
	};  // End addCitation()


	var addPDF = function () {
	/* ( None ) -> DOM Node
	* 
	* If there's pdf link data, create a link to that paper
	* TODO: Use jQuery to make this smoother
	*/
		// If the input isn't empty
		if ( input.pdf_input !== '' ) {
			// Add an element to link to the pdf
			var pdf 		= document.createElement('a');
			$('.paper').append( pdf );

			pdf.className 	= 'pdf-link';
			pdf.href 		= input.pdf_input;
			// Why do I need to add an extra space at the start? span should take care of that!
			// NOTE: Because programatically created html is different than manually written html
			var pdfText = document.createTextNode(' [PDF]');
			pdf.appendChild( pdfText );
		}

		return document.getElementsByClassName('paper')[0];
	};  // End addPDF()


	var addHonor = function () {
	/* ( None ) -> DOM Node
	* 
	* If there's honor data, add a node to show the honor
	* TODO: Use jQuery to make this smoother
	*/
		// If honor field isn't empty
		if ( input.honor_input !== '' ) {
			var honor = document.createElement( 'div' );

			$('.paper').append( honor );

			honor.className = 'honor';

			var honorText = document.createTextNode( input.honor_input );
			honor.appendChild( honorText );
		}

		return document.getElementsByClassName('paper')[0];
	};  // End addHonor()


	var addAbstract = function () {
	/* ( None ) -> DOM Node
	* 
	* Creates an expanded view of the abstract (with the text already visible)  
	*/
		// If the input isn't empty
		if ( input.abstract_input !== '' ) {

			// ----- Controls ------
			// Create and add the div that contains all the abstract control stuff to .paper.
			// When clicked on it collapses and expands stuff.
			var labelContainer 			= document.createElement('div');
			$('.paper').append( labelContainer );

			labelContainer.className 	= 'abstract-label collapsers';
			labelContainer.alt 			= 'Click to expand abstract';

			// Create and add the arrow that's often next to collapsing and expanding stuff
			var arrow 		= document.createElement('span');
			labelContainer.appendChild( arrow );
			// Show an already expanded arrow
			arrow.className = 'arrow expanded';

			// Create and add the text 'Abstract' that's next to the arrow
			var labelText 		= document.createElement( 'span' );
			labelContainer.appendChild( labelText );

			labelText.className = 'abstract-label-text';

			var labelTextNode 	= document.createTextNode( 'Abstract' );
			labelText.appendChild( labelTextNode );

			// ----- Content ------
			// Create and add the div that contains the actual text of the abstract to .paper
			var contentContainer 		= document.createElement( 'div' );
			$('.paper').append( contentContainer );

			contentContainer.className 	= 'abstract-text collapsible';

			// Add the text that's in the abstract
			$(contentContainer).html( input.abstract_input );

			// Trigger the functionality of expanding and collapsing that text
			activateCollapsible();
		}

		return document.getElementsByClassName('paper')[0];
	};  // End addAbstract()

	var citationPartsFuncsArray = [ addInitalHTML, fillInTitle,
									fillInAuthors, addCitation,
									addPDF, addHonor, addAbstract ];
	var updateVisualOutput = function ( key ) {
	/* 
	* 
	* Run all the functions to create and add the elements of the visual
	* feedback of the citation (not the html output)
	*/
		for ( var funci = 0; funci < citationPartsFuncsArray.length; funci++ ) {
			// Cycles through all the functions to update the visual feedback
			// (from list of functions above)
			citationPartsFuncsArray[ funci ].call();
		}

		return document.getElementsByClassName('paper')[0];
	};  // End updateVisualOutput()


	var updateOutput = function () {
	/* (str) -> same Str
	* 
	* Updates visual feedback output and html code output
	*/
		var citationNode = updateVisualOutput();
		updateHTMLOutput( citationNode );

		return citationNode;
	};  // End updateOutput()


	// ========================
	// EVENT LISTENERS
	// ========================

	$('input').on( 'input', function (evnt) {
		// Update output using new data

		var val = evnt.target.value;
		// Since the input is changed, update the input data that will
		// be used for the output
		input[ evnt.target.id ] = val;

		updateOutput();
	});  // End input on input for text fileds (one line)

	$('textarea').on( 'input', function (evnt) {
		// Update output using new data

		var val = evnt.target.value;

		// Textareas format line breaks in a particular way
		// We want them formatted in a different way so they work with the process we've made
		val = val.replace(/\n/g, '<br />');
		input[ evnt.target.id ] = val;

		updateOutput();
	});  // End input on change for checkboxes


	// ========================
	// START RUNNING STUFF!
	// ========================
	addInitalHTML();

});

