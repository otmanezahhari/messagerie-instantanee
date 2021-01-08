
  kwick.register = function(cb){

    /**
     * Get Information User From Input fro regiter
     *
     */
    $('#register-form').on('submit',function(event){
      event.preventDefault();
  
      let username         = $('#username').val();
      let password         = $('#password').val();
      let confirmPassword  = $('#confirm-password').val();
  
      if(username===''){
  
        $('.card-info').empty().append('<div class="card-panel red white-text"> Please enter your Username !</div>');
  
      }
      else if (password === ''){
  
        $('.card-info').empty().append('<div class="card-panel red white-text"> Please enter your Password !</div>');
      }
      else if (password !== confirmPassword){
  
        $('.card-info').empty().append('<div class="card-panel red white-text"> Confirm password doesn\'t match !</div>');
  
      }
      else{
  
        //Call SignUp Function
        signup(username,password);
  
      }
  
    });


    /**
   * Function Description : Call API For Signup & Add Information to Local Storage
   *  Username, Password (/signup/user_name/password)
   */

   function signup(username,password){

    kwick.callkwickAPI('signup/'+username+'/'+password,function(err,data){
      
     if(err){

        console.log('err');

      }

      if(data.result.status=='done'){

        //Add Information to LocalStorage
       localStorage.setItem("user_token", data.result.token);
       localStorage.setItem("user_id", data.result.id);
       localStorage.setItem("user_name", username);
       localStorage.setItem("message", data.result.message +', you can use the messenger now !');
       //Load Page
       cb();
     }
      else{

       $('.card-info').empty().append('<div class="card-panel red white-text">'+data.result.message+'</div>');

      }
    });
  }
  }
  
  

  

  kwick.register(function(){
    document.location.href="./messagerie.html";
  });