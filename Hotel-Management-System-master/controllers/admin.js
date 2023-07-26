var mysql = require("mysql");
var formidable = require("formidable");
const path = require("path");

exports.getLogin = (req, res, next) => {
  if (req.session.admin == undefined) {
    res.render("admin/login", { msg: "", err: "" });
  } else {
    var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "hotel",
    });
    data1 = "SELECT * " + "FROM  bookingstatus " + "WHERE status = 0 ";
    connectDB.query(data1, (err1, result1) => {
      if (err1) throw err1;
      else {
        for (i in result1) {
          var a = result1[i].date;
          result1[i].date = a.toString().slice(0, 15);
        }
        return res.render("admin/index", { msg: "", err: "", data: result1 });
      }
    });
  }
};

exports.postLogin = (req, res, next) => {
  var connectDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hotel",
  });

  data =
    "SELECT * " +
    "FROM admin " +
    "WHERE name = " +
    mysql.escape(req.body.name) +
    "AND pass = " +
    mysql.escape(req.body.pass);

  data1 = "SELECT * " + "FROM  bookingstatus " + "WHERE status = 0 ";

  connectDB.query(data, (err, result) => {
    if (err) throw err;
    else {
      if (result.length) {
        req.session.admin = result[0].name;
        connectDB.query(data1, (err1, result1) => {
          if (err1) throw err1;
          else {
            for (i in result1) {
              var a = result1[i].date;
              result1[i].date = a.toString().slice(0, 15);
            }
            return res.render("admin/index", {
              msg: "",
              err: "",
              data: result1,
            });
          }
        });
      } else {
        return res.render("admin/login", {
          msg: "",
          err: "Please Check Your Information Again",
        });
      }
    }
  });
};

exports.postChnageStatus = (req, res, next) => {
  var connectDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hotel",
  });

  var value = 0;

  if (req.body.click == "Approve") {
    value = 1;
    data =
      "UPDATE bookingstatus " +
      " SET  status = " +
      mysql.escape(value) +
      " WHERE email = " +
      mysql.escape(req.body.mail) +
      " AND type = " +
      mysql.escape(req.body.type) +
      " AND category = " +
      mysql.escape(req.body.cat) +
      " AND roomWant = " +
      mysql.escape(req.body.want);
  } else {
    data =
      "DELETE FROM bookingstatus " +
      " WHERE email = " +
      mysql.escape(req.body.mail) +
      " AND type = " +
      mysql.escape(req.body.type) +
      " AND category = " +
      mysql.escape(req.body.cat) +
      " AND roomWant = " +
      mysql.escape(req.body.want);
  }

  data1 = "SELECT * " + "FROM  bookingstatus " + "WHERE status = 0 ";

  connectDB.query(data, (err, result) => {
    if (err) throw err;
    else {
      connectDB.query(data1, (err1, result1) => {
        if (err1) throw err1;
        else {
          for (i in result1) {
            var a = result1[i].date;
            result1[i].date = a.toString().slice(0, 15);
          }
          return res.render("admin/index", { msg: "", err: "", data: result1 });
        }
      });
    }
  });
};

exports.getAddHotel = (req, res, next) => {
  res.render("admin/addhotel", { msg: "", err: "" });
};

exports.postAddHotel = (req, res, next) => {
  var connectDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hotel",
  });

  var cat = "",
    type = "",
    cost = 0,
    avlvl = 0,
    des = "";
  var imgPath = "";
  var wrong = 0;

  new formidable.IncomingForm()
    .parse(req)
    .on("field", (name, field) => {
      if (name === "cat") {
        cat = field;
      } else if (name === "type") {
        type = field;
      } else if (name === "cost") {
        cost = parseInt(field);
      } else if (name === "avlvl") {
        avlvl = parseInt(field);
      } else if (name === "des") {
        des = field;
      }
    })
    .on("file", (name, file) => {})
    .on("fileBegin", function (name, file) {
      var fileType = file.type.split("/").pop();
      if (fileType == "jpg" || fileType == "png" || fileType == "jpeg") {
        a = path.join(__dirname, "../");

        if (name === "img") {
          imgPath = cat + type + cost + "." + fileType;
        }
        imgPath = "/assets/img/rooms/" + (cat + type + cost + "." + fileType);
        file.path =
          a +
          "/public/assets/img/rooms/" +
          (cat + type + cost + "." + fileType); // __dirname
      } else {
        console.log("Wrong File type");
        wrong = 1;
        res.render("admin/addhotel", { msg: "", err: "Wrong File type" });
      }
    })
    .on("aborted", () => {
      console.error("Request aborted by the user");
    })
    .on("error", (err) => {
      console.error("Error", err);
      throw err;
    })
    .on("end", () => {
      if (wrong == 1) {
        console.log("Error");
      } else {
        data =
          "INSERT INTO `category`(`name`, `type`, `cost`, `available`, `img`, `dec`) " +
          "VALUES('" +
          cat +
          "','" +
          type +
          "', '" +
          cost +
          "','" +
          avlvl +
          "' ,'" +
          imgPath +
          "' ,'" +
          des +
          "' )";
        connectDB.query(data, (err, result) => {
          if (err) {
            throw err;
          } else {
            res.render("admin/addhotel", {
              msg: "Data Insert Successfuly",
              err: "",
            });
          }
        });
      }
    });
};

exports.getSearch = (req, res, next) => {
  res.render("admin/search", { msg: "", err: "" });
};

exports.postSearch = (req, res, next) => {
  var connectDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hotel",
  });

  data =
    "SELECT * " +
    "FROM category " +
    "WHERE name = " +
    mysql.escape(req.body.cat);

  connectDB.query(data, (err, result) => {
    if (err) throw err;
    else {
      return res.render("admin/update", { msg: "", err: "", data: result });
    }
  });
};

exports.getUpdate = (req, res, next) => {
  var connectDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hotel",
  });

  data =
    "SELECT * " +
    "FROM category " +
    "WHERE name = " +
    mysql.escape(req.body.cat) +
    " AND type = " +
    mysql.escape(req.body.type) +
    " AND cost = " +
    mysql.escape(req.body.cost);

  connectDB.query(data, (err, result) => {
    if (err) throw err;
    else {
      req.session.info = result[0];
      res.render("admin/updatePage", { data: result[0] });
    }
  });
};

exports.updatePrevData = (req, res, next) => {
  var connectDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hotel",
  });

  data =
    "UPDATE category " +
    "SET type = " +
    mysql.escape(req.body.type) +
    ", cost = " +
    mysql.escape(parseInt(req.body.cost)) +
    ", available = " +
    mysql.escape(parseInt(req.body.avlvl)) +
    ", `dec` = " +
    mysql.escape(req.body.des) +
    " WHERE name = " +
    mysql.escape(req.session.info.name) +
    " AND type = " +
    mysql.escape(req.session.info.type) +
    " AND cost = " +
    mysql.escape(parseInt(req.session.info.cost));

  connectDB.query(data, (err, result) => {
    if (err) throw err;
    else {
      res.render("admin/search", { msg: "Update Done Successfuly", err: "" });
    }
  });
};

exports.logout = (req, res, next) => {
  req.session.destroy();
  res.render("admin/login", { msg: "", err: "" });
};
