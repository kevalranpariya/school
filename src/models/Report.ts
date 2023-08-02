import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import User from './User';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

interface ReportInterfaces extends Model{
  id: number,
  description: string,
  teacher_id: number,
  student_id: number
}

const Report = sequelize.define<ReportInterfaces>('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
  },
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

User.hasMany(Report, {
  foreignKey: 'teacher_id'
});

User.hasMany(Report, {
  foreignKey: 'student_id'
});

Report.beforeValidate(async value => {
  const findUser = await User.findByPk(value.student_id);
  if (findUser?.role === 'student') {
    return;
  } else throw new errHelper(errorTypes.not_found, 'Student not found');
});

export default Report;