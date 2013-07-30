
var TemplateDataGenerator = (function( ) {
	var i18nModal, jsonTmplData, wikicontent, error, param,
	newTemplateData, textboxParts = [],

	// Create the necessary DOM elements:
	$editButton = $( '<button>' )
		.addClass( 'tdg-editscreen-main-button' )
		.text( mw.msg( 'templatedatagenerator-editbutton' ) ),
	$errorBox = $( '<div>' )
		.addClass( 'tdg-editscreen-error-msg' ),
	$modalBox = $( '<div>' )
		.addClass( 'tdg-editscreen-modal-form' )
		.attr( 'id', 'modal-box' )
		.attr( 'title', mw.msg( 'templatedatagenerator-modal-title' ) )
		.hide(),

	// Holds existing JSON information from the edit box
	jsonInputData = '';

	// Keep track of parameter count:
	paramCounter = 0,

	paramTypes = {
		'undefined': mw.msg( 'templatedatagenerator-modal-table-param-type-undefined' ),
		'number': mw.msg( 'templatedatagenerator-modal-table-param-type-number' ),
		'string': mw.msg( 'templatedatagenerator-modal-table-param-type-string' ),
		'string/wiki-user-name': mw.msg( 'templatedatagenerator-modal-table-param-type-user' ),
		'string/wiki-page-name': mw.msg( 'templatedatagenerator-modal-table-param-type-page' )
	},

	createTypeSelectBox = function() {
		var sel, $tSel = $( '<select>' )
			.append( $( '<option>' ) );

		for ( sel in paramTypes ) {
			$tSel.append(
				$( '<option>' ).prop( 'value', sel ).text( paramTypes[ sel ] )
			);
		}
		
		return $tSel;
			
	},
	
	createTableRow = function( tdContent ) {
		var $row = $( '<tr>' ), $td = $( '<td>' ), $ptd;

		tdContent.forEach( function ( td ) {
			$ptd = $td.clone();
			$row.append( $ptd.html( td ) );
		} );

		return $row;
	},
	
	showErrorMsg = function ( msg ) {
		$errorBox.text( mw.msg( msg ) );
	},

	parseTemplateData = function( content ) {
		var error, json;
		// Use regexp to get <templatedata> content
		textboxParts = content.match(
			/(<templatedata>)([\s\S]*?)(<\/templatedata>)/i
		);

		// See if there was something between the tags:
		if ( textboxParts &&
			textboxParts[2] &&
			$.trim( textboxParts[2] ).length > 0
		) {
			textboxParts[2] = $.trim( textboxParts[2] );
			// Parse the json:
			try {
				json = $.parseJSON( textboxParts[2] );
			} catch ( err ) {
				// oops, JSON isn't proper.
				showErrorMsg( 'templatedatagenerator-errormsg-jsonbadformat' );
				error = true;
			}
		} else {
			// No <templatedata> tags. Mark as new:
			newTemplateData = true;
		}
		
		return json;
	},

	i18nModal = function( btnApply, btnCancel ) {
		var modalButtons = {};

		modalButtons[btnApply] = function () {
			var jsonOut = {},
				finalOutput = '';

			// Description:
			jsonOut.description = $( '.tdg-template-desc' ).val();
			jsonOut.params = {};

			// Go over the table:
			$( '.tdg-editTable tr:gt(0)' ).each( function () {
				var trID = $( this ).data( 'data-paramnum' ),
					paramName = $( '#tdg_pName_' + trID ).val();

				jsonOut.params[ paramName ] = {};

				if ( !newTemplateData && jsonTmplData && jsonTmplData.params && jsonTmplData.params[ paramName ] ) { 
					// Try to preserve the structure of the original JSON
					// Merge the properties of the json parameter even if they're not
					// supported in the GUI for the moment
					$.extend( jsonOut.params[ paramName ], jsonTmplData.params[ paramName ] );
				}

				// Override with the edited values:
				jsonOut.params[ paramName ].label = $( '#tdg_pLabel_' + trID ).val();
				jsonOut.params[ paramName ]['type'] = $( '#tdg_pType_' + trID ).val();
				jsonOut.params[ paramName ].description = $( '#tdg_pDesc_' + trID ).val();
				jsonOut.params[ paramName ].required = $( '#tdg_pRequired_' + trID ).val();
				jsonOut.params[ paramName ]['default'] = $( '#tdg_pDefault_' + trID ).val();

				if ( $( '#tdg_pAliases_' + trID ).val() ) {
					jsonOut.params[ paramName ].aliases =
						$( '#tdg_pAliases_' + trID ).val().split( ',' );
				}
			} );

			// Now return jsonOut to the textbox:
			if ( textboxParts && textboxParts[2] ) {
				// put the json back where the tags were:
				finalOutput = wikicontent.replace(
					/(<templatedata>)([\s\S]*?)(<\/templatedata>)/i,
					'<templatedata>\n' + JSON.stringify( jsonOut, null, '	' ) + '\n</templatedata>'
				);
			} else {
				// otherwise, put this at the end of the text:
				finalOutput = wikicontent +
					'\n<templatedata>\n' +
					JSON.stringify( jsonOut, null, '\t' ) +
					'\n</templatedata>';
			}

			$( '#wpTextbox1' ).val( finalOutput );
			$modalBox.dialog( 'close' );
		};

		modalButtons[btnCancel] = function () {
			$modalBox.dialog( 'close' );
		};

		$modalBox.dialog( {
			autoOpen: false,
			height: window.innerHeight * 0.8,
			width: window.innerWidth * 0.8,
			modal: true,
			buttons: modalButtons,
			close: function () {
				// Reset:
				$modalBox.empty();
				rowCounter = 0;
			}
		} );
	};
	
	/** Public Methods **/
	return {
		/** 
		 * Initialize the page by adding the DOM elements
		 */
		init: function() {
			// Prepend to document:
			$( '#mw-content-text' )
				.prepend( $editButton )
				.prepend( $modalBox );
		},

		/**
		 * Create the Modal GUI
		 */
		createModal: function() {
			var $descText, $originalTypeSelect, $tSelect, $tbl,
				pAliases, pDesc, pDefault, pRequired, 
				$addButton, $delButton;
			
			wikicontent = $( '#wpTextbox1' ).val();

			// Get data from textbox
			jsonTmplData = parseTemplateData( wikicontent );
			if (!error) {
				// Template Description:
				$descText = $( '<textarea>' )
					.addClass( 'tdg-template-desc' );
				if ( !newTemplateData && jsonTmplData && jsonTmplData.description ) {
					$descText.html( jsonTmplData.description );
				}
				
				// Type Selection:
				$originalTypeSelect = createTypeSelectBox();
				
				// Table:
				$tbl = $( '<table>' )
					.addClass( 'tdg-editTable' )
					// Header:
					.append( createTableRow( [ 
						mw.msg( 'templatedatagenerator-modal-table-param-name' ),
						mw.msg( 'templatedatagenerator-modal-table-param-aliases' ),
						mw.msg( 'templatedatagenerator-modal-table-param-label' ),
						mw.msg( 'templatedatagenerator-modal-table-param-desc' ),
						mw.msg( 'templatedatagenerator-modal-table-param-type' ),
						mw.msg( 'templatedatagenerator-modal-table-param-default' ),
						mw.msg( 'templatedatagenerator-modal-table-param-required' ),
						mw.msg( 'templatedatagenerator-modal-table-param-actions' )
					] ) );
				
				// Add Existing Parameters:
				if ( !newTemplateData && jsonTmplData && jsonTmplData.params ) {
					for ( param in jsonTmplData.params ) {
						// Set up the details:
						pAliases = '';
						if ( jsonTmplData.params[param].aliases ) {
							pAliases = jsonTmplData.params[param].aliases.join( ',' );
						}

						pDesc = '';
						if ( typeof jsonTmplData.params[param].description === 'string' ) {
							pDesc = jsonTmplData.params[param].description;
						}

						// Type:
						$tSelect = $originalTypeSelect.clone().attr( 'id', 'tdg_pType_' + paramCounter );
						if ( jsonTmplData.params[param].type ) {
							$tSelect.val( jsonTmplData.params[param].type );
						} else {
							$tSelect.val( 0 );
						}

						pDefault = '';
						if ( jsonTmplData.params[param]['default'] ) {
							pDefault = jsonTmplData.params[param]['default'];
						}

						pRequired = ( jsonTmplData.params[param].required !== undefined ) ?
							jsonTmplData.params[param].required :
							false;
						
						$delButton = $( '<button>' )
							.attr('id', 'tdg_pButton_' + paramCounter)
							.data( 'paramnum', paramCounter )
							.addClass( 'tdg-param-button-delete' )
							.text( mw.msg( 'templatedatagenerator-modal-button-delparam' ) );
						
						$delButton.click( function () {
								$( '.tdg-paramcount-' + $( this ).data( 'paramnum' ) ).remove();
							} );

						// Add Row:
						$tbl.append( 
							createTableRow( [
								$( '<input>' ).attr( 'id', 'tdg_pName_' + paramCounter ).val( param ),
								$( '<input>' ).attr( 'id', 'tdg_pAliases_' + paramCounter ).val( pAliases ),
								$( '<input>' ).attr( 'id', 'tdg_pLabel_' + paramCounter ).val( jsonTmplData.params[param].label ),
								$( '<textarea>' ).attr( 'id', 'tdg_pDesc_' + paramCounter ).val( pDesc ),
								$tSelect,
								$( '<input>' ).attr( 'id', 'tdg_pDefault_' + paramCounter ).val( pDefault ),
								$( '<input type="checkbox"/>' ).attr( 'id', 'tdg_pRequired' + paramCounter ).prop( 'checked', pRequired ),
								$delButton
							] )
							.addClass( 'tdg-tr-param tdg-paramcount-' + paramCounter )
							.data( 'data-paramnum', paramCounter  )
						);
						paramCounter++;
					}
				}
				
				// Add the "ADD PARAM" button:
				$addButton = $( '<button>' )
					.attr( 'id', 'tdg_add_param')
					.addClass( 'tdg-button-add-param' )
					.text( mw.msg( 'templatedatagenerator-modal-button-addparam' ) )
					.click( function () {
						var $tSelect, $dButton;

						// add an empty row:
						$dButton = $( '<button>' )
							.attr( 'id', 'tdg_pButton_' + paramCounter )
							.data( 'paramnum', paramCounter )
							.addClass( 'tdg-param-button-delete' )
							.text( mw.msg( 'templatedatagenerator-modal-button-delparam' ) );
						
						$dButton.click( function () {
								$( '.tdg-paramcount-' + $( this ).data( 'paramnum' ) ).remove();
							} );

						$tSelect = $originalTypeSelect.clone().attr('id', 'tdg_pType_' + paramCounter );
						$tbl.append( 
							createTableRow( [
								$( '<input>' ).attr( 'id', 'tdg_pName_' + paramCounter ),
								$( '<input>' ).attr( 'id', 'tdg_pAliases_' + paramCounter ),
								$( '<input>' ).attr( 'id', 'tdg_pLabel_' + paramCounter ),
								$( '<textarea>' ).attr( 'id', 'tdg_pDesc_' + paramCounter ),
								$tSelect,
								$( '<input>' ).attr( 'id', 'tdg_pDefault_' + paramCounter ),
								$( '<input type="checkbox"/>' ).attr( 'id', 'tdg_pRequired' + paramCounter ),
								$dButton
							] )
								.addClass( 'tdg-tr-param tdg-paramcount-' + paramCounter )
								.data( 'data-paramnum', paramCounter  )
						);
						paramCounter++;
					} );
				
				// Build the GUI:
				
				$modalBox.append(
					$( '<span>' )
						.addClass( 'tdg-title' )
						.text( mw.msg( 'templatedatagenerator-modal-title-templatedesc' ) ),
					$descText,
					$( '<span>' )
						.addClass( 'tdg-title' )
						.text( mw.msg( 'templatedatagenerator-modal-title-templateparams' ) ),
					$tbl,
					$addButton
				);

				// Set up the Modal:
				i18nModal(
					mw.msg( 'templatedatagenerator-modal-buttons-apply' ),
					mw.msg( 'templatedatagenerator-modal-buttons-cancel' )
				);

				// return the $modalBox object so it can be called on button click:
				return $modalBox;
			}
		}
	};
	
})();

