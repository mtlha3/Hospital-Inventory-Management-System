// --------------------------------------------------------
// -----------------------
const menuButton = document.querySelector('#menu');
const leftSide = document.querySelector('.leftside');
const idprofile = document.querySelector('.idprofile');
const admin_profile = document.querySelector('.admin_profile');
const search = document.querySelector('.search');
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
    search.style.width = '0%';
  } else {
    leftSide.classList.add('show');
    menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
    menuButton.style.marginBottom = '80px';
    idprofile.style.position = 'relative';
    idprofile.style.bottom = '10px';
    search.style.width = '0%';
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

//fetch method for total amount
fetch('http://localhost:3030/totalPrice/')
  .then((response) => response.json())
  .then((data) => {
    const totalPrice = data.total_Price;
    const totalAmount = document.querySelector('#totalAmount');
    totalAmount.innerHTML = totalPrice;
  })
  .catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Error fetching total price: ${error}`,
    });
    return;
  });

//fetch method for total no of products
fetch('http://localhost:3030/inventory/?totalProducts')
  .then((response) => response.json())
  .then((data) => {
    const noOftotalProducts = data.totalProducts;
    const totalProducts = document.querySelector('#totalProducts');
    totalProducts.innerHTML = noOftotalProducts;
  })
  .catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Error fetching total number of Products: ${error}`,
    });
    return;
  });

//fetch method for total no of categories
fetch('http://localhost:3030/inventory/?totalType')
  .then((response) => response.json())
  .then((data) => {
    const totalCategories = data.totalType;
    const noOfAllCategories = document.querySelector('#totalCategories');
    noOfAllCategories.innerHTML = totalCategories;
  })
  .catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Error fetching total number of categories: ${error}`,
    });
    return;
  });
// fetch method for total no of out of stock categories
fetch('http://localhost:3030/inventory/')
  .then((response) => response.json())
  .then((data) => {
    // console.log(data);
    let totalOutOfStockCategories = 0;
    for (const product of data) {
      if (product.product_quantity === 0) {
        // console.log(product);
        totalOutOfStockCategories++;
      }
    }
    const OutOfStockCategories = document.querySelector('#outofstock');
    OutOfStockCategories.innerHTML = totalOutOfStockCategories;
  })
  .catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Error fetching total number of out of stock categories: ${error}`,
    });
    return;
  });

//fetch for categories to show total products of that category
// Search functionality
const searchInput = document.querySelector('#search_item');
searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const search_item = searchInput.value.trim();
    if (!search_item) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter a category to search.',
      });
      return;
    }

    fetch(`http://localhost:3030/inventory/?product_type=${search_item}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching category data');
        }
        return response.json();
      })
      .then((data) => {
        let container = document.querySelector('.cards');
        if (!data.items || data.items.length === 0) {
          throw new Error('No category exists.');
        }

        // Display the total number of products in the specified category
        const totalProducts = data.items.length;
        container.style.background = 'whitesmoke';
        container.style.height = '100px';
        container.style.width = '200px';
        container.style.margin = '10px';
        container.style.padding = '10px';
        container.innerHTML = `<h4>Total Products in ${search_item} category: <span>${totalProducts}</span></h4>`;
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      });
  }
});
