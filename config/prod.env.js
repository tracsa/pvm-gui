'use strict'

const base = {
  NODE_ENV: '"production"',
};

const envVars = [{
  name: 'CACAHUATE_URL',
  default: 'http://localhost:5000',
}, {
  name: 'DOQER_URL',
  default: 'http://localhost:6000',
}, {
  name: 'CACAHUATE_AUTHS',
  default: [{
    value: 'ldap',
    label: 'LDAP',
  }],
}];

envVars.forEach((envVar) => {
  let value = JSON.stringify(envVar.default);
  if (process.env[envVar.name] !== undefined) {
    value = process.env[envVar.name];
  }

  base[envVar.name] = value;
});

module.exports = base;
