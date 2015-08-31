/**
 * proxiless
 * Created by dcorns on 8/28/15
 * Copyright © 2015 Dale Corns
 */
'use strict';
var net = require('net');

module.exports = function(hostServer){
  return{

    selfProxy: function(host, port, maxConnections, serverList){
      hostServer.on('connection', function(){
        console.log(host + ':' + port + ' checking status');
        hostServer.getConnections(function(err, count){
          if(err) return;
          console.log(count, maxConnections);
          if(count >= maxConnections){
            var len = serverList.length, c = 0;
            var found = false;
            for(c; c < len; c++){
              if(!(found)){
                console.log(c);
                checkLoad(serverList[c]);
                found = true;
              }
            }
          }
        });
        function checkLoad(srv){//take in a servers port and host, request its status and if true(meaning room for clients) return the connection else destroy the connection and return null
          var checkstatus = net.connect(srv, function(){
            checkstatus.write('checking on host ' + srv.host + ', port ' + srv.port);
          });
          checkstatus.on('error', function(){
            checkstatus.destroy();
            checkLoad(srv);
          });
          checkstatus.on('data', function(data){
            console.log(data.toString());
            if(!(data.toString() === 'true')){
              checkstatus.destroy();
              return false;
            }
            else{
              checkstatus.write('Thanks, Here is my stuff');
              return true;
            }

          });
        }
      });
      this.startReporter(host, port, maxConnections);
    },

    checkStatus: function(maxConnections, serverList){
      console.log('check status');
      hostServer.getConnections(function(err, count){
        if(err) return;
        console.log(count);
        if(count === maxConnections){
          this.findHelp(serverList);
        }
      });
    },

    startReporter: function(host, port, maxConnections){
      var status = 'true', reportStatus = net.createServer(function(cnt){
        cnt.on('data', function(data){
          console.log(data.toString())
        });
        hostServer.getConnections(function(err, count){
          if (err) return;
          console.log('connections: ' + count);
          if(maxConnections > count) status = 'true';
          else status = 'false';
          cnt.write(status);
        });

      });

      reportStatus.listen(port, host, function(){
        console.log(host + ' Listening for workload requests on port ' + port);

      });
    },
    findHelp: function findHelp(serverList){
      var len = serverList.length, count = 0;
      for(count; count < len; count++){
        this.checkLoad(serverList[count]);
      }
    },
    checkLoad: function checkLoad(srv){//take in a servers port and host, request its status and if true(meaning room for clients) return the connection else destroy the connection and return null
      var checkstatus = net.connect(srv, function(){
        checkstatus.write('checking on host ' + srv.host + ', port ' + srv.port);
      });

      checkstatus.on('error', function(){
        checkstatus.destroy();
        checkLoad(srv);
      });

      checkstatus.on('data', function(data){
        console.log(data.toString());
        if(!(data.toString() === 'true')) checkstatus.destroy();
        else checkstatus.write('Thanks, Here is my stuff');
      });
    }
  }
};