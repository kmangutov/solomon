var ActionCanvas = (function(){

  var that = this;

  var canvasHandle;
  var context2d;

  var canvasWidth;
  var canvasHeight;

  this.data = [[]];

  var SESSION_HEIGHT = 50.0;
  var SESSION_WIDTH = 800.0;

  var TIMESPAN_SECONDS = 120.0;

  var COLOR_HOVER = "#550000";
  var COLOR_WRITE = "#005500";

  var setData = function(data) {
    console.log("::setData " + JSON.stringify(data));
    this.data = data;
  }

  var updateLocalSize = function() {
    canvasWidth = canvasHandle.width();
    canvasHeight = canvasHandle.height();
  }

  var render = function() {

    console.log("ActionCanvas::render " + this.data.length);

    //canvasHandle.width(SESSION_WIDTH);
    //canvasHandle.height(SESSION_HEIGHT * this.data.length);

    canvasWidth = SESSION_WIDTH;
    canvasHeight = 5000;//SESSION_HEIGHT * 6;//this.data.length;
    //updateLocalSize();

    //context2d.clearRect(0, 0, canvasWidth, canvasHeight);


    context2d.fillStyle = "#FFF";
    context2d.clearRect(0, 0, canvasWidth, canvasHeight);
    context2d.fillRect(0, 0, canvasWidth - 0, canvasHeight - 0);

    for(var j in this.data) {

      var session = this.data[j];
      for(var i in session) {

        var row = session[i];

        var x1 = parseFloat(row.start) / TIMESPAN_SECONDS * SESSION_WIDTH;
        var x2 = parseFloat(row.stop) / TIMESPAN_SECONDS * SESSION_WIDTH;

        //shift write rows by half a height
        //offset it by number of sessions (j)
        var y1 = SESSION_HEIGHT * j;// * i;
        y1 += row.action === "write"? SESSION_HEIGHT / 2.0 : 0;
        //var y2 = SESSION_HEIGHT;// * (i + 1);

        var width = (x2 - x1);
        //var height = (y2 - y1);
        var height = SESSION_HEIGHT / 2.0;

        //console.log("ROW: " + JSON.stringify(row));
        console.log(j + " : " + JSON.stringify([x1, y1, width, height]));

        context2d.fillStyle = row.action === "hover"? COLOR_HOVER : COLOR_WRITE;
        context2d.fillRect(x1, y1, width, height);
        context2d.fillStyle = "#FFF";
      }

      context2d.fillStyle = "#000";
      context2d.fillRect(0, SESSION_HEIGHT * j, SESSION_WIDTH, 1);

    }
  
  }

  var onResize = function() {
    canvasWidth = canvasHandle.width();
    canvasHeight = canvasHandle.height();
    //render();
  };


  return function(id) {
    canvasHandle = $(id);
    context2d = canvasHandle[0].getContext('2d');
    //canvasHandle.resize(onResize);

    onResize();

    return {
      load: function(inn) {
        setData(inn);
        render();
      }
    }
  }

})();

var actionCanvas;


$(document).ready(function(){
  actionCanvas = ActionCanvas("#admin-actions-canvas");
});