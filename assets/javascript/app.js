$(document).ready(function(){
  // Create a variable to reference the database.
  var database = firebase.database();
  var currentUser = "";
  var currentStatus = "";
  var storedData = JSON.parse(sessionStorage.getItem('userData'));
  console.log(storedData);
  // -----------------------------
  // DOM events
  $("#update").hide();
  var firstName = "";
  var lastName = "";
  var email = "";
  var imageUrl = "";
  var bio ="";
  var role = "";
  // var url = window.location.search;
  // var currentStatus = url ? url.split('?')[1] : window.location.search.slice(1);
  // console.log(currentStatus);
  if(storedData){
    if (storedData.status && storedData.currentUser) {
      console.log(storedData);
      currentUser = storedData.currentUser;
      currentStatus = storedData.status;
      console.log("user:"+currentUser);
      console.log("status:"+currentStatus);
    }else{
      location.href = "login.html";
    }
  }else{
    location.href = "login.html";
  }  
  //var currentUser = sessionStorage.getItem("current-user");
  //currentStatus = false;      
  // Add new value to database when add user button is clicked
  $("#addUser").on("click", function (event) {
    event.preventDefault();
    // Check if user is logged in before allowing to add to the database 
    //var userImage = "assets/images/"+ $("#imageUrl").val().trim();
    
    if(currentStatus) { 
      firstName = capitalizeStr($("#firstName").val().trim()),
      lastName = capitalizeStr($("#lastName").val().trim()),  
      email =  $("#email").val().trim(),  
      imageUrl = $("#imageUrl").val().trim(),
      bio = $("#bio").val().trim(),
      role = $('input[name="role"]:checked').val()
      var myKey = firebase.database().ref().push().key;
      
      database.ref('users/').push({
        firstName: firstName,
        lastName: lastName,
        email: email,
        imageUrl: imageUrl,
        bio: bio,
        role: role,
        id: myKey
      });
                                
      // Clear the input fields after data is added to database
      $("#message").val("");
      $("#firstName").val("");
      $("#lastName").val("");
      $("#email").val("");
      $("#imageUrl").val("");
      $("#bio").val("");
      $("#role").val("");
    }else {
      $("#message").text("Sign In to add a user!");
    }  
  });

// Function handles the deletion of records
  $("body").on("click", "#delete", function(e){
    e.preventDefault();
    // var yourPopoverContent = 'You have to be signed in to delete!';
    //   $(this).popover({
    //       content : yourPopoverContent,
    //       placement: 'left'      
    //   });
    if(currentStatus) {
      var key = $(this).attr("data-key");
      database.ref('users/').orderByChild('id').equalTo(key).once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          //remove each child
          database.ref('users/').child(childSnapshot.key).remove();
        });
      });
    }else {
       // var $this = $(this);
       // $this.popover('show');
       // setTimeout(function() {$this.popover('dispose')},2000);
       $("#message").text("Sign In to delete a user!");
    }  
  });

  // Function handles the editing of records
  $("body").on("click", "#edit", function(e){
    e.preventDefault();
    // var yourPopoverContent = 'You have to be signed in to edit!';
    //     $(this).popover({
    //         content : yourPopoverContent,
    //         placement: 'left'      
    // });
    if(currentStatus) {
      $("#update").show();
      var key = $(this).attr("data-key");
      database.ref('users/').orderByChild("id").equalTo(key).once('value').then(function(snapshot){
          var data = Object.values(snapshot.val())[0]; 
          var dataKey = Object.keys(snapshot.val())[0];
         
          $("#firstName").val(data.firstName);
          $("#lastName").val(data.lastName);
          $("#email").val(data.email);
          $("#imageUrl").val(data.imageUrl);
          var userRole = $("input[type=radio]").val();
          console.log(userRole);
          $(eval("'#"+userRole+"'")).prop("checked", true);
          $("#update").attr("data-id", dataKey);
      });
    }else {
       // var $this = $(this);
       // $this.popover('show');
       // setTimeout(function() {$this.popover('dispose')},2000);
       $("#message").text("Sign In to edit a user!");
    }    
  });  

  $("#update").on("click", function(e) {
        e.preventDefault();
        if(currentStatus){
          capturetData();
          var userId = $(this).attr("data-id");
          database.ref('users/').child(userId).update({firstName:firstName, lastName:lastName, email:email, imageUrl:imageUrl, bio:bio, role:role});
          
          // Clear the input fields after data is added to database
          $("#message").val("");
          $("#firstName").val("");
          $("#lastName").val("");
          $("#email").val("");
          $("#imageUrl").val("");
          $("#bio").val("");
          $("#role").val("");
      }else {
            $("#message").text("Sign In to edit user details!");
     }    
    });
  // -----------------------------------------------------------------------------
  // Database CRUD operations
  // General function to capture data entered in form 
  function capturetData(){
      firstName = capitalizeStr($("#firstName").val().trim()),
      lastName = capitalizeStr($("#lastName").val().trim()),  
      email =  $("#email").val().trim(),  
      imageUrl = $("#imageUrl").val().trim(),
      bio = $("#bio").val().trim(),
      role = $('input[name="role"]:checked').val()
  }

  // Function checks for new child added to database and updates the html display    
  database.ref('users/').on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();
    renderData(sv);
  // Handle the errors
  }, function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
  });

// Function checks for change in child and updates the html display    
  database.ref('users/').on("child_changed", function (snapshot) {
     database.ref('users/').once('value', function(snapshot) {
        var users = [];
       snapshot.forEach(function(childSnapshot) {
         var childKey = childSnapshot.key;
         var childData = childSnapshot.val();
         users.push(childData);
       });
       $("#data-panel").empty(); 
       renderOnChange(users);
    });
   
  // Handle the errors
  }, function (errorObject) {
      console.log("inside added");
      console.log("Errors handled: " + errorObject.code);
  });

  // Function checks for deletion of child and updates the html display    
  database.ref('users/').on("child_removed", function (snapshot) {
    database.ref('users/').once('value', function(snapshot) {
        var users = [];
       snapshot.forEach(function(childSnapshot) {
         var childKey = childSnapshot.key;
         var childData = childSnapshot.val();
         users.push(childData);
       });
       $("#data-panel").empty(); 
       renderOnChange(users);
    });
    
  // Handle the errors
  }, function (errorObject) {
      console.log("inside added");
      console.log("Errors handled: " + errorObject.code);
  });


// DOM rendering functions
function renderData(sv) {
    console.log("inside render");
    var col = $("<div>");
    //col.addClass("cell");
    col.addClass("col");
    var image = $("<img>");
    image.attr("src", sv.imageUrl);
    image.attr("id", "userImg");
    image.attr("data-email", sv.email);
    var heading = $("<h5>");
    heading.html(sv.firstName+ ""+sv.lastName);
    var dataButtons = $("<span>");
    var btn = $("<span>");
    btn.attr("id", "delete");
    btn.html("<i class='fa fa-trash' aria-hidden='true'>");
    btn.addClass("btn waves-effect waves-light left");
    btn.attr("data-key", sv.id);
    var editBtn = $("<span>");
    editBtn.attr("id", "edit");
    editBtn.html("<i class='fa fa-pencil' aria-hidden='true'></i>");
    editBtn.addClass("btn waves-effect waves-light left");
    editBtn.attr("data-key", sv.id);
    dataButtons.append(btn).append(editBtn);
    col.append(image).append(heading).append(dataButtons);
    if(sv.role === "Student"){
      $("#student-panel").append(col);
    }else{
      $("#staff-panel").append(col);
    }
  }

function renderOnChange(data) {
  
  //$("#data-panel").empty();
  $("#student-panel").empty();
  $("#staff-panel").empty();
  data.forEach(function(item){
    var col = $("<div>");
    col.addClass("col");
    var image = $("<img>");
    image.attr("src", item.imageUrl);
    image.attr("id", "userImg");
    image.attr("data-email", item.email);
    var heading = $("<h5>");
    heading.html(item.firstName+ ""+item.lastName);
    var dataButtons = $("<span>");
    var btn = $("<span>");
    btn.attr("id", "delete");
    btn.html("<i class='fa fa-trash' aria-hidden='true'>");
    btn.addClass("btn waves-effect waves-light left");
    btn.attr("data-key", item.id);
    var editBtn = $("<span>");
    editBtn.attr("id", "edit");
    editBtn.html("<i class='fa fa-pencil' aria-hidden='true'></i>");
    editBtn.addClass("btn waves-effect waves-light left");
    editBtn.attr("data-key", item.id);
    dataButtons.append(btn).append(editBtn);
    col.append(image).append(heading).append(dataButtons);
    //$("#data-panel").append(col);
    if(item.role === "Student"){
      $("#student-panel").append(col);
    }else{
      $("#staff-panel").append(col);
    }
  });  
}

$("body").on("click", "#userImg", function(){
    var user =$(this).attr("data-email");
    console.log(user);
    sessionStorage.setItem("calOwner", user);
    //location.href = "display-events.html?"+user;
    location.href = "display-events.html";
});

// Utility functions
// Function to capitalize the first letter of each category
  function capitalizeStr(str) {
    var strArray = str.split(" ");
    var newStr = "";
    strArray.forEach(function(item) {
      newStr += item.charAt(0).toUpperCase() + item.slice(1)+ " ";
    });
      return newStr;
  }
});