<?php

// php src/php/vendor/phpunit/phpunit/phpunit.php test/phpunit/validateTest.php

//require "src/php/vendor/phpunit/phpunit/phpunit.php";
require_once "src/php/class.filter.php";

class ValidateTest extends PHPUnit_Framework_TestCase
{
	var $obj;
	
	function __construct() {
		$this->obj = new Filter(array(
			"matches" => "TRUE"
		));
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
	 * required($str)
	 */
	public function testRequired()
	{
		$this->assertTrue($this->obj->required('TRUE'));
		$this->assertFalse($this->obj->required(''));
	}
	
	/**
	 * matches($str, $field)
	 */
	public function testMatches()
	{
		$this->assertTrue($this->obj->matches('TRUE', "matches"));
		$this->assertFalse($this->obj->matches('FALSE', "matches"));
	}
	
	/**
	 * regex_match($str, $regex)
	 */
	public function testRegexMatch()
	{
		$this->assertTrue($this->obj->regex_match('TRUE', '/TRUE/'));
		$this->assertFalse($this->obj->regex_match('FALSE', '/TRUE/'));
	}
	
	/**
	 * is_unique($str, $table_field)
	 */
	public function testIsUnique()
	{
		$this->assertTrue($this->obj->is_unique('phpunit', 'users.user_username'));
		//$this->assertFalse($this->obj->is_unique('phpunit'));
	}
	
	/**
	 * min_length($str, $val)
	 */
	public function testMinLength()
	{
		$this->assertTrue($this->obj->min_length('TRUE', '4'));
		$this->assertFalse($this->obj->min_length('FALSE', '6'));
		$this->assertFalse($this->obj->min_length('FALSE', 'A'));
	}
	
	/**
	 * max_length($str, $val
	 */
	public function testMaxLength()
	{
		$this->assertTrue($this->obj->max_length('TRUE', '4'));
		$this->assertFalse($this->obj->max_length('FALSE', '4'));
		$this->assertFalse($this->obj->max_length('FALSE', 'A'));
	}
	
	/**
	 * exact_length($str, $val)
	 */
	public function testExactLength()
	{
		$this->assertTrue($this->obj->exact_length('TRUE', '4'));
		$this->assertFalse($this->obj->exact_length('FALSE', '4'));
		$this->assertFalse($this->obj->exact_length('FALSE', 'A'));
	}
	
	/**
	 * boolean($str)
	 */
	public function testBoolean()
	{
		$this->assertTrue($this->obj->boolean('TRUE'));
		$this->assertTrue($this->obj->boolean('1'));
		$this->assertFalse($this->obj->boolean('0!'));
		$this->assertFalse($this->obj->boolean('FALSE!'));
	}
	
	/**
	 * alpha($str)
	 */
	public function testAlpha()
	{
		$this->assertTrue($this->obj->alpha('TRUE'));
		$this->assertFalse($this->obj->alpha('FALSE1'));
	}
	
	/**
	 * alpha_numeric($str)
	 */
	public function testAlphaNumeric()
	{
		$this->assertTrue($this->obj->alpha_numeric('TRUE1'));
		$this->assertFalse($this->obj->alpha_numeric('FALSE!'));
	}
	
	/**
	 * alpha_dash($str)
	 */
	public function testAlphaDash()
	{
		$this->assertTrue($this->obj->alpha_dash('TRUE1-'));
		$this->assertFalse($this->obj->alpha_dash('FALSE!'));
	}
	/**
	 * numeric($str)
	 */
	public function testNumeric()
	{
		$this->assertTrue($this->obj->numeric('0'));
		$this->assertTrue($this->obj->numeric('0.1'));
		$this->assertFalse($this->obj->numeric('FALSE'));
	}
	/**
	 * is_numeric($str)
	 */
	/*public function testIsNumeric()
	{
		$this->assertTrue($this->obj->numeric('0'));
		$this->assertFalse($this->obj->numeric(FALSE));
		$this->assertFalse($this->obj->numeric(array()));
	}*/
	
	/**
	 * integer($str)
	 */
	public function testInteger()
	{
		$this->assertTrue($this->obj->integer('1'));
		$this->assertFalse($this->obj->integer('FALSE'));
		$this->assertFalse($this->obj->integer('1.0'));
	}
	/**
	 * decimal($str, $total = 0, $decimal = 0)
	 */
	/*public function testRequired()
	{
		$this->assertTrue($this->obj->required('TRUE'));
		$this->assertFalse($this->obj->required(''));
	}*/
	
	/**
	 * greater_than($str, $min)
	 */
	public function testGreaterThan()
	{
		$this->assertTrue($this->obj->greater_than('5', '4'));
		$this->assertFalse($this->obj->greater_than('5', '5'));
		$this->assertFalse($this->obj->greater_than('FALSE', '0'));
		$this->assertFalse($this->obj->greater_than('5', '6'));
	}
	
	/**
	 * greater_than_or_equal($str, $min)
	 */
	public function testGreaterThanOrEqual()
	{
		$this->assertTrue($this->obj->greater_than_or_equal('5', '4'));
		$this->assertTrue($this->obj->greater_than_or_equal('5', '5'));
		$this->assertFalse($this->obj->greater_than_or_equal('FALSE', '0'));
		$this->assertFalse($this->obj->greater_than_or_equal('5', '6'));
	}
	
	/**
	 * less_than($str, $max)
	 */
	public function testLessThan()
	{
		$this->assertTrue($this->obj->less_than('5', '6'));
		$this->assertFalse($this->obj->less_than('5', '5'));
		$this->assertFalse($this->obj->less_than('FALSE', '0'));
		$this->assertFalse($this->obj->less_than('5', '4'));
	}
	
	/**
	 * less_than_or_equal($str, $max)
	 */
	public function testLessThanOrEqual()
	{
		$this->assertTrue($this->obj->less_than_or_equal('5', '6'));
		$this->assertTrue($this->obj->less_than_or_equal('5', '5'));
		$this->assertFalse($this->obj->less_than_or_equal('FALSE', '0'));
		$this->assertFalse($this->obj->less_than_or_equal('5', '4'));
	}
	
	/**
	 * is_natural($str)
	 */
	public function testIsNatural()
	{
		$this->assertTrue($this->obj->is_natural('0'));
		$this->assertTrue($this->obj->is_natural('1'));
		$this->assertFalse($this->obj->is_natural('-1'));
	}
	
	/**
	 * is_natural_no_zero($str)
	 */
	public function testIsNaturalNoZero()
	{
		$this->assertTrue($this->obj->is_natural_no_zero('1'));
		$this->assertFalse($this->obj->is_natural_no_zero('0'));
	}
	
	/**
	 * valid_email($str)
	 */
	public function testValidEmail()
	{
		$this->assertTrue($this->obj->valid_email('qwerty@hotmail.com'));
		$this->assertFalse($this->obj->valid_email('FAIL'));
	}
	
	/**
	 * valid_emails($str)
	 */
	public function testValidEmails()
	{
		$this->assertTrue($this->obj->valid_emails('qwerty@hotmail.com,qwerty2@hotmail.com'));
		$this->assertFalse($this->obj->valid_emails('FAIL'));
	}
	
	/**
	 * valid_email_dns($str)
	 */
	public function testValidEmailDns()
	{
		$this->assertTrue($this->obj->valid_email_dns('qwerty@hotmail.com'));
		$this->assertFalse($this->obj->valid_email_dns('FAIL'));
	}
	
	/**
	 * valid_url($str)
	 */
	public function testValidUrl()
	{
		$this->assertTrue($this->obj->valid_url('http://google.com/index.html'));
		$this->assertFalse($this->obj->valid_url('FAIL'));
	}
	
	/**
	 * valid_ip($ip, $which = '')
	 */
	public function testValidIp()
	{
		$this->assertTrue($this->obj->valid_ip('192.168.0.0', 'ipv4'));
		$this->assertFalse($this->obj->valid_ip('FAIL'));
		$this->assertFalse($this->obj->valid_ip('256.256.256.256', 'ipv4'));
	}
	
	/**
	 * valid_base64($str)
	 */
	/*public function testValidUrl()
	{
		$this->assertTrue($this->obj->valid_url('http://google.com/index.html?hello'));
		$this->assertFalse($this->obj->valid_url('FAIL'));
	}*/
	
	/**
	 * password($str)
	 * REQUIRES SESSION
	 */
	/*public function testPassword()
	{
		$this->assertTrue($this->obj->password('1@Qwerty()'));
		$this->assertFalse($this->obj->password('FAIL'));
	}*/
	
	/**
	 * valid_mail_code($str, $country_code)
	 */
	/*public function testValidUrl()
	{
		$this->assertTrue($this->obj->valid_url('http://google.com/index.html?hello'));
		$this->assertFalse($this->obj->valid_url('FAIL'));
	}*/
	
	/**
	 * valid_phone($str, $type)
	 */
	/*public function testValidUrl()
	{
		$this->assertTrue($this->obj->valid_url('http://google.com/index.html?hello'));
		$this->assertFalse($this->obj->valid_url('FAIL'));
	}*/
}

class SanatizeTest extends PHPUnit_Framework_TestCase
{
	var $obj;
	
	function __construct() {
		$this->obj = new Filter;
	}
	
	/**
	 * trim($str)
	 */
	/*public function testTrim()
	{
		$this->assertEquals('a', $this->obj->trim(' a '));
	}*/
	
	/**
	 * cast_boolean($str)
	 */
	public function testCastBoolean()
	{
		$this->assertEquals(TRUE, $this->obj->cast_boolean('true'));
		$this->assertEquals(FALSE, $this->obj->cast_boolean('false'));
		$this->assertEquals(TRUE, $this->obj->cast_boolean('1'));
		$this->assertEquals(FALSE, $this->obj->cast_boolean('0'));
		$this->assertEquals(TRUE, $this->obj->cast_boolean('YES'));
		$this->assertEquals(FALSE, $this->obj->cast_boolean('No'));
		$this->assertEquals(TRUE, $this->obj->cast_boolean('on'));
		$this->assertEquals(FALSE, $this->obj->cast_boolean('off'));
	}
	
	/**
	 * prep_url($str = '')
	 */
	public function testPrepUrl()
	{
		$this->assertEquals('http://google.com', $this->obj->prep_url('google.com'));
		$this->assertEquals('', $this->obj->prep_url(''));
		$this->assertEquals('', $this->obj->prep_url('http://'));
	}
	
	/**
	 * strip_tags($str, $tags = '')
	 */
	public function testStripTags()
	{
		$this->assertEquals('<a>a</a>', $this->obj->strip_tags('<a>a</a>', '<a>'));
		$this->assertEquals('a', $this->obj->strip_tags('<a>a</a>', '<b>'));
	}
	
	/**
	 * encode_php_tags($str)
	 */
	public function testEncodePhpTags()
	{
		$this->assertEquals('&lt;?php ?&gt;', $this->obj->encode_php_tags('<?php ?>'));
	}
	
	/**
	 * sanitize_string($str)
	 */
	/*public function testSanitizeString()
	{
		$this->assertEquals('', $this->obj->sanitize_string('<?php ?>'));
	}*/
}

?>