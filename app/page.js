'use client'
import Image from "next/image";
import {useState, useEffect} from 'react';
import {firestore} from "@/firebase";
import {Box, Button, Modal, TextField, Typography, Stack } from "@mui/material";
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc, writeBatch} from "firebase/firestore";
import { Truculenta } from "next/font/google";
import { GSP_NO_RETURNED_VALUE } from "next/dist/lib/constants";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState (true);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1); 


  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList) 
  };

  const addItem = async (item,quantity) => {
    if (quantity <= 0) {
      alert('Quantity must be greater than zero.')
      return;
    }
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity || 0;
      await setDoc(docRef, { quantity: currentQuantity + quantity });
    } else {
      await setDoc(docRef, { quantity: quantity });
    }
  
    await updateInventory();
  };

    const removeItem = async (item) => {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()){
        const {quantity} = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, {quantity: quantity -1})
        }
      }
      await updateInventory()
      };
      const removeAll = async () => {
        const snapshot = await getDocs(collection(firestore, 'inventory'));
        const batch = writeBatch(firestore);
        
        snapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
      
        await batch.commit();
        await updateInventory();
      }
      
useEffect(() => {
  updateInventory();
}, []);

const handleOpen = () => setOpen(true)
const handleClose = () => setOpen(false)

return (
  <Box width="100vw" 
  height="100vh" 
  display="flex"  
  flexDirection="column"
  justifyContent="center"
  bgcolor="#F0F0F0"
  alignItems="center"
  gap={2}
> 
<Modal open={open} onClose={handleClose}>
  <Box
    position="absolute"
    top="50%"
    left="50%"
    transform="translate(-50%, -50%)"
    width={400}
    bgcolor="white"
    border="2px solid #000"
    boxShadow={24}
    p={4}
    display={"flex"}
    flexDirection={"column"}
    gap={3}
  >
    <Typography variant="h6">Add Item</Typography>
    <Stack width="100%" direction="row" spacing={2}>
      <TextField 
        variant="outlined"
        fullWidth
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Item Name"
      />
      <TextField 
        variant="outlined"
        type="number"
        value={quantity} // NEW: Bind the quantity state
        onChange={(e) => setQuantity(Number(e.target.value))} // NEW: Update quantity state
        placeholder="Quantity"
        inputProps={{ min: 1 }} // NEW: Prevent entering numbers less than 1
      />
      <Button 
        variant='outlined'
        onClick={() => {
          if (itemName.trim() !== '' && quantity > 0) { // UPDATED: Add quantity validation
            addItem(itemName, quantity); // UPDATED: Pass quantity to addItem
            setItemName('');
            setQuantity(1); // RESET quantity to default
            handleClose();
          } else {
            alert('Item name cannot be empty and quantity must be greater than zero.'); // UPDATED: Combined validation alert
          }
        }}
      >
        Add
      </Button> {/* FIX: Closed the Add Button Tag */}
    </Stack>
  </Box>
</Modal>
  <Button 
  variant="contained"
  onClick={handleOpen}
  sx={{ 
    alignSelf: 'center',
    marginBottom: 2
  }}
>
  Add New Item
</Button>
<Button 
  variant="contained" 
  color="error"
  onClick={removeAll}
  sx={{ mt: 2 }}
>
  Remove All
</Button>

  <Box border='1px solid #333' width="800px" mt={2}>
    <Box
      width="100%"
      border="2px solid #000" // Border for the entire pantry storage
      borderRadius="8px" // Optional: Rounded corners for a better look
      p={2}
    >
      <Typography variant="h2" textAlign="center" color="#333" mb={2}>
        Pantry Storage
      </Typography>

      <Stack width="100%" height="300px" spacing={2} sx={{ overflow: 'auto' }}>
        {
          inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2}
              border="1px solid #ccc"
              bgcolor="#ADD8E6"
              marginBottom={2} // Adds space between items
              borderRadius="8px" // Optional: Rounded corners for a better look
            >
              <Typography variant="h6" color="#333" textAlign="left"> 
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333" textAlign="right"> 
                Quantity: {quantity}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => removeItem(name)}
              >
                Remove
              </Button>
            </Box>
          ))
        }
      </Stack>
    </Box>
  </Box>
</Box>)}