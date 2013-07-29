$( document ).ready( function() {
	var jsonTmplData;
	// TODO: i18n messages for the labels of selOpts
	var selOpts = {
			'undefined': 'Unknown',
			'number': 'Number',
			'string': 'String',
			'string/wiki-user-name': 'User',
			'string/wiki-page-name': 'Page',
		};
	var rowCounter = 0; 

	$('.tdg-editscreen-main-button').click( function() { 
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
		$( '#dialog-form' ).empty(); //reset
		// Create "type" selectbox:
		var typeSel = $( '<select>' );
		typeSel.append( $( '<option>' ) );
		for (sel in selOpts) {
			typeSel.append( $( '<option>').prop( 'value', sel ).text( selOpts[ sel ] ) );
		}

		// Description:
		var descText = $( '<textarea>', { 'class': 'tdg-template-desc' });
		if ( !newTemplateData && jsonTmplData && jsonTmplData.description ) {
			descText.html( jsonTmplData.description );
		}
		
		// Param Table:
		var tbl = $( '<table>', { 'class': 'tdg-editTable' } ).append( getRow( 'tdg-tr-head',
			[ 
				{ 'text': mw.message( 'templatedatagenerator-modal-table-param-name' ) },
				{ 'text': mw.message( 'templatedatagenerator-modal-table-param-aliases' ) },
				{ 'text': mw.message( 'templatedatagenerator-modal-table-param-label' ) },
				{ 'text': mw.message( 'templatedatagenerator-modal-table-param-desc' ) },
				{ 'text': mw.message( 'templatedatagenerator-modal-table-param-type' ) },
				{ 'text': mw.message( 'templatedatagenerator-modal-table-param-default' ) },
				{ 'text': mw.message( 'templatedatagenerator-modal-table-param-required' ) },
				{ 'text': mw.message( 'templatedatagenerator-modal-table-param-actions' ) },
			] ) );
		
		// Add existing parameters:
		if ( !newTemplateData && jsonTmplData && jsonTmplData.params ) {
			var pAliases = '';
			for (param in jsonTmplData.params) {
				
				// Set up the row:
				pAliases = '';
				if ( jsonTmplData.params[param].aliases ) {
					pAliases = jsonTmplData.params[param].aliases.join(',');
				}
				
				pDesc = '';
				if ( typeof jsonTmplData.params[param].description === 'object' ) {
					// TODO: 
					// work with description that has languages
				} else {
					pDesc = jsonTmplData.params[param].description;
				}
				
				// Type:
				var tSelect = typeSel.clone().attr('id', 'tdc_pType_' + rowCounter );
				if ( jsonTmplData.params[param].type ) {
					tSelect.val( jsonTmplData.params[param].type );
				} else {
					tSelect.val( 0 );
				}

				pDefault = '';
				if ( jsonTmplData.params[param]['default'] ) {
					pDefault = jsonTmplData.params[param]['default'];
				}
				
				reqChecked = ( typeof jsonTmplData.params[param].required !== 'undefined' ) ? jsonTmplData.params[param].required: false;

				// Add row:
				tbl.append( getRow( 'tdg-tr-param', [
					{ html: $( '<input>' ).attr( 'id', 'tdg_pName_' + rowCounter ).val( param ) },
					{ html: $( '<input>' ).attr( 'id', 'tdg_pAliases_' + rowCounter ).val( pAliases ) },
					{ html: $( '<input>' ).attr( 'id', 'tdg_pLabel_' + rowCounter ).val( jsonTmplData.params[param].label ) },
					{ html: $( '<input>' ).attr( 'id', 'tdg_pDesc_' + rowCounter ).val( pDesc ) },
					{ html: tSelect },
					{ html: $( '<input>' ).attr( 'id', 'tdg_pDefault_' + rowCounter ).val( pDefault ) },
					{ html: $( '<input type="checkbox"/>' ).attr( 'id', 'tdg_pRequired' + rowCounter ).prop( 'checked', reqChecked ) },
				] ) );
				rowCounter++;
			}
			console.log(jsonTmplData.params);
		}
		
		// "Add Param" button:
		var addButton = $( '<button>' ).attr( 'id', 'tdg_add_param').addClass( 'tdg-button-add-param' ).text( mw.message( 'templatedatagenerator-modal-button-addparam' ) );
		addButton.click( function() {
			//add empty row:
			var tSelect = typeSel.clone().attr('id', 'tdc_pType_' + rowCounter );
			tbl.append( getRow( 'tdg-tr-param', [
				{ html: $( '<input>' ).attr( 'id', 'tdg_pName_' + rowCounter ) },
				{ html: $( '<input>' ).attr( 'id', 'tdg_pAliases_' + rowCounter ) },
				{ html: $( '<input>' ).attr( 'id', 'tdg_pLabel_' + rowCounter ) },
				{ html: $( '<input>' ).attr( 'id', 'tdg_pDesc_' + rowCounter ) },
				{ html: tSelect },
				{ html: $( '<input>' ).attr( 'id', 'tdg_pDefault_' + rowCounter ) },
				{ html: $( '<input type="checkbox"/>' ).attr( 'id', 'tdg_pRequired' + rowCounter ) },
			] ) );
			rowCounter++;
		} );
		
		// Build the GUI
		$( '#dialog-form' )
			.append( $( '<span>', { 'class': 'tdg-title', 'text': mw.message( 'templatedatagenerator-modal-title-templatedesc' ) }) )
			.append( descText )
			.append( $( '<span>', { 'class': 'tdg-title', 'text': mw.message( 'templatedatagenerator-modal-title-templateparams' ) }) )
			.append( tbl )
			.append( addButton );
		
		// Call the modal:
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
		var row = $( '<tr>' ).addClass( trClass );
		tdObj.forEach( function(td) {
			row.append( $('<td>', td ) );
		});

		return row;
	};
	
});