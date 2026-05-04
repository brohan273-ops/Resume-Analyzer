# Resume Analyzer Web Application

A full-stack web application built with Django and React that analyzes resumes against job descriptions using keyword matching.

## Features
- Upload Resume (PDF or DOCX)
- Paste Job Description
- Match Percentage Calculation
- Detailed list of Matched and Missing Keywords

## Project Structure
- `backend/`: Django REST API
- `frontend/`: React JS Frontend

---

## Setup Instructions

### Backend (Django)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   py -m venv venv
   ```
3. Activate the virtual environment:
   - **Windows:** `.\venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the server:
   ```bash
   python manage.py runserver
   ```
   *The API will be available at `http://localhost:8000/api/analyze/`*

### Frontend (React)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install node modules:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```
   *The website will be available at `http://localhost:3000`*

---

## Sample Data for Testing

### Sample Job Description:
"Looking for a Senior Python Developer with 5+ years of experience. Must be proficient in Django, REST Framework, and SQL. Experience with React and AWS is a plus. Strong communication skills and leadership abilities are required."

### Sample Resume Keywords:
"Experienced Developer proficient in Python, SQL, and HTML. Knowledge of Git and Agile methodologies. Strong communication skills and teamwork."

---

## Technical Logic
1. **Extraction**: Uses `PyPDF2` for PDF files and `python-docx` for Word documents.
2. **Cleaning**: Lowercases text, removes punctuation, and filters out common stopwords (a, the, is, at, etc.).
3. **Comparison**: Performs a set intersection between resume keywords and job description keywords.
4. **Scoring**: Match % = (Matched Keywords / Total JD Keywords) * 100.
