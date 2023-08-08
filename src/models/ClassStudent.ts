import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import Class from './Class';
import User from './User';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

interface ClassStudentInterface extends Model{
  // [x: string]: any;
  id: number,
  class_id: number,
  student_id:number
}

const ClassStudent = sequelize.define<ClassStudentInterface>('ClassStudent', {
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
      name: 'StudentUniqueConstraint',
      msg: 'This student already assign a class',
    },
    references: {
      model: User,
      key: 'id'
    }
  }
});

Class.hasMany(ClassStudent, {
  foreignKey: 'class_id',
  sourceKey: 'id',
  as: 'Students'
});

ClassStudent.belongsTo(Class, {
  foreignKey: 'class_id'
});

User.hasMany(ClassStudent, {
  foreignKey: 'student_id'
});

ClassStudent.belongsTo(User, {
  foreignKey: 'student_id',
  as: 'Student'
});

ClassStudent.beforeValidate(async value => {
  const findUser = await User.findByPk(value.student_id);
  const findClass = await Class.findByPk(value.class_id);
  if (!findClass) throw new errHelper(errorTypes.not_found, 'Class not found');
  if (findUser?.role !== 'student')throw new errHelper(errorTypes.not_found, 'Student not found');
});

export default ClassStudent;