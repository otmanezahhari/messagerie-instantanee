
  kwick.login = function(cb){
      /**
       * Get Information User From Input For Login
       *
       */
  
      $("#login-form").on('submit', function(event){
        event.preventDefault();
    
        let username = $('#username').val();
        let password = $('#password').val();
        if(username===''){
    
          $('.card-info').empty().append('<div class="card-panel red white-text"> Please enter your Username !</div>');
    
        }
        else if (password === ''){
    
          $('.card-info').empty().append('<div class="card-panel red white-text"> Please enter your Password !</div>');
        
        }
        else {
  
          //Call Login Function
          login(username,password);
  
        }
  
      });
  
       /**
     * Function Description : Call API For Login & Add Information to Local Storage
     *  Username, Password (/login/user_name/password)
     */
  
      function login(username , password){
        kwick.callkwickAPI('login/' + username + '/' + password , function(err,data){
          if(err){
  
            
            console.log("The server doesn't respond");
  
          }
  
          if(data.result.status == 'done'){
  
            localStorage.setItem("user_token", data.result.token);
            localStorage.setItem("user_id", data.result.id);
            localStorage.setItem("user_name", username);
            localStorage.setItem("message", data.result.message);
            $('.card-info').empty();
            cb();	
            
          }
          else{
            $('.card-info').empty().append('<div class="card-panel red white-text">'+data.result.message+'</div>');
          }
  
        })
      }
  }
  
  kwick.login(function(){
    document.location.href="./messagerie.html";
  });
