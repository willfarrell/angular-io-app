<?php

require_once "class.validate.php";

use Luracast\Restler\Data\iValidate;

class Validator implements iValidate {
	
	public static function validate($input, ValidationInfo $info)
	{
		
        
        var_dump($input);
		var_dump($info);
		
		if (is_null($input)) {
            if($info->required){
                throw new RestException (400,
                    "$info->name is missing.");
            }
            return null;
        }
        
		/*$validate = new Validate($args);
		
		// Sanitize Inputs
		$args = $validate->sanatize($args, $className, $methodName);
		
		// Validate Inputs
		$arr = array();
		if(!$validate->check($args, $className, $methodName)) {
			$arr = $validate->getErrors();
		}
		var_dump($args);
		var_dump($arr);*/
		return TRUE;
	}
	
}

?>