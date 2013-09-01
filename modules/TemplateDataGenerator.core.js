( function ( $, mw ) {
	/**
	 * TemplateDataGenerator generates the json string for templatedata
	 * or reads existing templatedata string and allows for it to be edited
	 * with a visual modal GUI.
	 * @author Moriel Schottlender (Mooeypoo)
	 */
	mw.libs.TemplateDataGenerator = ( function () {

		var glob = {};

		/* Helper Private Methods */

		/**
		 * Show an error message in the main Edit screen
		 *
		 * @param {string} msg
		 */
		function showErrorEditPage ( msg ) {
			glob.domObjects.$errorBox.text( msg ).show();
		}

		/**
		 * Helper function to clean up the aliases string-to-array
		 *
		 * @param {str} Comma separated string
		 * @returns {array} Cleaned-up alias array
		 */
		function cleanupAliasArray ( str ) {
			return $.map( str.split(','), function( item ) {
				if ( $.trim( item ).length > 0 ) {
					return $.trim( item );
				}
			} );
		}

		/**
		 * Show an error message in the GUI
		 *
		 * @param {string} msg
		 */
		function showErrorModal ( msg ) {
			glob.domObjects.$errorModalBox.text( msg ).show();
		}

		/**
		 * Create <select> for parameter type based on the
		 * options given by { key:value }
		 *
		 * @param {obj} options
		 * @returns {DOM} <select> object
		 */
		function createTypeSelect ( opts ) {
			var $sel, op;
			$sel = $( '<select>' );
			for ( op in opts ) {
				$sel.append( $( '<option>' ).val( op ).text( opts[ op ] ) );
			}
			return $sel;
		}

		/**
		 * Parse the json information from the wikitext
		 * if it exists, and prepare DOM elements from
		 * the parameters into the global param dom json
		 *
		 * @param {string} wikitext
		 * @returns {obj} parameters json
		 */
		function parseTemplateData ( wikitext ) {
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
							glob.curr.paramDomElements[param][attrb].addClass( 'tdg-element-attr-' + attrb );

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
		}

		/**
		 * Checks the wikitext for template parameters and imports
		 * those that aren't yet in the templatedata list.
		 * Adapted from https://he.wikipedia.org/wiki/%D7%9E%D7%93%D7%99%D7%94_%D7%95%D7%99%D7%A7%D7%99:Gadget-TemplateParamWizard.js
		 */
		function importTemplateParams( wikitext ) {
			var paramExtractor = /{{3,}(.*?)[<|}]/mg,
				newParam, matches, $row, paramCounter = 0;

			while ( ( matches = paramExtractor.exec( wikitext ) ) !== null ) {
				// Make sure this parameter doesn't already exist in the paramsJson
				if ( !glob.curr.paramsJson.params || !glob.curr.paramsJson.params[matches[1]] ) {
					// add to domParams:
					newParam = addParam();
					newParam.name.val( matches[1] )	;
					$row = translateParamToRowDom( newParam );
					glob.domObjects.$modalTable.append( $row );
					paramCounter++;
				}
			}

			if ( paramCounter === 0 ) {
				showErrorModal( mw.msg( 'templatedatagenerator-modal-errormsg-import-noparams' ) );
			} else {
				showErrorModal( mw.msg( 'templatedatagenerator-modal-notice-import-numparams', paramCounter ) );
			}

		}
		/**
		 * Create a <table> DOM with initial headings for the parameters
		 * The table headings will go by the glob.paramBase
		 *
		 * @returns {DOM} Table
		 */
		function createParamTableDOM () {
			var $tbl, $tr, attrb;

			$tr = $( '<tr>' );
			for ( attrb in glob.paramBase ) {
				$tr.append(
					$( '<th>' )
						.html( glob.paramBase[attrb].label )
						.addClass( 'tdg-title-' + attrb )
					);
			}

			$tbl = $( '<table>' )
				.addClass( 'tdg-editTable' )
				.append( $tr );

			return $tbl;
		}

		/**
		 * Create a <table> DOM with initial headings for the parameters
		 * The table headings will go by the glob.paramBase
		 *
		 * @returns {DOM} Table
		 */
		function translateParamToRowDom ( paramAttrObj ) {
			var $tdDom,
				$trDom,
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
					if ( paramAttrObj[paramAttr].prop('type') === 'checkbox' ) {
						paramAttrObj[paramAttr].prop( 'checked', glob.curr.paramsJson.params[paramid][paramAttr] );
					} else {
						paramAttrObj[paramAttr].val( glob.curr.paramsJson.params[paramid][paramAttr] );
					}
				}
				$tdDom = $( '<td>' ).html( paramAttrObj[paramAttr] ).addClass( 'tdg-attr-' + paramAttr );
				// Add label to 'required' checkbox:
				if ( paramAttr === 'required' ) {
					$tdDom.append(
						$( '<label>' )
							.attr( 'for', paramAttr + '_paramid_' + paramid )
							.text( glob.paramBase.required.label )
					);
				}
				$trDom.append( $tdDom );
			}
			// Set up the name:
			if ( glob.curr.paramsJson && glob.curr.paramsJson.params && glob.curr.paramsJson.params[paramid] ) {
				$trDom.find( '.tdg-element-attr-name' ).val( paramid );
			}

			return $trDom;
		}

		/**
		 * Add an empty parameter to the paramDomElements list
		 *
		 * @returns {dom} <tr> row of the param
		 */
		function addParam () {
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
				glob.curr.paramDomElements[paramid][attrb].attr( 'id', attrb + '_paramid_' + paramid );
				glob.curr.paramDomElements[paramid][attrb].addClass( 'tdg-element-attr-' + attrb );

			}
			// Set up the 'delete' button:
			glob.curr.paramDomElements[paramid].delbutton
				.text( mw.msg( 'templatedatagenerator-modal-button-delparam' ) )
				.addClass( 'tdg-param-del' )
				.attr( 'id', 'tdg-param-del' )
				.data( 'paramid', paramid );

			return glob.curr.paramDomElements[paramid];
		}

		/**
		 * Validate the Modal inputs before continuing to the actual 'apply'
		 *
		 * @returns {boolean} Passed validation or not.
		 */
		function validateForm () {
			var paramID,
				paramName,
				paramNameArray = [],
				passed = true,
				paramProblem = false;
			// Reset:
			$( '.tdgerror' ).removeClass( 'tdgerror' );
			glob.domObjects.$errorModalBox.empty().hide();
			// Go over the paramDomElements object, look for:
			// * empty name fields
			// * duplicate *name* values:
			// * illegal characters in name fields: pipe, equal, }}
			for ( paramID in glob.curr.paramDomElements ) {
				paramProblem = false;
				paramName = glob.curr.paramDomElements[paramID].name.val();
				// Name field is empty:
				if ( paramName.length === 0 ) {
					passed = false;
					paramProblem = true;
				}

				// Check for illegal characters in param name:
				if ( paramName.match( /[\|=]|}}/ ) ) {
					passed = false;
					paramProblem = true;
				}

				// Check for dupes:
				if ( $.inArray( paramName, paramNameArray ) > -1 ) {
					// This is dupe!
					passed = false;
					paramProblem = true;
				} else {
					paramNameArray.push( paramName );
				}

				if ( paramProblem ) {
					glob.domObjects.$modalTable.find( '#param-' + paramID ).addClass( 'tdgerror' );
				}
			}
			return passed;
		}

		/**
		 * Reset the GUI completely, including the domElements and the json
		 */
		function globalReset () {
			// Reset Modal GUI:
			glob.domObjects.$modalBox.empty();
			glob.domObjects.$errorModalBox.empty().hide();
			// Reset vars:
			glob.curr = {
				newTemplate: false,
				paramDomElements: {},
				paramsJson: {}
			};
		}

		/**
		 * Create i18n-compatible Modal Buttons
		 * also contains the 'apply' functionality
		 *
		 * @param {string} btnApply the text for the 'apply' button
		 * @param {string} btnCancel the text for the 'cancel' button
		 * @returns {Array} Button objects with their functionality, for the modal
		 */
		function i18nModalButtons ( btnApply, btnCancel ) {
			var modalButtons = {};

			modalButtons[btnApply] = function () {
				var paramid,
					paramName,
					paramProp,
					wikitext = glob.domObjects.$wikitextEditorBox.val(),
					// compare the original to the new changes
					outputJson = glob.curr.paramsJson,
					finalOutput = '',
					$domEl,
					domElements,
					newValue,
					paramObj,
					propExists;

				//validate:
				if ( !validateForm() ) {
					showErrorModal( mw.msg( 'templatedatagenerator-modal-errormsg' ) );
				} else {
					// Update the description:
					outputJson.description = $( '.tdg-template-description' ).val();
					// First check if there's outpuJaon.params:
					if ( !outputJson.params ) {
						outputJson.params = {};
					}
					// Go over the parameters, check if param was marked as deleted
					// in curr.paramsJson
					for ( paramid in glob.curr.paramDomElements ) {
						domElements = glob.curr.paramDomElements[paramid];
						// Get the name of the param:
						paramName = domElements.name.val();

						// New parameter added
						if ( !outputJson.params[paramName] ) {
							paramObj = outputJson.params[paramName] = {};
						}
						// Parameter marked for deletion:
						if ( domElements.tdgMarkedForDeletion ) {
							delete outputJson.params[paramName];
							// move to next iteration:
							continue;
						} else {
							paramObj = outputJson.params[paramName];
						}

						// Go over the properties that have DOM elements
						for ( paramProp in domElements ) {
							propExists = ( paramObj.hasOwnProperty( paramProp ) );
							$domEl = domElements[paramProp];
							// check if value changed:
							switch ( paramProp ) {
								case 'name':
								case 'delbutton':
									continue;
								case 'aliases':
									newValue = cleanupAliasArray( $domEl.val() );
									if ( propExists && newValue.sort().join( '|' ) !== paramObj.aliases.sort().join( '|' ) ) {
										// replace:
										if ( newValue.length === 0 ) {
											delete paramObj.aliases;
											continue;
										} else {
											paramObj.aliases = newValue;
										}
									} else if ( !propExists ) {
										if ( newValue.length > 0 ) {
											paramObj.aliases = newValue;
										}
									}
									break;
								case 'description':
								case 'default':
								case 'label':
									newValue = $domEl.val();
									if ( paramObj[paramProp] !== newValue ) {
										if ( !newValue || newValue.length === 0 ) {
											delete paramObj[paramProp];
											continue;
										} else {
											paramObj[paramProp] = newValue;
										}
									}
									break;
								case 'type':
									newValue = $domEl.val();
									if ( paramObj[paramProp] !== newValue ) {
										if ( newValue === 'undefined' ) {
											delete paramObj[paramProp];
											continue;
										} else {
											paramObj[paramProp] = newValue;
										}
									}
									break;
								case 'required':
									newValue = $domEl.prop( 'checked' );
									if ( paramObj[paramProp] !== newValue && propExists ) {
											paramObj[paramProp] = newValue;
									}
									break;
							}

						}
					}

					// Check if we started with existing <templatedata> tags:
					if ( wikitext.match(
							/(<templatedata>)([\s\S]*?)(<\/templatedata>)/i) ) {
						// replace the <templatedata> tags
						finalOutput = wikitext.replace(
							/(<templatedata>)([\s\S]*?)(<\/templatedata>)/i,
							'<templatedata>\n' + JSON.stringify( outputJson, null, '	' ) + '\n</templatedata>'
						);

					} else {
						// add <templatedata> tags:
						finalOutput = wikitext + '\n<templatedata>\n';
						finalOutput += JSON.stringify( outputJson, null, '	' );
						finalOutput += '\n</templatedata>';
					}
					// Append the json string:
					glob.domObjects.$wikitextEditorBox.val( finalOutput );
					// Close the modal:
					glob.domObjects.$modalBox.dialog( 'close' );
				}
			};

			modalButtons[btnCancel] = function () {
				glob.domObjects.$modalBox.dialog( 'close' );
			};

			return modalButtons;
		}

		/** Public Methods **/
		return {
			/**
			 * Injects required DOM elements to the edit screen
			 */
			init: function () {
				// Prepare the globals:
				glob = {
					paramBase: {
						name: {
							label: mw.msg( 'templatedatagenerator-modal-table-param-name' ),
							dom: $( '<input>' )
						},
						aliases: {
							label: mw.msg( 'templatedatagenerator-modal-table-param-aliases' ),
							dom: $( '<input>' )
						},
						label: {
							label: mw.msg( 'templatedatagenerator-modal-table-param-label' ),
							dom: $( '<input>' )
						},
						description: {
							label: mw.msg( 'templatedatagenerator-modal-table-param-desc' ),
							dom: $( '<textarea>' )
						},
						type: {
							label: mw.msg( 'templatedatagenerator-modal-table-param-type' ),
							dom: $( '<select>' )
						},
						'default': {
							label: mw.msg( 'templatedatagenerator-modal-table-param-default' ),
							dom: $( '<textarea>' )
						},
						'required': {
							label: mw.msg( 'templatedatagenerator-modal-table-param-required' ),
							dom: $( '<input type="checkbox" />' )
						},
						delbutton: {
							label: mw.msg( 'templatedatagenerator-modal-table-param-actions' ),
							dom: $( '<button>' )
								.button()
								.addClass( 'tdg-param-button-del buttonRed' )
								.click( function () {
									var paramid = $( this ).data( 'paramid' );
									// flag as DELETED in glob.curr.paramDomElements[paramid] (property tdgDELETED)
									if (glob.curr.paramDomElements[paramid]) {
										glob.curr.paramDomElements[paramid].tdgMarkedForDeletion = true;
									}
									// delete the DOM row from table:
									// (Don't delete property from paramDomElements,
									// so when we go over the DOM elements on 'apply' this
									// parameter is recognized as marked for deletion)
									$( '#param-' + paramid ).remove();
								} )
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
							.button()
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
				};

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
			createModal: function ( wikitextBox ) {
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
				if ( !$.isEmptyObject( glob.curr.paramsJson ) ) {
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
					.append( $( '<h3>' )
						.addClass( 'tdg-title' )
						.text( mw.msg( 'templatedatagenerator-modal-title-templatedesc' ) )
					)
					.append( $descBox )
					.append( glob.domObjects.$errorModalBox )
					.append( $( '<h3>' )
						.addClass( 'tdg-title' )
						.text( mw.msg( 'templatedatagenerator-modal-title-templateparams' ) )
					)
					.append(
						$( '<button>' )
							.text( mw.msg( 'templatedatagenerator-modal-button-importParams' ) )
							.addClass( 'tdg-addparam' )
							.click( function () {
								// TODO: Check that we're not in the /doc subpage
								importTemplateParams( glob.domObjects.$wikitextEditorBox.val() );
							} ) )
					.append( glob.domObjects.$modalTable )
					.append(
						$( '<button>' )
							.button()
							.text( mw.msg( 'templatedatagenerator-modal-button-addparam' ) )
							.addClass( 'tdg-addparam' )
							.click( function () {
								var newParam = addParam(),
									$row = translateParamToRowDom( newParam );
									glob.domObjects.$modalTable.append( $row );
						} )
					);

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
