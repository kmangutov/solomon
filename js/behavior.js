

var canvasWidth = 450;
var circleRadius = 10;
var imgUrl = "imgs/illini_dance.jpg";//"https://m2.behance.net/rendition/pm/23685659/max_1200/be1c0f3d2bfb8c5f414129e768bf8b64.jpg"; //"http://i.imgur.com/9mwuTql.jpg"

var canvasHandle;
var context2d;

var arrayFeedbacks = [];

var canvasOffsetX = 0;
var canvasOffsetY = 0;

var tempFeedback = {active: false};

var floatingOffsetX = 10;
var floatingOffsetY = 15;

var FloatingInput = {
  visible: false,
  x: 0,
  y: 0,
  text: ""
};

var renderFloatingInput = function(evt) {
  $("#floating-input").show();
  $("#floating-input").css({left: evt.pageX + 10, top: evt.pageY + 15});
  setTimeout(function(){$("#floating-input").focus();}, 100);

}

var renderFloatingDisplay = function(feedback) {
  $("#floating-display").show();
  var newX = canvasOffsetX + feedback.x + floatingOffsetX;
  var newY = canvasOffsetY + feedback.y + floatingOffsetY;
  $("#floating-display").css({left: newX, top: newY});
  $("#floating-display").val(feedback.text);
}

var dist = function(x1, y1, x2, y2) {
  return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}

var resetActive = function() {
  var anyReset = false;
  for(var i in arrayFeedbacks) {
    var feedback = arrayFeedbacks[i];

    if(feedback.active) {
      anyReset = true;

    }

    feedback.active = false;
  }
  return anyReset;
}

var checkMouseOver = function(loc) {

  for(var i in arrayFeedbacks) {
    var feedback = arrayFeedbacks[i];
    if(!feedback.active && dist(loc.x, loc.y, feedback.x, feedback.y) <= circleRadius) {
      console.log("mouseoveredf one");

      if(!feedback.hover) {
        renderFloatingDisplay(feedback);
        feedback.hover = true;
      }
    } else {
      if(feedback.hover) {
        $("#floating-display").hide();
        feedback.hover = false;
      }
    }
  }
}

var onLeaveInput = function() {
  var val = $("#floating-input").val();

  if(val.length > 0 && tempFeedback.active) {
    tempFeedback.text = $("#floating-input").val();
    arrayFeedbacks.push(tempFeedback);////
  }
  
  tempFeedback = {active: false};
  $("#floating-input").val("");
  $("#floating-input").hide();
}

var doMouseDown = function(evt) {

  onLeaveInput(); //saving text
  evt.stopPropagation();

  if(!resetActive()){

    tempFeedback = {
      id: arrayFeedbacks.length + 1,
      x: evt.pageX - canvasOffsetX,
      y: evt.pageY - canvasOffsetY,
      absX: evt.pageX,
      absY: evt.pageY,
      text: "hello world",
      hover: false,
      active: true
    };
   
    renderFeedbackVisuals();
    renderFloatingInput(evt);
  }
}

var renderFeedbackVisuals = function() {

  context2d.clearRect(0, 0, canvasHandle.width, canvasHandle.height);
  for(var i in arrayFeedbacks) {

    var feedback = arrayFeedbacks[i];
    renderKnob(context2d, feedback);  
  }
  renderKnob(context2d, tempFeedback);//
};

$(document).ready(function(){

  $("#floating-display").hide();
  $("#floating-input").hide();

  canvasHandle = document.getElementById("canvas");
  var designHandle = document.getElementById("imgDesign");
  var containerHandle = document.getElementById("floatingContainer");

  context2d = canvasHandle.getContext("2d");;

  $("#imgDesign").imagesLoaded(function() {
    console.log("designHandle onload width: " + designHandle.width);
    canvasHandle.width = designHandle.width;
    canvasHandle.height = designHandle.height;
  });



  canvas.addEventListener("mousemove", function(evt) {
    
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
}); 

