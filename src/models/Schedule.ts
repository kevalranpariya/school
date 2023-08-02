import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import Class from './Class';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

interface ScheduleInterface extends Model{
  id: number,
  weekday: string,
  time: string,
  date: string
}

const Schedule = sequelize.define<ScheduleInterface>('Schedule', {
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
}, {
  indexes: [{
    unique: true,
    fields: [ 'date', 'time','class_id' ],
  }]
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