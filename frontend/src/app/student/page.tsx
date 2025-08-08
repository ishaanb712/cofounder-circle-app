import dynamic from 'next/dynamic';

// Use dynamic import to handle any potential import issues
const StudentLandingPage = dynamic(() => import('@/components/StudentLandingPage'), {
          loading: () => (
          <div className="min-h-screen bg-blue-50 flex items-center justify-center">
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

export default function StudentPage() {
  console.log('Student page is loading...');
  return <StudentLandingPage />;
} 