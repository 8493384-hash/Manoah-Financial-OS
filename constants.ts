import { Sparkles } from 'lucide-react';
import { AiInsight, ChargeToReview, FinancialItem } from './types';

export const RATES: Record<string, number> = { 
    ILS: 1, 
    USD: 3.75, 
    EUR: 4.10, 
    GBP: 4.80, 
    CHF: 4.20,
    CAD: 2.70,
    AUD: 2.45,
    JPY: 0.025,
    HUF: 0.01 
};

export const CURRENCIES = [
  { code: 'ILS', symbol: '₪', name: 'שקל חדש (ILS)' },
  { code: 'USD', symbol: '$', name: 'דולר ארה"ב (USD)' },
  { code: 'EUR', symbol: '€', name: 'אירו (EUR)' },
  { code: 'GBP', symbol: '£', name: 'לירה שטרלינג (GBP)' },
  { code: 'CHF', symbol: 'Fr', name: 'פרנק שוויצרי (CHF)' },
  { code: 'CAD', symbol: 'C$', name: 'דולר קנדי (CAD)' },
  { code: 'AUD', symbol: 'A$', name: 'דולר אוסטרלי (AUD)' },
  { code: 'JPY', symbol: '¥', name: 'ין יפני (JPY)' },
  { code: 'HUF', symbol: 'Ft', name: 'פורינט הונגרי (HUF)' },
  { code: 'UAH', symbol: '₴', name: 'הריבניה אוקראיני (UAH)' },
  { code: 'BTC', symbol: '₿', name: 'ביטקוין (BTC)' },
  { code: 'ETH', symbol: 'Ξ', name: 'את\'ריום (ETH)' }
];

export const INSTITUTIONAL_TYPES = ['בנק', 'אשראי', 'כרטיס אשראי', 'משכנתא'];
export const PRIVATE_TYPES = ['הלוואה פרטית', 'משפחה', 'חברים', 'אחר'];

export const DEFAULT_AI_INSIGHTS: AiInsight[] = [
  { type: 'info', text: 'המערכת מוכנה לניתוח נתונים. לחץ על כפתור "רענן ניתוח AI" לקבלת תובנות עדכניות.', icon: Sparkles, color: 'text-indigo-600 bg-indigo-50' },
];

export const INITIAL_RECEIVABLES: FinancialItem[] = [
  { id: 1, name: 'נטע וויס', amount: 4000, original_amount: 4000, currency: 'ILS', status: 'לא שולם', date: '2025-11-01', note: 'הלוואה חירום - העברה בנקאית', payments: [] },
  { id: 2, name: 'אחמד', amount: 37500, original_amount: 10000, currency: 'ILS', status: 'לא שולם', date: '2025-10-15', note: 'עסקה בדולרים (10,000$)', payments: [] },
  { id: 3, name: 'נטע וויס (כרטיס)', amount: 11400, original_amount: 11400, currency: 'ILS', status: 'לא שולם', date: '2025-11-03', note: 'חיוב כרטיס אשראי', payments: [] },
  { id: 4, name: 'עזרא קיפנו', amount: 10000, original_amount: 10000, currency: 'ILS', status: 'לא שולם', date: '2025-10-20', note: '', payments: [] },
  { id: 5, name: 'לנדא', amount: 240, original_amount: 240, currency: 'USD', status: 'ממתין', date: '2025-10-11', note: 'עזרה ברכבת (במקור 240$)', payments: [] },
  { id: 6, name: 'משה שפירא', amount: 1400, original_amount: 1400, currency: 'ILS', status: 'לא שולם', date: '2025-11-01', note: 'הפסד על כסף', payments: [] },
  { id: 7, name: 'פנחס פריד', amount: 200, original_amount: 200, currency: 'ILS', status: 'במחלוקת', date: '', note: 'משלוח מנות זינגר', payments: [] },
  { id: 8, name: 'יהודה דנציגר', amount: 11592, original_amount: 11592, currency: 'USD', status: 'לא שולם', date: '', note: 'חוב דולרי', payments: [] },
];

export const INITIAL_LIABILITIES: FinancialItem[] = [
  { id: 1, creditor: 'עזריאל בלוי', amount: 1610, original_amount: 1610, currency: 'ILS', type: 'הלוואה פרטית', date: '2025-11-15', charge_day: 15, status: 'לא שולם', payments: [] },
  { id: 2, creditor: 'משה שפירא', amount: 11592, original_amount: 11592, currency: 'USD', type: 'חברים', date: '', charge_day: 2, status: 'לא שולם', note: 'חוב כרטיס אשראי דולרי', payments: [] },
  { id: 3, creditor: 'אבא', amount: 2000, original_amount: 6000, currency: 'ILS', type: 'משפחה', date: '2025-02-11', charge_day: 11, status: 'שולם חלקית', payments: [{ id: 101, date: '2025-10-01', amount: 2000, currency: 'ILS', type: 'העברה', note: 'תשלום 1' }] },
  { id: 4, creditor: 'בנק פועלים (הלוואה)', bank_name: 'פועלים', loan_number: 'Bank Loan', amount: 54000, original_amount: 60000, currency: 'ILS', type: 'בנק', date: '', charge_day: 15, status: 'לא שולם', installments_total: 60, installments_paid: 12, monthly_payment: 2027, interest_type: 'פריים', payments: [] },
  { id: 5, creditor: 'בנק מזרחי (הלוואה)', bank_name: 'מזרחי', loan_number: 'Loan', amount: 27000, original_amount: 27000, currency: 'ILS', type: 'בנק', date: '2025-10-12', charge_day: 10, status: 'לא שולם', note: 'תשלום לאבא', monthly_payment: 27000, payments: [] },
  { id: 6, creditor: 'בנק פפר', bank_name: 'פפר', amount: 8000, original_amount: 8000, currency: 'ILS', type: 'בנק', date: '', charge_day: 15, status: 'לא שולם', payments: [] },
  { id: 7, creditor: 'אבא (הלוואה גדולה)', amount: 100000, original_amount: 100000, currency: 'ILS', type: 'משפחה', date: '2030-01-01', charge_day: 10, status: 'לא שולם', installments_total: 100, installments_paid: 20, monthly_payment: 1000, interest_rate: 0, payments: [] },
  { 
    id: 8, 
    creditor: 'AMEX Fly Card', 
    bank_name: 'פועלים', 
    card_digits: '8530', 
    amount: 41423, 
    original_amount: 41423, 
    currency: 'ILS', 
    type: 'כרטיס אשראי', 
    date: '2025-10-15', 
    charge_day: 15, 
    status: 'לא שולם', 
    monthly_payment: 41423, 
    payments: [], 
    transactions: [
      {id: 1, date: '05.10.25', merchant: 'מאפיית נחמה-בית שמש', amount: 14, currency: 'ILS'}, 
      {id: 2, date: '05.10.25', merchant: 'HERTZ UK', amount: 132, currency: 'GBP', note: 'חויב 596.49 ₪'},
      {id: 3, date: '05.10.25', merchant: 'ספא ביתר', amount: 95, currency: 'ILS'},
      {id: 4, date: '05.10.25', merchant: 'גאולה', amount: 142.8, currency: 'ILS'},
      {id: 5, date: '04.11.25', merchant: 'בריאות השן לב הרמה', amount: 3760, currency: 'ILS'},
      {id: 6, date: '03.11.25', merchant: 'פיצוחי משיח גאולה', amount: 74, currency: 'ILS'},
      {id: 7, date: '15.09.25', merchant: 'THE RITZ LONDON', amount: 27, currency: 'GBP', note: 'חויב 126.18 ₪'},
      {id: 8, date: '14.09.25', merchant: 'HERTZ CAR RENTAL', amount: 2207.87, currency: 'USD', note: 'חויב 7565.43 ₪'}
    ] 
  },
  { 
    id: 9, 
    creditor: 'Diners Platinum', 
    bank_name: 'פועלים', 
    card_digits: '1111', 
    amount: 10996, 
    original_amount: 10996, 
    currency: 'ILS', 
    type: 'כרטיס אשראי', 
    date: '2025-10-02', 
    charge_day: 2, 
    status: 'לא שולם', 
    monthly_payment: 10996, 
    payments: [], 
    transactions: [
      {id: 1, date: '30/09/25', merchant: 'LIME*2 RIDES', amount: 2028, currency: 'HUF', note: 'חויב 20.57 ₪'},
      {id: 2, date: '29/09/25', merchant: 'כלל ביטוח חיים', amount: 174.49, currency: 'ILS'},
      {id: 3, date: '28/09/25', merchant: 'LIME*3 RIDES', amount: 7207, currency: 'HUF', note: 'חויב 73.91 ₪'},
      {id: 4, date: '19/09/25', merchant: 'Google YouTube', amount: 23.90, currency: 'ILS'},
      {id: 5, date: '14/09/25', merchant: 'Google ChatGPT', amount: 699.90, currency: 'ILS'},
      {id: 6, date: '2025-08-09', merchant: 'AMAZON PRIME', amount: 16.25, currency: 'USD'}
    ] 
  },
  { id: 10, creditor: 'Visa Poalim', bank_name: 'פועלים', card_digits: '8841', amount: 10151, original_amount: 10151, currency: 'ILS', type: 'כרטיס אשראי', date: '2025-11-15', charge_day: 15, status: 'לא שולם', monthly_payment: 10151, payments: [], transactions: [] },
];

export const INITIAL_CHARGES_TO_REVIEW: ChargeToReview[] = [
  { id: 101, merchant: 'Google GSuite', amount: 18.29, currency: 'USD', date: '2025-10-02', card: 'דיינרס 1111', status: 'לבדוק', note: 'שירות מייל גוגל לעסק' },
  { id: 102, merchant: 'ChatGPT Subscription', amount: 188.00, currency: 'USD', date: '2025-10-14', card: 'אמקס 2746', status: 'לבדוק', note: 'מנוי חודשי - לבדוק סכום' },
  { id: 103, merchant: 'Adobe.com', amount: 70.00, currency: 'ILS', date: '2025-03-09', card: 'לא ידוע', status: 'לבדוק', note: 'לבדוק אם יש כפל מנויים' },
  { id: 104, merchant: 'AMAZON PRIME', amount: 16.25, currency: 'USD', date: '2025-08-10', card: 'דיינרס', status: 'לבדוק', note: 'לבדוק מועד חידוש' },
  { id: 105, merchant: 'SQSP* WORKSP', amount: 123.02, currency: 'ILS', date: '2025-06-10', card: '', status: 'לבדוק', note: 'לוודא שהאתר חויב פעם אחת בלבד' }
];