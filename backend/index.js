const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
  res.send('OK'); // juste pour tester
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
