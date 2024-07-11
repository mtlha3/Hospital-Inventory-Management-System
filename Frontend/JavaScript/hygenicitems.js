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

//---------------- Fetch to get all hygienic items ---------
let type = 'hygienic';

fetch(`http://localhost:3030/inventory/?product_type=${type}`)
  .then((data) => data.json())
  .then((data) => {
    console.log(data);
    let container = document.querySelector('.cards');
    if (!data.items || data.items.length === 0) {
      container.innerHTML = 'No items for this category. empty category';
      return;
    }
    data.items.forEach((item) => {
      let card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <img src="${item.product_image}" alt="image" />
        <h4>ID: <span>${item.p_id}</span></h4>
        <h4>Company: <span>${item.company_name}</span></h4>
        <h4>Product: <span>${item.product_name}</span></h4>
        <h4>Price /1: <span>${item.product_price}</span></h4>
        <h4>Quantity: <span>${item.product_quantity}</span></h4>
        <div class="btns">
          <button id="update-${item.p_id}">Update</button>
          <button id="dispatch-${item.p_id}">Dispatch</button>
          <button id="delete-${item.p_id}">Delete</button>
        </div>
      `;
      container.appendChild(card);
      console.log(`#update-${item.p_id}`);

      // Update item button
      document
        .querySelector(`#update-${item.p_id}`)
        .addEventListener('click', (event) => {
          event.preventDefault();
          //To show update form page
          const showUpdateForm = document.querySelector('.UpdateData');
          showUpdateForm.style.display = 'block';

          // to show message can not update both price and qty
          const showMessage = document.querySelector('.message');
          showMessage.style.display = 'block';
          // Populate the form fields with the selected item's data
          document.querySelector('#updateproductId').value = item.p_id;
          document.querySelector('#updatecompanyName').value =
            item.company_name;
          document.querySelector('#updateproductName').value =
            item.product_name;
          document.querySelector('#updatecategoryType').value =
            item.product_type;
          document.querySelector('#updateproductQantity').value;

          document.querySelector('#updatePrice').value = item.product_price;

          //To cancel update product btn
          const cancelUpdateBtn = document.querySelector('#cancelBtn');
          cancelUpdateBtn.addEventListener('click', () => {
            showUpdateForm.style.display = 'none';
            showMessage.style.display = 'none';
          });

          //To update all values update btn
          const updateProductBtn = document.querySelector('#updateBtn');
          updateProductBtn.addEventListener(
            'click',
            () => {
              const companyName =
                document.querySelector('#updatecompanyName').value;
              const productName =
                document.querySelector('#updateproductName').value;
              const productType = document.querySelector(
                '#updatecategoryType'
              ).value;
              const productQuantity = parseInt(
                document.querySelector('#updateproductQantity').value
              );
              const productPrice = parseFloat(
                document.querySelector('#updatePrice').value
              );

              // Validation
              if (
                !companyName ||
                !productName ||
                !productType ||
                isNaN(productQuantity) ||
                isNaN(productPrice)
              ) {
                alert('All fields are required.');
                showUpdateForm.style.display = 'none';
                showMessage.style.display = 'none';

                return;
              }
              if (
                (productQuantity > item.product_quantity ||
                  productQuantity < item.product_quantity) &&
                (productPrice > item.product_price ||
                  productPrice < item.product_price)
              ) {
                alert('Quantity and Price cannot be updated at the same time.');
                showUpdateForm.style.display = 'none';
                showMessage.style.display = 'none';
                return;
              }

              if (productQuantity <= 0 || productPrice <= 0) {
                alert('Quantity and Price must be greater than zero.');
                showUpdateForm.style.display = 'none';
                showMessage.style.display = 'none';

                return;
              }
              if (/\d/.test(productName)) {
                alert('Product Name must not contain numbers.');
                showUpdateForm.style.display = 'none';
                showMessage.style.display = 'none';
                return;
              }

              const updatedDataObj = {
                p_id: item.p_id,
                company_name: companyName,
                product_name: productName,
                product_type: productType,
                product_quantity: productQuantity,
                product_price: productPrice,
                product_image: item.product_image,
                status: 'Updated',
              };
              fetch(`http://localhost:3030/inventory/${item.p_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDataObj),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response not ok');
                  }
                  return response.json();
                })
                .then((updatedDataObj) => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Product updated successfully',
                  }).then(() => {
                    location.reload();
                  });
                })
                .catch((error) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error updating product: ${error}`,
                  });
                });
            },
            { once: true }
          );
        });

      // Dispatch item button
      document
        .querySelector(`#dispatch-${item.p_id}`)
        .addEventListener('click', (event) => {
          event.preventDefault();

          //To show dispatch form page
          const showDispatchForm = document.querySelector('.form-container');
          showDispatchForm.style.display = 'block';

          // Populate the form fields with the selected item's data
          document.querySelector('#dispatchproductId').value = item.p_id;
          document.querySelector('#dispatchCompanyName').value =
            item.company_name;
          document.querySelector('#dispatchProductName').value =
            item.product_name;
          document.querySelector('#dispatchCategoryType').value =
            item.product_type;
          document.querySelector('#dispatchProductQantity').value;

          document.querySelector('#dispatchDepartmentName').value;

          //To cancel update product btn
          const cancelDispatchBtn =
            document.querySelector('#dispatchCancelBtn');
          cancelDispatchBtn.addEventListener('click', () => {
            showDispatchForm.style.display = 'none';
          });

          //To Dispatch products btn
          const dispatchBtn = document.querySelector('#dispatchBtn');
          dispatchBtn.addEventListener(
            'click',
            () => {
              const dispatchQuantity = parseInt(
                document.querySelector('#dispatchProductQantity').value
              );
              const departmentName = document.querySelector(
                '#dispatchDepartmentName'
              ).value;

              // Validation
              if (
                isNaN(dispatchQuantity) ||
                dispatchQuantity <= 0 ||
                dispatchQuantity > item.product_quantity
              ) {
                alert('Invalid Quantity');
                showDispatchForm.style.display = 'none';
                return;
              }
              if (!departmentName) {
                alert('Department Name is required.');
                showDispatchForm.style.display = 'none';
                return;
              }

              const updatedDispatchQuantity =
                item.product_quantity - dispatchQuantity;

              const DispatchedDataObj = {
                p_id: item.p_id,
                company_name: item.company_name,
                product_name: item.product_name,
                product_type: item.product_type,
                product_quantity: updatedDispatchQuantity,
                product_price: item.product_price,
                product_image: item.product_image,
                dispatchedQty: dispatchQuantity,
                status: 'Dispatched',
                departmentName: departmentName,
              };

              fetch(`http://localhost:3030/inventory/${item.p_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(DispatchedDataObj),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response not ok');
                  }
                  return response.json();
                })
                .then((DispatchedDataObj) => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Product dispatched successfully',
                  }).then(() => {
                    location.reload();
                  });
                })
                .catch((error) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Something went wrong! Error dispatching product: ${error}`,
                  });
                });
            },
            { once: true }
          );
        });

      // Delete item button
      document
        .querySelector(`#delete-${item.p_id}`)
        .addEventListener('click', () => {
          if (confirm('Are you sure you want to delete this item?')) {
            fetch(`http://localhost:3030/inventory/${item.p_id}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Deleted!',
                  text: 'Product has been deleted.',
                }).then(() => {
                  location.reload();
                });
              })
              .catch((error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: `Error deleting product: ${error}`,
                });
              });
          }
        });
    });

    //main fetch items .then block close here
  })
  .catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Error fetching hygienic items: ${error}`,
    });
  });
