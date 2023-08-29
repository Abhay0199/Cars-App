let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GEt, POST , OPTIONS, PUT, PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    next();
});
const port = 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
let { cars, carMaster } = require("./carsData.js");

app.get('/cars', (req, res) => {
    const { minprice, maxprice, fuel, type, sort } = req.query;

    // Apply filters based on query parameters
    let filteredCars = cars.filter(car => {
        return (!minprice || car.price >= parseInt(minprice)) &&
            (!maxprice || car.price <= parseInt(maxprice)) &&
            (!fuel || carMaster.find(master => master.model === car.model).fuel === fuel) &&
            (!type || carMaster.find(master => master.model === car.model).type === type);
    });

    // Apply sorting based on 'sort' parameter
    if (sort) {
        if (sort === 'price') {
            filteredCars.sort((a, b) => a.price - b.price);
        } else if (sort === 'year') {
            filteredCars.sort((a, b) => a.year - b.year);
        }
        // Add more sorting options if needed
    }

    res.json(filteredCars);
});

app.post('/cars', (req, res) => {
    const newCar = req.body; // Assuming request body contains new car details
    cars.push(newCar);
    res.status(201).json(newCar);
});

app.get('/cars/:id', (req, res) => {
    const carId = req.params.id;
    const car = cars.find(car => car.id === carId);
    if (car) {
        res.json(car);
    } else {
        res.status(404).json({ message: 'Car not found' });
    }
});
app.put('/cars/:id', (req, res) => {
    const carId = req.params.id;
    const updatedCar = req.body; // Assuming request body contains updated car details
    const carIndex = cars.findIndex(car => car.id === carId);

    if (carIndex !== -1) {
        cars[carIndex] = { ...cars[carIndex], ...updatedCar };
        res.json(cars[carIndex]);
    } else {
        res.status(404).json({ message: 'Car not found' });
    }
});

app.delete('/cars/:id', (req, res) => {
    const carId = req.params.id;
    const carIndex = cars.findIndex(car => car.id === carId);

    if (carIndex !== -1) {
        cars.splice(carIndex, 1);
        res.json({ message: 'Car deleted' });
    } else {
        res.status(404).json({ message: 'Car not found' });
    }
});
app.get('/carmaster', (req, res) => {
    res.json(carMaster);
});


