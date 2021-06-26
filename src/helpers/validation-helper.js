import helpers from './index';

const Sequelize = helpers.generic.getSequelize();
const validAttributeFunctionType = ['array', 'enum'];

/**
 * Check the given dataType actual exists.
 * @param {string} dataType
 */
function validateDataType(dataType) {
  if (!Sequelize.DataTypes[dataType.toUpperCase()]) {
    throw new Error(`Unknown type '${dataType}'`);
  }

  return dataType;
}

function getReference(referenceString){
  const reference= referenceString.replace('(', '').replace(')', '').replace('ref', '');
  const split = reference.split(';');
  if(split.length>1) return {validator: split[0], field: split[1]}
  else return {validator: split[0], field: 'id'}
}

function getDataType(split){
  const validValues = /^\{(,? ?[A-z0-9 ]+)+\}$/;
  const isValidFunction =
    validAttributeFunctionType.indexOf(split[1].toLowerCase()) !== -1;
  const isValidValue =
    validAttributeFunctionType.indexOf(split[2].toLowerCase()) === -1 &&
    split[2].match(validValues) === null;
  const isValidValues = split[2].match(validValues) !== null;
  if (isValidFunction && isValidValue && !isValidValues) {
    return {
      fieldName: split[0],
      dataType: split[2],
      dataFunction: split[1],
      dataValues: null,
    };
  }

  if (isValidFunction && !isValidValue && isValidValues) {
    return {
      fieldName: split[0],
      dataType: split[1],
      dataFunction: null,
      dataValues: split[2]
        .replace(/(^\{|\}$)/g, '')
        .split(/\s*,\s*/)
        .map((s) => `'${s}'`)
        .join(', '),
    };
  }
}

function validationMap(dataTypes){
  const validators = {
    string: ['uuid', 'text', 'string'],
    number: ['double', 'integer', 'float', 'number'],
    boolean: ['boolean'],
    data: ['data']  
  }

  const dataType = Object.keys(validators).find(key => validators[key].find(c => c.split(':')[0].includes(dataTypes)));
  if(dataType) return dataType;
  return dataTypes;
}

function formatAttributes(attribute) {
    let result;
    const split = attribute.split(':');
  
    if (split.length === 2) {
      result = {
        fieldName: split[0],
        dataType: validationMap(split[1]),
        dataFunction: null,
        dataValues: null,
      };
    } else if (split.length === 3) {
      if(split[2].startsWith('ref')){
        result = {
          fieldName: split[0],
          dataType: validationMap(split[1]),
          dataFunction: null,
          dataValues: null,
          reference: getReference(split[2])
        }
      } else if(split[2].startsWith('notNull')) {
        result = {
          fieldName: split[0],
          dataType: validationMap(split[1]),
          dataFunction: null,
          dataValues: null,
          notNull: true
        }
      }
      else {
        result = getDataType(split);
        if(!result){
          result = {
            fieldName: split[0],
            dataType: validationMap(split[1]),
            dataFunction: null,
            dataValues: null,
          };
        }
      }
    }
    else if(split.length === 4) {
      result  = getDataType(split);
      if(!result){
        result = {
          fieldName: split[0],
          dataType: validationMap(split[1]),
          dataFunction: null,
          dataValues: null,
        };
        if(split[2].startsWith('ref')){
          result.reference =  getReference(split[2])
        } 
        if(split[3].startsWith('notNull')) {
          result.notNull = true;
        } 
      } else {
      if(split[3].startsWith('ref')){
        result.reference =  getReference(split[2])
      } else if(split[3].startsWith('notNull')) {
        result.notNull = true;
      } 
    }
    } else if(split.length === 5) {
      result = getDataType(split);
      if(split[3].startsWith('ref')){
        result.reference =  getReference(split[3])
      } else if(split[4].startsWith('notNull')) {
        result.notNull = true;
      }
    }
    return result;
  }
module.exports = {
  transformAttributes(flag) {
    /*
      possible flag formats:
      - first_name:string,last_name:string,bio:text,role:enum:{Admin, 'Guest User'},reviews:array:string
      - 'first_name:string last_name:string bio:text role:enum:{Admin, Guest User} reviews:array:string'
      - 'first_name:string, last_name:string, bio:text, role:enum:{Admin, Guest User} reviews:array:string'
    */
    const attributeStrings = flag
      .split('')
      .map(
        (() => {
          let openValues = false;
          return (a) => {
            if ((a === ',' || a === ' ') && !openValues) {
              return '  ';
            }
            if (a === '{') {
              openValues = true;
            }
            if (a === '}') {
              openValues = false;
            }

            return a;
          };
        })()
      )
      .join('')
      .split(/\s{2,}/);

    return attributeStrings.map((attribute) => {
      const formattedAttribute = formatAttributes(attribute);

      try {
        validateDataType(formattedAttribute.dataType);
      } catch (err) {
        throw new Error(
          `Attribute '${attribute}' cannot be parsed: ${err.message}`
        );
      }

      return formattedAttribute;
    });
  },

  generateFileContent(args) {
    return helpers.template.render('validations/create-validation.js', {
      name: args.name,
      attributes: this.transformAttributes(args.attributes),
      underscored: args.underscored,
    });
  },

  generateFile(args) {
    const validatorPath = helpers.path.getValidationPath(args.name);

    helpers.asset.write(validatorPath, this.generateFileContent(args));
  },

  validatorFileExists(filePath) {
    return helpers.path.existsSync(filePath);
  },
};
