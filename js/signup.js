$(document).ready(function(){
    if (localStorage.getItem("type") === "issuer" && localStorage.getItem("issuerId") !== "" && localStorage.getItem("token") !== "") {
        window.location.replace("issuerHome.html");
    }
    else if (localStorage.getItem("type") === "recipient" && localStorage.getItem("recipientId") !== "" && localStorage.getItem("token") !== "") {
        window.location.replace("recipientHome.html");
    }
    else {
        var i = localStorage.length;
        var key;
        while (i--) {
            key = localStorage.key(i);
            localStorage.removeItem(key);
        }

        var j = sessionStorage.length;
        var key2;
        while (j--) {
            key2 = sessionStorage.key(j);
            sessionStorage.removeItem(key2);
        }
    }
});

// the back button that allows to go between the screens
$("#internalBackBtn").click(function () {
	$("#firstPage").css("display", "block");
	$("#secondPage").css("display", "none");
	$("#internalBackBtn").css("display", "none");
});


var baseUrl = 'https://backend.quze.co';

var type = '';

function signup() {
	var email = $("#inputUserEmail").val();
	var userId = $("#inputUserName").val();
	var password = $("#inputPassword").val();

	if(email === "" || userId === "" || password === "")
	{
		alert("Please Fill out all the details to proceed!");
		return;
	}

	var data = {'userId':userId,'email':email,'password':password,'type':type};
	data = JSON.stringify(data);

	var headers = {'Content-Type':'application/json;charset=utf8'};

    //it makes three consecutive ajax calls..., the first one to check whether a user with the give username exists or not if not make one, 
    //the second to the login url to get the token of the already created user and the third one to actually replace the user to the given page
	$.ajax({
        url: baseUrl + '/register',
        type: "POST",
        data: data,
        headers: headers,
        success: function (result) {
            if (result.message === "User Exists") {
                alert("User Already Exists. Please try another User Name");
            }
            else {
                $.ajax({
                    url: baseUrl + '/login',
                    type: 'POST',
                    data: JSON.stringify({'userId': userId, 'password': password}),
                    headers: headers
                }).done(function (data, textStatus, request) {
                    localStorage.setItem('token',request.getResponseHeader("authorization"));
                    localStorage.setItem('type',type);
                    if(type==='issuer')
                    {
                    	localStorage.setItem('issuerId',userId);
                    	window.location.replace("issuerHome.html");
                    }
                    else
                    {
                    	localStorage.setItem('recipientId',userId);
                    	window.location.replace("recipientHome.html");
                    }
                });
            }
        }
    })
}

// used to check which kind of login button was clicked from the first screen
function typeOfLogin(clicked_id){
	if (clicked_id === 'studentLoginButton') {
        type = 'recipient';
        $("#secondPageHeading").text("STUDENT");
    }
	else if (clicked_id === 'institutionLoginButton') {
        type = 'issuer';
        $("#secondPageHeading").text("INSTITUTION");
    }
	else {
        type = 'employer';
        $("#secondPageHeading").text("EMPLOYER");
    }

	$("#firstPage").css("display", "none");
	$("#secondPage").css("display", "block");
	$("#internalBackBtn").css("display", "block");
}

