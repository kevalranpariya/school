import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('school', 'sarvadhi', 'password', {
  dialect: 'postgres',
  logging: false
});

sequelize.sync({ alter: true });

export default sequelize;