var ActionStack = (function() {

  var timeZero = new Date().getTime() / 1000;
  var timeMs = function() {
    return (new Date().getTime() / 1000 - timeZero).toFixed(2);
  }

  var actionStack = [];


  var currentHover;
  var currentWrite;
  var currentEdit;

  var HoverAction = function() {
    this.action = "hover";
    this.start = timeMs();
    this.stop = 0;
    this.duration = -1;
    this.feedback;
  }

  var WriteAction = function() {
    this.action = "write";
    this.start = timeMs();
    this.stop = 0;
    this.duration = -1;
    this.feedback = {};
  }

  var EditAction = function() {
    this.action = "edit";
    this.start = timeMs();
    this.stop = 0;
    this.duration = -1;
    this.oldFeedback = {};
    this.newFeedback = {};
  }

  var FinishAction = function() {
    this.action = "finish";
    this.start = timeMs();
    this.stop = this.start;
    this.id = actionStack.length;
    this.duration = 0;
  }

  var applyDuration = function(obj) {
    var ms = timeMs() - obj.start;
    obj.duration = ms.toFixed(2);
    obj.stop = timeMs();
    obj.id = actionStack.length;
    return obj; 
  }

  return {

    getActionStack: function() {
      return actionStack;
    },

    startHover: function(feedback) {
      currentHover = new HoverAction();
      currentHover.feedback = feedback;
    },

    stopHover: function() {
      currentHover = applyDuration(currentHover);
      actionStack.push(currentHover);
      currentHover = {};
      console.log(JSON.stringify(actionStack));
    },

    startWrite: function(feedback) {
      currentWrite = new WriteAction();
      currentWrite.oldText = feedback.text;
    },

    stopWrite: function(feedback) {
      currentWrite.feedback = feedback;
      currentWrite.newText = feedback.text;
      currentWrite = applyDuration(currentWrite);
      actionStack.push(currentWrite);
      currentWrite = {};
      console.log(JSON.stringify(actionStack));
    },

    startEdit: function(feedback) {
      currentEdit = new EditAction();
      currentEdit.oldFeedback = feedback;
    },

    stopEdit: function(feedback) {
      currentEdit.newFeedback = feedback;
      currentEdit = applyDuration(currentEdit);
      actionStack.push(currentEdit);
      currentEdit = {};
      console.log(JSON.stringify(actionStack));
    },

    finish: function() {
      var finishAction = new FinishAction();
      actionStack.push(finishAction);
      console.log(JSON.stringify(actionStack));
    },

    elapsedTime: function() {
      return timeMs();
    },
  }

})();