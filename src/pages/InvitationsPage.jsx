import { useOutletContext } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import InvitationGenerator from '../components/landing/InvitationGenerator';

export default function InvitationsPage() {
  const { onMenuClick } = useOutletContext();

  return (
    <>
      <TopBar title="Invitations" subtitle="Create and download beautiful templates" onMenuClick={onMenuClick} />
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <InvitationGenerator hideUpsell={true} />
      </div>
    </>
  );
}
