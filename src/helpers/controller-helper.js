import _ from 'lodash';
import helpers from './index';

module.exports = {

  generateControllerFileContent(args) {
    return helpers.template.render('controllers/create-controller.js', {
      modelName: args.name,
      attributes: helpers.model.transformAttributes(args.attributes),
    },  {
      beautify: false,
      indent_size: 2,
      preserve_newlines: true,
    },);
  },

  generateControllerName(args) {
    return args.name;
  },

  generateControllerFile(args) {
    const controllerName = this.generateControllerName(args);
    const controllerPath = helpers.path.getControllerPath(controllerName);

    helpers.asset.write(
      controllerPath,
      this.generateControllerFileContent(args)
    );
  },
};
