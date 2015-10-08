
var arrayFeedbacks = [];

$(document).ready(function(){

  var canvasWidth = 450;
  var imgUrl = "https://m2.behance.net/rendition/pm/23685659/max_1200/be1c0f3d2bfb8c5f414129e768bf8b64.jpg"; //"http://i.imgur.com/9mwuTql.jpg"

  var canvasHandle = document.getElementById("canvas");
  var designHandle = document.getElementById("imgDesign");

  designHandle.onload = function() {
    canvasHandle.width = designHandle.width;
    canvasHandle.height = designHandle.height;

    context2d = canvasHandle.getContext("2d");
    context2d.beginPath();
    context2d.arc(100, 75, 50, 0, 2 * Math.PI);
    context2d.stroke();
  }

  canvasHandle.addEventListener("click", function(evt) {
    alert(evt.clientX + ", " + evt.clientY);

    arrayFeedbacks[] = {
      x: evt.clientX,
      y: evt.clientY
    }
  }, false);
}); 
