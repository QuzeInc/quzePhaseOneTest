$(document).ready(function(){
    // Checks for localstorage and redirects accordingly
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


var baseUrl = 'https://backend.quze.co';

function signin() {
    var userId = $("#inputUserName").val();
    var password = $("#inputPassword").val();

    var data = {'userId':userId,'password':password};
    data = JSON.stringify(data);

    var headers = {'Content-Type':'application/json;charset=utf8'};

    // it makes two consecutive ajax calls, one to see if the credentials entered are right or not, the second to get the token related to the user and redirect to the proper page.
    $.ajax({
        url: baseUrl+'/login',
        type:"POST",
        data:data,
        headers:headers,
        error: function (err) {
            alert("Please try again with correct credentials");
        }
    }).done(function (data,textStatus,request) {
        localStorage.setItem('token',request.getResponseHeader("authorization"));

        headers = {'Content-Type':'application/json;charset=utf8','Authorization':localStorage.getItem("token")};
        $.ajax({
            url: baseUrl + '/getUserInfo/'+userId,
            type:"GET",
            headers: headers,
            success : function (data) {
                if(data.type === "issuer")
                {
                    localStorage.setItem("type",data.type);
                    localStorage.setItem("issuerId",userId);
                    window.location.replace("issuerHome.html");
                }
                else if(data.type === "recipient")
                {
                    localStorage.setItem("type",data.type);
                    localStorage.setItem("recipientId",userId);
                    window.location.replace("recipientHome.html");
                }
                else if(data.userId === "error")
                {
                    alert(data.type);
                }
            }
        });
    });
}

