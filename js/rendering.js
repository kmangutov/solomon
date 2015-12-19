var renderKnob = function(context2d, feedback, designWidth, designHeight) {
        
    var x = feedback.xFrac * designWidth;
    var y = feedback.yFrac * designHeight;

    context2d.fillStyle = "#FFF";
    context2d.strokeStyle = "#555";
    context2d.lineWidth = 2;
    context2d.beginPath();
    context2d.arc(x, y, circleRadius, 0, 2 * Math.PI);
    context2d.closePath();
    context2d.fill();
    context2d.stroke();

    context2d.strokeStyle = "#000";
    context2d.lineWidth = 1;
    context2d.beginPath();
    context2d.arc(x, y, circleRadius - 1, 0, 2 * Math.PI);
    context2d.closePath();
    context2d.stroke();

    context2d.fillStyle = "#ff9600";
    context2d.beginPath();
    context2d.arc(x, y, circleRadius - 5, 0, 2 * Math.PI);
    context2d.closePath();
    context2d.fill();
}