import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';
import Class from './Class';
import User from './User';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

const ClassStudent = sequelize.define('ClassStudent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Class,
      key: 'id'
    },
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: {
      name: '',
      msg: 'This student already assign a class',
    },
    references: {
      model: User,
      key: 'id'
    }
  }
});

Class.hasMany(ClassStudent, {
  foreignKey: 'class_id'
});

ClassStudent.belongsTo(Class, {
  foreignKey: 'class_id'
});

User.hasMany(ClassStudent, {
  foreignKey: 'student_id'
});

ClassStudent.belongsTo(User, {
  foreignKey: 'student_id'
});

ClassStudent.beforeValidate(async (value: any) => {
  const findUser: any = await User.findByPk(value.student_id);
  if (findUser?.role === 'student') {
    return;
  } else throw new errHelper(errorTypes.not_found, 'Student not found');
});

export default ClassStudent;