  
var arrayFeedbacks = [];

var comments = [
  "I like the design.  I think it is creative and edgy.  It looks like it would be advertising ballroom dancing which is what the descriptions says.  So, I would say the poster is right on.  If anything, maybe add more color.",
  "I think the design is alright but would work much better if the background was purple and the figures and word \"dance\" were black.  The poster is easy to read and clearly states the dates, times, and locations.  I would print the poster.",
  "I like the color scheme, but I think the advertisement would be more effective if it featured a real dancing couple instead of a clip art image. Real photos grab my attention more.",
  "I think you should state what kind of dancing will be in this event. And perhaps what to wear. I would also change the design of the purple character, it looks a bit off against the black backround. I would probably put a real live dancing even photo on the backround of this poster and change the font of the words on this poster.",
  "I think the purple really pops and makes you look at the poster. I found myself looking for a price. Maybe the cost, if there is one could be listed in small print on the bottom left corner. I liked the font but wondered if there is a font that \"flows\" kind of like dance? This font is bold, which stands out well, but I wondered if there would be a bold font that represented dance more. I like the poster though!"    
];

var names = [
  "Julien",
  "Territory_Studio",
  "Moniker_SF",
  "Sam",
  "Yukai"
];

var subsentence = function(string, word_count) {
  return string.split(" ").slice(0, word_count).join(" ");
}  

var init = function() {
  for(var i = 0; i < 5; i++) {
    //$("#identity" + i).text("@" + names[i] + "");
    $("#comment" + i).text(subsentence(comments[i], 10) + "...");
  }
}

var bind = function() {
  $("[id^=action]").click(function(evt) {
    var id = this.id.slice(-1);
    var state = $("#show_more_" + id).val();
    console.log("state: " + state + " == 0?" + (state == "0"));
    if($("#show_more_" + id).val() == "0") {
      $("#comment" + id).text(comments[id]);
      $("#action" + id).text(" Show less");
      $("#show_more_" + id).val("1");
    } else {
      $("#comment" + id).text(subsentence(comments[id], 10) + "...");
      $("#action" + id).text(" Show more");
      $("#show_more_" + id).val("0");
    }
  });
 
  $("[id^=identity]").click(function(evt) {

    var id = this.id.slice(-1);
    var current = $("#feedback").val();
    var tag = this.text;
    $("#feedback").val(tag + " " + current);
  });
}

var generateCode = function() {

  return (Math.random() * 1000000 + "").substring(0, 4);
}

var finish = function(code) {

  $("#submit").text("Thanks! Your code is: " + code);
  $("#submit").prop('disabled', true);
}

var onSubmit = function(evt) {

  var code = generateCode();
  finish(code);

  var feedback = $("#input-feedback").val();
  console.log("onSubmit " + feedback);

  var submitTime = new Date().getTime();

  SolomonService("text").postOne(JSON.stringify([
    {
      submitTime: submitTime,
      code: code,
      vals: feedback
    }]));
}

$(document).ready(function(){

  init();
  bind();

  SolomonService("text").getAll(function f(data) {
    console.log(JSON.stringify(data));
  });

  var submitHandle = $("#submit");
  submitHandle.prop('disabled', false);

  submitHandle.click(function(evt) {
    onSubmit(evt);
  });


});