import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MetricCard = ({ title, value, subtitle, color = '#2563EB', icon }) => {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500, fontSize: '0.75rem' }}
          >
            {title}
          </Typography>
          {icon && (
            <Box sx={{ color: color, opacity: 0.8, '& svg': { fontSize: '1.25rem' } }}>
              {icon}
            </Box>
          )}
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: color,
            fontSize: '1.75rem',
            lineHeight: 1.2,
            mb: subtitle ? 0.25 : 0
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: '0.65rem' }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
