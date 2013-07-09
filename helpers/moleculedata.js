goog.provide('chemistry.MoleculeData');

chemistry.MoleculeData = function() {
	this.data = [{chainLength: 4, numBranches: 1, numFunctionalGroups: 0, imageFile: "images/molecules/test.png"},
				 {chainLength: 3, numBranches: 0, numFunctionalGroups: 0, imageFile: "images/molecules/test2.png"},
				 {chainLength: 5, numBranches: 0, numFunctionalGroups: 0, imageFile: "images/molecules/test3.png"},
				 {chainLength: 5, numBranches: 0, numFunctionalGroups: 0, imageFile: "images/molecules/test4.png"},
				 {chainLength: 6, numBranches: 0, numFunctionalGroups: 0, imageFile: "images/molecules/test5.png"},
				 {chainLength: 6, numBranches: 0, numFunctionalGroups: 0, imageFile: "images/molecules/test6.png"},
				 {chainLength: 6, numBranches: 0, numFunctionalGroups: 0, imageFile: "images/molecules/test7.png"},
				 {chainLength: 5, numBranches: 0, numFunctionalGroups: 0, imageFile: "images/molecules/test8.png"},
				 {chainLength: 5, numBranches: 0, numFunctionalGroups: 0, imageFile: "images/molecules/test9.png"},
				 {chainLength: 3, numBranches: 0, numFunctionalGroups: 0, imageFile: "images/molecules/test10.png"},
				 {chainLength: 3, numBranches: 0, numFunctionalGroups: 0, imageFile: "images/molecules/test11.png"},
				 {chainLength: 3, numBranches: 1, numFunctionalGroups: 0, imageFile: "images/molecules/test12.png"},
				 {chainLength: 4, numBranches: 0, numFunctionalGroups: 0, imageFile: "images/molecules/test13.png"},
				 {chainLength: 3, numBranches: 1, numFunctionalGroups: 0, imageFile: "images/molecules/test14.png"},
				 {chainLength: 4, numBranches: 0, numFunctionalGroups: 0, imageFile: "images/molecules/test15.png"}
				];

	for(var i in this.data) {
		var object = this.data[i];
		object.imageFile += "?"+goog.math.randomInt(10000);
	}
}

chemistry.MoleculeData.prototype.getMoleculeData = function() {
	return this.data;
};