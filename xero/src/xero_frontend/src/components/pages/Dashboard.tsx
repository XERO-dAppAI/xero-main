import React from 'react';
import { Box, Grid, Heading } from '@chakra-ui/react';
import ExcelUploader from '../shared/ExcelUploader';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>
      <Grid templateColumns="repeat(1, 1fr)" gap={6}>
        <ExcelUploader 
          targetCanister="data_aggregator"
          onUploadSuccess={(data) => {
            console.log('Upload successful:', data);
          }}
        />
      </Grid>
    </Box>
  );
};

export default Dashboard; 