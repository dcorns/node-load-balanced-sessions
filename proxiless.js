/**
 * proxiless
 * Created by dcorns on 8/28/15
 * Copyright © 2015 Dale Corns
 */
'use strict';
var net = require('net');



module.exports = function(){
  return{
    serverList: [],
    addServer: function(srv){
      //add validation
      this.serverList.push(srv);
    },
    setServerList: function(sl){
      //add validation
      this.serverList = sl;
    },
    getServerList: function(){
      return this.serverList;
    },
    startReporter: function(host, port){
      var reportStatus = net.createServer(function(cnt){
        cnt.on('data', function(data){
          console.log(data.toString())
        });
        cnt.write('true');
      });

      reportStatus.listen(port, host, function(){
        console.log(host + ' Listening for workload requests on port ' + port);

      });
    },
    findHelp: function findHelp(){
      var len = this.serverList.length, count = 0;
      for(count; count < len; count++){
        this.checkLoad(this.serverList[count]);
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