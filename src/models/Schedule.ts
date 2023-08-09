import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import Class from './Class';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
import ClassStudent from './ClassStudent';
import Attendance from './Attendance';
import { notFoundMessage } from '../utils/printMessage';

interface ScheduleInterface extends Model{
  id: number,
  weekday: string,
  time: string,
  date: string,
  class_id: number,
  Class : any
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
  foreignKey: 'class_id',
  sourceKey: 'id'
});

Schedule.belongsTo(Class, {
  foreignKey: 'class_id'
});

ClassStudent.hasMany(Schedule, {
  foreignKey: 'class_id',
  sourceKey: 'class_id'
});

ClassStudent.hasMany(Attendance, {
  foreignKey: 'student_id',
  sourceKey: 'student_id'
});

Schedule.beforeValidate(async value => {
  const findClass = await Class.findByPk(value.class_id);
  if (findClass) {
    return;
  } else throw new errHelper(errorTypes.not_found, notFoundMessage('Class'));
});

export default Schedule;