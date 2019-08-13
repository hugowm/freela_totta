

function brokerAlumni(data) 
{
	data = String(data);
	alertDebug("[brokerAlumni] DATA=" + data);
	
	var params = data;
	var command = params;

	if(data.indexOf(',') != -1)
	{				
		params = data.split(",");
		command = params[0];
	}		
	
	if (command == 'tarefa')
	{
		var lessonIdentifier = params[1];
		alumni_openTask(lessonIdentifier, accessURL);
	}
	else if (command == 'relatorio')
	{
		alumni_openReport(accessURL);
	}
	/*
	else if (command == 'pagina')
	{
		var pagePath = params[1];
		var accessURL = '';
		if (params.length >= 3)
			accessURL = params[2];
		alumni_openPage(pagePath, accessURL);
	}
	*/
}

function alumni_openTask(lessonIdentifier, accessURL)
{
	accessURL = getAlumniToolsFolder(accessURL) + 'AGTaskViewer2/auctorLaunch.jsp?scoId='+lessonIdentifier;
	alertDebug("Chamando página do Alumni (tarefa): " + accessURL);
	window.open(accessURL, 'AlumniTask', 'width=640,height=450');
	return true;
}

function getAlumniToolsFolder(accessURL)
{

	if (!accessURL || accessURL=='' || accessURL=='null' || accessURL=='undefined')
	{
	accessURL = '../../../../tools/';
	}
	else
	{
		if (accessURL.charAt(accessURL.length-1) != '/')
			accessURL += '/';
		accessURL += 'tools/';
	}
	return accessURL;
}

function alumni_openReport(accessURL)
{
	accessURL = getAlumniToolsFolder(accessURL) + 'AGReport/reports/userReportRegs.jsp';
	alertDebug("Chamando página do Alumni (relatório): " + accessURL);
	window.open(accessURL, 'AlumniReport', 'width=800,height=550');
	return true;
}

