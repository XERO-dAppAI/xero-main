import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import ExcelUploader from '../shared/ExcelUploader';

const DataAggregator: React.FC = () => {
  return (
    <Box>
      <Heading mb={6}>Data Aggregator</Heading>
      <ExcelUploader 
        targetCanister="data_aggregator"
        onUploadSuccess={(data) => {
          console.log('Upload successful:', data);
        }}
      />
    </Box>
  );
};

export default DataAggregator; 