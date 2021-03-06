jQuery.typing = {
  ga: 0,
  garray: Array(),
  garrayIndex: -1,
  gtext: "",
  gindex: 0,
  goldPressed: 0,
  //previous pressed key code
  goldTarget: 0,
  //previous target key code
  gtarget: 0,
  gpressed: 0,
  ggood: 0,
  gtotal: 0,
  gtime: 0,
  gkeytime: 0,
  ghelp_array: {},
  error_in_same_line: 0,
  tolerance: 3,
  tolerance_array: {},
  mix_array: {}
};
var to;

jQuery(document).ready(function () {

  function save(load) {
    jQuery.ttpath = "/?q=typingtutor/" + location.pathname.replace(/\//g, "");
    if (load != 1) {
      jQuery.save = Object();
      jQuery.save = jQuery.extend({}, jQuery.typing);

      delete jQuery.save.garray;
      delete jQuery.save.ghelp_array;
      delete jQuery.save.mix_array;
      delete jQuery.save.tolerance_array;

      if (jQuery('body').is(".logged-in")) jQuery.post(jQuery.ttpath, jQuery.save);
    } else {
      //  {
        if (jQuery('body').is(".logged-in")) document.getElementById("help-text").innerHTML = "loading ...";
        
        if (jQuery('body').is(".logged-in")){
          jQuery.getJSON(jQuery.ttpath, function (data) {
          if (data != 0) {
            jQuery.typing.garrayIndex = data.garrayIndex * 1
            jQuery.typing.gindex = data.gindex * 1
            jQuery.typing.goldPressed = data.goldPressed * 1
            jQuery.typing.goldTarget = data.goldTarget * 1
            jQuery.typing.gtarget = data.gtarget * 1
            jQuery.typing.gpressed = data.gpressed * 1
            jQuery.typing.ggood = data.ggood * 1
            jQuery.typing.gtotal = data.gtotal * 1
            jQuery.typing.gtime = data.gtime * 1
            jQuery.typing.gkeytime = data.gkeytime * 1
            jQuery.typing.error_in_same_line = data.error_in_same_line * 1
            jQuery.typing.tolerance = data.tolerance * 1
          }
       // });

        setEvents();

        get_data_typingtutor();

        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
          var alerts = 0;
        } else {
          var alerts = 1;
        }
        for (n = 0; n <= jQuery.typing.garrayIndex; n++) {
          if (jQuery.typing.ghelp_array[n]) document.getElementById("help-text").innerHTML = jQuery.typing.ghelp_array[n];
          if (jQuery.typing.tolerance_array[n]) jQuery.typing.tolerance = jQuery.typing.tolerance_array[n];
        }
        if (--jQuery.typing.garrayIndex < 0) jQuery.typing.garrayIndex = jQuery.typing.garray.length - 1;
        next();

        });
        } else {
                setEvents();

        get_data_typingtutor();

        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
          var alerts = 0;
        } else {
          var alerts = 1;
        }
        for (n = 0; n <= jQuery.typing.garrayIndex; n++) {
          if (jQuery.typing.ghelp_array[n]) document.getElementById("help-text").innerHTML = jQuery.typing.ghelp_array[n];
          if (jQuery.typing.tolerance_array[n]) jQuery.typing.tolerance = jQuery.typing.tolerance_array[n];
        }
        if (--jQuery.typing.garrayIndex < 0) jQuery.typing.garrayIndex = jQuery.typing.garray.length - 1;
        next();

        }
      }

    }

    function setPatternInit() {

      //#b note: once we did this using innerHTML but this caused
      //a leakage of handles in ie
      var pat = document.getElementById("pattern");

      for (;;) {
        if (pat.hasChildNodes()) {
          pat.removeChild(pat.lastChild);
        } else break;
      }

      var cname = "done";
      for (j = 0; j < jQuery.typing.gtext.length; j++) {
        var ch = jQuery.typing.gtext.charAt(j);

        if (j > jQuery.typing.gindex) cname = "future";
        else if (j == jQuery.typing.gindex) cname = "todo";

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

      for (j = 0; j < jQuery.typing.gtext.length; j++) {
        if (j > jQuery.typing.gindex) cname = "future";
        else if (j == jQuery.typing.gindex) cname = "todo";

        var kid = kids[j];
        kid.className = cname;
      }
    }

    function mapToBoard(code) {
      if ((in_keyborad["" + code])) return (1 * in_keyborad["" + code]);
      if ((code >= 97) && (code <= 122)) return (code - 32);
      if ((code >= 65) && (code <= 90)) return code;
      if ((code == 252) || (code == 92) || (code == 122)) return code // Umlaute
      if ((code == 44) || (code == 46) || (code == 47) || (code == 59)) return code;
      return 0;
    }

    function setBoard() {

      var letter;
      var elt;
      var c;
      var s;

      if (jQuery.typing.goldTarget != 0) {
        c = mapToBoard(jQuery.typing.goldTarget);
        if (c != 0) {
          letter = "code" + c;
          elt = document.getElementById(letter);
          s = "silent";
          elt.className = s;
        }
      }
      if (jQuery.typing.goldPressed != 0) {
        c = mapToBoard(jQuery.typing.goldPressed);
        if (c != 0) {
          letter = "code" + c;
          elt = document.getElementById(letter);
          s = "silent";
          elt.className = s;
        }
      }
      if (jQuery.typing.gtarget != 0) {
        c = mapToBoard(jQuery.typing.gtarget);
        if (c != 0) {
          letter = "code" + c;
          elt = document.getElementById(letter);
          s = "target";
          elt.className = s;
          if (elt.style.opacity == "") {
            elt.style.opacity = 1;
          } else if (elt.style.opacity > 0) {
            elt.style.opacity = elt.style.opacity - .05;
          }
        }
      }
      if (jQuery.typing.gpressed != 0) {
        c = mapToBoard(jQuery.typing.gpressed);
        if (c != 0) {
          letter = "code" + c;
          elt = document.getElementById(letter);
          s = "pressed";
          elt.className = s;
          elt.style.opacity = 1;
        }
      }

    }

    function nextPattern() {

      jQuery.typing.goldTarget = jQuery.typing.gtarget;
      jQuery.typing.goldPressed = jQuery.typing.gpressed;

      if (++jQuery.typing.garrayIndex == jQuery.typing.garray.length) jQuery.typing.garrayIndex = 0;

      if (jQuery.typing.error_in_same_line > jQuery.typing.tolerance) {
        if (--jQuery.typing.garrayIndex < 0) jQuery.typing.garrayIndex = jQuery.typing.garray.length - 1;

        if (jQuery.typing.mix_array[jQuery.typing.garrayIndex]) {
          jQuery.typing.gtext = TypingTutor_Mix(jQuery.typing.garray[jQuery.typing.garrayIndex]);
        } else {
          jQuery.typing.gtext = jQuery.typing.garray[jQuery.typing.garrayIndex];
        }

      } else {
        jQuery.typing.gtext = jQuery.typing.garray[jQuery.typing.garrayIndex];
        if (typeof TypingTutor_progress == 'function') {
          TypingTutor_progress(jQuery.typing.garray.length - 1, jQuery.typing.garrayIndex);
        }
      }


      jQuery.typing.gindex = 0;
      //check for new help text
      if (jQuery.typing.ghelp_array[jQuery.typing.garrayIndex]) document.getElementById("help-text").innerHTML = jQuery.typing.ghelp_array[jQuery.typing.garrayIndex];

      //check for new tolerance level
      if (jQuery.typing.tolerance_array[jQuery.typing.garrayIndex]) jQuery.typing.tolerance = jQuery.typing.tolerance_array[jQuery.typing.garrayIndex];

      jQuery.typing.gpressed = 0;

      setPrompt();
      save();
    }

    function prevPattern() {

      jQuery.typing.goldTarget = jQuery.typing.gtarget;
      jQuery.typing.goldPressed = jQuery.typing.gpressed;

      if (--jQuery.typing.garrayIndex < 0) jQuery.typing.garrayIndex = jQuery.typing.garray.length - 1;

      jQuery.typing.gtext = jQuery.typing.garray[jQuery.typing.garrayIndex];
      jQuery.typing.gindex = 0;
      jQuery.typing.gpressed = 0;

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
      save(0);
      return false;
    }

    function setEcho(c, isOK) {
      var s;
      if (c < ' ') c = ' ';

      var s = "[" + c + "]";
      if (!isOK) {
        if (++jQuery.typing.error_in_same_line > jQuery.typing.tolerance) {
          s += " ..oops you'll need to redo this one";
        } else {
          s += " ..oops " + (jQuery.typing.error_in_same_line) + " of " + jQuery.typing.tolerance;
        }

        /* soundManager.play('a'); */
      }

      var elt = document.getElementById("echo");
      var txt = document.createTextNode(s); //#b
      if (elt.hasChildNodes()) {
        elt.replaceChild(txt, elt.lastChild);
      } else elt.appendChild(txt);
    }

    function setPrompt() {
      var ch = jQuery.typing.gtext.charAt(jQuery.typing.gindex);
      jQuery.typing.gtarget = ch.charCodeAt(0);
/* soundManager.stopAll();
	
		if ((jQuery.typing.gtarget>=97)&&(jQuery.typing.gtarget<=122)) {
	    soundManager.play( "code"+(jQuery.typing.gtarget-32) );
	  } else {
	    soundManager.play( "code"+(jQuery.typing.gtarget) );
	  } */

    }

    function adjustStatistics(ch) {
      return; //could count errors by character
    }

    function updateSpeed(ok) {
      var t = (new Date()).getTime();
      var dt = (t - jQuery.typing.gtime);
      jQuery.typing.gtime = t;
      if (dt > 5000) return; //ignore sleepy user
      jQuery.typing.gkeytime += dt;

      var s = (0.5 + jQuery.typing.ggood * 60 * 1000 / jQuery.typing.gkeytime).toFixed(0) + " chars/min";
      var elt = document.getElementById("speed");
      var txt = document.createTextNode(s); //#b
      if (elt.hasChildNodes()) {
        elt.replaceChild(txt, elt.lastChild);
      } else elt.appendChild(txt);
    }

    function updateScore(ok) {
      if (ok) jQuery.typing.ggood++;
      jQuery.typing.gtotal++;

      updateSpeed(ok);

      var s = jQuery.typing.ggood.toFixed(0) + " chars";
      var elt = document.getElementById("count");

      var txt = document.createTextNode(s); //#b
      if (elt.hasChildNodes()) {
        elt.replaceChild(txt, elt.lastChild);
      } else elt.appendChild(txt);


      s = (jQuery.typing.ggood * 100 / jQuery.typing.gtotal).toFixed(1) + "%";
      elt = document.getElementById("accuracy");

      txt = document.createTextNode(s); //#b
      if (elt.hasChildNodes()) {
        elt.replaceChild(txt, elt.lastChild);
      } else elt.appendChild(txt);

    }

    function reset(e) {
      jQuery.typing.ggood = 0;
      jQuery.typing.gtotal = 0;
      jQuery.typing.gtime = 0;
      jQuery.typing.gkeytime = 0;


      var elt = document.getElementById("count");
      var txt = document.createTextNode(""); //#b
      if (elt.hasChildNodes()) {
        elt.replaceChild(txt, elt.lastChild);
      } else elt.appendChild(txt);

      elt = document.getElementById("accuracy");
      txt = document.createTextNode(""); //#b
      if (elt.hasChildNodes()) {
        elt.replaceChild(txt, elt.lastChild);
      } else elt.appendChild(txt);

      elt = document.getElementById("speed");
      txt = document.createTextNode(""); //#b
      if (elt.hasChildNodes()) {
        elt.replaceChild(txt, elt.lastChild);
      } else elt.appendChild(txt);


      return true;
    }

    function debugKey(evt) { //#b
      var e = (window.event) ? window.event : evt; //#b
      var k = (e.which) ? e.which : e.keyCode;
      var f = filterKeyCode(k);

      var s = "k=" + k + ",f=" + f;
      alert(s);

      return false;
    }

    function setEvents() { //#b
      document.onkeydown = down; //#b 
      document.onkeypress = press;
      (document.getElementById('skip')).onmousedown = skip;
      (document.getElementById('back')).onmousedown = back;
      (document.getElementById('reset')).onmousedown = reset;
    }

    function filterKeyCode(code) { //from key down (0 to ignore)
      //note: user must have num lock set if they want to use keypad numbers
      
      if ((code >= 65) && (code <= 90)) return code; //alpha 
      if ((code == 252) || (code == 92) || (code == 122)) return code; // Umlaute
      if ((code >= 48) && (code <= 57)) return code; //numberic
      if (code == 32) return code; //blank
      if ((code >= 96) && (code <= 105)) return code; //number pad digits
      if ((code == 13) || (code == 16) || (code == 20)) return code; //enter, shift
      if ((code >= 106) && (code <= 111)) return code; //number pad operators 
      if ((code >= 186) && (code <= 192)) return code; //punctuation
      if ((code >= 219) && (code <= 222)) return code; //punctuation
      return 0;
    }

    function filterCode(code) { //from key press as ascii char code (0 to ignore)
      // if ((in_keyborad["" + code])) return (1 * in_keyborad["" + code]);
      if ((code == 13) || (code == 16) || (code == 20)) return code; //enter and shift and space are allowed
      if (code < 32) return 0;
      if ((code == 252) || (code == 92) || (code == 122)) return code; // Umlaute
      //	if (code>=127) return 0;
      return code;
    }

    function capsLockFilter(e, pressed) { //#b many problems making this cross browser!
      //#b e.modifiers known only on early mozilla (which does not know standard e.shiftkey)?
      var shifted = e.shiftKey || (e.modifiers && (e.modifiers & Event.SHIFT_MASK)); //#b
      var locked = (((pressed > 64) && (pressed < 91) && (!shifted)) || ((pressed > 96) && (pressed < 123) && (shifted)));
      if (locked) alert("caps lock!");
    }

    function down(evt) { //#b
      var e = (window.event) ? window.event : evt; //#b
      var rawcode = (e.which) ? e.which : e.keyCode;
      pressed = filterKeyCode(rawcode);

      if (pressed > 0) return true;

      if (typeof (e.cancelBubble) != "undefined") e.cancelBubble = true;
      if (typeof (e.stopPropagation) != "undefined") e.stopPropagation();
      return false; //#b nuisance keys - backspace etc on ie (no effect for capslock!!)
    }

    function press(evt) { //#b
      //#b should work in ie, firefox, safari(hopefully), opera(hopefully)
      var e = (window.event) ? window.event : evt; //#b
      var pressed = 0;
      var wc = -1;
      var kc = -1;
      var cc = -1;


      if (typeof (e.keyCode) != "undefined") kc = e.keyCode; //ie
      if (typeof (e.charCode) != "undefined") cc = e.charCode; //firefox
      if (typeof (e.which) != "undefined") wc = e.which; //old mozilla
      if ((kc >= 0) && (cc >= 0)) { //firefox
        pressed = cc;
      } else if (kc >= 0) pressed = kc; //ie
      else if (wc >= 0) pressed = wc; //old mozilla
      // alert("pressed="+pressed+",kc="+kc+",cc="+cc+",wc="+wc);
      pressed = filterCode(pressed);
      if (pressed == 0) {
        if (kc == 13) return skip(); //#b firefox
        else return false;
      }
      if (pressed == 13) return skip(); //#b ie
      capsLockFilter(e, pressed); //hmm
      var c = String.fromCharCode(pressed); //ie from ascii code
      var ch = jQuery.typing.gtext.charAt(jQuery.typing.gindex);
      var ok = (c == ch);

      jQuery.typing.goldPressed = jQuery.typing.gpressed;
      jQuery.typing.gpressed = pressed;
      jQuery.typing.goldTarget = jQuery.typing.gtarget;

      if (ok) {
        jQuery.typing.gindex++;

        if (jQuery.typing.gindex == jQuery.typing.gtext.length) {
          nextPattern();
          setPatternInit();
          jQuery.typing.error_in_same_line = 0;
        } else setPattern();

        jQuery.typing.gpressed = 0;
        setPrompt();
        setEcho(c, true);
        updateScore(true);

      } else {
        setEcho(c, false);
        updateScore(false);
        setPattern()
      }

      setBoard();
      return false;
    }

    // let override
    if (typeof TypingTutor_progress !== 'function') {
      function TypingTutor_progress(t, n) {
        if (n) jQuery("#buttons").css("background-position", ((n / t) * 100) + "%");
      };
    };
    if (typeof TypingTutor_Mix_Words !== 'function') {
      function TypingTutor_Mix_Words(s) {
        var A = s.split(' '),
          c = Array(),
          i = 0;
        while (A.length) c[i++] = A.splice(Math.floor(Math.random() * A.length), 1);
        return jQuery.trim(c.join(' '));
      };
    };
    if (typeof TypingTutor_Mix !== 'function') {
      function TypingTutor_Mix(str) {
        var s = str.split(' ');
        for (var i = 0; i < s.length; i++) {
          var A = s[i].split(''),
            c1 = '',
            c3 = ''; //A.shift(), c3= A.pop() || '';
          while (A.length) c1 += A.splice(Math.floor(Math.random() * A.length), 1);
          s[i] = c1 + c3;
        }
        return TypingTutor_Mix_Words(s.join(' '));
      };
    };

    // start
    save(1); //load
  });