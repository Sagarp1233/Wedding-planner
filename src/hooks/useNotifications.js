import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getDaysUntil } from '../utils/helpers';

export function useNotifications() {
  const { state } = useApp();
  const { tasks, vendors } = state;

  const notifications = useMemo(() => {
    const alerts = [];

    // Scan Tasks (Pending or In-Progress, Deadline <= 3 days)
    if (tasks && tasks.length > 0) {
      tasks.forEach(task => {
        if (task.status !== 'completed' && task.deadline) {
          const daysLeft = getDaysUntil(task.deadline);
          if (daysLeft <= 3 && daysLeft >= 0) {
            alerts.push({
              id: `task-${task.id}`,
              type: 'task',
              title: 'Task Due Soon',
              message: `"${task.title}" is due in ${daysLeft === 0 ? 'today' : daysLeft + ' days'}.`,
              link: '/tasks',
              isUrgent: daysLeft === 0,
            });
          } else if (daysLeft < 0) {
            alerts.push({
              id: `task-overdue-${task.id}`,
              type: 'task_overdue',
              title: 'Overdue Task',
              message: `"${task.title}" was due ${Math.abs(daysLeft)} days ago!`,
              link: '/tasks',
              isUrgent: true,
            });
          }
        }
      });
    }

    // Scan Vendors (Balance > 0, Payment Date <= 5 days)
    if (vendors && vendors.length > 0) {
      vendors.forEach(vendor => {
        const balance = (vendor.quotedAmount || 0) - (vendor.advancePaid || 0);
        if (balance > 0 && vendor.nextPaymentDate) {
          const daysLeft = getDaysUntil(vendor.nextPaymentDate);
          if (daysLeft <= 5 && daysLeft >= 0) {
            alerts.push({
              id: `vendor-${vendor.id}`,
              type: 'vendor',
              title: 'Upcoming Payment',
              message: `₹${balance.toLocaleString('en-IN')} is due to ${vendor.name} in ${daysLeft === 0 ? 'today' : daysLeft + ' days'}.`,
              link: '/vendors',
              isUrgent: daysLeft <= 1,
            });
          } else if (daysLeft < 0) {
            alerts.push({
              id: `vendor-overdue-${vendor.id}`,
              type: 'vendor_overdue',
              title: 'Overdue Payment',
              message: `Payment of ₹${balance.toLocaleString('en-IN')} to ${vendor.name} is overdue!`,
              link: '/vendors',
              isUrgent: true,
            });
          }
        }
      });
    }

    // Sort by urgency (urgent first)
    return alerts.sort((a, b) => (a.isUrgent === b.isUrgent ? 0 : a.isUrgent ? -1 : 1));
  }, [tasks, vendors]);

  return { notifications, count: notifications.length };
}
