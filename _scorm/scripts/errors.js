var showConnectionErrorAlert = false;
var lmsType = 'none';
var myApi = null;
var wLog = null;
var connectionErrorMessages = 'Mensagens de erro:<br>';

var SCORM_ERROR_NONE = '0';
var SCORM_ERROR_GENERAL = '101';
var SCORM_ERROR_INVALID_ARGUMENT = '201';
var SCORM_ERROR_CANNOT_HAVE_CHILDREN = '202';
var SCORM_ERROR_NOT_AN_ARRAY = '203';
var SCORM_ERROR_NOT_INITIALIZED = '301';
var SCORM_ERROR_NOT_IMPLEMENTED = '401';
var SCORM_ERROR_IS_KEYWORD = '402';
var SCORM_ERROR_IS_READ_ONLY = '403';
var SCORM_ERROR_IS_WRITE_ONLY = '404';
var SCORM_ERROR_INCORRECT_TYPE = '405';

var ERROR_NONE = SCORM_ERROR_NONE; // 0
var ERROR_GENERAL = SCORM_ERROR_GENERAL; // 101
var ERROR_COMMUNICATION = '102';
var ERROR_TIMEOUT = '103';
var ERROR_INVALID_FORMAT = SCORM_ERROR_INVALID_ARGUMENT; //201
var ERROR_NOT_IMPLEMENTED = SCORM_ERROR_NOT_IMPLEMENTED; // 401


onAICCOk = function(aiccData)
{
	lmsType = 'AICC';
	alertDebug('[communication.js:onAICCOk] Comunica&ccedil;&atilde;o obtida via AICC.');
	// Envia os dados do servidor para serem interpretados e adicionados ao cache local.
	loadAPI(aiccData);
}

onAICCError = function(errorCode, errorMessage)
{
	connectionErrorMessages += '('+errorCode+') '+errorMessage+'<br>';
	
	if (errorCode == ERROR_NOT_IMPLEMENTED)
		alertDebug('[communication.js:onAICCError] Aviso: '+errorMessage);
	else	
		alertDebug('[communication.js:onAICCError] Houve erro ao conectar via AICC. ('+errorCode+') '+errorMessage);

	var ok = true;
	if (showConnectionErrorAlert)
		ok = confirm('N&atilde;o foi poss&iacute;vel estabelecer comunica&ccedil;&atilde;o com o ambiente de estudos.\n\nN&atilde;o ser&aacute; poss&iacute;vel salvar seus dados. Se voc&ecirc; desejar continuar assim mesmo, clique em "OK".\n\nDeseja continuar sem salvar seus dados?');
		
	if (ok)
	{
		if (showConnectionErrorAlert)
		{
			alert('Aten&ccedil;&atilde;o: lembre-se que seus dados n&atilde;o ser&atilde;o salvos para esta li&ccedil;&atilde;o.\n&Eacute; recomendado que voc&ecirc; refa&ccedil;a ela mais tarde, quando o problema de conex&atilde;o tiver sido resolvido.');
			alertDebug('[communication.js:onAICCError] O usu&aacute;rio permitiu continuar sem salvar os dados.');
		}

		loadAPI();

	}
	else
	{
		if (showConnectionErrorAlert)
			alertDebug('[communication.js:onAICCError] O usu&aacute;rio n&atilde;o desejou continuar sem salvar os dados.');
		else
			alertDebug('[communication.js:onAICCError] Bloqueando acesso ao conte&uacute;do.');
		alertDebug('============ Bloco de setup conclu&iacute;do (bloqueado) =======================');
		document.body.innerHTML = '<font color=white>N&atilde;o foi poss&iacute;vel obter comunica&ccedil;&atilde;o com o ambiente de estudos.<br>O conte&uacute;do n&atilde;o pode ser acesso neste momento<br>.Por favor, tente novamente mais tarde.<br><br><br>'+connectionErrorMessages+'</font>';
//		document.getElementById('fStep'). = '<font color=white>N&atilde;o foi poss&iacute;vel obter comunica&ccedil;&atilde;o com o ambiente de estudos.<br>O conte&uacute;do n&atilde;o pode ser acesso neste momento<br>.Por favor, tente novamente mais tarde.<br><br><br>Mensagem de erro: ('+errorCode+') '+errorMessage+'.</font>';
	}
}


