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
		$( '#dialog-form' ).html( '' ); //reset
		// Create "type" selectbox:
		selOpts = {
			'Unknown': 'undefined',
			'Number': 'number',
			'String': 'string',
			'User': 'string/wiki-user-name',
			'Page': 'string/wiki-page-name',
		};

		var typeSel = $( '<select>' );
		typeSel.append( $( '<option>', { 'value': '', 'html': '' } ) );
		for (sel in selOpts) {
			typeSel.append( $( '<option>', { 'value': selOpts[sel], 'html': sel } ) );
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
			var pCounter = 0, pAliases = '';
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
				var tSelect = typeSel.clone().attr('id', 'tdc_pType_' + pCounter );
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
					{ html: $( '<input>', { 'type': 'text', 'id': 'tdg_pName_' + pCounter, 'value': param } ) },
					{ html: $( '<input>', { 'type': 'text', 'id': 'tdg_pAliases_' + pCounter, 'value': pAliases } ) },
					{ html: $( '<input>', { 'type': 'text', 'id': 'tdg_pLabel_' + pCounter, 'value': jsonTmplData.params[param].label } ) },
					{ html: $( '<input>', { 'type': 'text', 'id': 'tdg_pDesc_' + pCounter, 'value': pDesc } ) },
					{ html: tSelect },
					{ html: $( '<input>', { 'type': 'text', 'id': 'tdg_pDefault_' + pCounter, 'value': pDefault } ) },
					{ html: $( '<input>', { 'type': 'checkbox', 'id': 'tdg_p_' + pCounter, 'value': 'required', 'checked': reqChecked } ) }
				] ) );
				pCounter++;
			}
			console.log(jsonTmplData.params);
		}
		
		// "Add Param" button:
		var addButton = $( '<button>', { 'id': 'tdg_add_param', 'class': 'tdg-button-add-param', 'text': mw.message( 'templatedatagenerator-modal-button-addparam' ) } );
		addButton.click( function() {
			//add empty row:
				var tSelect = typeSel.clone().attr('id', 'tdc_pType_' + pCounter );
				tbl.append( getRow( 'tdg-tr-param', [
					{ html: $( '<input>', { 'type': 'text', 'id': 'tdg_pName_' + pCounter, 'value': '' } ) },
					{ html: $( '<input>', { 'type': 'text', 'id': 'tdg_pAliases_' + pCounter, 'value': '' } ) },
					{ html: $( '<input>', { 'type': 'text', 'id': 'tdg_pLabel_' + pCounter, 'value': '' } ) },
					{ html: $( '<input>', { 'type': 'text', 'id': 'tdg_pDesc_' + pCounter, 'value': '' } ) },
					{ html: tSelect },
					{ html: $( '<input>', { 'type': 'text', 'id': 'tdg_pDefault_' + pCounter, 'value': '' } ) },
					{ html: $( '<input>', { 'type': 'checkbox', 'id': 'tdg_p_' + pCounter, 'value': 'required' } ) }
				] ) );
				pCounter++;
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
		var row = $( '<tr>', { 'class': trClass });
		tdObj.forEach( function(td) {
			row.append( $('<td>', td ) );
		});

		return row;
	};
	
	
});