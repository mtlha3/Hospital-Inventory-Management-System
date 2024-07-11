document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.querySelector('.loginbtn');

  loginBtn.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      console.log('Admin Login');

      // Show wrong message
      const chkemail = document.querySelector('.wrong_email');
      const chkpass = document.querySelector('.wrong_password');

      // Get form values
      const adminEmail = document.querySelector('#email').value.trim();
      const adminPassword = document.querySelector('#password').value.trim();
      console.log('email:', adminEmail);

      if (adminEmail === '' || adminPassword === '') {
        if (adminEmail === '') chkemail.style.display = 'block';
        if (adminPassword === '') chkpass.style.display = 'block';
        return;
      } else {
        chkemail.style.display = 'none';
        chkpass.style.display = 'none';
      }

      const adminDataObj = {
        email: adminEmail,
        password: adminPassword,
      };

      // Fetch method for admin login
      const response = await fetch('http://localhost:3030/admin/adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminDataObj),
      });

      const result = await response.json();
      // console.log('result:', result);

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have logged in successfully',
        }).then(() => {
          // Redirect to admin dashboard or appropriate page
          window.location.href = '../htmlFiles/dashBoard.html'; // Update URL as needed
        });
      } else {
        if (result.error) {
          if (result.error.includes('Email')) {
            chkemail.style.display = 'block';
          }
          if (result.error.includes('Password')) {
            chkpass.style.display = 'block';
          }
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: result.error,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'An unknown error occurred during login',
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Error',
        text: 'An error occurred while trying to log in. Please try again later.',
      });
    }
  });
});
