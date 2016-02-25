


function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
  function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

var SolomonService = function(type) {

  var session = "v6-" + type + "";

  var a = "https://api.mon";
  var aa = "golab.com/api/1/databases/solo";
  var b = "mon-real3/collections/prod";
  var c = "-" + session + "?ap";
  var ca = "iKey=iILS";
  var d = "3iwLqva8cQ7P0hEfeCI0JouzGX7-";


  return {
  
    getAll: function(f) {
      console.log("SolomonService::getAll");
      $.get(a + aa + b + c + ca + d, function(data) {
        f(data);
      });
    },

    postOne: function(data, f) {
      console.log("SolomonService::postOne " + data);
      $.ajax( { url: a + aa + b + c + ca + d,
        data: data,
        type: "POST",
        contentType: "application/json" })
      .done(function() {
        console.log("SolomonService::postOne done")
        f();
      })
      .fail(function(e) {
        console.log("SolomonService::postOne fail: " + e);
        alert("Problem: " + JSON.stringify(e));
      });
    }

  }
}