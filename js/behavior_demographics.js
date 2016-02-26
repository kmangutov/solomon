
var id = getUrlVars();
var finished = false;

var getRadioVal = function(name) {
  return $('input[name=' + name + ']:checked').val();
}

var onSubmit = function(evt) {

  if(finished)
    return;


  var age = getRadioVal('age');
  var gender = getRadioVal('gender');
  var expertise = getRadioVal('expertise');
  var effort = getRadioVal('effort');
  var usefulness = getRadioVal('usefulness');

  if(!age || !gender || !expertise || !effort || !usefulness) {
    alert("Please fill out all fields.");
    return;
  }

  
  finished = true;
  $("#submit").text("Loading...");

  var structure = {
    time: id.ctime,
    code: id.code,
    age: age,
    gender: gender,
    expertise: expertise,
    effort: effort,
    usefulness: usefulness
  };

  SolomonService("demo").postOne(JSON.stringify(structure), function() {
    $("#submit").text("Thanks! Your code: " + id.code);
    //alert(JSON.stringify(structure));
  });
}

$(document).ready(function(){

  var submitHandle = $("#submit");
  submitHandle.prop('disabled', false);


  submitHandle.click(function(evt) {

    onSubmit(evt);
  });
});