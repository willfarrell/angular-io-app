<?php

/**
 * Filter - Validate & sanitize inputs
 *
 * PHP Version 5.4
 *
 * @category  N/A
 * @package   N/A
 * @author	will Farrell <will.farrell@gmail.com>
 * @copyright 2000 - 2013 willFarrell.ca
 * @license   http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version   GIT: <git_id>
 * @link	  http://willFarrell.ca
 */

/**
TODO
- add password hook
- is_json?

Use Case:

$request_data = $this->filter->run($request_data);
if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }

*/

/*

# Validation Rules
Rules are `|` seperated. A `!` can be place infrom of a rule to inverse it. ie !required

Rule				  Param	Details
field[table.field]		Yes	Returns FALSE if all table field generated rules return FALSE.

required				No	Returns FALSE if the input is empty.

matches[string]			Yes	Returns FALSE if the input does not match the one in the parameter.
regex_match[/regex/]	Yes	Returns FALSE if the input does not match the regex in the parameter.

is_unique[table.field]	Yes	Returns FALSE if the input is not unique to the table and field name in the parameter.
	
min_length[#]			Yes	Returns FALSE if the input is shorter then the parameter value.
max_length[#]			Yes	Returns FALSE if the input is longer then the parameter value.
exact_length[#]			Yes	Returns FALSE if the input is not exactly the parameter value.

boolean					No	Returns FALSE if the input contains anything other than a boolean.
alpha					No	Returns FALSE if the input contains anything other than alphabetical characters.	
alpha_numeric			No	Returns FALSE if the input contains anything other than alpha-numeric characters. 
alpha_dash				No	Returns FALSE if the input contains anything other than alpha-numeric characters, underscores or dashes.
numeric					No	Returns FALSE if the input contains anything other than numeric characters.
integer					No	Returns FALSE if the input contains anything other than an integer.
//decimal[]				Yes	Returns FALSE if the input is not exactly the parameter value.
//json					No

greater_than[#.#]		Yes	Returns FALSE if the input is less than the parameter value or not numeric.
greater_than_or_equal[#.#]Yes	Returns FALSE if the input is less than the parameter value or not numeric.
less_than[#]			Yes	Returns FALSE if the input is lesser than the parameter value or not numeric.
less_than_or_equal[#]	Yes	Returns FALSE if the input is greater than the parameter value or not numeric.

is_natural				No	Returns FALSE if the input contains anything other than a natural number: 0, 1, 2, 3, etc.
is_natural_no_zero		No	Returns FALSE if the input contains anything other than a natural number, but not zero: 1, 2, 3, etc. 

email					No	Returns valid_email|valid_email_dns
valid_email				No	Returns FALSE if the input does not contain a valid email address.
valid_emails			No	Returns FALSE if any value provided in a comma separated list is not a valid email.
valid_email_dns			No	Returns FALSE if the input does not contain a valid email address or has no MX record.

valid_url 				No	Returns FALSE if the input does not contain a valid URL.
valid_ip[ipv4]			No	Returns FALSE if the supplied IP is not valid. Accepts an optional parameter of "IPv4" or "IPv6" to specify an IP format.
//valid_base64			No	Returns FALSE if the supplied string contains anything other than valid Base64 characters.

//valid_mail_code[CA]Yes	Returns FALSE if the input does not contain a valid mail code for a given country.
//valid_phone[+] 		Yes	Returns FALSE if the input does not contain a valid phone/fax number. + = international
password				No	Returns FALSE if the input does not meet min password strength set by json/config.password.json.

# Sanitize Filters
Filter				  Param	Details
trim					No	Removes whitespace from start&end of string
cast_boolean			No	Converts popular boolean strings into boolean (true/false,1/0,yes/no,on/off)
prep_url				No	Adds "http://" to URLs if missing.
strip_tags[<a><b><i>]	Yes	Strips HTML tags from string, param holds whitelist
//xss_clean				No	
encode_php_tags			No	Converts PHP tags to entities.
sanitize_string			No	Runs filter_var($str, FILTER_SANITIZE_STRING)
//cast_int				No	Converts input to int

*/

require_once 'class.db.php';
require_once 'class.password.php';

include_once 'inc.filter.rules.php';
include_once 'inc.filter.tables.php';

class Filter
{
	private $_rules = array();
	private $_tables = array();
	
	private $_inputs = array();
	private $_errors = array();
	private $_debug = FALSE;
	
	private $_metadata; // tmp $metadata holder
	
	private $_default_messages = array(
		'required' 				=> 'is empty',
		'matches' 				=> 'does not match',
		'is_unique' 			=> 'is already taken',
		'min_length' 			=> 'is too short',
		'max_length' 			=> 'is too long',
		'exact_length' 			=> 'is not the right length',
		'greater_than' 			=> 'is too small',
		'greater_than_or_equal' => 'is too small',
		'less_than' 			=> 'is too large',
		'less_than_or_equal' 	=> 'is too large',
		'alpha' 				=> 'contains non alphabetical characters',
		'alpha_numeric' 		=> 'contains non alpha-numeric characters',
		'alpha_dash' 			=> 'contains non alpha-numeric characters, underscores or dashes',
		'numeric' 				=> 'contains non numeric characters',
		'boolean' 				=> 'is not a boolean',
		'integer' 				=> 'is not an integer',
		'decimal' 				=> 'is not a decimal number',
		'is_natural' 			=> 'is not zero or a positive integer',				// array values
		'is_natural_no_zero' 	=> 'is not a positive integer',						// DB ID values
		'valid_email' 			=> 'is not a valid email',
		'valid_emails' 			=> 'are not valid emails',
		'valid_ip' 				=> 'is not a valid IP',
		'valid_base64' 			=> 'is not in Base64',
		
		'valid_email'			=> 'is not a valid email address',
		'valid_email_dns'		=> 'is not a valid email domain',
		'valid_url' 			=> 'is not a valid url',
		'valid_mail_code' 		=> 'is not a valid mail code',
		'valid_phone' 			=> 'is not a valid phone number',
	);
	
	/**
	 * Constructor
	 */
	function __construct($args = array()) {
		global $database, $filter_rules, $filter_tables;
		$this->db = $database;
		
		$this->_inputs = $args;
		$this->password = new Password;
		
		if (!$filter_rules) $this->_rules = array();
		else $this->_rules = $filter_rules;
		
		if (!$filter_tables) $this->build_table_array();
		else $this->_tables = $filter_tables;
	}

	/**
	 * Destructor
	 */
	function __destruct() {
		
	}
	
	public function hasErrors() {
		return sizeof($this->_errors);
	}
	
	public function getErrorsReturn() {
		return array("errors" => $this->getErrors());
	}
	
	public function getErrors() {
		return $this->_errors;
	}
	
	/*public function getSanatized() {
		return $this->_inputs;
	}*/
	
	/**
	 * Sanitize inputs
	 *
	 * @param array $args array of params to be used in tests
	 * @param string $className
	 * @param string $methodName
	 * @return array
	 */
	/*public function sanatize($args, $className = '', $methodName = '') {
		
		if (!$className || !$methodName) {
			// trace source
			$trace = debug_backtrace();
			if (!isset($trace[1])) return FALSE; // trace failed
			
			$source = "{$trace[1]['class']}::{$trace[1]['function']}";
		} else {
			$source = "{$className}::{$methodName}";
		}
		
		if ($args == NULL) {
			$args = array();
			if (isset($trace)) $args = $trace[1]['args'];
			// $args = func_get_args();
		}
		
		// add class_function to config file
		$this->add_function_array($source, $this->_inputs);
		
		foreach($this->_rules[$source] as $param => $metadata) {
			$this->_inputs[$param] = $this->parseFilters($this->_inputs[$param], $metadata);
		}
		
		return $this->_inputs;
	}*/

	/**
	 * Validate inputs to ensure meet rule parameters
	 *
	 * @param array $args array of params to be used in tests
	 * @param string $className
	 * @param string $methodName
	 * @return bool
	 */
	/*public function validate($args, $className = '', $methodName = '') {
		if (!$className || !$methodName) {
			// trace source
			$trace = debug_backtrace();
			if (!isset($trace[1])) return FALSE; // trace failed
			
			$source = "{$trace[1]['class']}::{$trace[1]['function']}";
		} else {
			$source = "{$className}::{$methodName}";
		}
		
		if ($args == NULL) {
			$args = array();
			if (isset($trace)) $args = $trace[1]['args'];
			// $args = func_get_args();
		}
		
		// add class_function to config file
		$this->add_function_array($source, $this->_inputs);
		
		$allowed = TRUE;
		foreach($this->_rules[$source] as $param => $metadata) {
			$allowed = ($allowed && $this->parseRules($this->_inputs[$param], $metadata));
		}
		return $allowed;
	}*/
	
	/**
	 * Check inputs to ensure meet rule parameters
	 *
	 * @param array $args array of params to be used in tests
	 * @param string $className
	 * @param string $methodName
	 * @return bool
	 */
	public function run($args, $className = '', $methodName = '') {
		$this->_inputs = $args;
		if (!$className || !$methodName) {
			// trace source
			$trace = debug_backtrace();
			if (!isset($trace[1])) return FALSE; // trace failed
			
			$source = "{$trace[1]['class']}::{$trace[1]['function']}";
		} else {
			$source = "{$className}::{$methodName}";
		}
		
		if ($args == NULL) {
			$args = array();
			if (isset($trace)) $args = $trace[1]['args'];
			// $args = func_get_args();
		}
		
		// add class_function to config file
		$this->add_function_array($source, $this->_inputs);
		
		foreach($this->_rules[$source] as $param => $metadata) {
			if (!isset($this->_inputs[$param])) {
				$this->_inputs[$param] = null;
			}
			
			$this->parseRules($this->_inputs[$param], $metadata);
			$this->_inputs[$param] = $this->parseFilters($this->_inputs[$param], $metadata);
		}
		return $this->_inputs;
	}
	
	/**
	 * Parse a string of rules
	 *
	 * @param string $value
	 * @param string $rules
	 * @return BOOL
	 */
	private function parseRules($value, $metadata) {
		$this->_metadata = $metadata;
		
		$allowed = TRUE;
		$rules = explode("|", $metadata['rules']);
		if ($rules[0]) {
			foreach($rules as $rule) {
				preg_match("/(!?)([\w-]*)\[?([^\[\]]*)\]?/", $rule, $matches);
							
				$test = $matches[2];
				$params = $matches[3];
				
				if (method_exists($this, $test)) {
					if ($params != '') {
						$return = $this->{$test}($value, $params);
					} else {
						$return = $this->{$test}($value);
					}
					
					if ($matches[1] == '!') {
						$return = !$return;
					}
					if (!$return) {
						if (isset($this->_default_messages[$test])) {
							$this->_errors[$metadata['field']] = $metadata['label'].' '.$this->_default_messages[$test];
						} else if ($test == 'password') {
							$this->_errors[$metadata['field']] = $this->password->getErrors();
						} else if (in_array($test, array("email", "field"))) {
							// recursively called rules
						} else {
							echo "_default_messages for $test missing!!!";
						}
					}
					$allowed = ($allowed && $return);
				}
			}
		}
		return $allowed;
	}
	
	/**
	 * Parse a string of filters and apply
	 *
	 * @param string $value
	 * @param string $rules
	 * @return BOOL
	 */
	private function parseFilters($value, $metadata) {
		$this->_metadata = $metadata;
		
		$rules = explode("|", $metadata['filters']);
		if ($rules[0]) {
			foreach($rules as $rule) {
				preg_match("/([\w-]*)\[?([^\[\]]*)\]?/", $rule, $matches); // (!?) is not needed for filter
							
				$test = $matches[1];
				$params = $matches[2];
				
				if (method_exists($this, $test)) {
					if ($params != '') {
						$return = $this->{$test}($value, $params);
					} else {
						$return = $this->{$test}($value);
					}
				} else if (function_exists($test)) {
					
					if ($params != '') {
						$value = $test($value, $params);
					} else {
						$value = $test($value);
					}
				}
			}
		}
		return $value;
	}
	
	/**
	 * Adds a new Class::Function to rules list
	 *
	 * @param string $name
	 * @param array $args Function inputs
	 * @return void
	 */
	private function add_function_array($name, $args = array()) {
		if (!$name) return FALSE;
		
		$regenerate = false;
		if (!isset($this->_rules[$name])) {
			$this->_rules[$name] = array();
		}
		
		foreach ($args as $key => $value) {
			if (!isset($this->_rules[$name][$key])) {
				$this->_rules[$name][$key] = array(
					'field' => $key,
					'label' => $this->build_label($key),
					'rules' => '',
					'filters' => '',
				);
				$regenerate = true;
			}
		}
		
		if ($regenerate) $this->build_function_array($this->_rules);
	}
	
	/**
	 * Exports an array to a file
	 *
	 * @param array $arr Array to output
	 * @param string $var_name Var name to be to be set to the array
	 * @param string $file Output file path
	 * @return array
	 */
	private function build_function_array($arr, $var_name = 'filter_rules', $file = 'php/inc.filter.rules.php') {
		ksort($arr);
		foreach($arr as $key => $value) {
			ksort($arr[$key]);
		}
		ob_start();
		var_export($arr);
		$result = ob_get_clean();
		
		file_put_contents($file, "<?php\n\$$var_name = ".$result.";\n?>");
		return $arr;
	}
	
	/**
	 * Creates a label from function name
	 * ie aaaBbb_ccc -> Aaa Bbb Ccc
	 *
	 * @param string $field
	 * @return string
	 */
	private function build_label($field) {
		$label = str_replace("_", " ", $field); // aaaBbb_ccc -> aaaBbb ccc
		$label = preg_replace("/([A-Z])/", " $1", $label); // aaaBbb -> aaa Bbb ccc
		$label = ucwords($label); // aaa Bbb -> Aaa Bbb Ccc
		return $label;
	}
	
	//-- Generate inc.filter.tables.php --//
	private function build_table_array() {
		// collect data
		$this->get_tables();
		
		//print_r($this->db_array);

		$types = array(); // for debug
		
		$filter_table = array();
		
		foreach($this->db_array as $table => $fields) {
			$this->_tables[$table] = array();	// return output
			//print_r($fields);
			foreach($fields as $field_name => $field) {
				//print_r($field);
				// filters by type
				$types[] = $field['type'];
				$types = array_unique($types);
				
				$params = array();
				
				// get params from comments
				preg_match("/filter\[([\w\|\[\]]*)]/", $field['Comment'], $matches);
				
				if (isset($matches[1]))
					$params[] = $matches[1];
				
				if ($field['Key'] == 'PRI' && $field['Extra'] == 'auto_increment')
					$params[] = 'is_natural_no_zero';
				
				
				switch ($field['type']) {
					// numbers
					case 'tinyint': // The signed range is –128 to 127. The unsigned range is 0 to 255. 
						$params[] = "integer|max_length[".$field['size']."]";
						$params[] = ($field['unsigned'])
							? "is_natural|greater_than_or_equal[0]|less_than_or_equal[255]"
							: "greater_than_or_equal[-128]|less_than_or_equal[127]";
						break;
					case 'smallint': // The signed range is –32768 to 32767. The unsigned range is 0 to 65535 
						$params[] = "integer|max_length[".$field['size']."]";
						$params[] = ($field['unsigned'])
							? "is_natural|greater_than_or_equal[0]|less_than_or_equal[65535]"
							: "greater_than[-32768]|less_than_or_equal[32767]";
						break;
					case 'mediumint': // The signed range is –8388608 to 8388607. The unsigned range is 0 to 16777215  
						$params[] = "integer|max_length[".$field['size']."]";
						$params[] = ($field['unsigned'])
							? "is_natural|greater_than_or_equal[0]|less_than_or_equal[16777215]"
							: "greater_than_or_equal[-8388608]|less_than_or_equal[8388607]";
						break;
					case 'int' : // The signed range is –2147483648 to 2147483647. The unsigned range is 0 to 4294967295 
						$params[] = "integer|max_length[".$field['size']."]";
						$params[] = ($field['unsigned'])
							? "is_natural|greater_than_or_equal[0]|less_than_or_equal[4294967295]"
							: "greater_than_or_equal[-2147483648]|less_than_or_equal[2147483647]";
						break;
					case 'bigint': //The signed range is –9223372036854775808 to 9223372036854775807. The unsigned range is 0 to 18446744073709551615  
						$params[] = "integer|max_length[".$field['size']."]";
						$params[] = ($field['unsigned'])
							? "is_natural|greater_than_or_equal[0]|less_than_or_equal[18446744073709551615]"
							: "greater_than_or_equal[-9223372036854775808]|less_than_or_equal[9223372036854775807]";
						break;
					case 'decimal' :
						$params[] = "decimal[".$field['size']."]";
						break;
					
					// strings
					case 'char':	// The range of Length is 1 to 255 characters. Trailing spaces are removed when the value is retrieved. CHAR values are sorted and compared in case-insensitive fashion according to the default character set unless the BINARY keyword is given 
						$params[] = "max_length[255]";
						break;
					case 'varchar':	// The range of Length is 1 to 255 characters. VARCHAR values are sorted and compared in case-insensitive fashion unless the BINARY keyword is given 
						$params[] = "max_length[255]";
						break;
					case 'tinyblob' : // A BLOB or TEXT column with a maximum length of 255 (2^8 - 1) characters 
						$params[] = "max_length[255]";
						break;
					case 'blob' : // A BLOB or TEXT column with a maximum length of 65535 (2^16 - 1) characters 
						$params[] = "max_length[65535]";
						break;
					case 'mediumblob' : // A BLOB or TEXT column with a maximum length of 16777215 (2^24 - 1) characters  
						$params[] = "max_length[16777215]";
						break;
					case 'longblob' : // A BLOB or TEXT column with a maximum length of 4294967295 (2^32 - 1) characters 
						$params[] = "max_length[4294967295]";
						break;
					case 'tinytext' : // A BLOB or TEXT column with a maximum length of 255 (2^8 - 1) characters 
						$params[] = "max_length[255]";
						break;
					case 'text' : // A BLOB or TEXT column with a maximum length of 65535 (2^16 - 1) characters 
						$params[] = "max_length[65535]";
						break;
					case 'mediumtext' : // A BLOB or TEXT column with a maximum length of 16777215 (2^24 - 1) characters 
						$params[] = "max_length[16777215]";
						break;
					case 'longtext' : // A BLOB or TEXT column with a maximum length of 4294967295 (2^32 - 1) characters 
						$params[] = "max_length[4294967295]";
						break;
				}
				
				$this->_tables[$table][$field_name] = implode('|', $params);
			}
		}
		
		if ($this->_debug) print_r($types);
		
		$this->_tables = $this->build_function_array($this->_tables, 'filter_tables', 'php/inc.filter.tables.php');
		
		return $this->_tables;
	}
	
	// call to generate $db_array
	private function get_tables($db_name = DB_NAME) {
		$query = "SHOW FULL TABLES FROM $db_name";
		
		if ($result = $this->db->query($query)) {
			
			while($table = $this->db->fetch_array($result)) {
				$this_array[$table[0]] = array();
				$this->get_table_fields($table[0]);
			}
		}
		
		return $this->db_array;
	}
	
	private function get_table_fields($table = '') {
		$query = "SHOW FULL COLUMNS FROM $table";

		if ($result = $this->db->query($query)) {
			if ($this->_debug) echo "\n$table\n";
			while($fields = $this->db->fetch_assoc($result)) {
				//print_r($fields);
				$name = $fields['Field'];
				$this->db_array[$table][$name] = $fields;
				
				if ($this->_debug) echo "{$fields['Field']}\t{$fields['Type']}\t{$fields['Comment']}\n";
				preg_match("/^(\w*)\(?([\d,]*)?\)?\s?(unsigned)?\s?(zerofill)?/", $fields['Type'], $matches);
				//print_r($matches);
				$this->db_array[$table][$name]['type'] = $matches[1];
				$this->db_array[$table][$name]['size'] = $matches[2];
				$this->db_array[$table][$name]['unsigned'] = isset($matches[3]);
				$this->db_array[$table][$name]['zerofill'] = isset($matches[4]);
				// print_flags
				//echo base_convert ( $row->flags ,10 , 2);
				//print_r($this->db_array[$table][$name]);
			}
		}
		return $this->db_array[$table];
	}
	
	// ********************************************************************

	/**
	 * Field - recursive rules based on DB
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function field($str, $arg) {
		list($table, $field) = explode(".", $arg);
		$return = TRUE;
		if(isset($this->_tables[$table]) && isset($this->_tables[$table][$field])) {
			$metadata = $this->_metadata;
			$metadata['rules'] = $this->_tables[$table][$field];
			$metadata['filters'] = '';
			$return = $this->parseRules($str, $metadata);
		}
		return $return;
	}
	
	// --------------------------------------------------------------------

	/**
	 * Required
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function required($str)
	{
		if ( ! is_array($str))
		{
			return (trim($str) == '') ? FALSE : TRUE;
		}
		else
		{
			return ( ! empty($str));
		}
	}

	// --------------------------------------------------------------------

	/**
	 * Performs a Regular Expression match test.
	 *
	 * @access	public
	 * @param	string
	 * @param	regex
	 * @return	bool
	 */
	public function regex_match($str, $regex)
	{
		if ( ! preg_match($regex, $str))
		{
			return FALSE;
		}

		return TRUE;
	}

	// --------------------------------------------------------------------

	/**
	 * Match one field to another
	 *
	 * @access	public
	 * @param	string
	 * @param	field
	 * @return	bool
	 */
	public function matches($str, $field)
	{
		if ( ! isset($this->_inputs[$field]))
		{
			return FALSE;
		}

		$field = $this->_inputs[$field];

		return ($str !== $field) ? FALSE : TRUE;
	}
	
	// --------------------------------------------------------------------

	/**
	 * Match one field to another
	 *
	 * @access	public
	 * @param	string
	 * @param	field
	 * @return	bool
	 */
	public function is_unique($str, $table_field)
	{
		list($table, $field)=explode('.', $table_field);
		$r = $this->db->select($table, array($field => $str));
		
		return $this->db->num_rows($r) === 0;
	}

	// --------------------------------------------------------------------

	/**
	 * Minimum Length
	 *
	 * @access	public
	 * @param	string
	 * @param	value
	 * @return	bool
	 */
	public function min_length($str, $val)
	{
		if (preg_match("/[^0-9]/", $val))
		{
			return FALSE;
		}

		if (function_exists('mb_strlen'))
		{
			return (mb_strlen($str) < $val) ? FALSE : TRUE;
		}

		return (strlen($str) < $val) ? FALSE : TRUE;
	}

	// --------------------------------------------------------------------

	/**
	 * Max Length
	 *
	 * @access	public
	 * @param	string
	 * @param	value
	 * @return	bool
	 */
	public function max_length($str, $val)
	{
		if (preg_match("/[^0-9]/", $val))
		{
			return FALSE;
		}

		if (function_exists('mb_strlen'))
		{
			return (mb_strlen($str) > $val) ? FALSE : TRUE;
		}

		return (strlen($str) > $val) ? FALSE : TRUE;
	}

	// --------------------------------------------------------------------

	/**
	 * Exact Length
	 *
	 * @access	public
	 * @param	string
	 * @param	value
	 * @return	bool
	 */
	public function exact_length($str, $val)
	{
		if (preg_match("/[^0-9]/", $val))
		{
			return FALSE;
		}

		if (function_exists('mb_strlen'))
		{
			return (mb_strlen($str) != $val) ? FALSE : TRUE;
		}

		return (strlen($str) != $val) ? FALSE : TRUE;
	}

	// --------------------------------------------------------------------
	
	/**
	 * Boolean
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function boolean($str)
	{
		return filter_var($str, FILTER_VALIDATE_BOOLEAN);
	}

	// --------------------------------------------------------------------

	/**
	 * Alpha
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function alpha($str)
	{
		return ( ! preg_match("/^([a-z])+$/i", $str)) ? FALSE : TRUE;
	}

	// --------------------------------------------------------------------

	/**
	 * Alpha-numeric
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function alpha_numeric($str)
	{
		return ( ! preg_match("/^([a-z0-9])+$/i", $str)) ? FALSE : TRUE;
	}

	// --------------------------------------------------------------------

	/**
	 * Alpha-numeric with underscores and dashes
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function alpha_dash($str)
	{
		return ( ! preg_match("/^([-a-z0-9_-])+$/i", $str)) ? FALSE : TRUE;
	}

	// --------------------------------------------------------------------

	/**
	 * Numeric
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function numeric($str)
	{
		return (bool)preg_match( '/^[\-+]?[0-9]*\.?[0-9]+$/', $str);

	}

	// --------------------------------------------------------------------

	/**
	 * Is Numeric
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	/*public function is_numeric($str)
	{
		return ( ! is_numeric($str)) ? FALSE : TRUE;
	}*/

	// --------------------------------------------------------------------

	/**
	 * Integer
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function integer($str)
	{
		return (bool) preg_match('/^[\-+]?[0-9]+$/', $str);
	}

	// --------------------------------------------------------------------

	/**
	 * Decimal number
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	/*public function decimal($str, $total = 0, $decimal = 0)
	{
		if ($total && $decimal) {
			$diff = $total - $decimal;
			return (bool) preg_match('/^[\-+]?[0-9]{0,'.$diff.'}\.[0-9]{0,'.$decimal.'}$/', $str);
		} else {
			return (bool) preg_match('/^[\-+]?[0-9]+\.[0-9]+$/', $str);
		}
	}*/

	// --------------------------------------------------------------------

	/**
	 * Greather than
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function greater_than($str, $min)
	{
		if ( ! is_numeric($str))
		{
			return FALSE;
		}
		return $str > $min;
	}
	
	// --------------------------------------------------------------------

	/**
	 * Greather than
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function greater_than_or_equal($str, $min)
	{
		if ( ! is_numeric($str))
		{
			return FALSE;
		}
		return $str >= $min;
	}

	// --------------------------------------------------------------------

	/**
	 * Less than
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function less_than($str, $max)
	{
		if ( ! is_numeric($str))
		{
			return FALSE;
		}
		return $str < $max;
	}
	// --------------------------------------------------------------------

	/**
	 * Less than
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function less_than_or_equal($str, $max)
	{
		if ( ! is_numeric($str))
		{
			return FALSE;
		}
		return $str <= $max;
	}

	// --------------------------------------------------------------------

	/**
	 * Is a Natural number(0,1,2,3, etc.)
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function is_natural($str)
	{
		return (bool) preg_match( '/^[0-9]+$/', $str);
	}

	// --------------------------------------------------------------------

	/**
	 * Is a Natural number, but not a zero(1,2,3, etc.)
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function is_natural_no_zero($str)
	{
		if ( ! preg_match( '/^[0-9]+$/', $str))
		{
			return FALSE;
		}

		if ($str == 0)
		{
			return FALSE;
		}

		return TRUE;
	}

	
	// --------------------------------------------------------------------

	/**
	 * Email
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function email($str)
	{
		$metadata = $this->_metadata;
		$metadata['rules'] = 'valid_email|valid_email_dns';
		$metadata['filters'] = '';
		return $this->parseRules($str, $metadata);
	}

	
	// --------------------------------------------------------------------

	/**
	 * Valid Email
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function valid_email($str)
	{
		//return filter_var($str, FILTER_VALIDATE_EMAIL);
		// practical implementation of RFC 2822
		return ( ! preg_match("/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9][a-z0-9-]*[a-z0-9]/ix", $str)) ? FALSE : TRUE;
		// old php version
		return ( ! preg_match("/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/ix", $str)) ? FALSE : TRUE;
		// CI version
		return ( ! preg_match("/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,7}$/ix", $str)) ? FALSE : TRUE;
	}

	// --------------------------------------------------------------------

	/**
	 * Valid Emails
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function valid_emails($str)
	{
		if (strpos($str, ',') === FALSE)
		{
			return $this->valid_email(trim($str));
		}

		foreach (explode(',', $str) as $email)
		{
			if (trim($email) != '' && $this->valid_email(trim($email)) === FALSE)
			{
				return FALSE;
			}
		}

		return TRUE;
	}

	// --------------------------------------------------------------------

	/**
	 * Valid Email DNS
	 * 
	 * Checks teh MX record of an email domain
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function valid_email_dns($str)
	{
		if ($this->valid_email($str)) {
			$host = substr($str, strpos($str, "@")+1);
			// return checkdnsrr($host, "MX");
			if (getmxrr($host, $mxhosts) || !count($mxhosts) || $mxhosts[0] == NULL || $mxhosts[0] == '0.0.0.0') {
				return TRUE;
			}
		}
		return FALSE;
	}

	// --------------------------------------------------------------------
	
	/**
	 * Valid URL
	 * 
	 * Validates value as URL (according to » http://www.faqs.org/rfcs/rfc2396),
	 * optionally with required components. Note that the function will only find ASCII URLs
	 * to be valid; internationalized domain names (containing non-ASCII characters) will fail.
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function valid_url($str)
	{
		//return filter_var($str, FILTER_VALIDATE_URL);
		
		return ( ! preg_match("/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ix", $str)) ? FALSE : TRUE;
		
		return ( ! preg_match("/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:ww‌​w.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?‌​(?:[\w]*))?)/ix", $str)) ? FALSE : TRUE;
	}

	// --------------------------------------------------------------------
	
	/**
	* Validate IP Address
	*
	* @access	public
	* @param	string
	* @param	string	"ipv4" or "ipv6" to validate a specific ip format
	* @return	bool
	*/
	public function valid_ip($ip, $which = '')
	{
		$which = strtolower($which);

		// First check if filter_var is available
		if (is_callable('filter_var'))
		{
			switch ($which) {
				case 'ipv4':
					$flag = FILTER_FLAG_IPV4;
					break;
				case 'ipv6':
					$flag = FILTER_FLAG_IPV6;
					break;
				default:
					$flag = '';
					break;
			}

			return (bool) filter_var($ip, FILTER_VALIDATE_IP, $flag);
		}

		if ($which !== 'ipv6' && $which !== 'ipv4')
		{
			if (strpos($ip, ':') !== FALSE)
			{
				$which = 'ipv6';
			}
			elseif (strpos($ip, '.') !== FALSE)
			{
				$which = 'ipv4';
			}
			else
			{
				return FALSE;
			}
		}

		$func = '_valid_'.$which;
		return $this->$func($ip);
	}

	// --------------------------------------------------------------------

	/**
	* Validate IPv4 Address
	*
	* Updated version suggested by Geert De Deckere
	*
	* @access	protected
	* @param	string
	* @return	bool
	*/
	protected function _valid_ipv4($ip)
	{
		$ip_segments = explode('.', $ip);

		// Always 4 segments needed
		if (count($ip_segments) !== 4)
		{
			return FALSE;
		}
		// IP can not start with 0
		if ($ip_segments[0][0] == '0')
		{
			return FALSE;
		}

		// Check each segment
		foreach ($ip_segments as $segment)
		{
			// IP segments must be digits and can not be
			// longer than 3 digits or greater then 255
			if ($segment == '' OR preg_match("/[^0-9]/", $segment) OR $segment > 255 OR strlen($segment) > 3)
			{
				return FALSE;
			}
		}

		return TRUE;
	}

	// --------------------------------------------------------------------

	/**
	* Validate IPv6 Address
	*
	* @access	protected
	* @param	string
	* @return	bool
	*/
	protected function _valid_ipv6($str)
	{
		// 8 groups, separated by :
		// 0-ffff per group
		// one set of consecutive 0 groups can be collapsed to ::

		$groups = 8;
		$collapsed = FALSE;

		$chunks = array_filter(
			preg_split('/(:{1,2})/', $str, NULL, PREG_SPLIT_DELIM_CAPTURE)
		);

		// Rule out easy nonsense
		if (current($chunks) == ':' OR end($chunks) == ':')
		{
			return FALSE;
		}

		// PHP supports IPv4-mapped IPv6 addresses, so we'll expect those as well
		if (strpos(end($chunks), '.') !== FALSE)
		{
			$ipv4 = array_pop($chunks);

			if ( ! $this->_valid_ipv4($ipv4))
			{
				return FALSE;
			}

			$groups--;
		}

		while ($seg = array_pop($chunks))
		{
			if ($seg[0] == ':')
			{
				if (--$groups == 0)
				{
					return FALSE;	// too many groups
				}

				if (strlen($seg) > 2)
				{
					return FALSE;	// long separator
				}

				if ($seg == '::')
				{
					if ($collapsed)
					{
						return FALSE;	// multiple collapsed
					}

					$collapsed = TRUE;
				}
			}
			elseif (preg_match("/[^0-9a-f]/i", $seg) OR strlen($seg) > 4)
			{
				return FALSE; // invalid segment
			}
		}

		return $collapsed OR $groups == 1;
	}
	
	// --------------------------------------------------------------------

	/**
	 * Valid Base64
	 *
	 * Tests a string for characters outside of the Base64 alphabet
	 * as defined by RFC 2045 http://www.faqs.org/rfcs/rfc2045
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	/*public function valid_base64($str)
	{
		return (bool) ! preg_match('/[^a-zA-Z0-9\/\+=]/', $str);
	}*/
	
	
	// --------------------------------------------------------------------

	/**
	 * Strong Password
	 *
	 * @access	public
	 * @param	string
	 * @param	string
	 * @return	bool
	 */
	public function password($str)
	{
		return $this->password->validate($str);
	}
	
	// --------------------------------------------------------------------

	/**
	 * Valid Mail Code
	 *
	 * @access	public
	 * @param	string
	 * @param	string
	 * @return	bool
	 */
	/*public function valid_mail_code($str, $country_code)
	{
		return TRUE;
	}*/
	
	// --------------------------------------------------------------------

	/**
	 * Valid Phone Number
	 *
	 * @access	public
	 * @param	string
	 * @param	string
	 * @return	bool
	 */
	/*public function valid_phone($str, $type)
	{
		return TRUE;
		switch ($type) {
			case "+":				// +1 (XXX) XXX-XXXX
				return $this->match("/(\d)/", $str);
			default:				// (XXX) XXX-XXXX
				return $this->match("/(\d)/", $str);
		}
	}*/
	
	// ********************************************************************

	/**
	 * Trim
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function trim($str)
	{
		return trim($str);
	}
	
	// --------------------------------------------------------------------
	/**
	 * Boolean
	 *
	 * @access	public
	 * @param	string
	 * @return	bool
	 */
	public function cast_boolean($str)
	{
		
		switch (strtolower($str)) {
			case "true": 	return TRUE; break;
			case "false": 	return FALSE; break;
			case "1": 		return TRUE; break;
			case "0": 		return FALSE; break;
			case "yes": 	return TRUE; break;
			case "no": 		return FALSE; break;
			case "on": 		return TRUE; break;
			case "off": 	return FALSE; break;
			default: 		return $str;
		}
	}
	
	// --------------------------------------------------------------------

	/**
	 * Prep URL
	 *
	 * @access	public
	 * @param	string
	 * @return	string
	 */
	public function prep_url($str = '')
	{
		if ($str == 'http://' OR $str == '')
		{
			return '';
		}

		if (substr($str, 0, 7) != 'http://' && substr($str, 0, 8) != 'https://')
		{
			$str = 'http://'.$str;
		}

		return $str;
	}
	
	// --------------------------------------------------------------------

	/**
	 * Strip Tags
	 *
	 * @access	public
	 * @param	string
	 * @return	string
	 */
	public function strip_tags($str, $tags = '')
	{
		return strip_tags($str, $tags);
	}

	// --------------------------------------------------------------------

	/**
	 * XSS Clean
	 *
	 * @access	public
	 * @param	string
	 * @return	string
	 */
	/*public function xss_clean($str)
	{
		return $this->security->xss_clean($str);
	}*/

	// --------------------------------------------------------------------

	/**
	 * Convert PHP tags to entities
	 *
	 * @access	public
	 * @param	string
	 * @return	string
	 */
	public function encode_php_tags($str)
	{
		return str_replace(array('<?php', '<?PHP', '<?', '?>'),array('&lt;?php', '&lt;?PHP', '&lt;?', '?&gt;'), $str);
	}
	
	// --------------------------------------------------------------------

	/**
	 * sanitize strings
	 *
	 * @access	public
	 * @param	string
	 * @return	string
	 */
	public function sanitize_string($str)
	{
		return filter_var($str, FILTER_SANITIZE_STRING);
	}
}

?>
