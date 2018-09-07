const pdfMake = require('pdfmake');
const HARD_CODED_BASE_DEFINITIONS = {
  'entry-notice-form-9': require('./../sample_data/pdfDocumentDefinition/entry-notice-form-9.json')
};

/**
 * @param {*} formId
 */
let getBase64 = formId => {
  return Promise((resolve, reject) => {
    let formDefinition = HARD_CODED_BASE_DEFINITIONS[formId];
    if (!formDefinition) {
      return reject(`Form ID of ${formId} not found`);
    }

    return pdfMake.createPdf(formDefinition).getBase64(base64 => {
      return resolve(base64);
    });
  });
};

exports.getBase64 = getBase64;
