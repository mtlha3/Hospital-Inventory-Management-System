document.addEventListener('DOMContentLoaded', () => {
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

  // Go to register Page
  const registerPageBtn = document.querySelector('.profile');
  if (registerPageBtn) {
    registerPageBtn.addEventListener('click', () => {
      window.location.href = '../htmlFiles/registerAdmin.html';
    });
  }

  // Go to login page
  const logoutBtn = document.querySelector('.profile_btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = '../htmlFiles/index.html';
    });
  }
});

// Fetch all inventory items initially
// const DispatchBtn = document.querySelector('.btn');
// DispatchBtn.addEventListener('click', async () => {
//   const PID = document.querySelector('#productId').value;
//   const comname = document.querySelector('#companyName').value;
//   const prodName = document.querySelector('#productName').value;
//   const price = parseInt(document.querySelector('#productPrice').value);
//   const Typename = document.querySelector('#categoryType').value;
//   const dispatchQuantity = parseInt(
//     document.querySelector('#productQantity').value
//   );
//   const departmentName = document.querySelector('#DepName').value;

//   // Validation
//   if (
//     !PID ||
//     !comname ||
//     !prodName ||
//     !Typename ||
//     isNaN(price) ||
//     price <= 0 ||
//     isNaN(dispatchQuantity) ||
//     dispatchQuantity <= 0 ||
//     !departmentName
//   ) {
//     alert('Please fill in all fields correctly.');
//     return;
//   }

//   try {
//     const updatedDispatchQuantity = item.product_quantity - dispatchQuantity;

//     // Construct the dispatched data object
//     const DispatchedDataObj = {
//       p_id: PID,
//       company_name: comname,
//       product_name: prodName,
//       product_type: Typename,
//       product_quantity: updatedDispatchQuantity,
//       product_price: price,
//       product_image: null,
//       dispatchedQty: dispatchQuantity,
//       status: 'Dispatched',
//       departmentName: departmentName,
//     };

//     // Perform the dispatch fetch call
//     const dispatchResponse = await fetch(
//       `http://localhost:3030/inventory/${PID}`,
//       {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(DispatchedDataObj),
//       }
//     )
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Network response not ok');
//       }
//       return response.json();
//     })
//     .then((DispatchedDataObj) => {
//       Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: 'Product dispatched successfully',
//       }).then(() => {
//         location.reload();
//       });
//     }) .catch (error) {
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: `Something went wrong! Error dispatching product: ${error.message}`,
//     });
//   }
// });
