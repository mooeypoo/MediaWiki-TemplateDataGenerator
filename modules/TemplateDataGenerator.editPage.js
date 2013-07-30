( function ( $, mw ) {
	'use strict';
	
	var mTemplateData = TemplateDataGenerator;
	mTemplateData.init();

	$( '.tdg-editscreen-main-button' ).click( function () {
		var $modalBox = TemplateDataGenerator.createModal();
		$modalBox.dialog( 'open' );
	});
	
	
}( jQuery, mediaWiki ) );
