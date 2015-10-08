$(document).ready(function(){

  var canvasWidth = 450;

  var canvas = document.getElementById("canvas");
  canvas.width = canvasWidth;

  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.onload = function() {
    var imgRatio = img.width / img.height;
        canvas.height = canvas.width / imgRatio;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.width / imgRatio);

  }
  img.src = "http://i.imgur.com/9mwuTql.jpg";

}); 
