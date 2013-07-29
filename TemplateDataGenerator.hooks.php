<?php
/**
 * Hooks for TemplateDataGenerator extension.
 *
 * @file
 * @ingroup Extensions
 * @author Moriel Schottlender <moo@smarterthanthat.com>
 * @copyright
 * @licence GNU General Public Licence 2.0 or later
 */

if( !defined( 'MEDIAWIKI' ) ) {
	echo( "This file is an extension to the MediaWiki software and cannot be used standalone.\n" );
	die();
}

class TemplateDataGeneratorHooks {

	# Add button to the edit page
	public static function initGeneratorInEditForm( $editPage, $output ) {
		global $wgOut;

		// TODO: Add a condition to see if the page is in Template namespace?

		# Add modules
		$wgOut->addModules( 'ext.templateDataGenerator' );

		# Add 'Edit/Generate TemplateData' Button:
		$editPage->editFormPageTop .= '<div class="tdg-editscreen-error-msg"></div>';
		$editPage->editFormPageTop .= '<button class="tdg-editscreen-main-button">' . wfMessage( 'templatedatagenerator-editbutton' )->text() . '</button>';
		$editPage->editFormPageTop .= '<div class="tdg-editscreen-modal-form" id="dialog-form" style="display:none;" title="' . wfMessage( 'templatedatagenerator-modal-title' )->text() . '"> </div>';

		return true;
	}

}
