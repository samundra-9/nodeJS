const express = require('express');
const app = express();
const sampleData = [
    {id: 1, name: "John Doe", age: 30, disease: "Flu", city: "Delhi"},
    {id: 2, name: "Jane Smith", age: 25, disease: "Cold", city: "Mumbai"},
    {id: 3, name: "Sam Brown", age: 40, disease: "Diabetes", city: "Bangalore"},
    {id: 4, name: "Lisa White", age: 35, disease: "Hypertension", city: "Chennai"},
    {id: 5, name: "Tom Green", age: 50, disease: "Asthma", city: "Kolkata"},
];
app.use(express.json());
app.get('/patients', (req, res) => {
    res.json(sampleData);
});
app.get('/city/:name', (req, res) => {
    const cityName = req.params.name;
    const filteredPatients = sampleData.filter(patient => patient.city.toLowerCase() === cityName.toLowerCase());
    res.json(filteredPatients);
});

app.get('/search', (req, res) => {
    const diseaseName = req.query.disease;
    if (!diseaseName) {
        return res.status(400).json({ error: "Disease query parameter is required." });
    }

    const filteredPatients = sampleData.filter(
        patient => patient.disease.toLowerCase() === diseaseName.toLowerCase()
    );

    filteredPatients.length > 0
        ? res.json(filteredPatients)
        : res.status(404).json({ error: "No patients found." });
});

app.listen(4000, () => console.log("Hospital server running on 4000"));