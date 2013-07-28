$( document ).ready( function() {
	var jsonTmplData;
	
	$('#btnTemplateDataGenerator').click( function() { 
		var wikicontent, tdata,
			newTemplateData = false;
		
		// Get the data from the textbox		
		wikicontent = $('#wpTextbox1').val();
		
		// USE REGEXP to get <templatedata> context
		tdata = wikicontent.match( /(<templatedata>)([\s\S]*?)(<\/templatedata>)/i );
		
		// See if there was something between the tags:
		if ( tdata && tdata[2] && tdata[2].trim().length > 0 ) {
			tdata[2] = tdata[2].trim();
			// Parse the json:
			try {
				jsonTmplData = $.parseJSON(tdata[2]);
			} catch ( err ) {
				// oops, JSON isn't proper. 
				// TODO: Tell the user the JSON isn't right
				console.log( "JSON Parse Error.");
			}
		} else {
			// No <templatedata> tags found. This is new.
			newTemplateData = true;
		}
		
		/** Create GUI **/
		var tbl = $( '<table>', { 'class': 'editTable' } ).append( getRow( 'tr-head',
			[ 
				mw.message( 'templatedatagenerator-modal-table-param-name' ),
				mw.message( 'templatedatagenerator-modal-table-param-desc' ),
				mw.message( 'templatedatagenerator-modal-table-param-type' ),
				mw.message( 'templatedatagenerator-modal-table-param-default' ),
				mw.message( 'templatedatagenerator-modal-table-param-required' ),
				mw.message( 'templatedatagenerator-modal-table-param-actions' ),
			] ) );
		
		
		$( '#dialog-form' ).append( tbl );
		// Call modal:
		i18nModal( mw.message( 'templatedatagenerator-modal-buttons-apply' ), mw.message( 'templatedatagenerator-modal-buttons-cancel' ) );


		
	} );
	

	/** Modal Setup **/
	var i18nModal = function( btnApply, btnCancel ) {
		var modalButtons = {};
		modalButtons[btnApply] = function() {
			// TODO: Apply JSON changes
			console.log( jsonTmplData );
			$( '#dialog-form' ).dialog( 'close' );
		};
		modalButtons[btnCancel] = function() {
			$( '#dialog-form' ).dialog( 'close' );
		};
		
		$( '#dialog-form' ).dialog({
			autoOpen: false,
			height: window.innerHeight * 0.8,
			width: window.innerWidth * 0.8,
			modal: true,
			buttons: modalButtons,
			close: function() {
				$(this).dialog( 'close' );
			}
		});
		
		$( '#dialog-form' ).dialog( 'open' );
			
	};

	/** Methods **/
	var getRow = function( trClass, tdObj ) {
		var row = $( '<tr>', { 'class': trClass });
		tdObj.forEach( function(td) {
			row.append( $('<td>', {
				'text': td
			}) );
		});

		return row;
	};
	
	
});