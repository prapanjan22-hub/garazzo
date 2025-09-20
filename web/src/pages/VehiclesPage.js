import React from 'react';
import { Card, Typography, Grid } from '@mui/material';

const sampleVehicles = [
  { id: 1, name: 'Car A', type: 'Sedan', year: 2022 },
  { id: 2, name: 'Bike B', type: 'Motorcycle', year: 2023 },
];

export default function VehiclesPage() {
  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {sampleVehicles.map((vehicle) => (
        <Grid item xs={12} md={6} key={vehicle.id}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">{vehicle.name}</Typography>
            <Typography variant="body2">Type: {vehicle.type}</Typography>
            <Typography variant="body2">Year: {vehicle.year}</Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
