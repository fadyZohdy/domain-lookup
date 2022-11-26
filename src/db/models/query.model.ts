import { DataTypes, Model } from "sequelize";

import sequelize from ".";

class Query extends Model {
  declare id: number;
  declare client_ip: string;
  declare domain: string;
  declare addresses: Array<string>;
  declare createdAt: Date;
}

export default Query.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    client_ip: { type: DataTypes.STRING, validate: { isIP: true } },
    domain: { type: DataTypes.STRING, allowNull: false },
    addresses: {
      type: DataTypes.JSON,
      allowNull: false,
      get() {
        const ips: Array<string> = this.getDataValue("addresses");
        return ips.map((ip) => ({ ip }));
      },
      validate: {
        isNonEmptyStringArray(value: any) {
          if (
            !(
              Array.isArray(value) &&
              value.length > 0 &&
              value.every((el) => {
                return typeof el === "string";
              })
            )
          ) {
            throw new Error("Ips should be an array of string");
          }
        },
      },
    },
    createdAt: DataTypes.DATE,
    created_at: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.createdAt.getTime() / 1000;
      },
    },
  },
  {
    tableName: "queries",
    updatedAt: false,
    sequelize,
  }
);
