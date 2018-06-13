var baseUrl = 'https://backend.quze.co';
var qs = "";
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

    var query = window.location.search.substring(1);
    qs = parseQueryString(query);

    console.log(qs);
});

function parseQueryString(query)
{
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

function activateAccount(qs)
{
    var email = qs.email;
    var userId = $("#inputUserName").val();
    var password = $("#inputPassword").val();
    var type = "recipient";

    if(email === "" || userId === "" || password === "")
    {
        alert("Please Fill out all the details to proceed!");
        return;
    }

    var data = {'userId':userId,'email':email,'password':password,'type':type};
    data = JSON.stringify(data);

    var headers = {'Content-Type':'application/json;charset=utf8'};

    $.ajax({
        url:"http://localhost:8080/"+"activateAccount/"+qs.token,
        headers:headers,
        type:"POST",
        data:data,
        success: function (result) {
            if (result === "Activation failed. Try again") {
                alert("User Already Exists. Please try another User Name");
            }
            else if(result === "Credentails don't match the database")
            {
                alert("Credentails dont match the database!");
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

function signup()
{
    activateAccount(qs);
}

