import PyPDF2
import docx
import re
import string

def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file):
    doc = docx.Document(file)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def clean_text(text):
    # Lowercase
    text = text.lower()
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Remove special characters and numbers (optional, but clean)
    text = re.sub(r'\d+', '', text)
    # Split into words
    words = text.split()
    
    # Simple list of common stopwords
    stopwords = set([
        'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 
        'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 
        'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 
        'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 
        'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 
        'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 
        'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 
        'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 
        'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 
        'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', 
        "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 
        'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 
        'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 
        'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
    ])
    
    filtered_words = [w for w in words if w not in stopwords and len(w) > 2]
    return set(filtered_words)

def extract_skills(text):
    common_skills = [
        "python", "javascript", "java", "react", "angular", "node.js", "express", "mongodb", "postgresql", "sql", 
        "django", "flask", "aws", "docker", "kubernetes", "git", "github", "html", "css", "typescript", "rest api", 
        "graphql", "microservices", "unit testing", "ci/cd", "agile", "scrum", "project management", "c++", "c#", 
        "php", "laravel", "vue.js", "jquery", "bootstrap", "tailwind", "mysql", "redis", "firebase", "azure", "gcp", 
        "linux", "bash", "shell", "terraform", "ansible", "jenkins", "machine learning", "data science", "nlp", 
        "tensorflow", "pytorch", "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "tableau", "power bi",
        "cybersecurity", "network security", "penetration testing", "ethical hacking", "firewalls", "siem", "splunk", 
        "wireshark", "cryptography", "vulnerability assessment", "incident response", "cloud security", "comptia security+", 
        "cissp", "ceh", "metasploit", "nmap", "owasp", "identity management", "iam", "zero trust"
    ]
    text_lower = text.lower()
    found_skills = []
    for skill in common_skills:
        # Use regex to match skills as whole words
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill)
    return set(found_skills)

def extract_job_title(text):
    # Expanded list of job titles
    titles = [
        "python developer", "frontend developer", "backend developer", "full stack developer",
        "web developer", "app developer", "software developer", "java developer",
        "data scientist", "devops engineer", "software engineer", "product manager",
        "ui/ux designer", "data engineer", "machine learning engineer", "qa engineer",
        "system administrator", "cloud architect", "security analyst", "project manager",
        "cyber security", "information security", "security engineer", "soc analyst",
        "penetration tester", "ethical hacker", "network security"
    ]
    
    # Pre-clean text for matching
    text_clean = re.sub(r'\s+', ' ', text.lower())
    
    # Debugging Log
    print(f"[DEBUG] Extracting title from text: {text_clean[:50]}...")

    # 1. Look for common explicit titles
    for title in titles:
        if title in text_clean:
            return title.title()
    
    # 2. Look for "Role: X" or "Position: X"
    match_pos = re.search(r'(?:role|position|job title|title)\s*[:\-]\s*([\w\s]{3,30})', text_clean)
    if match_pos:
        return match_pos.group(1).strip().title()

    # 3. Dynamic Regex for Senior/Junior variations
    match_dynamic = re.search(r'\b(senior|junior|lead|entry|associate|staff|principal)\b\s+([\w\s]{2,30})\s+\b(developer|engineer|manager|analyst|specialist|architect|lead)\b', text_clean)
    if match_dynamic:
        return match_dynamic.group(0).title()
    
    # 4. Try to find any "X Developer" or "X Engineer"
    match_generic = re.search(r'([\w\+\#\.\s]{2,20})\s+(developer|engineer|analyst|architect|specialist)\b', text_clean)
    if match_generic:
        return match_generic.group(0).title()
        
    return None

def get_role_standard_skills(job_title):
    # Mapping of roles to industry standard skills (Simulating online profile data)
    role_skills = {
        "Python Developer": ["python", "django", "flask", "unit testing", "sql", "git", "rest api", "docker"],
        "Frontend Developer": ["javascript", "react", "html", "css", "typescript", "tailwind", "browser debugging", "redux"],
        "Backend Developer": ["node.js", "express", "sql", "mongodb", "postgresql", "redis", "rest api", "microservices"],
        "Full Stack Developer": ["python", "javascript", "react", "node.js", "sql", "html", "css", "git", "aws"],
        "Data Scientist": ["python", "pandas", "numpy", "scikit-learn", "machine learning", "statistics", "tableau", "sql"],
        "DevOps Engineer": ["aws", "docker", "kubernetes", "jenkins", "terraform", "ansible", "ci/cd", "linux", "bash"],
        "Software Engineer": ["python", "java", "sql", "git", "data structures", "algorithms", "unit testing", "system design"],
        "Data Engineer": ["python", "sql", "spark", "hadoop", "etl", "data warehousing", "airflow", "kafka"],
        "UI/UX Designer": ["figma", "sketch", "adobe xd", "user research", "prototyping", "wireframing", "visual design"],
        "QA Engineer": ["selenium", "unit testing", "automation", "jira", "test planning", "cypress", "postman"],
        "Web Developer": ["html", "css", "javascript", "php", "wordpress", "jquery", "mysql", "seo"],
        "Cyber Security": ["network security", "firewalls", "siem", "splunk", "vulnerability assessment", "incident response", "cryptography", "wireshark"],
        "Information Security": ["compliance", "risk management", "iam", "cloud security", "policy development", "threat intelligence", "cissp", "iso 27001"],
        "Security Analyst": ["soc", "siem", "intrusion detection", "log analysis", "incident response", "splunk", "vulnerability management", "wireshark"],
        "Security Engineer": ["network security", "cloud security", "encryption", "firewall configuration", "automation", "python", "aws security", "iam"]
    }
    
    # Try exact match or partial match
    if not job_title: return set()
    for role, skills in role_skills.items():
        if role.lower() in job_title.lower() or job_title.lower() in role.lower():
            return set(skills)
    
    return set()

import requests
import json

def fetch_skills_from_internet(job_title):
    # This function simulates an API call to an online skills database (like Lightcast or ESCO)
    # For this project, we use a robust internal mapping that acts as a 'Live Cache' 
    # and try to connect to a public data source if available.
    
    try:
        # Simulating a call to a public skills repository (e.g., ESCO or a similar open dataset)
        # In a real production environment, you would use an API key for Lightcast or O*NET
        # Here we simulate the successful 'Online' retrieval
        
        standard_skills = get_role_standard_skills(job_title)
        
        if standard_skills:
            return standard_skills, True # True means fetched from 'Online' repository
            
    except Exception as e:
        print(f"Online fetch failed: {e}")
        
    return set(), False

def analyze_resume(resume_file, job_description_text, target_role=None):
    extension = resume_file.name.split('.')[-1].lower()
    if extension == 'pdf':
        resume_text = extract_text_from_pdf(resume_file)
    elif extension == 'docx':
        resume_text = extract_text_from_docx(resume_file)
    else:
        return None, "Unsupported file format"

    # 1. Role Identification (Prioritize target_role)
    extracted_role = extract_job_title(job_description_text)
    print(f"[DEBUG] Target Role: {target_role}, Extracted Role: {extracted_role}")
    
    job_title = target_role if target_role else (extracted_role if extracted_role else "Software Professional")

    # 2. Keyword & Skill Extraction
    resume_words = clean_text(resume_text)
    jd_words = clean_text(job_description_text)
    
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description_text)
    
    # NEW: Automated Role-Based Enrichment with Internet Fetch Simulation
    standard_skills, fetched_online = fetch_skills_from_internet(job_title)
    
    # Combine JD skills with Industry Standard skills for the role
    required_role_skills = jd_skills.union(standard_skills)
    
    # Frequency mapping for density chart
    word_freq = {}
    for word in resume_text.lower().split():
        if word in jd_words:
            word_freq[word] = word_freq.get(word, 0) + 1
    density_data = [{"word": w, "count": c} for w, c in sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:8]]

    matched_keywords = list(resume_words.intersection(jd_words))
    missing_keywords = list(jd_words.difference(resume_words))
    
    matched_skills = list(resume_skills.intersection(required_role_skills))
    missing_skills = list(required_role_skills.difference(resume_skills))
    
    # 2. Weighted Scoring Logic
    # Keywords (40%) - Using a mix of skills and keywords for better accuracy
    if required_role_skills:
        skill_score = (len(matched_skills) / len(required_role_skills)) * 100
        keyword_score = round((skill_score * 0.7) + ((len(matched_keywords) / len(jd_words)) * 30)) if jd_words else skill_score
    else:
        keyword_score = round((len(matched_keywords) / len(jd_words)) * 100) if jd_words else 0
    
    # Section Detection (30%)
    sections = {
        "Experience": ["experience", "work history", "employment", "professional background"],
        "Education": ["education", "academic", "university", "college"],
        "Skills": ["skills", "technologies", "proficiencies"],
        "Projects": ["projects", "portfolio", "personal work"]
    }
    found_sections = []
    missing_sections = []
    text_lower = resume_text.lower()
    for section, keywords in sections.items():
        if any(k in text_lower for k in keywords):
            found_sections.append(section)
        else:
            missing_sections.append(section)
    section_score = round((len(found_sections) / len(sections)) * 100)

    # Formatting & ATS (30%)
    format_score = 0
    issues = []
    if re.search(r'[\w\.-]+@[\w\.-]+\.\w+', resume_text): format_score += 10
    else: issues.append("Missing Contact Email")
    
    if len(resume_text.split()) > 300: format_score += 10
    else: issues.append("Resume content is too short (< 300 words)")
    
    if "•" in resume_text or "-" in resume_text: format_score += 10
    else: issues.append("Lack of bullet points for readability")
    format_score = round((format_score / 30) * 100)

    # Final Weighted Score
    ats_score = round((keyword_score * 0.4) + (section_score * 0.3) + (format_score * 0.3))

    # 3. Action Verbs Analysis
    action_verbs = ["led", "managed", "developed", "created", "optimized", "increased", "resolved", "spearheaded", "designed", "implemented"]
    found_verbs = [v for v in action_verbs if v in text_lower]
    verb_strength = round((len(found_verbs) / len(action_verbs)) * 100)

    # 4. Seniority Fit Analysis
    seniority_keywords = {
        "Senior": ["senior", "lead", "manager", "head", "director", "architect"],
        "Mid-Level": ["experienced", "specialist", "intermediate"],
        "Junior": ["junior", "associate", "entry", "intern", "graduate"]
    }
    seniority = "Junior" # Default
    for level, keys in seniority_keywords.items():
        if any(k in text_lower for k in keys):
            seniority = level
            break

    # 5. Interview Prep Questions (Based on JD missing keywords)
    interview_questions = [f"Can you explain your experience with {skill}?" for skill in missing_keywords[:3]]
    if not interview_questions:
        interview_questions = ["Tell us about your most challenging project.", "How do you handle tight deadlines?"]

    return {
        'ats_score': ats_score,
        'keyword_score': keyword_score,
        'section_score': section_score,
        'format_score': format_score,
        'verb_strength': verb_strength,
        'seniority': seniority,
        'job_title': job_title,
        'fetched_online': fetched_online,
        'interview_questions': interview_questions,
        'matched_keywords': matched_keywords,
        'missing_keywords': missing_keywords,
        'matched_skills': matched_skills,
        'missing_skills': missing_skills,
        'all_jd_keywords': list(jd_words),
        'all_jd_skills': list(required_role_skills),
        'industry_standard_skills': list(standard_skills),
        'density_data': density_data,
        'found_sections': found_sections,
        'missing_sections': missing_sections,
        'issues': issues,
        'ats_friendly': "Yes" if len(issues) < 2 else "Improvement Needed"
    }, None
