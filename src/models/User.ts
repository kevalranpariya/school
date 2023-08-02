import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import { hashSync } from 'bcrypt';

interface UserInterface extends Model {
  id: number,
  username: string,
  password: string,
  role: 'principal' | 'teacher' | 'student',
  token: string | null
}

const User = sequelize.define<UserInterface>('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(50),
    unique: {
      name: '',
      msg: 'Username must be unique',
    },
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [ 7, 14 ],
        msg: 'Password length between 7 & 14 char',
      },
      set(this: any, value: any) {
        this.setDataValue('password', hashSync(value, 10));
      }
    }
  },
  role: {
    type: DataTypes.ENUM,
    values: [ 'principal', 'teacher', 'student' ],
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
  }
});

export default User;