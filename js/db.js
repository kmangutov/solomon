



var dbGet = function(f) {

  // collecting design feedback pls no hack
  var session = "initial-v1-no-history";

  var a = "https://api.mon";
  var aa = "golab.com/api/1/databases/solo";
  var b = "mon/collections/sess";
  var c = "ion-" + session + "?ap";
  var ca = "iKey=iILS";
  var d = "3iwLqva8cQ7P0hEfeCI0JouzGX7-";


  $.get(a + aa + b + c + ca + d, function(data) {
    var obj = {

      getIds: function() {
        var ids = [];
        for(var i = 0; i < data.length; i++) {
          row = data[i];
          ids.push(row["code"]);
        }
        return ids;
      },

      dataFor: function(id) {
        console.log("::dataFor " + id);
        for(var i = 0; i < data.length; i++) {
          if(id === data[i]["code"]) {
            console.log("::dataFor return " + JSON.stringify(data[i]));
            return data[i];
          }
        }
        return "dataNotFound";
      },

      bindSelect: function(f) {

        var that = this;
        console.log("in ::bindSelect");

        $("#admin-select").change(function() {

          console.log("in #admin-select::change");
          var feedbacks = [];
          $("#admin-select option:selected").each(function() {
            var code = $(this).text();
            var vals = that.dataFor(code).vals;
            for(var i in vals) {
              vals[i].code = parseInt(code);
              console.log("push: " + JSON.stringify(vals[i]));
              feedbacks.push(vals[i]);
            }
          });
          f(feedbacks);
        });
      },

    }
    f(obj);
  });
}

$(document).ready(function(){

  dbGet(function(obj) {
    $.each(obj.getIds(), function(key, val) {
      $("#admin-select")
        .append($("<option></option>")
          .attr("value", val)
          .text(val));
    });
  });

});

