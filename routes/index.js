const express = require('express');
const router = express.Router();
const exec = require('child_process').exec;
const kue = require('kue');
const jobs = kue.createQueue();
const docker = require('../utils/dockerAPI');
var db = require('../models/index');
var User = db.sequelize.import(__dirname + "/../models/User");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'picoShell' });
});

router.post('/handleCodeSave', function (req, res) {
  const code = JSON.stringify(req.body.codeValue).replace("'", "'\\''");
  const echo = "'echo -e ";
  const file = " > juice.js'";
  const command = 'bash -c ' + echo + code + file;
  console.log(command);
  docker.runCommand('juice', command, function(err, response) {
    if (err) {
      res.send(200, err);
    } else {
      res.send(200, response);
    }
  });
});

router.post('/cmd', function (req, res) {
  var cmd = req.body.cmd;

  if(cmd.split(" ")[0] === 'cd') {
    const newdir = cmd.split(" ")[1];
    console.log('change dir to: ', newdir);

    const command = 'bash -c "echo ' + newdir + ' > .pico' + '"'; 
    console.log(command);
    docker.runCommand('test1', command, function(err, res1) {
      if (err) {
        res.send(200, err);
      } else {
        res.send(200, res1);
      }
    })
  }
  else {
    docker.runCommand('test1', 'cat /.pico', function(err1, res1) {

      console.log('response from cat /.pico :', res1);
      res1 = res1.replace(/^\s+|\s+$/g, '');

      cmd = '"cd ' + res1 + ' && ' + cmd + '"';
      const command = 'bash -c ' + cmd;
      console.log(command);
      docker.runCommand('test1', command, function(err2, res2) {
        if (err2) {
          res.send(200, err2);
        } else {
          res.send(200, res2);
        }
      });
    })
    
  }


});

router.post('/user', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var user = User.build({
    username: username,
    password: password,
    salt: 'salt',
    bio: 'bio'
  });

  user.save().then(function(response) {
    console.log('workingfasdfsdfasdfdfsdafsd');
    res.send('complete add');
  }).catch(function(err) {
    res.send('error', err);
  });
  // res.send(200)
});

router.get('/user', function(req, res) {
  var username = req.param('username');
  var password = req.param('password');
  User.findOne({
    where: {
      username: username,
      password: password
    }
  }).then(function(response) {
    console.log(response);
    res.send(response);
  }).catch(function(err) {
    console.log(err);
    res.send(err);
  })
  // res.send(200)
});

router.get('*', function(req, res, next) {
  res.render('index', { title: 'picoShell' });
});

module.exports = router;
