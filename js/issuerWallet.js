var baseUrl = 'https://backend.quze.co';

$(document).ready(function(){

	//testing if the local storage has been properly
	if (localStorage.getItem("type") === "issuer" && localStorage.getItem("issuerId") !== "" && localStorage.getItem("token") !== "") {}
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
		window.location.replace("signin.html");
	}

	//makes this call to get the information to generate navbar 
	$.ajax({
		url: baseUrl+'/viewIssuerInfo/'+ localStorage.issuerId , // this call is made to get the information about the issuer
		headers:{'Authorization':localStorage.token},
		success: function(result){
			var issuerData = result;
			console.log(issuerData);
			if(issuerData.initialized === 0){
				alert("You haven't initialized your profile information. We need it for issuing. This will redirect you to the profile page");
				window.location.replace("issuerHome.html");
			}
			else{
				generateIssuerNavbar(issuerData);
			}
		}
	});
});

//generating the issuer navbar
function generateIssuerNavbar(issuerData){
	$("#issuerId").prepend("<span>"+ issuerData.issuerId+"</span>");
}

function logOut() {
    var i = localStorage.length;
    var key;
    while (i--)
    {
        key = localStorage.key(i);
        localStorage.removeItem(key);
    }

    var j = sessionStorage.length;
    var key2;
    while(j--)
    {
        key2 = sessionStorage.key(j);
        sessionStorage.removeItem(key2);
    }
    window.location.replace("signin.html");

}