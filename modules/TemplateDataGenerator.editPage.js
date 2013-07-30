( function ( $, mw ) {
	'use strict';

	// Check if there's an editor textarea:
	if ( $( '#wpTextbox1' ).length > 0 ) {
		var mTemplateData = TemplateDataGenerator;
		mTemplateData.init();
	}

	$( '.tdg-editscreen-main-button' ).click( function () {
		var $modalBox = TemplateDataGenerator.createModal();
		$modalBox.dialog( 'open' );
	});
	
	
}( jQuery, mediaWiki ) );
