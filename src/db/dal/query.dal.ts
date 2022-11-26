import { Model } from "sequelize";

import Query from "../models/query.model";

const create = async (queryObj: Record<string, unknown>): Promise<Model> => {
  return await Query.create(queryObj);
};

const latest = async (limit = 20) => {
  return await Query.findAll({
    order: [["createdAt", "desc"]],
    limit,
  });
};

const truncate = async () => {
  return await Query.destroy({ truncate: true, cascade: false });
};

export default {
  create,
  latest,
  truncate,
};
