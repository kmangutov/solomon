

var canvasWidth = 450;
var circleRadius = 10;
var imgUrl = "imgs/illini_dance.jpg";//"https://m2.behance.net/rendition/pm/23685659/max_1200/be1c0f3d2bfb8c5f414129e768bf8b64.jpg"; //"http://i.imgur.com/9mwuTql.jpg"

var canvasHandle;
var context2d;

var arrayFeedbacks = [];
var arrayActions = [];

var canvasOffsetX = 0;
var canvasOffsetY = 0;

var floatingOffsetX = 10;
var floatingOffsetY = 15;

var designWidth = 0;
var designHeight = 0;

var highlightCode = -1;
var hoverId = -1;

var tempFeedback = {active: false};

//actions:
//hover(start, stop, feedback)
//feedback(start, stop, feedback)

function FloatingInput(id) {
  this.visible = false;
  this.x = 0;
  this.y = 0;
  this.text = "";

  this.id = id;
  this.ref = $("#" + id);
  this.render();
};
FloatingInput.prototype.hide = function() {
  this.visible = false;
  this.render();
};
FloatingInput.prototype.render = function() {
  this.visible? this.ref.show() : this.ref.hide();
  this.ref.css({left: this.x, top: this.y});
  this.ref.val(this.text);
};
FloatingInput.prototype.load = function(feedback) {
  this.x = canvasOffsetX + (feedback.xFrac * designWidth) + floatingOffsetX;
  this.y = canvasOffsetY + (feedback.yFrac * designHeight) + floatingOffsetY;
  this.text = feedback.text;
  this.visible = true;
  this.render();
};
FloatingInput.prototype.focus = function() {
  var that = this;
  setTimeout(function() {that.ref.focus();}, 100);
};

var floatingInput;
var floatingDisplay;

var dist = function(x1, y1, x2, y2) {
  return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
};

var checkMouseOver = function(loc) {

  var anyShown = false;
  for(var i in arrayFeedbacks) {
    var feedback = arrayFeedbacks[i];
    if(dist(loc.x, 
            loc.y, 
            feedback.xFrac * designWidth, 
            feedback.yFrac * designHeight) <= circleRadius) {
      
      if(hoverId != feedback.id) {

        hoverId = feedback.id;
        ActionStack.startHover(feedback);
      }

      floatingDisplay.load(feedback);
      highlightCode = feedback.code;
      anyShown = true;

      renderFeedbackVisuals();

    }
  }

  if(!anyShown) {

    hoverId = -1;
    if(highlightCode != -1) {
      highlightCode = -1;
      ActionStack.stopHover();
      renderFeedbackVisuals();
    }

    floatingDisplay.hide();

  }
}

var onLeaveInput = function() {
  var val = floatingInput.ref.val();

  if(val.length > 0) {
    tempFeedback.text = val;

    console.log("saving " + JSON.stringify(tempFeedback));
    arrayFeedbacks.push(tempFeedback);////
    ActionStack.stopWrite(tempFeedback);

    if(arrayFeedbacks.length >= 3)
      $("#submit").prop('disabled', false);
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

    var newX = evt.pageX - canvasOffsetX;
    var newY = evt.pageY - canvasOffsetY;
    $("#canvas").css("cursor", "default");

    tempFeedback = {
      id: arrayFeedbacks.length + 1,
      x: newX.toFixed(2),
      y: newY.toFixed(2),
      xFrac: (newX / designWidth).toFixed(2),
      yFrac: (newY / designHeight).toFixed(2),
      text: "",
      code: 0,

    };
   
    floatingInput.load(tempFeedback);
    floatingInput.focus();
    ActionStack.startWrite();
    renderFeedbackVisuals();
  }
}

var renderFeedbackVisuals = function() {

  console.log("::renderFeedbackVisuals");

  context2d.clearRect(0, 0, canvasHandle.width, canvasHandle.height);
  for(var i in arrayFeedbacks) {

    console.log("::renderFeedbackVisuals " + i + " -> " + JSON.stringify(arrayFeedbacks[i]));

    var feedback = arrayFeedbacks[i];
    renderKnob(context2d, feedback, designWidth, designHeight, highlightCode);  
  }

  renderKnob(context2d, tempFeedback, designWidth, designHeight, highlightCode);//
};

var generateCode = function() {
  return (Math.random() * 1000000 + "").substring(0, 4);
}

var finish = function(code) {
  $("#submit").text("Thanks! Your code is: " + code);
  $("#submit").prop('disabled', true);
}

var onSubmit = function(evt) {



  var session = "history-v1";

  // collecting design feedback pls no hack
  var a = "https://api.mon";
  var aa = "golab.com/api/1/databases/solo";
  var b = "mon/collections/sess";
  var c = "ion-" + session + "?ap";
  var ca = "iKey=iILS";
  var d = "3iwLqva8cQ7P0hEfeCI0JouzGX7-";

  var code = generateCode();
  finish(code);

  $.ajax( { url: a + aa + b + c + ca + d,
      data: JSON.stringify([
        {
          design: imgUrl, 
          code: code,
          stack: ActionStack.getActionStack(),
          vals: arrayFeedbacks,
        }]),

      type: "POST",
      contentType: "application/json" } )
  .done(function() {
    //finish(code);
  })
  .fail(function() {
    //finish(code);
  });
}

var designHandle = document.getElementById("imgDesign");
var canvasHandle = document.getElementById("canvas");

var onResize = function() {
  console.log("designHandle onload width: " + designHandle.width);
  designWidth = designHandle.width;
  designHeight = designHandle.height;
  canvasHandle.width = designHandle.width;
  canvasHandle.height = designHandle.height;
  renderFeedbackVisuals();
}

$(document).ready(function(){
  //$('textarea').autoResize();
  floatingInput = new FloatingInput("floating-input");
  floatingDisplay = new FloatingInput("floating-display");
  
  var containerHandle = document.getElementById("floatingContainer");
  var submitHandle = $("#submit");
  $("#submit").prop('disabled', true);

  context2d = canvasHandle.getContext("2d");

  if(typeof dbGet != "undefined") {
    dbGet(function(db) {
      db.bindSelect(function(feedbacks) {

        //console.log("feedbacks: " + JSON.stringify(feedbacks));
        arrayFeedbacks = feedbacks.slice();
        //console.log("new arrayFeedbacks: " + JSON.stringify(arrayFeedbacks));
        renderFeedbackVisuals();
      });
    })
  }

  $("#imgDesign").imagesLoaded(function() {
    onResize();
  });

  $(window).resize(function() {
    onResize()
  });

  submitHandle.click(function(evt) {
    onSubmit(evt);
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

