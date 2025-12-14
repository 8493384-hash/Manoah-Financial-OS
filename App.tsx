import React, { useState } from 'react';
import { 
  LayoutDashboard, Wallet, CreditCard, Calendar, ArrowUpRight, ArrowDownLeft, 
  Search, TrendingUp, TrendingDown, Folder, FolderOpen, Plus, Trash2, Edit2, X, 
  RefreshCw, Building2, Users, Activity, Sparkles, Landmark, CalendarClock, 
  FileBarChart, CreditCard as CardIcon, ShieldAlert, Menu, MessageSquare, Check, 
  Clock, FileText, Loader2, ListPlus, Banknote, Percent, HandCoins
} from 'lucide-react';
import { 
  INITIAL_RECEIVABLES, INITIAL_LIABILITIES, INITIAL_CHARGES_TO_REVIEW, 
  DEFAULT_AI_INSIGHTS, INSTITUTIONAL_TYPES 
} from './constants';
import { formatMoney, convertToILS } from './utils';
import { analyzeFinancialText } from './services/gemini';
import { NavItemButton, StatCard } from './components/UI';
import { 
  ChatModal, SmartAddModal, CreditCardDetailModal, AddChargeModal, 
  PaymentManagerModal, EditModal 
} from './components/Modals';
import { FinancialItem, ChargeToReview, AiInsight } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('cockpit');
  const [receivables, setReceivables] = useState<FinancialItem[]>(INITIAL_RECEIVABLES);
  const [liabilities, setLiabilities] = useState<FinancialItem[]>(INITIAL_LIABILITIES);
  const [chargesToReview, setChargesToReview] = useState<ChargeToReview[]>(INITIAL_CHARGES_TO_REVIEW);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null); 
  
  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSmartAddOpen, setIsSmartAddOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCardDetailOpen, setIsCardDetailOpen] = useState(false);
  const [isAddChargeOpen, setIsAddChargeOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FinancialItem | null>(null);
  const [modalType, setModalType] = useState('receivable');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [aiInsights, setAiInsights] = useState<AiInsight[]>(DEFAULT_AI_INSIGHTS);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleCRUD = (type: string, action: string, item: FinancialItem | null = null) => {
    setModalType(type);
    if (action === 'delete') {
      if (item && window.confirm('האם למחוק?')) {
        type === 'receivable' 
          ? setReceivables(prev => prev.filter(i => i.id !== item.id))
          : setLiabilities(prev => prev.filter(i => i.id !== item.id));
      }
      return;
    }
    if (action === 'payment') {
      setEditingItem(item);
      setIsPaymentModalOpen(true);
      return;
    }
    setEditingItem(action === 'edit' ? item : null);
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = (updatedItem: FinancialItem) => {
      const setState = modalType === 'receivable' ? setReceivables : setLiabilities;
      setState(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
      setEditingItem(updatedItem); 
  };

  const handleEditSave = (formData: FinancialItem) => {
    const setState = modalType === 'receivable' ? setReceivables : setLiabilities;
    setState(prev => editingItem 
      ? prev.map(i => i.id === editingItem.id ? { ...formData, id: i.id } : i)
      : [...prev, { ...formData, id: Date.now() }]
    );
    setIsEditModalOpen(false);
  };

  const handleSmartAddAnalysis = async (text: string) => {
    try {
        const resultString = await analyzeFinancialText(text);
        if (resultString) {
            // Very basic JSON extraction from response text
            // In a real app, strict JSON validation is needed.
            const jsonMatch = resultString.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const data = JSON.parse(jsonMatch[0]);
                if (data.type === 'liability') {
                   setLiabilities(prev => [...prev, { ...data, id: Date.now(), payments: [], status: 'לא שולם' }]);
                   alert("התחייבות נוספה בהצלחה!");
                } else if (data.type === 'receivable') {
                   setReceivables(prev => [...prev, { ...data, id: Date.now(), payments: [], status: 'לא שולם' }]);
                   alert("חוב חייב נוסף בהצלחה!");
                }
            } else {
                alert("לא הצלחתי לזהות נתונים תקינים. נסה שוב.");
            }
        }
    } catch (e) {
        console.error(e);
        alert("שגיאה בניתוח הנתונים.");
    }
    setIsSmartAddOpen(false);
  };
  
  const handleAddCharge = (charge: ChargeToReview) => {
     setChargesToReview(prev => [...prev, charge]);
  };

  const refreshAiInsights = async () => {
    setIsAiLoading(true);
    setTimeout(() => {
        setIsAiLoading(false);
        setAiInsights([{ type: 'alert', text: 'עודכן! מצב החובות שלך השתפר ב-2% השבוע.', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' }]);
    }, 1500);
  };

  const getGroupedItems = (items: FinancialItem[], nameField: 'name' | 'creditor') => {
    const groups: any = {};
    items.forEach(item => {
      const name = item[nameField] || 'Unknown';
      if (name.includes(searchTerm)) {
        if (!groups[name]) groups[name] = { name, totalAmountILS: 0, items: [], hasUnpaid: false };
        groups[name].items.push(item);
        groups[name].totalAmountILS += convertToILS(item.amount, item.currency);
        if (item.status === 'לא שולם') groups[name].hasUnpaid = true;
      }
    });
    return Object.values(groups).sort((a: any, b: any) => b.totalAmountILS - a.totalAmountILS);
  };

  const renderFolders = (groupedData: any[], type: string) => (
    <div className="grid grid-cols-1 gap-5 pb-20">
      {groupedData.map(group => (
        <div key={group.name} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div onClick={() => setExpandedFolder(expandedFolder === group.name ? null : group.name)} 
               className={`p-6 flex items-center justify-between cursor-pointer ${expandedFolder === group.name ? 'bg-slate-50/50' : 'bg-white'}`}>
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl shadow-sm ${group.hasUnpaid ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {expandedFolder === group.name ? <FolderOpen size={28}/> : <Folder size={28}/>}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-xl">{group.name}</h3>
                <div className="flex gap-2 text-sm text-slate-400 mt-1 font-medium">
                  <span>{group.items.length} תיקים פעילים</span>
                  <span>•</span>
                  <span>עודכן לאחרונה</span>
                </div>
              </div>
            </div>
            <div className="text-left">
              <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">סה"כ יתרה</div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">₪{group.totalAmountILS.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
          </div>
          
          {expandedFolder === group.name && (
            <div className="border-t border-slate-100 bg-slate-50/30 p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
              {group.items.map((item: FinancialItem) => (
                <div key={item.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:border-indigo-200 transition-colors">
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                         <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">{item.type}</span>
                         {item.charge_day && <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded flex items-center gap-1"><CalendarClock size={12}/> חיוב ב-{item.charge_day} לחודש</span>}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'שולם' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{item.status}</span>
                    </div>
                    
                    {/* תצוגה מיוחדת לפרטי בנק/אשראי */}
                    {item.bank_name && (
                       <div className="mb-3 pl-2 border-r-4 border-indigo-100">
                          <div className="text-sm font-bold text-slate-800">{item.bank_name} {item.loan_number ? `• הלוואה ${item.loan_number}` : ''}</div>
                          {item.card_digits && <div className="text-xs text-slate-500 font-mono">**** {item.card_digits}</div>}
                          {item.interest_type && (
                             <div className="text-xs text-indigo-600 font-medium mt-1">
                                {item.interest_type} {item.loan_margin ? `+ ${item.loan_margin}%` : ''} {item.interest_rate ? `${item.interest_rate}%` : ''}
                             </div>
                          )}
                       </div>
                    )}

                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-3xl font-black text-slate-800 tracking-tight" dir="ltr">{formatMoney(item.amount, item.currency)}</span>
                      {item.original_amount && <span className="text-sm text-slate-400 font-medium line-through">מקור: {item.original_amount}</span>}
                    </div>
                    
                    {/* Loan specific details */}
                    {(item.monthly_payment || 0) > 0 && (
                      <div className="grid grid-cols-2 gap-4 mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                         <div className="text-xs">
                            <span className="text-slate-400 block mb-1">החזר חודשי</span>
                            <span className="font-bold text-slate-800 text-lg">₪{item.monthly_payment}</span>
                         </div>
                         {(item.interest_rate || 0) > 0 && (
                           <div className="text-xs">
                              <span className="text-slate-400 block mb-1">ריבית שנתית</span>
                              <span className="font-bold text-slate-800 text-lg flex items-center gap-1"><Percent size={12}/> {item.interest_rate}</span>
                           </div>
                         )}
                         {(item.installments_total || 0) > 0 && (
                           <div className="col-span-2">
                             <div className="flex justify-between text-xs mb-1">
                               <span className="text-slate-400 font-medium">תשלום {item.installments_paid} מתוך {item.installments_total}</span>
                               <span className="font-bold text-indigo-600">{Math.round(((item.installments_paid || 0)/(item.installments_total || 1))*100)}%</span>
                             </div>
                             <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                               <div className="bg-indigo-500 h-full rounded-full shadow-lg" style={{width: `${((item.installments_paid || 0)/(item.installments_total || 1))*100}%`}}></div>
                             </div>
                           </div>
                         )}
                      </div>
                    )}
                    
                    <div className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-3">
                       <FileText size={14}/> {typeof item.note === 'string' ? item.note : 'אין הערות'}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    {/* Only show 'Payment' button if it's not a bank loan which is usually automatic, or allow manual tracking */}
                    <button onClick={() => handleCRUD(type, 'payment', item)} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5"><Check size={18} /> נהל תשלומים</button>
                    <button onClick={() => handleCRUD(type, 'edit', item)} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors"><Edit2 size={18}/></button>
                    <button onClick={() => handleCRUD(type, 'delete', item)} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderBillingCycles = () => {
    const relevantItems = liabilities.filter(item => item.charge_day);
    const days = [2, 10, 15];

    return (
       <div className="space-y-8 animate-in fade-in duration-500">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">ניהול תאריכי חיוב</h2>
            <p className="text-slate-500 text-lg">ריכוז החיובים הקבועים לפי ימים בחודש</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
             {days.map(day => {
                 const items = relevantItems.filter(i => i.charge_day === day);
                 const total = items.reduce((sum, i) => sum + (i.monthly_payment || convertToILS(i.amount, i.currency)), 0);
                 return (
                    <div key={day} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-50">
                            <div className="bg-slate-900 text-white font-black text-xl w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg">{day}</div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">סה"כ לחיוב</span>
                                <span className="text-2xl font-black text-slate-900">₪{total.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="space-y-3 flex-1 overflow-y-auto">
                            {items.map(item => (
                                <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center hover:bg-white hover:shadow-sm transition-all">
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">{item.creditor}</div>
                                    <div className="text-[10px] text-slate-500 font-medium bg-slate-200 px-1.5 py-0.5 rounded w-fit mt-1">{item.type}</div>
                                </div>
                                <div className="font-bold text-indigo-600">₪{(item.monthly_payment || item.amount).toLocaleString()}</div>
                                </div>
                            ))}
                            {items.length === 0 && <div className="text-center text-slate-400 text-sm py-4">אין חיובים לתאריך זה</div>}
                        </div>
                    </div>
                 )
             })}
          </div>
       </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex" dir="rtl">
      {/* תפריט צד ימין קבוע */}
      <aside className={`fixed right-0 top-0 h-full bg-white shadow-[0_0_50px_rgba(0,0,0,0.05)] w-[300px] z-50 flex flex-col transition-transform duration-300 border-l border-slate-100 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200"><Landmark size={28}/></div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manoah</h1>
              <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Financial OS</p>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-900 bg-slate-50 p-2 rounded-xl"><X size={20}/></button>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 py-6 overflow-y-auto">
          <NavItemButton icon={LayoutDashboard} label="דשבורד ראשי" active={activeTab === 'cockpit'} onClick={() => {setActiveTab('cockpit'); setMobileMenuOpen(false);}} />
          <NavItemButton icon={CalendarClock} label="ניהול תאריכי חיוב" active={activeTab === 'billing_cycles'} onClick={() => {setActiveTab('billing_cycles'); setMobileMenuOpen(false);}} />
          
          <div className="px-4 mt-8 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ניהול שוטף</div>
          
          <NavItemButton icon={ArrowDownLeft} label="חייבים לי" active={activeTab === 'receivables'} onClick={() => {setActiveTab('receivables'); setMobileMenuOpen(false);}} />
          <NavItemButton icon={Users} label="חובות פרטיים" active={activeTab === 'private_debts'} onClick={() => {setActiveTab('private_debts'); setMobileMenuOpen(false);}} />
          <NavItemButton icon={Building2} label="בנקים ומוסדות" active={activeTab === 'bank_debts'} onClick={() => {setActiveTab('bank_debts'); setMobileMenuOpen(false);}} />
          <NavItemButton icon={HandCoins} label="ניהול הלוואות" active={activeTab === 'loans'} onClick={() => {setActiveTab('loans'); setMobileMenuOpen(false);}} />

          <div className="px-4 mt-8 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Advanced AI</div>
          <NavItemButton icon={Sparkles} label="דוחות חכמים" active={activeTab === 'ai_reports'} onClick={() => {setActiveTab('ai_reports'); setMobileMenuOpen(false);}} />
          
          <div className="px-4 mt-8 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ביקורת וחיובים</div>
          <NavItemButton icon={CardIcon} label="ניהול תשלומי כרטיסי אשראי" active={activeTab === 'credit_cards'} onClick={() => {setActiveTab('credit_cards'); setMobileMenuOpen(false);}} />
          <NavItemButton icon={ShieldAlert} label="חיובים לבדיקה" active={activeTab === 'charges_review'} onClick={() => {setActiveTab('charges_review'); setMobileMenuOpen(false);}} />
        </nav>

        <div className="p-6 border-t border-slate-50">
           <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-md">N</div>
              <div>
                 <div className="text-sm font-bold text-slate-900">נחמן פרלשטיין</div>
                 <div className="text-[10px] text-slate-500 font-medium">Premium Plan</div>
              </div>
           </div>
        </div>
      </aside>

      {/* אזור תוכן ראשי */}
      <main className="flex-1 lg:mr-[300px] p-6 lg:p-16 max-w-[1920px] mx-auto w-full transition-all">
        <div className="lg:hidden flex justify-between items-center mb-8 sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-md z-40 p-4 rounded-b-3xl border-b border-slate-200/60">
          <div className="font-black text-xl text-slate-900 flex items-center gap-2"><Landmark size={24} className="text-indigo-600"/> Manoah</div>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2.5 bg-white rounded-xl shadow-sm text-slate-600"><Menu size={24}/></button>
        </div>

        {activeTab === 'cockpit' && (
          <div className="space-y-12 animate-in fade-in">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tight">בוקר טוב, נחמן.</h2>
                <p className="text-slate-500 font-medium text-lg">הנה מה שקורה בחשבון שלך היום.</p>
              </div>
              <button className="hidden md:flex bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold items-center gap-2 shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all"><FileBarChart size={18}/> הפק דוח מלא</button>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="סה״כ חייבים לי" value={`₪${receivables.reduce((a,c)=>a+convertToILS(c.amount,c.currency),0).toLocaleString()}`} icon={ArrowDownLeft} trend="up" color="bg-emerald-500" />
              <StatCard title="סה״כ התחייבויות" value={`₪${liabilities.reduce((a,c)=>a+convertToILS(c.amount,c.currency),0).toLocaleString()}`} icon={ArrowUpRight} trend="down" color="bg-rose-500" />
              <StatCard title="נטו (עושר)" value={`₪${(receivables.reduce((a,c)=>a+convertToILS(c.amount,c.currency),0) - liabilities.reduce((a,c)=>a+convertToILS(c.amount,c.currency),0)).toLocaleString()}`} icon={Wallet} color="bg-indigo-500" />
            </div>
            
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[150px] opacity-40 -mr-40 -mt-40"></div>
               <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600 rounded-full blur-[150px] opacity-30 -ml-20 -mb-20"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-md">
                       <Sparkles size={14} className="text-indigo-300"/> Manoah Intelligence
                    </div>
                    <h3 className="text-4xl font-bold mb-4 leading-tight">תובנת AI יומית</h3>
                    <p className="text-indigo-100 text-lg leading-relaxed opacity-90 max-w-2xl">
                      זיהינו מגמה חיובית: קצב סגירת החובות שלך עלה ב-12% החודש. בהתבסס על התזרים הנוכחי, מומלץ להקדים את התשלום ל"בנק הפועלים" כדי לחסוך בריבית ההצמדה הצפויה לעלות בחודש הבא.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'billing_cycles' && renderBillingCycles()}

        {(activeTab === 'receivables' || activeTab === 'private_debts' || activeTab === 'bank_debts' || activeTab === 'loans') && (
          <div className="space-y-10 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
              <div>
                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
                  {activeTab === 'receivables' ? 'ניהול גבייה' : 
                   activeTab === 'private_debts' ? 'חובות פרטיים' : 
                   activeTab === 'bank_debts' ? 'בנקים ומוסדות' : 'תיק הלוואות'}
                </h2>
                <p className="text-slate-500 font-medium text-lg">
                  {activeTab === 'receivables' ? 'מעקב אחר כספים שצריכים להיכנס לחשבון' : 'ניהול ומעקב שוטף אחר התחייבויות כספיות'}
                </p>
              </div>
              <button 
                onClick={() => handleCRUD(activeTab === 'receivables' ? 'receivable' : 'liability', 'new')}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-3 hover:-translate-y-1"
              >
                <Plus size={22}/> הוסף רשומה חדשה
              </button>
            </div>

            {/* הצגת התיקיות עם הנתונים */}
            {renderFolders(
              getGroupedItems(
                activeTab === 'receivables' ? receivables : 
                activeTab === 'loans' ? liabilities.filter(l => (l.type || '').includes('הלוואה') || (l.type || '').includes('משכנתא')) :
                liabilities.filter(l => activeTab === 'bank_debts' ? INSTITUTIONAL_TYPES.includes(l.type || '') : !INSTITUTIONAL_TYPES.includes(l.type || '')),
                activeTab === 'receivables' ? 'name' : 'creditor'
              ),
              activeTab === 'receivables' ? 'receivable' : 'liability'
            )}
          </div>
        )}

        {/* --- מסך ניהול תשלומי כרטיסי אשראי --- */}
        {activeTab === 'credit_cards' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-4xl font-black text-slate-900 mb-2">ניהול כרטיסי אשראי</h2>
                   <p className="text-slate-500 text-lg">מעקב אחר חיובים עתידיים בכרטיסים</p>
                </div>
                <button 
                  onClick={() => handleCRUD('liability', 'new')}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl flex items-center gap-3"
                >
                  <Plus size={22}/> הוסף כרטיס חדש
                </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liabilities.filter(l => l.type === 'כרטיס אשראי').map(card => (
                   <div key={card.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all group relative overflow-hidden cursor-pointer" onClick={() => { setEditingItem(card); setIsCardDetailOpen(true); }}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8"></div>
                      <div className="relative z-10">
                         <div className="flex justify-between items-start mb-6">
                            <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-md"><CardIcon size={24}/></div>
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100">
                               חיוב ב-{card.charge_day} לחודש
                            </span>
                         </div>
                         <h3 className="text-xl font-bold text-slate-800 mb-1">{card.creditor}</h3>
                         <p className="text-slate-400 font-mono tracking-wider mb-6">**** {card.card_digits || '0000'}</p>
                         
                         <div className="pt-6 border-t border-slate-50">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">סכום לחיוב קרוב</span>
                            <span className="text-3xl font-black text-slate-900">₪{card.amount.toLocaleString()}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- מסך חיובים לבדיקה --- */}
        {activeTab === 'charges_review' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-4xl font-black text-slate-900 mb-2">חיובים לבדיקה</h2>
                   <p className="text-slate-500 text-lg">עסקאות הדורשות תשומת לב מיוחדת</p>
                </div>
                <button 
                  onClick={() => setIsAddChargeOpen(true)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
                >
                   <Plus size={20}/> הוסף חיוב לבדיקה
                </button>
             </div>

             <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-right">
                   <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <tr>
                         <th className="p-6">שם בית עסק</th>
                         <th className="p-6">סכום</th>
                         <th className="p-6">תאריך</th>
                         <th className="p-6">כרטיס</th>
                         <th className="p-6">הערות / סיבת בדיקה</th>
                         <th className="p-6 text-center">פעולות</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {chargesToReview.map(charge => (
                         <tr key={charge.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="p-6 font-bold text-slate-800">{charge.merchant}</td>
                            <td className="p-6 font-black text-rose-600 text-lg">₪{charge.amount}</td>
                            <td className="p-6 text-slate-500 font-medium">{charge.date}</td>
                            <td className="p-6 text-slate-500 text-sm"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700">{charge.card}</span></td>
                            <td className="p-6 text-slate-600 max-w-xs">{charge.note}</td>
                            <td className="p-6 flex justify-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors" title="אשר עסקה"><Check size={18}/></button>
                               <button className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors" title="מחק"><Trash2 size={18}/></button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
                {chargesToReview.length === 0 && (
                   <div className="p-12 text-center text-slate-400">אין חיובים הממתינים לבדיקה כרגע.</div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'ai_reports' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-full font-bold text-sm mb-6 shadow-sm">
                <Sparkles size={16} className="text-indigo-600" /> Gemini 2.0 Pro Integration
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">ניתוח פיננסי מתקדם</h2>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">המערכת סורקת את כל הנתונים, מזהה חריגות וממליצה על פעולות לביצוע.</p>
              <button onClick={refreshAiInsights} disabled={isAiLoading} className="mt-10 bg-slate-900 text-white px-10 py-5 rounded-3xl font-bold flex items-center gap-3 mx-auto hover:scale-105 transition-transform shadow-2xl">
                {isAiLoading ? <Loader2 className="animate-spin" /> : <RefreshCw size={24}/>} בצע ניתוח עומק עכשיו
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiInsights.map((insight, i) => (
                  <div key={i} className={`p-8 rounded-[2.5rem] border flex flex-col gap-6 bg-white hover:shadow-2xl transition-all border-slate-100 group`}>
                    <div className={`p-5 rounded-3xl w-fit ${insight.color || 'bg-slate-100 text-slate-600'} group-hover:scale-110 transition-transform`}>
                        <insight.icon size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xl mb-3">תובנה #{i+1}</h4>
                      <p className="text-slate-600 leading-relaxed text-lg">{insight.text}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Floating Action Buttons */}
        <div className="fixed bottom-10 left-10 flex flex-col gap-4 z-40">
           <button 
             onClick={() => setIsChatOpen(!isChatOpen)}
             className="bg-slate-900 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform group relative hover:shadow-slate-500/30"
           >
             <MessageSquare size={28} />
             <span className="absolute left-full ml-4 bg-slate-900 text-white text-sm font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">צ'אט פיננסי</span>
           </button>
           <button 
             onClick={() => setIsSmartAddOpen(true)}
             className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-5 rounded-full shadow-2xl shadow-indigo-500/40 hover:scale-110 transition-transform group relative"
           >
             <Sparkles size={28} />
             <span className="absolute left-full ml-4 bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">הוספה חכמה</span>
           </button>
        </div>
      </main>

      {/* Popups */}
      <EditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleEditSave} item={editingItem} isNew={!editingItem} type={modalType} />
      
      <PaymentManagerModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        item={editingItem} 
        onUpdateItem={handleUpdateItem} 
      />

      <CreditCardDetailModal 
        isOpen={isCardDetailOpen} 
        onClose={() => setIsCardDetailOpen(false)} 
        card={editingItem} 
        onUpdateCard={handleUpdateItem} 
      />

      <AddChargeModal
         isOpen={isAddChargeOpen}
         onClose={() => setIsAddChargeOpen(false)}
         onSave={handleAddCharge}
      />
      
      <SmartAddModal isOpen={isSmartAddOpen} onClose={() => setIsSmartAddOpen(false)} onAnalyze={handleSmartAddAnalysis} />
      
      <ChatModal 
         isOpen={isChatOpen} 
         onClose={() => setIsChatOpen(false)} 
         contextData={{ receivables, liabilities }}
      />
    </div>
  );
}