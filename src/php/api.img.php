<?php


// return cached images
class Img {

	private $extensions = array("png", "jpg", "jpeg", "bmp", "gif");

	// img/user/1/png/100/100/(options: exact, portrait, landscape, auto, crop)
	function get($folder = '', $name = '', $ext = '', $width = 0, $height = 0, $option = 'auto') { // wxh
		//echo "folder = $folder = \"\", name = $name = \"\", ext = $ext = \"\", width = $w = 0, height = $h = 0, crop = $option = 'auto'";
		ini_set('memory_limit', '-1');

		if ($folder && !$name) {	// no folder
			$name = $folder;
			$folder = "";
		}

		// get type from name
		$file = getcwd().'/img/'.$folder.'/'.$name.'.'.$ext;
		$pathinfo = pathinfo($file);
		$file_ext = $pathinfo['extension'];

		if (in_array($file_ext, $this->extensions)) {	// valid image extension
			// convert
			if (!file_exists($file)) {
				$file_no_ext = substr($file,0, count($file)-4);
				foreach ($this->extensions as $ext) {

					// validate
					if (!file_exists($file_no_ext.$ext)) continue; // source file doesn't exist
					else if(!in_array($ext, $this->extensions)) continue; // check valid extensions
echo $file_no_ext.$ext;
					$image = $this->loadImage($file_no_ext.$ext);
					$image = $this->convert($image, $file_no_ext.$ext, $file);
					$this->saveImage($image, $file);
					break;
				}
			}

			// resize
			if (file_exists($file) && ($width || $height)) {
				$new_file = $pathinfo['dirname'].'/'.$option.'-'.$width.'x'.$height.'-'.$pathinfo['basename'];

				if (!file_exists($new_file)) {
					$image = $this->loadImage($file);
					$image = $this->resize($image, $width, $height, $option);
					$this->saveImage($image, $new_file);
				}

				$file = $new_file;
			}
		}

		//echo $file;
		if (file_exists($file)) {
		 	$image = $this->loadImage($file);
		} else {	// no file, load default folder.png
			$image = $this->loadImage(getcwd().'/img/'.$folder.'.png');//.substr($name, count($name)-4));
		}

		// output with headers
		$this->outputImage($image, $file);
	}


	public function convert($image, $from_str, $to_str, $delete_from = FALSE, $replace_to = FALSE) {
		if ($replace_to && file_exists($to_str)) unlink($to_str); // overwrite existing

		// dirname, basename, extension, filename
		$from = pathinfo($from_str);
		$to = pathinfo($to_str);

		list($width, $height) = getimagesize($from_str);
		$image_shell = imagecreatetruecolor($width, $height);
		imagealphablending($image_shell, false);
		imagesavealpha($image_shell, true);
		$white_img = imagecolorallocate($image_shell, 0, 255, 255);
		imagefill($image_shell, 0, 0, $white_img);

		imagecopyresampled($image_shell, $image, 0, 0, 0, 0, $width, $height, $width, $height);
		imagedestroy($image);

		// save type
		/*$permission = $this->saveImage($image_shell, $to_str);
		/*true;
		switch (strtolower($to['extension'])) {
			case "gif":
				if(!imagegif($image_shell, $to_str)) $permission = false; // Upload Permission Denied
				break;
			case "jpg":
				if(!imagejpeg($image_shell, $to_str)) $permission = false; // Upload Permission Denied
				break;
			case "jpeg":
				if(!imagejpeg($image_shell, $to_str)) $permission = false; // Upload Permission Denied
				break;
			case "png":
				if(!imagepng($image_shell, $to_str)) $permission = false; // Upload Permission Denied
				break;
			case "bmp":
				if(!imagebmp($image_shell, $to_str)) $permission = false; // Upload Permission Denied
				break;
		}*/
		//imagedestroy($image_shell);

		if ($delete_from) unlink($from_str); // $permission &&
		return $image_shell;
	}

	public function loadImage($file) {
		$ext = strtolower(substr(strrchr($file, '.'), 1));
		switch ($ext) {
			case "gif":
				$image = imagecreatefromgif($file);
				break;
			case "jpg":
				$image = imagecreatefromjpeg($file);
				break;
			case "jpeg":
				$image = imagecreatefromjpeg($file);
				break;
			case "png":
				$image = imagecreatefrompng($file);
				break;
			case "bmp":
				$image = imagecreatefrombmp($file);
				break;
			default:
				$image = false;
				break;
		}
		return $image;
	}

	public function saveImage(&$image, $file, $quality = 100) {
		$pathinfo = pathinfo($file);
		mkdir_recursive($pathinfo['dirname']);
		$permission = true;
		switch (strtolower(substr(strrchr($file, '.'), 1))) {
			case "gif":
				if(!imagegif($image, $file)) $permission = false; // Upload Permission Denied
				break;
			case "jpg":
			case "jpeg":
				if(!imagejpeg($image, $file, $quality)) $permission = false; // Upload Permission Denied
				break;
			case "png":
				$quality = 9 - round(($quality/100) * 9); // invert - 0 is best, not 9
				if(!imagepng($image, $file, $quality)) $permission = false; // Upload Permission Denied
				break;
			case "bmp":
				if(!imagebmp($image, $file)) $permission = false; // Upload Permission Denied
				break;
			default:
				$permission = false;
				break;
		}
		imagedestroy($image);
		return $permission;
	}

	public function outputImage(&$image, $file) {
		$ext = strtolower(substr(strrchr($file, '.'), 1));
		header("Content-Type: image/$ext");
		switch ($ext) {
			case "gif":
				imagegif($image);
				break;
			case "jpg":
				imagejpeg($image);
				break;
			case "jpeg":
				imagejpeg($image);
				break;
			case "png":
				imagepng($image);
				break;
			case "bmp":
				imagebmp($image);
				break;
		}
		imagedestroy($image);
	}

	// src@ http://net.tutsplus.com/tutorials/php/image-resizing-made-easy-with-php/
	public function resize($image, $newWidth, $newHeight, $option="auto")
	{
		$this->width = imagesx($image);
		$this->height = imagesy($image);

		// *** Get optimal width and height - based on $option
		$optionArray = $this->getDimensions($newWidth, $newHeight, $option);

		$optimalWidth  = $optionArray['optimalWidth'];
		$optimalHeight = $optionArray['optimalHeight'];

		// *** Resample - create image canvas of x, y size
		$this->imageResized = imagecreatetruecolor($optimalWidth, $optimalHeight);
		imagecopyresampled($this->imageResized, $image, 0, 0, 0, 0, $optimalWidth, $optimalHeight, $this->width, $this->height);


		// *** if option is 'crop', then crop too
		if ($option == 'crop') {
			$this->crop($optimalWidth, $optimalHeight, $newWidth, $newHeight);
		}

		$image = $this->imageResized;
	}

	## --------------------------------------------------------

	private function getDimensions($newWidth, $newHeight, $option)
	{

	   switch ($option)
		{
			case 'exact':
				$optimalWidth = $newWidth;
				$optimalHeight= $newHeight;
				break;
			case 'portrait':
				$optimalWidth = $this->getSizeByFixedHeight($newHeight);
				$optimalHeight= $newHeight;
				break;
			case 'landscape':
				$optimalWidth = $newWidth;
				$optimalHeight= $this->getSizeByFixedWidth($newWidth);
				break;
			case 'auto':
				$optionArray = $this->getSizeByAuto($newWidth, $newHeight);
				$optimalWidth = $optionArray['optimalWidth'];
				$optimalHeight = $optionArray['optimalHeight'];
				break;
			case 'crop':
				$optionArray = $this->getOptimalCrop($newWidth, $newHeight);
				$optimalWidth = $optionArray['optimalWidth'];
				$optimalHeight = $optionArray['optimalHeight'];
				break;
		}
		return array('optimalWidth' => $optimalWidth, 'optimalHeight' => $optimalHeight);
	}

	## --------------------------------------------------------

	private function getSizeByFixedHeight($newHeight)
	{
		$ratio = $this->width / $this->height;
		$newWidth = $newHeight * $ratio;
		return $newWidth;
	}

	private function getSizeByFixedWidth($newWidth)
	{
		$ratio = $this->height / $this->width;
		$newHeight = $newWidth * $ratio;
		return $newHeight;
	}

	private function getSizeByAuto($newWidth, $newHeight)
	{
		if ($this->height < $this->width)
		// *** Image to be resized is wider (landscape)
		{
			$optimalWidth = $newWidth;
			$optimalHeight= $this->getSizeByFixedWidth($newWidth);
		}
		elseif ($this->height > $this->width)
		// *** Image to be resized is taller (portrait)
		{
			$optimalWidth = $this->getSizeByFixedHeight($newHeight);
			$optimalHeight= $newHeight;
		}
		else
		// *** Image to be resizerd is a square
		{
			if ($newHeight < $newWidth) {
				$optimalWidth = $newWidth;
				$optimalHeight= $this->getSizeByFixedWidth($newWidth);
			} else if ($newHeight > $newWidth) {
				$optimalWidth = $this->getSizeByFixedHeight($newHeight);
				$optimalHeight= $newHeight;
			} else {
				// *** Sqaure being resized to a square
				$optimalWidth = $newWidth;
				$optimalHeight= $newHeight;
			}
		}

		return array('optimalWidth' => $optimalWidth, 'optimalHeight' => $optimalHeight);
	}

	## --------------------------------------------------------

	private function getOptimalCrop($newWidth, $newHeight)
	{

		$heightRatio = $this->height / $newHeight;
		$widthRatio  = $this->width /  $newWidth;

		if ($heightRatio < $widthRatio) {
			$optimalRatio = $heightRatio;
		} else {
			$optimalRatio = $widthRatio;
		}

		$optimalHeight = $this->height / $optimalRatio;
		$optimalWidth  = $this->width  / $optimalRatio;

		return array('optimalWidth' => $optimalWidth, 'optimalHeight' => $optimalHeight);
	}

	## --------------------------------------------------------

	private function crop($optimalWidth, $optimalHeight, $newWidth, $newHeight)
	{
		// *** Find center - this will be used for the crop
		$cropStartX = ( $optimalWidth / 2) - ( $newWidth /2 );
		$cropStartY = ( $optimalHeight/ 2) - ( $newHeight/2 );

		$crop = $this->imageResized;
		//imagedestroy($this->imageResized);

		// *** Now crop from center to exact requested size
		$this->imageResized = imagecreatetruecolor($newWidth , $newHeight);
		imagecopyresampled($this->imageResized, $crop , 0, 0, $cropStartX, $cropStartY, $newWidth, $newHeight , $newWidth, $newHeight);
	}



}

function imagecreatefrombmp($p_sFile) {
    //    Load the image into a string
    $file    =    fopen($p_sFile,"rb");
    $read    =    fread($file,10);
    while(!feof($file)&&($read<>""))
        $read    .=    fread($file,1024);

    $temp    =    unpack("H*",$read);
    $hex    =    $temp[1];
    $header    =    substr($hex,0,108);

    //    Process the header
    //    Structure: http://www.fastgraph.com/help/bmp_header_format.html
    if (substr($header,0,4)=="424d")
    {
        //    Cut it in parts of 2 bytes
        $header_parts    =    str_split($header,2);

        //    Get the width        4 bytes
        $width            =    hexdec($header_parts[19].$header_parts[18]);

        //    Get the height        4 bytes
        $height            =    hexdec($header_parts[23].$header_parts[22]);

        //    Unset the header params
        unset($header_parts);
    }

    //    Define starting X and Y
    $x                =    0;
    $y                =    1;

    //    Create newimage
    $image            =    imagecreatetruecolor($width,$height);

    //    Grab the body from the image
    $body            =    substr($hex,108);

    //    Calculate if padding at the end-line is needed
    //    Divided by two to keep overview.
    //    1 byte = 2 HEX-chars
    $body_size        =    (strlen($body)/2);
    $header_size    =    ($width*$height);

    //    Use end-line padding? Only when needed
    $usePadding        =    ($body_size>($header_size*3)+4);

    //    Using a for-loop with index-calculation instaid of str_split to avoid large memory consumption
    //    Calculate the next DWORD-position in the body
    for ($i=0;$i<$body_size;$i+=3)
    {
        //    Calculate line-ending and padding
        if ($x>=$width)
        {
            //    If padding needed, ignore image-padding
            //    Shift i to the ending of the current 32-bit-block
            if ($usePadding)
                $i    +=    $width%4;

            //    Reset horizontal position
            $x    =    0;

            //    Raise the height-position (bottom-up)
            $y++;

            //    Reached the image-height? Break the for-loop
            if ($y>$height)
                break;
        }

        //    Calculation of the RGB-pixel (defined as BGR in image-data)
        //    Define $i_pos as absolute position in the body
        $i_pos    =    $i*2;
        $r        =    hexdec($body[$i_pos+4].$body[$i_pos+5]);
        $g        =    hexdec($body[$i_pos+2].$body[$i_pos+3]);
        $b        =    hexdec($body[$i_pos].$body[$i_pos+1]);

        //    Calculate and draw the pixel
        $color    =    imagecolorallocate($image,$r,$g,$b);
        imagesetpixel($image,$x,$height-$y,$color);

        //    Raise the horizontal position
        $x++;
    }

    //    Unset the body / free the memory
    unset($body);

    //    Return image-object
    return $image;
}

function imagebmp ($im, $fn = false) {
    if (!$im) return false;

    if ($fn === false) $fn = 'php://output';
    $f = fopen ($fn, "w");
    if (!$f) return false;

    //Image dimensions
    $biWidth = imagesx ($im);
    $biHeight = imagesy ($im);
    $biBPLine = $biWidth * 3;
    $biStride = ($biBPLine + 3) & ~3;
    $biSizeImage = $biStride * $biHeight;
    $bfOffBits = 54;
    $bfSize = $bfOffBits + $biSizeImage;

    //BITMAPFILEHEADER
    fwrite ($f, 'BM', 2);
    fwrite ($f, pack ('VvvV', $bfSize, 0, 0, $bfOffBits));

    //BITMAPINFO (BITMAPINFOHEADER)
    fwrite ($f, pack ('VVVvvVVVVVV', 40, $biWidth, $biHeight, 1, 24, 0, $biSizeImage, 0, 0, 0, 0));

    $numpad = $biStride - $biBPLine;
    for ($y = $biHeight - 1; $y >= 0; --$y)
    {
        for ($x = 0; $x < $biWidth; ++$x)
        {
            $col = imagecolorat ($im, $x, $y);
            fwrite ($f, pack ('V', $col), 3);
        }
        for ($i = 0; $i < $numpad; ++$i)
            fwrite ($f, pack ('C', 0));
    }
    fclose ($f);
    return true;
}

?>