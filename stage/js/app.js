(function(window,$){

  const API_ROOT_URL = "http://greenvelvet.alwaysdata.net/kwick/api/";

  let kwick = {
    msgPushIndex : 0,
    msgTab : [],
    userTab :[],
    FirstTimeRefresh : true,

    callkwickAPI : function(url, callback){
      let request = $.ajax({
				type : 'GET',
				url : API_ROOT_URL + url,
				dataType : 'jsonp'
			});

			// if fail
			request.fail(function(jqXHR, textStatus, errorThrown){
        callback(textStatus, null);
        // console.log("Error")
			});

			// if done
			request.done(function(data){
        callback(null, data);
        // console.log("Done With succeess")
			});
    },

  }
  window.kwick = kwick;
})(window,jQuery);