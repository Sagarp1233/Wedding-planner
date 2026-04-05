import { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import { generateId } from '../utils/helpers';
import { generateBudgetCategories, generateTasks, generateEvents } from '../data/templates';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);

export const emptyState = {
  wedding: {
    partner1: '', partner2: '', weddingDate: '', location: '', weddingStyle: '',
    totalBudget: 0, whatsappTemplate: '',
  },
  guests: [],
  budgetCategories: [],
  expenses: [],
  tasks: [],
  events: [],
  vendors: [],
  inspirations: [],
};

// Pure local state reducer (for optimistic UI updates)
function reducer(state, action) {
  switch (action.type) {
    case 'INIT_WEDDING':
      return { ...emptyState, ...action.payload };

    // Guests
    case 'ADD_GUEST':
      return { ...state, guests: [...state.guests, { id: generateId(), ...action.payload }] };
    case 'ADD_GUESTS':
      return { ...state, guests: [...state.guests, ...action.payload.map(g => ({ id: generateId(), ...g }))] };
    case 'UPDATE_GUEST':
      return { ...state, guests: state.guests.map(g => g.id === action.payload.id ? { ...g, ...action.payload } : g) };
    case 'DELETE_GUEST':
      return { ...state, guests: state.guests.filter(g => g.id !== action.payload) };

    // Budget Categories
    case 'ADD_CATEGORY':
      return { ...state, budgetCategories: [...state.budgetCategories, action.payload] };
    case 'UPDATE_CATEGORY':
      return { ...state, budgetCategories: state.budgetCategories.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        budgetCategories: state.budgetCategories.filter(c => c.id !== action.payload),
        expenses: state.expenses.filter(e => e.categoryId !== action.payload)
      };

    // Expenses
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, { id: generateId(), ...action.payload }] };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };

    // Tasks
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, { id: generateId(), ...action.payload }] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };

    // Timeline Events
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, { id: generateId(), ...action.payload }] };
    case 'UPDATE_EVENT':
      return { ...state, events: state.events.map(ev => ev.id === action.payload.id ? { ...ev, ...action.payload } : ev) };
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter(ev => ev.id !== action.payload) };

    // Vendors
    case 'ADD_VENDOR':
      return { ...state, vendors: [...state.vendors, { id: generateId(), ...action.payload }] };
    case 'UPDATE_VENDOR':
      return { ...state, vendors: state.vendors.map(v => v.id === action.payload.id ? { ...v, ...action.payload } : v) };
    case 'DELETE_VENDOR':
      return { ...state, vendors: state.vendors.filter(v => v.id !== action.payload) };

    // Inspirations
    case 'ADD_INSPIRATION':
      return { ...state, inspirations: [...state.inspirations, { id: generateId(), createdAt: new Date().toISOString(), ...action.payload }] };
    case 'DELETE_INSPIRATION':
      return { ...state, inspirations: state.inspirations.filter(ins => ins.id !== action.payload) };
    case 'UPDATE_INSPIRATION':
      return { ...state, inspirations: state.inspirations.map(ins => ins.id === action.payload.id ? { ...ins, ...action.payload } : ins) };

    // Wedding
    case 'UPDATE_WEDDING': {
      const newWedding = { ...state.wedding, ...action.payload };
      
      if (action.payload.totalBudget !== undefined && action.payload.totalBudget !== state.wedding.totalBudget) {
        let newBudgetCategories = [...state.budgetCategories];
        const newTotal = action.payload.totalBudget;
        
        if (newBudgetCategories.length === 0 && newTotal > 0) {
           newBudgetCategories = generateBudgetCategories(newTotal);
        } else if (newBudgetCategories.length > 0) {
           const oldAllocated = newBudgetCategories.reduce((sum, c) => sum + c.allocated, 0);
           newBudgetCategories = newBudgetCategories.map(c => ({
             ...c,
             allocated: oldAllocated > 0 ? Math.round(newTotal * (c.allocated / oldAllocated)) : Math.round(newTotal / newBudgetCategories.length)
           }));
        }
        return { ...state, wedding: newWedding, budgetCategories: newBudgetCategories };
      }

      return { ...state, wedding: newWedding };
    }

    // Reset
    case 'RESET_ALL':
      return emptyState;

    default:
      return state;
  }
}

export function AppProvider({ children, userId }) {
  const [state, localDispatch] = useReducer(reducer, emptyState);
  const [isInitializing, setIsInitializing] = useState(true);

  // Fetch initial data from Supabase
  useEffect(() => {
    async function loadSupabaseData() {
      if (!userId) {
        localDispatch({ type: 'INIT_WEDDING', payload: emptyState });
        setIsInitializing(false);
        return;
      }

      try {
        // Fetch wedding profile
        const { data: weddingData, error: weddingError } = await supabase
          .from('weddings')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (weddingError || !weddingData) {
          // No wedding created yet for this user
          localDispatch({ type: 'INIT_WEDDING', payload: emptyState });
          setIsInitializing(false);
          return;
        }

        const wId = weddingData.id;

        // Parallel fetch all related tables
        const [
          { data: guests },
          { data: cats },
          { data: expenses },
          { data: tasks },
          { data: events },
          { data: vendors },
          { data: inspirations }
        ] = await Promise.all([
          supabase.from('guests').select('*').eq('wedding_id', wId),
          supabase.from('budget_categories').select('*').eq('wedding_id', wId),
          supabase.from('expenses').select('*').eq('wedding_id', wId),
          supabase.from('tasks').select('*').eq('wedding_id', wId),
          supabase.from('timeline_events').select('*').eq('wedding_id', wId),
          supabase.from('vendors').select('*').eq('wedding_id', wId),
          supabase.from('inspirations').select('*').eq('wedding_id', wId)
        ]);

        // Map column snake_case back to camelCase local state if needed
        const mappedWedding = {
          id: weddingData.id,
          partner1: weddingData.partner1,
          partner2: weddingData.partner2 || '',
          weddingDate: weddingData.wedding_date || '',
          location: weddingData.location || '',
          weddingStyle: weddingData.wedding_style || '',
          totalBudget: Number(weddingData.total_budget) || 0,
          whatsappTemplate: weddingData.whatsapp_template || '',
        };

        // --- AUTO-REPAIR FOR EXISTING USERS ---
        const totalB = Number(weddingData.total_budget) || 0;
        let finalCats = cats || [];
        if (finalCats.length === 0 && totalB > 0) {
           const generatedCats = generateBudgetCategories(totalB);
           const mappedCats = generatedCats.map(c => ({ wedding_id: wId, name: c.name, icon: c.icon, color: c.color, allocated: c.allocated }));
           const { data: newCats } = await supabase.from('budget_categories').insert(mappedCats).select();
           if(newCats) finalCats = newCats;
        }

        let finalTasks = tasks || [];
        if (finalTasks.length === 0) {
           const generatedTasks = generateTasks(weddingData.wedding_date || new Date().toISOString());
           const mappedTasks = generatedTasks.map(t => ({ wedding_id: wId, title: t.title, description: t.description || '', deadline: t.deadline || '', priority: t.priority, status: t.status }));
           const { data: newTasks } = await supabase.from('tasks').insert(mappedTasks).select();
           if(newTasks) finalTasks = newTasks;
        }

        let finalEvents = events || [];
        if (finalEvents.length === 0) {
           const generatedEvents = generateEvents(weddingData.wedding_date || new Date().toISOString(), weddingData.wedding_style || 'hindu');
           const mappedEvents = generatedEvents.map(e => ({ wedding_id: wId, time: e.time, end_time: e.endTime || '', title: e.title, description: e.description || '', location: e.location || '' }));
           const { data: newEvents } = await supabase.from('timeline_events').insert(mappedEvents).select();
           if(newEvents) finalEvents = newEvents;
        }

        const payload = {
          wedding: mappedWedding,
          guests: guests || [],
          budgetCategories: finalCats,
          expenses: (expenses || []).map(e => ({...e, categoryId: e.category_id})),
          tasks: finalTasks,
          events: finalEvents.map(e => ({...e, startTime: e.time || e.start_time, endTime: e.end_time || ''})),
          vendors: (vendors || []).map(v => ({...v, contactPerson: v.contact_person || '', quotedAmount: Number(v.quoted_amount)||0, advancePaid: Number(v.advance_paid)||0, nextPaymentDate: v.next_payment_date||''})),
          inspirations: (inspirations || []).map(i => ({...i, imageUrl: i.image_url}))
        };

        localDispatch({ type: 'INIT_WEDDING', payload });
      } catch (e) {
        console.error("Failed to sync from Supabase:", e);
      } finally {
        setIsInitializing(false);
      }
    }

    loadSupabaseData();
  }, [userId]);

  // The async dispatcher handles syncing changes to the DB
  const dispatch = useCallback(async (action) => {
    // 1. Optimistically update local UI
    localDispatch(action);

    // 2. Sync to Supabase in background
    if (!userId) return;

    try {
      const wId = state.wedding?.id;

      // Special case: Initial Wedding Creation (Onboarding)
      // Both Onboarding and loadSupabaseData can dispatch INIT_WEDDING.
      if (action.type === 'INIT_WEDDING' && action.payload?.wedding && !action.payload.wedding.id) {
         // Create the wedding record
         const { data, error } = await supabase.from('weddings').insert({
            user_id: userId,
            partner1: action.payload.wedding.partner1 || 'Partner 1',
            partner2: action.payload.wedding.partner2 || 'Partner 2',
            wedding_date: action.payload.wedding.weddingDate || '',
            location: action.payload.wedding.location || '',
            wedding_style: action.payload.wedding.weddingStyle || '',
            total_budget: action.payload.wedding.totalBudget || 0,
         }).select('id').single();

         if (data) {
           const newWeddingId = data.id;
           // Update local state with the real DB id
           localDispatch({ type: 'UPDATE_WEDDING', payload: { id: newWeddingId } });
           
           // Now mass-insert the generated collections
           if (action.payload.budgetCategories?.length > 0) {
              const mappedCats = action.payload.budgetCategories.map(c => ({
                 wedding_id: newWeddingId, name: c.name, icon: c.icon, color: c.color, allocated: c.allocated
              }));
              await supabase.from('budget_categories').insert(mappedCats);
           }
           
           if (action.payload.tasks?.length > 0) {
              const mappedTasks = action.payload.tasks.map(t => ({
                 wedding_id: newWeddingId, title: t.title, description: t.description || '', deadline: t.deadline || '', priority: t.priority, status: t.status
              }));
              await supabase.from('tasks').insert(mappedTasks);
           }

           if (action.payload.events?.length > 0) {
              const mappedEvents = action.payload.events.map(e => ({
                 wedding_id: newWeddingId, time: e.time, end_time: e.endTime || '', title: e.title, description: e.description || '', location: e.location || ''
              }));
              await supabase.from('timeline_events').insert(mappedEvents);
           }
         }
         return;
      }

      if (!wId) return; // Cannot save subsequent items without a wedding ID

      switch (action.type) {
        case 'UPDATE_WEDDING': {
          const updates = {};
          if (action.payload.partner1 !== undefined) updates.partner1 = action.payload.partner1;
          if (action.payload.partner2 !== undefined) updates.partner2 = action.payload.partner2;
          if (action.payload.weddingDate !== undefined) updates.wedding_date = action.payload.weddingDate;
          if (action.payload.location !== undefined) updates.location = action.payload.location;
          if (action.payload.weddingStyle !== undefined) updates.wedding_style = action.payload.weddingStyle;
          if (action.payload.totalBudget !== undefined) updates.total_budget = action.payload.totalBudget;
          if (action.payload.whatsappTemplate !== undefined) updates.whatsapp_template = action.payload.whatsappTemplate;
          await supabase.from('weddings').update(updates).eq('id', wId);
          break;
        }

        // Guests
        case 'ADD_GUEST':
          await supabase.from('guests').insert({ wedding_id: wId, name: action.payload.name, phone: action.payload.phone, email: action.payload.email, category: action.payload.category, rsvp: action.payload.rsvp, plus_one: action.payload.plusOne, notes: action.payload.notes, table_number: action.payload.table });
          break;
        case 'UPDATE_GUEST':
          if(String(action.payload.id).includes('-')) await supabase.from('guests').update({ name: action.payload.name, phone: action.payload.phone, email: action.payload.email, category: action.payload.category, rsvp: action.payload.rsvp, plus_one: action.payload.plusOne, notes: action.payload.notes, table_number: action.payload.table }).eq('id', action.payload.id);
          break;
        case 'DELETE_GUEST':
          if(String(action.payload).includes('-')) await supabase.from('guests').delete().eq('id', action.payload);
          break;

        // Tasks
        case 'ADD_TASK':
          await supabase.from('tasks').insert({ wedding_id: wId, title: action.payload.title, description: action.payload.description, deadline: action.payload.deadline, priority: action.payload.priority, status: action.payload.status });
          break;
        case 'UPDATE_TASK':
          if(String(action.payload.id).includes('-')) await supabase.from('tasks').update({ title: action.payload.title, description: action.payload.description, deadline: action.payload.deadline, priority: action.payload.priority, status: action.payload.status }).eq('id', action.payload.id);
          break;
        case 'DELETE_TASK':
          if(String(action.payload).includes('-')) await supabase.from('tasks').delete().eq('id', action.payload);
          break;

        // Vendors
        case 'ADD_VENDOR':
          await supabase.from('vendors').insert({ wedding_id: wId, category: action.payload.category, name: action.payload.name, contact_person: action.payload.contactPerson, phone: action.payload.phone, email: action.payload.email, quoted_amount: action.payload.quotedAmount, advance_paid: action.payload.advancePaid, next_payment_date: action.payload.nextPaymentDate, notes: action.payload.notes, status: action.payload.status });
          break;
        case 'UPDATE_VENDOR':
          if(String(action.payload.id).includes('-')) await supabase.from('vendors').update({ category: action.payload.category, name: action.payload.name, contact_person: action.payload.contactPerson, phone: action.payload.phone, email: action.payload.email, quoted_amount: action.payload.quotedAmount, advance_paid: action.payload.advancePaid, next_payment_date: action.payload.nextPaymentDate, notes: action.payload.notes, status: action.payload.status }).eq('id', action.payload.id);
          break;
        case 'DELETE_VENDOR':
          if(String(action.payload).includes('-')) await supabase.from('vendors').delete().eq('id', action.payload);
          break;

        // Timeline Events
        case 'ADD_EVENT':
          await supabase.from('timeline_events').insert({ wedding_id: wId, time: action.payload.time, end_time: action.payload.endTime, title: action.payload.title, description: action.payload.description, location: action.payload.location });
          break;
        case 'UPDATE_EVENT':
          if(String(action.payload.id).includes('-')) await supabase.from('timeline_events').update({ time: action.payload.time, end_time: action.payload.endTime, title: action.payload.title, description: action.payload.description, location: action.payload.location }).eq('id', action.payload.id);
          break;
        case 'DELETE_EVENT':
          if(String(action.payload).includes('-')) await supabase.from('timeline_events').delete().eq('id', action.payload);
          break;

        // Expenses
        case 'ADD_EXPENSE':
          await supabase.from('expenses').insert({ wedding_id: wId, category_id: action.payload.categoryId, title: action.payload.title, amount: action.payload.amount, date: action.payload.date });
          break;
        case 'DELETE_EXPENSE':
          if(String(action.payload).includes('-')) await supabase.from('expenses').delete().eq('id', action.payload);
          break;

        // Categories
        case 'ADD_CATEGORY':
          await supabase.from('budget_categories').insert({ wedding_id: wId, name: action.payload.name, icon: action.payload.icon, color: action.payload.color, allocated: action.payload.allocated });
          break;
        case 'UPDATE_CATEGORY':
          if(String(action.payload.id).includes('-')) await supabase.from('budget_categories').update({ name: action.payload.name, icon: action.payload.icon, color: action.payload.color, allocated: action.payload.allocated }).eq('id', action.payload.id);
          break;
        case 'DELETE_CATEGORY':
          if(String(action.payload).includes('-')) await supabase.from('budget_categories').delete().eq('id', action.payload);
          break;
          
        // Inspirations
        case 'ADD_INSPIRATION':
          await supabase.from('inspirations').insert({ wedding_id: wId, title: action.payload.title, image_url: action.payload.imageUrl, category: action.payload.category, notes: action.payload.notes });
          break;
        case 'UPDATE_INSPIRATION':
          if(String(action.payload.id).includes('-')) await supabase.from('inspirations').update({ title: action.payload.title, image_url: action.payload.imageUrl, category: action.payload.category, notes: action.payload.notes }).eq('id', action.payload.id);
          break;
        case 'DELETE_INSPIRATION':
          if(String(action.payload).includes('-')) await supabase.from('inspirations').delete().eq('id', action.payload);
          break;
      }
    } catch (err) {
       console.error("DB Sync Error:", err);
    }
  }, [state.wedding?.id, userId]); // Dependencies

  const resetAll = useCallback(async () => {
    localDispatch({ type: 'RESET_ALL' });
    if (state.wedding?.id) {
       await supabase.from('weddings').delete().eq('id', state.wedding.id);
    }
  }, [state.wedding?.id]);

  if (isInitializing) return null; // Or a global loader

  return (
    <AppContext.Provider value={{ state, dispatch, resetAll }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
