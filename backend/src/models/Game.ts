import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface GameAttributes {
  id: number;
  titulo: string;
  desenvolvedora: string;
  plataforma: string;
  genero: string;
  anoLancamento: number;
  zerado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Game extends Model implements GameAttributes {
  declare id: number;
  declare titulo: string;
  declare desenvolvedora: string;
  declare plataforma: string;
  declare genero: string;
  declare anoLancamento: number;
  declare zerado: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    desenvolvedora: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plataforma: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genero: {
      type: DataTypes.STRING,
      allowNull: false
    },
    anoLancamento: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    zerado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'games',
    timestamps: true
  }
);
