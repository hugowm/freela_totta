var emptyString     = "";
var LMSChannelOpen  = "";
var LMSChannelClose = "";
var lessonComplete  = "";

function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}

function iniciaLMS() {	
	LMSChannelOpen = LMSInitialize();
	if (LMSChannelOpen){ 
		var status = LMSGetValue("cmi.core.lesson_status");
		if (status == "not attempted") {
			LMSSetValue("cmi.core.lesson_status","incomplete")
		}
	//	getDataOnLMS();
	}
}

function terminaLMS() {
	
	contabilizaTempo();

	var status = LMSGetValue("cmi.core.lesson_status");

	if ((status != "completed") ) {
		LMSSetValue("cmi.core.lesson_status","completed");

    }
    LMSCommit();
    LMSChannelClose = LMSFinish();
}

function getName () {
	var studentName = LMSGetValue("cmi.core.student_name");
	return studentName;
}

function contabilizaTempo () {	
	computeTime();	
	LMSSetValue("cmi.core.session_time",lessonTimeStr);
}

function scoCompletado(){
	lessonComplete = true;
	LMSSetValue("cmi.core.lesson_status","completed");
	//LMSSetValue("cmi.core.score.raw","100");

	LMSCommit();
}


/*********************************************************************************************************/
// -------- Determine learner's time in lesson for this session



var lessonTime = new Date().getTime();
var lessonTimeStr = "00:00:00";

/*********************************************************************************************************/
// -------- Determine learner's time in lesson for this session
function computeTime(){

    if ( lessonTime != 0 ){
        var currentDate = new Date().getTime();
        var elapsedSeconds = ( (currentDate - lessonTime) / 1000 );
        var formattedTime = convertTotalSeconds( elapsedSeconds );
    } else {
        formattedTime = "00:00:00";						//Changed this to reflect whole seconds
    }
    lessonTimeStr = formattedTime;

}

/*********************************************************************************************************/
function convertTotalSeconds(ts){

  var remainder = ts % 3600;                                     // What's left after we remove the even hours?
  var hours = "" + (ts - remainder)/3600;                        // How many hours divided evenly?
  remainder = remainder % 60;                                    // What's left after we remove the even minutes?
  var minutes = "" +  (ts - hours*3600 - remainder) /60;         // How many minutes divided evenly?
  var seconds = "" + Math.round(remainder);                      // (Round: LMS's throw errors without) Seconds are all that remains
	if(seconds == "60") {
		seconds = "00";
		minutes = "" + (minutes + 1);
	}
  while (hours.length < 2) hours = "0" + hours;                  // Pad with zeroes until at least two digits long
  while (minutes.length < 2) minutes = "0" + minutes;
  while (seconds.length <2) seconds = "0" + seconds;
  return hours + ":" + minutes + ":" + seconds;

}


/*********************************************************************************************************/
// -- Encontra a API SCORM nos Frames/Janelas pai e fornece as funções de comunicação --

var		mAPIAdapter = null;
var		kNotInitialized = "301";


function findAPIAdapter(win)
{
	var		retVal = win.API;
	if (retVal == null)
	{
		var	parentWindow = win.parent;
		if (parentWindow == null || win == parentWindow)
			retVal = null;
		else
			retVal = findAPIAdapter(parentWindow);
	}
	return retVal;
}


function getAPIAdapter()
{
	var	retVal = mAPIAdapter;
	if (retVal == null)
	{
		var		onErrorEvent = window.onerror;
		
		window.onerror = handleError;
		retVal = findAPIAdapter(window);
		
		if (retVal == null)
		{
			var		openerWindow = window.opener;
			
			if (openerWindow != null)
				retVal = findAPIAdapter(openerWindow);
		}
		window.onerror = onErrorEvent;
	}

	return retVal;
}


function handleError(message, url, line)
{
	var		contentDomain = url.split("/");
	var		errorMessage = "Error " + LMSGetLastError() + "\n\n";
	
	errorMessage += "Unable to access the API Adapter.\n";
	errorMessage += "Tracking is unavailable.";
	
	//alert(errorMessage);
	return true;
}


function isAPIAdapterValid()
{
	return mAPIAdapter != null;
}


function LMSCommit()
{
	var		retVal = "false";
	
	if (isAPIAdapterValid())
		retVal = mAPIAdapter.LMSCommit("");
		
	return retVal;
}


function LMSFinish()
{
	var		retVal = "false";
	
	if (isAPIAdapterValid())
		retVal = mAPIAdapter.LMSFinish("");
		
	return retVal;
}


function LMSGetDiagnostic(errorCode)
{
	var		retVal = "";
	
	if (isAPIAdapterValid())
		retVal = mAPIAdapter.LMSGetDiagnostic(errorCode);
		
	return retVal;
}


function LMSGetErrorString(errorCode)
{
	var		retVal = "";
	
	if (isAPIAdapterValid())
		retVal = mAPIAdapter.LMSGetErrorString(errorCode);
		
	return retVal;
}


function LMSGetLastError()
{	
	var		retVal = kNotInitialized;
	
	if (isAPIAdapterValid())
		retVal = mAPIAdapter.LMSGetLastError();
		
	return retVal;
}





function LMSInitialize()
{
	var		retVal = false;
	
	mAPIAdapter = getAPIAdapter();
	
	//alert(mAPIAdapter);
	if (isAPIAdapterValid())
		retVal = mAPIAdapter.LMSInitialize("");
		
	return retVal;
}

function LMSGetValue(elementName)
{
	var		retVal = "";
	
	if (isAPIAdapterValid())
		retVal = mAPIAdapter.LMSGetValue(elementName);
		
	return retVal;
}

function LMSSetValue(elementName, elementValue)
{
	
	var	retVal = "false";

	if (isAPIAdapterValid()) {
		retVal = mAPIAdapter.LMSSetValue(elementName, elementValue);
	}

    LMSCommit();	
	return retVal;
}