<?php

class FilepickerConfig extends Core {
	
	public $action_default = "file";
	public $actions = array(
		'file' => array(
			// list of valid types, ex. array("image/*", "text/*") or array("*/*") for any
			"types" => '*/*',
			// list of valid extensions, ex. array("jpeg", "xml", "bmp") or array() for any
			"extensions" => array(),
			// max file size in bytes (1024 x 1024 = 1048576 = MB)
			"size" => 10485760,
		),
		// avatar/profile image
		'user_single_image' => array(
			"types" => array('image/*'),
			"extensions" => array("jpg", "jpeg", "gif", "bmp", "png"),
			"size" => 2097152,	// 2 MB
			"path" => "img/user",
		),
		'company_single_image' => array(
			"types" => array('image/*'),
			"extensions" => array("jpg", "jpeg", "gif", "bmp", "png"),
			"size" => 2097152,	// 2 MB
			"path" => "img/company",
		),
		// photo gallery example
		'user_multi_images' => array(
			"types" => array('image/*'),
			"extensions" => array("jpg", "jpeg", "gif", "bmp", "png"),
			"size" => 2097152,	// 2 MB
			"path" => "files/user_gallery",
		),
		// general files example
		'user_multi_files' => array(
			"path" => "files/user",
		),
		
	);
	
	function __construct() {
		parent::__construct();
	}

	function __destruct() {
		parent::__destruct();
	}
	
	
	function makePath($action, $ID=NULL) {
		
		$path = getcwd().'/'.$this->actions[$action]['path'].'/';
		
		switch ($action) {
			case 'user_single_image':
				break;
			case 'company_single_image':
				break;
			case 'user_multi_files':
				$path .= $ID.'/';
				break;
			default:
				break;
		}
		
		return $path;
	}
	
	function permissionAllowed($action, $ID=NULL) {
		switch ($action) {
			case 'user_single_image':
				return ($ID == USER_ID);
				break;
			case 'company_single_image':
				return ($ID == COMPANY_ID);
				break;
			case 'user_multi_files':
				return ($ID == USER_ID);
				break;
			default:
				break;
		}
		return true;
	}
	
	function uploadModifier($uploader, $action, $ID) {
		switch ($action) {
			case 'user_single_image':
				$uploader->setName(USER_ID);
				break;
			case 'company_single_image':
				$uploader->setName(COMPANY_ID);
				break;
			default:
				break;
		}
		return $uploader;
	}
}

?>