<?php

/**
 * Filepicker - Handle file uploads and downloads
 * Do not add to this class, try to place all changes in FilepickerConfig class
 *
 * PHP version 5.4
 *
 * @category  PHP
 * @package   Angular.io
 * @author    will Farrell <iam@willfarrell.ca>
 * @copyright 2000-2013 Farrell Labs
 * @license   http://angulario.com
 * @version   0.0.1
 * @link      http://angulario.com
 *
 * @access protected
 */

require_once 'php/lib.global.php'; // echoFile()
require_once 'php/class.config.filepicker.php'; // app related routing and permissions
require_once 'php/class.zip.php'; // zip folder

class Filepicker extends FilepickerConfig {
	
	/**
	 * Constructs a Filepicker object.
	 */
	function __construct() {
		parent::__construct();
		
		ini_set('memory_limit', '-1');
	}
	
	/**
	 * Destructs a Filepicker object.
	 *
	 * @return void
	 */
	function __destruct() {
		parent::__destruct();
	}
	
	/**
	 * Create File size string
	 *
	 * @param string $bytes
	 * @param int $decimals Number of decimal places
	 * @return string
	 */
	private function filesize_format($bytes, $decimals = 2) {
		$sz = 'BKMGTPEZY';
		$factor = floor((strlen($bytes) - 1) / 3);
		$size = $bytes / pow(1024, $factor);
		$str = sprintf("%.{$decimals}f", $size) . " " . @$sz[$factor];
		if ($factor) $str .= "B";
		return $str;
	}
	
	/**
	 * List files
	 *
	 * @param string $path Dir of files
	 * @return array
	 */
	private function listFiles($path) {
		$files = array();
		if (!is_dir($path)) return array();
		$fp = opendir($path);
		while($f = readdir($fp)){
			if( preg_match("#^\.+$#", $f) ) continue; 		// ignore symbolic links
			
			$file_full_path = $path.$f;
			if (is_dir($file_full_path)) {
				
			} else {
				$size = filesize($file_full_path);
				$files[] = array(
					"name" => $f,
					"date" => filemtime($file_full_path),
					"size" => $size,
					"size_str" => $this->filesize_format($size),
					"mime" => mime_content_type($file_full_path)
				);
			}
		}
		return $files;
	}
	
	// to do
	// aws cors credentials
	/**
	 * Return CORS credentials
	 *
	 * @param string $action _
	 * @param string $ID _
	 * @return bool
	 *
	 * @url GET cors/{action}/{ID}
	 * @access protected
	 */
	function get_cors($action = '', $ID=NULL) {
		if (!$action) $action = $this->action_default;
		return FALSE;
	}
	
	/**
	 * to support drag and drop of url *** revisit
	 *
	 * @param string $url URL of file to upload
	 * @return string
	 *
	 * @url GET url/{url}
	 * @access protected
	 */
	function get_url($url=NULL) {
		//echo urldecode($url);
		$ch = curl_init( urldecode($url) );
  
		/*if ( strtolower($_SERVER['REQUEST_METHOD']) == 'post' ) {
		    curl_setopt( $ch, CURLOPT_POST, true );
		    curl_setopt( $ch, CURLOPT_POSTFIELDS, $_POST );
		}*/
		  
		/*if ( $_GET['send_cookies'] ) {
		    $cookie = array();
		    foreach ( $_COOKIE as $key => $value ) {
		      	$cookie[] = $key . '=' . $value;
		    }
		    if ( $_GET['send_session'] ) {
		      	$cookie[] = SID;
		    }
		    $cookie = implode( '; ', $cookie );
		    
		    curl_setopt( $ch, CURLOPT_COOKIE, $cookie );
		}*/
		  
		curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
		curl_setopt( $ch, CURLOPT_HEADER, true );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		  
		curl_setopt( $ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT'] );
		  
		list( $header, $contents ) = preg_split( '/([\r\n][\r\n])\\1/', curl_exec( $ch ), 2 );
		  
		$status = curl_getinfo( $ch );
		 
		curl_close( $ch );
		
		// Split header text into an array.
		$header_text = preg_split( '/[\r\n]+/', $header );
		// Propagate headers to response.
		foreach ( $header_text as $header ) {
	    	if ( preg_match( '/^(?:Content-Type|Content-Language|Set-Cookie):/i', $header ) ) {
		    	header( $header );
		    }
		}
  
		print $contents;
	}
	
	//-- View / Download --//
	/**
	 * List file(s)
	 *
	 * @param string $action _
	 * @param string $ID _
	 * @return array
	 *
	 * @url GET list/{action}/{ID}
	 * @access protected
	 */
	function get_list($action = '', $ID=NULL) {
		if (!$action) $action = $this->action_default;
		$path = $this->makePath($action, $ID);
		
		if (!$this->permissionAllowed('get', $action, $ID)) {
			return array("alerts" => array('class' => 'error', 'label' => 'Error', 'message' => 'Permission Denied.'));
		}
		
		$result = $this->listFiles($path);
		return $result;
	}
	
	// do not call from inside angularjs - call as a href
	/**
	 * Download file(s)
	 *
	 * @param string $action _
	 * @param string $ID _
	 * @param string $file File name
	 * @return void
	 *
	 * @url GET download/{action}/{ID}
	 * @url GET download/{action}/{ID}/{file}
	 * @access protected
	 */
	function get_download($action = '', $ID = NULL, $file=NULL) {//$request_data=NULL) {
		if (!$action) $action = $this->action_default;
		$path = $this->makePath($action, $ID);
		
		if (!$this->permissionAllowed('get', $action, $ID)) {
			return array("alerts" => array('class' => 'error', 'label' => 'Error', 'message' => 'Permission Denied.'));
		}
		
		// if no file specified, zip the folder
		if ($file == NULL) {
			$hash = substr(hash("sha512", $path+$_SERVER['REQUEST_TIME']), 0, 16);
			$tmp = "files/cache/";
			$file = $hash.".zip";
			
			$z = new PHPZip();
			$z -> Zip($path, $tmp.$file);
			$path = $tmp;
			//$checksum = shell_exec('md5sum -b ' . escapeshellarg($tmp.$file));
		}
		
		//header("Content-Type: " . mime_content_type($FileName));
	    // if you are not allowed to use mime_content_type, then hardcode MIME type
	    // use application/octet-stream for any binary file
	    // use application/x-executable-file for executables
	    // use application/x-zip-compressed for zip files
	    header("Content-Type: application/octet-stream");
	    header("Content-Length: " . filesize($path.$file));
	    header("Content-Disposition: attachment; filename=\"$file\"");
	    header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
	    $fp = fopen($path.$file,"rb");
	    fpassthru($fp);
	    fclose($fp);
	}
	
	//-- Upload --//
	/**
	 * Upload from computer
	 *
	 * @param string $action
	 * @param int $ID
	 * @return array
	 *
	 * @url POST computer/{action}/{ID}
	 * @access protected
	 */
	function post_computer($action = '', $ID=NULL) {
		if (!$action) $action = $this->action_default;
		$path = $this->makePath($action, $ID);
		
		if (!$this->permissionAllowed('post', $action, $ID)) {
			return array("alerts" => array('class' => 'error', 'label' => 'Error', 'message' => 'Permission Denied.'));
		}
		
		$uploader = new FileUploader($this->actions[$action]);
		$uploader = $this->uploadModifier($uploader, $action, $ID);
		
		$result = $uploader->handleUpload($path, TRUE);
		return $result;
	}
	
	//-- Services --//
	/**
	 * Download file from url
	 *
	 * @param string $url _
	 * @param string $file _
	 * @param string $user
	 * @param string $pass
	 * @return void
	 */
	private function download($url, $file, $user = NULL, $pass = NULL) {
		// refactor to private function - add server user:pass, ftp, webdev options
		$url = str_replace(" ","%20", $url);
		
		set_time_limit(0);
		$fp = fopen ($file, 'w+');
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_TIMEOUT, 50);
		curl_setopt($ch, CURLOPT_FILE, $fp);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		if ($user && $pass) curl_setopt($ch, CURLOPT_USERPWD, "$user:$pass");
		$data = curl_exec($ch);//get curl response
		curl_close($ch);
		//fwrite($fp, $data);//write curl response to file
		fclose($fp);
	}
	
	/**
	 * Upload from url
	 *
	 * @param string $action
	 * @param int $ID
	 * @param array $request_data POST data
	 * @return array
	 *
	 * @url POST url/{action}/{ID}
	 * @access protected
	 */
	function post_url($action = '', $ID=NULL, $request_data=NULL) {
		if (!$action) $action = $this->action_default;
		$path = $this->makePath($action, $ID);
		
		if (!$this->permissionAllowed('post', $action, $ID)) {
			return array("alerts" => array('class' => 'error', 'label' => 'Error', 'message' => 'Permission Denied.'));
		}
		
		$url = urldecode($request_data['url']);
		$pathinfo = pathinfo($url);
		
		return $this->download($url, $path.$pathinfo['basename'])
			? array('class' => 'success', 'label' => 'Upload Complete')
			: array('class' => 'error', 'label' => 'Error', 'message'=> 'Could not save remote file. The retrieval was cancelled, or server error encountered');
	}
	
	//-- FTP Service --//
	// get list of ftp files
	function get_ftp($url, $user='', $pass='') {
		if (!($conn = ftp_connect($url)))
			return array('class' => 'error', 'label' => 'Error', 'message'=> 'Cannot connect to host');
		if (!ftp_login($conn, $user, $pass))
			return array('class' => 'error', 'label' => 'Error', 'message'=> 'Could not login.');

		if (!ftp_pasv($conn, true))
			return array('class' => 'error', 'label' => 'Error', 'message'=> 'Could not enable passive mode.');

		$files = array();
        $contents = ftp_rawlist($conn, $path);
        $i = 0;

        if (count($contents)) {
            foreach($contents as $line) {

                preg_match("#([drwx\-]+)([\s]+)([0-9]+)([\s]+)([0-9]+)([\s]+)([a-zA-Z0-9\.]+)([\s]+)([0-9]+)([\s]+)([a-zA-Z]+)([\s ]+)([0-9]+)([\s]+)([0-9]+):([0-9]+)([\s]+)([a-zA-Z0-9\.\-\_ ]+)#si", $line, $out);
                //print_r($out);
                if ($out[3] != 1 && ($out[18] == "." || $out[18] == "..")) {
                    // do nothing
                } else {
                    $file = array();
                    $file['rights'] = $out[1];
                    $file['type'] = $out[3] == 1 ? "file":"folder";
                    $file['owner_id'] = $out[5];
                    $file['owner'] = $out[7];
                    //$file['size'] = $this->filesize_format($out[9]);
                    $file['date_modified'] = $out[11]." ".$out[13] . " ".$out[13].":".$out[16]."";
                    $file['name'] = $out[18];
                    
                    $files[$i++] = $file;
                }
            }
        }
        
		ftp_close($conn);
		
		return $files;
	}
	
	// pick ftp file to upload
	/*function post_ftp($action = '', $ID=NULL, $request_data=NULL) {
		if (!$action) $action = $this->action_default;
		$path = $this->makePath($action, $ID);
		
		if (!$this->permissionAllowed('post', $action, $ID)) {
			return array("alerts" => array('class' => 'error', 'label' => 'Error', 'message' => 'Permission Denied.'));
		}
		
		$url = urldecode($request_data['url']);
		$pathinfo = pathinfo($url);
		
		return $this->download($url, $path.$pathinfo['basename'], $request_data['user'], $request_data['pass'])
			? array('class' => 'success', 'label' => 'Upload Complete')
			: array('class' => 'error', 'label' => 'Error', 'message'=> 'Could not save remote file. The retrieval was cancelled, or server error encountered');
	}
	
	// put a file onto ftp server
	function put_ftp() {
		
	}*/
	
	/*
	// to do
	// files paths for type
	function post_get($type = 'URL', $request_data=NULL) {
		$return = array();
		
		//$request_data
		//- param - ftp url, webdav url
		//- user
		//- pass
		//- path
		
		
		switch ($type) {
			case 'profile_user':
				$server = new FTP;
				break;
			default:
				$server = NULL;
				break;
		}
		
		if (!$server) {
			// return error
		}
		
		if ($request_data['user'] && $request_data['pass']) {
			$errors = $server->connect($request_data['user'], $request_data['pass']);
			if (!$errors) {
				// return error
			}
		}
		
		$return = $server->fileList($request_data['path']);
		
		return $return;
	}
	
	// to do
	// upload from URL, FTP, FTP (TLS), SFTP, webDAV
	function post_server($action = '', $request_data=NULL) {
		if (!$action) $action = $this->action_default;
		
		
		//$request_data
		//- user
		//- pass
		//- path
		
		
	}
	
	// to do
	// upload from Dropbox, Evernote, etc
	function post_service($action = '', $request_data=NULL) {
		if (!$action) $action = $this->action_default;
		
		// load 3rd pary class, run like _server
	}*/


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
	
	/**
	 * delete file
	 *
	 * @param string $action
	 * @param int    $ID
	 * @param string $file
	 * @return void
	 *
	 * @url DELETE {action}/{ID}/{file}
	 * @url GET delete/{action}/{ID}/{file}
	 * @access protected
	 */
	function delete($action = '', $ID=NULL, $file=NULL) {
		if (!$action) $action = $this->action_default;
		$path = $this->makePath($action, $ID);
		
		if (!$this->permissionAllowed('delete', $action, $ID)) {
			return array("alerts" => array('class' => 'error', 'label' => 'Error', 'message' => 'Permission Denied.'));
		}
		
		if (!$file) return;
		unlink($path.$file);
	}
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
        if ($_FILES['file']['name'] == 'blob') {
	        return str_replace("/", ".", $this->getType());
        } else {
        	return preg_replace("/([^\w-\.]*)/", "", $_FILES['file']['name']);
        }
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
