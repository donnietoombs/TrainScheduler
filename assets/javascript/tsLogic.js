
// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAJfTzlXOglMyzAqoI5ArjhLhP1bJENMdY",
    authDomain: "trainscheduler-79945.firebaseapp.com",
    databaseURL: "https://trainscheduler-79945.firebaseio.com",
    projectId: "trainscheduler-79945",
    storageBucket: "trainscheduler-79945.appspot.com",
    messagingSenderId: "445951479494"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding Trains
  $("#addTrainBtn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#trainNameInput").val().trim();
    var trainDest = $("#destInput").val().trim();
    var trainStart =$("#trainStartInput").val().trim();
    var trainFreq = $("#trainFreqInput").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      tname: trainName,
      tdest: trainDest,
      tstart: trainStart,
      tfreq: trainFreq
    };

    // Uploads train data to the database
    database.ref().push(newTrain);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#trainNameInput").val("");
    $("#destInput").val("");
    $("#trainStartInput").val("");
    $("#trainFreqInput").val("");
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().tname;
    var trainDest = childSnapshot.val().tdest;
    var trainStart = childSnapshot.val().tstart;
    var trainFreq = childSnapshot.val().tfreq;
  
  
    var firstTimeConverted = moment(trainStart, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
  
    // Time apart (remainder)
    var tRemainder = diffTime % trainFreq;
    console.log(trainFreq);
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"))


  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDest),
      $("<td>").text(trainFreq),
      $("<td>").text(nextTrain),
      $("<td>").text(tMinutesTillTrain),
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  
