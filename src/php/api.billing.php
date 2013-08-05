<?php

/**
 * Billing using Stripe
 * https://stripe.com/docs/tutorials/subscriptions
 *
 * All methods in this class are protected
 * @access protected
 */

require_once 'vendor/stripe/stripe-php/lib/Stripe.php';

class Billing extends Core {

	function __construct() {
		parent::__construct();
		Stripe::setApiKey(STRIPE_API_SECRET_KEY);
		
		// https://stripe.com/docs/api/php#plans
		/*Stripe_Plan::create(array(
			"id" => "gold",
			"name" => "Amazing Gold Plan",
			"interval" => "month",
			"amount" => 2000,
			"currency" => "cad",
		));*/
	}

	function __destruct() {
		
		parent::__destruct();
	}
	
	function post_customer($request_data) {
		
		// permission
		/*if(!$this->permission->check($request_data)) {
			return $this->permission->errorMessage();
		};*/
		
		/*// validation
		$this->filter->set_request_data($request_data);
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors('error');
			return $return;
		}
		$request_data = $this->filter->get_request_data();*/
		$request_data = $this->filter->run($request_data);
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		$c = Stripe_Customer::create(array(
			"card" => $request_data['stripeToken'],
			"email" => USER_EMAIL,
			//"plan" => "gold",
		));
		
		$this->db->insert_update('customers', array());
		
	}
	
	function put_charge($request_data) {
		
		// permission
		/*if(!$this->permission->check($request_data)) {
			return $this->permission->errorMessage();
		};*/
		
		/*// validation
		$this->filter->set_request_data($request_data);
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors('error');
			return $return;
		}
		$request_data = $this->filter->get_request_data();*/
		$request_data = $this->filter->run($request_data);
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		$result = $this->db->select('customers', array('user_ID' => USER_ID));
		if (!$result) { return array('errors' => array('strip-customer' => 'No customer ID')); }
		$customer = $this->db->fetch_assoc($result);
		
		$c = Stripe_Customer::retrieve($customer['stripeTokens']);
		$c->updateSubscription(array(
			"plan" => "basic",
			"prorate" => true
		));
		
		$charge = Stripe_Charge::create(array(
			'customer' => $customer['stripeToken'],
			'amount'   => 5000,
			'currency' => 'cad'
		));
	}
	
	function put_subscribe($request_data) {
		
		// permission
		/*if(!$this->permission->check($request_data)) {
			return $this->permission->errorMessage();
		};*/
		
		/*// validation
		$this->filter->set_request_data($request_data);
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors('error');
			return $return;
		}
		$request_data = $this->filter->get_request_data();*/
		$request_data = $this->filter->run($request_data);
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		$result = $this->db->select('customers', array('user_ID' => USER_ID));
		if (!$result) { return array('errors' => array('strip-customer' => 'No customer ID')); }
		$customer = $this->db->fetch_assoc($result);
		
		$c = Stripe_Customer::retrieve($customer['stripeTokens']);
		$c->updateSubscription(array(
			"plan" => $request_data['plan_ID'],
			"prorate" => true
		));
	}
	
	function delete_subscribe($plan_ID) {
		// permission
		/*if(!$this->permission->check(array("plan_ID" => $plan_ID))) {
			return $this->permission->errorMessage();
		};*/
		
		/*// validation
		$this->filter->set_request_data($request_data);
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors('error');
			return $return;
		}
		$request_data = $this->filter->get_request_data();*/
		$request_data = $this->filter->run(array("plan_ID" => $plan_ID));
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		$result = $this->db->select('customers', array('user_ID' => USER_ID));
		if (!$result) { return array('errors' => array('strip-customer' => 'No customer ID')); }
		$customer = $this->db->fetch_assoc($result);
		
		$c = Stripe_Customer::retrieve($customer['stripeTokens']);
		$cu->cancelSubscription();

	}
}
	
?>