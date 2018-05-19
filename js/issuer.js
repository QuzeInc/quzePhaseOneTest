var baseUrl = 'https://backend.quze.co';

$(document).ready(function(){

    if (localStorage.getItem("type") === "issuer" && localStorage.getItem("issuerId") !== "" && localStorage.getItem("token") !== "") {
/*
        window.location.replace("issuer.html");
*/
    }
    else if (localStorage.getItem("type") === "recipient" && localStorage.getItem("recipientId") !== "" && localStorage.getItem("token") !== "") {
        window.location.replace("recipient.html");
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


	/*$.ajax({
			url: baseUrl+'/viewIssuerInfo/'+ localStorage.issuerId , // this call is made to get the information about the issuer
			success: function(result){
				var issuerData = result;
				console.log(issuerData);
				if(issuerData.initialized === 0)
				{
					alert("You haven't initialized your profile information. We need it for issuing. This will redirect you to the profile page");
					window.location.replace("profile.html");
				}
				else
				{
					generateIssuerNavbar(issuerData);
					generateIssuerDashboard(issuerData);
                }
			}
		});*/

/*
	fileUpload();
*/
});

//this generates the issuer navbar according to the issuer data
function generateIssuerNavbar(issuerData){
	$("#issuerId").prepend("<span>"+ issuerData.issuerId+"</span>");
}

//this generates the issuer dashboard according to the issuer data
function generateIssuerDashboard(issuerData)
{
	//iterates through each and every batch id
	$.map(issuerData.batchIds,function(batchId,index){
			$.ajax({
				url: "http:localhost:8080/viewBatchInfo/" + batchId, //makes this call to create the card of the batch contents.
				success: function(result){batchData = result},
				statusCode : {200 : function(){
						console.log(batchData);

						var newAddedDiv = $("<div class='col-md-3 cardDisplayingBatches' onclick='redirect(this);'><h3><span style='color:orange'>Title</span> : " + batchData.title + "</h3><hr /><h4><span style='color:orange'> Description</span> : " + batchData.description + "</h4><h4><span style='color:orange'>Num of Certs</span> : "+ batchData.numCerts+"</h4></div>");
						newAddedDiv.attr('id',batchData.batchId);
						newAddedDiv.attr('style','margin-left:60px;');
						$("#containerDisplayingBatches").prepend(newAddedDiv);
					}
				}
			})
		}
	);
}

//the function redirects the user to the new page according to the card of the batch clicked
function redirect(element){
	var batchId = element.id;
	$.ajax({
		url: "http:localhost:8080/viewBatchInfo/"+batchId, //makes this call to create the card of the batch contents.
		success: function(result){
			var batchData = result;
			if(batchData.batchStatus >= 3){
				sessionStorage.setItem("batchId",batchId);
				window.location.replace("verify.html");
			}
			else
			{
				console.log(batchData.batchStatus);
			}
		}
    });
}

//this is the code that adds multiple files as uploaded by the user to the browser and displays it to the screen

function fileUpload() {
	document.querySelector('#imageUpload').addEventListener('change', handleImageFileSelect, false);
	selImgDiv = document.querySelector("#selectedImageFiles");
	document.querySelector('#CSVUpload').addEventListener('change', handleCSVFileSelect, false);
	selCSVDiv = document.querySelector("#selectedCSVFiles");
}

	//handles the image upload
	function handleImageFileSelect(e) {
		
		if(!e.target.files) return;
		
		selImgDiv.innerHTML = "";

		var files = e.target.files;
		for(var i=0; i<files.length; i++) {
			var f = files[i];
			
			selImgDiv.innerHTML += f.name + "<br/>";
		}
	}

	//handles the csv upload
	function handleCSVFileSelect(e) {
		
		if(!e.target.files) return;
		
		selCSVDiv.innerHTML = "";

		var files = e.target.files;
		for(var i=0; i<files.length; i++) {
			var f = files[i];
			
			selCSVDiv.innerHTML += f.name + "<br/>";
		}
	}

function issue(){
	var title = String($("#title").val());
	var description = String($("#description").val());
	var numCerts = $("#numCerts").val();
	var dataObj = JSON.stringify({"title":title,"description":description,"numCerts":parseInt(numCerts,10),"batchId":"","issuerId":localStorage.issuerId});
	var headers = {"Content-Type":"application/json;charset=UTF-8"};
	console.log(dataObj);

	$.ajax({
		type: 'POST',
		url: 'http://localhost:8080/createBatch', //makes the api call for issuing the batch
		data: dataObj,
		headers:headers,
		success: function(resp) {

			sessionStorage.setItem("newBatchId",resp);
            console.log(sessionStorage.newBatchId);

			var formData = new FormData();
			var imgFiles = document.forms['fileUploadForm'].imageUpload.files;
			var CSVFiles = document.forms['fileUploadForm'].CSVUpload.files;
			
			for(var i = 0; i<imgFiles.length;i++){
				formData.append("file",imgFiles[i]);
			}
			for(var i = 0; i<CSVFiles.length;i++){
				formData.append("file",CSVFiles[i]);
			}

			$.ajax({
				type: "POST",
				enctype: 'multipart/form-data',
				url: baseUrl + "/uploadRawData/"+localStorage.issuerId + '/' + sessionStorage.newBatchId,
				data: formData,
				processData: false,
				contentType: false,
				cache: false,
				timeout: 600000,
				success: function (data){
					console.log("SUCCESS : ", data);
					$.ajax({
						url: baseUrl + "/certProcessTrigger/" + localStorage.issuerId+'/'+sessionStorage.newBatchId,
						success: function(result){
							console.log("Done!");
						}
					});
				},
				error: function (e) {
					console.log("ERROR : ", e);
				}
			});
		}
	});

    var newAddedDiv = $("<div class='col-md-3 cardDisplayingBatches' onclick='redirect(this);'><h3><span style='color:red'>Title</span> : " + title + "</h3><hr /><h4><span style='color:red'>Description</span> : " + description + "</h4><h4><span style='color:red'>	Num of Certs</span> : "+ numCerts+"</h4> <h4><span style='color:red'>Note</span> : The batch is in progress. Please Reload for viewing</h4></div>");
/*
    newAddedDiv.attr('id',sessionStorage.newBatchId);
*/
    newAddedDiv.attr('style','margin-left:60px;background-color:#cdcdcd');
    $("#containerDisplayingBatches").prepend(newAddedDiv);
}

function logOut()
{
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