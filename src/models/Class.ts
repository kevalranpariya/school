import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import User from './User';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';
import { notAssignMessage, notFoundMessage } from '../utils/printMessage';
import { role } from '../constant/role';

interface ClassInterface extends Model{
  id: number,
  name: string,
  grade: string,
  teacher_id: number
}

const Class = sequelize.define<ClassInterface>('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    unique: {
      'name': '',
      'msg': notAssignMessage('teacher')
    }
  }
});

User.hasMany(Class, {
  foreignKey: 'teacher_id',
  onDelete: 'CASCADE',
});

Class.belongsTo(User, {
  foreignKey: 'teacher_id',
  as: 'Teacher'
});

Class.beforeValidate(async value => {
  const findUser = await User.findByPk(value?.teacher_id);
  if (findUser?.role === role.TEACHER) {
    return;
  } else throw new errHelper(errorTypes.not_found, notFoundMessage('Teacher'));
});
export default Class;