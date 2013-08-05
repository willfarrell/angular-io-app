<?php

/*
Actions as groups
login, forgot

See inc.filter.table.php for generated table groups
that will cover data type limits

don't use table_

*/
$filter_input = array(
	//-- Actions --//
    'email' => array(
		array(
	    	'field'   => 'email',
	        'label'   => 'Email',
	        'rules'   => 'trim|valid_email|valid_email_dns'
	    ),
    ),
    'users' => array(
		array(
	    	'field'   => 'user_ID',
	        'label'   => 'User ID',
	        'rules'   => 'is_natural_no_zero'
	    ),
	    array(
	        'field'   => 'company_ID',
	        'label'   => 'Company ID',
	        'rules'   => 'is_natural_no_zero'
	    ),
	    array(
	        'field'   => 'user_level',
	        'label'   => 'Level',
	        'rules'   => 'is_natural'
	    ),
	    array(
	        'field'   => 'user_email',
	        'label'   => 'User Email',
	        'rules'   => 'valid_email|valid_email_dns',//|is_unique[users.user_email]' use when creating
	    ),
	    array(
	        'field'   => 'user_username',
	        'label'   => 'Name',
	        'rules'   => 'trim|strip_tags[]'
	    ),
	    array(
	        'field'   => 'user_name_first',
	        'label'   => 'First Name',
	        'rules'   => 'trim|strip_tags[]'
	    ),
	    array(
	        'field'   => 'user_name_last',
	        'label'   => 'Last Name',
	        'rules'   => 'trim|strip_tags[]'
	    ),
	    /*array(
	        'field'   => 'user_phone',
	        'label'   => 'Phone',
	        'rules'   => 'valid_phone'
	    ),*/
	    /*array(
	        'field'   => 'user_cell',
	        'label'   => 'Cell',
	        'rules'   => 'valid_phone'
	    ),

	    array(
	        'field'   => 'user_fax',
	        'label'   => 'Fax',
	        'rules'   => 'valid_phone'
	    ),
	    array(
	        'field'   => 'user_function',
	        'label'   => 'Function',
	        'rules'   => ''
	    ),*/
	    array(
	        'field'   => 'user_details',
	        'label'   => 'User Details',
	        'rules'   => 'trim|strip_tags[]',
	    ),

	    array(
	        'field'   => 'password',
	        'label'   => 'Password',
	        'rules'   => 'min_length[10]'
	    ),
	    /*array(
	        'field'   => 'password_timestamp',
	        'label'   => 'Password Timestamp',
	        'rules'   => 'integer'
	    ),*/
	    /*array(
	        'field'   => 'referral_user_ID',
	        'label'   => 'Referral User ID',
	        'rules'   => 'is_natural'
	    ),*/
	    /*array(
	        'field'   => 'timestamp_create',
	        'label'   => 'Create Timestamp',
	        'rules'   => 'integer'
	    ),
	    array(
	        'field'   => 'timestamp_confirm',
	        'label'   => 'Confirm Timestamp',
	        'rules'   => 'integer'
	    ),
	    array(
	        'field'   => 'timestamp_update',
	        'label'   => 'Update Timestamp',
	        'rules'   => 'integer'
	    ),
	    array(
	        'field'   => 'timestamp_delete',
	        'label'   => 'Delete Timestamp',
	        'rules'   => 'integer'
	    ),*/

	    // not in table, but needed for confirms
	    array(
	        'field'   => 'user_email_confirm',
	        'label'   => 'User Email Confirm',
	        'rules'   => 'matches[user_email]',
	    ),
	    array(
	        'field'   => 'password_confirm',
	        'label'   => 'Password Confirm',
	        'rules'   => 'matches[password]',
	    ),
    ),

    'company' => array(
		array(
	        'field'   => 'company_ID',
	        'label'   => 'Company ID',
	        'rules'   => 'is_natural_no_zero'
	    ),
	    array(
	        'field'   => 'company_name',
	        'label'   => 'Company Name',
	        'rules'   => 'trim|strip_tags[]'
	    ),
	    array(
	        'field'   => 'company_url',
	        'label'   => 'URL',
	        'rules'   => 'valid_url'
	    ),
	    /*array(
	        'field'   => 'company_phone',
	        'label'   => 'Company Phone Number',
	        'rules'   => 'valid_phone'
	    ),*/
	    array(
	        'field'   => 'company_details',
	        'label'   => 'Company Details',
	        'rules'   => 'trim|strip_tags[]',
	    ),
	    array(
	        'field'   => 'location_default_ID',
	        'label'   => 'Default Location ID',
	        'rules'   => 'is_natural'
	    ),
	    /*array(
	        'field'   => 'timestamp_create',
	        'label'   => 'Create Timestamp',
	        'rules'   => 'integer'
	    ),
	    array(
	        'field'   => 'timestamp_confirm',
	        'label'   => 'Confirm Timestamp',
	        'rules'   => 'integer'
	    ),
	    array(
	        'field'   => 'timestamp_update',
	        'label'   => 'Update Timestamp',
	        'rules'   => 'integer'
	    ),
	    array(
	        'field'   => 'timestamp_delete',
	        'label'   => 'Delete Timestamp',
	        'rules'   => 'integer'
	    ),*/
    ),
    
    //-- Locations --//
    'locations' => array(
    	array(
	    	'field'   => 'location_name',
	        'label'   => 'Location Name',
	        'rules'   => 'trim|strip_tags[]'
	    ),
    ),

    //!-- Add-ons --//
    //-- Contact --//
    'contact' => array(
		array(
	    	'field'   => 'email',
	        'label'   => 'Email',
	        'rules'   => 'trim|valid_email|valid_email_dns'
	    ),
	    array(
	    	'field'   => 'message',
	        'label'   => 'Message',
	        'rules'   => 'trim|strip_tags[]'
	    ),
    ),
    
    //-- Follow --//
    'follow_user' => array(
		array(
	    	'field'   => 'user_ID',
	        'label'   => 'User ID',
	        'rules'   => 'is_natural_no_zero'
	    ),
	    array(
	    	'field'   => 'follow_ID',
	        'label'   => 'Follow User ID',
	        'rules'   => 'is_natural_no_zero'
	    ),
	    array(
	    	'field'   => 'group_ID',
	        'label'   => 'Group ID',
	        'rules'   => 'is_natural'
	    ),
	    array(
	        'field'   => 'timestamp',
	        'label'   => 'Timestamp',
	        'rules'   => 'integer'
	    ),
    ),

    'follow_user_groups' => array(
		array(
	    	'field'   => 'group_ID',
	        'label'   => 'Group ID',
	        'rules'   => 'is_natural'
	    ),
	    array(
	        'field'   => 'group_name',
	        'label'   => 'Group Name',
	        'rules'   => 'trim|strip_tags[]'
	    ),
	    array(
	    	'field'   => 'group_count',
	        'label'   => 'Group Count',
	        'rules'   => 'is_natural'
	    ),
	    array(
	    	'field'   => 'user_ID',
	        'label'   => 'User ID',
	        'rules'   => 'is_natural_no_zero'
	    ),
	    array(
	        'field'   => 'color',
	        'label'   => 'Color',
	        'rules'   => 'trim|strip_tags[]|min_length[6]'
	    ),
    ),

);

?>
