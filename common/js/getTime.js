const dataTime = ()=> {
	let date = new Date();
	let yearsList = [];
	for (let i = date.getFullYear(); i > 2008; i--) {
		yearsList.push(i)
	}
	let month = date.getMonth();
	// if (month < 10) {
	// 	month = '0' + month
	// }
	let dataList = [];
	dataList[0] = date.getFullYear();
	dataList[1] = month;
	return dataList
};

export {
	dataTime
}
