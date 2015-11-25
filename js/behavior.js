

var canvasWidth = 450;
var circleRadius = 15;
var imgUrl = "https://m2.behance.net/rendition/pm/23685659/max_1200/be1c0f3d2bfb8c5f414129e768bf8b64.jpg"; //"http://i.imgur.com/9mwuTql.jpg"

var canvasHandle;
var context2d;

var arrayFeedbacks = [];

var renderFeedbackVisuals = function() {
  context2d.clearRect(0, 0, canvasHandle.width, canvasHandle.height);
  for(var i in arrayFeedbacks) {
    var feedback = arrayFeedbacks[i];
    console.log(JSON.stringify(feedback));
    context2d.fillStyle = "#FFF";
    context2d.strokeStyle = "#000";
    context2d.beginPath();
    context2d.arc(feedback.x, feedback.y, circleRadius, 0, 2 * Math.PI);
    context2d.fill();
    context2d.stroke();

    context2d.fillStyle = "#000";
    context2d.font = "18pt Arial";
    context2d.beginPath();
    context2d.fillText(parseInt(i) + 1, feedback.x - circleRadius/2, feedback.y + circleRadius/2);
  }
};

$(document).ready(function(){

  canvasHandle = document.getElementById("canvas");
  var designHandle = document.getElementById("imgDesign");
  var containerHandle = document.getElementById("floatingContainer");

  context2d = canvasHandle.getContext("2d");;

  designHandle.onload = function() {
    canvasHandle.width = designHandle.width;
    canvasHandle.height = designHandle.height;
  };

  canvasHandle.addEventListener("mousedown", function(evt) {
    var offset = $(this).offset();
    evt.stopPropagation();
    console.log(JSON.stringify(offset));
    var obj = {
      id: arrayFeedbacks.length + 1,
      x: evt.pageX - offset.left,
      y: evt.pageY - offset.top,
      text: "hello world"
    };

    arrayFeedbacks.push(obj);
    renderFeedbackVisuals();
  }, false);
}); 

