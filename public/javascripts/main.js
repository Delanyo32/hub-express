function login(){
    var userName = $('#userName').val()
    var password = $('#password').val()
    var data = {
        email:userName,
        password:password
    }
    $.post("/api/login",data).done(
        function(data){
            if(data.status){
                window.location.href = '/projects';
            }
        }
    )
}

function getProject(id){
    localStorage.setItem("projectId",id)
    //console.log(id)
    window.location.href = `/home/${id}`;
}

function getActivity(userId,id){
    console.log(userId)
    window.location.href = `/activity/${userId}/${id}`;
}


function addComment(activityId){

    var comment = $('#comment').val()

    var data ={
        activityId:activityId,
        comment:comment
    }

    $.post("/api/addComment",data).done(
        function(res){
            if(res.status){
                console.log(res.data.comment)
                //window.location.href = `/activity/${res.data.userId}/${res.data.id}`;
            
                var comment = res.data.comment
                var tableBody = $("#tbody")

                tableBody.prepend(`
                <tr>
                <td style="text-align:center">
                   <i class="material-icons">account_circle</i>                                           
                </td>
                <td>
                   <p> ${comment.comment}</p>
                   <small>${comment.date} - ${comment.userName}</small>
                </td>
            </tr>
                `)

                $('#comment').val('')
            }
        }
    )
    

}