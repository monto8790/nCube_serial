/**
 * Created by Il Yeup, Ahn in KETI on 2017-02-25.
 */

/**
 * Copyright (c) 2018, OCEAN
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * 3. The name of the author may not be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// for TAS
var net = require('net');
var ip = require('ip');
var util = require('util');
var SerialPort = require('serialport');
var socket_arr = {};
var serial_flag = 0;
var serialportwdt = require('shortid').generate();
exports.socket_arr = socket_arr;

var tas_buffer = {};
exports.buffer = tas_buffer;

var _server = null;
exports.ready = function tas_ready () {
    if(_server == null) {
        _server = net.createServer(function (socket) {
            console.log('socket connected');
            socket.id = Math.random() * 1000;
            tas_buffer[socket.id] = '';
            socket.on('data', tas_handler);
            socket.on('end', function() {
                console.log('end');
            });
            socket.on('close', function() {
                console.log('close');
            });
            socket.on('error', function(e) {
                console.log('error ', e);
            });
        });

        _server.listen(conf.ae.tasport, function() {
            console.log('TCP Server (' + ip.address() + ') for TAS is listening on port ' + conf.ae.tasport);
        });
            serialport_open()                       
            myPort.on('open', showPortOpen);
            myPort.on('data', saveLastestData);
            myPort.on('close', showPortClose);
            myPort.on('error', showError);

        }
};
   
if(serial_flag == 1){
    wdt.del_wdt(serialportwdt);
}
else{
    wdt.set_wdt(serialportwdt, 3, exists);
}


function serialport_open(){
    myPort = new SerialPort(conf.mycomport, {
        baudRate : parseInt(conf.mybaudrate, 10),
        buffersize : 1
    });
    serial_flag = 1;
}

function showPortOpen() {
    console.log(myPort.path + ' port open. Data rate: ' + myPort.settings.baudRate);
    wdt.del_wdt(ota_send_wdt);
}

function exists(){
    SerialPort.list(function(err, ports){
        ports.forEach(function(port){
            if(port.comName == conf.myPort){
                serialport_open();
            }
            else{
                console.log("Not port");
            }
        });
    });

}


var serial_buffer = '';
var line = '';
function saveLastestData(data) {
    serial_buffer += data.toString();
    var data_arr = serial_buffer.split(',');8                                                                                      
    data_arr.splice(0,2);
    data_arr.splice(3,1);
    data_arr.splice(7,4);
    if(data_arr.length>=7){
        console.log(data_arr);
        var parent = '/' + conf.cse.name + '/' + conf.ae.name + '/' + conf.cnt[0].name;
        sh_adn.crtci(parent, 0, JSON.stringify(data_arr), this, function (status, res_body, to) {
            console.log('x-m2m-rsc : ' + status                                                + ' <----');
        });
    }                                         
    serial_buffer = '';
    data_arr = '';
}

function showPortClose() {
    console.log('port closed.');
    serial_flag = 1;
}

function showError(error) {
    var error_str = util.format("%s", error);
    console.log(error.message);
    serial_flag = 1;
    if (error_str.substring(0, 14) == "Error: Opening") {
    }
    else {
        console.log('SerialPort port error : ' + error);
    }
}
exports.noti = function(path_arr, cinObj) {
    var cin = {};
    cin.ctname = path_arr[path_arr.length-2];
    cin.con = (cinObj.con != null) ? cinObj.con : cinObj.content;

    if(cin.con == '') {
        console.log('---- is not cin message');
    }
    else {
        //console.log(JSON.stringify(cin));
        console.log('<---- send to tas');

        if (socket_arr[path_arr[path_arr.length-2]] != null) {
            socket_arr[path_arr[path_arr.length-2]].write(JSON.stringify(cin) + '<EOF>');
        }
    }
};

exports.qt_noti = function(aei, cinObj) {
    var cin = {};
    cin.con = (cinObj.con != null) ? cinObj.con : cinObj.content;
    console.log(cinObj);
    if(cin.con == '') {
        console.log('---- is not cin message');
    }
    else {
        if (socket_arr[aei] != null) {
            console.log('<---- send to tas');
            console.log(aei + '/' + cin.con);
            socket_arr[aei].write(aei + '/' + cin.con + '<EOF>');
        }
    }
};
