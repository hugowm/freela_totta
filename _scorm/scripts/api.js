

//############# CONFIGURACOES #################
var showLog = false;
var configCommunicationType = "scorm"; //valores aceitos: alumni ou scorm 
var accessURL = ""; //http://ENDERECO.CLIENTE.ALUMNI.COM.BR
//############# FIM CONFIGURACOES #################
var API = null; //SCORM API

var isLoadedInitAPI = false;

onload = function()
{
	setTimeout('initAPI();', 200);
}

//init the SCORM API  -- CHAMADA DE DENTRO DO NAVEGADOR FLASH
function initAPI()
{
    if(!isLoadedInitAPI)
    {
	isLoadedInitAPI = true;
	var msg = "";
	alertDebug('[api.js][onload] API esperada: ' + configCommunicationType);

	switch (configCommunicationType)
	{
	        case "alumni":
			alertDebug('[api.js][onload] Creating API adapter for AICC...');
			window.API = null;			
			var p = getRequestParameter("AICC_URL");			
			if (p!=null && p!="" && p!="null")
			{
			   alertDebug('[api.js][onload] AICC_URL = '+p);
			   p = getRequestParameter("AICC_SID");
			   if (p!=null && p!="" && p!="null")
			   {
			      alertDebug('[api.js][onload] AICC_SID = '+p); 

			      alertDebug('[api.js][onload] Chamando connectViaAICC...');
			      connectViaAICC();

			      window.API = new AICC_API(); // cria uma API que adapta para AICC			      
                           }
                           else
                               msg = "Parameter AICC_SID not found!"
			}
			else
			    msg = "Parameter AICC_URL not found!"
			if (!window.API)
				alertDebug(msg);				
			break;
	        case "scorm":
			alertDebug('[api.js][onload] Getting SCORM API...');

			//look for the SCORM API up in the frameset
			findAPI(window);

			//if we still have not found the API, look at the opener and its frameset 
			if ((window.API == null) && (window.opener != null))
			{
				findAPI(window.opener);
			}

			break;
	}	
	
	loadAPI('');
    }
}

function loadAPI(data)
{
	if (window.API) // só carrega o conteúdo se tiver a API
	{
	   if(configCommunicationType == 'alumni' && data != '')
	   {
	      // Envia os dados do servidor para serem interpretados e adicionados ao cache local.
	      AICC_ResponseReceived(data);
	   }

	   alertDebug('[api.js][initAPI] Chamando LMSInitialize...');
	   window.API.LMSInitialize("");
	}
	else
		alertDebug('[api.js][initAPI] SCORM API not found!!');
}


//look up through the frameset hierarchy for the SCORM API 
function findAPI(win)
{
	while ((win.API == null) && (win.parent != null) && (win.parent != win))
	{
		win = win.parent; 
	}
	window.API = win.API;
}


//######################### RECURSOS PARA COMUNICACAO SCORM OU AICC COM O NAVEGADOR #############################//
var onUnload = false;
var lmsFinishAPI = false;

function setData(dataElement, value)
{
	//alertDebug('[api.js][setData] '+ dataElement + ' = ' + value);		
	window.API.LMSSetValue(dataElement, value);
}

function getData(dataElement)
{		
	//alertDebug('[api.js][getData] '+ dataElement);	
	return window.API.LMSGetValue(dataElement);
}

function commit()
{
	//Recurso chamado com uma nova function, devido ao fato da chamada callback não funcionar.
	//console.log("commit - vai chamar forceCommit");	
	setTimeout("forceCommit()", 400);		
}	

function forceCommit()
{
	//console.log("forceCommit");
	window.API.LMSCommit("");
}

function unLoadCourse()
{
	//console.log("entrou unLoadCourse");
	if(!onUnload)
	{
		//console.log("UnLoadCourse no if");
		document.getElementById("main").closeContent();
		onUnload = true;
	}
	else
	{
		//console.log("UnLoadCourse no else - chamando o LMSFinish");
		window.API.LMSFinish ("");
	}
}

function beforeUnLoadCourse()
{
	//console.log("entrou beforeUnLoadCourse");
	if(!onUnload)
	{
		//console.log("entrou beforeUnLoadCourse no if");
		document.getElementById("main").closeContent();
		onUnload = true;
	}
}

function main_DoFSCommand(command, args) //NAVEGADOR FLASH CHAMA AO SAIR DO CURSO
{
	if(command == "close" || command == "quit" && !onUnload)
	{
		//console.log("main_DoFSCommand!");
		setTimeout('window.top.close();', 1000);
	}
}
//######################### RECURSOS PARA COMUNICACAO SCORM OU AICC #############################

