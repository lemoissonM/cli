# sequelize/cli [![npm version](https://badge.fury.io/js/sequelize-cli.svg)](https://npmjs.com/package/sequelize-cli) [![Build Status](https://travis-ci.org/sequelize/cli.svg?branch=master)](https://travis-ci.org/sequelize/cli)

The [Sequelize](https://sequelize.org) Command Line Interface (CLI)

## Improvement (lemoissonM)

- Added controller (CRUD) and validator (create and update) when generating model

- Use npx `https://github.com/lemoissonM/cli ....`
When passing the attributes you can now add the reference and notNull properties direclty from the cli
ex: `https://github.com/lemoissonM/cli model:generate --name User --attributes 'name:string:notNull,roleId:uuid:ref(roles;id):notNull'`

In the example : we are creating the table user with the attribute name of type string and it should not allow nulls, we are also adding another attribute 'roleId' which is uuid, we are adding reference to the roles table with target 'id'

### New syntax of attributes 

- if attribute has reference :  `nameOfAttribute:dataType:ref(tableName;targetKey)`
- if attribute should not be null : `nameOfAttribute:dataType:notNull`
- if attribute should not be null and has reference : `nameOfAttribute:dataType:ref(tableName;targetKey):notNull ( in this case notNull comes after reference)`

### When generating the validation all attributes with not null will be set as required 

## Table of Contents

- [Installation](#installation)
- [Contributing](#contributing)
- [Documentation](#documentation)

## Installation

Make sure you have [Sequelize](https://sequelize.org) installed. Then install the Sequelize CLI to be used in your project with

```bash
npm install --save-dev sequelize-cli
```

And then you should be able to run the CLI with

```bash
npx sequelize --help
```

### Usage

```bash
Sequelize CLI [Node: 10.21.0, CLI: 6.0.0, ORM: 6.1.0]

sequelize <command>

Commands:
  sequelize db:migrate                        Run pending migrations
  sequelize db:migrate:schema:timestamps:add  Update migration table to have timestamps
  sequelize db:migrate:status                 List the status of all migrations
  sequelize db:migrate:undo                   Reverts a migration
  sequelize db:migrate:undo:all               Revert all migrations ran
  sequelize db:seed                           Run specified seeder
  sequelize db:seed:undo                      Deletes data from the database
  sequelize db:seed:all                       Run every seeder
  sequelize db:seed:undo:all                  Deletes data from the database
  sequelize db:create                         Create database specified by configuration
  sequelize db:drop                           Drop database specified by configuration
  sequelize init                              Initializes project
  sequelize init:config                       Initializes configuration
  sequelize init:migrations                   Initializes migrations
  sequelize init:models                       Initializes models
  sequelize init:seeders                      Initializes seeders
  sequelize migration:generate                Generates a new migration file      [aliases: migration:create]
  sequelize model:generate                    Generates a model and its migration [aliases: model:create]
  sequelize seed:generate                     Generates a new seed file           [aliases: seed:create]

Options:
  --version  Show version number                                                  [boolean]
  --help     Show help                                                            [boolean]

Please specify a command
```

## Contributing

All contributions are accepted as a PR.

- You can file issues by submitting a PR (with test) as a test case.
- Implement new feature by submitting a PR
- Improve documentation by submitting PR to [Sequelize](https://github.com/sequelize/sequelize)

Please read the [contributing guidelines](CONTRIBUTING.md).

## Documentation

- [Migrations Documentation](https://sequelize.org/master/manual/migrations.html)
- [CLI Options](docs/README.md)
- [Frequently Asked Questions](docs/FAQ.md)
