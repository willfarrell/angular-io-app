<?php

require_once 'php/lib.global.php';
require_once 'php/class.db.php';
require_once 'php/api.img.php';


class Filepicker {
	private $profile = array(
		'ext' => 'png',
		'width' => '200',
		'height' => '200',
	);
	private $img_allowed = array(
		// list of valid types, ex. array("image/*", "text/*") or array("*/*") for any
		"types" => array('image/*'),
		// list of valid extensions, ex. array("jpeg", "xml", "bmp") or array() for any
		"extensions" => array("jpg", "jpeg", "gif", "bmp", "png"),
		// max file size in bytes (1024 x 1024 = 1048576 = MB)
		"size" => 2097152,	// 2 MB
	);

	private $file_allowed = array(
		"types" => '*/*',
		"extensions" => array(),
		"size" => 10485760,
	);

	function __construct() {
		global $filter;
		$this->filter = $filter;
		$this->timer = new Timers;
	}

	function __destruct() {

	}

	// aws cors credentials
	function get_aws_cors() {

	}

	function get_fetch() {

	}

	// upload from computer
	function post_upload($action = '', $request_data=NULL) {
		ini_set('memory_limit', '-1');

		switch ($action) {
			case 'profile_user':	// 200 x 100
				$uploader = new FileUploader($this->img_allowed);
				$upload_name = md5(USER_ID.$uploader->getFileName().$_SERVER['REQUEST_TIME']);
				$uploader->setName($upload_name);

				$file_dir = getcwd().'/img/user/';
				$file_ext = $uploader->getFileExt();

				$result = $uploader->handleUpload($file_dir, TRUE);

				$from = $file_dir.$upload_name.'.'.$file_ext;
				$to   = $file_dir.USER_ID.'.'.$this->profile['ext'];

				$img = new Img;
				$image = $img->loadImage($from);
				$image = $img->convert($image, $from, $to, TRUE, TRUE);
				//$image = $img->resize($image, $this->profile['width'], $this->profile['height']);
				$img->saveImage($image, $to);

				break;
			case 'profile_company':	// 200 x 100
				$uploader = new FileUploader($this->img_allowed);
				$upload_name = md5(USER_ID.$uploader->getFileName().$_SERVER['REQUEST_TIME']);
				$uploader->setName($upload_name);

				$file_dir = getcwd().'/img/company/';
				$file_name = COMPANY_ID;
				$file_ext = $uploader->getFileExt();

				$result = $uploader->handleUpload($file_dir, TRUE);

				$from = $file_dir.$upload_name.'.'.$file_ext;
				$to   = $file_dir.$file_name.'.'.$this->profile['ext'];

				$img = new Img;
				$image = $img->loadImage($from);
				$image = $img->convert($image, $from, $to, TRUE, TRUE);
				//$image = $img->resize($image, $this->profile['width'], $this->profile['height']);
				$img->saveImage($image, $to);

				break;
			/*case 'file_user':
				$uploader = new FileUploader($this->file_allowed);
				$file_hash = sha1($uploader->getFileName());
				$file = array(
					"file_hash" => $file_hash,
					"tender_ID" => $_GET['id'],
					"user_ID" 	=> $session->cookie['user_ID'],
					"file_name" => $uploader->getFileName(),
					"file_ext" 	=> $uploader->getFileExt(),
					"file_timestamp" => $_SERVER['REQUEST_TIME']
				);
				//$uploader->setName($file_hash);
				$result = $uploader->handleUpload(getcwd().'/files/tender/'.$_GET['id'].'/', TRUE);

				// save to DB
				$result['file_ID'] = $database->insert('tender_files', $file);

				break;*/
			default:
				$uploader = new FileUploader($this->file_allowed);
				$result = $uploader->handleUpload(getcwd().'/files/', TRUE);
				break;
		}

		return $result;
	}

	// upload from FTP, FTP (TLS), SFTP, webDAV
	function post_server($request_data=NULL) {

	}

	// upload from Dropbox, Evernote, etc
	function post_service($request_data=NULL) {

	}


	/*private function ftp() {
		// get files from FTP
			$conn_id = ftp_connect('ftp.godaddy.com') or die ("Cannot connect to host"); // auctions@
			ftp_login($conn_id,'auctions', '') or die('could not login.');

			ftp_pasv($conn_id, true) or die('could not enable passive mode.');

			try {
				ftp_get($conn_id, $this->cache_dir.$file, $file, FTP_BINARY);
				//echo "$file downloaded from ftp\n";
			} catch (Exception $e) {
				echo "$file failed to download from ftp\n";
				return;	// no more pages
			}
			ftp_close($conn_id);
	}*/
}
//$temp = sys_get_temp_dir();
//var_dump($temp);


// server side of fineuploader.com
/**
 * Handle file uploads via XMLHttpRequest
 */
class UploadedFileXhr {
    /**
     * Save the file to the specified path
     * @return boolean TRUE on success
     */
    function save($path) {
        $input = fopen("php://input", "r");
        $temp = tmpfile();
        if ($temp == FALSE) throw new Exception('Unable to write to tmp folder '.sys_get_temp_dir());
        $realSize = stream_copy_to_stream($input, $temp);
        fclose($input);

        if ($realSize != $this->getSize()){
            return false;
        }

        $target = fopen($path, "w");
        fseek($temp, 0, SEEK_SET);
        stream_copy_to_stream($temp, $target);
        fclose($target);

        return true;
    }

    function getName() {
        return preg_replace("/([^\w\.]*)/", "", $_GET['file']);
    }

    function getSize() {
        if (isset($_SERVER["CONTENT_LENGTH"])){
            return (int)$_SERVER["CONTENT_LENGTH"];
        } else {
            throw new Exception('Getting content length is not supported.');
        }
    }

    function getType() {
        return '*/*';//$_GET['file'];
    }
}

/**
 * Handle file uploads via regular form post (uses the $_FILES array)
 */
class UploadedFileForm {
    /**
     * Save the file to the specified path
     * @return boolean TRUE on success
     */
    function save($path) {
        if(!move_uploaded_file($_FILES['file']['tmp_name'], $path)){
            return false;
        }
        return true;
    }

    function getName() {
        return preg_replace("/([^\w-\.]*)/", "", $_FILES['file']['name']);
    }

    function getSize() {
        return $_FILES['file']['size'];
    }

    function getType() {
        return preg_replace("/([^\w-\/]*)/", "", $_FILES['file']['type']);
    }
}

class FileUploader {
	// allowed
    private $types = array("*/*");
    private $extensions = array();
    private $size = 1048576;

    private $file;
    private $file_name = "";

    function __construct(array $allowed = array("types" => array("*/*"),"extensions" => array(),"size" => 1048576)){
        //$extensions = array_map("strtolower", $allowedExtensions);
        $this->types = $allowed['types'];
        $this->extensions = $allowed['extensions'];
        $this->size = $allowed['size'];
        //$this->allowedExtensions = $allowedExtensions;
        //$this->sizeLimit = $sizeLimit;

        $this->checkServerSettings();

        if (isset($_GET['file'])) {
            $this->file = new UploadedFileXhr();
        } else if (isset($_FILES['file'])) {
            $this->file = new UploadedFileForm();
        } else {
            $this->file = false;
        }
    }

    public function getFileName() {
	    return $this->file->getName();
    }

    public function getFileExt() {
    	$pathinfo = pathinfo($this->file->getName());
        return $pathinfo['extension'];
    }

    private function checkServerSettings(){
        $postSize = $this->toBytes(ini_get('post_max_size'));
        $uploadSize = $this->toBytes(ini_get('upload_max_filesize'));

        if ($postSize < $this->size || $uploadSize < $this->size){
            $size = max(1, $this->size / 1024 / 1024) . 'M';
            die("{'error':'increase post_max_size and upload_max_filesize to $size'}");
        }
    }

    private function toBytes($str){
        $val = trim($str);
        $last = strtolower($str[strlen($str)-1]);
        switch($last) {
            case 'g': $val *= 1024;
            case 'm': $val *= 1024;
            case 'k': $val *= 1024;
        }
        return $val;
    }

    function setName($name) {
	    $this->file_name = $name;
    }

    /**
     * Returns array('success'=>true) or array('error'=>'error message')
     */
    function handleUpload($uploadDirectory, $replaceOldFile = FALSE){
        if (!is_writable($uploadDirectory)){
        	mkdir_recursive($uploadDirectory);
            //return array('error' => "Server error. Upload directory isn't writable.");
        }

        if (!$this->file){
            return array('class' => 'error', 'label' => 'Error', 'message' => 'No files were uploaded.');
        }

        $size = $this->file->getSize();

        if ($size == 0) {
            return array('class' => 'error', 'label' => 'Error', 'message' => 'File is empty');
        }

        if ($size > $this->size) {
            return array('class' => 'error', 'label' => 'Error', 'message' => 'File is too large');
        }

        // types
        $type = $this->file->getType();
        if (
        	!in_array('*/*', $this->types)
        	&& !in_array(substr($type, 0, strpos($type, '/')).'/*', $this->types)
        	&& !in_array($type, $this->types)
        	) {
	        $these = implode(', ', $this->types);
            return array('class' => 'error', 'label' => 'Error', 'message' => 'File has an invalid type, it should be one of '. $these . '.');
        }

        $pathinfo = pathinfo($this->file->getName());
        $filename = ($this->file_name) ? $this->file_name : $pathinfo['filename'];
        //$filename = md5(uniqid());
        $ext = strtolower($pathinfo['extension']);
        if ($this->extensions && !in_array($ext, $this->extensions)){
            $these = implode(', ', $this->extensions);
            return array('class' => 'error', 'label' => 'Error', 'message' => 'File has an invalid extension, it should be one of '. $these . '.');
        }

        if (!$replaceOldFile){
            /// don't overwrite previous files that were uploaded
            while (file_exists($uploadDirectory . $filename . '.' . $ext)) {
                $filename .= rand(10, 99);
            }
        }

        mkdir_recursive($uploadDirectory);

        if (!$this->file->save($uploadDirectory . $filename . '.' . $ext)) {
            return array('class' => 'error', 'label' => 'Error', 'message'=> 'Could not save uploaded file. The upload was cancelled, or server error encountered');
        } else {
            return array('class' => 'success', 'label' => 'Upload Complete');
        }

    }
}



?>
