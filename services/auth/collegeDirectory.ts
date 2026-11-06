import { CollegeInfo } from '../../types/auth';

export const COLLEGES_DIRECTORY: CollegeInfo[] = [
  {
    id: 'oxford',
    name: 'University of Oxford',
    shortName: 'Oxford',
    domain: 'ox.ac.uk',
    location: 'Oxford, United Kingdom',
    hasInstitutionalEmail: true,
    popular: true,
  },
  {
    id: 'cambridge',
    name: 'University of Cambridge',
    shortName: 'Cambridge',
    domain: 'cam.ac.uk',
    location: 'Cambridge, United Kingdom',
    hasInstitutionalEmail: true,
    popular: true,
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    shortName: 'Stanford',
    domain: 'stanford.edu',
    location: 'Stanford, California, USA',
    hasInstitutionalEmail: true,
    popular: true,
  },
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    shortName: 'MIT',
    domain: 'mit.edu',
    location: 'Cambridge, Massachusetts, USA',
    hasInstitutionalEmail: true,
    popular: true,
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    shortName: 'Harvard',
    domain: 'harvard.edu',
    location: 'Cambridge, Massachusetts, USA',
    hasInstitutionalEmail: true,
    popular: true,
  },
  {
    id: 'berkeley',
    name: 'University of California, Berkeley',
    shortName: 'UC Berkeley',
    domain: 'berkeley.edu',
    location: 'Berkeley, California, USA',
    hasInstitutionalEmail: true,
    popular: true,
  },
  {
    id: 'columbia',
    name: 'Columbia University',
    shortName: 'Columbia',
    domain: 'columbia.edu',
    location: 'New York, New York, USA',
    hasInstitutionalEmail: true,
    popular: true,
  },
  {
    id: 'imperial',
    name: 'Imperial College London',
    shortName: 'Imperial',
    domain: 'imperial.ac.uk',
    location: 'London, United Kingdom',
    hasInstitutionalEmail: true,
    popular: false,
  },
  {
    id: 'utoronto',
    name: 'University of Toronto',
    shortName: 'U of T',
    domain: 'mail.utoronto.ca',
    location: 'Toronto, Ontario, Canada',
    hasInstitutionalEmail: true,
    popular: false,
  },
  {
    id: 'iitb',
    name: 'Indian Institute of Technology Bombay',
    shortName: 'IIT Bombay',
    domain: 'iitb.ac.in',
    location: 'Mumbai, Maharashtra, India',
    hasInstitutionalEmail: true,
    popular: true,
  },
  {
    id: 'iitd',
    name: 'Indian Institute of Technology Delhi',
    shortName: 'IIT Delhi',
    domain: 'iitd.ac.in',
    location: 'New Delhi, India',
    hasInstitutionalEmail: true,
    popular: true,
  },
  {
    id: 'nus',
    name: 'National University of Singapore',
    shortName: 'NUS',
    domain: 'u.nus.edu',
    location: 'Queenstown, Singapore',
    hasInstitutionalEmail: true,
    popular: false,
  },
  // Colleges WITHOUT public student email domains (Alternative Verification Route)
  {
    id: 'st-jude-polytechnic',
    name: 'St. Jude Polytechnic & Design Guild',
    shortName: 'St. Jude Guild',
    location: 'Edinburgh, United Kingdom',
    hasInstitutionalEmail: false,
    popular: false,
  },
  {
    id: 'crestwood-vocational',
    name: 'Crestwood Community Vocational College',
    shortName: 'Crestwood',
    location: 'Bristol, United Kingdom',
    hasInstitutionalEmail: false,
    popular: false,
  },
  {
    id: 'alliance-conservatory',
    name: 'Alliance Art & Craft Conservatory',
    shortName: 'Alliance Conservatory',
    location: 'Florence, Italy',
    hasInstitutionalEmail: false,
    popular: false,
  },
];

export function getPopularColleges(): CollegeInfo[] {
  return COLLEGES_DIRECTORY.filter((c) => c.popular);
}

export function searchColleges(query: string): CollegeInfo[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return COLLEGES_DIRECTORY;

  return COLLEGES_DIRECTORY.filter(
    (c) =>
      c.name.toLowerCase().includes(clean) ||
      c.shortName.toLowerCase().includes(clean) ||
      c.location.toLowerCase().includes(clean) ||
      (c.domain && c.domain.toLowerCase().includes(clean))
  );
}

export function getCollegeById(id: string): CollegeInfo | undefined {
  return COLLEGES_DIRECTORY.find((c) => c.id === id);
}

export function validateInstitutionalEmail(
  email: string,
  college: CollegeInfo
): { isValid: boolean; message?: string } {
  if (!college.hasInstitutionalEmail || !college.domain) {
    return {
      isValid: false,
      message: `${college.name} does not issue verified student domains. Please use the administrative ID verification path.`,
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const domain = college.domain.toLowerCase();

  // Check if email ends with @domain or .domain
  const emailParts = cleanEmail.split('@');
  if (emailParts.length !== 2) {
    return {
      isValid: false,
      message: 'Please enter a valid institutional email address.',
    };
  }

  const emailDomain = emailParts[1];
  const isMatch = emailDomain === domain || emailDomain.endsWith('.' + domain);

  if (!isMatch) {
    return {
      isValid: false,
      message: `Email must belong to ${college.name} (e.g., student@${domain}).`,
    };
  }

  return { isValid: true };
}

