
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
FloatingInput.prototype.render = function() {
  this.visible? this.ref.show() : this.ref.hide();
  this.ref.css({left: this.x, top: this.y});
  this.ref.val(this.text);
};
FloatingInput.prototype.hide = function() {
  this.visible = false;
  this.render();
};
FloatingInput.prototype.show = function(bool) {
  this.visible = true;
  this.render();
}
FloatingInput.prototype.setText = function(text) {
  this.text = text;
  this.render();
}
FloatingInput.prototype.load = function(feedback) {
  this.x = canvasOffsetX + (feedback.xFrac * designWidth) + floatingOffsetX;
  this.y = canvasOffsetY + (feedback.yFrac * designHeight) + floatingOffsetY;
  this.text = feedback.text;
  this.visible = true;
  this.render();
};
FloatingInput.prototype.move = function(left, top) {
  this.x = left;
  this.y = top;
  this.render();
}
FloatingInput.prototype.focus = function() {
  var that = this;
  setTimeout(function() {

    var orig = that.ref.val();
    that.ref.val('');
    that.ref.blur().focus().val(orig);
    //that.ref.focus().val(that.ref.val());
  }, 100);
};
