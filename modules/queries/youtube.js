/*jslint node: true */
/*jslint nomen: true */

var request = require('request'),
    ownerName = require(__dirname + '/../../config.json');

module.exports = function (token, cb) {
    'use strict';
    
    var url = "https://www.googleapis.com/youtube/v3/channels?part=id%2Csnippet%2Cstatistics&managedByMe=true&maxResults=50&onBehalfOfContentOwner=" + ownerName.client.owner + "&access_token=" + token,
        channels = {
            items: []
        };
    
    
    function getChannels(url) {
        
        
        request.get(url, function (e, r, b) {
            
            var i,
                chan,
                npt,
                parse = JSON.parse(b);
            
            for (i in parse.items) {
                
                if (parse.items[i] !== null) {
                    
                    chan = parse.items[i];
                
                    channels.items.push(parse.items[i]);
                    
                }
                
            }
            
            if (parse.nextPageToken !== undefined) {
                npt = parse.nextPageToken;
                url = "https://www.googleapis.com/youtube/v3/channels?part=id%2Csnippet%2Cstatistics&managedByMe=true&maxResults=50&onBehalfOfContentOwner=" + ownerName.owner + "&pageToken=" + npt + "&access_token=" + token;
                
                getChannels(url);
                
            } else {
                
                return cb(null, channels);
                
            }
            
        });
        
    }
    
    getChannels(url);
    
};