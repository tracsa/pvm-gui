const settings = {
  'pvm': {
    'protocol': 'http',
    'host': 'localhost',
    'port': 5000,
    'authProviders': [
      {
        'value': 'ldap',
        'label': 'LDAP',
      },
    ],
  },
  'doqer': {
    'protocol': 'http',
    'host': 'localhost',
    'port': 6000,
  },
}

module.exports = settings;
