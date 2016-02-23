  
var arrayFeedbacks = [];
var showStack = [];
var timing = {};
var snapshots = [];

var doHistory = false;

var timeZero = new Date().getTime() / 1000;
var timeMs = function() {
  return (new Date().getTime() / 1000 - timeZero).toFixed(2);
}

var subsentence = function(string, word_count) {
  return string.split(" ").slice(0, word_count).join(" ");
}  

var defaultDuration = 99999;
var bind = function() {
  $("[id^=action]").click(function(evt) {
    console.log("id beore slice: " + this.id);
    var id = this.id.replace("action", "");//this.id.slice(-1);
    var state = $("#show_more_" + id).val();
    console.log("state of id " + id + ": " + state + " == 0?" + (state == "0"));
    
    if($("#show_more_" + id).val() == "0") {
      //show more

      $("#comment" + id).text(arrayFeedbacks[id].val);
      $("#action" + id).text(" Show less");
      $("#show_more_" + id).val("1");

      showStack[id].show.push(timeMs());
      timing[id] = timeMs();
      showStack[id].duration = defaultDuration;
    } else {
      //show less

      $("#comment" + id).text(subsentence(arrayFeedbacks[id].val, 7) + "...");
      $("#action" + id).text(" Show more");
      $("#show_more_" + id).val("0");

      showStack[id].hide.push(timeMs());
      var duration = timeMs() - timing[id];


      if(duration > showStack[id].duration || showStack[id].duration == defaultDuration) 
        showStack[id].duration = duration;
    }
  });
 
  $("[id^=identity]").click(function(evt) {

    var id = this.id.slice(-1);
    var current = $("#feedback").val();
    var tag = this.text;
    $("#feedback").val(tag + " " + current);
  });
}

var generateCode = function() {
  return (Math.random() * 1000000 + "").substring(0, 4);
}

var finished = false;
var finish = function(code) {

  $("#submit").text("Thanks! Your code is: " + code);
  $('#submit').addClass("disable-link");
  finished = true;
}

var _id = 0;
var loadFeedbacks = function(val) {
  console.log("loadFeedbacks: " + JSON.stringify(val));

  val.id = _id++;

  var clone = JSON.parse(JSON.stringify(val));
  clone.show = [];
  clone.hide = [];
  clone.history = [];
  val.history = [];
  clone.duration = 0;
  arrayFeedbacks.push(val);
  showStack.push(clone);

  insertFeedbackDOM(val);
}

var insertFeedbackDOM = function(feedback) {
  //<ol>
  //<li><div class="comment_block"><a id="identity0">&nbsp;</a><span id="comment0" class="comment">&nbsp;</span><a id="action0"> Show more</a></div></li>

  var subs = subsentence(feedback.val, 7);

  var hidden = "<input type='hidden' id='show_more_" + feedback.id + "' value='0'></input>"
  var html = "<li><div class='comment_block'><span id='comment" + feedback.id + "' class='comment'>" + subs + "...</span><a id='action" + feedback.id + "'> Show more</a></div></li>" + hidden;
  $('#ol-comments').append(html);
}

var onSubmit = function(evt) {

  if(finished)
    return;

  var code = generateCode();
  finish(code);

  var feedback = $("#input-feedback").val();
  console.log("onSubmit " + feedback);

  var submitTime = new Date().getTime();

  var sessionName;
  if(doHistory) {
    sessionName = "history-text-" + imgCondition.name;
  } else {
    sessionName = "nohistory-text-" + imgCondition.name;
  }

  SolomonService(sessionName).postOne(JSON.stringify([
    {
      imgCondition: imgCondition.name,
      submitTime: submitTime,
      code: code,
      myVals: {val: feedback, history: snapshots},
      vals: arrayFeedbacks,
      stack: showStack
    }]
  ));
}

$(document).ready(function(){
  $('#if-feedback').hide();



  //_incrementGlobalCounter();

  var submitHandle = $("#submit");

  $('#imgDesign').attr('src', imgCondition.imgUrl);

  $('#design-description').text(imgCondition.description);

  submitHandle.click(function(evt) {
    onSubmit(evt);
  });

  $("#input-feedback").bind('input propertychange', function() {
    var val = $("#input-feedback").val();
    //snapshots.push({time: timeMs(), val: val});
  });

  //HISTORY CONTROL
  var history = getUrlVars()["history"];
  if(history === "true") {
    doHistory = true;
    SolomonService("history-text-" + imgCondition.name).getAll(function f(data) {
      data.forEach(function f(obj, i, arr) {
        $('#if-feedback').show();
        loadFeedbacks(obj.myVals);
      });
      bind();
    });
  } else {
    $('#history-condition').hide();
  }

});