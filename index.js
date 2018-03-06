const chalk = require('chalk');
const expressListEndpoints = require('express-list-endpoints');
const forEach = require('lodash/forEach');
const has = require('lodash/has');
const { table } = require('table');

function formatPath(path) {
  const pathParts = path.split('/');
  const pathFormatted = pathParts.map(part => (/^:/.test(part) ? chalk.inverse(part) : part));
  return pathFormatted.join('/');
}

function render(app) {
  const endpoints = expressListEndpoints(app);

  const paths = {};

  forEach(endpoints, (endpoint) => {
    if (!has(paths, endpoint.path)) {
      paths[endpoint.path] = [];
    }
    forEach(endpoint.methods, method => paths[endpoint.path].push(method));
  });

  let rows = [];

  forEach(paths, (methods, path) => {
    rows.push([
      formatPath(path),
      methods.sort().join(', '),
    ]);
  });

  rows = rows.sort((first, second) => {
    if (first[0] < second[0]) {
      return -1;
    }
    return 1;
  });

  rows.unshift([chalk.bold('path'), chalk.bold('methods')]);

  return table(rows);
}

module.exports = {
  formatPath,
  render,
};
