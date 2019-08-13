var CNFG = {C:false,N:false,F:false,G:false,io:false};
var DBUG = {D:false,B:false,U:false,G:false}
function min2(v){
    return v.toString().length > 1 ? v : '0'+v;
}

function getPercent(full, parc){
    return parc / (full / 100); 
}

function getPercent2(full, percent){
    return (full / 100) * percent; 
}

function rul3(fix1, fix2, vr){
    var r1 = getPercent(fix1, fix2);
    var r2 = getPercent2(vr, r1);
    return r2;
}


function keyDown(e){
//    console.log(e.key+": "+e.keyCode);
    switch(e.keyCode){
        case 67 : CNFG.C = true; config();
            break;
        case 78 : CNFG.N = true; config();
            break;
        case 70 : CNFG.F = true; config();
            break;
        case 71 : CNFG.G = DBUG.G = true; config(); debug();
            break;
        case 68 : DBUG.D = true; debug();
            break;
        case 66 : DBUG.B = true; debug();
            break;
        case 85 : DBUG.U = true; debug();
            break;
    }
}

function keyUp(e){
    if (CNFG.io) return;
    switch(e.keyCode){
        case 67 : CNFG.C = false;
            break;
        case 78 : CNFG.N = false;
            break;
        case 70 : CNFG.F = false;
            break;
        case 71 : CNFG.G = DBUG.G = false;
            break;
        case 68 : DBUG.D = false;
            break;
        case 66 : DBUG.B = false;
            break;
        case 85 : DBUG.U = false;
            break;
    }
}
function config(){
    if (CNFG.io) return;
    var chk = 0;
    for(var tc in CNFG){
        if(tc != 'io'){
            if (CNFG[tc]) chk++;
        }
    }
    if(chk == 4){
        Main.openConfigurations();
    }
}

function debug(){
    var chk = 0;
    for(var tc in DBUG){
        if(tc != 'io'){
            if (DBUG[tc]) chk++;
        }
    }
    if(chk == 4){
        Main.startDebug();
    }
}

function resize(){
    var ww = parseInt($('#hAPI').css('width'));
    var mt = rul3(988, 60, ww);
    $('#adobeAnimate').css({marginLeft:$('#hAPI')[0].offsetLeft, marginTop:mt+"px"});
}



window.onkeydown = keyDown;
window.onkeyup = keyUp;
window.onresize = resize;