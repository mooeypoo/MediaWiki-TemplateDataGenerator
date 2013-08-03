( function ( $, mw ) {
	/**
	 * TemplateDataGenerator generates the json string for templatedata
	 * or reads existing templatedata string and allows for it to be edited
	 * with a visual modal GUI.
	 * @author Moriel Schottlender (Mooeypoo)
	 */
	mw.libs.TemplateDataGenerator = ( function() {

		var glob = {
			paramBase: {
				name: {
					label: mw.msg( 'templatedatagenerator-modal-table-param-name' ),
					dom: $( '<input>' ),
					readMethod: 'val'
				},
				aliases: {
					label: mw.msg( 'templatedatagenerator-modal-table-param-aliases' ),
					dom: $( '<input>' ),
					readMethod: 'val'
				},
				label: {
					label: mw.msg( 'templatedatagenerator-modal-table-param-label' ),
					dom: $( '<input>' ),
					readMethod: 'val'
				},
				description: {
					label: mw.msg( 'templatedatagenerator-modal-table-param-desc' ),
					dom: $( '<textarea>' ),
					readMethod: 'val'
				},
				type: {
					label: mw.msg( 'templatedatagenerator-modal-table-param-type' ),
					dom: $( '<select>' ),
					readMethod: 'val'
				},
				'default': {
					label: mw.msg( 'templatedatagenerator-modal-table-param-default' ),
					dom: $( '<input>' ),
					readMethod: 'val'
				},
				'required': {
					label: mw.msg( 'templatedatagenerator-modal-table-param-required' ),
					dom: $( '<input type="checkbox" />' ),
					readMethod: 'chk'
				},
				delbutton: {
					label: mw.msg( 'templatedatagenerator-modal-table-param-actions' ),
					dom: $( '<button>' )
						.addClass( 'tdg-param-button-del' )
						.click( function() {
							var paramid = $( this ).data( 'paramid' );
							// delete the dom record:
							delete glob.curr.paramDomElements[paramid];
							// delete the actual row:
							$( '#param-' + paramid ).remove();
						} ),
					readMethod: 'none'
				}
			},
			paramTypes: {
				'undefined': mw.msg( 'templatedatagenerator-modal-table-param-type-undefined' ),
				'number': mw.msg( 'templatedatagenerator-modal-table-param-type-number' ),
				'string': mw.msg( 'templatedatagenerator-modal-table-param-type-string' ),
				'string/wiki-user-name': mw.msg( 'templatedatagenerator-modal-table-param-type-user' ),
				'string/wiki-page-name': mw.msg( 'templatedatagenerator-modal-table-param-type-page' )
			},
			domObjects: {
				$editButton: $( '<button>' )
					.addClass( 'tdg-editscreen-main-button' )
					.text( mw.msg( 'templatedatagenerator-editbutton' ) ),
				$errorBox: $( '<div>' )
					.addClass( 'tdg-editscreen-error-msg' )
					.hide(),
				$errorModalBox: $( '<div>' )
					.addClass( 'tdg-errorbox' )
					.hide(),
				$modalBox: $( '<div>' )
					.addClass( 'tdg-editscreen-modal-form' )
					.attr( 'id', 'modal-box' )
					.attr( 'title', mw.msg( 'templatedatagenerator-modal-title' ) )
					.hide(),
				$modalTable: {},
				$wikitextEditorBox: {}
			},
			curr: {
				newTemplate: false,
				paramDomElements: {},
				paramsJson: {}
			}
		},

		/* Helper Private Methods */

		/**
		 * Show an error message in the main Edit screen
		 *
		 * @param {string} msg
		 */
		showErrorEditPage = function( msg ) {
			glob.domObjects.$errorBox.text( msg ).show();
		},


		/**
		 * Show an error message in the GUI
		 *
		 * @param {string} msg
		 */
		showErrorModal = function( msg ) {
			glob.domObjects.$errorModalBox.text( msg ).show();
		},

		/**
		 * Create <select> for parameter type based on the
		 * options given by { key:value }
		 *
		 * @param {obj} options
		 * @returns {DOM} <select> object
		 */
		createTypeSelect = function( opts ) {
			var $sel, op;
			$sel = $( '<select>' );
			for ( op in opts ) {
				$sel.append( $( '<option>' ).val( op ).text( opts[ op ] ) );
			}
			return $sel;
		},

		/**
		 * Parse the json information from the wikitext
		 * if it exists, and prepare DOM elements from
		 * the parameters into the global param dom json
		 *
		 * @param {string} wikitext
		 * @returns {obj} parameters json
		 */
		parseTemplateData = function( wikitext ) {
			var attrb,
				$tmpDom,
				param,
				jsonParams = {},
				parts = wikitext.match(
					/(<templatedata>)([\s\S]*?)(<\/templatedata>)/i
				);

			// Check if <templatedata> exists
			if ( parts && parts[2] ) {
				// Make sure it's not empty:
				if ( $.trim( parts[2] ).length > 0 ) {
					try {
						jsonParams = $.parseJSON( $.trim( parts[2] ) );
					} catch ( err ) {
						//oops, JSON isn't proper:
						showErrorEditPage( mw.msg( 'templatedatagenerator-errormsg-jsonbadformat' ) );
						return {};
					}
				} else {
					glob.curr.newTemplate = true;
				}

				// See if jsonParams has 'params'
				if ( jsonParams && jsonParams.params ) {

					// add dom elements to the json data params:
					for ( param in jsonParams.params ) {
						glob.curr.paramDomElements[param] = {};
						// Create dom elements per parameter
						for ( attrb in glob.paramBase ) {
							// Set up the dom element:
							if ( attrb === 'type' ) {
								$tmpDom = createTypeSelect( glob.paramTypes );
							} else {
								$tmpDom = glob.paramBase[attrb].dom;
							}
							glob.curr.paramDomElements[param][attrb] = $tmpDom.clone( true );
							glob.curr.paramDomElements[param][attrb].data( 'paramid', param );
							glob.curr.paramDomElements[param][attrb].addClass( 'tdg-param-attr-' + attrb );

						}
						// Set up the 'delete' button:
						glob.curr.paramDomElements[param].delbutton
							.text( mw.msg( 'templatedatagenerator-modal-button-delparam' ) )
							.addClass( 'tdg-param-del' )
							.attr( 'id', 'tdg-param-del' )
							.data( 'paramid', param );

					}
				}
			}

			return jsonParams;

		},

		/**
		 * Create a <table> DOM with initial headings for the parameters
		 * The table headings will go by the glob.paramBase
		 *
		 * @returns {DOM} Table
		 */
		createParamTableDOM = function() {
			var $tbl, $tr, param;

			$tr = $( '<tr>' );
			for ( param in glob.paramBase ) {
				$tr.append( $( '<th>' ).text( glob.paramBase[param].label ) );
			}

			$tbl = $( '<table>' )
				.addClass( 'tdg-editTable' )
				.append( $tr );

			return $tbl;
		},

		/**
		 * Create a <table> DOM with initial headings for the parameters
		 * The table headings will go by the glob.paramBase
		 *
		 * @returns {DOM} Table
		 */
		translateParamToRowDom = function( paramAttrObj ) {
			var $trDom,
				paramAttr,
				paramid = paramAttrObj.delbutton.data( 'paramid' );

			$trDom = $( '<tr>' )
				.attr( 'id', 'param-' + paramid )
				.data( 'paramid', paramid );

			// Go over the attributes for <td>s:
			for ( paramAttr in paramAttrObj ) {
				// Check if value already exists for this in the original json:
				if ( glob.curr.paramsJson && glob.curr.paramsJson.params && glob.curr.paramsJson.params[paramid] && glob.curr.paramsJson.params[paramid][paramAttr] ) {
					// make sure we set the value correctly based on the DOM element:
					if ( paramAttrObj[paramAttr].is( ':checkbox' ) ) {
						paramAttrObj[paramAttr].prop( 'checked', glob.curr.paramsJson.params[paramid][paramAttr] );
					} else {
						paramAttrObj[paramAttr].val( glob.curr.paramsJson.params[paramid][paramAttr] );
					}
				}
				$trDom.append( $( '<td>' ).html( paramAttrObj[paramAttr] ) );
			}

			// Set up the name:
			if ( glob.curr.paramsJson && glob.curr.paramsJson.params && glob.curr.paramsJson.params[paramid] ) {
				$trDom.find( '.tdg-param-attr-name' ).val( paramid );
			}
			
			return $trDom;
		},

		/**
		 * Add an empty parameter to the paramDomElements list
		 *
		 * @returns {dom} <tr> row of the param
		 */
		addParam = function() {
			var attrb,
				$tmpDom,
				// Create a unique identifier for paramid:
				paramid = 'new_' + $.now();

			// Add to the DOM object:
			glob.curr.paramDomElements[paramid] = {};

			for ( attrb in glob.paramBase ) {
				// Set up the dom element:
				if ( attrb === 'type' ) {
					$tmpDom = createTypeSelect( glob.paramTypes );
				} else {
					$tmpDom = glob.paramBase[attrb].dom;
				}
				glob.curr.paramDomElements[paramid][attrb] = $tmpDom.clone( true );
				glob.curr.paramDomElements[paramid][attrb].data( 'paramid', paramid );
				glob.curr.paramDomElements[paramid][attrb].addClass( 'tdg-param-attr-' + attrb );

			}
			// Set up the 'delete' button:
			glob.curr.paramDomElements[paramid].delbutton
				.text( mw.msg( 'templatedatagenerator-modal-button-delparam' ) )
				.addClass( 'tdg-param-del' )
				.attr( 'id', 'tdg-param-del' )
				.data( 'paramid', paramid );

			return glob.curr.paramDomElements[paramid];
		},

		/**
		 * Validate the Modal inputs before continuing to the actual 'apply'
		 *
		 * @returns {boolean} Passed validation or not.
		 */
		validateForm = function() {
			var paramID,
				paramNameArray = [],
				passed = true;
			// Reset:
			$( '.tdgerror' ).removeClass( 'tdgerror' );
			glob.domObjects.$errorModalBox.empty().hide();
			// Go over the paramDomElements object, look for:
			// * empty name fields
			// * duplicate *name* values:
			for ( paramID in glob.curr.paramDomElements ) {
				// Name field is empty:
				if ( glob.curr.paramDomElements[paramID].name.val().length === 0 ) {
					passed = false;
					glob.domObjects.$modalTable.find( '#param-' + paramID ).addClass( 'tdgerror' );
				}

				if ( jQuery.inArray( glob.curr.paramDomElements[paramID].name.val(), paramNameArray ) > -1 ) {
					// This is dupe!
					passed = false;
					glob.domObjects.$modalTable.find( '#param-' + paramID ).addClass( 'tdgerror' );
				} else {
					paramNameArray.push( glob.curr.paramDomElements[paramID].name.val() );
				}
			}
			return passed;
		},

		/**
		 * Reset the GUI completely, including the domElements and the json
		 */
		globalReset = function() {
			// Reset Modal GUI:
			glob.domObjects.$modalBox.empty();
			glob.domObjects.$errorModalBox.empty().hide();
			// Reset vars:
			glob.curr = {
				newTemplate: false,
				paramDomElements: {},
				paramsJson: {}
			};

		},
		/**
		 * Create i18n-compatible Modal Buttons
		 * also contains the 'apply' functionality
		 *
		 * @param {string} btnApply the text for the 'apply' button
		 * @param {string} btnCancel the text for the 'cancel' button
		 * @returns {Array} Button objects with their functionality, for the modal
		 */
		i18nModalButtons = function( btnApply, btnCancel ) {
			var modalButtons = {};

			modalButtons[btnApply] = function() {
				var paramid,
					paramName,
					attrb,
					wikitext = glob.domObjects.$wikitextEditorBox.val(),
					outputJson = {},
					finalOutput = '';

				//validate:
				if ( !validateForm() ) {
					showErrorModal( mw.msg( 'templatedatagenerator-modal-errormsg' ) );
				} else {

					// create a new json element by going over paramDomElements
					// but also verify that within each param in paramDomElements
					// all *attributes* that are not represented in the GUI
					// are preserved.

					outputJson.description = $( '.tdg-template-description' ).val();
					// Add parameters:
					outputJson.params = {};
					for ( paramid in glob.curr.paramDomElements ) {
						// Transform paramid into param name, and ignore param with empty name:
						if ( glob.curr.paramDomElements[paramid].name.val() ) {
							paramName = glob.curr.paramDomElements[paramid].name.val();
							outputJson.params[paramName] = {};
							// Add the attributes that exist in the gui first:
							for ( attrb in glob.curr.paramDomElements[paramid] ) {
								if ( attrb !== 'delbutton' ) { //ignore the delbutton
									if ( glob.curr.paramDomElements[paramid][attrb].is( ':checkbox' ) ) {
										outputJson.params[paramName][attrb] = glob.curr.paramDomElements[paramid][attrb].prop( 'checked' );
									} else {
										if ( attrb === 'aliases' ) {
											outputJson.params[paramName][attrb] = glob.curr.paramDomElements[paramid][attrb].val().split(',');
										}
											outputJson.params[paramName][attrb] = glob.curr.paramDomElements[paramid][attrb].val();
									}
								}
							}

							// Add attributes that are in the original json but not in GUI:
							if ( glob.curr.paramsJson && glob.curr.paramsJson.params && glob.curr.paramsJson.params[paramid] ) {
								for ( attrb in glob.curr.paramsJson.params[paramid] ) {
									// Only add this attribute if it appears in the original json, but not in the new json:
									if ( glob.curr.paramsJson.params[paramid][attrb] && !outputJson.params[paramName][attrb] && attrb !== 'delbutton' ) {
										outputJson.params[paramName][attrb] = glob.curr.paramsJson.params[paramid][attrb];
									}
								}
							}
						}
					}

					if ( !jQuery.isEmptyObject( glob.curr.paramsJson ) ) {
						// Return the json to the textbox:
						finalOutput = wikitext.replace(
							/(<templatedata>)([\s\S]*?)(<\/templatedata>)/i,
							'<templatedata>\n' + JSON.stringify( outputJson, null, '	' ) + '\n</templatedata>'
						);

					} else {
						// Append the json to the end of the textbox:
						finalOutput = wikitext + '\n<templatedata>\n';
						finalOutput += JSON.stringify( outputJson, null, '	' );
						finalOutput += '\n</templatedata>';
					}

					glob.domObjects.$wikitextEditorBox.val( finalOutput );
					glob.domObjects.$modalBox.dialog( 'close' );
				}
			};

			modalButtons[btnCancel] = function() {
				glob.domObjects.$modalBox.dialog( 'close' );
			};

			return modalButtons;
		};

		/** Public Methods **/
		return {
			/**
			 * Injects required DOM elements to the edit screen
			 */
			init: function() {
				// Prepend to document:
				$( '#mw-content-text' )
					.prepend( glob.domObjects.$modalBox )
					.prepend( glob.domObjects.$errorBox )
					.prepend( glob.domObjects.$editButton );
			},

			/**
			 * Create the modal screen and populate it with existing
			 * data, if available
			 *
			 * @param {string} existing article wikitext
			 * @returns {DOM} modal div
			 */
			createModal: function( wikitextBox ) {
				var $row,
					paramObj,
					$descBox;

				// Reset:
				globalReset();

				glob.domObjects.$wikitextEditorBox = wikitextBox;
				$descBox = $( '<textarea>' ).addClass( 'tdg-template-description' );
				glob.domObjects.$modalTable = createParamTableDOM();

				// Parse JSON:
				glob.curr.paramsJson = parseTemplateData( glob.domObjects.$wikitextEditorBox.val() );
				if ( !jQuery.isEmptyObject( glob.curr.paramsJson ) ) {
					if ( glob.curr.paramsJson.description ) {
						$descBox.val( glob.curr.paramsJson.description );
					}
					// Build the parameter row DOMs:
					for ( paramObj in glob.curr.paramDomElements ) {
						// make the row:
						$row = translateParamToRowDom( glob.curr.paramDomElements[paramObj] );
						glob.domObjects.$modalTable.append( $row );
					}
				}

				// Build the Modal window:
				glob.domObjects.$modalBox
					.append( $( '<span>' )
								.addClass( 'tdg-title' )
								.text( mw.msg( 'templatedatagenerator-modal-title-templatedesc' ) ) )
					.append( $descBox )
					.append( glob.domObjects.$errorModalBox )
					.append( $( '<span>' )
								.addClass( 'tdg-title' )
								.text( mw.msg( 'templatedatagenerator-modal-title-templateparams' ) ) )
					.append( glob.domObjects.$modalTable )
					.append(
						$( '<button>' )
							.text( mw.msg( 'templatedatagenerator-modal-button-addparam' ) )
							.addClass( 'tdg-addparam' )
							.click( function() {
								var newParam = addParam(),
									$row = translateParamToRowDom( newParam );
									glob.domObjects.$modalTable.append( $row );
						} ) );

				glob.domObjects.$modalBox.dialog( {
					autoOpen: false,
					height: window.innerHeight * 0.8,
					width: window.innerWidth * 0.8,
					modal: true,
					buttons: i18nModalButtons(
						mw.msg( 'templatedatagenerator-modal-buttons-apply' ),
						mw.msg( 'templatedatagenerator-modal-buttons-cancel' )
					),
					close: function () {
						glob.domObjects.$modalBox.empty();
					}
				} );

				// Return the modal object
				return glob.domObjects.$modalBox;
			}
		};
	} )();
}( jQuery, mediaWiki ) );