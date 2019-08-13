var waitCount = 0;
var WAIT_MAX_COUNT = 60; // tenta 60 vezes
var WAIT_RETRY_DELAY = 500; // uma vez a cada meio segundo
var lastCommand = '';

// habilta a comunicação via AJAX.
var useAJAXforAICC = true;
var ajaxShowSaveAlert = false;
var eol = '\r\n';

function AICC_API()
{
	this.LMSInitialize = function(par)
	{
		// AICC não possui um equivalente ao LMSInitialize.
		alertDebug('[aicc.js][AICC_API] [LMSInitialize] Método vazio (AICC não possui equivalente).');
		return "true";
	}
	
	this.LMSFinish = function(par)
	{
		// Avisa o servidor que terminou a lição (o Alumni só grava de fato as informações quando recebe esse comando).
		alertDebug('[aicc.js][AICC_API] [LMSFinish] Chama AICC_SendCommand("ExitAU"). Envia dados do cache local para o servidor.');
		AICC_SendCommand("ExitAU");
		return "true";
	}
	
	this.LMSCommit = function(name)
	{
		// Envia o comando de gravação de dados para o servidor.
		alertDebug('[aicc.js][AICC_API] [LMSCommit] Chama AICC_SendCommand("PutParam"). Envia dados do cache local para o servidor.');
		AICC_SendCommand("PutParam");
		return "true";
	}
	
	this.LMSSetValue = function(name, value)
	{
		name = name.trim();
		value = new String(value);
		value = value.trim();
		switch (name)
		{
			case "cmi.core.lesson_location":
				apiCache.location = value;
				break;
			case "cmi.core.lesson_status":
				apiCache.status = value;
				break;
			case "cmi.core.score.raw":
				apiCache.score = value;
				break;
			case "cmi.core.exit":
				apiCache.exit = value;
				break;
			case "cmi.core.session_time" :
				apiCache.session_time = value;
				break;
			case "cmi.suspend_data":
				apiCache.suspend_data = value;
				break;
		}
		alertDebug('[aicc.js][AICC_API] [LMSSetValue] '+name+' = "'+value+'"');
		return "true";
	}
	
	this.LMSGetValue = function(name)
	{
		name = name.trim();
		var result = "";
		switch (name)
		{
		case "cmi.core.student_id":
			result = apiCache.username;
			break;
		case "cmi.core.student_name":
			result = apiCache.full_name;
			break;
		case "cmi.core.lesson_location":
			result = apiCache.location;
			break;
		case "cmi.core.lesson_status":
			result = apiCache.status;
			break;
		case "cmi.core.score.raw":
			result = apiCache.score;
			break;
		case "cmi.core.total_time":
			result = apiCache.total_time;
			break;
		case "cmi.core.credit":
			result = apiCache.credit;
			break;
		case "cmi.core.lesson_mode":
			result = apiCache.mode;
			break;
		case "cmi.student_data.mastery_score":
			result = apiCache.mastery_score;
			break;
		case "cmi.suspend_data":
			result = apiCache.suspend_data;
			break;
		}
		result = new String(result);
		result = result.trim();
		alertDebug('[aicc.js][AICC_API] [LMSGetValue] '+name+' = "'+result+'"');
		return result;
	}
}

/*== COMUNICAÇÃO COM O SERVIDOR AICC ==========================================================*/

function connectViaAICC()
{
	alertDebug('[aicc.js][connectViaAICC]');

	var aiccUrl = getAICC_URL();
	
	if (aiccUrl.trim() == '')
	{
		onAICCError(ERROR_NOT_IMPLEMENTED, 'Não há suporte a AICC. Parâmetro AICC_URL não informado pelo LMS.');
	}
	else
	{
		alertDebug('[aicc.js][connectViaAICC] Parâmetro AICC_URL detectado = "'+aiccUrl+'".');
		var aicc_data = '[core]' + eol +
						'lesson_location=' + eol +
						'lesson_status=' + eol +
						'score=' + eol +
						'time=' + eol +
						'[core_lesson]';
		alertDebug('[aicc.js][connectViaAICC] Verificando comunicação com o servidor usando AJAX (enviando GetParam).\n'+aicc_data+'\n________________________');
		try
		{
			new Ajax.Request(aiccUrl,
			{
				method: 'post',
				parameters: {
					command:	'GetParam',
					session_id:	getRequestParameter('AICC_SID'),
					version:	'3.5',
					AICC_Data:	aicc_data
				},
				onSuccess: function(transport){
					var resp = transport.responseText.replace('<body>', '').replace('</body>', '').replace(/^\s+|\s+$/g, '');
					var ec = new String(AICC_GetValue("error", resp));
					var em = AICC_GetValue("error_text", resp);
					if (ec == null)
					{
						onAICCError(ERROR_INVALID_FORMAT, 'Resposta do servidor em formato inválido. Não possui código do erro.');
					}
					else if (ec != '0')
					{
						onAICCError(ec, em);
					}
					else
					{
						alertDebug('[aicc.js][connectViaAICC] Recebido do servidor:\n' + resp + '\n______________________________________');
						onAICCOk(resp);
					}
				},
				onFailure: function(){
					onAICCError(ERROR_COMMUNICATION, 'Erro na comunicação AJAX. Nenhum retorno obtido.');
				},
				onException: function(obj, ex)
				{
					onAICCError(ERROR_GENERAL, 'AJAX: '+ex.message+' ("'+aiccUrl+'").');
				}
			});
		}
		catch(e)
		{
			onAICCError(ERROR_GENERAL, 'AJAX: '+e.message+'.');
		}
	}	
}

function AICC_SendCommand(cmd)
{
	if (configCommunicationType == 'alumni')
	{
		lastCommand = cmd;
		if (useAJAXforAICC)
		{
			AICC_SendCommand_AJAX(cmd);
		}
		else
		{
			alert('Apenas comunicação AICC com AJAX é suportada nesta versão. "useAJAXforAICC" deve ser "true".');
			//AICC_SendCommand_FORM(cmd);
		}
	}
	else
	{
		alertDebug('[aicc.js][AICC_SendCommand] Modo offline (AICC não detectado). Ignorando comando ' + cmd + '.');
	}
}

function onAICC_SendCommandError(errorCode, errorMessage)
{
	var msgConfirm = 'Houve um erro de comunicação com o ambiente de estudos.\nSeus dados não foram salvos.\n\nDeseja tentar novamente?\n(Se clicar em cancelar seus dados serão perdidos.)';
	var msgAlert = 'Seus dados não foram salvos.';
	if (lastCommand == 'GetParam')
	{
		msgConfirm = 'Houve um erro de comunicação com o ambiente de estudos.\nNão foi possível ler os dados.\n\nDeseja tentar novamente?';
		msgAlert = 'Por favor, tente novamente mais tarde.';
	}
	
	if (confirm(msgConfirm))
	{
		// Se o usuário decidir tentar novamente, ele será avisado de que funcionou.
		ajaxShowSaveAlert = true;
		AICC_SendCommand(lastCommand);
	}
	else
	{
		alert(msgAlert);
		showWaitMessage(false);
	}
}

function AICC_SendCommand_AJAX(cmd)
{
	showWaitMessage(true);

	var aicc_data = '[core]' + eol +
					'lesson_location=' + apiCache.location + eol +
					'lesson_status=' + apiCache.status + eol +
					'score=' + apiCache.score + eol +
					'time=00:00' + eol +
					'[core_lesson]' + apiCache.suspend_data;

	alertDebug('[aicc.js][AICC_SendCommand_AJAX] ('+cmd+')] Comunicando via AJAX.\nAICC_URL='+getAICC_URL()+'\nCOMMAND='+cmd+'\nAICC_SID='+getRequestParameter('AICC_SID')+'\n'+aicc_data+'\n________________________');
	
	new Ajax.Request(getAICC_URL(),
	{
		method: 'post',
		parameters: {
			command:	cmd,
			session_id:	getRequestParameter('AICC_SID'),
			version:	'3.5',
			AICC_Data:	aicc_data
		},
		onSuccess: function(transport){
			showWaitMessage(false);
			var resp = transport.responseText;
			resp = resp.replace('<body>', '').replace('</body>', '').replace(/^\s+|\s+$/g,"");
			alertDebug('[aicc.js][AICC_SendCommand_AJAX] ('+cmd+')] Dados recebidos do servidor.\n'+resp+'\n________________________');
			AICC_ResponseReceived(resp);
		},
		onFailure: function(){
			onAICC_SendCommandError(ERROR_COMMUNICATION, 'Erro na comunicação AJAX. Nenhum retorno obtido.')
		},
		onException: function(obj, ex){
			onAICC_SendCommandError(ERROR_GENERAL, 'AJAX: '+ex.message+'.')
		}
	});
}
/*
function AICC_SendCommand_FORM(cmd)
{
	alertDebug('[aicc.js:AICC_SendCommand_FORM('+cmd+')] Comunicando via formulário com "'+getAICC_URL()+'".');
	var fRequest = document.getElementById('frameRequest');
	if (fRequest!=null && fRequest.contentWindow!=null)
			fRequest = fRequest.contentWindow;
	if (fRequest != null)
	{
		var fResponse = document.getElementById('frameResponse');
		if (fResponse!=null && fResponse.contentWindow!=null)
			fResponse = fResponse.contentWindow;
		if (fResponse != null)
		{
			try
			{
				fResponse.document.write("<div id='wait'>wait</div>");
				fRequest.document.body.innerHTML = "<form name='form1' target='fResponse' action='"+getAICC_URL()+"' method='POST' content-type='application/x-www-form-urlenconded'>"+

				"<input name='command' type='text' value='"+cmd+"'>"+
				"<input name='session_id' type='text' value='"+getRequestParameter("AICC_SID")+"'>"+
				"<input name='version' type='text' value='3.5'>"+
				"<textarea name='AICC_Data' type='text'>"+
				"[core]\n"+
				"lesson_location="+apiCache.location+"\n"+
				"lesson_status="+apiCache.status+"\n"+
				"score="+apiCache.score+"\n"+
				"time="+apiCache.session_time+"\n"+
				"[core_lesson]"+ // não pode ter um \n depois deste para funcionar no Dtcom
				apiCache.suspend_data+
				"</textarea>"+
				"<input type='submit'>"+
				"<input disabled name='aicc_url' type='text' value='"+getAICC_URL()+"'>"+
				"<input disabled name='aicc_sid' type='text' value='"+getRequestParameter("AICC_SID")+"'>"+
				"</form>";
				fRequest.document.form1.submit();
				waitCount = 0;
				setTimeout("AICC_WaitServerResponse();", 10);
			}
			catch(er)
			{
				AICC_ResponseReceived("error=100\nerror_text=Exceção ao acessar frames. ("+er.message+")."); //  gera um retorno de erro
			}
		}
		else
		{
			AICC_ResponseReceived("error=100\nerror_text=Frame frameResponse não encontrado na página."); //  gera um retorno de erro
		}
	}
	else
	{
		AICC_ResponseReceived("error=100\nerror_text=Frame frameRequest não encontrado na página."); //  gera um retorno de erro
	}
}

function AICC_WaitServerResponse()
{
	if (++waitCount > WAIT_MAX_COUNT)
	{
		AICC_ResponseReceived("error=100\nerror_text=Tempo esgotado aguardando retorno do servidor."); //  gera um retorno de erro
	}
	else
	{
		try
		{
			var e = fResponse.document.getElementById('wait');
			var b = fResponse.document.body;
			if (!e && b)
			{
				var textData = fResponse.document.documentElement.textContent;
				if (!textData)
				{
					textData = fResponse.document.body.innerText;
				}
				textData += "\n";
				AICC_ResponseReceived(textData);
			}
			else
			{
				setTimeout("AICC_WaitServerResponse();", WAIT_RETRY_DELAY); // tenta novamente a cada meio segundo
			}
		}
		catch(er)
		{
			AICC_ResponseReceived("error=100\nerror_text=Exceção ao ler retorno do servidor no frame frameResponse."); //  gera um retorno de erro
		}
	}
}
*/
function AICC_ResponseReceived(textData)
{
	alertDebug('[aicc.js][AICC_ResponseReceived] Interpretando dados recebidos textData = '+textData);
	var ec = new String(AICC_GetValue("error", textData));
	var em = AICC_GetValue("error_text", textData);
	if (ec == null)
	{
		alertDebug('[aicc.js][AICC_ResponseReceived] Recebidos dados inválidos (não possui código de erro).');
		onAICC_SendCommandError(ERROR_INVALID_FORMAT, 'Dados inválidos (não possui código de erro).');
	}
	else if (ec != '0')
	{
		alertDebug('[aicc.js][AICC_ResponseReceived] Recebido código de erro. ('+ec+') '+em+'.');
		onAICC_SendCommandError(ec, em);
	}
	else if (textData.toUpperCase().indexOf("[CORE]") == -1)
	{
		alertDebug('[aicc.js][AICC_ResponseReceived] Recebidos dados inválidos (não possui [CORE]).');
		onAICC_SendCommandError(ERROR_INVALID_FORMAT, 'Dados inválidos (não possui [CORE]).');
	}
	else
	{
		alertDebug('[aicc.js][AICC_ResponseReceived] Recebidos dados válidos do servidor. Atualizando dados diretamente no cache local.');
		apiCache.username = AICC_GetValue("student_id", textData);
		apiCache.full_name = AICC_GetValue("student_name", textData);
		apiCache.location = AICC_GetValue("lesson_location", textData);
		apiCache.status = AICC_GetValue("lesson_status", textData);
		apiCache.score = AICC_GetValue("score", textData);
		apiCache.total_time = AICC_GetValue("time", textData);
		apiCache.credit = AICC_GetValue("credit", textData);
		apiCache.mode = AICC_GetValue("lesson_mode", textData);
		apiCache.mastery_score = AICC_GetValue("mastery_score", textData);
		apiCache.suspend_data = AICC_GetCoreLesson(textData);
		alertDebug('[aicc.js][AICC_ResponseReceived] Cache local atualizado.');
		if (ajaxShowSaveAlert)
		{
			ajaxShowSaveAlert = false;
			alert('Os dados foram salvos com sucesso!');
		}
	}
}

function adjustLineBreaks(textData)
{
	var s = '';
	var i=0;
	for (i=0; i<textData.length; i++)
	{
		// nada
	}
	return textData;
}

function AICC_GetValue(name, textData)
{
	var name_found = false;
	var st = textData.toUpperCase().indexOf(name.toUpperCase());
	// verifica se o nome achado é o correto ou é parte de outro (por exemplo, score é parte de score_max)
	// para ser nome correto, deve ser seguido de "=" ou espaço
	while (st != -1 && st < textData.length && !name_found)
	{
		// pega a posição anterior ao noma
		var _st = st-1;
		// posiciona-se depois do nome
		st += name.length;
		// verifica se o caractere anterior é espaço ou quebra de linha ou não existe
		if (_st<0 || textData.charAt(_st)==" " || textData.charAt(_st)=="\n")
		{
			// verifica se o caractere aqui é "=" ou espaço ou quebra de linha
			if (textData.charAt(st)==" " || textData.charAt(st)=="=" || textData.charAt(st)=="\n")
				name_found = true;
		}
		if (!name_found) // se não achou o nome correto, faz nova busca a partir daqui
			st = textData.toUpperCase().indexOf(name.toUpperCase(), st);
	}
	if (name_found)
	{
		// posiciona-se depois do "=" (volta um porque pode já estar no "=", pelo código acima)
		st = textData.indexOf("=", st-1) + 1;
		var en = st;

		var section = false;
		// acha o próximo "=", próxima seção ou o fim da string
		while (textData.charAt(en) != "=" && en < textData.length && !section)
		{
			en ++;
			if (textData.charAt(en) == "[") // achou uma possível seção
			{
				// lê o nome da seção para ver se é válida
				var s_st = en + 1;
				var s_en = textData.indexOf("]", s_st);
				if (s_en != -1)
				{
					var s_name = textData.substring(s_st, s_en);
					section = true;
				}
			}
		}
		// se achou um "="
		if (textData.charAt(en) == "=")
		{
			en --; // volta uma posição, para verificar espaços imediatamente antes do "="

			// volta todos espaços até achar o nome do parâmetro anterior
			while (textData.charAt(en)==" ")
				en --;

			// volta pelo nome do parâmetro, até achar o espaço anterior - este é o fim do valor anterior
			while (textData.charAt(en)!=" " && textData.charAt(en)!="\n")
				en --;
		}
		else if (section)
			en --; // basta voltar uma posição, o valor vem antes da seção

		return textData.substring(st,en).trim();
	}
	else
		return null;
}

function AICC_GetCoreLesson(textData)
{
	var st = textData.toUpperCase().indexOf("[core_lesson]".toUpperCase());
	if (st != -1)
	{
		st = textData.indexOf("]", st) + 1;
		en = textData.indexOf("[", st);
		var v = null;
		if (en != -1)
			v = textData.substring(st, en).trim();
		else
			v = textData.substring(st).trim();
		return v;
	}
	else
		return null;
}

/*===============================================================================================*/
String.prototype.trim = function()
{
	return this.replace(/^\s+|\s+$/, '');
}

String.prototype.adjustln = function()
{
	return this.replace(/[\n\r]+/g, "\\n");
}

function getAICC_URL()
{
	var u = getRequestParameter("AICC_URL");
	if (u==null)
		u = "";
	else if (u.toUpperCase().indexOf("HTTP://") != 0)
		u = "http://" + u;
	return u;
}

/*== TRATAMENTO DOS PARÂMETROS RECEBIDOS VIA GET =====================================================*/
	
var _requestParameters_ = null;
var PARAM_MATCH_CASE = true;
var PARAM_IGNORE_CASE = false;

function getRequestParameter(parName, matchCase)
{
	if (_requestParameters_ == null)
		readURLParameters();
		
	var sValue = null;
	for (var i=0; i<_requestParameters_.length; i++)
	{
		var p = _requestParameters_[i];
		var sName = new String(p.name);
		if (sName == parName)
			sValue = new String(p.value);
		else if (!matchCase && sName.toUpperCase() == parName.toUpperCase())
			sValue = new String(p.value);
	}
	return URLDecode(sValue);
}

function readURLParameters()
{
	if (_requestParameters_ == null)
		_requestParameters_ = new Array();

	var urlVariables = location.href;
	urlVariables = urlVariables.split("?");

	urlVariables = urlVariables[1];
	if(urlVariables)
	{
		var variables = "";
		if (urlVariables.indexOf("&") >0 )
			variables = urlVariables.split("&");
		else
			variables = urlVariables.split("%26");

		for(i=0; i < variables.length; i++)
		{
			var p = new Object();
			p.name = variables[i].split("=")[0];
			p.value = variables[i].split("=")[1];
			_requestParameters_[_requestParameters_.length] = p;
		}
	}
}


function URLEncode(plaintext)
{
	if (!plaintext)
		return null;


	// The Javascript escape and unescape functions do not correspond
	// with what browsers actually do...
	var SAFECHARS = "0123456789" +			// Numeric
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +	// Alphabetic
			"abcdefghijklmnopqrstuvwxyz" +
			"-_.!~*'()";			// RFC2396 Mark characters
	var HEX = "0123456789ABCDEF";

	var encoded = "";
	for (var i = 0; i < plaintext.length; i++ ) {
		var ch = plaintext.charAt(i);
	    if (ch == " ") {
		    encoded += "+";				// x-www-urlencoded, rather than %20
		} else if (SAFECHARS.indexOf(ch) != -1) {
		    encoded += ch;
		} else {
		    var charCode = ch.charCodeAt(0);
			if (charCode > 255) {
			    alert( "Unicode Character '" 
                        + ch 
                        + "' cannot be encoded using standard URL encoding.\n" +
				          "(URL encoding only supports 8-bit characters.)\n" +
						  "A space (+) will be substituted." );
				encoded += "+";
			} else {
				encoded += "%";
				encoded += HEX.charAt((charCode >> 4) & 0xF);
				encoded += HEX.charAt(charCode & 0xF);
			}
		}
	} // for
	return encoded;
}

function URLDecode(encoded)
{
  if (!encoded)
	return null;

   // Replace + with ' '
   // Replace %xx with equivalent character
   // Put [ERROR] in output if %xx is invalid.
   var HEXCHARS = "0123456789ABCDEFabcdef"; 

   var plaintext = "";
   var i = 0;
   while (i < encoded.length) {
       var ch = encoded.charAt(i);
	   if (ch == "+") {
	       plaintext += " ";
		   i++;
	   } else if (ch == "%") {
			if (i < (encoded.length-2) 
					&& HEXCHARS.indexOf(encoded.charAt(i+1)) != -1 
					&& HEXCHARS.indexOf(encoded.charAt(i+2)) != -1 ) {
				plaintext += unescape( encoded.substr(i,3) );
				i += 3;
			} else {
				alert( 'Bad escape combination near ...' + encoded.substr(i) );
				plaintext += "%[ERROR]";
				i++;
			}
		} else {
		   plaintext += ch;
		   i++;
		}
	} // while
   return plaintext;
}

function showWaitMessage(show)
{
	if ($('fStep') != null)
	{
		if (show)
		{
			$('fStep').hide();
			if ($('divSavingMsg') != null)
				$('divSavingMsg').show();
		}
		else
		{
			if ($('divSavingMsg') != null)
				$('divSavingMsg').hide();
			$('fStep').show();
		}
	}
}
