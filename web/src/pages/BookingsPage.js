import React from 'react';
import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const sampleBookings = [
  { id: 1, vehicle: 'Car A', date: '2025-09-21', status: 'Confirmed' },
  { id: 2, vehicle: 'Bike B', date: '2025-09-22', status: 'Pending' },
];

export default function BookingsPage() {
  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5">Your Bookings</Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.vehicle}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
