import React, { useState } from 'react';
import { Card, Typography, TextField, List, ListItem, ListItemText } from '@mui/material';

const sampleResults = [
  { id: 1, name: 'Mechanic A', location: 'Downtown' },
  { id: 2, name: 'Garage B', location: 'Uptown' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5">Search</Typography>
      <TextField
        label="Search for mechanics, garages, etc."
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <List sx={{ mt: 2 }}>
        {sampleResults
          .filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
          .map(result => (
            <ListItem key={result.id}>
              <ListItemText primary={result.name} secondary={result.location} />
            </ListItem>
          ))}
      </List>
    </Card>
  );
}
