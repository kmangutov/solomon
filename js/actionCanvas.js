var ActionCanvas = (function(){

  console.log("ActionCanvas.js");
  this.that = this;

  this.actionCanvasHandle;
  this.ctx;

  var canvasWidth;
  var canvasHeight;

  this.data = [[]];

  var SESSION_HEIGHT = 50.0;
  var SESSION_WIDTH = 800.0;

  var TIMESPAN_SECONDS = 300.0;//180.0;

  var COLOR_HOVER = "#550000";
  var COLOR_WRITE = "#005500";

  var onMouseMove = function(a) {}

  this.detail = new FloatingInput("floating-admin");

  var init = function(id) {
    this.actionCanvasHandle = $(id);
    var that = this;
    this.actionCanvasHandle.mousemove(function(evt) {
      
      var relX = evt.pageX - actionCanvasHandle.position().left;
      var relY = evt.pageY - actionCanvasHandle.position().top;

      var session = relY / SESSION_HEIGHT;
      var top = Math.round(session) == parseInt(session);
      session = parseInt(session);

      console.log("move");
      that.detail.move(evt.pageX + DETAIL_X_OFFSET, evt.pageY + DETAIL_Y_OFFSET);
      var seconds = relX / SESSION_WIDTH * TIMESPAN_SECONDS;

      if(data.length > session) {

        that.detail.setText("Session: " + session + " Sec:" + seconds.toFixed());

        for(var i in data[session]) {
          var action = data[session][i];

          var actionText = top? "hover" : "write";
          if(action.action !== actionText)
            continue;

          var start = parseFloat(action.start);
          var stop = parseFloat(action.stop);
          if(start <= seconds && seconds <= stop) {
            that.detail.setText("Session: " + action.feedback.code + " Duration: " + action.duration + " sec\n" + action.feedback.text);
          }
        }
      }
    });

    this.actionCanvasHandle.mouseenter(function(){that.detail.show();}); 
    this.actionCanvasHandle.mouseleave(function(){that.detail.hide();}); 

    this.ctx = actionCanvasHandle[0].getContext('2d');
  }

  var setData = function(data) {
    console.log("::setData " + JSON.stringify(data));
    this.data = data;
  }

  var DETAIL_X_OFFSET = -165;
  var DETAIL_Y_OFFSET = -190;

  var onMouseMove = function(evt) {
    console.log("ActionCanvas::onMouseMove " + x + ", " + y);

    var relX = evt.pageX - actionCanvasHandle.position().left;
    var relY = evt.pageY - actionCanvasHandle.position().top;

    var session = relX / SESSION_HEIGHT;
    var top = Math.round(session) == parseInt(session);



    that.detail.move(evt.pageX + DETAIL_X_OFFSET, evt.pageY + DETAIL_Y_OFFSET);
    that.detail.text("Session: " + session + "\nTop: " + top);
  }

  var render = function() {

    console.log("ActionCanvas::render");

    canvasWidth = SESSION_WIDTH;
    canvasHeight = 5000;

    var ctx = $("#admin-actions-canvas")[0].getContext('2d');
    ctx.fillStyle = "#FFF";
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth - 0, canvasHeight - 0);

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

        var width = (x2 - x1);
        var height = SESSION_HEIGHT / 2.0;

        ctx.fillStyle = row.action === "hover"? COLOR_HOVER : COLOR_WRITE;
        ctx.fillRect(x1, y1, width, height);
        ctx.fillStyle = "#FFF";
      }

      ctx.fillStyle = "#000";
      ctx.fillRect(0, SESSION_HEIGHT * j, SESSION_WIDTH, 1);
    }
  }

  return function(id) {

    init(id);
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
  actionCanvas = new ActionCanvas("#admin-actions-canvas");
});