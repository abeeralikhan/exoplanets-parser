const { parse } = require('csv-parse');
const fs = require('fs');
const habitablePlanets = [];

// to filter records
function isHabitable(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}
// Reading data from csv file
// readable.pipe(writeable)

fs.createReadStream('kepler_data.csv')
    .pipe(parse({
        comment: '#', // signifies that the comments are declared using the pound symbol in the csv file
        columns: true, // signifies that the data should be javascript object instead of an array 
    }))
    .on('data', (data) => {
        if (isHabitable(data)) habitablePlanets.push(data);
    })
    .on('error', (err) => {
        console.log(err);
    })
    .on('end', () => {
        console.log(habitablePlanets.map((planet) => { // to display only the names of the habitable planets that we've found
            return planet['kepler_name'];
        }))
        console.log(`${habitablePlanets.length} habitable planets found!`);
    });
