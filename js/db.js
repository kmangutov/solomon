



var dbGet = function(session, f) {

  // collecting design feedback pls no hack
  //var session = "history-v1";
  //var session = "initial-v1-no-history";

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

      loadSpecific: function(f) {

        var that = this;

        var feedbacks = [];
        ["3557", "4543"].forEach(function(item) {
          var vals = that.dataFor(item).vals;
          for(var i in vals) {
            vals[i].code = parseInt(item);

            vals[i].x = vals[i].x.toFixed(2);
            vals[i].y = vals[i].y.toFixed(2);

            vals[i].xFrac = vals[i].xFrac.toFixed(2);
            vals[i].yFrac = vals[i].yFrac.toFixed(2);

            feedbacks.push(vals[i]);
          }    
        });

        f(feedbacks);
      },

      bindSelect: function(f) {

        var that = this;
        $("#admin-select").change(function() {
          var feedbacks = [];
          $("#admin-select option:selected").each(function() {
            var code = $(this).text();
            var vals = that.dataFor(code).vals;
            for(var i in vals) {
              vals[i].code = parseInt(code);
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

  dbGet("initial-v1-no-history", function(obj) {
    $.each(obj.getIds(), function(key, val) {
      $("#admin-select")
        .append($("<option></option>")
          .attr("value", val)
          .text(val));
    });
  });

});

