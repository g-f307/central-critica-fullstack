import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "O nome não pode estar vazio."
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "O sobrenome não pode estar vazio."
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Este e-mail já está cadastrado."
      },
      validate: {
        isEmail: {
          msg: "Por favor, insira um e-mail válido."
        },
        notEmpty: {
          msg: "O e-mail não pode estar vazio."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "A senha não pode estar vazia."
        },
        len: {
          args: [8, 255],
          msg: "A senha deve ter pelo menos 8 caracteres."
        }
      }
    },
    profileImageUrl: { // NOVO CAMPO
      type: DataTypes.STRING,
      allowNull: true, // Pode ser nulo se o usuário não fornecer
      validate: {
        isUrl: { // Valida se é uma URL (opcional, mas bom ter)
          msg: "Por favor, insira uma URL válida para a imagem de perfil."
        }
      }
    }
  }, {
    hooks: {
      // ... (hooks beforeCreate e beforeUpdate para senha permanecem os mesmos)
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Método para verificar a senha
  User.prototype.isValidPassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.associate = (models) => {
    User.hasMany(models.Review, { 
        foreignKey: 'userId', 
        as: 'reviews'
    });
    User.hasMany(models.Article, { // NOVA ASSOCIAÇÃO
        foreignKey: 'userId', 
        as: 'articles' // Um usuário (autor) tem muitos artigos
    });
  };

  // Associações futuras (ex: um usuário pode ter várias críticas)
  // User.associate = (models) => {
  //   User.hasMany(models.Review, { foreignKey: 'userId' });
  //   User.hasMany(models.Article, { foreignKey: 'userId' });
  // };

  return User;
};