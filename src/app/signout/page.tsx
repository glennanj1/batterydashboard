import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, ArrowLeft } from 'lucide-react';

export default function SignOut() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <LogOut className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Sign Out</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-400 text-center">
            Are you sure you want to sign out of your Tesla account?
          </p>
          
          <div className="space-y-3">
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
              Sign Out
            </Button>
            
            <Link href="/">
              <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
