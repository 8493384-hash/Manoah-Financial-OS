import React, { useState, useEffect, useRef } from 'react';
import { 
    X, Sparkles, Send, Loader2, Wand2, Plus, 
    CreditCard as CardIcon, Trash2, Check, Banknote, 
    Clock, ListPlus, Edit2, Percent, Save, FileText, CreditCard
} from 'lucide-react';
import { callGemini } from '../services/gemini';
import { CURRENCIES } from '../constants';
import { formatMoney } from '../utils';
import { FinancialItem, ChargeToReview } from '../types';

export const ChatModal = ({ isOpen, onClose, contextData }: any) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'היי נחמן! אני העוזר הפיננסי שלך (Gemini Powered). תשאל אותי כל דבר על הנתונים שלך.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const prompt = `
      Act as a professional financial assistant named "Manoah AI".
      The user is speaking Hebrew.
      Here is the current financial data JSON:
      ${JSON.stringify(contextData)}
      
      The user asks: "${input}"
      
      Answer specifically based on the data provided. Be concise, professional, and helpful. Answer in Hebrew.
    `;

    const aiResponse = await callGemini(prompt);
    
    if (aiResponse) {
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } else {
      setMessages(prev => [...prev, { role: 'ai', text: "סליחה, הייתה שגיאה בתקשורת עם השרת." }]);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-28 left-8 w-96 h-[550px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-[90] animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="bg-slate-900 p-5 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/50"><Sparkles size={18} /></div>
          <div>
            <span className="font-bold block text-sm">Manoah AI</span>
            <span className="text-[10px] text-slate-300 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> מחובר</span>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={18}/></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-white text-slate-800 rounded-bl-none border border-slate-100' : 'bg-slate-800 text-white rounded-br-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
             <div className="bg-indigo-600 p-4 rounded-2xl rounded-br-none shadow-sm flex gap-2 items-center">
               <Loader2 size={16} className="animate-spin text-white/80"/>
               <span className="text-xs text-white/80">מקליד...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100 flex gap-3 items-center">
        <input 
          className="flex-1 bg-slate-100 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          placeholder="שאל אותי משהו..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-200">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export const SmartAddModal = ({ isOpen, onClose, onAnalyze }: any) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    await onAnalyze(text);
    setLoading(false);
    setText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[80] backdrop-blur-md p-4 transition-all">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 flex justify-between items-center text-white">
          <div>
            <h3 className="font-bold text-2xl flex items-center gap-2">
              <Wand2 size={24} className="text-violet-200" /> הוספה חכמה
            </h3>
            <p className="text-violet-100 text-sm mt-1 opacity-90">דבר אליי בשפה חופשית, אני אדאג לשאר.</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X size={24} /></button>
        </div>
        <div className="p-8">
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">נסה לכתוב משהו כמו:</label>
            <div className="flex flex-wrap gap-2">
              <span className="bg-violet-50 text-violet-700 text-xs px-3 py-1.5 rounded-lg border border-violet-100 cursor-pointer hover:bg-violet-100 transition-colors" onClick={() => setText("הלוויתי 200 ₪ לדני")}>"הלוויתי 200 ₪ לדני"</span>
              <span className="bg-violet-50 text-violet-700 text-xs px-3 py-1.5 rounded-lg border border-violet-100 cursor-pointer hover:bg-violet-100 transition-colors" onClick={() => setText("חייב לבנק 50K הלוואה החזר 2500 ב-10 לחודש")}>"חייב לבנק 50K הלוואה..."</span>
            </div>
          </div>
          
          <textarea 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 focus:ring-2 focus:ring-violet-500 outline-none h-40 resize-none mb-6 text-slate-800 text-lg leading-relaxed placeholder-slate-400 shadow-inner"
            placeholder="כתוב כאן..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button 
            onClick={handleAnalyze} 
            disabled={loading || !text.trim()}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-3 transition-all disabled:opacity-50 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} className="text-violet-400" />}
            {loading ? 'מנתח נתונים...' : 'בצע ניתוח AI'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CreditCardDetailModal = ({ isOpen, onClose, card, onUpdateCard }: any) => {
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMerchant, setNewMerchant] = useState('');
  const [newCurrency, setNewCurrency] = useState('ILS');

  const handleAddTransaction = () => {
    if (!newAmount || !newMerchant) return;
    
    const newTx = {
      id: Date.now(),
      date: newDate,
      merchant: newMerchant,
      amount: Number(newAmount),
      currency: newCurrency
    };

    const updatedTx = [...(card.transactions || []), newTx];
    const newTotal = updatedTx.reduce((sum: number, tx: any) => sum + tx.amount, 0);
    
    onUpdateCard({ ...card, transactions: updatedTx, amount: newTotal });
    
    setNewAmount('');
    setNewMerchant('');
  };
  
  const handleDeleteTransaction = (txId: number) => {
      const updatedTx = card.transactions.filter((t: any) => t.id !== txId);
      const newTotal = updatedTx.reduce((sum: number, tx: any) => sum + tx.amount, 0);
      onUpdateCard({ ...card, transactions: updatedTx, amount: newTotal });
  }

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[80] backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-900 p-8 text-white shrink-0">
          <div className="flex justify-between items-start mb-6">
             <div>
                <h3 className="font-bold text-2xl mb-1">{card.creditor}</h3>
                <div className="flex items-center gap-2 text-slate-400 font-mono">
                   <CardIcon size={16}/> **** {card.card_digits}
                </div>
             </div>
             <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"><X size={24}/></button>
          </div>
          
          <div className="flex gap-8">
             <div>
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">סך חיוב קרוב</span>
                <span className="text-3xl font-black text-white">₪{card.amount.toLocaleString()}</span>
             </div>
             <div>
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">תאריך חיוב</span>
                <span className="text-xl font-bold text-white">{card.charge_day} לחודש</span>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
           <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Plus size={18}/> הוסף חיוב ידני</h4>
              <div className="flex gap-3">
                 <input type="date" className="border rounded-lg p-2 flex-1" value={newDate} onChange={e => setNewDate(e.target.value)} />
                 <input type="text" placeholder="שם בית העסק" className="border rounded-lg p-2 flex-[2]" value={newMerchant} onChange={e => setNewMerchant(e.target.value)} />
                 <div className="flex flex-1">
                    <input type="number" placeholder="סכום" className="border border-r-0 rounded-l-lg p-2 w-full font-bold" value={newAmount} onChange={e => setNewAmount(e.target.value)} />
                    <select className="border rounded-r-lg bg-slate-100 text-xs px-1 outline-none" value={newCurrency} onChange={e => setNewCurrency(e.target.value)}>
                       {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol}</option>)}
                    </select>
                 </div>
              </div>
              <button onClick={handleAddTransaction} className="w-full mt-3 bg-slate-900 text-white py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors">הוסף חיוב</button>
           </div>

           <div>
              <h4 className="font-bold text-slate-800 mb-4">פירוט עסקאות</h4>
              <div className="space-y-2">
                 {(card.transactions || []).map((tx: any) => (
                    <div key={tx.id} className="flex justify-between items-center p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                       <div className="flex gap-4">
                          <span className="text-slate-400 font-mono text-sm">{tx.date}</span>
                          <span className="font-bold text-slate-700">{tx.merchant}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900">{formatMoney(tx.amount, tx.currency || 'ILS')}</span>
                          <button onClick={() => handleDeleteTransaction(tx.id)} className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                       </div>
                    </div>
                 ))}
                 {(!card.transactions || card.transactions.length === 0) && (
                    <div className="text-center text-slate-400 py-4">אין עסקאות להצגה.</div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export const AddChargeModal = ({ isOpen, onClose, onSave }: any) => {
  const [form, setForm] = useState<Partial<ChargeToReview>>({ merchant: '', amount: '', currency: 'ILS', date: '', card: '', note: '' });

  const handleSave = () => {
    onSave({ ...form, id: Date.now(), status: 'לבדוק' });
    onClose();
    setForm({ merchant: '', amount: '', currency: 'ILS', date: '', card: '', note: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[80] backdrop-blur-sm p-4">
       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in">
          <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
             <h3 className="font-bold text-lg">הוסף חיוב לבדיקה</h3>
             <button onClick={onClose}><X size={20}/></button>
          </div>
          <div className="p-6 space-y-4">
             <input type="text" placeholder="שם העסק" className="w-full border p-3 rounded-xl" value={form.merchant} onChange={e => setForm({...form, merchant: e.target.value})} />
             <div className="flex">
                <input type="number" placeholder="סכום" className="w-full border border-l-0 rounded-r-xl p-3" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                <select className="border rounded-l-xl bg-slate-50 px-3 outline-none" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}>
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
                </select>
             </div>
             <input type="date" className="w-full border p-3 rounded-xl" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
             <input type="text" placeholder="שם הכרטיס (אופציונלי)" className="w-full border p-3 rounded-xl" value={form.card} onChange={e => setForm({...form, card: e.target.value})} />
             <textarea placeholder="הערות" className="w-full border p-3 rounded-xl h-24" value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
             <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">שמור</button>
          </div>
       </div>
    </div>
  );
};

export const PaymentManagerModal = ({ isOpen, onClose, item, onUpdateItem }: any) => {
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newType, setNewType] = useState('תשלום חלקי');
  const [newNote, setNewNote] = useState('');
  const [newCurrency, setNewCurrency] = useState('ILS');
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);

  const recalculateBalance = (payments: any[]) => {
    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const newBalance = (item.original_amount || item.amount) - totalPaid;
    let newStatus = 'לא שולם';
    if (newBalance <= 0) newStatus = 'שולם';
    else if (totalPaid > 0) newStatus = 'שולם חלקית';
    return { amount: newBalance, status: newStatus };
  };

  const handleAddPayment = () => {
    if (!newAmount) return;
    const newPayment = {
      id: Date.now(),
      date: newDate,
      amount: Number(newAmount),
      currency: newCurrency,
      type: newType,
      note: newNote
    };
    const updatedPayments = [...(item.payments || []), newPayment];
    const { amount, status } = recalculateBalance(updatedPayments);
    onUpdateItem({ ...item, payments: updatedPayments, amount, status });
    setNewAmount('');
    setNewNote('');
    setNewType('תשלום חלקי');
  };

  const handleDeletePayment = (paymentId: number) => {
    if (window.confirm("למחוק תשלום זה? היתרה תתעדכן אוטומטית.")) {
      const updatedPayments = item.payments.filter((p: any) => p.id !== paymentId);
      const { amount, status } = recalculateBalance(updatedPayments);
      onUpdateItem({ ...item, payments: updatedPayments, amount, status });
    }
  };

  const handleSaveEditPayment = (paymentId: number, updatedPayment: any) => {
      const updatedPayments = item.payments.map((p: any) => p.id === paymentId ? updatedPayment : p);
      const { amount, status } = recalculateBalance(updatedPayments);
      onUpdateItem({ ...item, payments: updatedPayments, amount, status });
      setEditingPaymentId(null);
  };

  if (!isOpen || !item) return null;

  const totalPaid = (item.payments || []).reduce((sum: number, p: any) => sum + Number(p.amount), 0);
  const percentagePaid = item.original_amount ? Math.min(100, Math.round((totalPaid / item.original_amount) * 100)) : 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[80] backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white shrink-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-3xl">{item.creditor || item.name}</h3>
              <div className="flex gap-2 mt-2">
                 <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">{item.type || 'חוב כללי'}</span>
                 <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">{item.status}</span>
              </div>
            </div>
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"><X size={24}/></button>
          </div>
          <div className="flex gap-4 items-end">
            <div className="bg-white/10 rounded-2xl p-4 flex-1 backdrop-blur-sm border border-white/10">
              <span className="text-xs text-emerald-100 block mb-1 uppercase tracking-wider font-bold">סכום מקורי</span>
              <span className="text-2xl font-bold" dir="ltr">{formatMoney(item.original_amount || item.amount, item.currency)}</span>
            </div>
            <div className="bg-white text-emerald-900 rounded-2xl p-4 flex-1 shadow-xl transform translate-y-4 border-4 border-white/20 relative z-10">
              <span className="text-xs text-emerald-600 font-bold block mb-1 uppercase tracking-wider">יתרה לתשלום</span>
              <span className="text-3xl font-black" dir="ltr">{formatMoney(item.amount, item.currency)}</span>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-8 space-y-8 pt-10">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-5 flex items-center gap-2 text-lg">
              <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><Plus size={18}/></div> 
              הוספת תשלום חדש
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="col-span-1">
                 <label className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">סכום</label>
                 <input type="number" className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800" placeholder="0" value={newAmount} onChange={e => setNewAmount(e.target.value)} />
              </div>
              <div className="col-span-1">
                 <label className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">תאריך</label>
                 <input type="date" className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-600" value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
              <div className="col-span-2">
                 <label className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">סוג תשלום</label>
                 <select className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-slate-600" value={newType} onChange={e => setNewType(e.target.value)}>
                   <option>תשלום חלקי</option>
                   <option>תשלום מלא</option>
                   <option>מקדמה</option>
                   <option>העברה בנקאית</option>
                   <option>מזומן</option>
                   <option>צ'ק</option>
                 </select>
              </div>
              <div className="col-span-1">
                  <label className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">מטבע</label>
                  <select className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-slate-600" value={newCurrency} onChange={e => setNewCurrency(e.target.value)}>
                      {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
                  </select>
              </div>
            </div>
            <input type="text" className="w-full bg-white border border-slate-200 rounded-xl p-3 mb-4 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-600" placeholder="הערה (אופציונלי)" value={newNote} onChange={e => setNewNote(e.target.value)} />
            <button onClick={handleAddPayment} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex justify-center items-center gap-2">
              <Check size={18}/> אשר והוסף תשלום
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4 px-2">
               <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                 <ListPlus size={20} className="text-slate-400"/> היסטוריית תשלומים
               </h4>
               <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200">שולם: {percentagePaid}%</span>
            </div>
            <div className="space-y-3">
              {item.payments && item.payments.length > 0 ? (
                [...item.payments].reverse().map((payment: any) => (
                  <div key={payment.id} className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 hover:shadow-md transition-all">
                    {editingPaymentId === payment.id ? (
                        <div className="flex-1 flex gap-3 items-center">
                           <input type="date" className="w-32 border rounded-lg p-2 text-sm" defaultValue={payment.date} id={`date-${payment.id}`} />
                           <input type="number" className="w-24 border rounded-lg p-2 text-sm font-bold" defaultValue={payment.amount} id={`amount-${payment.id}`} />
                           <input type="text" className="flex-1 border rounded-lg p-2 text-sm" defaultValue={payment.note} id={`note-${payment.id}`} />
                           <div className="flex gap-1">
                             <button onClick={() => {
                                 const updated = {
                                     ...payment,
                                     date: (document.getElementById(`date-${payment.id}`) as HTMLInputElement).value,
                                     amount: Number((document.getElementById(`amount-${payment.id}`) as HTMLInputElement).value),
                                     note: (document.getElementById(`note-${payment.id}`) as HTMLInputElement).value
                                 };
                                 handleSaveEditPayment(payment.id, updated);
                             }} className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><Check size={16}/></button>
                             <button onClick={() => setEditingPaymentId(null)} className="bg-slate-100 text-slate-500 p-2 rounded-lg"><X size={16}/></button>
                           </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-4">
                              <div className="bg-slate-50 p-3 rounded-xl text-slate-400 border border-slate-100">
                                <Banknote size={20} />
                              </div>
                              <div>
                                <div className="font-bold text-slate-800 text-lg flex items-center gap-3">
                                  {formatMoney(payment.amount, payment.currency || item.currency)} 
                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wide">{payment.type}</span>
                                </div>
                                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                  <Clock size={12}/> {payment.date} 
                                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                  {payment.note || 'ללא הערה'}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setEditingPaymentId(payment.id)} className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"><Edit2 size={16}/></button>
                              <button onClick={() => handleDeletePayment(payment.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-colors"><Trash2 size={16}/></button>
                            </div>
                        </>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 px-6 text-slate-400 text-sm bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center gap-3">
                  <div className="bg-white p-3 rounded-full shadow-sm"><FileText size={24} className="text-slate-300"/></div>
                  עדיין לא בוצעו תשלומים בתיק זה.<br/>השתמש בטופס למעלה כדי להוסיף תשלום ראשון.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditModal = ({ isOpen, onClose, onSave, item, isNew, type }: any) => {
  const isLiability = type === 'liability';
  const defaultForm: FinancialItem = { 
    id: 0,
    name: '', creditor: '', amount: 0, original_amount: 0, currency: 'ILS', 
    type: isLiability ? 'הלוואה פרטית' : '', 
    date: new Date().toISOString().split('T')[0], 
    status: 'לא שולם', note: '', 
    installments_total: 0, installments_paid: 0, 
    monthly_payment: 0, 
    interest_type: '', 
    loan_margin: 0, 
    interest_rate: 0, 
    bank_name: '', 
    loan_number: '', 
    card_digits: '',
    start_date: '',
    charge_day: 0,
    payments: []
  };
  const [formData, setFormData] = useState<FinancialItem>(defaultForm);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({ ...defaultForm, ...item });
      } else {
        setFormData(defaultForm);
      }
    }
  }, [isOpen, item, isLiability]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[70] backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[95vh] flex flex-col" dir="rtl">
        <div className="bg-white border-b border-slate-100 p-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="font-black text-2xl text-slate-900 flex items-center gap-2">
              {isNew ? <Plus className="text-indigo-600" /> : <Edit2 className="text-indigo-600" />}
              {isNew ? 'הוספת התחייבות / הלוואה' : 'עריכת פרטי תיק'}
            </h3>
            <p className="text-slate-500 text-sm mt-1">{isLiability ? 'ניהול מדויק של תנאי ההלוואה' : 'ניהול פרטי גבייה'}</p>
          </div>
          <button onClick={onClose} className="bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20} className="text-slate-500"/></button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8 bg-[#F8FAFC]">
          
          {/* סוג ההתחייבות - קובע את השדות שיוצגו */}
          {isLiability && (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <label className="block text-sm font-bold text-slate-800 mb-3">בחר סוג התחייבות (משפיע על השדות שיוצגו)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   {['הלוואה פרטית', 'בנק', 'כרטיס אשראי', 'משכנתא'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setFormData({...formData, type: t})}
                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border ${formData.type === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'}`}
                      >
                        {t}
                      </button>
                   ))}
                </div>
             </div>
           )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">פרטים כלליים</label>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{isLiability ? 'שם המלווה / הבנק' : 'שם החייב'}</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none font-medium shadow-sm"
                  value={isLiability ? (formData.creditor || '') : (formData.name || '')}
                  onChange={(e) => setFormData(prev => ({...prev, [isLiability ? 'creditor' : 'name']: e.target.value}))}
                />
              </div>
              
              {/* שדות ספציפיים לכרטיס אשראי */}
              {formData.type === 'כרטיס אשראי' && (
                 <div className="grid grid-cols-2 gap-3">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">שם הבנק המשויך</label>
                       <input type="text" className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none shadow-sm" placeholder="למשל: לאומי" value={formData.bank_name || ''} onChange={e => setFormData({...formData, bank_name: e.target.value})} />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">4 ספרות אחרונות</label>
                       <div className="relative">
                          <CreditCard size={18} className="absolute left-3 top-4 text-slate-400"/>
                          <input type="text" maxLength="4" className="w-full bg-white border border-slate-200 rounded-xl p-3.5 pl-10 outline-none font-mono font-bold shadow-sm" placeholder="XXXX" value={formData.card_digits || ''} onChange={e => setFormData({...formData, card_digits: e.target.value})} />
                       </div>
                    </div>
                 </div>
              )}

              {/* שדות ספציפיים להלוואות בנקאיות/משכנתא */}
              {(formData.type === 'בנק' || formData.type === 'משכנתא') && (
                 <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-3">
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">מספר הלוואה</label>
                          <input type="text" className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none shadow-sm font-mono" placeholder="מספר אסמכתא" value={formData.loan_number || ''} onChange={e => setFormData({...formData, loan_number: e.target.value})} />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">יום חיוב בחודש</label>
                          <select className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none shadow-sm" value={formData.charge_day || ''} onChange={e => setFormData({...formData, charge_day: Number(e.target.value)})}>
                             <option value="">בחר...</option>
                             <option value="2">2</option>
                             <option value="10">10</option>
                             <option value="15">15</option>
                             <option value="20">20</option>
                          </select>
                       </div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                       <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2"><Percent size={14}/> תנאי ריבית</h4>
                       <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-1">
                             <label className="block text-xs font-bold text-indigo-700 mb-1">מסלול</label>
                             <select className="w-full bg-white border border-indigo-200 rounded-lg p-2 text-sm outline-none" value={formData.interest_type || ''} onChange={e => setFormData({...formData, interest_type: e.target.value})}>
                               <option value="">בחר...</option>
                               <option value="פריים">פריים (P)</option>
                               <option value="קבועה">ריבית קבועה</option>
                               <option value="מדד">צמוד מדד</option>
                             </select>
                          </div>
                          {formData.interest_type === 'פריים' ? (
                             <div className="col-span-2">
                                <label className="block text-xs font-bold text-indigo-700 mb-1">תוספת לפריים (למשל +1.5)</label>
                                <input type="number" step="0.1" className="w-full bg-white border border-indigo-200 rounded-lg p-2 text-sm outline-none" placeholder="1.5" value={formData.loan_margin || ''} onChange={e => setFormData({...formData, loan_margin: Number(e.target.value)})} />
                             </div>
                          ) : (
                             <div className="col-span-2">
                                <label className="block text-xs font-bold text-indigo-700 mb-1">גובה הריבית (%)</label>
                                <input type="number" step="0.1" className="w-full bg-white border border-indigo-200 rounded-lg p-2 text-sm outline-none" placeholder="3.5" value={formData.interest_rate || ''} onChange={e => setFormData({...formData, interest_rate: Number(e.target.value)})} />
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">סכומים ותאריכים</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">סכום מקורי</label>
                  <input type="number" className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none font-bold shadow-sm" value={formData.original_amount || formData.amount || ''} onChange={(e) => setFormData({...formData, original_amount: Number(e.target.value), amount: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">יתרה נוכחית</label>
                  <input type="number" className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-600 shadow-sm" value={formData.amount || ''} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">תאריך לקיחה</label>
                    <input type="date" className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none shadow-sm" value={formData.start_date || ''} onChange={(e) => setFormData({...formData, start_date: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">תאריך סיום משוער</label>
                    <input type="date" className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none shadow-sm" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                 </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">הערות חופשיות</label>
            <textarea className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none shadow-sm" value={formData.note || ''} onChange={(e) => setFormData({...formData, note: e.target.value})} />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-white flex gap-4 sticky bottom-0 z-10">
          <button onClick={() => onSave(formData)} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-1">
             <Save size={20}/> שמור הכל
          </button>
          <button onClick={onClose} className="px-8 py-4 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors">ביטול</button>
        </div>
      </div>
    </div>
  );
};