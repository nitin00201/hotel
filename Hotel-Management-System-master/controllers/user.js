var mysql = require('mysql');



exports.authentication = (req, res, next) => {

   if (req.session.mail != undefined) {
      next();
   }
   else {
      res.render('user/home', { user: "" });
   }
}

exports.getHome = (req, res, next) => {

   if (req.session.mail != undefined) {
      return res.render('user/home', { user: req.session.mail });
   }
   else {
      return res.render('user/home', { user: "" });
   }
}

exports.getLogin = (req, res, next) => {
   res.render('user/loginAccount', { user: "", msg: [], err: [] });
}

exports.postLogin = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel"
   });

   data = "SELECT * " +
      "FROM  user " +
      "WHERE email = " + mysql.escape(req.body.mail) +
      " AND password = " + mysql.escape(req.body.pass);


   connectDB.query(data, (err, result) => {
      if (err) throw err; 
      else {
         if (result.length) {
            req.session.mail = result[0].email;
            res.render('user/home', {user: result[0].email});
         }
         else {
            res.render('user/loginAccount', { user: "", msg: [], err: ["Please Check Your information again"] });
         }

      }
   })

}


exports.getCreateAccount = (req, res, next) => {
   res.render('user/createAccount', { user: "", msg: [], err: [] })
}

exports.postCreateAccount = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel"
   });

   var p1 = req.body.pass;
   var p2 = req.body.con_pass;

   if (p1 != p2) { 
      return res.render("user/createAccount", { user: "", msg: [], err: ["Password Doesn't Match"] })
   }

   var data = "INSERT INTO user " +
      " VALUES ( '" + req.body.name + "' ,'" + req.body.mail + "','" + req.body.phone + "','" + p1 + "')";

   connectDB.query(data, (err, result) => {
      if (err) throw err; 
      else {
         res.render('user/loginAccount', { user: "", msg: ["Account Create Successfuly"], err: [] }); //show login page
      }
   })
}

exports.getCategory = (req, res, next) => {

   res.render('user/category', { user: req.session.mail });
}

exports.postCategory = (req, res, next) => {
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel"
   });

   data = "SELECT * " +
      " FROM  category " +
      " WHERE name = " + mysql.escape(req.body.cat) +
      " AND type = " + mysql.escape(req.body.type) +
      " AND available > 0";

   connectDB.query(data, (err, result) => {
      if (err) throw err;
      else {
         return res.render('user/showCategory', { user: req.session.mail, rooms: result })
      }
   })

}

exports.postBooking = (req, res, next) => {

   res.render('user/bookingConfirm.ejs', { user: req.session.mail, name: req.body.name, type: req.body.type, cost: req.body.cost });
}


exports.postStatus = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel"
   });
   var date = req.body.date;
   data = "INSERT INTO bookingstatus " +
      " VALUES ('" + req.session.mail + "','" + req.body.name + "','" + req.body.type + "','" + req.body.roomWant + "','" + 0 + "','" + date + "')"

   data1 = "SELECT * " +
      " FROM  bookingstatus " +
      " WHERE email = " + mysql.escape(req.session.mail);
      
   connectDB.query(data, (err, reslt) => {
      if (err) throw err;
      else {
         connectDB.query(data1, (err1, result) => {
            for (i in result) {
               var a = result[i].date
               a = a.toString()
               result[i].date = a.slice(0, 15);
            }
            res.render('user/statusShow', { user: req.session.mail, msg: "Your booking is placed", err: "", data: result });
         })
      }
   })
}


exports.getShowStatus = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel"
   });

   data = "SELECT * " +
      " FROM  bookingstatus " +
      " WHERE email = " + mysql.escape(req.session.mail);

   connectDB.query(data, (err, result) => {

      if (err) throw err;
      else {
         for (i in result) {
            var a = result[i].date
            a = a.toString()
            result[i].date = a.slice(0, 15);
         }
         if (result.length < 1) {
            res.render('user/statusShow', { user: req.session.mail, msg: "", err: "You dont have any data", data: result });
         }
         else {
            res.render('user/statusShow', { user: req.session.mail, msg: "", err: "", data: result });
         }
      }
   })
}


exports.deleteBooking =(req,res,next)=>{
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel"
   });

   data = "DELETE FROM bookingstatus " +
   " WHERE email = " + mysql.escape(req.body.mail) +
   " AND type = " + mysql.escape(req.body.type) +
   " AND category = " + mysql.escape(req.body.cat)+
   " AND roomWant = "+mysql.escape(req.body.want)
  
   connectDB.query(data,(err,result)=>{
      if(err) throw err;
      else{
         next();
      }
   })

}


exports.getContact =(req,res,next)=>{
   if(req.session.mail== undefined){
      res.render('user/contact', { user: "" });
   }
   else{
      res.render('user/contact', { user: req.session.mail });
   }
   
}

exports.logout = (req, res, next) => {
   req.session.destroy();
   res.render('user/home', { user: "" });

}