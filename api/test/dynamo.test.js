var dynamoProvider = require('./../providers/dynamodb.connection.provider');
var movieDataJSON = require('./../sample_data/moviedata.json');

/**
 *
 */
let addMoviesTable = async () => {
  try {
    let params = {
      TableName: 'Movies',
      KeySchema: [
        {
          AttributeName: 'year',
          KeyType: 'HASH'
        }, // Partition key
        {
          AttributeName: 'title',
          KeyType: 'RANGE'
        } // Sort key
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'year',
          AttributeType: 'N'
        },
        {
          AttributeName: 'title',
          AttributeType: 'S'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      }
    };

    let dynamodb = await dynamoProvider.getDynamoDB();
    dynamodb.createTable(params, (err, data) => {
      if (err) {
        console.error(
          'Unable to create table. Error JSON:',
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log(
          'Created table. Table description JSON:',
          JSON.stringify(data, null, 2)
        );
      }
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 */
let loadMovies = async () => {
  try {
    let docClient = await dynamoProvider.getDocClient();

    movieDataJSON.forEach(movie => {
      let params = {
        TableName: 'Movies',
        Item: {
          year: movie.year,
          title: movie.title,
          info: movie.info
        }
      };

      docClient.put(params, (err, data) => {
        if (err) {
          console.error(
            'Unable to add movie',
            movie.title,
            '. Error JSON:',
            JSON.stringify(err, null, 2)
          );
        } else {
          console.log('PutItem succeeded:', movie.title);
        }
      });
    });
  } catch (error) {
    console.log('error', error);
  }
};

/// ///

/**
 * TRigger here
 */

addMoviesTable()
  .then(() => loadMovies())
  .then(() => console.log('done!'))
  .catch(err => console.log('error', err));

/// ///
