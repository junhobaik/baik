import ApiTest from '@/components/ApiTest';
import AuthTest from '@/components/AuthTest';

const TestPage = async () => {
  return (
    <main>
      <ApiTest />
      <AuthTest />
    </main>
  );
};

export default TestPage;
