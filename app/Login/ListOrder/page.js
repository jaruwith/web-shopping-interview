'use client';
import { useEffect, useState } from 'react';
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Pagination } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fetchOrders, fetchProducts, fetchOrderItems } from '../../api'; 

export default function ListOrder() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); 

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

    const fetchAllData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([fetchOrders(), fetchProducts()]);
        const productsMap = {};
        productsData.forEach(product => {
          productsMap[product.productId] = product.name;
        });
        const ordersWithFormattedDate = ordersData.map(order => ({
          ...order,
          orderDate: new Date(order.orderDate).toLocaleString('th-TH', {
            timeZone: 'Asia/Bangkok'
          })
        }));
        setOrders(ordersWithFormattedDate);
        setProducts(productsMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUser();
    fetchAllData();
  }, []);

  const handleDetailClick = async (orderId) => {
    try {
      const orderItemsData = await fetchOrderItems(orderId);
      setOrderItems(orderItemsData);
      setSelectedOrderId(orderId);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const filteredOrders = orders.filter(order => user && order.userId === user.userId);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalCartPrice = calculateTotalPrice(orderItems);

  const handlePrintOrders = async () => {
    const doc = new jsPDF();

    doc.text('Order List', 20, 10);
    doc.autoTable({
      head: [['Order ID', 'Total', 'Order Date', 'Status']],
      body: currentOrders.map(order => [
        order.orderId,
        order.total,
        order.orderDate,
        order.status
      ]),
    });

    for (const order of currentOrders) {
      const items = await fetchOrderItems(order.orderId);
      doc.addPage();
      doc.text(`Order Items for Order ID: ${order.orderId}`, 20, 10);
      doc.autoTable({
        head: [['Order Item ID', 'Product Name', 'Quantity', 'Price per Unit', 'Total Price']],
        body: items.map(item => [
          item.orderItemId,
          products[item.productId],
          item.quantity,
          item.price,
          item.price * item.quantity
        ]),
      });
      const totalOrderPrice = calculateTotalPrice(items);
      doc.text(`Total Price: ${totalOrderPrice}`, 20, doc.autoTable.previous.finalY + 10);
    }

    doc.save('order_list_with_details.pdf');
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Order List
        </Typography>

        {user && (
          <Box textAlign="center" mb={2}>
            <Typography variant="h6">Welcome, {user.username}</Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" color="primary" onClick={handlePrintOrders}>
            Print Orders
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Order ID</TableCell>
                <TableCell align="center">Order Date</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell align="center">{order.orderId}</TableCell>
                  <TableCell align="center">{order.orderDate}</TableCell>
                  <TableCell align="center">{order.status}</TableCell>
                  <TableCell align="center">{order.total}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDetailClick(order.orderId)}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(filteredOrders.length / ordersPerPage)}
            page={currentPage}
            onChange={(e, page) => paginate(page)}
            color="primary"
          />
        </Box>
      </Box>

      {selectedOrderId && (
        <Box my={4}>
          <Typography variant="h5" align="center" gutterBottom>
            Order Items for Order ID: {selectedOrderId}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Order Item ID</TableCell>
                  <TableCell align="center">Product Name</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Price per Unit</TableCell>
                  <TableCell align="center">Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.orderItemId}>
                    <TableCell align="center">{item.orderItemId}</TableCell>
                    <TableCell align="center">{products[item.productId]}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">{item.price}</TableCell>
                    <TableCell align="center">{item.price * item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box textAlign="right" mt={2}>
            <Typography variant="h6">Total Price: {totalCartPrice}</Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
}