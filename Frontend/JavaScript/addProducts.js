// Go to register Page
const registerPageBtn = document.querySelector('.profile');
registerPageBtn.addEventListener('click', () => {
  window.location.href = '../htmlFiles/registerAdmin.html';
});

// Go to login page
const logoutBtn = document.querySelector('.profile_btn');
logoutBtn.addEventListener('click', () => {
  window.location.href = '../htmlFiles/index.html';
});

// set date
setInterval(() => {
  let time = new Date();
  let gettime = document.querySelector('.time');
  let getdate = document.querySelector('.Today_Date');
  let format = ' Am';

  if (time.getHours() > 12) {
    time.setHours(time.getHours() - 12);
    format = ' Pm';
  }
  if (time.getHours() === 0) {
    time.setHours(time.getHours() + 12);
    format = 'Am';
  }

  let minutes =
    time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
  let hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
  gettime.innerHTML = `${hours} : ${minutes} ${format}`;
  getdate.innerHTML = `${
    time.getMonth() + 1
  }/${time.getDate()}/${time.getFullYear()}`;
});

//------------ Add product event listener
document.addEventListener('DOMContentLoaded', () => {
  const addProductBtn = document.querySelector('#addProduct');

  addProductBtn.addEventListener('click', async () => {
    try {
      // Fetch all products to determine the last ID
      const response = await fetch('http://localhost:3030/inventory/');
      const data = await response.json();
      console.log('data', data);

      let lastId = 0;

      // Iterate through all products to find the maximum ID
      data.forEach((product) => {
        if (product.p_id > lastId) {
          lastId = product.p_id;
        }
      });

      console.log('lastId', lastId);

      // Get form values
      const productName = document.querySelector('#productName').value;
      const companyName = document.querySelector('#companyName').value;
      const categoryType = document.querySelector('#categoryType').value;
      const productQuantity = document
        .querySelector('#productQantity')
        .value.trim();
      const productPrice = document.querySelector('#productPrice').value.trim();

      // Regular expressions for validation
      const nameRegex = /^[a-zA-Z0-9\s\.,'-]+$/;
      const categoryRegex = /^[a-zA-Z\s-]+$/;

      // Function to check for repeated sequences
      const hasRepeatedSequences = (str) => {
        const lowered = str.toLowerCase();
        return /(.)\1{2,}/.test(lowered);
      };

      // Validate inputs
      if (!nameRegex.test(productName) || hasRepeatedSequences(productName)) {
        alert('Invalid product name. or Please avoid repeated sequences.');
        return;
      }

      if (!nameRegex.test(companyName) || hasRepeatedSequences(companyName)) {
        alert('Invalid company name. or Please use only letters, numbers.');
        return;
      }

      if (!categoryRegex.test(categoryType)) {
        alert('Invalid category type. Please use only letters.');
        return;
      }

      if (productQuantity <= 0 || productQuantity > 100000) {
        alert('Invalid quantity. or qty is less than one lakh');
        return;
      }

      if (productPrice <= 0 || productPrice > 5000000) {
        alert('Invalid price. or price must be less than 50 lakh');
        return;
      }

      const productImageInput = document.querySelector('#productImage');
      const productImageFile = productImageInput.files[0];

      const validateAndSubmit = async (base64Image = '') => {
        // Prepare product data with or without Base64 image
        const getProductValues = {
          p_id: lastId + 1, // Assign the new ID
          product_name: productName,
          company_name: companyName,
          product_type: categoryType,
          product_quantity: productQuantity,
          product_price: productPrice,
          product_image: base64Image,
        };

        // Fetch method for adding products
        const addProductResponse = await fetch(
          'http://localhost:3030/inventory/addinventory',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(getProductValues),
          }
        );

        if (addProductResponse.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Product added successfully!',
          }).then(() => {
            // Reset input fields
            document.querySelector('#productName').value = '';
            document.querySelector('#companyName').value = '';
            document.querySelector('#categoryType').value = '';
            document.querySelector('#productQantity').value = '';
            document.querySelector('#productPrice').value = '';
            document.querySelector('#productImage').value = '';
          });
        } else {
          throw new Error('Failed to add product');
        }
      };

      if (productImageFile) {
        // Check image size (e.g., less than 5MB)
        if (productImageFile.size > 4 * 1024 * 1024) {
          // 5MB limit
          Swal.fire({
            icon: 'error',
            title: 'Image too large',
            text: 'Image size should be less than 5MB.',
          });
          return;
        }

        // Read image file as Base64
        const reader = new FileReader();
        reader.readAsDataURL(productImageFile);
        reader.onload = async (event) => {
          const base64Image = event.target.result;
          await validateAndSubmit(base64Image);
        };
        reader.onerror = (error) => {
          console.error('Error reading image file:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error reading image file',
          });
        };
      } else {
        await validateAndSubmit();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error adding product: ${error.message}`,
      });
    }
  });
});
