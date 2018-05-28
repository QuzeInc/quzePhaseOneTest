// we keep a base url as all the calls will be made to this base url
var baseUrl = 'https://backend.quze.co';
var issuerData;

//this generates the issuer navbar according to the issuer data
function generateIssuerNavbar(issuerId){
    $("#welcomeIssuerHomeUserName").prepend("<span>"+issuerId+"</span>");
    $("#issuerId").prepend("<span>"+issuerId+"</span>");
}

// this is used to update the profile information that the user enters
function updateIssuerProfile(){
    var updateObj = issuerData;

    if(issuerData.initialized === 0) {

        updateObj.issuerName = $("#issuerName").val();
        updateObj.issuerUrl = $("#issuerUrl").val();

        if (updateObj.issuerName === "" || updateObj.issuerUrl === "" || (document.getElementById("inputPhoto").files.length === 0)) {
            alert("All the fields are mandatory including the pic. We need them to setup the config");
            return;
        }
        var headers = {'Content-Type': 'application/json;charset=utf8','Authorization':localStorage.token};
        updateObj.initialized = 1;

        $.ajax({
            url: baseUrl + "/updateIssuerInfo/",
            type: "POST",
            headers: headers,
            data: JSON.stringify(updateObj),
            success: function () {
                console.log("Done!");


                var formData = new FormData();
                formData.append("file", document.getElementById("inputPhoto").files[0]);
                $.ajax({
                    url: baseUrl + "/uploadPic/" + issuerData.issuerId,
                    type: 'POST',
                    headers:{'Authorization':localStorage.token},
                    data: formData,
                    processData: false,
                    contentType: false,
                    enctype: 'multipart/form-data',
                    success: function () {
                        console.log("Pic Upload Done!");
                    }
                });
            }
        });
    }
    else if(issuerData.initialized === 1)
    {
        var issuerName = $("#issuerName").val();
        var issuerUrl = $("#issuerUrl").val();

        if(issuerName != "")
        {
            updateObj.issuerName = issuerName;
        }
        if(issuerUrl != "")
        {
            updateObj.issuerUrl = issuerUrl;
        }
        if(document.getElementById("inputPhoto").files.length != 0)
        {
            var formData = new FormData();
            formData.append("file", document.getElementById("inputPhoto").files[0]);
            $.ajax({
                url: baseUrl + "/uploadPic/" + issuerData.issuerId,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                enctype: 'multipart/form-data',
                success: function () {
                    console.log("Pic Upload Done!");
                }
            });
        }

        updateObj.initialized = 1;
        var headers = {'Content-Type': 'application/json;charset=utf8','Authorization':localStorage.token};
        $.ajax({
            url: baseUrl + "/updateIssuerInfo/",
            type: "POST",
            headers: headers,
            data: JSON.stringify(updateObj),
            success: function () {
                console.log("Done!");
            }
        });
    }
}

function logOut(){
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


$(document).ready(function(){
    //we keep this empty as the page doesn't need to be replaced with any other page as we are already on the page as needed
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

    // we insert proper data into navbar with this
    generateIssuerNavbar(localStorage.issuerId);

    // this call is done to get the already filled out data by the user in the profile section in after the welcome message on this page.
    $.ajax({
        url:baseUrl+"/viewIssuerInfo/"+localStorage.issuerId,
        headers:{'Authorization':localStorage.token},
        success:function(result){
            console.log(result);
            issuerData = result;
            if(result.initialized === 1)
            {
                $.ajax({
                    url:baseUrl+"/getPic/"+result.issuerId,
                    headers:{'Authorization':localStorage.token},
                    success:function (data) {
                        $("#profilePic").attr('src',"data:image/png;base64, "+data);
                        $("#welcomeProfilePic").attr('src',"data:image/png;base64, "+data);
                    }
                });
            }
            $("#profileData").append("<div>\n" +
                "\t\t\t\t\t\t<label>Issuer ID</label>\n" +
                "\t\t\t\t\t\t<p style=\"border:solid 0.2px #bdbdbd; padding:10px;\">"+result.issuerId+"</p>\n" +
                "\t\t\t\t\t</div>\n" +
                "\t\t\t\t\t<div>\n" +
                "\t\t\t\t\t\t<label>Email</label>\n" +
                "\t\t\t\t\t\t<p style=\"border:solid 0.2px #bdbdbd; padding:10px;\">" + result.email + "</p>\n" +
                "\t\t\t\t\t</div>" + "<p class=\"btn btn-primary\" onclick='updateIssuerProfile();' style='margin-top:10px;'>Save</p>");
        }
    })

});