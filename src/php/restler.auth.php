<?php
require_once "class.permission.php";

use Luracast\Restler\iAuthenticate;

class Auth implements iAuthenticate {
	
	function __isAllowed() {
		
		// Get metadata
		$trace = debug_backtrace();
		if (!isset($trace[1])) return FALSE;
		$restler = $trace[0]['object']->restler;
		
		list($className, $methodName) = $this->getNames($restler);
		$args = $this->getArgs($restler);
		
			
		// Check Permissions
		$permission = new Permission($args);
		if (!$permission->check($args, $className, $methodName)) {
			if ($permission->getSignout()) { throw new RestException(400, 'Session Expired'); }
			return FALSE;
		}
		return TRUE;
	}
	
	private function getNames($restler) {
		$obj = $restler->apiMethodInfo;
		return array($obj->className, $obj->methodName);
	}
	
	private function getArgs($restler) {
		$obj = $restler->apiMethodInfo;
		$args = array();
		
		if (!isset($obj->arguments)) return $args;
		
		foreach($obj->arguments as $key => $value) {
			$args[$obj->metadata['param'][$key]['name']] = $value;
		}
		return $args;
	}
	
}

?>