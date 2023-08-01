import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';
import Class from './Class';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  weekday: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

Class.hasMany(Schedule, {
  foreignKey: 'class_id'
});

Schedule.beforeValidate(async (value: any) => {
  const findClass: any = await Class.findByPk(value.class_id);
  if (findClass) {
    return;
  } else throw new errHelper(errorTypes.not_found, 'Class not found');
});

export default Schedule;