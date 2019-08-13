//######################### RECURSOS UTILITARIOS ############################

function alertDebug(msg)
{		
	if(showLog)
	{
		if(console)
			//console.log('['+getTimestamp()+']' + msg);
		else
			alert('['+getTimestamp()+']' + msg);
	}
}

function getTimestamp()
{
	var d = new Date();
	var hor = d.getHours();
	var min = d.getMinutes();
	var seg = d.getSeconds();
	if (hor < 10)
		hor = "0" + hor;
	if (min < 10)
		min = "0" + min;
	if (seg < 10)
		seg = "0" + seg;
	var ds = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+hor+':'+min+':'+seg;
	return ds;
}
//######################### RECURSOS UTILITARIOS ############################
