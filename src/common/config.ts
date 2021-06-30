const config = {
  node_env: process.env.NODE_ENV,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  private_key: process.env.PRIVATE_KEY,
  mail: {
    api_key: process.env.MAILGUN_API_KEY,
    domain_name: process.env.MAILGUN_DOMAIN_NAME,
    from_email: process.env.MAILGUN_FROM_EMAIL,
  },
  aws: {
    access_key: process.env.AWS_ACCESS_KEY,
    secret_key: process.env.AWS_SECRET_KEY,
  },
  bcrypt: {
    round: process.env.BCRYPT_ROUND,
  },
};

export default config;
