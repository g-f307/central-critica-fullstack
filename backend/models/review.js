export default (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    mediaId: { // ID da mídia (do TMDB)
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mediaType: { // 'movie' ou 'tv'
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: { // Nota de 1 a 5
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "O comentário não pode estar vazio."
        }
      }
    },
    // O userId será adicionado pela associação
  });

  Review.associate = (models) => {
    // Uma crítica pertence a um usuário
    Review.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      as: 'user', // Alias para quando incluirmos o usuário
    });
  };

  return Review;
};