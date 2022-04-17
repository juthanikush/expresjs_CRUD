const { application } = require('express');
var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'test'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});


router.get('/',(req,res)=>{
  connection.query("select * from customers",function(err,rows){
  if(err){
    res.render('index.ejs',{'title':'Home',data:''});
  }else
  {
    res.render('index.ejs',{'title':'Home',data:rows});
  }
  });
});

router.get('/add/new',(req,res)=>{
  res.render('add.ejs',{'title':'add_new'});
});

router.post('/process_post',(req,res,next)=>{
  var a = req.body.name;
  var b = req.body.email;
  if(req.body.id>0)
  {
    var c = req.body.id;
    var ks=connection.query('UPDATE `customers` SET name=?, email=? WHERE id = ?',[a,b,c],function(err,result){
      console.log("Recored Updated");
      console.log(ks);
    })
  }else{
    connection.query("insert into `customers`(`name`,`email`) values(?,?)",[a,b],function(err,result){
      console.log("Recored add"); })
  }
  
res.redirect('/')
})

router.get("/customer/delete/(:id)",function(req,res,next){
  var user = { id:req.params.id};
  connection.query('DELETE FROM `customers` WHERE id = '+ req.params.id, user,function(err,result){
    if(err){
      console.log(err);
    }
    else
    {
      console.log("Recored Deleted");
    }
  })
  res.redirect('/')
})

router.get("/customer/update/(:id)",function(req,res,next){
  var user = { id:req.params.id};
  connection.query('SELECT * FROM customers WHERE id = '+ req.params.id, user,function(err,rows, fields){
    if(err){
      console.log(err);
    }
    else
    {
      console.log("Recored get");
      console.log(rows[0].name);
      res.render('edit',{'title':'Edit Page',id:rows[0].id,name:rows[0].name,email:rows[0].email});

    }
  })
  
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
