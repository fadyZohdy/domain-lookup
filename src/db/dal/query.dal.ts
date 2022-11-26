import { Model } from "sequelize";

import Query from "../models/query.model";

const create = async (queryObj: Record<string, unknown>): Promise<Model> => {
  return await Query.create(queryObj);
};

const latest = async (clientIp: string | undefined, limit = 20) => {
  return await Query.findAll({
    where: { client_ip: clientIp },
    order: [["createdAt", "desc"]],
    limit,
  });
};

export default {
  create,
  latest,
};
