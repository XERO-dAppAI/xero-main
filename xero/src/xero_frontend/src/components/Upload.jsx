import React, { useState } from 'react';
import { actor } from '../ic-config'; // Import the actor from the IC config file

function Upload() {
  const [message, setMessage] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result;
      const uint8Array = new Uint8Array(arrayBuffer);

      try {
        // Call the backend canister's method to upload the inventory
        const response = await actor.upload_inventory_csv(Array.from(uint8Array));
        setMessage(response.Ok ? response.Ok : response.Err);
      } catch (error) {
        setMessage('Error uploading file: ' + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Inventory CSV File</h2>
      <form>
        <label htmlFor="file-upload">Choose a file:</label>
        <input type="file" id="file-upload" onChange={handleFileChange} />
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Upload;
