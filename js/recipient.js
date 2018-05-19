var baseUrl = 'https://backend.quze.co';

$(document).ready(function(){

    if (localStorage.getItem("type") === "issuer" && localStorage.getItem("issuerId") !== "" && localStorage.getItem("token") !== "") {
        window.location.replace("issuer.html");
    }
    else if (localStorage.getItem("type") === "recipient" && localStorage.getItem("recipientId") !== "" && localStorage.getItem("token") !== "") {
/*
        window.location.replace("recipient.html");
*/
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

    $("#welcomeRecipientHomeUserName").text(localStorage.recipientId);
	// from this function we dynamically add the username of the issuer 
	generateRecipientNavbar(localStorage.recipientId);

	// we are making the next call so as to show the certificates that have been issued inside the batch by the issuer
	/*$.ajax({
		url: baseUrl + "/recipientCertList/"+ localStorage.recipientId,
		success: function(result){
			var batchListData = result;
			console.log(batchListData);

			//this map function is the code that adds those fields to the table
			$.map(batchListData,function(batchListDataElement,index){
				var newAddedField = $("<tr onclick=\"callImage(this);\" id="+ batchListDataElement.certName +" data-toggle=\"modal\" data-target=\"#certModal\">\n" +
					"\t\t\t\t\t\t<td>" + batchListDataElement.issuerId +"</td>\n" +
					"\t\t\t\t\t\t<td>" + batchListDataElement.certName+ "</td>\n" +
					"\t\t\t\t\t</tr>");
				$("#BatchInfoTable").append(newAddedField);
			});
		}
	});*/
});// document.ready method ends

function generateRecipientNavbar(recipientId){
	$("#recipientId").prepend("<span>"+recipientId+"</span>");
}

var data;

// this is the dynamically calls the image through the api call as the user clicks on the row of the table
function callImage(element) {
	var myNode = document.getElementById("certImg");
	while (myNode.firstChild) { myNode.removeChild(myNode.firstChild); } // we do this to remove the previously stored image and then append the new image that we got from the api call down below
	$.ajax({
		url: baseUrl+"/downloadCert/"+element.id,
		success: function(result){
			console.log(result);
			data = result;
			var image = new Image(); // in the following three lines we create a new image object and add it inside the #certImage id in the dom
			image.src = result.badge.image;
			$("#certImg").append(image);
					
		}
	});
}

// this is used to verify the certificates that have been uploaded
function verifyCert(){

}

function logOut()
{
    var i = localStorage.length, key;
    while (i--)
    {
        key = localStorage.key(i);
        localStorage.removeItem(key);
    }

    var j = sessionStorage.length, key2;
    while(j--)
    {
        key2 = sessionStorage.key(j);
        sessionStorage.removeItem(key);
    }

    window.location.replace("signin.html");
}