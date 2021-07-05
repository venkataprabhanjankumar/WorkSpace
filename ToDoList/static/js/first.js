function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(document).ready(function (){
    csrftoken = getCookie('csrftoken')
    $("#categoryBtn").click(function (event){
        var category = $("#categoryData").val();
        var mydata = {'category':category}
        // if this is submit but we don't need the event.preventDefault()
        //if it is not submit button we need to have your event call preventDefault. Otherwise your page would be loading and stopping the ajax call.
        event.preventDefault()
        $.ajaxSetup(
            {
                headers : {"X-CSRFToken":csrftoken}
            }
        )
        $.post('/getCategory',mydata,function (result){
            if(result.Status = 'Ok'){
                $("#categoryList").append("<li class=\"sidebar-item\">"+category+"<input type=\"color\" class=\"sidebar-color\">"+"</li>");
                $("#selectCategory").append("<option value="+category+">"+category+"</option>");
            }
        });
    });
});