import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';
import User from './User';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM,
    values: [
      'present',
      'absent'
    ]
  }
}, {
  indexes: [{
    unique: true,
    fields: [ 'student_id', 'date' ],
  }],
});

User.hasMany(Attendance, {
  foreignKey: 'student_id'
});

Attendance.beforeCreate(async (value: any) => {
  const findUser: any = await User.findByPk(value.student_id);
  if (findUser?.role === 'student') {
    return;
  } else throw new errHelper(errorTypes.not_found, 'Student not found');
});

export default Attendance;