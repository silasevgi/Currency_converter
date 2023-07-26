
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var wal= post.wallet;
 

      var sql = "INSERT INTO `users`(`first_name`,`last_name`,`wallet`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + wal + "','" + name + "','" + pass + "')";

      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
       
      });

   }
    else {
      res.render('signup');
   }
};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
     
      var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Please enter valid username and password!';
            res.render('login.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('login.ejs',{message: message});
   }
           
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});    
   });  
  
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/home");
   })
};
exports.profile=function(req,res){
   var message = '';
   var userId = req.session.userId;

      if (userId == null) {
        res.redirect("/login");
        return;
      }
  
      var sql = "SELECT * FROM `users` WHERE `id`=?";
      var values = [userId];
  
      db.query(sql, values, function(err, results) {
     
  
        res.render('profile.ejs', {data: results });
      });
    };
  


//--------------------------------render user details after login--------------------------------

exports.edit_profile = function(req, res) {
   var message = '';
   var userId = req.session.userId;
  
 
   if (req.method == "POST") {
     var post = req.body;
     var user_name = post.user_name;
     var pass = post.password;
     var fname = post.first_name;
     var lname = post.last_name;
     var wal = post.wallet;
 
     var sql = "UPDATE `users` SET `first_name`=?, `last_name`=?, `wallet`=?, `user_name`=?, `password`=? WHERE `id`=?";
     var values = [fname, lname, wal, user_name, pass, userId];
 
     db.query(sql, values, function(err, results) {
       if (err) {
         message = "Error updating profile.";
         res.render('edit_profile.ejs', { info: results, message: message });
       } else {
         message = "Error updating profile.";
       }
 
         // Fetch the updated user details from the database
         var user =  req.session.user
         var userId = req.session.userId;
         var fetchsql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
      
         db.query(fetchsql, function(err, results){
            res.render('profile.ejs', {data:results});    
         });  
        
       
   })} else {
     if (userId == null) {
       res.redirect("/login");
       return;
     }
 
     var sql = "SELECT * FROM `users` WHERE `id`=?";
     var values = [userId];
 
     db.query(sql, values, function(err, results) {
       if (err) {
         // Handle the error appropriately
         res.redirect('/'); // Redirect to the home page or another appropriate page
       } else {
         res.render('edit_profile.ejs', { info: results, message: message });
       }
     });
   }
 };