const ScreenHeader = ({ children }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-700 pb-5 mb-2 mt-2">
      {children}
    </div>
  );
};
export default ScreenHeader;
