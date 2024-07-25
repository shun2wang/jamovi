'use strict';

const electron = require('electron');
const app = electron.app;

module.exports = function () {
	var path = app.getPath('temp');
	return path;
};
