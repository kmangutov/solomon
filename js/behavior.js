$(document).ready(function(){

  var canvasWidth = 450;
  var imgUrl = "https://m2.behance.net/rendition/pm/23685659/max_1200/be1c0f3d2bfb8c5f414129e768bf8b64.jpg"; //"http://i.imgur.com/9mwuTql.jpg"



  var canvas = document.getElementById("canvas");
  canvas.width = canvasWidth;

  var ctx = canvas.getContext("2d");


  var img = new Image();
  img.onload = function() {
    var imgRatio = img.width / img.height;
    var canvasHeight = parseInt(canvasWidth / imgRatio);

    var canvasContainer = document.getElementById("canvasContainer");
    canvasContainer.innerHTML = "<canvas id='canvas2' width='" + canvasWidth + "' height='" + canvasHeight + "'></canvas>";
    var canvas = document.getElementById("canvas2");
    var ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  img.src = imgUrl;

}); 
