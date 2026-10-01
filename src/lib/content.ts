// All site copy lives here so it can be revised in one place.
//
// PUBLIC SITE — confidentiality rules:
// no customer names (describe by industry), no part / serial / work-order / BOM / SOP / ECO /
// deviation numbers, no IPs, paths, credentials, customer firmware versions, coworker names,
// and no exact metrics unless approved for public disclosure.

export const SECTIONS = [
  { id: 'hero', label: 'Boot', code: 'A0' },
  { id: 'profile', label: 'Profile', code: 'A1' },
  { id: 'capabilities', label: 'What I do', code: 'A2' },
  { id: 'line', label: 'Method', code: 'A3' },
  { id: 'work', label: 'Work', code: 'A4' },
  { id: 'evidence', label: 'Evidence', code: 'A5' },
  { id: 'toolchain', label: 'Toolchain', code: 'A6' },
  { id: 'lab', label: 'Lab', code: 'A7' },
  { id: 'contact', label: 'Contact', code: 'A8' },
] as const;

export const PERSON = {
  name: 'Armando R. Taveras',
  first: 'ARMANDO',
  last: 'R. TAVERAS',
  role: 'Operations Specialist',
  track: 'Production Engineer · in training',
  // Employer kept generic until approved for public use.
  employer: 'U.S. industrial-computing & embedded-systems manufacturer',
  employerShort: 'Industrial computing OEM',
  location: 'Methuen, MA',
  email: 'armandotaverash@gmail.com',
  phone: '(475) 455-1065',
  // Set to '/resume.pdf' once a real PDF is placed in /public; links stay hidden until then.
  resume: '' as string,
};

export const HERO = {
  eyebrow: 'Operations Specialist · Production Engineer in training',
  headline: 'I build, troubleshoot, and automate the systems behind production hardware.',
  lede: 'Linux infrastructure, server hardware, firmware, validation automation and failure analysis — from a single engineering sample to production-scale batches.',
};

export const PROFILE = {
  title: ['From the motherboard', 'upward.'],
  body: [
    'I started on the line as a production technician, building and testing Linux-based enterprise servers. The work kept moving upstream: troubleshooting the units that wouldn’t pass, then designing the validation, then automating it, then improving the systems around production itself.',
    'Today I sit between production, engineering, quality and customers. I usually get involved when a system fails intermittently, drifts from its approved baseline, needs a production-safe workaround, or has to scale from one engineering sample to a full batch — and I turn engineering intent into something technicians can execute the same way every time.',
    'Before technology I earned a graduate law degree with high distinction and practiced corporate, civil and real-estate law for about five years in the Dominican Republic. The habits carried over: evidence before conclusions, precise writing, and procedures that mean exactly one thing.',
  ],
  spec: [
    ['Name', 'Armando R. Taveras'],
    ['Role', 'Operations Specialist'],
    ['Track', 'Production Engineer (in training)'],
    ['Industry', 'Industrial computing · embedded · edge AI'],
    ['Platforms', 'Servers · IPCs · Edge-AI · GPU · racks'],
    ['Stack', 'Hardware → firmware → Linux → network'],
    ['Location', 'Methuen, MA'],
    ['Cert Track', 'RHCSA (in preparation)'],
    ['Direction', 'Infra automation → software → AI'],
    ['Status', 'ACTIVE'],
  ] as [string, string][],
  path: [
    { stage: 'Started', title: 'Production technician', body: 'Built Linux servers: hardware install, BIOS, firmware, RAID, OS deployment, production test, final validation.' },
    { stage: 'Then', title: 'Technical owner', body: 'Primary technician on major server programs. Difficult failures, direct work with engineering, SOP updates, NPI support.' },
    { stage: 'Now', title: 'Operations Specialist', body: 'Failure analysis, validation design, production automation, platform migrations, rack integration, controlled documentation, customer-facing technical work.' },
    { stage: 'Direction', title: 'Automation → software → AI', body: 'Extending the same systems foundation into infrastructure automation, software and AI infrastructure.' },
  ],
};

export const CAPABILITIES = [
  {
    k: 'FA',
    title: 'Failure analysis & RMA',
    body: 'Shrinking the failure domain until the evidence supports a conclusion — across hardware, firmware, OS, network, test software and process. Compared against known-good units and the rest of the batch.',
    tags: ['Reproduction', 'Known-good compare', 'RMA boundaries'],
  },
  {
    k: 'VA',
    title: 'Validation automation',
    body: 'Technician enters a serial number; automation discovers the system, verifies configuration, runs the tests, records evidence and returns a clear PASS / FAIL. No loose checklists of commands.',
    tags: ['Bash · Python · PowerShell', 'No false passes', 'Traceable'],
  },
  {
    k: 'FW',
    title: 'Platform & firmware',
    body: 'BIOS / UEFI, BMC, SMBIOS / DMI, RAID and drive firmware. Telling a real hardware failure apart from firmware variance, a BIOS setting, a script assumption, or a wrong baseline.',
    tags: ['BIOS / UEFI', 'BMC · Redfish', 'Baselines'],
  },
  {
    k: 'PE',
    title: 'The last mile to production',
    body: 'Engineering hands over a prototype, a workaround, a handwritten note or a partial test. I make it executable: testing, automation, error handling, escalation criteria, controlled release.',
    tags: ['NPI', 'Containment', 'Production readiness'],
  },
  {
    k: 'QD',
    title: 'Controlled documentation',
    body: 'SOPs, work instructions, deviations and checklists written so a technician never has to infer which slot, which firmware state, which result is acceptable, or when to escalate.',
    tags: ['SOP / WI', 'Deviations', 'QMS'],
  },
  {
    k: 'TC',
    title: 'Technical communication',
    body: 'Moving between terminal-level debugging and clear write-ups for engineering leadership and customers: symptoms, reproduction results, evidence, coverage, recovery plans and limits.',
    tags: ['Customers', 'R&D · Quality', 'Evidence packages'],
  },
];

/** Evidence-first workflow — the method behind every case study. */
export const LINE = [
  { n: '01', title: 'Reproduce', body: 'Make the reported behavior happen on demand — on more than one unit.', evidence: 'Reproduction conditions' },
  { n: '02', title: 'Baseline', body: 'Establish what known-good looks like: hardware, firmware, configuration, image.', evidence: 'Known-good reference' },
  { n: '03', title: 'Reduce variables', body: 'Change one thing at a time. Separate hardware, firmware, OS, network, tooling and process.', evidence: 'Controlled test matrix' },
  { n: '04', title: 'Compare', body: 'Passing vs. failing systems, side by side, at the layer that actually matters.', evidence: 'Diff of pass / fail' },
  { n: '05', title: 'Collect evidence', body: 'Machine-readable where possible. Known facts kept apart from suspicions.', evidence: 'Logs · telemetry · JSON' },
  { n: '06', title: 'Escalate evidence', body: 'Hand engineering data, not speculation. Build containment if production must continue.', evidence: 'Evidence package' },
  { n: '07', title: 'Make it repeatable', body: 'Convert the fix into a process — scripted where it can be — and prove another technician can run it.', evidence: 'Script · checklist' },
  { n: '08', title: 'Control it', body: 'Release it under controlled documentation so it stays the way it was proven.', evidence: 'Controlled SOP' },
];

export type CaseStudy = {
  id: string;
  kicker: string;
  title: string;
  theme: string;
  stat: { from: string; to: string; unit: string };
  summary: string;
  problem: string;
  constraints: string[];
  did: string[];
  outcome: string;
  credit?: string;
  commands?: string[];
  takeaway: string;
  tags: string[];
};

export const WORK: CaseStudy[] = [
  {
    id: 'power',
    kicker: 'Robotics · Fanless industrial PCs',
    title: 'Intermittent shutdown under burn-in',
    theme: 'Reproduction → evidence → containment → controlled recovery',
    stat: { from: '', to: 'FA', unit: 'from failure to controlled recovery' },
    summary: 'A production batch of passively cooled industrial PCs began shutting down during extended stress testing — and could stay unresponsive for minutes before recovering.',
    problem: 'Units that looked healthy shut down mid burn-in, then stayed dead for several minutes. Systems that pass at first and fail later are the worst kind to ship.',
    constraints: ['Intermittent', 'Production-scale batch', 'Units appear healthy initially'],
    did: [
      'Reproduced the failure across multiple systems and built a controlled test matrix: fixed workloads, controlled power conditions, different burn-in software versions, thermal monitoring.',
      'Ruled out CPU overheating as the primary explanation.',
      'Executed the component-removal experiment provided by engineering and produced the evidence that modified units no longer reproduced the shutdown.',
      'Turned the finding into a controlled recovery: every affected unit accounted for, rework flow, re-entry into test, the deviation, required inspections, extended burn-in, extra engineering verification and a QA / rework checklist.',
    ],
    outcome: 'Production recovered through a documented, inspected rework path instead of ad-hoc fixes.',
    credit: 'Root cause was traced by R&D to a component-level issue tied to an upstream supplier change. My part was reproduction, the validation evidence and the production recovery.',
    takeaway: 'An engineering finding is not a fix until production has a controlled way to execute it.',
    tags: ['Burn-in', 'Thermal', 'Deviation', 'Rework flow'],
  },
  {
    id: 'edgeai',
    kicker: 'Edge AI · Embedded Linux',
    title: 'Technician-safe edge-AI validation',
    theme: 'Engineering procedure → automated, technician-safe test system',
    stat: { from: '', to: 'R/O', unit: 'customer image left unchanged' },
    summary: 'An edge-AI compute platform needed repeatable production validation without installing anything on, or permanently changing, the customer image.',
    problem: 'The validation existed as an engineering procedure. Production needed it repeatable, fast and auditable — on an image that had to stay untouched.',
    constraints: ['No package installs', 'Customer image stays unchanged', 'Read-only inspection', 'Remote execution'],
    did: [
      'Built a Windows-controlled workflow: PowerShell front end, SSH, remote Bash, BMC / Redfish and iperf3, with structured log collection.',
      'Covered system identity, CPU, memory, storage, USB, each Ethernet interface independently, throughput and platform configuration.',
      'After a gap analysis, refactored it to remove false-pass and ambiguous result states, add explicit hard checks, keep results immutable per stage and improve logging.',
      'Logs keyed to unit identifiers and stored on company infrastructure.',
    ],
    outcome: 'Technicians run one controlled front end; the system executes and records the validation remotely.',
    commands: ['ssh unit "cat /proc/device-tree/model; nproc; free -m"', 'iperf3 -c <test-server> -B <iface-ip> -t 30 -J', 'curl -s https://<bmc>/redfish/v1/Systems/1 | jq .'],
    takeaway: 'The dangerous result in an automated test is a false pass. Design the result states first.',
    tags: ['PowerShell', 'SSH', 'Redfish', 'iperf3'],
  },
  {
    id: 'ssd',
    kicker: 'Warehouse automation · Fleet storage',
    title: 'SSD wear telemetry for proactive replacement',
    theme: 'Raw hardware telemetry → structured dataset → engineering decision',
    stat: { from: 'SMART', to: 'HTML', unit: 'telemetry to decision report' },
    summary: 'A fleet of industrial systems raised concerns about SSD health and replacement timing. The available data had to become something engineering could act on.',
    problem: 'Drive health questions on fielded systems, with no clean, comparable dataset to decide when to replace drives.',
    constraints: ['Customer OS must not be modified', 'Vendor SMART tool unavailable in the environment'],
    did: [
      'Built a repeatable collection workflow from a bootable Linux rescue environment.',
      'Compiled the drive vendor’s open-source SMART utility into a portable binary that runs without touching the installed OS.',
      'Parsed, normalized and compared the telemetry in Python, with visualizations to support threshold analysis.',
      'Delivered the results as an HTML report engineering and stakeholders could review.',
    ],
    outcome: 'A data-driven basis for proactive drive replacement instead of waiting for field failures.',
    commands: ['smartctl -x --json /dev/sdX', 'python3 parse_smart.py runs/*.json --out report.html'],
    takeaway: 'Telemetry is only useful once it is normalized enough to compare.',
    tags: ['SMART', 'Linux rescue env', 'Python', 'Data viz'],
  },
  {
    id: 'rma',
    kicker: 'Medical-device OEM · Panel PC',
    title: 'Challenging the RMA failure boundary',
    theme: 'Using evidence to challenge an incorrect failure boundary',
    stat: { from: '', to: 'NTF', unit: 'explained, not repeated' },
    summary: 'A panel PC inside a medical system kept coming back because external data-acquisition hardware intermittently failed to appear at startup. Every returned PC passed at the factory.',
    problem: 'Repeated returns, repeated “no trouble found”. Each one treated as another defective computer.',
    constraints: ['Limited customer evidence', 'Failure only in the full console', 'Intermittent'],
    did: [
      'Reviewed the cross-swap history: when PCs moved between consoles, the failure did not consistently follow the PC.',
      'Showed the RMA method itself was structurally limited — if the trigger lives only in the complete console, testing the PC alone may never reproduce it.',
      'Reframed the investigation around boot timing, USB enumeration, power sequencing, DAQ initialization and startup races.',
      'Documented the system information needed to keep isolating it.',
    ],
    outcome: 'The investigation moved from “bad computer” to a console-level integration question with a defined next data set.',
    takeaway: 'Repeated no-trouble-found results can be expected, not contradictory — when the test boundary is wrong.',
    tags: ['RMA', 'USB enumeration', 'Power sequencing'],
  },
  {
    id: 'drives',
    kicker: 'Enterprise servers · Storage',
    title: 'Drive-install validation at production scale',
    theme: 'Engineering test requirements → scalable production execution',
    stat: { from: '', to: 'Live', unit: 'Linux env — no OS install needed' },
    summary: 'A server batch needed drives installed and validated while keeping per-unit time inside the production budget.',
    problem: 'A heavyweight OS install per unit just to check storage would have blown the time budget.',
    constraints: ['Per-unit time budget', 'Batch scale', 'Multiple controllers'],
    did: [
      'Designed a Linux live-environment validation instead of an OS install.',
      'Bash script: controller discovery, drive enumeration, expected-device verification, health checks and a clear result screen.',
      'On a related job, reconciled firmware strings that differed between RAID and SMART tools before anyone rejected valid drives, and cut runtime with parallel SMART reads and one bulk controller query.',
      'Folded the procedure into the existing controlled SOP rather than creating another document.',
    ],
    outcome: 'Validation completed inside the time budget, from one authoritative procedure.',
    commands: ['storcli /call show all J', 'lsblk -d -o NAME,MODEL,SERIAL,SIZE,TRAN', 'smartctl -H -i /dev/sdX & wait'],
    takeaway: 'Understand what layer a tool is reading before treating its output as truth.',
    tags: ['Bash', 'StorCLI', 'smartctl', 'SOP'],
  },
  {
    id: 'rack',
    kicker: 'Infrastructure · Rack integration',
    title: 'Rack-level integration & test capacity',
    theme: 'Treat the production test environment itself as infrastructure',
    stat: { from: '', to: '~35', unit: 'systems under test at once' },
    summary: 'Integrated racks of servers, GPU nodes, switches, firewalls, managed PDUs and UPSs — and redesigned the test environment when test capacity, not assembly, became the bottleneck.',
    problem: 'Long-duration validation — burn-in, multi-hour reboot loops, network and USB tests — was the critical path, and racks shipped as complete systems.',
    constraints: ['Power · network · PXE concurrency', 'Long tests', 'Mechanical & shipping'],
    did: [
      'Helped expand the test environment to roughly 35 concurrent systems: rack capacity, network, power, PXE and image concurrency, staging and failure isolation.',
      'Ran parallel test strategies so different rack sections run different workloads instead of waiting on one long test.',
      'On one rack, traced a misbehaving GPU system to configuration and power-delivery constraints rather than a bad GPU, and documented it for engineering.',
      'Requalified test stations after a facility move; supported a shipping corrective action on rail support and foam packaging.',
    ],
    outcome: 'More concurrent test capacity, and racks validated as systems — compute, network, power and logistics together.',
    takeaway: 'Optimize the whole production flow, not one workstation.',
    tags: ['GPU nodes', 'PDU · UPS', 'PXE', 'Requalification'],
  },
];

/** Short findings, written in the voice the work actually sounds like. */
export const FIELD_NOTES = [
  {
    k: 'RAID',
    t: 'Test software reported two RAID controller models across systems built to the same configuration. Before replacing hardware I compared PCI IDs and controller properties directly. The hardware matched; the variance was firmware. Escalated before any firmware action.',
  },
  {
    k: 'KVM',
    t: 'BMC reachable, remote KVM black. The BMC was fine — display-device priority in firmware was wrong. Changing it restored the console.',
  },
  {
    k: 'UEFI',
    t: 'RAID controller detected, but its configuration UI never appeared in BIOS Setup. Compared BIOS revisions, found a UEFI Shell path to the controller configuration, and escalated so the customer could get a BIOS-integrated workflow.',
  },
  {
    k: 'DMI',
    t: 'A production configuration issue left boards with wrong SMBIOS / DMI identity. Repaired the fields from a Linux rescue environment with the board vendor’s utility, validated it, and reused it across the affected boards — no replacements.',
  },
  {
    k: 'SOP',
    t: 'Received handwritten build notes after the original engineer had left. Turned them into a structured, technician-executable controlled SOP.',
  },
  {
    k: 'ARCH',
    t: 'A customer wanted a much smaller replacement for a server rack. Evaluated industrial PCs and 1U systems against GPU needs, BMC / IPMI availability, serviceability and power — smaller only counts if it stays manageable.',
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
    'Process — SOPs · RMA boundaries · traceability',
    'Infrastructure — PXE · DHCP · NAS · test servers',
    'Validation software — expected values · timing · parsing',
    'Fixture · cable · console · peripheral',
    'OS — drivers · enumeration · boot · services',
    'Configuration & manufacturing baseline',
    'Firmware — BIOS · BMC · NIC · RAID · drive',
    'Hardware & assembly',
  ],
};

export const TOOLCHAIN = [
  { group: 'Systems', items: ['Linux', 'Windows', 'Embedded Linux', 'NVIDIA Jetson / L4T', 'Industrial PCs', 'Enterprise servers', 'GPU systems'] },
  { group: 'Server management', items: ['BMC', 'IPMI · ipmitool', 'Redfish', 'Remote KVM', 'Virtual media'] },
  { group: 'Firmware', items: ['BIOS / UEFI', 'UEFI Shell', 'SMBIOS / DMI', 'BMC firmware', 'RAID firmware', 'Drive firmware'] },
  { group: 'Storage', items: ['SATA', 'SAS', 'NVMe', 'RAID', 'SMART', 'SED', 'StorCLI · MegaCLI'] },
  { group: 'Deployment', items: ['PXE', 'Clonezilla', 'Linux live / rescue', 'SystemRescue', 'Automated provisioning'] },
  { group: 'Automation', items: ['Bash', 'Python', 'PowerShell', 'SSH', 'Redfish APIs'] },
  { group: 'Testing', items: ['PassMark BurnInTest', 'stress-ng', 'stressapptest', 'fio', 'iperf3', 'Reboot / power-cycle loops'] },
  { group: 'Networking', items: ['Multi-NIC systems', 'Static IPv4', 'Wi-Fi', 'PXE networks', 'Management networks'] },
  { group: 'Engineering', items: ['Failure analysis', 'Root-cause isolation', 'Validation design', 'NPI', 'Production readiness', 'RMA analysis'] },
  { group: 'Process', items: ['SOP development', 'Controlled documentation', 'Deviations', 'Checklists', 'QMS workflows'] },
];

export const LAB = {
  title: ['Where it goes', 'next.'],
  lede: 'Systems first, then automation, then software and AI — each built on the last. AI systems still run on compute, Linux, networks, storage and reliable pipelines.',
  projects: [
    {
      k: 'TechOps',
      status: 'In progress · private',
      title: 'Server lifecycle platform',
      body: 'Infrastructure-as-code ideas applied to physical production servers: BMC discovery, Redfish, BIOS / BMC configuration, firmware and hardware inventory, serial and work-order association, test execution, result history and reporting — plus a stateless PXE Linux environment for stress and validation without touching installed systems.',
      goal: 'Goal: plug a server into the right networks and let the platform do most of the provisioning and verification.',
      tags: ['Redfish', 'PXE', 'Python', 'Ansible'],
    },
    {
      k: 'SOP-AI',
      status: 'Built',
      title: 'Structure-aware SOP generation',
      body: 'Not “ask an LLM to write an SOP”. The workflow is built on a structural analysis of an approved controlled document — down to its DOCX / XML — so generated procedures match the exact template, numbering, warnings and revision structure.',
      goal: 'LLMs treated as engineering tools, not chat windows.',
      tags: ['LLM workflows', 'DOCX / XML', 'Controlled docs'],
    },
    {
      k: 'Homelab',
      status: 'Ongoing',
      title: 'Homelab',
      body: 'Rocky Linux servers, containers, observability and local LLM experimentation — the place automation ideas get broken on purpose before they go near a production unit, and where RHCSA prep happens.',
      goal: 'Proving ground for infrastructure automation.',
      tags: ['Rocky Linux', 'Containers', 'Observability', 'Local LLMs'],
    },
  ],
  schema: `result.json
├── identity     serial · work order · timestamps
├── cpu
├── memory
├── storage      devices · SMART · firmware
├── network      per-interface · throughput
├── firmware     BIOS · BMC · controllers
└── tests
    ├── burn_in
    ├── storage
    └── network  → PASS | FAIL`,
};
