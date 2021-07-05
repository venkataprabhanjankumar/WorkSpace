$(document).ready(function (){
    $("select#selectCategory").change(function (event){
        var optionSelected = $(this).find("option:selected");
        var valueSelected = optionSelected.val();
        data = {'category':valueSelected}
        event.preventDefault();
        csrftoken = getCookie('csrftoken')
        $.ajaxSetup(
            {
                headers : {"X-CSRFToken":csrftoken}
            }
        )
        $.post('/displayTasks',data,function (result){
            $("#displayTask div").remove();
            for (var i=0;i<result.tasks.length;i++){
                $("#displayTask").append(
                    "<div class=\"todo\"  style=\"border-color: black;\">\n" +
                    "                    <div class=\"todo-tag\" style=\"background-color: rgba(0, 0, 0, 0.5); color: black;\">\n" +
                    "\n" +                  result.tasks[i]+
                    "                    </div>\n" +
                    "                    <p class=\"todo-description\" class="+"t"+valueSelected+" id="+"t"+result.tasks[i]+" style='color: red'>\n DeadLine : " +
                                                    result.tasktimings[i]+
                            "                     </p>\n" +
                    "                    <div class=\"todo-actions\">\n" +
                    "                        <button style='border: none;background: none' class="+"e"+valueSelected+" id="+"e"+result.tasks[i]+"><i class=\"far fa-edit\"></i></button>\n" +
                    "                        <button style='border: none;background: none' class='"+valueSelected+"' id="+result.tasks[i]+"><i class='far fa-trash-alt'></i></button>\n" +
                    "                    </div>\n" +
                    "                </div>"
                );
            }
        })
    });
})