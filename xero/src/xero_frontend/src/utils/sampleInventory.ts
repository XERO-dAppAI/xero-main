export const generateSampleCSV = () => {
  const header = "Item Name,Category,Quantity,Price,Expiry Date,SKU,Supplier,Location,Minimum Stock Level,Maximum Stock Level,Reorder Point,Unit of Measure,Brand,Description,Supplier Contact,Last Order Date,Cost Price,Markup Percentage,Country of Origin,Storage Requirements,Allergens,Nutritional Info,Batch Number,Package Size\n";
  
  const items = [
    "Fresh Milk,Dairy,150,3.99,2024-02-15,SKU001,Dairy Fresh Ltd,Store Room A,50,200,75,Liters,FreshCo,Pasteurized whole milk,+254712345678,2024-01-15,2.50,59.6,Kenya,Refrigerated 2-4°C,Lactose,Per 100ml: 3.5g Fat; 3.3g Protein,BTH001,1 Liter",
    "White Bread,Bakery,80,2.49,2024-02-10,SKU002,Baker's Best,Shelf B2,30,100,40,Loaves,BreadMaster,Sliced white bread,+254723456789,2024-01-14,1.50,66.0,Kenya,Room temperature,Gluten; Soy,Per 100g: 265kcal; 9g Protein,BTH002,400g",
    "Chicken Breast,Meat,45,8.99,2024-02-12,SKU003,Farm Foods Inc,Freezer 1,20,60,30,Kilograms,FarmFresh,Fresh chicken breast,+254734567890,2024-01-13,6.00,49.8,Kenya,Frozen -18°C,None,Per 100g: 165kcal; 31g Protein,BTH003,1kg",
    "Tomatoes,Produce,100,0.49,2024-02-08,SKU004,Local Farms,Display A1,40,120,60,Kilograms,Garden Fresh,Roma tomatoes,+254745678901,2024-01-12,0.30,63.3,Kenya,Cool and dry,None,Per 100g: 18kcal; 0.9g Protein,BTH004,1kg",
    "Eggs,Dairy,200,3.99,2024-02-20,SKU005,Happy Hens,Cold Storage,50,250,75,Dozens,Farm Fresh,Large brown eggs,+254756789012,2024-01-11,2.80,42.5,Kenya,Refrigerated 4-6°C,Eggs,Per egg: 155kcal; 6g Protein,BTH005,12 pieces",
    "Yogurt,Dairy,120,2.99,2024-02-09,SKU006,Dairy Fresh Ltd,Cold Storage,25,100,35,Units,YogurtCo,Greek yogurt,+254767890123,2024-01-10,1.80,66.1,Kenya,Refrigerated 2-4°C,Lactose,Per 100g: 130kcal; 10g Protein,BTH006,500g",
    "Ground Beef,Meat,60,6.99,2024-02-08,SKU007,Premium Meats,Freezer 2,15,50,25,Kilograms,MeatCraft,80/20 ground beef,+254778901234,2024-01-09,4.50,55.3,Kenya,Frozen -18°C,None,Per 100g: 250kcal; 26g Protein,BTH007,500g",
    "Bananas,Produce,150,0.29,2024-02-07,SKU008,Tropical Imports,Display B1,75,300,100,Kilograms,FreshFruit,Yellow bananas,+254789012345,2024-01-08,0.15,93.3,Uganda,Room temperature,None,Per 100g: 89kcal; 1.1g Protein,BTH008,1kg",
    "Orange Juice,Beverages,80,4.99,2024-03-15,SKU009,Citrus Co,Cold Storage,40,150,60,Liters,JuiceMaster,Fresh squeezed,+254790123456,2024-01-07,3.00,66.3,Kenya,Refrigerated 2-4°C,None,Per 100ml: 45kcal; 0.7g Protein,BTH009,1 Liter",
    "Cheese Block,Dairy,50,5.99,2024-02-28,SKU010,Dairy Fresh Ltd,Cold Storage,20,80,30,Units,CheeseCraft,Cheddar cheese,+254701234567,2024-01-06,4.00,49.8,Kenya,Refrigerated 2-4°C,Lactose,Per 100g: 402kcal; 25g Protein,BTH010,500g",
    "Carrots,Produce,60,1.99,2024-02-11,SKU011,Local Farms,Display A2,30,120,45,Kilograms,Garden Fresh,Orange carrots,+254712345670,2024-01-05,1.20,65.8,Kenya,Cool and dry,None,Per 100g: 41kcal; 0.9g Protein,BTH011,1kg",
    "Chicken Wings,Meat,75,7.99,2024-02-07,SKU012,Farm Foods Inc,Freezer 1,25,75,35,Kilograms,FarmFresh,Fresh wings,+254723456780,2024-01-04,5.00,59.8,Kenya,Frozen -18°C,None,Per 100g: 203kcal; 18g Protein,BTH012,1kg",
    "Potato Chips,Snacks,200,2.49,2024-05-20,SKU013,Snack Foods Co,Shelf C3,100,400,150,Units,CrispyCo,Original flavor,+254734567890,2024-01-03,1.50,66.0,Kenya,Room temperature,None,Per 100g: 536kcal; 7g Protein,BTH013,200g",
    "Apple Juice,Beverages,120,3.99,2024-02-09,SKU014,Fruit Co,Cold Storage,30,120,45,Liters,JuiceMaster,100% pure,+254745678901,2024-01-02,2.50,59.6,Kenya,Refrigerated 2-4°C,None,Per 100ml: 46kcal; 0.1g Protein,BTH014,1 Liter",
    "Salmon Fillet,Seafood,40,12.99,2024-02-08,SKU015,Ocean Fresh,Freezer 3,10,40,20,Kilograms,SeaDelight,Atlantic salmon,+254756789012,2024-01-01,8.00,62.4,Norway,Frozen -18°C,Fish,Per 100g: 208kcal; 22g Protein,BTH015,500g",
    "Whole Wheat Bread,Bakery,60,3.49,2024-02-10,SKU016,Baker's Best,Shelf B3,25,80,35,Loaves,BreadMaster,Whole grain bread,+254767890123,2024-01-15,2.00,74.5,Kenya,Room temperature,Gluten,Per 100g: 247kcal; 13g Protein,BTH016,400g",
    "Greek Yogurt,Dairy,90,4.99,2024-02-12,SKU017,Dairy Fresh Ltd,Cold Storage,30,100,40,Units,YogurtCo,Plain Greek yogurt,+254778901234,2024-01-14,3.00,66.3,Kenya,Refrigerated 2-4°C,Lactose,Per 100g: 133kcal; 10g Protein,BTH017,500g",
    "Ground Turkey,Meat,35,9.99,2024-02-11,SKU018,Premium Meats,Freezer 2,15,45,25,Kilograms,MeatCraft,Lean ground turkey,+254789012345,2024-01-13,6.50,53.7,Kenya,Frozen -18°C,None,Per 100g: 148kcal; 19g Protein,BTH018,500g",
    "Sweet Potatoes,Produce,80,2.49,2024-02-15,SKU019,Local Farms,Display A3,35,100,50,Kilograms,Garden Fresh,Orange sweet potatoes,+254790123456,2024-01-12,1.50,66.0,Kenya,Cool and dry,None,Per 100g: 86kcal; 1.6g Protein,BTH019,1kg",
    "Almond Milk,Dairy Alternative,70,5.99,2024-03-01,SKU020,Plant Foods Co,Cold Storage,25,90,40,Liters,NutMilk,Unsweetened almond milk,+254701234567,2024-01-11,3.50,71.1,USA,Refrigerated 2-4°C,Nuts,Per 100ml: 13kcal; 0.4g Protein,BTH020,1 Liter"
  ].join("\n");

  return header + items;
};

export const downloadSampleCSV = () => {
  const csv = generateSampleCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample_inventory.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}; 