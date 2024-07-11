// --------------------------------------------------------
// -----------------------
const menuButton = document.querySelector('#menu');
const leftSide = document.querySelector('.leftside');
const idprofile = document.querySelector('.idprofile');
const admin_profile = document.querySelector('.admin_profile');
const exportbtn = document.querySelector('.exportbtn');
const nav = document.querySelector('.nav');
// const span = document.querySelector('.span');
const morale = document.querySelector('.container');
menuButton.addEventListener('click', () => {
  if (leftSide.classList.contains('show')) {
    leftSide.classList.remove('show');
    menuButton.innerHTML = '<i class="fa-solid fa-times"></i>';
    menuButton.style.marginTop = '90px';
    morale.style.marginLeft = '80px';
    idprofile.style.position = 'relative';
    idprofile.style.bottom = '100px';
    admin_profile.style.height = '150px';
    exportbtn.style.position = 'fixed';
    exportbtn.style.left = '60%';
    nav.style.marginLeft = '60px';
  } else {
    leftSide.classList.add('show');
    menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
    menuButton.style.marginBottom = '80px';
    idprofile.style.position = 'relative';
    idprofile.style.bottom = '10px';
    exportbtn.style.position = 'fixed';
    exportbtn.style.left = '60%';
    nav.style.marginLeft = '60px';
    morale.style.marginLeft = '80px';

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
  if (time.getHours() == 0) {
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
fetch('http://localhost:3030/history/')
  .then((response) => response.json())
  .then((data) => {
    data.reverse();
    console.log('data', data);

    data.forEach((report) => {
      // Replace undefined values with empty string
      for (const key in report) {
        if (report[key] === undefined) {
          report[key] = 'Empty';
        }
      }

      const reportCardFormat = document.querySelector('.container');
      const getcardReport = document.createElement('div');
      getcardReport.classList = 'out';
      const creteDivforreportData = document.createElement('div');
      creteDivforreportData.className = 'inn';
      creteDivforreportData.innerHTML = `
        <p class="status"><b>Status: </b> ${report.status || 'Empty'}</p>
    
        <div class="info">
          <ul>
            <b>Product ID:</b>
            ${report.p_id || 'Empty'}
          </ul>
    
          <ul>
            <b>Product Name:</b>
            ${report.product_name || 'Empty'}
          </ul>
          <ul>
            <b>Company Name:</b>
            ${report.company_name || 'Empty'}
          </ul>
          <ul>
            <b>Product Type:</b>
            ${report.product_type || 'Empty'}
          </ul>
          <ul>
            <b>Previous Quantity:</b>
            ${report.previous_Qty || 'Empty'}
          </ul>
          <ul>
            <b>Updated Quantity:</b>
            ${report.product_quantity || 'Empty'}
          </ul>
          <ul>
            <b>Previous Price/1:</b>
            ${report.previous_Price || 'Empty'}.Rs
          </ul>
          <ul>
            <b>Updated Price/1:</b>
            ${report.product_price || 'Empty'}.Rs
          </ul>
          <ul>
          <b>Dispatched Quantity:</b>
          ${report.dispatchedQty || 'Empty'}
        </ul>
          <ul>
            <b>Department:</b>
            ${report.departmentName || 'Empty'}
          </ul>
          <ul>
            <b>Time:</b>
            ${report.time || 'Empty'}
          </ul>
        </div>
        `;
      getcardReport.appendChild(creteDivforreportData);
      reportCardFormat.appendChild(getcardReport);
    });
  })
  .catch((error) => {
    alert('Error fetching reports:', error);
  });

// Export btn data to excel sheet
const toExcelSheetBtn = document.querySelector('#exportSheet');
toExcelSheetBtn.addEventListener('click', () => {
  const data = [];
  const headings = [
    'Product ID',
    'Product Name',
    'Company Name',
    'Product Type',
    'Previous Quantity',
    'Updated Quantity',
    'Previous Price/1',
    'Updated Price/1',
    'Dispatched Quantity',
    'Department',
    'Time',
  ];

  // Get all report cards
  const reportCards = document.querySelectorAll('.out');

  // Loop through each report card to extract data
  reportCards.forEach((reportCard) => {
    const reportData = {};
    const infoDiv = reportCard.querySelector('.info');

    // Iterate through each <ul> element to find the correct values for each heading
    headings.forEach((heading) => {
      // Extract data for each heading
      let value = '';
      infoDiv.querySelectorAll('ul').forEach((ulElement) => {
        // Check if the <ul> element contains the heading text
        if (ulElement.textContent.includes(heading)) {
          // Extract text content and remove the heading text
          value = ulElement.textContent.replace(heading + ':', '').trim();
        }
      });
      // Set the value for the current heading in the report data
      reportData[heading] = value || 'Empty';
    });

    // Add the report data to the array
    data.push(reportData);
  });

  // Convert data to Excel workbook format
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Adjust column sizes based on content length
  const columnSizes = headings.map((heading) => ({
    wch: Math.max(
      heading.length, // Length of heading
      ...data.map((row) => row[heading].length) // Length of data content
    ),
  }));
  worksheet['!cols'] = columnSizes;

  // Create Excel workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, worksheet, 'Report');

  // Export Excel file
  XLSX.writeFile(wb, 'report.xlsx');
});
