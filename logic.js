// Initialize Firebase "link", my API key 
var config = {
    apiKey: "AIzaSyAxEz88YbSOcVtrMZ5n7io8r22uTk7jOt8",
    authDomain: "train-schedule-ce605.firebaseapp.com",
    databaseURL: "https://train-schedule-ce605.firebaseio.com",
    projectId: "train-schedule-ce605",
    storageBucket: "gs://train-schedule-ce605.appspot.com",
    messagingSenderId: "844741581132"
};
firebase.initializeApp(config);


// Declaring global variables 
var database = firebase.database();

var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;


// insert the functions here / events 
$("#addTrain").on("click", function () {

    trainName = $('#nameInput').val().trim();
    destination = $('#destinationInput').val().trim();
    firstTrainTime = $('#firstTrainInput').val().trim();
    frequency = $('#frequencyInput').val().trim();

    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    });

    return false;
});


// Main application process  +  code for function 
database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val());

    // inserting updated variables with input 
    trainName = snapshot.val().trainName;
    destination = snapshot.val().destination;
    firstTrainTime = snapshot.val().firstTrainTime;
    frequency = snapshot.val().frequency;


    // moment.js methods for time calls and calculations. 
    // I'm not 100% sure that this is calculating properly - I may need help understanding what I'm missing 
    var firstTrainMoment = moment(firstTrainTime, 'HH:mm');
    var nowMoment = moment();

    // creates a moment object of current date and time and storing it in a variable whenever the user submits a train for tracking 

    var minutesSinceFirstArrival = nowMoment.diff(firstTrainMoment, 'minutes');
    var minutesSinceLastArrival = minutesSinceFirstArrival % frequency;
    var minutesAway = frequency - minutesSinceLastArrival;

    var nextArrival = nowMoment.add(minutesAway, 'minutes');
    var formatNextArrival = nextArrival.format("HH:mm");


    // adding the table for display 
    var tr = $('<tr>');
    var a = $('<td>');
    var b = $('<td>');
    var c = $('<td>');
    var d = $('<td>');
    var e = $('<td>');
    a.append(trainName);
    b.append(destination);
    c.append(frequency);
    d.append(formatNextArrival);
    e.append(minutesAway);
    tr.append(a).append(b).append(c).append(d).append(e);
    $('#newTrains').append(tr);


}, function (errorObject) {

    // Hoping to catch errors, if necessary, with this code 
    console.log("Failure: " + errorObject.code);

});