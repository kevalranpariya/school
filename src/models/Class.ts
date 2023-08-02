import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import User from './User';
import errHelper from '../utils/errorHelper';
import errorTypes from '../utils/errorTypes';

interface ClassInterface extends Model{
  id: number,
  name: string,
  grade:string
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
  }
});

User.hasMany(Class, {
  foreignKey: 'teacher_id',
  onDelete: 'CASCADE',
});

Class.beforeValidate(async (value:any) => {
  const findUser: any = await User.findByPk(value.teacher_id);
  if (findUser?.role === 'teacher') {
    return;
  } else throw new errHelper(errorTypes.not_found, 'Teacher not found');
});
export default Class;