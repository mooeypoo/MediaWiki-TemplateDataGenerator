<?php
/**
 * TemplateDataGenerator extension.
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

# Credits:
$wgExtensionCredits['parserhook'][] = array(
	'path'           => __FILE__,
	'name'           => 'TemplateDataGenerator',
	'version'        => '0.1',
	'author'         => array( 'Moriel Schottlender' ),
	'url'            => '',
	'descriptionmsg' => 'templatedatagenerator-desc',
);

# Internationalization:
$wgExtensionMessagesFiles['TemplateDataGenerator'] = dirname( __FILE__ ) . "/TemplateDataGenerator.i18n.php";

# Load classes:
$wgAutoloadClasses['TemplateDataGeneratorHooks'] = dirname( __FILE__ ) . "/TemplateDataGenerator.hooks.php";

# Hook button up to Editing
$wgHooks['EditPage::showEditForm:initial'][] = array( 'TemplateDataGeneratorHooks::initGeneratorInEditForm' );


# Resources
$templdatagenResourceTemplate = array(
	'localBasePath' => dirname(__FILE__),
	'remoteExtPath' => 'TemplateDataGenerator'
);

# Modules:
$wgResourceModules['ext.templateDataGenerator'] = $templdatagenResourceTemplate + array(
	'styles' => 'ext.core/TemplateDataGenerator.css',
	'scripts' => 'ext.core/TemplateDataGenerator.js',
	'position' => 'top',
	'dependencies' => array(
		'jquery.ui.dialog'
	),
	'messages' => array(
		'templatedatagenerator-modal-title',
		'templatedatagenerator-modal-table-param-name',
		'templatedatagenerator-modal-table-param-desc',
		'templatedatagenerator-modal-table-param-type',
		'templatedatagenerator-modal-table-param-default',
		'templatedatagenerator-modal-table-param-required',
		'templatedatagenerator-modal-table-param-actions',
		'templatedatagenerator-modal-buttons-apply',
		'templatedatagenerator-modal-buttons-cancel',
	)
);

