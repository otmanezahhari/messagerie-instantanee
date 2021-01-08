kwick.messagerie = function(cb){
  /**
       * Get Information User From LocalStorage and Check
       * 1. if user allocated to login
       * 2. if user cans see messagerie page
       *
       */


      let user_token = localStorage.getItem("user_token");
      let user_id    = localStorage.getItem("user_id");
      let user_name  = localStorage.getItem("user_name");
      let message    = localStorage.getItem("message");

 
        //If not logged or register yet go to redirection page
        if(user_token ===null && user_id === null){

          document.location.href="./redirection.html";

        }

       /**
        * Function Description : Call APi to get connected user list 
        * Username, Password (API_URL/user/logged/user_token) :Renvoie la liste des utilisateurs loggés
        * 
        */

        function userListConnected(user_token){
          kwick.callkwickAPI('user/logged/' + user_token , function(err , data){

            if(err) console.log('Fail To get List');

            //User connect toast
            let userConnected;
            if(kwick.firstTimeRefresh == false && kwick.userTab.length < data.result.user.length){
              for (let u = 0; u < data.result.user.length; u++) {
                userConnected = true;
                for (let j = 0; j < kwick.userTab.length; j++) {
                  if(kwick.userTab[j].indexOf(data.result.user[u]) >= 0){
                    userConnected = false;
                    break;
                  }
                }
                if(userConnected == true){
                  //New User connected Notification
                  // console.log(data.result.user[u] +'is connected');
                }
              }
            }

            //User Disconnected toast
            if(kwick.firstTimeRefresh == false && kwick.userTab.length > data.result.user.length){
              for (let u = 0; u < kwick.userTab.length; u++) {
                userDisconnected = true;
                for (let j = 0; j < data.result.user.length; j++) {
                  if(kwick.userTab[u].indexOf(data.result.user[j]) >= 0){
                    userDisconnected = false;
                    break;
                  }
                }
                if(userDisconnected == true){

                  //Notification user disconnected
                  // console.log(data.result.user[u] +'is disconnected');
                }
              }
            }

            kwick.userTab = [];
            $('.info-user').empty();
            for (let i = 0; i < data.result.user.length; i++) {
              kwick.userTab.push(data.result.user[i]);
              addConnectedUser(kwick.userTab[i]);
             
            }

            kwick.firstTimeRefresh = false;
          });
        }

        function addConnectedUser(connectedUser){
          
          $(".info-user").append('<div class="info-name-status"><span class="info-name"> '+ connectedUser + '<span class="info-status">online</span></span></div>')
        
        }

        /**
        * Function Description : Call APi to get message list
        * Username, Password (API_URL/talk/list/token/timestamp) :Récupére les messages postés aprés timestamp
        * 0  to Get All message
        * 
        */

        function ShowMessage(user_token, index){
          kwick.callkwickAPI('talk/list/' + user_token + '/' + 0,function(err,data){

            if(err) console.log("Fail");

            let compteur = 0;
            kwick.msgTab = [];
            for (let i = data.result.talk.length - index; i < data.result.talk.length; i++) {
              // Convert timestamp
              let date = new Date(data.result.talk[i].timestamp* 1000).toLocaleTimeString();
              kwick.msgTab.push(messageForm(data.result.talk[i].user_name,data.result.talk[i].content,date));
            }

            $('.chat-history ul').empty().append(kwick.msgTab);

            if(kwick.msgPushIndex < data.result.talk.length){
              compteur = data.result.talk.length - kwick.msgPushIndex;
              $('#msg-box').scrollTop(10000000000);
              if(kwick.msgPushIndex !== 0 && data.result.talk[data.result.talk.length - 1].user_name !== user_name){
                
                //Notification for New Message
                // console.log("New Message Added");
              }
            }
            kwick.msgPushIndex = data.result.talk.length;
          
          
          });
        };
        

        // Message Format
        function messageForm(name,message,date){

          if(name == user_name){

            return '<li class="clearfix"><div class="message-data align-left"><span class="message-data-name"> <i class="fa fa-circle online"></i></span>'+ name + '<span class="message-data-time">'+ date + '</span></div><div class="message my-message float-right">' + message +'</div></li>';
         
          }

          return '<li class="clearfix"><div class="message-data align-right"><span class="message-data-time">' + date + '</span><span class="message-data-name"></span>' + name + '<i class="fa fa-circle me"></i></div><div class="message other-message float-right">' + message + '</div></li>';
        
        };

        // Refresh interval message & user connected
        function refresh(){
          setInterval(function(){ 
            ShowMessage(user_token,kwick.msgTab.length);
            userListConnected(user_token,0);
          }, 7000);
        }


        /**
        * Function Description : Call APi to Logout & delete local storaga Data
        * Username, Password (API_URL/logout/user_token/user_id) :Récupére les messages postés aprés timestamp
        * 
        * 
        */

        function logout(user_token,user_id){
          kwick.callkwickAPI('logout/'+ user_token + '/' + user_id,function(err,data){
            if(err)
              console.log('fail');
      
            localStorage.removeItem("user_name");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_token");
            cb();
          });
        }

        /**
        * Function Description : Call APi to Send Message & Show new message
        * Username, Password (API_URL/say/user_token/user_id) :Récupére les messages postés aprés timestamp
        * 
        * 
        */

       function sendMessage(user_token, user_id, message){
        kwick.callkwickAPI('say/' + user_token + '/' + user_id +'/' + message,function(err,data){
          if(err)
            console.log('fail');
        });
      }

        
        // load 15 previous message ...
        function lazyload(){
          $('.chat-history').on('scroll',function(){
            
            if($('.chat-history').scrollTop() == 0){
              $('#previous').show();
            }
            else{
              $('#previous').hide();
            }
          });
          $('#previous').on('click',function(){

            ShowMessage(user_token,kwick.msgTab.length + 15);
          
          });
        }


        // Listnner for disconnect button
        $('#logout').on('click', function(){
          logout(user_token,user_id);
        });

        //Lister for toggle dropdownmenu

        $('.compte-info').on("click",function(){

          $(".menu-dropdown").toggleClass('open');
        })

        $('#form-message').on('submit', function(event){
          event.preventDefault();

          let message = $('#message-to-send').val();
      
          if(message.length < 140 && message !== ''){
            let messageEncode = encodeURIComponent(message);
            sendMessage(user_token, user_id, messageEncode);
            $('#message-to-send').val('');
            ShowMessage(user_token,kwick.msgTab.length);
          }	
        });	


        //Call Functions

        userListConnected(user_token,0);

        ShowMessage(user_token,15);

        refresh();

        lazyload();
}


if($(".messagerie-content").val()===''){
  kwick.messagerie(function(){
    document.location.href="./index.html";
  });
}


