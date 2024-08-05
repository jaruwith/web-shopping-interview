'use client';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import { fetchProducts, createOrder, updateProductStock } from '../../api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const fetchUser = () => {
      const userCookie = getCookie('user');
      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie));
        setUser(userData);
      }
    };

    const fetchUserId = () => {
      const userCookie = getCookie('user');
      if (userCookie) {
        const user = JSON.parse(decodeURIComponent(userCookie));
        setUserId(user.userId);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchUser();
    fetchUserId();
    fetchAllProducts();
  }, []);

  const handleAddToCart = (product) => {
    const quantity = quantities[product.productId] || 1;

    if (quantity > product.stock.quantity) {
      toast.error('Quantity exceeds stock!');
      return;
    }

    const existingItem = cartItems.find(item => item.productId === product.productId);

    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.productId === product.productId ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      const cartId = new Date().getTime(); 
      setCartItems([...cartItems, { ...product, quantity, cartId }]);
    }
    
    setQuantities({ ...quantities, [product.productId]: 1 });

    product.stock.quantity -= quantity;
  };

  const handleRemoveFromCart = (cartId) => {
    const item = cartItems.find(item => item.cartId === cartId);
    if (item) {
        setProducts(products.map(p =>
            p.productId === item.productId ? { ...p, stock: { ...p.stock, quantity: p.stock.quantity + item.quantity } } : p
        ));
    }
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };

  const handleQuantityChange = (productId, quantity) => {
    const product = products.find(p => p.productId === productId);
    if (quantity > product.stock.quantity) {
      toast.error('Quantity exceeds stock!');
      setQuantities({ ...quantities, [productId]: product.stock.quantity });
    } else {
      setQuantities({ ...quantities, [productId]: quantity });
    }
  };

  const handleCheckout = async () => {
    const orderData = {
      orderId: 0,
      userId: userId,
      total: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
      orderDate: new Date().toISOString(),
      status: "Pending",
      orderItems: cartItems.map(item => ({
        orderItemId: 0,
        orderId: 0,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const createdOrder = await createOrder(orderData);
      console.log('Order created:', createdOrder);
      
      for (const item of cartItems) {
        const product = products.find(p => p.productId === item.productId);
        if (product) {
            await updateProductStock(item.productId, product.stock.quantity);
        }
    }

      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);

      setCartItems([]);
      toast.success('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error creating order');
    }
  };

  const totalCartPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Product Data
        </Typography>

        {user && (
          <Box textAlign="center" mb={2}>
            <Typography variant="h6">Welcome, {user.username}</Typography>
          </Box>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.productId}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    {product.image ? (
                      <img src={`data:image/jpeg;base64,${product.image}`} alt={product.name} style={{ width: '50px', height: '50px' }} />
                    ) : (
                      <Typography>No Image</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">{product.name}</TableCell>
                  <TableCell align="center">{product.description}</TableCell>
                  <TableCell align="center">{product.price}</TableCell>
                  <TableCell align="center">{product.stock.quantity}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      inputProps={{ min: 1 }}
                      value={quantities[product.productId] || 1}
                      onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value))}
                      variant="outlined"
                      size="small"
                      style={{ width: '60px' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock.quantity === 0}
                    >
                      {product.stock.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {cartItems.length > 0 && (
          <Box my={4}>
            <Typography variant="h5" align="center">Shopping Cart</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">No.</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item, index) => (
                    <TableRow key={item.cartId}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{item.name}</TableCell>
                      <TableCell align="center">{item.price}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="center">{item.price * item.quantity}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleRemoveFromCart(item.cartId)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box textAlign="right" mt={2}>
              <Typography variant="h6">Total Price: {totalCartPrice}</Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => window.confirm('Are you sure you want to place the order?') && handleCheckout()}
                style={{ marginTop: '10px' }}
              >
                Check out
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <ToastContainer />
    </Container>
  );
}
