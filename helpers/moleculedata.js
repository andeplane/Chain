goog.provide('chemistry.MoleculeData');

chemistry.MoleculeData = function() {
	this.data = [{chainLength: 4, numBranches: 0, numFunctionalGroups: 0, size: [250,92], imageFile: "images/molecules/butan.4.1.png"},
				 {chainLength: 4, numBranches: 0, numFunctionalGroups: 0, size: [250,143], imageFile: "images/molecules/butan.4.2.png"},
				 {chainLength: 4, numBranches: 0, numFunctionalGroups: 0, size: [250,70], imageFile: "images/molecules/butan.4.3.png"},
				 {chainLength: 6, numBranches: 0, numFunctionalGroups: 0, size: [250,240], imageFile: "images/molecules/ccc-heksatrien.6.png"},
				 {chainLength: 4, numBranches: 0, numFunctionalGroups: 0, size: [250,185], imageFile: "images/molecules/cis-buten.4.1.png"},
				 {chainLength: 4, numBranches: 0, numFunctionalGroups: 0, size: [244,250], imageFile: "images/molecules/cis-buten.4.2.png"},
				 {chainLength: 5, numBranches: 0, numFunctionalGroups: 0, size: [250,234], imageFile: "images/molecules/cis,cis-pentadien.5.png"},
				 {chainLength: 5, numBranches: 0, numFunctionalGroups: 0, size: [250,159], imageFile: "images/molecules/cis,trans-pentadien.5.png"},
				 {chainLength: 6, numBranches: 0, numFunctionalGroups: 0, size: [250,140], imageFile: "images/molecules/ctc-heksatrien.6.png"},
				 {chainLength: 3, numBranches: 0, numFunctionalGroups: 0, size: [250,175], imageFile: "images/molecules/propan.3.1.png"},
				 {chainLength: 3, numBranches: 0, numFunctionalGroups: 0, size: [250,100], imageFile: "images/molecules/propan.3.2.png"},
				 {chainLength: 3, numBranches: 0, numFunctionalGroups: 0, size: [250,128], imageFile: "images/molecules/propan.3.3.png"},
				 {chainLength: 6, numBranches: 0, numFunctionalGroups: 0, size: [228,250], imageFile: "images/molecules/tcc-heksatrien.6.png"},
				 {chainLength: 6, numBranches: 0, numFunctionalGroups: 0, size: [250,59], imageFile: "images/molecules/tct-heksatrien.6.png"},
				 {chainLength: 5, numBranches: 0, numFunctionalGroups: 0, size: [250,73], imageFile: "images/molecules/trans,trans-pentan.5.1.png"},
				 {chainLength: 5, numBranches: 0, numFunctionalGroups: 0, size: [250,54], imageFile: "images/molecules/trans,trans-pentan.5.2.png"},
				 {chainLength: 6, numBranches: 0, numFunctionalGroups: 0, size: [250,118], imageFile: "images/molecules/ttc-heksatrien.6.png"}
				];

	for(var i in this.data) {
		var object = this.data[i];
		object.imageFile += "?"+goog.math.randomInt(10000);
	}
}

chemistry.MoleculeData.prototype.getMoleculeData = function() {
	return this.data;
};