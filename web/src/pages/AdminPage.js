import React from 'react';
import { Card, Typography, Grid, Button } from '@mui/material';

export default function AdminPage() {
  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5">Admin Panel</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1">Total Users: 120</Typography>
          <Typography variant="body1">Active Bookings: 15</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button variant="contained" color="primary" sx={{ mr: 1 }}>Manage Users</Button>
          <Button variant="contained" color="secondary">View Analytics</Button>
        </Grid>
      </Grid>
    </Card>
  );
}
