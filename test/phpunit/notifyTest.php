<?php

// php src/php/vendor/phpunit/phpunit/phpunit.php test/phpunit/validateTest.php

//require "src/php/vendor/phpunit/phpunit/phpunit.php";
require_once "src/php/class.notify.php";

class NotifyTest extends PHPUnit_Framework_TestCase
{
	var $obj;
	private $_message_ID = "phpunit_test";
	
	function __construct() {
		$this->obj = new Notify;
	}
	
	/**
	 * field($str, $field)
	 */
	/*public function testField()
	{
		$this->assertTrue($this->obj->required('TRUE'));
		$this->assertFalse($this->obj->required(''));
	}*/
	
	/**
	 * send($user_ID, $message_ID, $args = array(), $types = "email")
	 */
	/*public function testSend()
	{
		$this->assertTrue($this->obj->required('TRUE'));
		$this->assertFalse($this->obj->required(''));
	}*/
	
	/**
	 * compile($message_ID, $args = array())
	 */
	public function testCompile()
	{
		$this->assertEquals(array('azcz', "PHPUnit Test"), $this->obj->compile($this->_message_ID, array("b" => "z")));
	}
	
	/**
	 * replace_tags($str, $group = '', $tags = array())
	 */
	public function testReplaceTags()
	{
		$this->assertEquals('143',$this->obj->replace_tags('1{{2}}3', '', array("2"=>"4")));
		$this->assertEquals('143',$this->obj->replace_tags('1{{args:2}}3', 'args', array("2"=>"4")));
		$this->assertEquals('143$var',$this->obj->replace_tags('1{{args:2}}3$var', 'args', array("2"=>"4")));
	}
	
	/**
	 * email($email, $subject, $message)
	 */
	public function testEmail()
	{
		$this->assertTrue($this->obj->email('phpunit@angulario.com', 'PHPTest', "Message"));
		//$this->assertFalse($this->obj->is_unique('phpunit'));
	}
	
	
	
	
	
	
	
}

?>