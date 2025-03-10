import { useRouteError } from 'react-router-dom';

const NotFound: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mt-4">页面未找到</p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          返回首页
        </a>
      </div>
    </div>
  );
};

export default NotFound; 