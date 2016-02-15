
var myFirebaseRef = new Firebase("https://semantics.firebaseio.com/");
var globalCounterNode = myFirebaseRef.child("global-counter");


var _getGlobalCounter = function(f) {
  globalCounterNode.once("value", function(ticker) {

    var gc = ticker.val();
    f(gc);
  });
};

var _incrementGlobalCounter = function() {
 globalCounterNode.once("value", function(ticker) {

    var gc = ticker.val();

    globalCounterNode.set(gc + 1, function(error) {
      f(gc);
      if(error) console.log("error: " + error);
    });
  });
}