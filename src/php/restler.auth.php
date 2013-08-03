<?php
require_once "class.permission.php";

use Luracast\Restler\iAuthenticate;
class Auth implements iAuthenticate {
	
	function __isAllowed() {
		// Permission Check Params
		$trace = debug_backtrace();
		if (!isset($trace[1])) return FALSE;
		$params = $trace[0]['object']->restler->apiMethodInfo;
		$args = (
				isset($params->arguments) &&
				isset($params->parameters) &&
				count($params->arguments) &&
				count($params->parameters)
			)
			? array_combine(array_keys($params->arguments), $params->parameters)
			: array();
		
		$permission = new Permission;
		
		if (!$permission->check($args, $params->className, $params->methodName)) {
			if ($permission->getSignout()) { throw new RestException(400, 'Session Expired'); }
			return FALSE;
		}
		return TRUE;
	}
	
}

?>