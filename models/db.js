import { Sequelize, DataTypes } from "sequelize";
import constants from "../config/default.js";

const { database } = constants;

const sequelize = new Sequelize(
    database.name,
    database.user,
    database.password,
     {
       host: database.host,
       dialect: 'mysql',
       logging: false
    }
);
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

 export default sequelize;