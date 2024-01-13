module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '2.0.2', // Version of MongoDB
      skipMD5: true
    },
    autoStart: false
  }
};