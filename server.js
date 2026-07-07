const express = require('express');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const products = [
  {
    id: 1,
    name: 'Classic Chocolate Brownie',
    price: 4.5,
    image: '/assets/classic chocolate browine.webp',
    alt: 'Classic Chocolate Brownie'
  },
  {
    id: 2,
    name: 'Fudge Brownie',
    price: 4.99,
    image: '/assets/fudgebrownies.webp',
    alt: 'Fudge Brownie'
  },
  {
    id: 3,
    name: 'Walnut Brownie',
    price: 5.5,
    image: '/assets/walnut_brownie_01.png',
    alt: 'Walnut Brownie'
  },
  {
    id: 4,
    name: 'Oreo Brownie',
    price: 5.25,
    image: '/assets/oreo browinee.jpg',
    alt: 'Oreo Brownie'
  },
  {
    id: 5,
    name: 'Caramel Brownie',
    price: 5.75,
    image: '/assets/caremel browie.jpg',
    alt: 'Caramel Brownie'
  },
  {
    id: 6,
    name: 'Red Velvet Brownie',
    price: 6.0,
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=600&auto=format&fit=crop',
    alt: 'Red Velvet Brownie'
  },
  {
    id: 7,
    name: 'Nutella Brownie',
    price: 5.9,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop&crop=bottom',
    alt: 'Nutella Brownie'
  },
  {
    id: 8,
    name: 'Cheesecake Brownie',
    price: 6.25,
    image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?q=80&w=600&auto=format&fit=crop',
    alt: 'Cheesecake Brownie'
  },
  {
    id: 9,
    name: 'Peanut Butter Brownie',
    price: 5.5,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=600&auto=format&fit=crop',
    alt: 'Peanut Butter Brownie'
  },
  {
    id: 10,
    name: 'Dark Chocolate Brownie',
    price: 4.75,
    image: '/assets/darkchocolate.webp',
    alt: 'Dark Chocolate Brownie'
  },
  {
    id: 11,
    name: 'Lotus Biscoff Brownie',
    price: 6.5,
    image: '/assets/lotus biscoff browinee.webp',
    alt: 'Lotus Biscoff Brownie'
  },
  {
    id: 12,
    name: "S'mores Brownie",
    price: 5.95,
    image: "/assets/s'mores browine.webp",
    alt: "S'mores Brownie"
  }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/checkout', (req, res) => {
  const { items } = req.body;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.json({
    success: true,
    message: 'Order received successfully',
    total
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function startServer(port, attempts = 0) {
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempts < 10) {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1, attempts + 1);
      return;
    }

    console.error(err);
    process.exit(1);
  });
}

startServer(PORT);
