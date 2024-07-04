import { auth } from '@/auth';
import ApiTest from '@/components/ApiTest';
import AuthTest from '@/components/AuthTest';

const Home = async () => {
  const session = await auth();

  return (
    <main>
      <ApiTest />
      <AuthTest />
    </main>
  );
};

export default Home;
