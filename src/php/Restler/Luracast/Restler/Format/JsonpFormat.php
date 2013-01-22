<?php
namespace Luracast\Restler\Format;

use Luracast\Restler\Data\Util;
use Luracast\Restler\RestException;

//jsonpformat.php
class JsonpFormat implements iFormat {

    const MIME = 'text/javascript';
    const EXTENSION = 'js';
    /*
     * JsonFormat is used internally
	 * Jsonp defaults to json if callback not set
     * @var JsonFormat;
     */
    public $jsonFormat;
    public static $functionName = 'callback';

    public function __construct() {
        $this->jsonFormat = new JsonFormat ();
        if (isset ( $_GET ['callback'] )) {
            self::$functionName = $_GET ['callback'] ? $_GET ['callback'] : self::$functionName;
        } else {
			self::$functionName = NULL;
		}
    }
    public function getMIMEMap() {
		if (self::$functionName)
        	return array (self::EXTENSION => self::MIME );
		else
			return array ($this->jsonFormat->getExtension() => $this->jsonFormat->getMIME() );
    }
    public function getMIME() {
        return self::MIME;
    }
    public function getExtension() {
        return self::EXTENSION;
    }
    public function encode($data, $human_readable = FALSE) {
		if (self::$functionName)
        	return self::$functionName . '(' . $this->jsonFormat->encode ( $data, $human_readable ) . ');';
		else
			return $this->jsonFormat->encode ( $data, $human_readable );
    }
    public function decode($data) {
        return $this->jsonFormat->decode ( $data );
    }
    public function setMIME($mime) {
        //do nothing
    }
    public function setExtension($extension) {
        //do nothing
    }
    public function getCharset() {
        //do nothing
    }
    public function setCharset($charset) {
        //do nothing
    }
} 
?>