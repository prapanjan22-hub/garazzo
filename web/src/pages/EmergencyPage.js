import React from 'react';
import { Card, Typography, Button, Stack } from '@mui/material';

export default function EmergencyPage() {
  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5">Emergency Services</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        If you need urgent help, use the quick actions below or call our emergency hotline.
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" color="error">Call Roadside Assistance</Button>
        <Button variant="contained" color="warning">Contact Mechanic</Button>
        <Button variant="contained" color="primary">Send SOS</Button>
      </Stack>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Emergency Hotline: <b>1800-123-456</b>
      </Typography>
    </Card>
  );
}
