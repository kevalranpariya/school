import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';
import { hash } from 'bcrypt';
const User = sequelize.define('User', {
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
      }
    }
  },
  role: {
    type: DataTypes.ENUM,
    values: [ 'principal', 'teacher', 'student' ],
    allowNull: false,
  },
});

User.afterValidate(async (user: any) => {
  user.password = await hash(user.password, 10);
});

export default User;