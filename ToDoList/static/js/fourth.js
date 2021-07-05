$(document).ready(function (){
    mutationObserver = new MutationObserver(function (mutation){
        var optionSelected = $("#selectCategory").find("option:selected");
        var valueSelected = optionSelected.val();
        $(document).on('click','.'+valueSelected,function (event){
            deleteData = {'category':valueSelected,'task':this.id}
            csrftoken = getCookie('csrftoken')
            $.ajaxSetup(
            {
                headers : {"X-CSRFToken":csrftoken}
            }
            )
            event.preventDefault();
            $.post('/deleteTask',deleteData,function (result1){
                var data = {'category':valueSelected}
                if(result1.Status=='Ok'){
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
                                "                        <button style='border: none;background: none' class='"+valueSelected+" ' id="+result.tasks[i]+"><i class='far fa-trash-alt'></i></button>\n" +
                                "                    </div>\n" +
                                "                </div>"
                            );
                        }
                    })
                }
            })
            mutationObserver.disconnect();
        });

        $(document).on('click','.e'+valueSelected,function (){
            var date = new Date();
            var mydate = prompt("Enter Dead Line")
            splitdate = mydate.split('-')
            var day =splitdate[0]
            var month = splitdate[1]
            var year = splitdate[2]
            mutationObserver.disconnect();
            var deletedata = {'category':valueSelected,'task':this.id.slice(1),'day':day,'month':month,'year':year}
            $.ajaxSetup(
            {
                headers : {"X-CSRFToken":csrftoken}
            }
            )
            event.preventDefault();
            $.post('/updateTask',deletedata,function (updateResult){
                console.log(updateResult)
                if(updateResult.Status=='Ok'){
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
                                "                        <button style='border: none;background: none' class='"+valueSelected+" ' id="+result.tasks[i]+"><i class='far fa-trash-alt'></i></button>\n" +
                                "                    </div>\n" +
                                "                </div>"
                            );
                        }
                    })
                }
            })
        })
        mutation.forEach(function (mutation){
            console.log(mutation);
        })
    })
    mutationObserver.observe(document.querySelector("section"), {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    });
});


