<?php

/*

script that parses through the database
and creates an array of table fields with
their types.

add to table field comment area:
filter[_insert_filters_here_|_multi_filter_]


*/

class filter_tools{
	var $debug;
    var $db;
	var $db_array = array();
	
    /**
     * Constructor
     */
    function __construct($debug = false) {
    	global $database, $filter_function;
    	$this->debug = $debug;
		$this->db = $database;
		$this->filter_function = isset($filter_function) ? $filter_function : array();
    }

    /**
     * Destructor
     */
    function __destruct() {
    	
    }
	
	
	/*function flags_array($flags_int_10 = 0) {
		$flags = array();
		// base 10 -> base 2
		$flags_int_2 = decbin($flags_int_10);
		$flags_array_2 = str_split($flags_int_2);
		
		$flags_array_2 = array_reverse($flags_array_2);
		
		for ($i = 0, $l = count($flags_array_2); $i < $l; $i++) {
			if ($flags_array_2[$i]) {
				$flags[] = $this->field_flag_bits[pow(2,$i)];
			}
		}
		return $flags;
	}*/
	
	
	// call to generate $db_array
	function get_tables($db_name = DB_NAME) {
		$query = "SHOW FULL TABLES FROM $db_name";
		
		if ($result = $this->db->query($query)) {
			
			while($table = $this->db->fetch_array($result)) {
				$this_array[$table[0]] = array();
				$this->get_table_fields($table[0]);
			}
		}
		
		return $this->db_array;
	}
	
	function get_table_fields($table = '') {
		$query = "SHOW FULL COLUMNS FROM $table";

		if ($result = $this->db->query($query)) {
			if ($this->debug) echo "\n$table\n";
			while($fields = $this->db->fetch_assoc($result)) {
				//print_r($fields);
				$name = $fields['Field'];
				$this->db_array[$table][$name] = $fields;
				
				if ($this->debug) echo "{$fields['Field']}\t{$fields['Type']}\t{$fields['Comment']}\n";
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
	
	function add_function_array($name = "", $requests = array()) {
		$regenerate = false;
		if ($name) {
			if (!isset($this->filter_function[$name])) {
				$this->filter_function[$name] = array();
				$regenerate = true;
			}
			foreach($requests as $key => $value) {
				if (!isset($this->filter_function[$name][$key])) {
					$this->filter_function[$name][$key] = array(
						'field' => $key,
						'label' => $this->build_label($key),
						'rules' => '',
					);
					$regenerate = true;
				}
			}
		}
		
        
        if ($regenerate) $this->build_function_array();
	}
	
	function build_function_array($file = 'php/inc.filter.function.php') {
		
		ob_start();
		var_export($this->filter_function);
		$result = ob_get_clean();
		
		file_put_contents($file, "<?php\n/*\nThis file is updated automatically as your applications is run.\nThis is the best place to add the 'required' param for each function called.\n*/\n\$filter_function = ".$result.";\n?>");
		return $this->filter_function;
	}
	
	function build_table_array($file = 'php/inc.filter.table.php') {
		// collect data
		$this->get_tables();
		
		//print_r($this->db_array);

		$types = array(); // for debug
		
		$filter_table = array();
		
		foreach($this->db_array as $table => $fields) {
			$filter_table['table_'.$table] = array();	// return output
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
				
				$filter_table['table_'.$table][$field_name] = array(
					'field' => $field_name,
					'label' => $this->build_label($field_name),
					'rules' => implode('|', $params),
				);
			}
		}
		
		ob_start();
		var_export($filter_table);
		$result = ob_get_clean();
		
		if ($this->debug) print_r($types);
		
		file_put_contents($file, "<?php\n\$filter_table = ".$result.";\n?>");
	}
	
	private function build_label($field) {
		$label = str_replace("_", " ", $field);
		$label = ucwords($label);
		return $label;
	}
	/*function type_suggest() {
		// http://help.scibit.com/mascon/masconMySQL_Field_Types.html
		// collect data
		$this->get_tables();
	}*/
}

?>