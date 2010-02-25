<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8">
		<title>jBuzz jQuery Plugin by Tmeister</title>
		<link rel="stylesheet" href="jBuzz/jBuzz.min.css" type="text/css" media="screen" title="jBuzz" charset="utf-8">
		<style type="text/css" media="screen">
			#jBuzz
			{
				width: 250px;
			}
		</style>
		<script type="text/javascript" charset="utf-8" src="jquery-1.4.1.min.js" ></script>
		<script type="text/javascript" charset="utf-8" src="jBuzz/jquery.jBuzz.min.js" ></script>
		<script type="text/javascript" charset="utf-8">
			$(document).ready(function() 
			{
				$('#jBuzz').jBuzz({user:"tmeister"});
			});
		</script>
		
	</head>
	<body id="index">
		<div id="jBuzz"></div>
	</body>
</html>