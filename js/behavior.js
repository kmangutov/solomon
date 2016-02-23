

var canvasWidth = 450;
var circleRadius = 10;

var context2d;

var arrayFeedbacks = [];
var arrayMyFeedbacks = [];
var getLandscape = function() {
  return arrayFeedbacks.concat(arrayMyFeedbacks);
}

var canvasOffsetX = 0;
var canvasOffsetY = 0;

var floatingOffsetX = 10;
var floatingOffsetY = 15;

var designWidth = 0;
var designHeight = 0;

var highlightCode = -1;
var hoverId = -1;

var tempFeedback = {id: -1};

var floatingInput;
var floatingDisplay;

var doHistory = false;

var dist = function(x1, y1, x2, y2) {
  return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
};

var checkMouseOver = function(loc) {

  var returnFeedback = {};
  var anyShown = false;

  //render hovered feedback contents
  getLandscape().forEach(function(feedback) {
    if(dist(loc.x, 
            loc.y, 
            feedback.xFrac * designWidth, 
            feedback.yFrac * designHeight) <= circleRadius * 1.8) {
      //we found a feedback we are hovering

      if(hoverId != feedback.id) {

        //we are hovering a new one not an old one
        hoverId = feedback.id;
        ActionStack.startHover(feedback);
      }

      //Set the return feedback
      returnFeedback = feedback; 

      //update ui
      floatingDisplay.load(feedback);
      highlightCode = feedback.code;
      anyShown = true;
    }
  });

  //claear hover
  if(!anyShown) {

    //we are not hovering over anything
    hoverId = -1;
    if(highlightCode != -1) {
      highlightCode = -1;
      ActionStack.stopHover();
    }

    floatingDisplay.hide();
  }

  renderFeedbackVisuals();
  return returnFeedback;
}

var newFeedbackCount = 0;
var onLeaveInput = function() {
  var val = floatingInput.ref.val();

  if(val.length > 0) {
    tempFeedback.text = val;

    console.log("saving " + JSON.stringify(tempFeedback));

    if(!tempFeedback.placed && tempFeedback.active) {
      arrayMyFeedbacks.push(tempFeedback);
      tempFeedback.placed = true;
    }
    
    if(tempFeedback.active) {
      ActionStack.stopWrite(tempFeedback);
    }
  }
  
  tempFeedback = {active: false};
  floatingInput.hide();
  renderFeedbackVisuals();
}

var doMouseDown = function(evt) {

  var wasVisible = floatingInput.visible;
  onLeaveInput(); //saving text
  evt.stopPropagation();

  $("#canvas").css("cursor", "pointer");
  
  if(!wasVisible){

    var designHandle = document.getElementById("imgDesign");
    designWidth = designHandle.width;
    designHeight = designHandle.height;

    var newX = evt.pageX - canvasOffsetX;
    var newY = evt.pageY - canvasOffsetY;
    $("#canvas").css("cursor", "default");

    console.log("::doMouseDown xFrac " + (newX / designWidth).toFixed(2));

    //check if we want to edit existing or make a new one
    var loc = {x: newX, y: newY};
    var clickedFeedback = checkMouseOver(loc);

    if(!jQuery.isEmptyObject(clickedFeedback) && clickedFeedback.code == 0) {
      
      //start editing existing feedback
      tempFeedback = clickedFeedback;
      //ActionStack.startEdit(clickedFeedback);
    } else {

      tempFeedback = {
        id: arrayFeedbacks.length + arrayMyFeedbacks.length + 1,
        x: newX.toFixed(2),
        y: newY.toFixed(2),
        xFrac: (newX / designWidth).toFixed(2),
        yFrac: (newY / designHeight).toFixed(2),
        text: "",
        code: 0,
        placed: false,
        active: true,
      };
    }
   
    ActionStack.startWrite(tempFeedback);
    floatingInput.load(tempFeedback);
    floatingInput.focus();
    renderFeedbackVisuals();
  }
}

var renderFeedbackVisuals = function() {

  //console.log("::renderFeedbackVisuals");

  context2d.clearRect(0, 0, designWidth, designHeight);

  getLandscape().forEach(function(feedback) {
    renderKnob(context2d, feedback, designWidth, designHeight, hoverId, highlightCode);
  });

  if(tempFeedback.id != -1)
    renderKnob(context2d, tempFeedback, designWidth, designHeight, hoverId, highlightCode);//
};

var generateCode = function() {
  return (Math.random() * 1000000 + "").substring(0, 4);
}


var finished = false;
var finish = function(code) {
  $("#submit").text("Thanks! Your code is: " + code);

  $('#submit').addClass("disable-link");
  finished = true;

}

var onSubmit = function(evt) {

  if(finished) return;

  var code = generateCode();
  finish(code);

  var submitTime = new Date().getTime();

  //insert codes
  ActionStack.finish();
  arrayFeedbacks.forEach(function(val, i, arr) {
    arr[i].code = code;
  });
  arrayMyFeedbacks.forEach(function(val, i, arr) {
    arr[i].code = code;
  });

  var data = [
    {
      imgCondition: imgCondition.name, 
      code: code,
      elapsedTime: ActionStack.elapsedTime(),
      submitTime: submitTime,
      myVals: arrayMyFeedbacks,
      vals: arrayFeedbacks,
      stack: ActionStack.getActionStack(),
    }];

  var sessionName;
  if(doHistory) {
    sessionName = "history-2d-" + imgCondition.name;
  } else {
    sessionName = "nohistory-2d-" + imgCondition.name;
  }

  SolomonService(sessionName).postOne(JSON.stringify(data));
}

var designHandle = document.getElementById("imgDesign");
var canvasHandle = document.getElementById("hover-canvas");
var adminActionsCanvasHandle = document.getElementById("admin-actions-canvas");
var floatingDivHandle = document.getElementById("floatingDiv");

var onResize = function() {
  //var canvasHandle = document.getElementById("canvas");
  context2d = canvasHandle.getContext("2d");

  var designHandle = document.getElementById("imgDesign");

  console.log("designHandle onload width: " + designHandle.width);
  designWidth = designHandle.width;
  designHeight = designHandle.height;
  canvasHandle.width = designWidth;
  canvasHandle.height = designHeight;

  renderFeedbackVisuals();
}


var clearFeedbacks = function() {
  arrayFeedbacks = [];
  renderFeedbackVisuals();
}

var loadFeedbacks = function(feedbacks) {
  arrayFeedbacks = arrayFeedbacks.concat(feedbacks);//feedbacks.slice();
  console.log("::loadFeedbacks " + JSON.stringify(feedbacks));
  renderFeedbackVisuals();
}

$(document).ready(function(){



  //_incrementGlobalCounter();

  floatingInput = new FloatingInput("floating-input");
  floatingDisplay = new FloatingInput("floating-display");
  
  var containerHandle = document.getElementById("floatingContainer");
  var submitHandle = $("#submit");
  submitHandle.prop('disabled', false);

  if(_ADMIN_MODE)
    $('#design-description').text(imgCondition.description);

  console.log(JSON.stringify(canvasHandle));
  context2d = canvasHandle.getContext("2d");

  $('#imgDesign').attr('src', imgCondition.imgUrl);

  $("#imgDesign").imagesLoaded(function() {
    onResize();
  });

  $(window).resize(function() {
    onResize()
  });

  submitHandle.click(function(evt) {
    onSubmit(evt);
  });

  canvasHandle.addEventListener("mousemove", function(evt) {

    var offset = $(this).offset();

    canvasOffsetX = offset.left;
    canvasOffsetY = offset.top;

    var obj = {
      x: evt.pageX - offset.left,
      y: evt.pageY - offset.top,
    };

    checkMouseOver(obj);
  });

  canvasHandle.addEventListener("mousedown", function(evt) {
    doMouseDown(evt);
  }, false);

  //HISTORY CONDITION
  var history = getUrlVars()["history"];

  if(history === "true") {
    doHistory = true;
    SolomonService("history-2d-" + imgCondition.name).getAll(function f(data) {
      data.forEach(function f(obj, i, arr) {
        loadFeedbacks(obj.myVals);
      });
    });
  }

}); 

