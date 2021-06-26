import models from '../models';

const { <%=modelName %> } = models;

export default class <%=modelName %>Controller {
  static async create({ body }, res) {
    const result = await <%=modelName %>.create({
      ...body,
    });
    return res.status(201).json({
      status: 201,
      message: '<%=modelName %> created',
      data: result,
    })
  }

  static async get({ query: { limit = 10, offset = 0 }}, res) {
    const result = await <%=modelName %>.findAll({
      where: { deletedAt: null },
      limit,
      offset,
    });
    return res.status(200).json({
      status: 200,
      message: '<%=modelName %>',
      data: result,
    })
  }

  static async getOne({ params: { <%=modelName.toLowerCase() %>Id } }, res) {
    const result = await <%=modelName %>.findAll({
      where: { id: <%=modelName.toLowerCase() %>Id, deletedAt: null },
    });
    return res.status(201).json({
      status: 201,
      message: '<%=modelName %>',
      data: result,
    })
  }

  static async update({ body, params: { <%=modelName.toLowerCase() %>Id } }, res) {
    const updated = await <%=modelName %>.update(body, {
      where: { id: <%=modelName.toLowerCase() %>Id },
      returning: true, plain: true
    });
    return res.status(200).json({
      status: 200,
      message: '<%=modelName %> updated',
      data: updated[1],
    })
  }

  static async delete({ params: { <%=modelName.toLowerCase() %>Id } }, res) {
    await <%=modelName %>.update(
      { deletedAt: new Date() },
      { where: { id: <%=modelName.toLowerCase() %>Id } }
    );
    return res.status(200).json({
      status: 200,
      message: '<%=modelName %> deleted',
    })
  }
}
