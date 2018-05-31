const env = require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = require('isomorphic-fetch');
const {
  js_beautify: beautify
} = require('js-beautify');
const { CodeGen } = require('swagger-js-codegen');

const pathToApiDir = path.resolve(__dirname, '..', 'src');
const templatePath = path.resolve(__dirname, 'templates');

fetch(`${process.env.REACT_APP_API_BASE_URL}/swagger`)
  .then((response) => response.json())
  .then((swagger) => {
    const source = CodeGen.getCustomCode({
      className: 'API',
      swagger,
      lint: false,
      beautify: false,
      template: {
        class: fs.readFileSync(path.resolve(templatePath, 'react-template.mustache'), 'utf-8'),
        method: fs.readFileSync(path.resolve(templatePath, 'method.mustache'), 'utf-8'),
        type: fs.readFileSync(path.resolve(templatePath, 'type.mustache'), 'utf-8'),
      }
    });
    if (!fs.existsSync(pathToApiDir)) {
      throw `Path ${pathToApiDir} does not exists!`;
    }
    fs.writeFileSync(
      path.resolve(pathToApiDir, 'API.js'),
      beautify(source, {
        indent_size: 2,
        max_preserve_newlines: 2
      })
    );
  })
  .catch((e) => {
    console.error(e);
  });
