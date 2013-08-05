<?php

/**
 * Location - REST for a company location
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

class Location extends Core {
	
	/**
	 * Constructs a Location object.
	 */
	function __construct(){
		parent::__construct();
	}
	
	/**
	 * Destructs a Location object.
	 *
	 * @return void
	 */
	function __destruct() {
		parent::__destruct();
	}

	/**
	 * get a list of locations for a company
	 *
	 * @param int $location_ID Location ID
	 * @return array
	 *
	 * @url GET {location_ID}
	 * @access protected
	 */
	function get($location_ID=NULL) {
		
		$return = array();

		$db_where = array('company_ID' => COMPANY_ID);
		if (!is_null($location_ID)) {
			$db_where['location_ID'] = $location_ID;
		}

		$results = $this->db->select('locations', $db_where,
			array('location_ID', 'company_ID', 'location_name', 'address_1', 'address_2', 'city', 'region_code', 'country_code', 'mail_code', 'latitude', 'longitude', 'location_phone')
		);
		if ($results) {
			while($location = $this->db->fetch_assoc($results, array("location_phone"))) {
				$return[$location['location_ID']] = $location;
			}
			if (!is_null($location_ID)) {
				$return = $return[0];
			}
		}

		return $return;
	}
	
	/**
	 * add a location to a company
	 *
	 * @param array $request_data POST data
	 * @return int
	 *
	 * @url POST
	 * @access protected
	 */
	function post($request_data=NULL) {
		$return = array();
		$params = array(
			"location_name",
			"address_1",
			"address_2",
			"city",
			"region_code",
			"country_code",
			"mail_code",
			//"latitude",
			//"longitude",
			"location_phone",
		);

		foreach ($params as $key) {
			$request_data[$key] = isset($request_data[$key]) ? $request_data[$key] : NULL;
		}
		
		$request_data['company_ID'] = COMPANY_ID;
		
		/*$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('locations');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$request_data = $this->filter->get_request_data();*/
		$request_data = $this->filter->run($request_data);
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }

		// location //
		$request_data["latitude"] 	= 0;
		$request_data["longitude"] 	= 0;

		// Get Lat and Long
		/*$req = 'http://api.local.yahoo.com/MapsService/V1/geocode?appid='.YAHOO_APP_ID.'&street='.urlencode($request_data["address_1"]).'+'.urlencode($request_data["address_2"]).'&city='.urlencode($request_data["city"]).'&state='.$request_data["region_code"].'&output=php';
		$phpserialized = file_get_contents($req);
		$phparray = unserialize($phpserialized);
		if (is_array($phparray)) {
			$resultset = $phparray['ResultSet'];
			if(!isset($resultset['warning'])) {
				$result = $resultset['Result'];
				$request_data["latitude"] = $result['Latitude'];
				$request_data["longitude"] = $result['Longitude'];
			}
		}*/

		$location = array(
			//"location_ID"	=> $request_data["location_ID"],
			"company_ID"	=> COMPANY_ID,
			"location_name"	=> $request_data["location_name"],
			"address_1"		=> $request_data["address_1"],
			"address_2"		=> $request_data["address_2"],
			"city"			=> $request_data["city"],
			"region_code"	=> $request_data["region_code"],
			"country_code"	=> $request_data["country_code"],
			"mail_code"		=> $request_data["mail_code"],
			//"latitude"		=> $request_data["latitude"],
			//"longitude"		=> $request_data["longitude"],
			"location_phone"	=> $request_data["location_phone"],
			//"location_fax"		=> $request_data["location_fax"],
			"timestamp_create" => $_SERVER['REQUEST_TIME'],
			"timestamp_update" => $_SERVER['REQUEST_TIME'],
		);
		$location_ID = $this->db->insert('locations', $location);
		
		if (isset($request_data['primary'])) {
			$this->db->update('companies',
				array("location_default_ID" => $location_ID),
				array("company_ID" => COMPANY_ID)
			);
		}
		
		return $location_ID;
	}

	/**
	 * update a location for a company
	 *
	 * @param array $request_data PUT data
	 * @return bool
	 *
	 * @url PUT
	 * @access protected
	 */
	function put($request_data=NULL) {
		$return = array();
		$params = array(
			"location_ID",
			"company_ID",
			"location_name",
			"address_1",
			"address_2",
			"city",
			"region_code",
			"country_code",
			"mail_code",
			//"latitude",
			//"longitude",
			"location_phone",
		);

		foreach ($params as $key) {
			$request_data[$key] = isset($request_data[$key]) ? $request_data[$key] : NULL;
		}
		
		$request_data['company_ID'] = COMPANY_ID;
		
		/*$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('locations');
		if(!$this->filter->run()) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$request_data = $this->filter->get_request_data();*/
		$request_data = $this->filter->run($request_data);
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		// location //
		$request_data["latitude"] 	= 0;
		$request_data["longitude"] 	= 0;

		// Get Lat and Long
		/*$req = 'http://api.local.yahoo.com/MapsService/V1/geocode?appid='.YAHOO_APP_ID.'&street='.urlencode($request_data["address_1"]).'+'.urlencode($request_data["address_2"]).'&city='.urlencode($request_data["city"]).'&state='.$request_data["region_code"].'&output=php';
		$phpserialized = file_get_contents($req);
		$phparray = unserialize($phpserialized);
		if (is_array($phparray)) {
			$resultset = $phparray['ResultSet'];
			if(!isset($resultset['warning'])) {
				$result = $resultset['Result'];
				$request_data["latitude"] = $result['Latitude'];
				$request_data["longitude"] = $result['Longitude'];
			}
		}*/

		$location = array(
			"location_ID"	=> $request_data["location_ID"],
			"company_ID"	=> COMPANY_ID,
			"location_name"	=> $request_data["location_name"],
			"address_1"		=> $request_data["address_1"],
			"address_2"		=> $request_data["address_2"],
			"city"			=> $request_data["city"],
			"region_code"	=> $request_data["region_code"],
			"country_code"	=> $request_data["country_code"],
			"mail_code"		=> $request_data["mail_code"],
			//"latitude"		=> $request_data["latitude"],
			//"longitude"		=> $request_data["longitude"],
			//"location_phone"	=> $request_data["location_phone"],
			//"location_fax"		=> $request_data["location_fax"],
			"timestamp_update" => $_SERVER['REQUEST_TIME'],
		);
		$this->db->insert_update('locations', $location);
		
		if (isset($request_data['primary'])) {
			$this->db->update('companies',
				array("location_default_ID" => $request_data["location_ID"]),
				array("company_ID" => COMPANY_ID)
			);
		}
		
		return TRUE;
	}
	
	/**
	 * delete a location for a company
	 *
	 * @param int $location_ID Location ID
	 * @return bool
	 *
	 * @url GET {location_ID}
	 * @url DELETE {location_ID}
	 * @access protected
	 */
	function delete($location_ID=NULL) {
		$this->db->delete('locations', array('company_ID' => COMPANY_ID, 'location_ID' => $location_ID));
		return TRUE;
	}

}

?>
