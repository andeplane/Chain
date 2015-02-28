var myfiles = [];
var fs = require('fs');
var gm = require('gm');

var moleculeData = [];
fs.readdir('./images/large/',function(err,files){
    if(err) throw err;
    files.forEach(function(file) {
    	var splitted = file.split(".")[0].split("-");
    	if(splitted.length < 4) { console.log("Skipping "+file); }
    	else {
			// obtain the size of an image
			var filename = "images/large/"+file;
			var imageSize = [250,250];
			gm(filename).size( function (err, size) {
				console.log("Processing "+file);
				
				if (!err) {
		  			imageSize[0] = size.width;
		  			imageSize[1] = size.height;
				}
				var chainLength = parseInt(splitted[0]);
		        var numBranches = Number( splitted[1].replace(/\D/g, '') );
		        var numFunctionalGroups = Number(splitted[2].match("GR") != null) + Number(splitted[2].match("r") != null) + Number(splitted[2].match("g") != null);
		        
		        var molecule = {chainLength: chainLength, numBranches: numBranches, numFunctionalGroups: numFunctionalGroups, size: imageSize, imageFile: filename};
		        moleculeData.push(molecule);

		        console.log(JSON.stringify(moleculeData));
			} );   
		}
    }
    );
 });