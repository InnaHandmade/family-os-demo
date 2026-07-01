// ─── Fictional demo data — all names, numbers, addresses are invented ──────────

export const SEED_FAMILY = [
  { id: 'anna',  name: 'Anna',  role: 'Admin',  emoji: '👩', countries: ['UA', 'PL', 'UK'] },
  { id: 'max',   name: 'Max',   role: 'Member', emoji: '👦', countries: ['UA', 'PL'] },
  { id: 'leo',   name: 'Leo',   role: 'Member', emoji: '👦', countries: ['UA', 'TR'] },
  { id: 'helen', name: 'Helen', role: 'Member', emoji: '👵', countries: ['UA', 'UZ'] },
  { id: 'mark',  name: 'Mark',  role: 'Member', emoji: '👨', countries: ['PL', 'UK', 'GE'] },
]

export const SEED_DOCS = [
  // Anna
  { person: 'Anna', country: 'UA', type: 'Passport',          docNumber: 'FH123456', issueDate: '2020-03-15', expires: '2030-03-15', note: 'Biometric' },
  { person: 'Anna', country: 'PL', type: 'Residence Permit',  docNumber: 'KR/2021/00441', issueDate: '2021-06-01', expires: '2025-06-01', note: 'Karta Pobytu' },
  { person: 'Anna', country: 'UK', type: 'Visa',              docNumber: 'GBR-2022-7731', issueDate: '2022-09-10', expires: '2024-09-10', note: 'Tourist' },
  { person: 'Anna', country: 'UA', type: 'Tax ID',            docNumber: '3456789012', issueDate: '2015-01-20', expires: '', note: '' },

  // Max
  { person: 'Max',  country: 'UA', type: 'Passport',         docNumber: 'FH987654', issueDate: '2022-07-01', expires: '2027-07-01', note: 'Biometric' },
  { person: 'Max',  country: 'PL', type: 'Residence Permit', docNumber: 'KR/2023/01122', issueDate: '2023-04-15', expires: '2026-04-15', note: 'Karta Pobytu — dziecko' },
  { person: 'Max',  country: 'UA', type: 'Birth Certificate', docNumber: 'UA-2014-KH-8801', issueDate: '2014-02-28', expires: '', note: '' },

  // Leo
  { person: 'Leo',  country: 'UA', type: 'Passport',         docNumber: 'FH543210', issueDate: '2023-01-10', expires: '2028-01-10', note: 'Biometric' },
  { person: 'Leo',  country: 'TR', type: 'Residence Permit', docNumber: 'TR-IST-2023-009871', issueDate: '2023-08-20', expires: '2025-08-20', note: 'İkamet İzni' },
  { person: 'Leo',  country: 'TR', type: 'Health Insurance', docNumber: 'SGK-LEO-44112', issueDate: '2023-09-01', expires: '2026-09-01', note: 'SGK' },

  // Helen
  { person: 'Helen', country: 'UA', type: 'Passport',         docNumber: 'EH001122', issueDate: '2018-05-05', expires: '2026-05-05', note: '' },
  { person: 'Helen', country: 'UZ', type: 'Visa',             docNumber: 'UZB-2024-0012', issueDate: '2024-01-15', expires: '2026-07-15', note: 'e-Visa multiple' },

  // Mark
  { person: 'Mark', country: 'PL', type: 'Passport',          docNumber: 'PL88774455', issueDate: '2019-11-20', expires: '2029-11-20', note: '' },
  { person: 'Mark', country: 'UK', type: 'Residence Permit',  docNumber: 'UK-BRP-2021-55678', issueDate: '2021-03-01', expires: '2026-03-01', note: 'BRP Card' },
  { person: 'Mark', country: 'GE', type: 'Visa',              docNumber: 'GEO-2024-FREE', issueDate: '2024-06-01', expires: '2025-12-01', note: 'Visa-free 1 year' },
  { person: 'Mark', country: 'PL', type: 'Driving License',   docNumber: 'PL-DL-2017-334455', issueDate: '2017-06-15', expires: '2037-06-15', note: 'Category B' },
]

export const SEED_MEDICAL = [
  // Anna
  { person: 'Anna', country: 'PL', type: 'Doctor Visit',    date: '2024-11-12', title: 'Терапевт — плановый осмотр',     institution: 'Centrum Medyczne Krakow', doctor: 'Dr. Kowalski', description: 'Плановый осмотр. Давление 120/80.', result: 'Здорова', nextDate: '2025-11-12', note: '' },
  { person: 'Anna', country: 'PL', type: 'Test/Analysis',   date: '2024-11-12', title: 'Общий анализ крови + биохимия',   institution: 'Centrum Medyczne Krakow', doctor: '', description: 'Сданы в рамках планового осмотра', result: 'В норме', nextDate: '', note: '' },
  { person: 'Anna', country: 'UK', type: 'Doctor Visit',    date: '2023-04-20', title: 'GP первичный приём',              institution: 'Paddington NHS Practice', doctor: 'Dr. Smith', description: 'Регистрация у врача общей практики', result: 'Зарегистрирована', nextDate: '', note: '' },
  { person: 'Anna', country: 'UA', type: 'Vaccination',     date: '2021-09-05', title: 'COVID-19 — Pfizer доза 1',        institution: 'МЦ Здоровья Харків', doctor: '', description: '', result: 'Введена', nextDate: '2021-09-26', note: '' },
  { person: 'Anna', country: 'UA', type: 'Vaccination',     date: '2021-09-26', title: 'COVID-19 — Pfizer доза 2',        institution: 'МЦ Здоровья Харків', doctor: '', description: '', result: 'Введена', nextDate: '', note: '' },

  // Max
  { person: 'Max',  country: 'PL', type: 'Doctor Visit',    date: '2025-01-08', title: 'Педиатр — ОРВИ',                 institution: 'Przychodnia Dziecięca PL', doctor: 'Dr. Wiśniewska', description: 'Температура 38.2, горло красное', result: 'Амоксициллин 5 дней', nextDate: '2025-01-20', note: '' },
  { person: 'Max',  country: 'UA', type: 'Vaccination',     date: '2022-03-10', title: 'MMR (корь, паротит, краснуха)',   institution: 'ДКЛ №5 Харків', doctor: '', description: '', result: 'Введена', nextDate: '', note: 'Ревакцинация в 6 лет' },
  { person: 'Max',  country: 'PL', type: 'Diagnosis',       date: '2024-03-15', title: 'Аллергия — диагноз',             institution: 'Alergolog Krakow', doctor: 'Dr. Nowak', description: 'Аллергия на пыльцу деревьев и трав', result: 'Цетрин по сезону', nextDate: '2025-04-01', note: '' },

  // Leo
  { person: 'Leo',  country: 'UA', type: 'Surgery/Procedure', date: '2020-08-14', title: 'Аппендэктомия',               institution: 'ДКЛ №5 Харків', doctor: 'Dr. Мельник', description: 'Плановое удаление аппендикса', result: 'Успешно, без осложнений', nextDate: '', note: '' },
  { person: 'Leo',  country: 'TR', type: 'Doctor Visit',    date: '2024-06-22', title: 'Осмотр после переезда в Стамбул', institution: 'Acıbadem Hospital', doctor: 'Dr. Yilmaz', description: 'Плановый осмотр', result: 'Здоров', nextDate: '2025-06-22', note: '' },
  { person: 'Leo',  country: 'TR', type: 'Test/Analysis',   date: '2024-06-22', title: 'Анализ крови + УЗИ брюшной полости', institution: 'Acıbadem Hospital', doctor: '', description: 'Контроль после аппендэктомии (5 лет)', result: 'Норма', nextDate: '', note: '' },

  // Helen
  { person: 'Helen', country: 'UA', type: 'Prescription',   date: '2024-02-01', title: 'Метформин — диабет 2 типа',      institution: 'МЦ Надія Харків', doctor: 'Dr. Іваненко', description: 'Регулярный приём. 500мг 2р/день.', result: '', nextDate: '2025-02-01', note: 'Контроль глюкозы каждые 3 мес' },
  { person: 'Helen', country: 'UA', type: 'Screening',      date: '2024-05-10', title: 'Кардиограмма + давление',         institution: 'Кардіоцентр Харків', doctor: 'Dr. Петренко', description: 'Плановый кардиоконтроль', result: 'Ритм синусовый. АД 135/85', nextDate: '2025-05-10', note: '' },
  { person: 'Helen', country: 'UZ', type: 'Doctor Visit',   date: '2024-09-14', title: 'Местный врач в Ташкенте',         institution: 'Медцентр Шифо', doctor: 'Dr. Karimov', description: 'Обострение суставов', result: 'Диклофенак курс 10 дней', nextDate: '', note: '' },

  // Mark
  { person: 'Mark', country: 'UK', type: 'Doctor Visit',    date: '2024-08-30', title: 'NHS — боль в спине',             institution: 'Paddington NHS', doctor: 'Dr. Williams', description: 'Поясничный радикулит', result: 'Физиотерапия 6 сессий + ибупрофен', nextDate: '2025-02-28', note: '' },
  { person: 'Mark', country: 'GE', type: 'Doctor Visit',    date: '2025-02-10', title: 'Стоматолог — Тбилиси',           institution: 'Dental Art Tbilisi', doctor: 'Dr. Beridze', description: 'Чистка + пломба зуб 36', result: 'Выполнено', nextDate: '2025-08-10', note: 'Дешевле чем в PL' },
]

export const SEED_EDUCATION = [
  // Max
  { person: 'Max',  country: 'PL', type: 'School',          institution: 'Szkoła Podstawowa nr 12', program: 'Начальная школа (класс 3)', dateFrom: '2022-09-01', dateTo: '2023-06-20', status: 'Completed', result: 'Отлично', certNumber: '', note: 'Перешёл в 4-й класс' },
  { person: 'Max',  country: 'PL', type: 'School',          institution: 'Szkoła Podstawowa nr 12', program: 'Начальная школа (класс 4)', dateFrom: '2023-09-01', dateTo: '', status: 'In Progress', result: '', certNumber: '', note: '' },
  { person: 'Max',  country: 'PL', type: 'Tutoring',        institution: 'Частный репетитор', program: 'Польский язык — интеграция', dateFrom: '2021-10-01', dateTo: '2022-06-30', status: 'Completed', result: 'Уровень A2', certNumber: '', note: '' },

  // Leo
  { person: 'Leo',  country: 'UA', type: 'School',          institution: 'Харківська гімназія №14', program: 'Старша школа (10 клас)', dateFrom: '2022-09-01', dateTo: '2023-05-31', status: 'Completed', result: 'Атестат', certNumber: 'UA-ATST-2023-44112', note: '' },
  { person: 'Leo',  country: 'TR', type: 'Language Course', institution: 'Tömer Istanbul', program: 'Турецкий язык — начальный', dateFrom: '2023-09-15', dateTo: '2024-01-31', status: 'Completed', result: 'A1', certNumber: 'TK-TOMER-2024-0098', note: '' },
  { person: 'Leo',  country: 'TR', type: 'Online Course',   institution: 'Coursera', program: 'Introduction to Computer Science (Harvard CS50)', dateFrom: '2024-02-01', dateTo: '', status: 'In Progress', result: '', certNumber: '', note: 'На паузе' },

  // Anna
  { person: 'Anna', country: 'UA', type: 'University',      institution: 'Харківський Національний Університет', program: 'Менеджмент — бакалавр', dateFrom: '2007-09-01', dateTo: '2011-06-30', status: 'Completed', result: 'Диплом', certNumber: 'UA-HNU-2011-3310', note: '' },
  { person: 'Anna', country: 'PL', type: 'Language Course', institution: 'Szkoła Językowa Glossa', program: 'Polish B1 → B2', dateFrom: '2021-09-01', dateTo: '2022-03-31', status: 'Completed', result: 'B2', certNumber: 'PL-GLOSSA-2022-0055', note: '' },
  { person: 'Anna', country: 'UK', type: 'Certificate Program', institution: 'Coursera / Google', program: 'Google Project Management Certificate', dateFrom: '2023-01-10', dateTo: '2023-04-30', status: 'Completed', result: 'Certificate', certNumber: 'GGL-PM-2023-7712', note: '' },

  // Mark
  { person: 'Mark', country: 'PL', type: 'University',      institution: 'Akademia Górniczo-Hutnicza', program: 'Informatyka — inżynier', dateFrom: '2005-10-01', dateTo: '2010-06-30', status: 'Completed', result: 'Inżynier', certNumber: 'AGH-INZ-2010-2255', note: '' },
  { person: 'Mark', country: 'UK', type: 'Certificate Program', institution: 'AWS Training', program: 'AWS Solutions Architect Associate', dateFrom: '2024-03-01', dateTo: '2024-05-15', status: 'Completed', result: 'Passed', certNumber: 'AWS-SAA-2024-MK99', note: '' },
  { person: 'Mark', country: 'GE', type: 'Language Course', institution: 'Самостоятельно', program: 'Грузинский язык — базовый', dateFrom: '2025-01-01', dateTo: '', status: 'In Progress', result: '', certNumber: '', note: 'Duolingo + YouTube' },
]

export const SEED_COMPANIES = [
  { name: 'NovaTech Solutions sp. z o.o.', country: 'PL', type: 'LLC', reg: 'KRS 0000712345', status: 'Active',   founded: '2020-03-10', note: 'Основная операционная компания' },
  { name: 'DigitalFlow Ltd.',              country: 'UK', type: 'LTD', reg: 'CH 13445677',    status: 'Active',   founded: '2021-07-22', note: 'Для UK-клиентов' },
  { name: 'ClearMind FZE',                country: 'GE', type: 'FZE', reg: 'GEO-FZE-20244',  status: 'Active',   founded: '2024-02-01', note: 'Грузия — льготное налогообложение' },
]

export const SEED_CONTRACTS = [
  { company: 'NovaTech Solutions sp. z o.o.', client: 'RetailCore GmbH',      type: 'Service Agreement', status: 'Active',  from: '2024-01-01', until: '2025-12-31', amount: '48000', currency: 'EUR', note: 'Ежемесячные выплаты 4000 EUR' },
  { company: 'NovaTech Solutions sp. z o.o.', client: 'MediaGroup Sp. z o.o.', type: 'Development',       status: 'Active',  from: '2024-06-01', until: '2025-06-01', amount: '30000', currency: 'PLN', note: '' },
  { company: 'DigitalFlow Ltd.',              client: 'CloudFirst UK Ltd.',     type: 'Consulting',        status: 'Renewal', from: '2023-03-01', until: '2025-03-01', amount: '24000', currency: 'GBP', note: 'Переговоры по продлению' },
  { company: 'ClearMind FZE',                client: 'StartupX LLC',           type: 'Service Agreement', status: 'Active',  from: '2024-09-01', until: '2026-09-01', amount: '18000', currency: 'USD', note: '' },
]

export const SEED_INVOICES = [
  { id: 'NT-2025-001', date: '2025-01-31', company: 'NovaTech Solutions sp. z o.o.', client: 'RetailCore GmbH',       clientAddress: 'Frankfurter Allee 10, Berlin', clientReg: 'DE221234567', description: 'Software development services', periodFrom: '2025-01-01', periodTo: '2025-01-31', currency: 'EUR', amount: '4000.00', status: 'Paid' },
  { id: 'NT-2025-002', date: '2025-02-28', company: 'NovaTech Solutions sp. z o.o.', client: 'RetailCore GmbH',       clientAddress: 'Frankfurter Allee 10, Berlin', clientReg: 'DE221234567', description: 'Software development services', periodFrom: '2025-02-01', periodTo: '2025-02-28', currency: 'EUR', amount: '4000.00', status: 'Paid' },
  { id: 'NT-2025-003', date: '2025-03-31', company: 'NovaTech Solutions sp. z o.o.', client: 'RetailCore GmbH',       clientAddress: 'Frankfurter Allee 10, Berlin', clientReg: 'DE221234567', description: 'Software development services', periodFrom: '2025-03-01', periodTo: '2025-03-31', currency: 'EUR', amount: '4000.00', status: 'Pending' },
  { id: 'NT-2025-004', date: '2025-01-15', company: 'NovaTech Solutions sp. z o.o.', client: 'MediaGroup Sp. z o.o.', clientAddress: 'ul. Prosta 20, Warszawa',       clientReg: 'PL5261234567', description: 'Web platform development — etap I',  periodFrom: '2024-12-01', periodTo: '2024-12-31', currency: 'PLN', amount: '15000.00', status: 'Paid' },
  { id: 'DF-2025-001', date: '2025-01-10', company: 'DigitalFlow Ltd.',              client: 'CloudFirst UK Ltd.',     clientAddress: '22 Baker St, London',           clientReg: 'GB123456789', description: 'IT Consulting Q4 2024',               periodFrom: '2024-10-01', periodTo: '2024-12-31', currency: 'GBP', amount: '6000.00', status: 'Overdue' },
  { id: 'CM-2025-001', date: '2025-01-20', company: 'ClearMind FZE',                client: 'StartupX LLC',           clientAddress: '100 Main St, Austin TX',         clientReg: 'US-TX-12345',  description: 'Product consulting services Jan',      periodFrom: '2025-01-01', periodTo: '2025-01-31', currency: 'USD', amount: '1500.00', status: 'Paid' },
]

// Write all seed data to localStorage
export function loadSeedData() {
  const set = (key, val) => localStorage.setItem(key, JSON.stringify(val))
  set('family-members', SEED_FAMILY)
  set('country-docs-v2', SEED_DOCS)
  set('medical-v1', SEED_MEDICAL)
  set('education-v1', SEED_EDUCATION)
  set('biz-companies', SEED_COMPANIES)
  set('biz-contracts', SEED_CONTRACTS)
  set('biz-invoices', SEED_INVOICES)
}

// Export all localStorage data as JSON blob
export function exportAllData() {
  const keys = ['family-members', 'country-docs-v2', 'medical-v1', 'education-v1', 'biz-companies', 'biz-contracts', 'biz-invoices']
  const snapshot = {}
  keys.forEach(k => {
    try { snapshot[k] = JSON.parse(localStorage.getItem(k) ?? 'null') } catch { snapshot[k] = null }
  })
  const json = JSON.stringify(snapshot, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `family-os-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Import data from JSON file (returns a Promise)
export function importAllData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result)
        Object.entries(data).forEach(([k, v]) => {
          if (v !== null) localStorage.setItem(k, JSON.stringify(v))
        })
        resolve()
      } catch {
        reject(new Error('Неверный формат файла'))
      }
    }
    reader.onerror = () => reject(new Error('Ошибка чтения файла'))
    reader.readAsText(file)
  })
}
