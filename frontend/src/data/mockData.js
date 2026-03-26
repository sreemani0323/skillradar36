// ========== MOCK DATA FOR SKILLRADAR FRONTEND ==========

export const DOMAINS = ['All', 'AI/ML', 'Full Stack', 'Data Science', 'LLM/GenAI', 'Cybersecurity', 'Cloud/DevOps'];

export const PLATFORMS = ['LinkedIn', 'Internshala', 'Naukri', 'Indeed', 'Remotive', 'AngelList', 'Glassdoor', 'Shine', 'HackerEarth', 'Unstop'];

export const topSkills = [
  { name: 'Python', mentions: 1847, domain: 'AI/ML', change: 12, trend: 'up' },
  { name: 'React', mentions: 1623, domain: 'Full Stack', change: 8, trend: 'up' },
  { name: 'TensorFlow', mentions: 1205, domain: 'AI/ML', change: -3, trend: 'down' },
  { name: 'JavaScript', mentions: 1189, domain: 'Full Stack', change: 5, trend: 'up' },
  { name: 'SQL', mentions: 1104, domain: 'Data Science', change: 2, trend: 'up' },
  { name: 'Docker', mentions: 987, domain: 'Cloud/DevOps', change: 15, trend: 'up' },
  { name: 'LangChain', mentions: 934, domain: 'LLM/GenAI', change: 42, trend: 'up' },
  { name: 'PyTorch', mentions: 876, domain: 'AI/ML', change: 18, trend: 'up' },
  { name: 'Node.js', mentions: 843, domain: 'Full Stack', change: 1, trend: 'up' },
  { name: 'AWS', mentions: 812, domain: 'Cloud/DevOps', change: 7, trend: 'up' },
  { name: 'Pandas', mentions: 798, domain: 'Data Science', change: -1, trend: 'down' },
  { name: 'TypeScript', mentions: 756, domain: 'Full Stack', change: 22, trend: 'up' },
  { name: 'Kubernetes', mentions: 698, domain: 'Cloud/DevOps', change: 10, trend: 'up' },
  { name: 'OpenAI API', mentions: 654, domain: 'LLM/GenAI', change: 56, trend: 'up' },
  { name: 'MongoDB', mentions: 623, domain: 'Full Stack', change: -2, trend: 'down' },
  { name: 'Scikit-learn', mentions: 587, domain: 'Data Science', change: -5, trend: 'down' },
  { name: 'PostgreSQL', mentions: 567, domain: 'Full Stack', change: 13, trend: 'up' },
  { name: 'Hugging Face', mentions: 543, domain: 'LLM/GenAI', change: 38, trend: 'up' },
  { name: 'Terraform', mentions: 512, domain: 'Cloud/DevOps', change: 9, trend: 'up' },
  { name: 'Linux', mentions: 498, domain: 'Cybersecurity', change: 3, trend: 'up' },
  { name: 'Next.js', mentions: 487, domain: 'Full Stack', change: 28, trend: 'up' },
  { name: 'Power BI', mentions: 456, domain: 'Data Science', change: 6, trend: 'up' },
  { name: 'RAG', mentions: 432, domain: 'LLM/GenAI', change: 67, trend: 'up' },
  { name: 'Penetration Testing', mentions: 398, domain: 'Cybersecurity', change: 11, trend: 'up' },
  { name: 'Prompt Engineering', mentions: 387, domain: 'LLM/GenAI', change: 45, trend: 'up' },
  { name: 'Tailwind CSS', mentions: 376, domain: 'Full Stack', change: 19, trend: 'up' },
  { name: 'SIEM', mentions: 345, domain: 'Cybersecurity', change: 8, trend: 'up' },
  { name: 'Spark', mentions: 334, domain: 'Data Science', change: -4, trend: 'down' },
  { name: 'FastAPI', mentions: 312, domain: 'Full Stack', change: 32, trend: 'up' },
  { name: 'Vector Databases', mentions: 298, domain: 'LLM/GenAI', change: 71, trend: 'up' },
];

export const trendData = [
  { month: 'Oct 24', Python: 1540, React: 1380, LangChain: 320, Docker: 780, SQL: 980 },
  { month: 'Nov 24', Python: 1590, React: 1420, LangChain: 450, Docker: 810, SQL: 1010 },
  { month: 'Dec 24', Python: 1620, React: 1460, LangChain: 580, Docker: 850, SQL: 1020 },
  { month: 'Jan 25', Python: 1680, React: 1510, LangChain: 690, Docker: 890, SQL: 1050 },
  { month: 'Feb 25', Python: 1750, React: 1570, LangChain: 810, Docker: 940, SQL: 1080 },
  { month: 'Mar 25', Python: 1847, React: 1623, LangChain: 934, Docker: 987, SQL: 1104 },
];

export const jobs = [
  { id: 1, title: 'AI/ML Intern', company: 'Google DeepMind', platform: 'LinkedIn', location: 'Bangalore', type: 'Hybrid', domain: 'AI/ML', skills: ['Python', 'TensorFlow', 'PyTorch', 'Mathematics'], matchScore: 85, postedAt: '2025-03-23', applyUrl: '#' },
  { id: 2, title: 'Full Stack Developer Intern', company: 'Razorpay', platform: 'Internshala', location: 'Bangalore', type: 'On-site', domain: 'Full Stack', skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'], matchScore: 72, postedAt: '2025-03-22', applyUrl: '#' },
  { id: 3, title: 'Data Science Intern', company: 'Flipkart', platform: 'Naukri', location: 'Bangalore', type: 'On-site', domain: 'Data Science', skills: ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Power BI'], matchScore: 68, postedAt: '2025-03-24', applyUrl: '#' },
  { id: 4, title: 'GenAI Research Intern', company: 'Microsoft', platform: 'LinkedIn', location: 'Hyderabad', type: 'Hybrid', domain: 'LLM/GenAI', skills: ['Python', 'LangChain', 'OpenAI API', 'RAG', 'Vector Databases'], matchScore: 91, postedAt: '2025-03-25', applyUrl: '#' },
  { id: 5, title: 'Cloud Engineer Intern', company: 'Amazon', platform: 'Indeed', location: 'Chennai', type: 'On-site', domain: 'Cloud/DevOps', skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux'], matchScore: 55, postedAt: '2025-03-21', applyUrl: '#' },
  { id: 6, title: 'SOC Analyst Intern', company: 'CrowdStrike', platform: 'LinkedIn', location: 'Remote', type: 'Remote', domain: 'Cybersecurity', skills: ['SIEM', 'Linux', 'Penetration Testing', 'Wireshark'], matchScore: 40, postedAt: '2025-03-20', applyUrl: '#' },
  { id: 7, title: 'Frontend Developer Intern', company: 'Swiggy', platform: 'Internshala', location: 'Bangalore', type: 'On-site', domain: 'Full Stack', skills: ['React', 'JavaScript', 'Tailwind CSS', 'Next.js'], matchScore: 78, postedAt: '2025-03-24', applyUrl: '#' },
  { id: 8, title: 'ML Engineer Intern', company: 'NVIDIA', platform: 'LinkedIn', location: 'Pune', type: 'Hybrid', domain: 'AI/ML', skills: ['Python', 'PyTorch', 'CUDA', 'C++'], matchScore: 62, postedAt: '2025-03-22', applyUrl: '#' },
  { id: 9, title: 'Backend Developer Intern', company: 'Zerodha', platform: 'AngelList', location: 'Bangalore', type: 'Remote', domain: 'Full Stack', skills: ['Go', 'PostgreSQL', 'Redis', 'Docker'], matchScore: 48, postedAt: '2025-03-23', applyUrl: '#' },
  { id: 10, title: 'LLM Application Developer', company: 'Ola', platform: 'Naukri', location: 'Bangalore', type: 'On-site', domain: 'LLM/GenAI', skills: ['Python', 'LangChain', 'Hugging Face', 'FastAPI'], matchScore: 83, postedAt: '2025-03-25', applyUrl: '#' },
  { id: 11, title: 'Data Analyst Intern', company: 'PhonePe', platform: 'Internshala', location: 'Bangalore', type: 'Hybrid', domain: 'Data Science', skills: ['SQL', 'Python', 'Power BI', 'Excel'], matchScore: 75, postedAt: '2025-03-24', applyUrl: '#' },
  { id: 12, title: 'DevOps Intern', company: 'Atlassian', platform: 'LinkedIn', location: 'Bangalore', type: 'Hybrid', domain: 'Cloud/DevOps', skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform'], matchScore: 58, postedAt: '2025-03-21', applyUrl: '#' },
];

export const kanbanData = {
  saved: [
    { id: 'k1', title: 'GenAI Research Intern', company: 'Microsoft', domain: 'LLM/GenAI', matchScore: 91, note: 'Great match! Apply by March 30', date: '2025-03-25' },
    { id: 'k2', title: 'AI/ML Intern', company: 'Google DeepMind', domain: 'AI/ML', matchScore: 85, note: 'Referral available via alumni network', date: '2025-03-23' },
  ],
  applied: [
    { id: 'k3', title: 'Full Stack Developer Intern', company: 'Razorpay', domain: 'Full Stack', matchScore: 72, note: 'Applied on Internshala', date: '2025-03-22' },
    { id: 'k4', title: 'LLM Application Developer', company: 'Ola', domain: 'LLM/GenAI', matchScore: 83, note: 'Submitted resume + portfolio', date: '2025-03-25' },
  ],
  interview: [
    { id: 'k5', title: 'Frontend Developer Intern', company: 'Swiggy', domain: 'Full Stack', matchScore: 78, note: 'Round 1 on March 28 at 3pm', date: '2025-03-24' },
  ],
  offer: [
    { id: 'k6', title: 'Data Analyst Intern', company: 'PhonePe', domain: 'Data Science', matchScore: 75, note: '₹25k/month stipend, 6 months', date: '2025-03-24' },
  ],
  rejected: [
    { id: 'k7', title: 'Cloud Engineer Intern', company: 'Amazon', domain: 'Cloud/DevOps', matchScore: 55, note: 'Need more AWS experience', date: '2025-03-21' },
  ],
};

export const userSkills = ['Python', 'React', 'JavaScript', 'SQL', 'LangChain', 'Node.js', 'Docker', 'FastAPI', 'Git', 'TypeScript'];

export const domainColors = {
  'AI/ML': '#6c5ce7',
  'Full Stack': '#00cec9',
  'Data Science': '#fdcb6e',
  'LLM/GenAI': '#fd79a8',
  'Cybersecurity': '#e17055',
  'Cloud/DevOps': '#74b9ff',
};

export const platformStats = {
  totalJobs: 3847,
  totalSkills: 534,
  platformCount: 23,
  lastScraped: '2025-03-25T16:30:00Z',
};

export const skillGapData = [
  { domain: 'AI/ML', matchPercent: 72, totalSkills: 18, matchedSkills: 13, missing: ['Computer Vision', 'NLP', 'CUDA', 'Mathematics', 'C++'] },
  { domain: 'Full Stack', matchPercent: 85, totalSkills: 20, matchedSkills: 17, missing: ['Redis', 'GraphQL', 'Go'] },
  { domain: 'Data Science', matchPercent: 58, totalSkills: 16, matchedSkills: 9, missing: ['Power BI', 'Tableau', 'R', 'Spark', 'Statistics', 'ETL', 'Hadoop'] },
  { domain: 'LLM/GenAI', matchPercent: 78, totalSkills: 14, matchedSkills: 11, missing: ['Prompt Engineering', 'Vector Databases', 'Fine-tuning'] },
  { domain: 'Cybersecurity', matchPercent: 25, totalSkills: 12, matchedSkills: 3, missing: ['SIEM', 'Penetration Testing', 'Wireshark', 'Forensics', 'SOC', 'Firewalls', 'IDS/IPS', 'Malware Analysis', 'Compliance'] },
  { domain: 'Cloud/DevOps', matchPercent: 52, totalSkills: 15, matchedSkills: 8, missing: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins', 'Ansible', 'Monitoring', 'CI/CD'] },
];

export const alertSettings = [
  { id: 1, domain: 'AI/ML', threshold: 70, email: true, telegram: false, active: true },
  { id: 2, domain: 'LLM/GenAI', threshold: 60, email: true, telegram: true, active: true },
  { id: 3, domain: 'Full Stack', threshold: 80, email: false, telegram: true, active: false },
];

export const recentAlerts = [
  { id: 1, title: 'GenAI Research Intern', company: 'Microsoft', matchScore: 91, domain: 'LLM/GenAI', time: '2 hours ago', read: false },
  { id: 2, title: 'AI/ML Intern', company: 'Google DeepMind', matchScore: 85, domain: 'AI/ML', time: '5 hours ago', read: false },
  { id: 3, title: 'LLM Application Developer', company: 'Ola', matchScore: 83, domain: 'LLM/GenAI', time: '8 hours ago', read: true },
  { id: 4, title: 'Full Stack Developer Intern', company: 'Razorpay', matchScore: 72, domain: 'Full Stack', time: '1 day ago', read: true },
  { id: 5, title: 'Frontend Developer Intern', company: 'Swiggy', matchScore: 78, domain: 'Full Stack', time: '1 day ago', read: true },
];
