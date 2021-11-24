module.exports = {
  type: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: ['warn', 'error'],
  entities: ['dist/**/entities/**/*.entity.js'],
  migrations: ['dist/database/migrations/**/*.js'],
  cli: {
    entitiesDir: 'src/**/entities',
    migrationsDir: 'src/database/migrations',
  },
  seeds: ['src/database/seeds/**/*.ts'],
  factories: ['src/database/factories/**/*.ts'],
  baseUrl: './',
};
