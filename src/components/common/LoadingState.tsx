
interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-6"></div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
