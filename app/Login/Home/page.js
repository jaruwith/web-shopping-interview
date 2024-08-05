'use client';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import { fetchProducts } from '../../api'; 

export default function Home() {
  const [products, setProducts] = useState([]);

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

    if (quantity > product.stock) {
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
  };

  

  const handleQuantityChange = (productId, quantity) => {
    const product = products.find(p => p.productId === productId);
    if (quantity > product.stock) {
      toast.error('Quantity exceeds stock!');
      setQuantities({ ...quantities, [productId]: product.stock });
    } else {
      setQuantities({ ...quantities, [productId]: quantity });
    }
  };

 


  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Product List
        </Typography>

      

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
                  <TableCell align="center">{product.stock}</TableCell>
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
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

       
      </Box>
      <ToastContainer />
    </Container>
  );
}