// --------------------------------------------------------
// -----------------------
const menuButton = document.querySelector('#menu');
const leftSide = document.querySelector('.leftside');
const idprofile = document.querySelector('.idprofile');
const admin_profile = document.querySelector('.admin_profile');
// const span = document.querySelector('.span');
const morale = document.querySelector('.morale');
menuButton.addEventListener('click', () => {
  if (leftSide.classList.contains('show')) {
    leftSide.classList.remove('show');
    menuButton.innerHTML = '<i class="fa-solid fa-times"></i>';
    menuButton.style.marginTop = '90px';
    morale.style.marginLeft = '80px';
    idprofile.style.position = 'relative';
    idprofile.style.bottom = '100px';
    admin_profile.style.height = '150px';
  } else {
    leftSide.classList.add('show');
    menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
    menuButton.style.marginBottom = '80px';
    idprofile.style.position = 'relative';
    idprofile.style.bottom = '10px';
    // admin_profile.style.height = '50px';

    // search.remove;
  }
});
// --------------------------------------------------------
// -----------------------

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

//fetch method for all products
fetch('http://localhost:3030/inventory/')
  .then((response) => response.json())
  .then((data) => {
    let tbody = document.querySelector('#tablebody');

    data.forEach((product) => {
      let row = document.createElement('tr');

      row.innerHTML = `
        <td>${product.p_id}</td>
        <td>${product.product_name}</td>
        <td>${product.product_type}</td>
        <td>${product.company_name}</td>
        <td class="rowGap" >${product.product_price} <button class="update-price" id="update-price-${product.p_id}">Update</button></td>
        <td class="rowGap" >${product.product_quantity} <button class="update-qty" id="update-qty-${product.p_id}">Update</button></td>
      `;

      tbody.appendChild(row);

      // Update price buttons
      document
        .querySelector(`#update-price-${product.p_id}`)
        .addEventListener('click', () => {
          // const blurBackground = document.querySelector('.allproduct');
          const updateqtyForm = document.querySelector('.form');
          updateqtyForm.style.display = 'block';
          // blurBackground.style.background = '#232121b8';
          const updatePriceBtn = document.querySelector('#updatePrice');
          const cancelBtn = document.querySelector('#cancelbtn');
          cancelBtn.addEventListener('click', () => {
            updateqtyForm.style.display = 'none';
          });
          const previousPrice = document.querySelector('#previousPrice');
          previousPrice.value = product.product_price;
          updatePriceBtn.addEventListener(
            'click',
            (event) => {
              event.preventDefault();

              const newPrice = parseFloat(
                document.querySelector('#newPrice').value
              );

              if (isNaN(newPrice) || newPrice <= 0 || newPrice > 5000000) {
                alert('Invalid price entered');
                updateqtyForm.style.display = 'none';
                return;
              }

              const updatedData = {
                p_id: product.p_id,
                company_name: product.company_name,
                product_name: product.product_name,
                product_type: product.product_type,
                product_quantity: product.product_quantity,
                product_price: newPrice,
                product_image: product.product_image,
              };

              fetch(`http://localhost:3030/inventory/${product.p_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                })
                .then((updatedProduct) => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Product price updated successfully',
                  }).then(() => {
                    updateqtyForm.style.display = 'none';
                    location.reload(); // Reload the page to reflect changes
                  });
                })
                .catch((error) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error updating price: ${error.message}`,
                  });
                  console.error('Error updating Price:', error);
                });
            },
            { once: true }
          ); // Use { once: true } to ensure the event listener is added only once
        });

      // Update quantity buttons
      document
        .querySelector(`#update-qty-${product.p_id}`)
        .addEventListener('click', () => {
          const updateqtyForm = document.querySelector('.formqty');
          updateqtyForm.style.display = 'block';
          const updateQtyBtn = document.querySelector('#updateQty');
          const cancelBtn = document.querySelector('#cancel');
          cancelBtn.addEventListener('click', () => {
            updateqtyForm.style.display = 'none';
          });
          const previousQty = document.querySelector('#previousQty');
          previousQty.value = product.product_quantity;
          updateQtyBtn.addEventListener(
            'click',
            (event) => {
              event.preventDefault();
              const updatedQty = parseInt(
                document.querySelector('#updatedQuantity').value
              );
              const newQty = parseInt(
                document.querySelector('#newQuantity').value
              );

              // Validation
              if (!isNaN(updatedQty) && !isNaN(newQty)) {
                alert(
                  'You can not update and add new quantity at the same time.'
                );
                updateqtyForm.style.display = 'none';
                return;
              }
              let newQtyAfterentered;
              newQtyAfterentered = newQty + product.product_quantity;

              if (!isNaN(updatedQty)) {
                // Update quantity
                if (updatedQty < 0 || updatedQty > 100000) {
                  alert('Invalid update quantity entered');
                  updateqtyForm.style.display = 'none';
                  return;
                }
                newQtyAfterentered = updatedQty;
              } else if (!isNaN(newQty)) {
                // Add to existing quantity
                if (newQty < 0 || newQty > 100000) {
                  alert('Invalid new quantity entered');
                  updateqtyForm.style.display = 'none';
                  return;
                }
                newQtyAfterentered = newQty + product.product_quantity;
              } else {
                alert('Please enter either update quantity or new quantity');
                updateqtyForm.style.display = 'none';
                return;
              }

              const updatedData = {
                p_id: product.p_id,
                company_name: product.company_name,
                product_name: product.product_name,
                product_type: product.product_type,
                product_quantity: newQtyAfterentered,
                product_price: product.product_price,
                product_image: product.product_image,
              };

              fetch(`http://localhost:3030/inventory/${product.p_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                })
                .then((updatedProduct) => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Product updated successfully',
                  }).then(() => {
                    updateqtyForm.style.display = 'none';
                    location.reload(); // Reload the page to reflect changes
                  });
                })
                .catch((error) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error updating product: ${error.message}`,
                  });
                  console.error('Error updating product:', error);
                });
            },
            { once: true }
          ); // Use { once: true } to ensure the event listener is added only once
        });
    });
  })
  .catch((error) => {
    console.error('Error fetching all products:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Error fetching all products: ${error.message}`,
    });
  });
