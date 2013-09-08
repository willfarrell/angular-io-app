<?php

require_once "src/php/class.password.php";

class PasswordTest extends PHPUnit_Framework_TestCase
{
	var $obj;
	
	function __construct() {
		$this->obj = new Password(array(
			"min_timestamp"	=> 0,
			"max_age"		=> 0,
			
			"min_length"	=> 10,
			"max_identical"	=> 3,
			"min_subset"	=> 3,
			"min_upper"		=> 1,
			"min_lower"		=> 1,
			"min_number"	=> 1,
			"min_special"	=> 1,
			"min_other"		=> 1
		));
	}
	
	/**
	 * hashEmail($email)
	 */
	public function testHashEmail()
	{
		$this->assertEquals($this->obj->hashEmail('qwerty@domain.ca'), 'e8eb37067c886c7b2f104c3762bf14ff');
		$this->assertEquals($this->obj->hashEmail('q.werty@domain.ca'), 'e8eb37067c886c7b2f104c3762bf14ff');
		$this->assertEquals($this->obj->hashEmail('q.w.e.r.t.y@domain.ca'), 'e8eb37067c886c7b2f104c3762bf14ff');
	}
	
	/**
	 * update($password, $email)
	 */
	/*public function testUpdate()
	{
		$this->assertTrue($this->obj->update('TRUE'));
		$this->assertFalse($this->obj->update(''));
	}*/
	
	/**
	 * validate($password)
	 */
	/*public function testValidate()
	{
		$this->assertTrue($this->obj->validate('TRUE'));
		$this->assertFalse($this->obj->validate(''));
	}*/
	
	/**
	 * entropy($password)
	 */
	/*public function testEntropy()
	{
		$this->assertTrue($this->obj->entropy('TRUE'));
		//$this->assertFalse($this->obj->entropy('FALSE', "matches"));
	}*/
	
	/**
	 * length($password)
	 */
	public function testLength()
	{
		$this->assertTrue($this->obj->length('12345678901'));
		$this->assertTrue($this->obj->length('1234567890'));
		$this->assertFalse($this->obj->length('123456789'));
	}
	
	/**
	 * charset($password)
	 */
	public function testCharset()
	{
		$this->assertTrue($this->obj->charset('1@qW'));
		$this->assertTrue($this->obj->charset('1@W'));
		$this->assertTrue($this->obj->charset('1@q'));
		$this->assertTrue($this->obj->charset('1qW'));
		$this->assertTrue($this->obj->charset('@qW'));
		$this->assertFalse($this->obj->charset('1@qWaaa'));
		$this->assertFalse($this->obj->charset('1@'));
	}
	
	/**
	 * dictionary($password)
	 */
	/*public function testDictionary()
	{
		$this->assertTrue($this->obj->dictionary('TRUE'));
	}*/
	
	/**
	 * user_past_password($password)
	 */
	/*public function testUserPastPassword()
	{
		$this->assertTrue($this->obj->user_past_password('TRUE', '4'));
		$this->assertFalse($this->obj->user_past_password('FALSE', '4'));
		$this->assertFalse($this->obj->user_past_password('FALSE', 'A'));
	}*/
	
	/**
	 * password_similarity($password, $text)
	 */
	/*public function testPasswordSimilarity()
	{
		$this->assertTrue($this->obj->password_similarity('TRUE', '4'));
		$this->assertFalse($this->obj->password_similarity('FALSE', '4'));
		$this->assertFalse($this->obj->password_similarity('FALSE', 'A'));
	}*/
	
	/**
	 * salt($password, $email = '')
	 */
	public function testSalt()
	{
		$this->assertEquals('password'.$this->obj->hashEmail('qwerty@domain.com').PASSWORD_SALT, $this->obj->salt('password', 'qwerty@domain.com'));
	}
	
	/**
	 * hash($password, $email = '')
	 */
	/*public function testHash()
	{
		$this->assertTrue($this->obj->hash('password', 'qwerty@domain.com'));
		$this->assertFalse($this->obj->hash('password', 'qwerty@domain.com'));
	}*/
	
	/**
	 * check($password, $hash, $email = '')
	 */
	/*public function testCheck()
	{
		$this->assertTrue($this->obj->check('TRUE1'));
		$this->assertFalse($this->obj->check('FALSE!'));
	}*/

}

?>