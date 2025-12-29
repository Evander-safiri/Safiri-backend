require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const User = mongoose.model('User', {
  name: String,
  phone: String,
  role: { type: String, enum: ['rider', 'driver'] }
});

const Ride = mongoose.model('Ride', {
  riderName: String,
  pickup: String,
  destination: String,
  status: { type: String, default: 'requested' },
  driver: String,
  fare: Number,
  paid: { type: Boolean, default: false }
});

app.get('/', (req, res) => res.send('Safiri API running'));

app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/request-ride', async (req, res) => {
  try {
    const ride = new Ride(req.body);
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/rides', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/rides/:id/accept', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    ride.status = 'accepted';
    ride.driver = req.body.driverName;
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/rides/:id/complete', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    ride.status = 'completed';
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/rides/:id/pay', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.paid) return res.status(400).json({ error: 'Already paid' });
    ride.paid = true;
    await ride.save();
    res.json({ message: 'Payment recorded', ride });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Safiri backend running on port ${PORT}`));
