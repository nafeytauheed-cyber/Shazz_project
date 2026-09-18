export type Persona = 'alex' | 'sam' | 'jordan';

export const personas = {
  alex: { name: 'Alex', label: 'Newcomer · Backend', role: 'member', team: 'Backend' },
  sam: { name: 'Sam', label: 'Newcomer · Product', role: 'member', team: 'Product' },
  jordan: { name: 'Jordan', label: 'Admin', role: 'admin', team: 'Engineering' },
} as const;

export const knowledge = [
  {
    id: 'vpn-access',
    title: 'IT and Access Guide',
    section: 'VPN access',
    keywords: ['vpn', 'remote', 'network', 'access', 'mfa'],
    answer:
      'To get VPN access, complete SSO and MFA setup first, then submit the VPN access request in the IT portal. IT Helpdesk reviews the request and confirms access by email.',
  },
  {
    id: 'sso-setup',
    title: 'Engineering Setup',
    section: 'First-day setup',
    keywords: ['sso', 'login', 'setup', 'first day', 'account'],
    answer:
      'Start with the SSO invite from IT, enroll your authenticator, and verify that you can sign in to the employee portal. Ask IT Helpdesk if the invite has expired.',
  },
  {
    id: 'repo-access',
    title: 'Engineering Setup',
    section: 'Repository access',
    keywords: ['repo', 'repository', 'github', 'engineering', 'access'],
    answer:
      'After SSO is working, request GitHub repository access through the engineering access form. Your engineering manager approves the request and the platform team applies the permission.',
  },
  {
    id: 'leave-payroll',
    title: 'Leave and Payroll',
    section: 'Payroll questions',
    keywords: ['payroll', 'leave', 'salary', 'timesheet', 'hr'],
    answer:
      'For payroll or leave questions, contact HR at hr@nimbuslabs.example. Timesheets are submitted by Friday afternoon through the employee portal.',
  },
];

export function findAnswer(message: string) {
  const normalized = message.toLowerCase();
  const ranked = knowledge
    .map((item) => ({
      item,
      score: item.keywords.reduce((total, keyword) => total + (normalized.includes(keyword) ? 1 : 0), 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.item ?? null;
}

export const roadmap = [
  { title: 'Complete SSO setup', status: 'todo' },
  { title: 'Enroll in MFA', status: 'todo' },
  { title: 'Request repository access', status: 'locked' },
];
