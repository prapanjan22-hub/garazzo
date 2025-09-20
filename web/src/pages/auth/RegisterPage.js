import React, { useState } from 'react';
import { Card, Typography, TextField, Button, Stack } from '@mui/material';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Card sx={{ p: 2, mt: 2, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5">Register</Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
        <Button variant="contained" color="primary">Register</Button>
      </Stack>
    </Card>
  );
}
