<?php
if( isset($_REQUEST['type']) && $_REQUEST['type'] == 'xml' )
{
	header('Content-type: application/xml');
}

$handle = fopen($_REQUEST['url'], "r");

if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}
?>
