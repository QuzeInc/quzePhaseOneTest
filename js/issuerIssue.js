// Modal Logic
var stateBatchCreation = 0;

function createBatchButton(){
	if (!stateBatchCreation){
		$("#createBatch").css("display", "none");
		$("#removeModal").css("display", "block");
		$("#createBatchButtonModal").css("display", "block");
	}
	else{
		$("#createBatch").css("display", "block");
		$("#removeModal").css("display", "none");
		$("#createBatchButtonModal").css("display", "none");
	}
	stateBatchCreation = (stateBatchCreation+1)%2;
}

function batchCreationDialog(){
	createBatchButton();
	$("#batchCreationDialogModal").css("display", "block");
}

function closeBatchCreateDialog(){
	$("#batchCreationDialogModal").css("display", "none");
}


// Issuer.js Logic
var baseUrl = 'https://backend.quze.co';

$(document).ready(function(){

	// looking if the user is on the right page or not
	if (localStorage.getItem("type") === "issuer" && localStorage.getItem("issuerId") !== "" && localStorage.getItem("token") !== ""){
	}
	else if (localStorage.getItem("type") === "recipient" && localStorage.getItem("recipientId") !== "" && localStorage.getItem("token") !== ""){
		window.location.replace("recipientHome.html");
	}
	else{
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


	$.ajax({
		url: baseUrl+'/viewIssuerInfo/'+ localStorage.issuerId , // this call is made to get the information about the issuer
		headers:{'Authorization':localStorage.token},
		success: function(result){
			var issuerData = result;
			console.log(issuerData);
			if(issuerData.initialized === 0)
			{
				alert("You haven't initialized your profile information. We need it for issuing. This will redirect you to the profile page");
				window.location.replace("issuerHome.html");
			}
			else
			{
				generateIssuerNavbar(issuerData);
				generateIssuerDashboard(issuerData);
			}
		}
	});

	fileUpload();
});

//this generates the issuer navbar according to the issuer data
function generateIssuerNavbar(issuerData){
	$("#issuerId").prepend("<span>"+ issuerData.issuerId+"</span>");
}

//this generates the issuer dashboard according to the issuer data
function generateIssuerDashboard(issuerData){
	//iterates through each and every batch id
	$.map(issuerData.batchIds,function(batchId,index){
			$.ajax({
				url: baseUrl + "/viewBatchInfo/" + batchId, //makes this call to create the card of the batch contents.
				headers:{'Authorization':localStorage.token}
			}).done(function (result) {
				batchData = result;
				console.log(batchData);

				if(batchData.batchStatus === 3)
				{
					let newAddedDiv = $(
						"\t\t<div class=\"row\" onclick='clickCertificate(this.id)'>\n" +
						"\t\t\t<div class=\"certificate col-md-12\">\n" +
						"\t\t\t\t<div class=\"infoOfCertificate\">\n" +
						"\t\t\t\t\t<p>"+ batchData.title +"</p>\n" +
						"\t\t\t\t\t<p>" + batchData.description + "</p>\n" +
						"\t\t\t\t\t<p>" + batchData.numCerts + " students</p>\t\n" +
						"\t\t\t\t</div>\t\n" +
						"\t\t\t\t<span class=\"icon-check tickIcon\" aria-hidden=\"true\"></span>\n" +
						"\t\t\t\t<div class=\"batchInfo\" id=\"batchInfo"+batchData.batchId+"\">\n" +
                        "\t\t\t\t\t<br /><br />\n" +
                        "\t\t\t\t\t<table class=\"table table-hover\">\n" +
                        "\t\t\t\t\t\t<thead>\n" +
                        "\t\t\t\t\t\t<tr>\n" +
                        "\t\t\t\t\t\t\t<th style=\"padding-left: 36px;\">Sr. No</th>\n" +
                        "\t\t\t\t\t\t\t<th>Name</th>\n" +
                        "\t\t\t\t\t\t\t<th>Email</th>\n" +
                        "\t\t\t\t\t\t</tr>\n" +
                        "\t\t\t\t\t\t</thead>\n" +
                        "\t\t\t\t\t\t<tbody id=\"batchInfoTable"+ batchData.batchId +"\"><!-- all the new certificates issued in this batch are appended in this table -->\n" +
                        "\t\t\t\t\t\t</tbody>\n" +
                        "\t\t\t\t\t</table>\n" +
                        "\t\t\t\t</div>" +
                        "\t\t\t</div>\n" +
                        "\t\t</div>");
					newAddedDiv.attr('id',batchData.batchId);
					$("#containerDisplayingBatches").append(newAddedDiv);

					$.ajax({
						url:baseUrl + '/issuerBatchList/'+ localStorage.getItem("issuerId")+ '/'+batchData.batchId,
						headers:{'Authorization':localStorage.token},
						batch: batchData.batchId,
						success:function(responseList){
							let batchName = this.batch;
							$.each(responseList, function (index, element) {
								let tableDiv = $("<tr>\n" +
                                "\t\t\t\t\t\t\t\t<td style=\"padding-left:36px;\">"+ index +"</td>\n" +
                                "\t\t\t\t\t\t\t\t<td>" + element.recipientName+ "</td>\n" +
                                "\t\t\t\t\t\t\t\t<td>" + element.email + "</td>\n" +
                                "\t\t\t\t\t\t\t</tr>\n"
								);
                                $("#batchInfoTable"+String(batchName)).append(tableDiv)
                            });
						}
					})
				}
				else
				{
					var newAddedDiv = $("<div class=\"row\" onclick='redirect(this)'>\n" +
						"\t\t\t<div class=\"certificate col-md-12\">\n" +
						"\t\t\t\t<div class=\"infoOfCertificate\">\n" +
						"\t\t\t\t\t<p>"+ batchData.title +"</p>\n" +
						"\t\t\t\t\t<p>" + batchData.description + "</p>\n" +
						"\t\t\t\t\t<p>" + batchData.numCerts + " students</p>\t\n" +
						"\t\t\t\t</div>\t\n" +
						"\t\t\t\t<span class=\"icon-refresh underProcessIcon\" aria-hidden=\"true\"></span>\n" +
						"\t\t\t</div>\n" +
						"\t\t</div>");
					newAddedDiv.attr('id',batchData.batchId);
					$("#containerDisplayingBatches").append(newAddedDiv);
				}
			})
		}
	);
}

function clickCertificate(element){
	$("#batchInfo"+ element).toggle();
}

//this is the code that adds multiple files as uploaded by the user to the browser and displays it to the screen
function fileUpload(){
	document.querySelector('#imageUpload').addEventListener('change', handleImageFileSelect, false);
	selImgDiv = document.querySelector("#selectedImageFiles");
	document.querySelector('#CSVUpload').addEventListener('change', handleCSVFileSelect, false);
	selCSVDiv = document.querySelector("#selectedCSVFiles");
}

//handles the image upload
function handleImageFileSelect(e){
	if(!e.target.files) return;

	var files = e.target.files;
	selImgDiv.innerHTML += files.length;
}

//handles the csv upload
function handleCSVFileSelect(e){
	if(!e.target.files) return;

	selCSVDiv.innerHTML = "";

	var files = e.target.files;
	for(var i=0; i<files.length; i++) {
		var f = files[i];

		selCSVDiv.innerHTML += f.name + "<br/>";
	}
}

// function to issue the certificates that have been uploaded
function issue(){
	var title = String($("#title").val());
	var description = String($("#description").val());
	var numCerts = $("#numCerts").val();
	var dataObj = JSON.stringify({"title":title,"description":description,"numCerts":parseInt(numCerts,10),"batchId":"","issuerId":localStorage.issuerId});
	var headers = {"Content-Type":"application/json;charset=UTF-8",'Authorization':localStorage.token};
	console.log(dataObj);

	// let the type coercion take place here. Its required and safe here.
	if(numCerts != document.forms['fileUploadForm'].imageUpload.files.length){
		alert("The number of files uploaded do not match the field. Please check again");
		return;
	}
	if(document.forms['fileUploadForm'].imageUpload.files.length === 0){
		alert("No files uploaded");
		return;
	}
	if(document.forms['fileUploadForm'].CSVUpload.files.length === 0){
		alert("No files uploaded");
		return;
	}
	if(document.forms['fileUploadForm'].CSVUpload.files.length > 1){
		alert("Only 1 CSV file allowed");
		return;
	}
	$.ajax({
		type: 'POST',
		url: baseUrl + '/createBatch', //makes the api call for issuing the batch
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
				type: 'POST',
				enctype: 'multipart/form-data',
				url: baseUrl + '/uploadRawData/'+ localStorage.issuerId + '/' + sessionStorage.newBatchId,
				headers:{'Authorization':localStorage.token},
				data: formData,
				processData: false,
				contentType : false,
				cache:false
			}).done(function(){
				$.ajax({
					url: baseUrl + "/certProcessTrigger/" + localStorage.issuerId+'/'+sessionStorage.newBatchId,
					headers:{'Authorization':localStorage.token},
					success: function(result){
						console.log("Done!");
					}
				}).done(function(){
					var newAddedDiv = $("<div class=\"row\" onclick='redirect(this)'>\n" +
						"\t\t\t<div class=\"certificate col-md-12\" data-toggle=\"modal\" data-target=\"#certModal\">\n" +
						"\t\t\t\t<div class=\"infoOfCertificate\">\n" +
						"\t\t\t\t\t<p>"+ title +"</p>\n" +
						"\t\t\t\t\t<p>" + description + "</p>\n" +
						"\t\t\t\t\t<p>" + numCerts + " students</p>\t\n" +
						"\t\t\t\t</div>\t\n" +
						"\t\t\t\t<i class=\"fa fa-refresh underProcessIcon\" aria-hidden=\"true\"></i>\n" +
						"\t\t\t</div>\n" +
						"\t\t</div>");
					newAddedDiv.attr('id', sessionStorage.newBatchId);
					$("#containerDisplayingBatches").append(newAddedDiv);
				});
			});
		}
	});
	closeBatchCreateDialog();   
}

// logout function deletes the cookies and redirects to the signin page
function logOut(){
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