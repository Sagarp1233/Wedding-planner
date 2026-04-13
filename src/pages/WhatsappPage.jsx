import { useOutletContext } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import WhatsAppMessageGenerator from '../components/landing/WhatsAppMessageGenerator';

export default function WhatsappPage() {
  const { onMenuClick } = useOutletContext();

  return (
    <>
      <TopBar title="WhatsApp Tool" subtitle="Generate formatting messaging for WhatsApp" onMenuClick={onMenuClick} />
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <WhatsAppMessageGenerator />
      </div>
    </>
  );
}
