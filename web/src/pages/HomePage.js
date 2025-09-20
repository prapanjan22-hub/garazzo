import React from 'react';
import { Button, Card, Typography, Grid, AppBar, Toolbar } from '@mui/material';

export default function HomePage() {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Garazzo Dashboard
          </Typography>
          <Button color="inherit" href="/login">Login</Button>
          <Button color="inherit" href="/register">Register</Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} sx={{ mt: 2, px: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h5">Welcome to Garazzo!</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Your all-in-one platform for vehicle management, bookings, and emergency services.
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} href="/dashboard">
              Go to Dashboard
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Quick Links</Typography>
            <Button fullWidth variant="outlined" sx={{ mt: 1 }} href="/bookings">Bookings</Button>
            <Button fullWidth variant="outlined" sx={{ mt: 1 }} href="/vehicles">Vehicles</Button>
            <Button fullWidth variant="outlined" sx={{ mt: 1 }} href="/emergency">Emergency</Button>
            <Button fullWidth variant="outlined" sx={{ mt: 1 }} href="/community">Community</Button>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
