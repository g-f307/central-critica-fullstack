// backend/models/article.js
import { DataTypes } from 'sequelize';

export default (sequelize, SequelizeDataTypes) => {
  const Article = sequelize.define('Article', {
    title: {
      type: SequelizeDataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "O título do artigo não pode estar vazio."
        }
      }
    },
    content: {
      type: SequelizeDataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "O conteúdo do artigo não pode estar vazio."
        }
      }
    },
    slug: {
        type: SequelizeDataTypes.STRING,
        allowNull: false,
        unique: {
            msg: "Este slug já está em uso."
        }
    },
    coverImageUrl: {
        type: SequelizeDataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: {
                msg: "Por favor, insira uma URL válida para a imagem de capa."
            }
        }
    }
  });

  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      as: 'author',
    });
  };
  
  const generateSlug = (title) => {
    if (!title) return '';
    return title
      .toString()
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
      .trim()
      .replace(/\s+/g, '-') 
      .replace(/[^\w-]+/g, '') 
      .replace(/--+/g, '-') 
      .replace(/^-+|-+$/g, ''); 
  };

  Article.beforeValidate(async (article, options) => {
    if ((article.isNewRecord || article.changed('title') || !article.slug) && article.title) {
      let baseSlug = generateSlug(article.title);
      let slug = baseSlug;
      let counter = 1;
      let existingArticle;

      do {
        existingArticle = await Article.findOne({ where: { slug } });
        if (existingArticle && (article.isNewRecord || existingArticle.id !== article.id)) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        } else {
          break; 
        }
      } while (existingArticle);
      
      article.slug = slug;
    }
  });

  return Article;
};