<?php
/**
 * Internationalisation file for TemplateDataGenerator extension.
 *
 * @file
 * @ingroup Extensions
 * @author Moriel Schottlender <moo@smarterthanthat.com>
 * @copyright
 * @licence GNU General Public Licence 2.0 or later
 */

$messages = array();

/** English
 * @author Moriel Schottlender
 */
$messages['en'] = array(
	'templatedatagenerator-title'    => 'TemplateData Generator',
	'templatedatagenerator-desc'     => 'Assists with the generation and editing of the necessary JSON string required for VisualEditor\'s TemplateData',
	'templatedatagenerator-editbutton'    => 'Generate TemplateData',
	'templatedatagenerator-errormsg-jsonbadformat' => 'Bad JSON format. Either correct it, or delete the text between the <templatedata> tags and try again.',
	'templatedatagenerator-modal-title' => 'TemplateData Generator',
	'templatedatagenerator-modal-title-templatedesc' => 'Template Description',
	'templatedatagenerator-modal-title-templateparams' => 'Template Parameters',
	'templatedatagenerator-modal-table-param-name' => 'Name',
	'templatedatagenerator-modal-table-param-aliases' => 'Aliases',
	'templatedatagenerator-modal-table-param-label' => 'Label',
	'templatedatagenerator-modal-table-param-desc' => 'Description',
	'templatedatagenerator-modal-table-param-type' => 'Type',
	'templatedatagenerator-modal-table-param-type-undefined' => 'Undefined',
	'templatedatagenerator-modal-table-param-type-number' => 'Number',
	'templatedatagenerator-modal-table-param-type-string' => 'String',
	'templatedatagenerator-modal-table-param-type-user' => 'User',
	'templatedatagenerator-modal-table-param-type-page' => 'Page',
	'templatedatagenerator-modal-table-param-default' => 'Default',
	'templatedatagenerator-modal-table-param-required' => 'Required',
	'templatedatagenerator-modal-table-param-actions' => 'Actions',
	'templatedatagenerator-modal-button-addparam' => 'Add Parameter',
	'templatedatagenerator-modal-buttons-apply'    => 'Apply',
	'templatedatagenerator-modal-buttons-cancel'    => 'Cancel',
);

/** Message documentation (Message documentation)
 * @author Moriel Schottlender
 */
$messages['qqq'] = array(
	'templatedatagenerator-desc'     => 'Extension description.',
	'templatedatagenerator-editbutton'    => 'The label of the button, appearing above the editor field.',
	'templatedatagenerator-errormsg-jsonbadformat' => 'Error message that appears in case the JSON string is not possible to parse. The user is asked to either correct the json syntax or delete the values between the &lt;templatedata&gt; tags and try again.',
	'templatedatagenerator-modal-title' => 'Title of the modal popup.',
	'templatedatagenerator-modal-title-templatedesc' => 'The title for the template description',
	'templatedatagenerator-modal-title-templateparams' => 'The title for the template parameters',
	'templatedatagenerator-modal-table-param-name' => 'Label: Name of the parameter',
	'templatedatagenerator-modal-table-param-aliases' => 'Label: Aliases of the parameter',
	'templatedatagenerator-modal-table-param-label' => 'Label: Label of the parameter',
	'templatedatagenerator-modal-table-param-desc' => 'Label: Description of the parameter',
	'templatedatagenerator-modal-table-param-type' => 'Label: Type of the parameter',
	'templatedatagenerator-modal-table-param-type-undefined' => 'A possible parameter type: Undefined',
	'templatedatagenerator-modal-table-param-type-number' => 'A possible parameter type: Number',
	'templatedatagenerator-modal-table-param-type-string' => 'A possible parameter type: String',
	'templatedatagenerator-modal-table-param-type-user' => 'A possible parameter type: User',
	'templatedatagenerator-modal-table-param-type-page' => 'A possible parameter type: Page',
	'templatedatagenerator-modal-table-param-default' => 'Label: Default value of the parameter',
	'templatedatagenerator-modal-table-param-required' => 'Label: Required status of the parameter',
	'templatedatagenerator-modal-table-param-actions' => 'Label: Parameter actions in the table',
	'templatedatagenerator-modal-button-addparam' => 'Button to add a parameter',
	'templatedatagenerator-modal-buttons-apply'    => 'Label of the apply button',
	'templatedatagenerator-modal-buttons-cancel'    => 'Label of the cancel button',
);