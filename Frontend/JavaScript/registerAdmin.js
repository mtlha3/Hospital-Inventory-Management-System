// Go to dashBoard page

const goBack = document.querySelector('#goBack');
goBack.addEventListener('click', () => {
  console.log('goBack');
  window.location.href = './htmlFiles/dashBoard.html';
});

const getLoginAdminEmail = prompt('Enter account to show details');

// Fetch method for admin details
fetch(
  `http://localhost:3030/admin/profile/?email=${encodeURIComponent(
    getLoginAdminEmail
  )}`
)
  .then((response) => response.json())
  .then((data) => {
    console.log('data', data);
    // Populate the form fields with fetched data
    document.querySelector('#adminName').value = data.admin.adminname;
    document.querySelector('#adminEmail').value = data.admin.email;
    document.querySelector('#adminPassword').value = data.admin.password;
    document.querySelector('#adminPhone').value = data.admin.contact;
    document.querySelector('#adminAddress').value = data.admin.address;

    const updateAdminBtn = document.getElementById('updateAdmin');
    const addAdminBtnhide = document.querySelector('#addAdmin');
    const deleteAdminBtn = document.querySelector('#deleteAdmin');

    // Add event listener for add admin button
    addAdminBtnhide.addEventListener('click', (e) => {
      e.preventDefault();

      fetch('http://localhost:3030/admin/count')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          const adminCount = data.count;
          console.log('adminCount', adminCount);
          // Check if the maximum number of admins is reached
          if (adminCount >= 2) {
            alert('Cannot add admin account. Maximum 2 admins allowed.');
            return;
          }

          // Hide the buttons for update, add, and delete
          updateAdminBtn.style.display = 'none';
          addAdminBtnhide.style.display = 'none';
          deleteAdminBtn.style.display = 'none';

          document.querySelector('#adminName').disabled = false;
          document.querySelector('#adminEmail').disabled = false;
          document.querySelector('#adminPassword').disabled = false;
          document.querySelector('#adminPhone').disabled = false;
          document.querySelector('#adminAddress').disabled = false;

          const createRegisterBtn = document.createElement('button');
          createRegisterBtn.textContent = 'Register';
          createRegisterBtn.id = 'registerAdmin';

          // Add event listener for the new submit button
          createRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const adminName = document.querySelector('#adminName').value;
            const adminEmail = document.querySelector('#adminEmail').value;
            const adminPassword =
              document.querySelector('#adminPassword').value;
            const adminPhone = document.querySelector('#adminPhone').value;
            const adminAddress = document.querySelector('#adminAddress').value;

            // Validation

            if (
              !adminEmail ||
              !adminName ||
              !adminPassword ||
              !adminPhone ||
              !adminAddress
            ) {
              alert('All fields are required');
            }
            if (!validateEmail(adminEmail)) {
              alert('Please enter a valid email address.');
              return;
            }
            if (!validateName(adminName)) {
              alert(
                'Name should not contain numbers and must be between 3 and 50 characters.'
              );
              return;
            }
            if (!validateAddress(adminAddress)) {
              alert('Address should not be purely numeric.');
              return;
            }

            const newAdminObj = {
              adminname: adminName,
              email: adminEmail,
              password: adminPassword,
              contact: adminPhone,
              address: adminAddress,
            };

            // Perform the registration fetch call
            fetch(`http://localhost:3030/admin/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newAdminObj),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Network response not ok');
                }
                return response.json();
              })
              .then((data) => {
                // console.log('Admin added successfully', data);
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Admin added successfully',
                });
                // Optionally disable the fields again after update
                document.querySelector('#adminName').disabled = true;
                document.querySelector('#adminEmail').disabled = true;
                document.querySelector('#adminPassword').disabled = true;
                document.querySelector('#adminPhone').disabled = true;
                document.querySelector('#adminAddress').disabled = true;

                // Show the buttons again
                updateAdminBtn.style.display = 'block';
                addAdminBtnhide.style.display = 'block';
                deleteAdminBtn.style.display = 'block';
                // Remove the register button after update
                createRegisterBtn.remove();
              })
              .catch((error) => {
                // console.error('Error adding admin details:', error);
                alert('Error adding admin details.');
              });
          });

          // Append the new register button to the form
          document
            .querySelector('#registrationForm')
            .appendChild(createRegisterBtn);
        })
        .catch((error) => {
          console.error('Error fetching admin count:', error);
          alert('Error fetching admin count.');
        });
    });

    // Add event listener for update button
    updateAdminBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Hide the buttons for update, add, and delete
      updateAdminBtn.style.display = 'none';
      addAdminBtnhide.style.display = 'none';
      deleteAdminBtn.style.display = 'none';

      // Enable form fields for editing
      document.querySelector('#adminName').disabled = false;
      document.querySelector('#adminEmail');
      document.querySelector('#adminPassword').disabled = false;
      document.querySelector('#adminPhone').disabled = false;
      document.querySelector('#adminAddress').disabled = false;

      // Create a new submit button
      const createSubmitBtn = document.createElement('button');
      createSubmitBtn.textContent = 'Submit';
      createSubmitBtn.id = 'submitUpdate'; // Add an ID for the new button

      // Add event listener for the new submit button
      createSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const adminName = document.querySelector('#adminName').value;
        const adminEmail = document.querySelector('#adminEmail').value;
        const adminPassword = document.querySelector('#adminPassword').value;
        const adminPhone = document.querySelector('#adminPhone').value;
        const adminAddress = document.querySelector('#adminAddress').value;

        // Validation
        if (!validateEmail(adminEmail)) {
          alert('Please enter a valid email address.');
          return;
        }
        if (!validateName(adminName)) {
          alert(
            'Name should not contain numbers and must be between 3 and 50 characters.'
          );
          return;
        }
        if (!validateAddress(adminAddress)) {
          alert('Address should not be purely numeric.');
          return;
        }

        if (
          !adminEmail ||
          !adminName ||
          !adminPassword ||
          !adminPhone ||
          !adminAddress
        ) {
          alert('All fields are required');
        }
        const updateAdminObj = {
          adminname: adminName,
          email: adminEmail,
          password: adminPassword,
          contact: adminPhone,
          address: adminAddress,
        };

        // Perform the update fetch call
        fetch(
          `http://localhost:3030/admin/profile/${encodeURIComponent(
            getLoginAdminEmail
          )}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateAdminObj),
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response not ok');
            }
            return response.json();
          })
          .then((data) => {
            console.log('Admin details updated successfully', data);
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Admin details updated successfully',
            });
            // Optionally disable the fields again after update
            document.querySelector('#adminName').disabled = true;
            document.querySelector('#adminEmail').disabled = true;
            document.querySelector('#adminPassword').disabled = true;
            document.querySelector('#adminPhone').disabled = true;
            document.querySelector('#adminAddress').disabled = true;

            // Show the buttons again
            updateAdminBtn.style.display = 'block';
            addAdminBtnhide.style.display = 'block';
            deleteAdminBtn.style.display = 'block';
            // Remove the submit button after update
            createSubmitBtn.remove();
          })
          .catch((error) => {
            console.error('Error updating admin details:', error);
            alert('Error updating admin details.');
          });
      });

      // Append the new submit button to the form
      document.querySelector('#registrationForm').appendChild(createSubmitBtn);
    });

    // Add event listener for delete button
    // Add event listener for delete button
    deleteAdminBtn.addEventListener('click', async () => {
      try {
        // Prompt the user for email and password
        const email = prompt('Enter your email:');
        const password = prompt('Enter your password:');

        // Check if email and password are provided
        if (!email || !password) {
          alert('Email and password are required.');
          return;
        }

        // Perform a fetch to get the admin count
        const adminCountResponse = await fetch(
          'http://localhost:3030/admin/count'
        );
        if (!adminCountResponse.ok) {
          throw new Error('Failed to fetch admin count');
        }
        const adminCountData = await adminCountResponse.json();
        const adminCount = adminCountData.count;

        // Check if there is only one admin
        if (adminCount === 1) {
          alert('Minimum one admin account is required.');
          return;
        }

        // Check if there are only two admins
        if (adminCount === 2) {
          const confirmResult = await Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: 'Deleting this admin account will leave only one admin account.',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
          });
          if (!confirmResult.isConfirmed) {
            return;
          }
        }

        // Confirm deletion
        const confirmDeletion = await Swal.fire({
          icon: 'question',
          title: 'Are you sure?',
          text: 'You are about to delete this admin account. This action cannot be undone.',
          input: 'password',
          inputPlaceholder: 'Enter your password',
          inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off',
          },
          showCancelButton: true,
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          preConfirm: async (inputPassword) => {
            if (!inputPassword) {
              Swal.showValidationMessage('Password is required');
            }
            // Perform the deletion
            const deleteResponse = await fetch(
              `http://localhost:3030/admin/${encodeURIComponent(email)}`,
              {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: inputPassword }),
              }
            );

            // Check if deletion was successful
            if (!deleteResponse.ok) {
              const responseData = await deleteResponse.json();
              throw new Error(
                responseData.message || 'Failed to delete admin account'
              );
            }

            // Show success message
            return 'Admin account has been deleted.';
          },
        });

        if (confirmDeletion.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: confirmDeletion.value,
            confirmButtonText: 'OK',
          }).then(() => {
            location.reload();
          });
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.message ||
            'An error occurred. Admin account could not be deleted.',
        });
      }
    });
  })
  .catch((error) => {
    console.error('Error fetching admin details:', error);
    alert('Error fetching admin details.');
  });

// Function to validate email
function validateEmail(email) {
  const re =
    // Regular expression for email validation
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(String(email).toLowerCase());
}

// Function to validate name
function validateName(name) {
  const re =
    // Regular expression for name validation
    /^[a-zA-Z\s]*$/;
  return re.test(String(name));
}

// Function to validate address
function validateAddress(address) {
  const re =
    // Regular expression for address validation
    /^[a-zA-Z0-9\s,'-]*$/;
  return re.test(String(address));
}
