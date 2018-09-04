// not sure why "@/services/..." not working or viewed as error
import formsBuilderService from "../services/PDFMakeFormsBuilderService";
import {
  _
} from "underscore";

export default {
  methods: {
    convertJSONToDocDefinition(doc) {
      return new Promise((resolve, reject) => {});
    },
    getPDFInBase64(documentDefinition) {
      return new Promise((resolve, reject) => {
        documentDefinition.getDataUrl(dataUrl => {
          resolve(dataUrl);
        });
      });
    },
    getDocumentHeaderDefinition(formDefinition) {
      return new Promise((resolve, reject) => {

        // hard coded
        // this part is expected to 
        // process multiple stuff, like 
        //  converting of images to base64,
        //  formatting of header & position 
        //  etc..

        let logo_image = "/static/sample-data/images/header-logo/rta.png";
        // convert image to base64
        formsBuilderService.convertImageUrlToBase64ViaFileReader(logo_image)
          .then(image_url => {

            let headerDefinition = {
              margin: [20, 20, 20, 10],
              table: {
                widths: ["*", "*"],
                heights: [20, 50, 70],
                body: [
                  [{
                      stack: [{
                          columns: [{
                              text: "Entry notice",
                              bold: true,
                              fontSize: 15,
                              margin: [0, 0, 5, 0],
                              width: "auto"
                            },
                            {
                              text: "(Form 9)",
                              fontSize: 15,
                              width: "auto"
                            }
                          ]
                        },
                        {
                          text: "Residential Tenancies and Rooming Accomodation Act 2008",
                          italics: true,
                          fontSize: 8
                        },
                        {
                          text: "(Sections 192-199)",
                          italics: true,
                          fontSize: 8
                        }
                      ],
                      border: [false, false, false, true]
                    },
                    {
                      image: image_url,
                      width: 100,
                      margin: [0, 0, 0, 5],
                      alignment: "right",
                      border: [false, false, false, true]
                    }
                  ]
                ]
              }
            };

            return resolve(headerDefinition);

          });
      });
    },
    getDocumentContentDefinition(formDefinition) {
      return new Promise((resolve, reject) => {

        let form_body = formDefinition.form_body;
        let contentDefinition = [];

        // hard coded
        // form_body.forEach(form => {
        //   // if input
        //   if (form.type == "text") {
        //     contentDefinition.push(formsBuilderService.buildInputText(form));
        //   }
        // });

        contentDefinition = [{

          // First Input
          table: { // label & input container ( label is vertical )
            widths: ["*"],
            body: [
              [{
                border: [false, false, false, false], // remove line
                margin: [30, 40, 0, 0], // set position
                table: { // container
                  widths: [320],
                  body: [
                    [{ // label container
                      border: [false, false, false, false], // remove line
                      text: "Name/s and address of the tenant/s",
                      bold: true
                    }],
                    [{ // forms container
                      border: [false, false, false, false], // remove line
                      table: { // multiple form fields
                        widths: ["70%", "30%"],
                        body: [
                          [{ // input field
                            text: " ", // value container
                            colSpan: 2
                          }, ""],
                          [{ // input field
                            text: " ", // value container
                            colSpan: 2
                          }, ""],
                          [{ // input field
                            text: " ", // value container
                            colSpan: 2
                          }, ""],
                          [{
                              text: " " // value container
                            },
                            {
                              columns: [{
                                text: "Postcode" // label
                              }, {
                                text: "", // value container
                                bold: true
                              }]
                            }
                          ]
                        ]
                      }
                    }]
                  ]
                }
              }]
            ]
          },
          style: { // set default 
            fontSize: 10, // default font size
          }
        }];


        return resolve(contentDefinition);
      });
    },
    getDocumentFooterDefinition(formDefinition) {
      return new Promise((resolve, reject) => {

        // hard coded
        // this part is expected to 
        // process multiple stuff, like 
        //  converting of images to base64,
        //  formatting of header & position 
        //  etc..

        let footerDefinition = {
          margin: [20, 20, 20, 10],
          table: {
            widths: ["*"],
            body: [
              [{
                stack: [{
                  text: "Level 23, 179 Turbot Street | GPO Box 390 Brisbane Q 4001 | t 1300 366 311 | rta.qld.gov.au",
                  fontSize: 10
                }],
                border: [false, true, false, false]
              }]
            ]
          }
        };
        return resolve(footerDefinition);
      });
    },
    /**
     * 
     * @param {*} documentDefinition 
     * @param {*} formDefinition 
     */
    updateDocumentDefinitionBasedOnFormDefinition(documentDefinition, formDefinition) {
      return new Promise((resolve, reject) => {
        return Promise
          .all([
            formsBuilderService.getAllFieldReferenceIdAndValuesFromFormDefinition(formDefinition), // get form definition object values
            formsBuilderService.getAllDocumentDefinitionObjectWithReferenceIds(documentDefinition), // get document definition objects
          ])
          .then(results => {

            // update form defContainer based on searched content
            let formDefinitionContents = results[0];
            let documentDefinitionContainers = results[1];

            // check through all
            _.each(documentDefinitionContainers, documentDefContainer => {
              //get document
              let formField = _.findWhere(formDefinitionContents, {
                ref_id: documentDefContainer.ref_id
              });

              // if no formfield mapped
              if (!formField) {
                return; // continue..
              }

              if (formField.type == 'text') { // if text 
                // if empty string (''), then change to ' '
                documentDefContainer.text = (formField.value == '') ? ' ' : formField.value;
              } else if (formField.type == 'checkbox') { // if checkbox

                // console.log(formField, documentDefContainer, (formField.value && documentDefContainer.canvas.length));
                //empty
                // documentDefContainer.canvas.splice(0, documentDefContainer.canvas.length);
                // if (formField.value && documentDefContainer.canvas.length == 1) { // if checked && only empty checkbox
                // if ( documentDefContainer.canvas.length == 2 )
                // documentDefContainer.canvas.pop();
                if (formField.value && documentDefContainer.canvas.length == 1) {
                  let checkLineCanvas = {
                    "type": "polyline",
                    "lineWidth": 2,
                    "lineColor": "#000",
                    "points": [{
                        "x": 1,
                        "y": 8
                      },
                      {
                        "x": 4,
                        "y": 10
                      },
                      {
                        "x": 10,
                        "y": 0
                      }
                    ]
                  };
                  documentDefContainer.canvas.push(checkLineCanvas);
                }
                
                // documentDefContainer.canvas.push(this.CANVAS_CHECK_FOR_CHECKBOX);
                // } else if (!formField.value && documentDefContainer.canvas.length == 2) {
                //   documentDefContainer.canvas.pop(); // remove check
                // }
              }
            });

            // return document definition, with updated content
            return documentDefinition;
          })
          .then(resolve)
          .catch(reject);
      });
    },

    /**
     * 
     * @param {*} documentDefinition 
     * @param {*} formDefinition 
     */
    updateDocumentDefinitionBasedOnFormDefinitionObselete(documentDefinition, formDefinition) {
      return new Promise((resolve, reject) => {
        console.log(documentDefinition, formDefinition);

        // get field values
        formsBuilderService.getAllFieldReferenceIdAndValuesFromFormDefinition(formDefinition)
          .then(fieldReferenceAndValues => {

            // convert from object to String
            let contentInJSONString = JSON.stringify(documentDefinition.content);
            fieldReferenceAndValues.forEach(ref_id_and_value => {

              // if value is empty String (''), then replace with spaced string (' ')
              // to prevent empty looking container
              let value = ref_id_and_value.value == '' ? ' ' : ref_id_and_value.value;
              let regex = `{{${ref_id_and_value.ref_id}}}`;
              contentInJSONString = contentInJSONString.replace(regex, value);
            });

            // remove all 


            // convert from text to string
            return JSON.parse(contentInJSONString);
          })
          // update document definition content
          .then(documentDefinitionContent => {
            documentDefinition.content = documentDefinitionContent;
            return documentDefinition;
          })
          .then(resolve)
          .catch(reject);
      });
    }
  }
};
