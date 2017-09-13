$(document).ready(function(){
var config = {
        apiKey: "AIzaSyDmKpVmVd3N_dA4wAKrxX6L-pqxDvDXNAk",
        authDomain: "scheduler-708c6.firebaseapp.com",
        databaseURL: "https://scheduler-708c6.firebaseio.com",
        projectId: "scheduler-708c6",
        storageBucket: "",
        messagingSenderId: "545118572679"
      };
      firebase.initializeApp(config);
      // Create a variable to reference the database.
      var database = firebase.database();

      // -----------------------------
      var firstName = "";
      var lastName = "";
      var email = "";
      var imageUrl = "";
      var bio ="";
      var role = "";

      var userObject = {};
      // connectionsRef references a specific location in our database.
      // All of our connections will be stored in this directory.
      // var connectionsRef = database.ref("/connections");

      // '.info/connected' is a special location provided by Firebase that is updated
      // every time the client's connection state changes.
      // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
      // var connectedRef = database.ref(".info/connected");
      // Add new value to database when add train button is clicked

  $("#addUser").on("click", function (event) {
    event.preventDefault();
    // Check if user is logged in before allowing to add to the database    
      // firstName = capitalizeStr($("#firstName").val().trim());
      // lastName = capitalizeStr($("#lastName").val().trim());
      // email = capitalizeStr($("#email").val().trim());
      // imageUrl = $("#imageUrl").val().trim();
      // bio = $("#bio").val().trim();
      // role = $('input[name="role"]:checked').val();
      userObject = {firstName: capitalizeStr($("#firstName").val().trim()),
                    lastName: capitalizeStr($("#lastName").val().trim()),
                    email:  capitalizeStr($("#email").val().trim()),
                    imageUrl: "assets/images/"+ $("#imageUrl").val().trim(),
                    bio: $("#bio").val().trim(),
                    role: $('input[name="role"]:checked').val()
                   }
      
        var myKey = firebase.database().ref().push().key;
                  
        database.ref().push({
          // firstName: firstName,
          // lastName: lastName,
          // email: email,
          // imageUrl: imageUrl,
          // bio : bio,
          // role: role,
          // id: myKey
          userInfo: userObject,
          id: myKey
        });
                                
        // Clear the input fields after data is added to database
       
       
        $("#firstName").val("");
        $("#lastName").val("");
        $("#email").val("");
        $("#imageUrl").val("");
        $("#bio").val("");
        $("#role").val("");
      
  });
  // Function to capitalize the first letter of each category
  function capitalizeStr(str) {
    var strArray = str.split(" ");
    var newStr = "";
    strArray.forEach(function(item) {
      newStr += item.charAt(0).toUpperCase() + item.slice(1)+ " ";
    });
      return newStr;
  }

  // Function checks for new child added to database and updates the html display    
  database.ref().on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();
    renderData(sv);

  // Handle the errors
  }, function (errorObject) {
      console.log("inside added");
      console.log("Errors handled: " + errorObject.code);
  });

  function renderData(sv) {
    console.log(sv);
    var col = $("<div>");
    col.addClass("column");
    var image = $("<img>");
    image.attr("src", sv.userInfo.imageUrl);
    var heading = $("<h5>");
    heading.html(sv.userInfo.firstName+ ""+sv.userInfo.lastName);
    col.append(image).append(heading);
    $("#data-panel").append(col);

  }

});
