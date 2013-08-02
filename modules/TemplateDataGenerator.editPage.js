( function ( $, mw ) {
	'use strict';

	
	$( document ).ready(function () { 

		// Check if there's an editor textarea (and that we're in Template namespace):
		if ( $( '#wpTextbox1' ).length > 0 && mw.config.get('wgCanonicalNamespace') === 'Template' ) {
			var $modalBox,
				$textbox = $( '#wpTextbox1' );

			TemplateDataGenerator.init();

			$( '.tdg-editscreen-main-button' ).click( function () {
				// TODO: Pass $textbox
				$modalBox = TemplateDataGenerator.createModal( $textbox );
				
				$modalBox.dialog( 'open' );
			});
		}

	} );

}( jQuery, mediaWiki ) );
