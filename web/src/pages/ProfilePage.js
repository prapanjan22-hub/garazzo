import React from 'react';
import { Card, Typography, Button } from '@mui/material';

const user = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
};

export default function ProfilePage() {
  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5">Profile</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>Name: {user.name}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Typography variant="body1">Phone: {user.phone}</Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>Edit Profile</Button>
    </Card>
  );
}
