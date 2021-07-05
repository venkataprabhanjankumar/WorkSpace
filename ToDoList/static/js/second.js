$(document).ready(function (){

    $("#addtodo").click(function (event){
        var data = $("#addtodoval").val();
        var optionSelected = $("#selectCategory").find("option:selected");
        var valueSelected = optionSelected.val();
        mydata = {'tododata':data,'todoCategory':valueSelected};
        event.preventDefault();
        csrftoken = getCookie('csrftoken')
        $.ajaxSetup(
            {
                headers : {"X-CSRFToken":csrftoken}
            }
        )
       $.post('/todo',mydata,function (result){
           console.log(result);
           if(result.Status=='Ok'){
               $.post('/displayTasks',{'category':valueSelected},function (taskResult){
                    $("#displayTask div").remove();
                    for (var i=0;i<taskResult.tasks.length;i++){
                        console.log(taskResult.tasks)
                        $("#displayTask").append(
                            "<div class=\"todo\"  style=\"border-color: black;\">\n" +
                            "                    <div class=\"todo-tag\" style=\"background-color: rgba(0, 0, 0, 0.5); color: black;\">\n" +
                            "\n" +                  taskResult.tasks[i]+
                            "                    </div>\n" +
                            "                    <p class=\"todo-description\" class="+"t"+valueSelected+" id="+"t"+taskResult.tasks[i]+" style='color: red'>\n DeadLine : " +
                                                    taskResult.tasktimings[i]+
                            "                     </p>\n" +
                            "                    <div class=\"todo-actions\">\n" +
                            "                       <button style='border: none;background: none' class="+"e"+valueSelected+" id="+"e"+taskResult.tasks[i]+"><i class=\"far fa-edit\"></i></button>\n" +
                            "                       <button style='border: none;background: none' class='"+valueSelected+"' id="+taskResult.tasks[i]+"><i class='far fa-trash-alt'></i></button>\n" +
                            "                    </div>\n" +
                            "                </div>"

                        );
                    }
               });
           }
       });
    });
});