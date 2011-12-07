var ga =0;
var garray = new Array();
var help_array = new Array();
var garrayIndex = -1;
var gtext = "";
var gindex = 0;
var goldPressed = 0; //previous pressed key code
var goldTarget = 0; //previous target key code
var gtarget = 0;
var gpressed = 0;
var ggood = 0;
var gtotal = 0;
var gtime = 0;
var gkeytime = 0;

function setup() {
  setEvents();
  get_data_typingtutor();	
  garrayIndex = -1;
  
     if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
       var alerts = 0;
     } else {
       var alerts = 1;
     }
     if(window.location.hash) {
	   var searchString = window.location.hash;
	   // strip off the leading '#'
	   searchString = searchString.substring(1);

	   var nvPairs = searchString.split("&");

	   for (i = 0; i < nvPairs.length; i++)
	   {
	     var nvPair = nvPairs[i].split("=");
	     var name = nvPair[0];
	     var value = nvPair[1];
	     if ('line' == name)  garrayIndex = 1 * value;
	   }
	 }
     next();
}



function setPatternInit() {

	//#b note: once we did this using innerHTML but this caused
	//a leakage of handles in ie

	var pat = document.getElementById("pattern");

	for(;;) {
		if (pat.hasChildNodes()) {
			pat.removeChild(pat.lastChild);
		}
		else break;
	}

	var cname = "done";
	for (j=0; j<gtext.length; j++) {
		var ch = gtext.charAt(j); 

		if (j>gindex) cname = "future";
		else if (j==gindex) cname = "todo";

		var kid = document.createElement("span");
		kid.className = cname;

		var txt = document.createTextNode(ch);
		kid.appendChild(txt); //#b innertext doesnt work on firefox
		pat.appendChild(kid);
	}
}

function setPattern() {

	var pat = document.getElementById("pattern");
	var kids = pat.childNodes;

	var cname = "done";

	for (j=0; j<gtext.length; j++) {
		if (j>gindex) cname = "future";
		else if (j==gindex) cname = "todo";

		var kid = kids[j];
		kid.className = cname;
	}
}


function mapToBoard(code) {
	if ((code>=97)&&(code<=122)) return (code-32);
	if ((code>=65)&&(code<=90)) return code;
        if ((code==252)||(code==92)||(code==122)) return code // Umlaute
	if ((code==44)||(code==46)||(code==47)||(code==59)) return code;
        if ((in_keyborad[""+code])) return ( 1 * in_keyborad[""+code]);
        return 0;
}


function setBoard() {

	var letter;
	var elt;
	var c;
	var s;


	if (goldTarget!=0) {
		c = mapToBoard(goldTarget);
		if (c!=0) {
			letter = "code"+c;
			elt = document.getElementById(letter);
			s = "silent";
			elt.className = s;
		}
	}
	if (goldPressed!=0) {
		c = mapToBoard(goldPressed);
		if (c!=0) {
			letter = "code"+c;
			elt = document.getElementById(letter);
			s = "silent";
			elt.className = s;
		}
	}

	if (gtarget!=0) {
		c = mapToBoard(gtarget);
		if (c!=0) {
			letter = "code"+c;
			elt = document.getElementById(letter);
			s = "target";
			elt.className = s;
                        if (elt.style.opacity == "" ) {
                          elt.style.opacity = 1;
                        } else if (elt.style.opacity > 0) {
                          elt.style.opacity = elt.style.opacity - .05;
                        } 
		}
	}
	if (gpressed!=0) {
		c = mapToBoard(gpressed);
		if (c!=0) {
			letter = "code"+c;
			elt = document.getElementById(letter);
			s = "pressed";
			elt.className = s;
                        elt.style.opacity = 1; 
		}
	}

}

function nextPattern() {
	
	goldTarget = gtarget;
	goldPressed = gpressed;

	if (++garrayIndex == garray.length) garrayIndex = 0;
	
	window.location.hash = "#line=" + garrayIndex;
	
	gtext = garray[garrayIndex]; gindex = 0;
	if (help_array[garrayIndex]) document.getElementById("help-text").innerHTML = help_array[garrayIndex];
	gpressed = 0; 
	
	setPrompt();
}

function prevPattern() {

	goldTarget = gtarget;
	goldPressed = gpressed;

	if (--garrayIndex < 0) garrayIndex = garray.length - 1;
	gtext = garray[garrayIndex]; gindex = 0;
	gpressed = 0; 
	
	setPrompt();
}

function next() {

	nextPattern();
	setPatternInit();
	setBoard(); 
}

function prev() {
	prevPattern();
	setPatternInit();
	setBoard();
}


function skip(e) {
	next();
	return false;
}


function back(e) {
	prev();
	return false;
}



function setEcho(c, isOK) {
	var s;
	if (c<' ') c=' ';

	var s = "["+c+"]";
	if (!isOK) {
           s += " ..oops";
          /* soundManager.play('a'); */
        }

	var elt = document.getElementById("echo");
	var txt = document.createTextNode(s); //#b
	if (elt.hasChildNodes()) {
		elt.replaceChild(txt, elt.lastChild);
	}
	else elt.appendChild(txt); 
}

function setPrompt() {
	var ch = gtext.charAt(gindex);
	gtarget = ch.charCodeAt(0);
	/* soundManager.stopAll();
	
	if ((gtarget>=97)&&(gtarget<=122)) {
          soundManager.play( "code"+(gtarget-32) );
        } else {
          soundManager.play( "code"+(gtarget) );
        } */
          
}

function adjustStatistics(ch) {
	return; //could count errors by character
}


function updateSpeed(ok) {
	var t = (new Date()).getTime();
	var dt = (t-gtime);
	gtime = t;
	if (dt > 5000) return; //ignore sleepy user
	gkeytime += dt;

	var s = (0.5+ggood*60*1000/gkeytime).toFixed(0) + " chars/min";
	var elt = document.getElementById("speed");
	var txt = document.createTextNode(s); //#b
	if (elt.hasChildNodes()) {
		elt.replaceChild(txt, elt.lastChild);
	}
	else elt.appendChild(txt); 
}


function updateScore(ok) {
	if (ok) ggood++;
	gtotal++;

	updateSpeed(ok);

	var s = ggood.toFixed(0) + " chars";
	var elt = document.getElementById("count");

	var txt = document.createTextNode(s); //#b
	if (elt.hasChildNodes()) {
		elt.replaceChild(txt, elt.lastChild);
	}
	else elt.appendChild(txt); 


	s = (ggood*100/gtotal).toFixed(1) + "%";
	elt = document.getElementById("accuracy");

	txt = document.createTextNode(s); //#b
	if (elt.hasChildNodes()) {
		elt.replaceChild(txt, elt.lastChild);
	}
	else elt.appendChild(txt); 


}


function reset(e) {
	ggood = 0; gtotal = 0;
	gtime = 0; gkeytime = 0;


	var elt = document.getElementById("count");
	var txt = document.createTextNode(""); //#b
	if (elt.hasChildNodes()) {
		elt.replaceChild(txt, elt.lastChild);
	}
	else elt.appendChild(txt); 

	elt = document.getElementById("accuracy");
	txt = document.createTextNode(""); //#b
	if (elt.hasChildNodes()) {
		elt.replaceChild(txt, elt.lastChild);
	}
	else elt.appendChild(txt); 

	elt = document.getElementById("speed");
	txt = document.createTextNode(""); //#b
	if (elt.hasChildNodes()) {
		elt.replaceChild(txt, elt.lastChild);
	}
	else elt.appendChild(txt); 


	return true;
}

function debugKey(evt) { //#b

	var e = (window.event) ? window.event : evt; //#b
	var k = (e.which)? e.which : e.keyCode;
	var f = filterKeyCode(k);

	var s = "k="+k+",f="+f;
	alert(s);

	return false;
}

function setEvents() { //#b
	document.onkeydown=down; //#b 
	document.onkeypress=press;
	(document.getElementById('skip')).onmousedown=skip;
	(document.getElementById('back')).onmousedown=back;
	(document.getElementById('reset')).onmousedown=reset;  
}


function filterKeyCode(code) { //from key down (0 to ignore)

	//note: user must have num lock set if they want to use keypad numbers

	if ((code>=65)&&(code<=90)) return code; //alpha 
        if ((code==252)||(code==92)||(code==122)) return code; // Umlaute
	if ((code>=48)&&(code<=57)) return code; //numberic
	if (code==32) return code; //blank
	if ((code>=96)&&(code<=105)) return code; //number pad digits
	if ((code==13)||(code==16)||(code==20)) return code; //enter, shift
	if ((code>=106)&&(code<=111)) return  code; //number pad operators 
	if ((code>=186)&&(code<=192)) return code; //punctuation
	if ((code>=219)&&(code<=222)) return code; //punctuation

	return 0;
}


function filterCode(code) { //from key press as ascii char code (0 to ignore)
	if ( (code==13) || (code==16) || (code==20) ) return code; //enter and shift and space are allowed
	if (code<32) return 0;
        if ((code==252)||(code==92)||(code==122)) return code; // Umlaute
//	if (code>=127) return 0;
	return code;
}



function capsLockFilter(e, pressed) { //#b many problems making this cross browser!

	//#b e.modifiers known only on early mozilla (which does not know standard e.shiftkey)?

	var shifted = e.shiftKey || (e.modifiers && (e.modifiers & Event.SHIFT_MASK)); //#b

	var locked = (((pressed > 64) && (pressed < 91) && (!shifted))
		 || ((pressed > 96) && (pressed < 123) && (shifted)));
	if (locked) alert("caps lock!");
}


function down(evt) { //#b

	var e = (window.event) ? window.event : evt; //#b
	var rawcode = (e.which)? e.which : e.keyCode;
	pressed = filterKeyCode(rawcode); 

	if (pressed > 0) return true;

	if (typeof(e.cancelBubble)!="undefined") e.cancelBubble = true;
	if (typeof(e.stopPropagation)!="undefined") e.stopPropagation();
	return false; //#b nuisance keys - backspace etc on ie (no effect for capslock!!)

}


function press(evt) { //#b


	//#b should work in ie, firefox, safari(hopefully), opera(hopefully)


	var e = (window.event) ? window.event : evt; //#b

	var pressed = 0;
	var wc = -1;
	var kc = -1;
	var cc = -1;


	if (typeof(e.keyCode)!="undefined") kc = e.keyCode; //ie
	if (typeof(e.charCode)!="undefined") cc = e.charCode; //firefox
	if (typeof(e.which)!="undefined") wc = e.which; //old mozilla

	if ((kc>=0)&&(cc>=0)) { //firefox
		pressed = cc; 
	}
	else if (kc>=0) pressed = kc; //ie
	else if (wc>=0) pressed = wc; //old mozilla

	// alert("pressed="+pressed+",kc="+kc+",cc="+cc+",wc="+wc);


	pressed = filterCode(pressed);
	if (pressed==0) {
		if (kc==13) return skip(); //#b firefox
		else return false; 
	}
	if (pressed==13) return skip(); //#b ie

	capsLockFilter(e, pressed); //hmm
	
	var c = String.fromCharCode(pressed); //ie from ascii code
	var ch = gtext.charAt(gindex);
	var ok = (c==ch);

	goldPressed = gpressed;
	gpressed = pressed;
	goldTarget = gtarget;

	if (ok) {
		gindex++;

		if (gindex==gtext.length) {
			nextPattern();
			setPatternInit();
		}
		else setPattern();

		gpressed = 0;
		setPrompt();
		setEcho(c, true);
		updateScore(true);
		
	}
	else {
		setEcho(c, false);
		updateScore(false);
		setPattern()
	}

   	setBoard();
	return false;
} 
jQuery(document).ready(function () { setup(); });
