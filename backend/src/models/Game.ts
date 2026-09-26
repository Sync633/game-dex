import { DataTypes, Model } from "sequelize";

export class Game extends Model {
    declare id: number;
    declare nome: string;
    declare titulo: string;
    declare plataforma: string;
    declare genero: string;
    declare anoLancamento: number;
    declare zerado: boolean;
}