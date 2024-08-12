document.addEventListener('DOMContentLoaded', () => {
  const homePage = document.getElementById('homePage');
  const registerFormDiv = document.getElementById('registerFormDiv');
  const loginFormDiv = document.getElementById('loginFormDiv');
  const reportFormDiv = document.getElementById('reportFormDiv');
  const reportsContainer = document.getElementById('reportsContainer');
  const adminReportsContainer = document.getElementById('adminReportsContainer');
  const reportLink = document.getElementById('reportLink');
  const adminReportsPage = document.getElementById('adminReportsPage');

  const showPage = (page) => {
    homePage.style.display = 'none';
    registerFormDiv.style.display = 'none';
    loginFormDiv.style.display = 'none';
    reportFormDiv.style.display = 'none';
    adminReportsPage.style.display = 'none';
    page.style.display = 'block';
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to check authentication status');
      }

      const { loggedIn, isAdmin } = await response.json();

      // Show/hide pages based on user role
      if (loggedIn) {
        document.getElementById('reportLink').style.display = 'block';
        if (isAdmin) {
          adminReportsPage.style.display = 'block';
          loadAdminReports();
        } else {
          adminReportsPage.style.display = 'none';
          loadReports();
        }
      } else {
        document.getElementById('reportLink').style.display = 'none';
        adminReportsPage.style.display = 'none';
        homePage.style.display = 'block';
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      alert('Failed to check authentication status');
    }
  };

  document.getElementById('homeLink').addEventListener('click', () => {
    showPage(homePage);
    loadReports();
    checkAuthStatus();
  });

  document.getElementById('loginLink').addEventListener('click', () => {
    showPage(loginFormDiv);
  });

  document.getElementById('registerLink').addEventListener('click', () => {
    showPage(registerFormDiv);
  });

  document.getElementById('logoutLink').addEventListener('click', async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      sessionStorage.removeItem('authToken');
      alert('Logout successful');
      showPage(homePage);
      checkAuthStatus();
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to logout');
    }
  });

  document.getElementById('reportLink').addEventListener('click', () => {
    showPage(reportFormDiv);
  });

  document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Include session cookies
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      alert('Report submitted successfully');
      document.getElementById('title').value = '';
      document.getElementById('description').value = '';
      document.getElementById('image').value = '';
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit report');
    }
  });

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      alert('Registration successful');
      showPage(loginFormDiv);
    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed');
    }
  });

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      sessionStorage.setItem('authToken', data.token);

      alert('Login successful');
      showPage(homePage);
      loadReports();
      checkAuthStatus();
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed');
    }
  });

  //     ${report.image ? `<img src="${report.image}" alt="${report.title}">` : ''}
  const loadReports = async () => {
    try {
      const response = await fetch('/api/reports');
      const reports = await response.json();
  
      reportsContainer.innerHTML = '';
  
      reports.forEach(report => {
        const reportDiv = document.createElement('div');
        reportDiv.classList.add('col-lg-3', 'col-md-4', 'mb-4'); // Colonne responsive più larghe e margine inferiore
        reportDiv.classList.add('report');
        reportDiv.innerHTML = `
          <div class="card">
            ${report.image ? `<img src="${report.image}" alt="${report.title}" class="card-img-top" style="height: 200px; object-fit: cover;">` : ''}
            <div class="card-body">
              <h5 class="card-title">${report.title}</h5>
              <p class="card-text">${report.description}</p>
              <p class="card-text"><small class="text-muted">Status: ${report.status}</small></p>
            </div>
          </div>
        `;
        reportsContainer.appendChild(reportDiv);
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      reportsContainer.innerHTML = 'Failed to load reports.';
    }
  };
  

  const loadAdminReports = async () => {
    try {
      // Usa il nuovo endpoint per ottenere solo le segnalazioni con stato 'pending'
      const response = await fetch('/api/reports/pending', {
        credentials: 'include' // Includi i cookie della sessione
      });
  
  
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
  
      const reports = await response.json();
  
      adminReportsContainer.innerHTML = '';
  
      reports.forEach(report => {
        const reportDiv = document.createElement('div');
        reportDiv.classList.add('col-md-4', 'mb-4'); // Colonne responsive con margine inferiore
        reportDiv.innerHTML = `
          <div class="card">
            ${report.image ? `<img src="${report.image}" class="card-img-top" alt="${report.title}" style="height: 200px; object-fit: cover;">` : ''}
            <div class="card-body">
              <h5 class="card-title">${report.title}</h5>
              <p class="card-text">${report.description}</p>
              <p class="card-text"><small class="text-muted">Status: ${report.status}</small></p>
              <div class="btn-group" role="group" aria-label="Report Actions">
                <button type="button" class="btn btn-success" onclick="updateReportStatus('${report._id}', 'accepted')">Accetta</button>
                <button type="button" class="btn btn-danger" onclick="updateReportStatus('${report._id}', 'rejected')">Rifiuta</button>
                <button type="button" class="btn btn-warning" onclick="updateReportStatus('${report._id}', 'pending')">In Attesa</button>
              </div>
            </div>
          </div>
        `;
        adminReportsContainer.appendChild(reportDiv);
      });
    } catch (error) {
      console.error('Error fetching admin reports:', error);
      adminReportsContainer.innerHTML = 'Failed to load reports.';
    }
  };
  window.updateReportStatus = async (reportId, status) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update report status');
      }
  
      alert('Report status updated successfully');
      loadAdminReports();
      loadReports(); // Ricarica la lista delle segnalazioni della home
    } catch (error) {
      console.error('Error updating report status:', error);
      alert('Failed to update report status');
    }
  };
  

  // Call checkAuthStatus when the page loads
  checkAuthStatus();
});
