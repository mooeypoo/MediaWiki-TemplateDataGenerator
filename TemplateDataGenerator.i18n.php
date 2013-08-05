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
	'templatedatagenerator-title' => 'TemplateData Generator',
	'templatedatagenerator-desc' => 'Assists with the generation and editing of the necessary JSON string required for VisualEditor\'s TemplateData',
	'templatedatagenerator-editbutton' => 'Generate TemplateData',
	'templatedatagenerator-errormsg-jsonbadformat' => 'Bad JSON format. Either correct it, or delete the current <templatedata> tags and try again.',
	'templatedatagenerator-modal-errormsg' => 'Errors found. Please make sure there are no empty or duplicate parameter names.',
	'templatedatagenerator-modal-title' => 'TemplateData Generator',
	'templatedatagenerator-modal-title-templatedesc' => 'Template description',
	'templatedatagenerator-modal-title-templateparams' => 'Template parameters',
	'templatedatagenerator-modal-table-param-name' => 'Name',
	'templatedatagenerator-modal-table-param-aliases' => 'Aliases<br />(comma separated)',
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
	'templatedatagenerator-modal-button-addparam' => 'Add parameter',
	'templatedatagenerator-modal-button-delparam' => 'Delete parameter',
	'templatedatagenerator-modal-buttons-apply' => 'Apply',
	'templatedatagenerator-modal-buttons-cancel' => 'Cancel',
);

/** Message documentation (Message documentation)
 * @author Moriel Schottlender
 */
$messages['qqq'] = array(
	'templatedatagenerator-desc' => '{{desc|name=TemplateDataGenerator|url=https://github.com/mooeypoo/MediaWiki-TemplateDataGenerator}}',
	'templatedatagenerator-editbutton' => 'The label of the button, appearing above the editor field.',
	'templatedatagenerator-errormsg-jsonbadformat' => 'Error message that appears in case the JSON string is not possible to parse. The user is asked to either correct the json syntax or delete the values between the &lt;templatedata&gt; tags and try again.',
	'templatedatagenerator-modal-errormsg' => 'Error message that appears in the templateData Generator GUI in case there are empty or duplicate parameter names',
	'templatedatagenerator-modal-title' => 'Title of the modal popup.',
	'templatedatagenerator-modal-title-templatedesc' => 'The title for the template description',
	'templatedatagenerator-modal-title-templateparams' => 'The title for the template parameters',
	'templatedatagenerator-modal-table-param-name' => 'Label for a table heading: Name of the parameter',
	'templatedatagenerator-modal-table-param-aliases' => 'Label for a table heading: Aliases of the parameter, instruct the user to separate aliases with commas.',
	'templatedatagenerator-modal-table-param-label' => 'Label for a table heading: Label of the parameter',
	'templatedatagenerator-modal-table-param-desc' => 'Label for a table heading: Description of the parameter',
	'templatedatagenerator-modal-table-param-type' => 'Label for a table heading: Type of the parameter',
	'templatedatagenerator-modal-table-param-type-undefined' => 'A possible parameter type: Undefined',
	'templatedatagenerator-modal-table-param-type-number' => 'A possible parameter type: Number',
	'templatedatagenerator-modal-table-param-type-string' => 'A possible parameter type: String',
	'templatedatagenerator-modal-table-param-type-user' => 'A possible parameter type: User',
	'templatedatagenerator-modal-table-param-type-page' => 'A possible parameter type: Page',
	'templatedatagenerator-modal-table-param-default' => 'Label for a table heading: Default value of the parameter',
	'templatedatagenerator-modal-table-param-required' => 'Label for a table heading: Required status of the parameter',
	'templatedatagenerator-modal-table-param-actions' => 'Label for a table heading: Parameter actions in the table',
	'templatedatagenerator-modal-button-addparam' => 'Button to add a parameter',
	'templatedatagenerator-modal-button-delparam' => 'Button to delete a parameter',
	'templatedatagenerator-modal-buttons-apply' => 'Label of the apply button',
	'templatedatagenerator-modal-buttons-cancel' => 'Label of the cancel button',
);

/** Hebrew (עברית)
 * @author Amire80
 */
$messages['he'] = array(
	'templatedatagenerator-title' => 'TemplateData Generator',
	'templatedatagenerator-desc' => 'מסייע ביצירה ובעריכה של קוד JSON שנחוץ לנתוני תבנית (TemplateData) של העורך החזותי',
	'templatedatagenerator-editbutton' => 'יצירת נתוני תבנית',
	'templatedatagenerator-errormsg-jsonbadformat' => 'JSON בלתי־תקין. נא לתאן אותו או למחוק את הטקסט בין תגי <templatedata> ולנסות שוב.',
	'templatedatagenerator-modal-title' => 'מחולל נתוני תבנית',
	'templatedatagenerator-modal-title-templatedesc' => 'תיאור תבנית',
	'templatedatagenerator-modal-title-templateparams' => 'פרמטרי תבנית',
	'templatedatagenerator-modal-table-param-name' => 'שם',
	'templatedatagenerator-modal-table-param-aliases' => 'כינויים (מופרדים בפסיק)',
	'templatedatagenerator-modal-table-param-label' => 'תווית',
	'templatedatagenerator-modal-table-param-desc' => 'תיאור',
	'templatedatagenerator-modal-table-param-type' => 'סוג',
	'templatedatagenerator-modal-table-param-type-undefined' => 'בלתי־מוגדר',
	'templatedatagenerator-modal-table-param-type-number' => 'מספר',
	'templatedatagenerator-modal-table-param-type-string' => 'מחרוזת',
	'templatedatagenerator-modal-table-param-type-user' => 'משתמש',
	'templatedatagenerator-modal-table-param-type-page' => 'דף',
	'templatedatagenerator-modal-table-param-default' => 'ערך התחלתי',
	'templatedatagenerator-modal-table-param-required' => 'נדרש',
	'templatedatagenerator-modal-table-param-actions' => 'פעולות',
	'templatedatagenerator-modal-button-addparam' => 'הוספת פרמטר',
	'templatedatagenerator-modal-button-delparam' => 'מחיקת פרמטר',
	'templatedatagenerator-modal-buttons-apply' => 'החלה',
	'templatedatagenerator-modal-buttons-cancel' => 'ביטול',
);
