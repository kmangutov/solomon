var renderKnob = function(context2d, feedback, designWidth, designHeight, code) {
    
    if('active' in feedback)
        return;

    code = code || 0;

    //console.log("render " + JSON.stringify(feedback));
    var target = (code == feedback.code);
    var radius = circleRadius;
    if(target) {
        radius *= 1.8;
    }

    var x = feedback.xFrac * designWidth;
    var y = feedback.yFrac * designHeight;

    //console.log("X:" + x + " xFrac: " + feedback.xFrac + ", width: " + designWidth);
    //console.log("Y:" + y + " yFrac: " + feedback.yFrac + ", height: " + designHeight);

    context2d.fillStyle = "#FFF";
    context2d.strokeStyle = "#555";
    context2d.lineWidth = 2;
    context2d.beginPath();
    context2d.arc(x, y, radius, 0, 2 * Math.PI);
    context2d.closePath();
    context2d.fill();
    context2d.stroke();

    context2d.strokeStyle = "#000";
    context2d.lineWidth = 1;
    context2d.beginPath();
    context2d.arc(x, y, radius - 1, 0, 2 * Math.PI);
    context2d.closePath();
    context2d.stroke();

    if(!target)
        context2d.fillStyle = "#ff9600";
    else
        context2d.fillStyle = "#00688B";
    context2d.beginPath();
    context2d.arc(x, y, radius - 5, 0, 2 * Math.PI);
    context2d.closePath();
    context2d.fill();
}