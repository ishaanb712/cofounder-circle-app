import dynamic from 'next/dynamic';

// Use dynamic import to handle any potential import issues
const VendorLandingPage = dynamic(() => import('@/components/VendorLandingPage'), {
          loading: () => (
          <div className="min-h-screen bg-orange-50 flex items-center justify-center">
            <div className="text-center">
              <img 
                src="/final_logo.svg" 
                alt="CoFounder Circle" 
                className="h-16 w-auto mx-auto mb-4 animate-pulse"
              />
            </div>
          </div>
        ),
  ssr: false // Disable SSR to avoid hydration issues
});

export default function VendorPage() {
  console.log('Vendor page is loading...');
  return <VendorLandingPage />;
} 