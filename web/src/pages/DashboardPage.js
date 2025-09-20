import React from 'react';
import { Card, Typography, Grid, Button } from '@mui/material';

export default function DashboardPage() {
  return (
    <Grid container spacing={3} sx={{ mt: 2, px: 2 }}>
      <Grid item xs={12} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Bookings</Typography>
          <Typography variant="body2">View and manage your bookings.</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 1 }} href="/bookings">Go to Bookings</Button>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Vehicles</Typography>
          <Typography variant="body2">Manage your vehicles and details.</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 1 }} href="/vehicles">Go to Vehicles</Button>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Emergency</Typography>
          <Typography variant="body2">Access emergency services quickly.</Typography>
          <Button variant="contained" color="error" sx={{ mt: 1 }} href="/emergency">Emergency</Button>
        </Card>
      </Grid>
    </Grid>
  );
}
