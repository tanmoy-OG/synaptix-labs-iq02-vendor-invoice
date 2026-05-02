import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { auth, provider } from '@/lib/firebase';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { signInWithPopup } from 'firebase/auth';
// @ts-ignore
import { getDatabase, ref, child, get, set } from "firebase/database";

export function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Login | Synaptix-Labs';
  }, []);
  const db = getDatabase()

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      const user = result.user;
      console.log('Inside Login');
      console.log(user);
      const dbRef = ref(db)
      get(child(dbRef, 'U/' + user.uid)).then((snapshot: any) => {
        if (!snapshot.exists()) {
          set(ref(db, 'U/' + user.uid + '/E'), user.email)
          set(ref(db, 'U/' + user.uid + '/C'), 'B2C')
        }
      });
      toast.success('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/upload');
      }, 1000);
    } catch (error: any) {
      console.error(error?.message);
      toast.error(error?.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 rounded-2xl shadow-xl border bg-card">
        <h1 className="text-3xl font-bold text-primary">Welcome to Synaptix-Labs</h1>
        <p className="mb-8 text-muted-foreground">Sign in to continue to your account</p>
        <Button
          variant="outline"
          className="w-full flex items-center gap-3 py-6 text-lg font-semibold border border-input hover:bg-accent hover:border-primary"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="w-6 h-6" />
          Sign in with Google
        </Button>
        <Toaster position="top-right" />
      </Card>
    </div>
  );
}
