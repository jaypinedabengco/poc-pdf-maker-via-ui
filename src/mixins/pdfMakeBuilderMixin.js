// not sure why "@/services/..." not working or viewed as error
import formsBuilderService from '../services/PDFMakeFormsBuilderService'
import DateService from '../services/DateService'
import { _ } from 'underscore'

const CANVAS_CHECK_FOR_CHECKBOX = {
  type: 'polyline',
  lineWidth: 2,
  lineColor: '#000',
  points: [
    {
      x: 1,
      y: 8
    },
    {
      x: 4,
      y: 10
    },
    {
      x: 10,
      y: 0
    }
  ]
}

export default {
  methods: {
    /**
     *
     * @param {*} doc
     */
    convertJSONToDocDefinition (doc) {
      return new Promise((resolve, reject) => {})
    },
    /**
     *
     * @param {*} documentDefinition
     */
    getPDFInBase64 (documentDefinition) {
      return new Promise((resolve, reject) => {
        documentDefinition.getDataUrl(dataUrl => {
          resolve(dataUrl)
        })
      })
    },
    /**
     *
     * @param {*} formDefinition
     */
    getDocumentHeaderDefinition (formDefinition) {
      return new Promise((resolve, reject) => {
        // hard coded
        // this part is expected to
        // process multiple stuff, like
        //  converting of images to base64,
        //  formatting of header & position
        //  etc..

        let logoImage = '/static/sample-data/images/header-logo/rta.png'

        // convert image to base64
        formsBuilderService
          .convertImageUrlToBase64ViaFetch(logoImage)
          .then(imageUrl => {
            let headerDefinition = {
              margin: [20, 20, 20, 10],
              table: {
                widths: ['*', '*'],
                heights: [20, 50, 70],
                body: [
                  [
                    {
                      stack: [
                        {
                          columns: [
                            {
                              text: 'Entry notice',
                              bold: true,
                              fontSize: 15,
                              margin: [0, 0, 5, 0],
                              width: 'auto'
                            },
                            {
                              text: '(Form 9)',
                              fontSize: 15,
                              width: 'auto'
                            }
                          ]
                        },
                        {
                          text:
                            'Residential Tenancies and Rooming Accomodation Act 2008',
                          italics: true,
                          fontSize: 8
                        },
                        {
                          text: '(Sections 192-199)',
                          italics: true,
                          fontSize: 8
                        }
                      ],
                      border: [false, false, false, true]
                    },
                    {
                      image: imageUrl,
                      width: 100,
                      margin: [0, 0, 0, 5],
                      alignment: 'right',
                      border: [false, false, false, true]
                    }
                  ]
                ]
              }
            }

            return headerDefinition
          })
          .then(resolve)
          .catch(reject)
      })
    },
    /**
     *
     * @param {*} formDefinition
     */
    getDocumentContentDefinition (formDefinition) {
      return new Promise((resolve, reject) => {
        let contentDefinition = []

        contentDefinition = [
          {
            // First Input
            table: {
              // label & input container ( label is vertical )
              widths: ['*'],
              body: [
                [
                  {
                    border: [false, false, false, false], // remove line
                    margin: [30, 40, 0, 0], // set position
                    table: {
                      // container
                      widths: [320],
                      body: [
                        [
                          {
                            // label container
                            border: [false, false, false, false], // remove line
                            text: 'Name/s and address of the tenant/s',
                            bold: true
                          }
                        ],
                        [
                          {
                            // forms container
                            border: [false, false, false, false], // remove line
                            table: {
                              // multiple form fields
                              widths: ['70%', '30%'],
                              body: [
                                [
                                  {
                                    // input field
                                    text: ' ', // value container
                                    colSpan: 2
                                  },
                                  ''
                                ],
                                [
                                  {
                                    // input field
                                    text: ' ', // value container
                                    colSpan: 2
                                  },
                                  ''
                                ],
                                [
                                  {
                                    // input field
                                    text: ' ', // value container
                                    colSpan: 2
                                  },
                                  ''
                                ],
                                [
                                  {
                                    text: ' ' // value container
                                  },
                                  {
                                    columns: [
                                      {
                                        text: 'Postcode' // label
                                      },
                                      {
                                        text: '', // value container
                                        bold: true
                                      }
                                    ]
                                  }
                                ]
                              ]
                            }
                          }
                        ]
                      ]
                    }
                  }
                ]
              ]
            },
            style: {
              // set default
              fontSize: 10 // default font size
            }
          }
        ]

        return resolve(contentDefinition)
      })
    },
    /**
     *
     * @param {*} formDefinition
     */
    getDocumentFooterDefinition (formDefinition) {
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
            widths: ['*'],
            body: [
              [
                {
                  stack: [
                    {
                      text:
                        'Level 23, 179 Turbot Street | GPO Box 390 Brisbane Q 4001 | t 1300 366 311 | rta.qld.gov.au',
                      fontSize: 10
                    }
                  ],
                  border: [false, true, false, false]
                }
              ]
            ]
          }
        }
        return resolve(footerDefinition)
      })
    },
    /**
     *
     * @param {*} documentDefinition
     * @param {*} formDefinition
     */
    updateDocumentDefinitionBasedOnFormDefinition (
      documentDefinition,
      formDefinition
    ) {
      return new Promise((resolve, reject) => {
        return Promise.all([
          formsBuilderService.getAllFieldReferenceIdAndValuesFromFormDefinition(
            formDefinition
          ), // get form definition object values
          formsBuilderService.getAllDocumentDefinitionObjectWithReferenceIds(
            documentDefinition
          ) // get document definition objects
        ])
          .then(results => {
            // update form defContainer based on searched content
            let formDefinitionContents = results[0]
            let documentDefinitionContainers = results[1]

            // check through all
            _.each(documentDefinitionContainers, documentDefContainer => {
              // get document
              let formField = _.findWhere(formDefinitionContents, {
                ref_id: documentDefContainer.ref_id
              })

              // if no formfield mapped
              if (!formField) {
                return // continue..
              }

              if (formField.type === 'text') {
                // if text
                // if empty string (''), then change to ' '
                documentDefContainer.text =
                  formField.value === '' ? ' ' : formField.value
              } else if (formField.type === 'checkbox') {
                // if checkbox

                // add polyline canvas if checked (value === true)
                if (
                  formField.value &&
                  documentDefContainer.canvas.length === 1
                ) {
                  let checkLineCanvas = JSON.parse(
                    JSON.stringify(CANVAS_CHECK_FOR_CHECKBOX)
                  ) // clone
                  documentDefContainer.canvas.push(checkLineCanvas)
                }
              } else if (formField.type === 'label') {
                documentDefContainer.text =
                  formField.value === '' ? ' ' : formField.value
              } else if (formField.type === 'select') {
                documentDefContainer.text =
                  formField.value === '' ? ' ' : formField.value
              } else if (formField.type === 'date-picker') {
                documentDefContainer.text = DateService.formatDate(
                  formField.value,
                  formField.format
                )
              }
            })

            // return document definition, with updated content
            return documentDefinition
          })
          .then(resolve)
          .catch(reject)
      })
    },

    /**
     * @param {*} documentDefinition
     * @param {*} formDefinitionContent
     */
    async updateDocumentDefinitionBasedOnFormDefinitionContent (
      documentDefinition,
      formDefinitionContents
    ) {
      try {
        let documentDefinitionContainers = await formsBuilderService.getAllDocumentDefinitionObjectWithReferenceIds(
          documentDefinition
        )

        documentDefinitionContainers.forEach(documentDefinitionContainer => {
          // get related formField from formDefinitionContents
          let formField = _.findWhere(formDefinitionContents, {
            ref_id: documentDefinitionContainer.ref_id
          })

          // if no mapped formfield, then considered as non existant
          if (!formField) {
            return // continue..
          }

          // do form type specific logic
          // and update 'documentDefinitionContainer' content
          if (formField.type === 'text') {
            // if text
            // if empty string (''), then change to ' '
            documentDefinitionContainer.text =
              formField.value === '' ? ' ' : formField.value
          } else if (formField.type === 'checkbox') {
            // if checkbox
            // add polyline canvas if checked (value === true)
            if (
              formField.value &&
              documentDefinitionContainer.canvas.length === 1
            ) {
              // clone canvas checkbox object
              let checkLineCanvas = JSON.parse(
                JSON.stringify(CANVAS_CHECK_FOR_CHECKBOX)
              )
              documentDefinitionContainer.canvas.push(checkLineCanvas)
            }
          } else if (formField.type === 'label') {
            // if label
            documentDefinitionContainer.text =
              formField.value === '' ? ' ' : formField.value
          } else if (formField.type === 'select') {
            // if formfield
            documentDefinitionContainer.text =
              formField.value === '' ? ' ' : formField.value
          } else if (formField.type === 'date-picker') {
            // if date-picker
            // then apply formatting
            documentDefinitionContainer.text = DateService.formatDate(
              formField.value,
              formField.format
            )
          } else if (formField.type === 'digital-signature' && formField.value) {
            console.log(formField.type, documentDefinitionContainer, formField)

            // if still text, then remove this (workaround)
            if (documentDefinitionContainer.text !== undefined) {
              delete documentDefinitionContainer.text
            }
            documentDefinitionContainer.image = formField.value
          }
        })
        return documentDefinition
      } catch (error) {
        throw error
      }
    },

    /**
     *
     * @param {*} documentDefinition
     * @param {*} formDefinition
     */
    updateDocumentDefinitionBasedOnFormDefinitionObselete (
      documentDefinition,
      formDefinition
    ) {
      return new Promise((resolve, reject) => {
        // get field values
        formsBuilderService
          .getAllFieldReferenceIdAndValuesFromFormDefinition(formDefinition)
          .then(fieldReferenceAndValues => {
            // convert from object to String
            let contentInJSONString = JSON.stringify(documentDefinition.content)
            fieldReferenceAndValues.forEach(refIdAndValue => {
              // if value is empty String (''), then replace with spaced string (' ')
              // to prevent empty looking container
              let value = refIdAndValue.value === '' ? ' ' : refIdAndValue.value
              let regex = `{{${refIdAndValue.ref_id}}}`
              contentInJSONString = contentInJSONString.replace(regex, value)
            })

            // remove all

            // convert from text to string
            return JSON.parse(contentInJSONString)
          })
          // update document definition content
          .then(documentDefinitionContent => {
            documentDefinition.content = documentDefinitionContent
            return documentDefinition
          })
          .then(resolve)
          .catch(reject)
      })
    },

    /**
     * @param {*} formDefinition
     */
    async extractFieldValueFromFormDefinition (formDefinition) {
      return formsBuilderService.extractClonedFieldsWithReferenceFromFormDefinition(
        formDefinition
      )
    },

    /**
     *
     * @param {*} content
     * @param {*} formDefinition
     */
    async populateContentToFormDefinition (contents, formDefinition) {
      try {
        let formDefinitionFields = await formsBuilderService.extractFieldsWithReferenceFromFormDefinition(
          formDefinition
        )
        _.each(contents, content => {
          if (content.ref_id) {
            let formField = _.findWhere(formDefinitionFields, {
              ref_id: content.ref_id
            })
            // populate based on formField type (if same)
            if (formField.type === 'label') {
              // if label, then do nothing
            } else if (formField.type === content.type) {
              formField.value = content.value
            }
          }
        })
      } catch (error) {
        console.log('populateContentToFormDefinition', error)
        throw error
      }
    }
  }
}
