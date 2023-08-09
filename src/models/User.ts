import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import { hashSync } from 'bcrypt';
import { passwordLengthMessage, usernameUniqueMessage } from '../utils/printMessage';
import { role } from '../constant/role';

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
      msg: usernameUniqueMessage,
    },
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [ 7, 14 ],
        msg: passwordLengthMessage,
      },
      set(this: any, value: string) {
        this.setDataValue('password', hashSync(value, 10));
      }
    }
  },
  role: {
    type: DataTypes.ENUM,
    values: [ role.PRINCIPAL, role.TEACHER, role.STUDENT ],
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
  }
});

export default User;