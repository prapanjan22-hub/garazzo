import React from 'react';
import { Card, Typography, List, ListItem, ListItemText } from '@mui/material';

const samplePosts = [
  { id: 1, user: 'Alice', content: 'How do I find a good mechanic?' },
  { id: 2, user: 'Bob', content: 'Share your best road trip stories!' },
];

export default function CommunityPage() {
  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5">Community Forum</Typography>
      <List sx={{ mt: 2 }}>
        {samplePosts.map((post) => (
          <ListItem key={post.id} alignItems="flex-start">
            <ListItemText
              primary={post.user}
              secondary={post.content}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
