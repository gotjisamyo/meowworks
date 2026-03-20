import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return <div className="min-h-screen flex items-center justify-center text-gray-500">กำลังเปิด Dashboard...</div>;
}
