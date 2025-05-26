import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url'; // Adicione pathToFileURL

// Obter o __dirname no contexto de ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Use pathToFileURL para importar o config.json
const configPath = path.join(__dirname, '/../config/config.json');
const config = (await import(pathToFileURL(configPath).href, { assert: { type: 'json' } })).default[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const files = fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'));

for await (const file of files) {
  const modelPath = path.join(__dirname, file);
  // Use pathToFileURL para importar os arquivos de modelo
  const modelDefiner = await import(pathToFileURL(modelPath).href);
  const model = modelDefiner.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;