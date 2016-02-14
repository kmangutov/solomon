
var myFirebaseRef = new Firebase("https://semantics.firebaseio.com/");
var globalCounterNode = myFirebaseRef.child("global-counter");


var _getGlobalCounter = function(f) {
  globalCounterNode.once("value", function(ticker) {

    var gc = ticker.val();
    alert("Global Counter: " + gc); 

    globalCounterNode.set(gc + 1, function(error) {
      f(gc);
      if(error) console.log("error: " + error);
    });
  });
};