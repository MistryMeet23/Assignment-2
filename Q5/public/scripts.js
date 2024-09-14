document.addEventListener('DOMContentLoaded', () => {
    // Load students when the page loads
    loadStudents();
  
    document.getElementById('studentForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: document.getElementById('studentName').value,
            age: document.getElementById('studentAge').value,
            grade: document.getElementById('studentGrade').value,
          })
        });
        const student = await response.json();
        addStudentToList(student);
        document.getElementById('studentForm').reset();
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    document.getElementById('logout')?.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  });
  
  async function loadStudents() {
    try {
      const response = await fetch('/api/students', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const students = await response.json();
      document.getElementById('studentList').innerHTML = '';
      students.forEach(addStudentToList);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  function addStudentToList(student) {
    const studentList = document.getElementById('studentList');
    const li = document.createElement('li');
    li.textContent = `Name: ${student.name}, Age: ${student.age}, Grade: ${student.grade}`;
    studentList.appendChild(li);
  }
  