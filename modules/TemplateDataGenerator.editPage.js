( function ( $, mw ) {
	'use strict';

	$( document ).ready(function () {

			var $modalBox,
				$textbox = $( '#wpTextbox1' ),
				tmplDataGen;

		// Check if there's an editor textarea (and that we're in Template namespace):
		if ( $textbox.length > 0 && mw.config.get( 'wgCanonicalNamespace' ) === 'Template' ) {
			
			tmplDataGen = mw.libs.TemplateDataGenerator;
			tmplDataGen.init();
			$( '.tdg-editscreen-main-button' ).click( function () {
				// TODO: Pass $textbox
				$modalBox = tmplDataGen.createModal( $textbox );

				$modalBox.dialog( 'open' );
			} );
		}

	} );

}( jQuery, mediaWiki ) );
