export default {
    methods: {
        convertJSONToDocDefinition(doc) {
            return new Promise((resolve, reject) => {
            });
        },
        convertImageUrlToBase64ViaCanvas(imageUrl) {
            return new Promise((resolve, reject) => {

                let canvas = document.createElement('canvas');
                let img = document.createElement('img');
                img.src = imageUrl;

                // load
                img.onload = function () {
                    canvas.height = img.height;
                    canvas.width = img.width;
                    let base64 = canvas.toDataURL('image/png');
                    canvas = null; // clean
                    return resolve(base64);
                };

                /*
                et canvas = document.createElement('canvas');
                let img = document.createElement('img');
                img.src = imageUrl;

                img.onload = function () {
                    let ctx = canvas.getContext('2d');
                    let dataURL;
                    canvas.height = img.naturalHeight;
                    canvas.width = img.naturalWidth;
                    ctx.drawImage(img, 0, 0);
                    dataURL = canvas.toDataURL('image/png');
                    resolve(dataURL);
                };

                // if fails
                img.onerror = function (error) {
                    return reject(error);
                };                
                */

                // if fails
                img.onerror = function (error) {
                    return reject(error);
                };
            });
        },
        convertImageUrlToBase64ViaFileReader(imageUrl) {
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        return resolve(reader.result);
                    }
                    reader.readAsDataURL(xhr.response);
                };
                xhr.onerror = function () {
                    return reject({
                        message: 'Something went wrong on convertImageUrlToBase64ViaFileReader',
                        xhr_status: xhr.status,
                        xhr: xhr
                    });
                }
                xhr.open('GET', imageUrl);
                xhr.responseType = 'blob';
                xhr.send();
            })
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
                this.convertImageUrlToBase64ViaFileReader(logo_image)
                    .then(image_url => {

                        let headerDefinition = {
                            margin: [20, 20, 20, 10],
                            table: {
                                widths: ["*", "*"],
                                heights: [20, 50, 70],
                                body: [
                                    [
                                        {
                                            stack: [
                                                {
                                                    columns: [
                                                        {
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
                                                    text:
                                                        "Residential Tenancies and Rooming Accomodation Act 2008",
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
                        }

                        return resolve(headerDefinition);

                    });
            });
        },
        getDocumentContentDefinition(formDefinition) {
            return new Promise((resolve, reject) => {
                // hard coded

                console.log(formDefinition, formDefinition.form_body);
                let form_body = formDefinition.form_body;

                let contentDefinition = [];
                form_body.forEach(form => {

                    // if input
                    if (form.type == 'text') {
                        contentDefinition.push(this._buildInputText(form));
                        console.log(this._buildInputText(form));
                    }

                });

                return resolve(contentDefinition);
            });
        },
        getDocumentFooterDefinition(formDefinition) {
            return new Promise((resolve, reject) => {
                // hard coded
                let footerDefinition = {
                    margin: [20, 20, 20, 10],
                    table: {
                        widths: ["*"],
                        body: [
                            [
                                {
                                    stack: [
                                        {
                                            text:
                                                "Level 23, 179 Turbot Street | GPO Box 390 Brisbane Q 4001 | t 1300 366 311 | rta.qld.gov.au",
                                            fontSize: 10
                                        }
                                    ],
                                    border: [false, true, false, false]
                                }
                            ]
                        ]
                    }
                }
                return resolve(footerDefinition);
            });
        },

        _buildInputText(formInputDefinition) {

            let builtDefinition = [];

            // build label
            let label_definition = formInputDefinition.label;
            if (label_definition) {
                let label = {
                    text: label_definition.value
                };

                if (label_definition.bold) {
                    label['bold'] = true;
                }

                // add label
                builtDefinition.push(label);
            }


            // build table, this will be used as the container
            let input_value_definition = {
                stack: [],
                border: [false, false, false, true] // underscore only
            };

            input_value_definition.stack.push({
                text: formInputDefinition.value || ' ',
            });

            let input_definition = {
                table: {
                    widths: [formInputDefinition.width ? parseInt(formInputDefinition.width) : '*'],
                    body: [[
                        input_value_definition
                    ]]
                }
            };

            // logic here
            if (formInputDefinition.inputLine.type == 'box') {
                input_value_definition.border = [true, true, true, true];
            } else if (formInputDefinition.inputLine.type == 'dotted') {
                input_value_definition.border = [false, false, false, false];
                // add canvas to stack

                let dotted_text = "";
                for ( let i = 0; i < parseInt(formInputDefinition.width); i++ ){
                    dotted_text += '. ';
                }

                input_value_definition.stack.push({
                    text: dotted_text, 
                    width: formInputDefinition.width, 
                    margin: [0, -10, 0, 0]
                });

            }

            // add input
            builtDefinition.push(input_definition);

            return builtDefinition;
        }
    }
}
