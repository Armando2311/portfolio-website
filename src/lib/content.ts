// All site copy lives here so it can be revised in one place.

export const SECTIONS = [
  { id: 'hero', label: 'Boot', code: 'A0' },
  { id: 'profile', label: 'Profile', code: 'A1' },
  { id: 'capabilities', label: 'Capabilities', code: 'A2' },
  { id: 'line', label: 'The Line', code: 'A3' },
  { id: 'work', label: 'Work', code: 'A4' },
  { id: 'evidence', label: 'Evidence', code: 'A5' },
  { id: 'toolchain', label: 'Toolchain', code: 'A6' },
  { id: 'contact', label: 'Contact', code: 'A7' },
] as const;

export const PERSON = {
  name: 'Armando R. Taveras',
  first: 'ARMANDO',
  last: 'R. TAVERAS',
  role: 'Validation & Integration',
  title: 'Lead Technician — Server & Industrial PC Platforms',
  employer: 'Axiomtek-US',
  program: 'Netscout production line',
  since: 'March 2024',
  location: 'Methuen, MA',
  email: 'armandotaverash@gmail.com',
  phone: '(475) 455-1065',
  resume: '/resume.pdf',
};

export const HERO = {
  eyebrow: 'Validation & integration · ODM / contract manufacturing',
  lede: 'I validate customer-specific servers and industrial PCs before they ship — with test methods a technician runs the same way on unit 1 and unit 100, and failure analysis that finds the real root cause, not the convenient one.',
};

export const PROFILE = {
  title: ['Production units,', 'not lab samples.'],
  body: [
    'I work where customer-specific server and industrial PC platforms are integrated, configured, and validated in batches before they ship. At Axiomtek-US I lead technician work on the Netscout production line — Red Hat Linux-based platforms built for network monitoring deployments.',
    'The job is to make every unit match its approved baseline — BOM revision, BIOS and BMC settings, firmware, RAID layout, customer image — and to prove it with evidence tied to a serial number and a work order.',
    'Off shift, I run a multi-server home lab where I try automation ideas before they go near a production unit, and prepare for the RHCSA.',
  ],
  spec: [
    ['Name', 'Armando R. Taveras'],
    ['Role', 'Lead Technician · Validation & Integration'],
    ['Employer', 'Axiomtek-US'],
    ['Program', 'Netscout production line'],
    ['In Service Since', 'March 2024'],
    ['Location', 'Methuen, MA'],
    ['Platforms', 'Servers · Industrial PCs'],
    ['Typical Batch', '20–100 units'],
    ['Cert Track', 'RHCSA (in preparation)'],
    ['Status', 'ACTIVE'],
  ] as [string, string][],
};

export const CAPABILITIES = [
  {
    k: 'TM',
    title: 'Test method design',
    body: 'Repeatable tests with objective pass/fail criteria, sized to the per-unit time budget and executable by any technician without judgment calls. Detection, configuration, functional, burn-in and final acceptance kept distinct.',
    tags: ['Objective pass/fail', 'Batch-scale', 'Automatable'],
  },
  {
    k: 'FA',
    title: 'Failure analysis & RMA triage',
    body: 'Hypothesis-driven isolation across hardware, firmware, configuration, OS, scripts, fixtures and shared services — compared against a known-good unit, the approved baseline, and the rest of the batch.',
    tags: ['Known-good compare', 'Swap tests', 'Root cause'],
  },
  {
    k: 'FW',
    title: 'Firmware & configuration control',
    body: 'BIOS, BMC, controller and drive firmware held to the customer baseline. Every change proven on one controlled unit, before-state captured, reboot persistence confirmed — then, and only then, scaled.',
    tags: ['Baseline', 'Change control', 'Persistence'],
  },
  {
    k: 'QD',
    title: 'Controlled documentation',
    body: 'SOPs, work instructions, forms and validation records for a controlled QMS — written so two qualified technicians following them independently produce the same result.',
    tags: ['SOP / WI', 'Revision control', 'QMS'],
  },
  {
    k: 'AU',
    title: 'Production automation',
    body: 'Non-interactive Bash, PowerShell and Python tooling over IPMI, Redfish, SSH and storage utilities — clear exit codes, logs keyed by serial number, and safe behavior on the next 36 units, not only this one.',
    tags: ['Exit codes', 'Idempotent', 'Traceable logs'],
  },
  {
    k: 'ES',
    title: 'Escalation writing',
    body: 'Finding-first escalations to R&D, Quality, vendors and customer program managers: impact, confirmed facts vs. hypotheses, the evidence, what was already tested — and a specific ask.',
    tags: ['Finding first', 'Evidence', 'Clear ask'],
  },
];

export const LINE = [
  { n: '01', title: 'Incoming & BOM', body: 'Components checked against the approved BOM revision before they reach a build.', evidence: 'BOM rev · part S/N' },
  { n: '02', title: 'Integration', body: 'Assembly of the customer-specific server or IPC configuration.', evidence: 'Build traveler' },
  { n: '03', title: 'Baseline', body: 'BIOS, BMC and firmware compared field-by-field against the customer baseline.', evidence: 'FW inventory · config export' },
  { n: '04', title: 'Storage', body: 'Controllers, arrays and drives verified — StorCLI, smartctl, NVMe tooling.', evidence: 'Array config · SMART' },
  { n: '05', title: 'Imaging', body: 'PXE / Clonezilla deployment of the approved customer image.', evidence: 'Image version' },
  { n: '06', title: 'Burn-in & functional', body: 'Fixed-duration stress and functional test with objective limits.', evidence: 'Test logs' },
  { n: '07', title: 'Electrical safety', body: 'Hipot and ground-bond testing on every unit.', evidence: 'Hipot / GB log' },
  { n: '08', title: 'Final acceptance', body: 'Pass/fail recorded by serial number, work order and date — then it ships.', evidence: 'Validation record' },
];

export const WORK = [
  {
    id: 'rack',
    kicker: 'Infrastructure · Project lead',
    title: 'Test rack expansion',
    stat: { from: '15', to: '35', unit: 'units under test, concurrently' },
    body: 'Led the expansion of the production test rack from 15 to 35 servers tested at the same time — procurement, installation, cabling, configuration and integration with the existing test infrastructure. More than doubled testing throughput.',
    tags: ['Capacity planning', 'Rack integration', 'Cabling', 'Throughput'],
  },
  {
    id: 'scripts',
    kicker: 'Automation · Bash',
    title: 'Hardware detection & config scripts',
    stat: { from: '', to: '~30', unit: 'min saved per server' },
    body: 'Production Bash scripts that detect NICs and verify PCI slot population, and that apply network configuration changes in place of manual BIOS edits — removing a slow, error-prone manual step from every unit.',
    tags: ['Bash', 'PCI detection', 'NIC config', 'Process automation'],
  },
  {
    id: 'records',
    kicker: 'Quality · Traceability',
    title: 'Test-record automation',
    stat: { from: 'XLSX', to: 'PDF', unit: 'into the controlled form' },
    body: 'Hipot and ground-bond results moved from production spreadsheets into the controlled test-log form automatically — same approved record format, no hand transcription between the tester and the record.',
    tags: ['Hipot / ground bond', 'Controlled forms', 'Data integrity'],
  },
  {
    id: 'sop',
    kicker: 'Documentation · QMS',
    title: 'Production SOP library',
    stat: { from: '', to: 'SOP', unit: 'builds · BIOS · imaging · test · pack' },
    body: 'Standard operating procedures for server builds, hardware integration, BIOS setup, imaging, testing and packaging — written to the company’s controlled template, with stop and escalation conditions spelled out.',
    tags: ['Work instructions', 'Revision history', 'Technician-ready'],
  },
  {
    id: 'lab',
    kicker: 'Home lab · R&D',
    title: 'Multi-server home lab',
    stat: { from: '', to: 'RHEL', unit: 'KVM · containers · Ansible' },
    body: 'A multi-server lab for virtualization, containers and networking — where automation ideas get broken on purpose before they go anywhere near a production unit. Also the proving ground for RHCSA prep.',
    tags: ['RHEL / Rocky', 'KVM/QEMU', 'Podman · Docker', 'Ansible'],
  },
];

export const EVIDENCE = {
  title: 'Never ship a hypothesis.',
  lede: 'Every conclusion carries a label. Mixing them up is how good units get scrapped and bad ones get shipped.',
  classes: [
    { k: 'CONFIRMED', color: 'ok', body: 'Directly observed: tool output, test logs, BIOS/BMC screens, firmware inventory, physical inspection, reproducible behavior.' },
    { k: 'HYPOTHESIS', color: 'warn', body: 'Plausible, not proven. Paired with the exact observation that would confirm it — and the one that would disprove it.' },
    { k: 'REPORTED', color: 'info', body: 'Stated by a customer, vendor, engineer or technician. Valuable — and unverified until it has been tested.' },
  ],
  layers: [
    'Operator process & documentation',
    'Shared services — DHCP · PXE · NAS',
    'Fixture · cable · console · peripheral',
    'Test script & automation logic',
    'OS · kernel · driver · application',
    'Configuration & manufacturing baseline',
    'Firmware — BIOS · BMC · CPLD · controller · drive',
    'Hardware & assembly',
  ],
};

export const TOOLCHAIN = [
  { group: 'Platform management', items: ['BIOS / UEFI', 'BMC', 'IPMI · ipmitool', 'Redfish', 'KVM over IP', 'Firmware updates'] },
  { group: 'Provisioning', items: ['PXE boot', 'DHCP provisioning', 'Clonezilla', 'VLANs', 'SSH key auth', 'Secure transfer'] },
  { group: 'Storage', items: ['StorCLI', 'MegaCLI', 'RAID', 'Broadcom controllers', 'smartctl', 'NVMe tooling'] },
  { group: 'Scripting', items: ['Bash', 'PowerShell', 'Python', 'Selenium', 'Git', 'Ansible'] },
  { group: 'Test & diagnostics', items: ['Burn-in', 'PassMark', 'memtest86', 'ATE', 'Hipot · ground bond', 'Disk benchmarking'] },
  { group: 'Operating systems', items: ['RHEL', 'Rocky Linux', 'CentOS', 'Fedora', 'Ubuntu · Debian', 'Windows'] },
  { group: 'Linux administration', items: ['systemd', 'SELinux', 'firewalld', 'dnf · yum · apt', 'Users & permissions', 'Log analysis'] },
  { group: 'Virtualization', items: ['KVM/QEMU', 'VMware ESXi', 'Hyper-V', 'Podman', 'Docker', 'VirtualBox'] },
  { group: 'Hardware', items: ['Supermicro', 'Dell', 'HP enterprise', 'Industrial PCs', 'NIC / PCIe', 'Server assembly'] },
  { group: 'Enterprise', items: ['SAP ERP', 'Salesforce', 'Nagios', 'Zabbix', 'Grafana', 'Controlled QMS'] },
];
