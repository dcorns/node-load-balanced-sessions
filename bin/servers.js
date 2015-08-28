/**
 * servers
 * Created by dcorns on 8/24/15
 * Copyright © 2015 Dale Corns
 * Starts up servers on different cores and threads
 */
'use strict';



var server1 = require('child_process').fork;
var server2 = require('child_process').fork;
var server3 = require('child_process').fork;

server1('bin/www1');
server2('bin/www2');
server3('bin/www3');