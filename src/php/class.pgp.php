<?php

require_once "class.curl.php";

class PGP {
	
	function encryptString($pubkey, $str) {
		putenv("GNUPGHOME=/var/www/.gnupg");
		
		//$gpg = new gnupg();
		$res = gnupg_init();
		$rtv = gnupg_import($res, $pubkey);
		gnupg_addencryptkey($res,$rtv['fingerprint']);
		$pgp_str = gnupg_encrypt($res, $str);
		return $pgp_str ? $pgp_str : $str;
	}
	
	// to do
	function getPublicKeyFromServer($server, $email) {
		/* refactor to 
		$command = "gpg --keyserver ".escapeshellarg($server)." --search-keys ".escapeshellarg($email)."";
		echo "$command\n\n";
		
		//execute the gnupg command
		exec($command, $result);
		*/
		
		$curl = new curl;
		
		// get Fingerprint
		$data = $curl->get("http://".$server.":11371/pks/lookup?search=".urlencode($email)."&op=index&fingerprint=on&exact=on");
		$data = $data['FILE'];
		
		preg_match_all("/<pre>([\s\S]*?)<\/pre>/", $data, $matches);
		//$pub = $matches[1][1];
		
		preg_match_all("/<a href=\"(.*?)\">(\w*)<\/a>/", $matches[1][1], $matches);
		$url = $matches[1][0];
		$keyID = $matches[2][0];
		
		// get Public Key
		$data = $curl->get("http://".$server.":11371".$url);
		$data = $data['FILE'];
		
		preg_match_all("/<pre>([\s\S]*?)<\/pre>/", $data, $matches);
		$pub_key = trim($matches[1][0]);
		
		return array(
			"keyID" => $keyID,
			"public_key" => $pub_key
		);
	}
	
	// PGP encrypt message
	// import key - http://www.centos.org/docs/4/html/rhel-sbs-en-4/s1-gnupg-import.html - gpg --import public.key
	// rename key user_ID
	
	/*function encrypt($pubkey, $recipient, $email, $subject, $message) {
		// http://www.pantz.org/software/php/pgpemailwithphp.html
		$dir = "files/pgp";
		
		//Tell gnupg where the key ring is. Home dir of user web server is running as.
		putenv("GNUPGHOME=/var/www/.gnupg");
		
		// make temp key
		//$tempkey = tempnam("files/pgp", "newkey-");
		$tempkey = "newkey-".md5(time().rand());
		
		$fp = fopen($dir.'/'.$tempkey, "w");
		fwrite($fp, $pubkey);
		fclose($fp);
		
		system("gpg --import $dir/$tempkey && ", $result);
		unlink($dir.'/'.$tempkey);
		
		//create a unique file name
		//$infile = tempnam("/tmp", "message-");
		$infile = "message-".md5(time().rand());
		$outfile = $infile.".asc";
		
		//write form variables to email
		$fp = fopen($dir.'/'.$infile, "w");
		fwrite($fp, $message);
		fclose($fp);
		
		//set up the gnupg command. Note: Remember to put E-mail address on the gpg keyring. --pgp2 --pgp6 --pgp7 
		//$command = "gpg --no-default-keyring --keyring $tempkey --armor --local-user '' --recipient 'willfarrell <will.farrell@gmail.com>' --output $outfile --trust-model always --verbose --encrypt $infile";
		$command = "gpg --armor --recipient '$recipient <$email>' --armor --output $dir/$outfile --yes --always-trust --verbose --encrypt $dir/$infile";
		echo "$command\n\n";
		
		//execute the gnupg command
		exec($command, $result);
		var_dump($result);
		//delete the unencrypted temp file
		//unlink($dir.'/'.$infile);
		
		if (file_exists($dir.'/'.$outfile)) {
			$fp = fopen($dir.'/'.$outfile, "r");
			
			if($fp && filesize($dir.'/'.$outfile) != 0) {
				//read the encrypted file
				$pgp_message = fread ($fp, filesize ($dir.'/'.$outfile));
				//delete the encrypted file
				unlink($dir.'/'.$outfile);
			
				//send the email
				$this->send($email, $subject, $pgp_message);
			}
		} else {
			return $message;
		}
		
	}*/

}

?>