import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PartnerProviderContext } from '../features/partner/context/PartnerContext';
import { PartnerSidebar } from '../features/partner/components/layout/PartnerSidebar';
import { PartnerHeader } from '../features/partner/components/layout/PartnerHeader';

export function PartnerLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <PartnerProviderContext>
      <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-sans antialiased text-slate-900">
        
        {/* Desktop Persistent Sidebar */}
        <div className="hidden lg:block shrink-0 h-full">
          <PartnerSidebar />
        </div>

        {/* Mobile Slide-over Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 max-w-xs w-full shadow-2xl z-50">
              <PartnerSidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <PartnerHeader onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

          <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>

      </div>
    </PartnerProviderContext>
  );
}

export default PartnerLayout;
